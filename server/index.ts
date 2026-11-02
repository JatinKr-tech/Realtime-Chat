import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Server } from 'socket.io';
import { Pool } from 'pg';
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

const dbPool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://postgres:jatin2007@localhost:5432/chatdb',
});

function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
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
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const httpServer = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const reqUrl = new URL(req.url || '/', 'http://localhost:4000');
    const authHeader = req.headers.authorization || '';

    // 1. Health Check
    if (req.method === 'GET' && reqUrl.pathname === '/api/health') {
      sendJson(res, 200, { ok: true, service: 'pulsechat-postgres-v3' });
      return;
    }

    // -------------------------------------------------------------------------
    // 2. Modular Authentication Endpoints (`/api/auth/*`)
    // -------------------------------------------------------------------------

    if (req.method === 'POST' && reqUrl.pathname === '/api/auth/request-otp') {
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
              : 'http://localhost:5173',
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
        console.error('[PostgreSQL] Failed to list rooms:', err);
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
          roomCode: typeof body.roomCode === 'string' ? body.roomCode : undefined,
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
        console.error('[PostgreSQL] Failed to load notifications:', err);
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
        sendJson(res, 400, {
          ok: false,
          error: {
            code: 'PROFILE_UPDATE_FAILED',
            message:
              err instanceof Error ? err.message : 'Failed to update profile.',
          },
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
        console.error('[PostgreSQL] Failed to load user profile:', err);
        sendJson(res, 500, {
          ok: false,
          error: {
            code: 'DB_ERROR',
            message: 'Could not load user profile from PostgreSQL.',
          },
        });
      }
      return;
    }

    // -------------------------------------------------------------------------
    // 6. Message Endpoints (Strictly <= 40 Messages Loaded at a Time)
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
        console.error('[PostgreSQL] Failed to fetch messages:', err);
        sendJson(res, 500, {
          ok: false,
          error: { code: 'DB_ERROR', message: 'Could not query PostgreSQL.' },
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
        console.error('[PostgreSQL] Failed to insert message:', err);
        sendJson(res, 500, {
          ok: false,
          error: {
            code: 'DB_ERROR',
            message: 'Failed to insert into PostgreSQL.',
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
  cors: { origin: '*' },
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
    await ensureAuthTables(dbPool);
    await ensureMessagesTable(dbPool);
    console.log(
      '✅ Connected to PostgreSQL (chatdb) & verified Global Chat (admin: @jatinpersonalx), rooms, notifications, users, and messages tables'
    );
  } catch (err) {
    console.error(
      '⚠️ Could not connect to PostgreSQL yet. Check that PostgreSQL is running and chatdb exists:',
      err instanceof Error ? err.message : err
    );
  }

  httpServer.listen(4000, () => {
    console.log(
      '🚀 Server + Rooms + Notifications + Socket.IO listening on http://localhost:4000'
    );
  });
}

startServer();