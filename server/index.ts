/**
 * Production-Hardened Node.js + Socket.IO Server Connected to Neon Serverless Postgres
 *
 * Includes Fixes For:
 * 1. Windows / ISP DNS `getaddrinfo ENOTFOUND` drops:
 *    - Forces IPv4-first (`dns.setDefaultResultOrder('ipv4first')`)
 *    - Caches the resolved Neon IPv4 address in memory with Cloudflare/Google DNS (`1.1.1.1`, `8.8.8.8`) fallback
 *    - Wraps `dbPool.query` with automatic retry on transient `ENOTFOUND` / `EAI_AGAIN` / `ECONNRESET` errors
 * 2. Eliminates `pg-connection-string` `sslmode=require` deprecation warning by normalizing to `sslmode=verify-full`
 * 3. Per-IP Sliding-Window Rate Limiter, HTTP Security Headers, Payload Size Cap & CORS Whitelist
 */

import fs from 'fs';
import path from 'path';
import dns from 'dns';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Server } from 'socket.io';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import {
  ChatServer,
  GLOBAL_CHAT_ROOM_ID,
  MAX_PAGE_SIZE,
  UUID_REGEX,
  acceptRoomInvite,
  assignRoomCoAdmin,
  classifyMessage,
  createCustomRoom,
  deleteMessageByOwnerPermanently,
  deleteRoomByAdmin,
  ensureMessagesTable,
  getMessagesByRoomWindowed,
  getNotificationsForUserWindowed,
  insertMessage,
  listRoomsForUser,
  markNotificationsRead,
  registerMessageHandlers,
  updateMessageByOwnerWithinWindow,
} from './messageHandler';
import {
  createOtpChallenge,
  ensureAuthTables,
  getUserBySessionToken,
  getUserPublicProfileWithHistory,
  revokeSessionToken,
  updateUserProfile,
  verifyMagicLinkToken,
  verifyOtpCode,
} from './authHandler';

// Prefer IPv4 on Windows to prevent dual-stack IPv6 getaddrinfo timeouts
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

// ---------------------------------------------------------------------------
// 1. Automatic `.env` Loader (No external `dotenv` package required)
// ---------------------------------------------------------------------------

function loadLocalEnvFile(): void {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx === -1) continue;
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (key && process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  } catch (err) {
    console.warn('[Env] Could not parse .env file:', err);
  }
}

loadLocalEnvFile();

// ---------------------------------------------------------------------------
// 2. Neon Serverless Postgres Connection Pool + Resilient DNS & Auto-Retry
// ---------------------------------------------------------------------------

const RAW_DATABASE_URL = process.env.DATABASE_URL || '';

if (!RAW_DATABASE_URL || RAW_DATABASE_URL.includes('****************')) {
  console.warn(
    '⚠️  [Security Notice] DATABASE_URL is missing or still contains masked asterisks (****************).'
  );
  console.warn(
    '👉 Create a file named `server/.env` and set your real Neon connection string.'
  );
}

const isLocalDatabase =
  !RAW_DATABASE_URL ||
  RAW_DATABASE_URL.includes('localhost') ||
  RAW_DATABASE_URL.includes('127.0.0.1');

// Normalize sslmode=require -> sslmode=verify-full to silence pg v9 security warning
const NORMALIZED_DATABASE_URL = (
  RAW_DATABASE_URL || 'postgresql://postgres:jatin2007@localhost:5432/chatdb'
).replace(/sslmode=require\b/g, 'sslmode=verify-full');

// Resilient DNS Cache & Google (8.8.8.8) / Cloudflare (1.1.1.1) Public Fallback
// Windows getaddrinfo intermittently drops UDP packets for long AWS/Neon hostnames.
// Monkey-patching dns.lookup at the Node engine level intercepts all pg & net.connect sockets.
const originalDnsLookup = dns.lookup.bind(dns);
const dnsCache = new Map<string, string>();
const fallbackResolver = new dns.promises.Resolver();
try {
  fallbackResolver.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4', '1.0.0.1']);
} catch {
  // ignore
}

(dns as unknown as { lookup: typeof dns.lookup }).lookup = function (
  hostname: string,
  options: any,
  callback?: any
) {
  let cb = callback;
  let opts = options;
  if (typeof options === 'function') {
    cb = options;
    opts = {};
  } else if (typeof options === 'number') {
    opts = { family: options };
  } else if (!opts) {
    opts = {};
  }

  // 1. Return from in-memory cache instantly (zero Windows getaddrinfo delay/failures)
  const cachedIp = dnsCache.get(hostname);
  if (cachedIp) {
    if (opts && opts.all) {
      return process.nextTick(() =>
        cb(null, [{ address: cachedIp, family: 4 }])
      );
    }
    return process.nextTick(() => cb(null, cachedIp, 4));
  }

  // 2. Try OS default resolver
  originalDnsLookup(hostname, opts, async (err: any, address: any, family: any) => {
    if (!err && address) {
      if (typeof address === 'string') {
        dnsCache.set(hostname, address);
      }
      return cb(null, address, family);
    }

    // 3. Fallback: If Windows returns ENOTFOUND / EAI_AGAIN, query 8.8.8.8 & 1.1.1.1 directly
    try {
      const ips = await fallbackResolver.resolve4(hostname);
      if (ips && ips.length > 0) {
        const resolvedIp = ips[0];
        dnsCache.set(hostname, resolvedIp);
        if (opts && opts.all) {
          return cb(
            null,
            ips.map((ip) => ({ address: ip, family: 4 }))
          );
        }
        return cb(null, resolvedIp, 4);
      }
    } catch {
      // Fallback failed
    }

    return cb(err, address, family);
  });
} as typeof dns.lookup;

const dbPool = new Pool({
  connectionString: NORMALIZED_DATABASE_URL,
  ssl: isLocalDatabase ? false : { rejectUnauthorized: true },
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 15_000,
  keepAlive: true,
});

// Prevent Neon scale-to-zero idle disconnects from crashing the Node process
dbPool.on('error', (err) => {
  console.warn(
    '[Neon Pool] Idle database client disconnected (normal during Neon auto-suspend):',
    err.message
  );
});

// Wrap dbPool.query with automatic retry for transient network/DNS errors (ENOTFOUND, EAI_AGAIN, ECONNRESET)
const rawPoolQuery = dbPool.query.bind(dbPool);
const TRANSIENT_ERROR_CODES = new Set([
  'ENOTFOUND',
  'EAI_AGAIN',
  'ECONNRESET',
  'ETIMEDOUT',
  'EPIPE',
  '57P01', // admin_shutdown during Neon scale-to-zero
]);

(dbPool as unknown as { query: typeof dbPool.query }).query = (async (
  queryTextOrConfig: unknown,
  values?: unknown
): Promise<QueryResult<QueryResultRow>> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await (rawPoolQuery as (
        q: unknown,
        v?: unknown
      ) => Promise<QueryResult<QueryResultRow>>)(queryTextOrConfig, values);
    } catch (err) {
      lastError = err;
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code?: unknown }).code)
          : '';
      if (attempt < 3 && TRANSIENT_ERROR_CODES.has(code)) {
        await new Promise((r) => setTimeout(r, 350 * attempt));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}) as typeof dbPool.query;

// ---------------------------------------------------------------------------
// 3. Security Configuration: CORS Whitelist, Rate Limiter & Body Size Cap
// ---------------------------------------------------------------------------

const PORT = Number(process.env.PORT) || 4000;
const MAX_BODY_BYTES = 2.5 * 1024 * 1024; // 2.5 MB max payload

const ALLOWED_ORIGINS: string[] = (
  process.env.ALLOWED_ORIGINS ||
  'http://localhost:5173,http://127.0.0.1:5173'
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }
  return false;
}

interface RateBucket {
  count: number;
  resetAt: number;
}
const ipRateBuckets = new Map<string, RateBucket>();

function checkRateLimit(
  ip: string,
  bucketKey: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const key = `${ip}:${bucketKey}`;
  const existing = ipRateBuckets.get(key);
  if (!existing || now > existing.resetAt) {
    ipRateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (existing.count >= maxRequests) {
    return false;
  }
  existing.count += 1;
  return true;
}

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function setSecurityAndCorsHeaders(
  req: IncomingMessage,
  res: ServerResponse
): void {
  const origin = req.headers.origin;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else if (ALLOWED_ORIGINS.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0] || '*');
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }
}

function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let raw = '';
    let byteCount = 0;

    req.on('data', (chunk: Buffer) => {
      byteCount += chunk.length;
      if (byteCount > MAX_BODY_BYTES) {
        req.destroy();
        reject(new Error('PAYLOAD_TOO_LARGE'));
        return;
      }
      raw += chunk.toString('utf8');
    });

    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });

    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

// ---------------------------------------------------------------------------
// 4. HTTP Server & REST API Routes
// ---------------------------------------------------------------------------

const httpServer = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    setSecurityAndCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const clientIp = getClientIp(req);
    if (!checkRateLimit(clientIp, 'global_api', 120, 60_000)) {
      sendJson(res, 429, {
        ok: false,
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many requests. Please wait a moment and try again.',
        },
      });
      return;
    }

    const reqUrl = new URL(req.url || '/', `http://localhost:${PORT}`);
    const authHeader = req.headers.authorization || '';

    // 1. Health Check
    if (req.method === 'GET' && reqUrl.pathname === '/api/health') {
      try {
        await dbPool.query('SELECT 1');
        sendJson(res, 200, {
          ok: true,
          service: 'pulsechat-neon-postgres',
          database: 'connected',
        });
      } catch {
        sendJson(res, 503, {
          ok: false,
          service: 'pulsechat-neon-postgres',
          database: 'disconnected',
        });
      }
      return;
    }

    // -------------------------------------------------------------------------
    // 2. Modular Authentication Endpoints (`/api/auth/*`)
    // -------------------------------------------------------------------------

    if (req.method === 'POST' && reqUrl.pathname === '/api/auth/request-otp') {
      if (!checkRateLimit(clientIp, 'auth_otp', 10, 60_000)) {
        sendJson(res, 429, {
          ok: false,
          error: {
            code: 'AUTH_RATE_LIMITED',
            message: 'Too many OTP requests. Please wait 1 minute.',
          },
        });
        return;
      }

      try {
        const body = await readJsonBody(req);
        const challenge = await createOtpChallenge(dbPool, {
          email: typeof body.email === 'string' ? body.email : '',
          userHandle:
            typeof body.userHandle === 'string' ? body.userHandle : undefined,
          name: typeof body.name === 'string' ? body.name : undefined,
          role: typeof body.role === 'string' ? body.role : undefined,
          clientOrigin:
            typeof body.clientOrigin === 'string'
              ? body.clientOrigin
              : ALLOWED_ORIGINS[0] || 'http://localhost:5173',
        });
        sendJson(res, 200, { ok: true, data: challenge });
      } catch (err) {
        sendJson(res, 400, {
          ok: false,
          error: {
            code: 'OTP_REQUEST_FAILED',
            message:
              err instanceof Error ? err.message : 'Could not send OTP code.',
          },
        });
      }
      return;
    }

    if (req.method === 'POST' && reqUrl.pathname === '/api/auth/verify-otp') {
      if (!checkRateLimit(clientIp, 'auth_verify', 10, 60_000)) {
        sendJson(res, 429, {
          ok: false,
          error: {
            code: 'AUTH_RATE_LIMITED',
            message: 'Too many verification attempts. Please wait 1 minute.',
          },
        });
        return;
      }

      try {
        const body = await readJsonBody(req);
        const verified = await verifyOtpCode(dbPool, {
          email: typeof body.email === 'string' ? body.email : '',
          otpCode: typeof body.otpCode === 'string' ? body.otpCode : '',
          userHandle:
            typeof body.userHandle === 'string' ? body.userHandle : undefined,
          name: typeof body.name === 'string' ? body.name : undefined,
          role: typeof body.role === 'string' ? body.role : undefined,
        });
        sendJson(res, 200, { ok: true, data: verified });
      } catch (err) {
        sendJson(res, 400, {
          ok: false,
          error: {
            code: 'OTP_VERIFY_FAILED',
            message:
              err instanceof Error ? err.message : 'Invalid or expired OTP.',
          },
        });
      }
      return;
    }

    if (
      req.method === 'POST' &&
      reqUrl.pathname === '/api/auth/verify-magic-link'
    ) {
      try {
        const body = await readJsonBody(req);
        const verified = await verifyMagicLinkToken(
          dbPool,
          typeof body.magicToken === 'string' ? body.magicToken : ''
        );
        sendJson(res, 200, { ok: true, data: verified });
      } catch (err) {
        sendJson(res, 400, {
          ok: false,
          error: {
            code: 'MAGIC_LINK_INVALID',
            message:
              err instanceof Error
                ? err.message
                : 'Invalid or expired Magic Link.',
          },
        });
      }
      return;
    }

    if (req.method === 'GET' && reqUrl.pathname === '/api/auth/session') {
      try {
        const user = await getUserBySessionToken(dbPool, authHeader);
        if (!user) {
          sendJson(res, 401, {
            ok: false,
            error: { code: 'UNAUTHORIZED', message: 'Not logged in.' },
          });
          return;
        }
        sendJson(res, 200, { ok: true, data: user });
      } catch {
        sendJson(res, 500, {
          ok: false,
          error: { code: 'AUTH_ERROR', message: 'Session check failed.' },
        });
      }
      return;
    }

    if (req.method === 'POST' && reqUrl.pathname === '/api/auth/logout') {
      try {
        await revokeSessionToken(dbPool, authHeader);
        sendJson(res, 200, { ok: true });
      } catch {
        sendJson(res, 200, { ok: true });
      }
      return;
    }

    // -------------------------------------------------------------------------
    // 3. Rooms, Co-Admin Appointment, Invites & Deletion (`/api/rooms/*`)
    // -------------------------------------------------------------------------

    if (req.method === 'GET' && reqUrl.pathname === '/api/rooms') {
      try {
        const authUser = await getUserBySessionToken(dbPool, authHeader);
        const handle =
          authUser?.userHandle || reqUrl.searchParams.get('userHandle') || '';
        const rooms = await listRoomsForUser(dbPool, handle);
        sendJson(res, 200, { ok: true, data: rooms });
      } catch (err) {
        console.error('[Neon DB] Failed to list rooms:', err);
        sendJson(res, 500, {
          ok: false,
          error: { code: 'DB_ERROR', message: 'Failed to load rooms.' },
        });
      }
      return;
    }

    if (req.method === 'POST' && reqUrl.pathname === '/api/rooms') {
      try {
        const authUser = await getUserBySessionToken(dbPool, authHeader);
        if (!authUser) {
          sendJson(res, 401, {
            ok: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Please log in to create a room.',
            },
          });
          return;
        }

        const body = await readJsonBody(req);
        const created = await createCustomRoom(dbPool, {
          name: typeof body.name === 'string' ? body.name : '',
          roomCode:
            typeof body.roomCode === 'string' ? body.roomCode : undefined,
          topic: typeof body.topic === 'string' ? body.topic : undefined,
          creatorId: authUser.id,
          creatorHandle: authUser.userHandle,
        });

        io.emit('room:updated', created);
        sendJson(res, 201, { ok: true, data: created });
      } catch (err) {
        sendJson(res, 400, {
          ok: false,
          error: {
            code: 'ROOM_CREATE_FAILED',
            message:
              err instanceof Error ? err.message : 'Could not create room.',
          },
        });
      }
      return;
    }

    const coAdminMatch = reqUrl.pathname.match(
      /^\/api\/rooms\/([^/]+)\/co-admin$/
    );
    if (req.method === 'POST' && coAdminMatch) {
      try {
        const authUser = await getUserBySessionToken(dbPool, authHeader);
        if (!authUser) {
          sendJson(res, 401, {
            ok: false,
            error: { code: 'UNAUTHORIZED', message: 'Login required.' },
          });
          return;
        }

        const roomId = decodeURIComponent(coAdminMatch[1]);
        const body = await readJsonBody(req);
        const updatedRoom = await assignRoomCoAdmin(dbPool, {
          roomId,
          requesterHandle: authUser.userHandle,
          targetCoAdminHandle:
            typeof body.coAdminHandle === 'string' ? body.coAdminHandle : '',
        });

        io.emit('room:updated', updatedRoom);
        sendJson(res, 200, { ok: true, data: updatedRoom });
      } catch (err) {
        sendJson(res, 400, {
          ok: false,
          error: {
            code: 'CO_ADMIN_FAILED',
            message:
              err instanceof Error ? err.message : 'Could not assign co-admin.',
          },
        });
      }
      return;
    }

    const joinRoomMatch = reqUrl.pathname.match(/^\/api\/rooms\/([^/]+)\/join$/);
    if (req.method === 'POST' && joinRoomMatch) {
      try {
        const authUser = await getUserBySessionToken(dbPool, authHeader);
        if (!authUser) {
          sendJson(res, 401, {
            ok: false,
            error: { code: 'UNAUTHORIZED', message: 'Login required.' },
          });
          return;
        }

        const roomId = decodeURIComponent(joinRoomMatch[1]);
        const joinedRoom = await acceptRoomInvite(dbPool, {
          roomId,
          userHandle: authUser.userHandle,
        });

        sendJson(res, 200, { ok: true, data: joinedRoom });
      } catch (err) {
        sendJson(res, 400, {
          ok: false,
          error: {
            code: 'JOIN_FAILED',
            message:
              err instanceof Error ? err.message : 'Could not join room.',
          },
        });
      }
      return;
    }

    const roomIdMatch = reqUrl.pathname.match(/^\/api\/rooms\/([^/]+)$/);
    if (req.method === 'DELETE' && roomIdMatch) {
      try {
        const authUser = await getUserBySessionToken(dbPool, authHeader);
        if (!authUser) {
          sendJson(res, 401, {
            ok: false,
            error: { code: 'UNAUTHORIZED', message: 'Login required.' },
          });
          return;
        }

        const roomId = decodeURIComponent(roomIdMatch[1]);
        const deleted = await deleteRoomByAdmin(dbPool, {
          roomId,
          requesterHandle: authUser.userHandle,
        });

        io.emit('room:deleted', deleted);
        sendJson(res, 200, { ok: true, data: deleted });
      } catch (err) {
        sendJson(res, 400, {
          ok: false,
          error: {
            code: 'ROOM_DELETE_FAILED',
            message:
              err instanceof Error ? err.message : 'Could not delete room.',
          },
        });
      }
      return;
    }

    // -------------------------------------------------------------------------
    // 4. Notifications Endpoints (Max 40 Notifications Loaded at a Time)
    // -------------------------------------------------------------------------

    if (req.method === 'GET' && reqUrl.pathname === '/api/notifications') {
      try {
        const authUser = await getUserBySessionToken(dbPool, authHeader);
        const handle =
          authUser?.userHandle || reqUrl.searchParams.get('userHandle') || '';
        if (!handle) {
          sendJson(res, 200, {
            ok: true,
            data: [],
            hasMoreOlder: false,
          });
          return;
        }

        const before = reqUrl.searchParams.get('before') || undefined;
        const result = await getNotificationsForUserWindowed(dbPool, {
          userHandle: handle,
          before,
          limit: MAX_PAGE_SIZE,
        });

        sendJson(res, 200, {
          ok: true,
          data: result.notifications,
          hasMoreOlder: result.hasMoreOlder,
        });
      } catch (err) {
        console.error('[Neon DB] Failed to load notifications:', err);
        sendJson(res, 500, {
          ok: false,
          error: {
            code: 'DB_ERROR',
            message: 'Could not load notifications.',
          },
        });
      }
      return;
    }

    if (req.method === 'POST' && reqUrl.pathname === '/api/notifications/read') {
      try {
        const authUser = await getUserBySessionToken(dbPool, authHeader);
        if (authUser) {
          await markNotificationsRead(dbPool, authUser.userHandle);
        }
        sendJson(res, 200, { ok: true });
      } catch {
        sendJson(res, 200, { ok: true });
      }
      return;
    }

    // -------------------------------------------------------------------------
    // 5. User Profile & Message History Endpoints (`/api/users/*`)
    // -------------------------------------------------------------------------

    if (req.method === 'PUT' && reqUrl.pathname === '/api/users/profile') {
      try {
        const authUser = await getUserBySessionToken(dbPool, authHeader);
        if (!authUser) {
          sendJson(res, 401, {
            ok: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Please log in to update your profile.',
            },
          });
          return;
        }

        const body = await readJsonBody(req);
        const updatedUser = await updateUserProfile(dbPool, authUser.id, {
          userHandle:
            typeof body.userHandle === 'string'
              ? body.userHandle
              : authUser.userHandle,
          name: typeof body.name === 'string' ? body.name : authUser.name,
          role: typeof body.role === 'string' ? body.role : authUser.role,
          avatarUrl:
            typeof body.avatarUrl === 'string'
              ? body.avatarUrl
              : authUser.avatarUrl,
          bio: typeof body.bio === 'string' ? body.bio : authUser.bio,
          isPrivate:
            typeof body.isPrivate === 'boolean'
              ? body.isPrivate
              : authUser.isPrivate,
        });

        sendJson(res, 200, { ok: true, data: updatedUser });
      } catch (err) {
        const msg =
          err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE'
            ? 'Profile photo is too large (max 2 MB).'
            : err instanceof Error
            ? err.message
            : 'Failed to update profile.';
        sendJson(res, 400, {
          ok: false,
          error: { code: 'PROFILE_UPDATE_FAILED', message: msg },
        });
      }
      return;
    }

    const profileMatch = reqUrl.pathname.match(
      /^\/api\/users\/([^/]+)\/profile$/
    );
    if (req.method === 'GET' && profileMatch) {
      try {
        const targetUserId = decodeURIComponent(profileMatch[1]);
        const viewerUser = await getUserBySessionToken(dbPool, authHeader);
        const profile = await getUserPublicProfileWithHistory(
          dbPool,
          targetUserId,
          viewerUser?.id
        );
        if (!profile) {
          sendJson(res, 404, {
            ok: false,
            error: { code: 'USER_NOT_FOUND', message: 'User profile not found.' },
          });
          return;
        }
        sendJson(res, 200, { ok: true, data: profile });
      } catch (err) {
        console.error('[Neon DB] Failed to load user profile:', err);
        sendJson(res, 500, {
          ok: false,
          error: {
            code: 'DB_ERROR',
            message: 'Could not load user profile from Neon Postgres.',
          },
        });
      }
      return;
    }

    // -------------------------------------------------------------------------
    // 6. Message Endpoints (40-Message Smooth Infinite Scroll Batches)
    // -------------------------------------------------------------------------

    if (req.method === 'GET' && reqUrl.pathname === '/api/messages') {
      try {
        const roomId = reqUrl.searchParams.get('roomId') || '';
        if (!UUID_REGEX.test(roomId)) {
          sendJson(res, 400, {
            ok: false,
            error: {
              code: 'INVALID_ROOM',
              message: 'Valid roomId UUID required.',
            },
          });
          return;
        }

        const before = reqUrl.searchParams.get('before') || undefined;
        const after = reqUrl.searchParams.get('after') || undefined;

        const windowed = await getMessagesByRoomWindowed(dbPool, {
          roomId,
          before,
          after,
          limit: MAX_PAGE_SIZE,
        });

        sendJson(res, 200, {
          ok: true,
          data: windowed.messages,
          hasMoreOlder: windowed.hasMoreOlder,
          hasMoreNewer: windowed.hasMoreNewer,
        });
      } catch (err) {
        console.error('[Neon DB] Failed to fetch messages:', err);
        sendJson(res, 500, {
          ok: false,
          error: { code: 'DB_ERROR', message: 'Could not query Neon Postgres.' },
        });
      }
      return;
    }

    if (req.method === 'POST' && reqUrl.pathname === '/api/messages') {
      try {
        const authUser = await getUserBySessionToken(dbPool, authHeader);
        if (!authUser) {
          sendJson(res, 401, {
            ok: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'You must be logged in to send messages.',
            },
          });
          return;
        }

        const body = await readJsonBody(req);
        const roomId = typeof body.roomId === 'string' ? body.roomId : '';
        const content = typeof body.content === 'string' ? body.content : '';
        const clientMessageId =
          typeof body.clientMessageId === 'string'
            ? body.clientMessageId
            : undefined;
        const rawMeta =
          body.metadata &&
          typeof body.metadata === 'object' &&
          !Array.isArray(body.metadata)
            ? (body.metadata as Record<string, unknown>)
            : {};

        if (!UUID_REGEX.test(roomId) || !content.trim()) {
          sendJson(res, 400, {
            ok: false,
            error: {
              code: 'INVALID_PAYLOAD',
              message: 'Valid roomId and content required.',
            },
          });
          return;
        }

        const enrichedMetadata = {
          ...rawMeta,
          senderName: authUser.name,
          senderHandle: authUser.userHandle,
          senderEmail: authUser.email,
          senderRole: authUser.role,
          avatarGradient: authUser.avatarGradient,
          senderAvatarUrl: authUser.avatarUrl,
          senderBio: authUser.bio,
          senderIsPrivate: authUser.isPrivate,
        };

        const classified = classifyMessage(content, enrichedMetadata);
        const { message: savedMessage, createdNotifications } =
          await insertMessage(dbPool, {
            roomId,
            senderId: authUser.id,
            content: classified.sanitizedContent,
            type: classified.type,
            metadata: classified.metadata,
            clientMessageId,
          });

        io.to(roomId).emit('message:new', savedMessage);
        for (const notif of createdNotifications) {
          io.emit('notification:new', notif);
        }

        sendJson(res, 201, {
          ok: true,
          data: savedMessage,
          notifications: createdNotifications,
        });
      } catch (err) {
        console.error('[Neon DB] Failed to insert message:', err);
        sendJson(res, 500, {
          ok: false,
          error: {
            code: 'DB_ERROR',
            message: 'Failed to insert into Neon Postgres.',
          },
        });
      }
      return;
    }

    const msgIdMatch = reqUrl.pathname.match(/^\/api\/messages\/([^/]+)$/);
    if (req.method === 'PUT' && msgIdMatch) {
      try {
        const authUser = await getUserBySessionToken(dbPool, authHeader);
        if (!authUser) {
          sendJson(res, 401, {
            ok: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'You must be logged in to edit your messages.',
            },
          });
          return;
        }

        const messageId = decodeURIComponent(msgIdMatch[1]);
        const body = await readJsonBody(req);
        const newContent = typeof body.content === 'string' ? body.content : '';

        const updatedMessage = await updateMessageByOwnerWithinWindow(dbPool, {
          messageId,
          senderId: authUser.id,
          newContent,
        });

        io.to(updatedMessage.roomId).emit('message:updated', updatedMessage);
        sendJson(res, 200, { ok: true, data: updatedMessage });
      } catch (err) {
        sendJson(res, 400, {
          ok: false,
          error: {
            code: 'EDIT_DENIED',
            message:
              err instanceof Error ? err.message : 'Could not edit message.',
          },
        });
      }
      return;
    }

    if (req.method === 'DELETE' && msgIdMatch) {
      try {
        const authUser = await getUserBySessionToken(dbPool, authHeader);
        if (!authUser) {
          sendJson(res, 401, {
            ok: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'You must be logged in to delete your messages.',
            },
          });
          return;
        }

        const messageId = decodeURIComponent(msgIdMatch[1]);
        const deleted = await deleteMessageByOwnerPermanently(dbPool, {
          messageId,
          senderId: authUser.id,
        });

        io.to(deleted.roomId).emit('message:deleted', deleted);
        sendJson(res, 200, { ok: true, data: deleted });
      } catch (err) {
        sendJson(res, 400, {
          ok: false,
          error: {
            code: 'DELETE_DENIED',
            message:
              err instanceof Error ? err.message : 'Could not delete message.',
          },
        });
      }
      return;
    }
  }
);

const io: ChatServer = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      typeof socket.handshake.auth?.token === 'string'
        ? socket.handshake.auth.token
        : '';
    const user = await getUserBySessionToken(dbPool, token);
    socket.data.userId = user ? user.id : '';
    socket.data.userHandle = user ? user.userHandle : undefined;
  } catch {
    socket.data.userId = '';
  }
  socket.join(GLOBAL_CHAT_ROOM_ID);
  next();
});

io.on('connection', (socket) => {
  registerMessageHandlers(socket, { io, dbPool });
});

async function startServer() {
  try {
    // Proactively pre-resolve the Neon hostname via 8.8.8.8/1.1.1.1 and cache the IP
    if (!isLocalDatabase) {
      try {
        const parsed = new URL(NORMALIZED_DATABASE_URL);
        if (parsed.hostname) {
          const ips = await fallbackResolver.resolve4(parsed.hostname);
          if (ips && ips.length > 0) {
            dnsCache.set(parsed.hostname, ips[0]);
            console.log(
              `📡 [DNS Ready] Pre-resolved Neon host ${parsed.hostname} -> ${ips[0]} via Google/Cloudflare DNS`
            );
          }
        }
      } catch (dnsErr) {
        console.warn('⚠️ [DNS Pre-resolve Notice]:', dnsErr);
      }
    }

    await ensureAuthTables(dbPool);
    await ensureMessagesTable(dbPool);
    console.log(
      `✅ Connected to ${
        isLocalDatabase ? 'Local PostgreSQL' : 'Neon Serverless Postgres (neondb)'
      } & verified all tables!`
    );
  } catch (err) {
    console.error(
      '⚠️ Could not connect to PostgreSQL/Neon yet. Verify DATABASE_URL in server/.env:',
      err instanceof Error ? err.message : err
    );
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(
      `🚀 Secure Server + Socket.IO listening on http://0.0.0.0:${PORT}`
    );
  });
}

function shutdownGracefully(signal: string) {
  console.log(`\n[${signal}] Shutting down server and closing Neon pool...`);
  httpServer.close(() => {
    dbPool.end().finally(() => process.exit(0));
  });
}

process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
process.on('SIGINT', () => shutdownGracefully('SIGINT'));

startServer();