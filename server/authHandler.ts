/**
 * Modular Email OTP, Magic Link & User Profile System (Node.js + TypeScript + PostgreSQL)
 *
 * Capabilities:
 * 1. Strictly unique `@userID` (`userHandle`) — cannot be taken by another user
 * 2. Seeds `jatinpersonalx` as the Global Chat Admin
 * 3. Passwordless 6-Digit Email OTP & Cryptographic Magic Link verification
 * 4. Public vs. Private profile toggle (`isPrivate`) — hides message history from others when private
 * 5. Persistent PostgreSQL user profiles (`name`, `user_handle`, `avatar_url`, `bio`, `role`, `is_private`)
 */

import crypto from 'crypto';
import { Pool } from 'pg';
import { ChatMessage } from './messageHandler';

// ---------------------------------------------------------------------------
// 1. Types & Interfaces
// ---------------------------------------------------------------------------

export const GLOBAL_ADMIN_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
export const GLOBAL_ADMIN_HANDLE = 'jatinpersonalx';

export interface AuthUser {
  id: string;
  userHandle: string; // Strictly unique taggable @userID
  email: string;
  name: string;
  role: string;
  avatarGradient: string;
  avatarUrl: string;
  bio: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface PublicUserProfile {
  id: string;
  userHandle: string;
  name: string;
  role: string;
  avatarGradient: string;
  avatarUrl: string;
  bio: string;
  isPrivate: boolean;
  createdAt: string;
  messages: ChatMessage[];
}

export interface OtpChallengeResponse {
  email: string;
  expiresAt: string;
  devPreview: {
    otpCode: string;
    magicToken: string;
    magicLinkUrl: string;
  };
}

export interface AuthVerifyResult {
  sessionToken: string;
  expiresAt: string;
  user: AuthUser;
}

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ---------------------------------------------------------------------------
// 2. PostgreSQL Schema Auto-Migration (`users`, `auth_otp_challenges`, `auth_sessions`)
// ---------------------------------------------------------------------------

const INIT_AUTH_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_handle VARCHAR(64) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    role VARCHAR(80) NOT NULL DEFAULT 'Verified Member',
    avatar_gradient VARCHAR(120) NOT NULL DEFAULT 'from-indigo-500 to-violet-600',
    avatar_url TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT 'Building real-time apps with React, Socket.IO, and PostgreSQL.',
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  ALTER TABLE users ADD COLUMN IF NOT EXISTS user_handle VARCHAR(64) UNIQUE;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT NOT NULL DEFAULT '';
  ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT NOT NULL DEFAULT 'Building real-time apps with React, Socket.IO, and PostgreSQL.';
  ALTER TABLE users ADD COLUMN IF NOT EXISTS is_private BOOLEAN NOT NULL DEFAULT FALSE;

  CREATE TABLE IF NOT EXISTS auth_otp_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    user_handle VARCHAR(64),
    name VARCHAR(120),
    role VARCHAR(80),
    otp_code VARCHAR(6) NOT NULL,
    magic_token VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    consumed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  ALTER TABLE auth_otp_challenges ADD COLUMN IF NOT EXISTS user_handle VARCHAR(64);

  CREATE INDEX IF NOT EXISTS idx_auth_otp_email
    ON auth_otp_challenges (email, created_at DESC);

  CREATE TABLE IF NOT EXISTS auth_sessions (
    token VARCHAR(64) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

export function sanitizeHandle(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[^a-z0-9_.-]/g, '')
    .slice(0, 32);
}

export async function ensureAuthTables(dbPool: Pool): Promise<void> {
  await dbPool.query(INIT_AUTH_SCHEMA_SQL);

  await dbPool.query(`
    UPDATE users
    SET user_handle = LOWER(REGEXP_REPLACE(SPLIT_PART(email, '@', 1), '[^a-zA-Z0-9_.-]', '', 'g')) || '_' || SUBSTR(id::text, 1, 4)
    WHERE user_handle IS NULL OR user_handle = '';
  `);

  await dbPool.query(
    `INSERT INTO users (id, user_handle, email, name, role, avatar_gradient, bio, is_private)
     VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE)
     ON CONFLICT (id) DO UPDATE SET
       user_handle = COALESCE(users.user_handle, EXCLUDED.user_handle)`,
    [
      GLOBAL_ADMIN_ID,
      GLOBAL_ADMIN_HANDLE,
      'jatinpersonalx@pulsechat.local',
      'jatinpersonalx',
      'Global Chat Admin',
      'from-indigo-500 to-violet-600',
      'Creator & Admin of Global Chat (@000000).',
    ]
  );
}

// ---------------------------------------------------------------------------
// 3. Helper Utilities
// ---------------------------------------------------------------------------

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function defaultNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || 'User';
  return localPart
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function pickGradientForEmail(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

function mapRowToAuthUser(u: Record<string, unknown>): AuthUser {
  const emailStr = String(u.email || '');
  const fallbackHandle =
    sanitizeHandle(String(u.user_handle || '')) ||
    sanitizeHandle(emailStr.split('@')[0] || 'user');
  return {
    id: String(u.id),
    userHandle: fallbackHandle,
    email: emailStr,
    name: String(u.name || fallbackHandle),
    role: String(u.role || 'Verified Member'),
    avatarGradient: String(
      u.avatar_gradient || 'from-indigo-500 to-violet-600'
    ),
    avatarUrl: String(u.avatar_url || ''),
    bio: String(
      u.bio || 'Building real-time apps with React, Socket.IO, and PostgreSQL.'
    ),
    isPrivate: Boolean(u.is_private),
    createdAt:
      u.created_at instanceof Date
        ? u.created_at.toISOString()
        : String(u.created_at || new Date().toISOString()),
  };
}

// ---------------------------------------------------------------------------
// 4. Core Auth & Profile Operations (With Strict @userID Uniqueness)
// ---------------------------------------------------------------------------

export async function createOtpChallenge(
  dbPool: Pool,
  params: {
    email: string;
    userHandle?: string;
    name?: string;
    role?: string;
    clientOrigin?: string;
  }
): Promise<OtpChallengeResponse> {
  const email = normalizeEmail(params.email || '');
  if (!EMAIL_REGEX.test(email)) {
    throw new Error('Please enter a valid email address.');
  }

  const requestedHandle = params.userHandle
    ? sanitizeHandle(params.userHandle)
    : null;

  // Enforce strict @userID uniqueness before sending OTP if a handle was requested
  if (requestedHandle) {
    if (requestedHandle.length < 2) {
      throw new Error('@userID must be at least 2 characters long.');
    }
    const existingOwner = await dbPool.query(
      `SELECT id, email FROM users WHERE LOWER(user_handle) = LOWER($1) LIMIT 1`,
      [requestedHandle]
    );
    if (
      existingOwner.rows.length > 0 &&
      existingOwner.rows[0].email !== email &&
      existingOwner.rows[0].email !== 'jatinpersonalx@pulsechat.local'
    ) {
      throw new Error(
        `@${requestedHandle} is already taken by another user. Please choose a unique @userID.`
      );
    }
  }

  const otpCode = String(crypto.randomInt(100000, 999999));
  const magicToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await dbPool.query(
    `UPDATE auth_otp_challenges SET consumed = TRUE WHERE email = $1 AND consumed = FALSE`,
    [email]
  );

  await dbPool.query(
    `INSERT INTO auth_otp_challenges (email, user_handle, name, role, otp_code, magic_token, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      email,
      requestedHandle,
      params.name?.trim() || null,
      params.role?.trim() || null,
      otpCode,
      magicToken,
      expiresAt.toISOString(),
    ]
  );

  const origin = params.clientOrigin || 'http://localhost:5173';
  const magicLinkUrl = `${origin}/#/auth?magicToken=${magicToken}`;

  console.log('\n============================================================');
  console.log(`📧 [Auth Email Dispatch] To: ${email}`);
  console.log(`🔑 6-Digit OTP Code : ${otpCode}`);
  console.log(`✨ Magic Link URL   : ${magicLinkUrl}`);
  console.log('============================================================\n');

  return {
    email,
    expiresAt: expiresAt.toISOString(),
    devPreview: {
      otpCode,
      magicToken,
      magicLinkUrl,
    },
  };
}

async function resolveUniqueHandle(
  dbPool: Pool,
  explicitHandle: string | null | undefined,
  fallbackBase: string,
  email: string
): Promise<string> {
  const existingUser = await dbPool.query(
    `SELECT user_handle FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );
  if (existingUser.rows.length > 0 && existingUser.rows[0].user_handle) {
    return String(existingUser.rows[0].user_handle);
  }

  if (explicitHandle) {
    const cleanExplicit = sanitizeHandle(explicitHandle);
    if (cleanExplicit === GLOBAL_ADMIN_HANDLE) {
      await dbPool.query(
        `UPDATE users SET email = $1 WHERE id = $2 AND email = 'jatinpersonalx@pulsechat.local'`,
        [email, GLOBAL_ADMIN_ID]
      );
    }
    const taken = await dbPool.query(
      `SELECT email FROM users WHERE LOWER(user_handle) = LOWER($1) LIMIT 1`,
      [cleanExplicit]
    );
    if (taken.rows.length > 0 && taken.rows[0].email !== email) {
      throw new Error(
        `@${cleanExplicit} is already taken by another user. Please choose a unique @userID.`
      );
    }
    if (cleanExplicit.length >= 2) {
      return cleanExplicit;
    }
  }

  const base =
    sanitizeHandle(fallbackBase) ||
    sanitizeHandle(email.split('@')[0]) ||
    'user';

  const taken = await dbPool.query(
    `SELECT email FROM users WHERE LOWER(user_handle) = LOWER($1) LIMIT 1`,
    [base]
  );
  if (taken.rows.length === 0 || taken.rows[0].email === email) {
    return base;
  }

  return `${base}_${crypto.randomInt(1000, 9999)}`;
}

async function upsertUserAndCreateSession(
  dbPool: Pool,
  params: {
    email: string;
    userHandle?: string | null;
    name?: string | null;
    role?: string | null;
  }
): Promise<AuthVerifyResult> {
  const email = normalizeEmail(params.email);
  const uniqueHandle = await resolveUniqueHandle(
    dbPool,
    params.userHandle,
    params.name || email.split('@')[0],
    email
  );
  const fallbackName = params.name?.trim() || defaultNameFromEmail(email);
  const fallbackRole =
    uniqueHandle === GLOBAL_ADMIN_HANDLE
      ? 'Global Chat Admin'
      : params.role?.trim() || 'Verified Member';
  const gradient = pickGradientForEmail(email);

  const userRes = await dbPool.query(
    `INSERT INTO users (user_handle, email, name, role, avatar_gradient)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE SET
       user_handle = COALESCE(users.user_handle, EXCLUDED.user_handle),
       name = COALESCE(NULLIF($3, ''), users.name),
       role = COALESCE(NULLIF($4, ''), users.role)
     RETURNING id, user_handle, email, name, role, avatar_gradient, avatar_url, bio, is_private, created_at`,
    [uniqueHandle, email, fallbackName, fallbackRole, gradient]
  );

  const user = mapRowToAuthUser(userRes.rows[0]);
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await dbPool.query(
    `INSERT INTO auth_sessions (token, user_id, expires_at)
     VALUES ($1, $2, $3)`,
    [sessionToken, user.id, expiresAt.toISOString()]
  );

  return {
    sessionToken,
    expiresAt: expiresAt.toISOString(),
    user,
  };
}

export async function verifyOtpCode(
  dbPool: Pool,
  params: {
    email: string;
    otpCode: string;
    userHandle?: string;
    name?: string;
    role?: string;
  }
): Promise<AuthVerifyResult> {
  const email = normalizeEmail(params.email || '');
  const otpCode = (params.otpCode || '').trim();

  if (!EMAIL_REGEX.test(email) || !/^\d{6}$/.test(otpCode)) {
    throw new Error('Invalid email or 6-digit OTP code.');
  }

  const res = await dbPool.query(
    `SELECT id, email, user_handle, name, role, expires_at
     FROM auth_otp_challenges
     WHERE email = $1
       AND otp_code = $2
       AND consumed = FALSE
       AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT 1`,
    [email, otpCode]
  );

  if (res.rows.length === 0) {
    throw new Error('Invalid or expired OTP code. Please request a new code.');
  }

  const challenge = res.rows[0];
  await dbPool.query(
    `UPDATE auth_otp_challenges SET consumed = TRUE WHERE id = $1`,
    [challenge.id]
  );

  return upsertUserAndCreateSession(dbPool, {
    email,
    userHandle: params.userHandle?.trim() || challenge.user_handle,
    name: params.name?.trim() || challenge.name,
    role: params.role?.trim() || challenge.role,
  });
}

export async function verifyMagicLinkToken(
  dbPool: Pool,
  magicToken: string
): Promise<AuthVerifyResult> {
  const cleanToken = (magicToken || '').trim();
  if (!cleanToken) {
    throw new Error('Missing magic link token.');
  }

  const res = await dbPool.query(
    `SELECT id, email, user_handle, name, role, expires_at
     FROM auth_otp_challenges
     WHERE magic_token = $1
       AND consumed = FALSE
       AND expires_at > NOW()
     LIMIT 1`,
    [cleanToken]
  );

  if (res.rows.length === 0) {
    throw new Error('Magic link is invalid or has already been used.');
  }

  const challenge = res.rows[0];
  await dbPool.query(
    `UPDATE auth_otp_challenges SET consumed = TRUE WHERE id = $1`,
    [challenge.id]
  );

  return upsertUserAndCreateSession(dbPool, {
    email: challenge.email,
    userHandle: challenge.user_handle,
    name: challenge.name,
    role: challenge.role,
  });
}

export async function getUserBySessionToken(
  dbPool: Pool,
  sessionToken?: string | null
): Promise<AuthUser | null> {
  if (!sessionToken || typeof sessionToken !== 'string') {
    return null;
  }

  const clean = sessionToken.replace(/^Bearer\s+/i, '').trim();
  if (!clean) return null;

  const res = await dbPool.query(
    `SELECT
       u.id,
       u.user_handle,
       u.email,
       u.name,
       u.role,
       u.avatar_gradient,
       u.avatar_url,
       u.bio,
       u.is_private,
       u.created_at
     FROM auth_sessions s
     INNER JOIN users u ON u.id = s.user_id
     WHERE s.token = $1
       AND s.expires_at > NOW()
     LIMIT 1`,
    [clean]
  );

  if (res.rows.length === 0) {
    return null;
  }

  return mapRowToAuthUser(res.rows[0]);
}

export async function revokeSessionToken(
  dbPool: Pool,
  sessionToken?: string | null
): Promise<void> {
  if (!sessionToken) return;
  const clean = sessionToken.replace(/^Bearer\s+/i, '').trim();
  if (!clean) return;
  await dbPool.query(`DELETE FROM auth_sessions WHERE token = $1`, [clean]);
}

/**
 * Updates the authenticated user's profile (`name`, `userHandle`, `avatarUrl`, `bio`, `role`, `isPrivate`).
 * Strictly rejects any `@userID` (`userHandle`) that is already owned by another user.
 */
export async function updateUserProfile(
  dbPool: Pool,
  userId: string,
  updates: {
    userHandle?: string;
    name?: string;
    role?: string;
    avatarUrl?: string;
    bio?: string;
    isPrivate?: boolean;
  }
): Promise<AuthUser> {
  const cleanName = updates.name?.trim();
  if (!cleanName || cleanName.length < 2) {
    throw new Error('Profile name must be at least 2 characters.');
  }

  const cleanRole = (updates.role ?? 'Verified Member').trim() || 'Verified Member';
  const cleanAvatarUrl = (updates.avatarUrl ?? '').trim();
  const cleanBio =
    (updates.bio ?? '').trim() ||
    'Building real-time apps with React, Socket.IO, and PostgreSQL.';
  const isPrivate = Boolean(updates.isPrivate);

  let handleClause = '';
  const queryParams: unknown[] = [
    userId,
    cleanName,
    cleanRole,
    cleanAvatarUrl,
    cleanBio,
    isPrivate,
  ];

  if (updates.userHandle) {
    const cleanHandle = sanitizeHandle(updates.userHandle);
    if (cleanHandle.length < 2) {
      throw new Error('@userID must be at least 2 characters long.');
    }
    const conflict = await dbPool.query(
      `SELECT id FROM users WHERE LOWER(user_handle) = LOWER($1) AND id != $2 LIMIT 1`,
      [cleanHandle, userId]
    );
    if (conflict.rows.length > 0) {
      throw new Error(
        `@${cleanHandle} is already taken by another user. Every user must have a unique @userID.`
      );
    }
    handleClause = `, user_handle = $7`;
    queryParams.push(cleanHandle);
  }

  const res = await dbPool.query(
    `UPDATE users
     SET name = $2,
         role = $3,
         avatar_url = $4,
         bio = $5,
         is_private = $6${handleClause}
     WHERE id = $1
     RETURNING id, user_handle, email, name, role, avatar_gradient, avatar_url, bio, is_private, created_at`,
    queryParams
  );

  if (res.rows.length === 0) {
    throw new Error('User record not found.');
  }

  const updatedUser = mapRowToAuthUser(res.rows[0]);

  await dbPool.query(
    `UPDATE messages
     SET metadata = metadata || jsonb_build_object(
       'senderName', $2::text,
       'senderHandle', $3::text,
       'senderRole', $4::text,
       'senderAvatarUrl', $5::text,
       'senderBio', $6::text,
       'senderIsPrivate', $7::boolean
     )
     WHERE sender_id = $1`,
    [
      userId,
      updatedUser.name,
      updatedUser.userHandle,
      updatedUser.role,
      updatedUser.avatarUrl,
      updatedUser.bio,
      updatedUser.isPrivate,
    ]
  );

  return updatedUser;
}

/**
 * Fetches a user's profile.
 * If the user has enabled Private Profile (`is_private = TRUE`), their message history
 * is hidden from everyone except the user themselves (`viewerUserId === u.id`).
 */
export async function getUserPublicProfileWithHistory(
  dbPool: Pool,
  userIdentifier: string,
  viewerUserId?: string | null
): Promise<PublicUserProfile | null> {
  const cleanIdent = userIdentifier.replace(/^@+/, '').trim();
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      cleanIdent
    );

  const userRes = await dbPool.query(
    isUuid
      ? `SELECT id, user_handle, name, role, avatar_gradient, avatar_url, bio, is_private, created_at
         FROM users WHERE id = $1 LIMIT 1`
      : `SELECT id, user_handle, name, role, avatar_gradient, avatar_url, bio, is_private, created_at
         FROM users WHERE LOWER(user_handle) = LOWER($1) OR LOWER(name) = LOWER($1) LIMIT 1`,
    [cleanIdent]
  );

  if (userRes.rows.length === 0) {
    return null;
  }

  const u = userRes.rows[0];
  const resolvedId = String(u.id);
  const isPrivateProfile = Boolean(u.is_private);
  const isOwnerViewing = Boolean(viewerUserId && viewerUserId === resolvedId);

  let messages: ChatMessage[] = [];
  if (!isPrivateProfile || isOwnerViewing) {
    const msgRes = await dbPool.query(
      `SELECT
         id, room_id, sender_id, content, type, metadata, client_message_id, created_at, updated_at
       FROM messages
       WHERE sender_id = $1
       ORDER BY created_at DESC
       LIMIT 40`,
      [resolvedId]
    );

    messages = msgRes.rows.map((row) => ({
      id: row.id,
      roomId: row.room_id,
      senderId: row.sender_id,
      content: row.content,
      type: row.type,
      metadata: row.metadata ?? {},
      clientMessageId: row.client_message_id,
      createdAt:
        row.created_at instanceof Date
          ? row.created_at.toISOString()
          : String(row.created_at),
      updatedAt:
        row.updated_at instanceof Date
          ? row.updated_at.toISOString()
          : row.updated_at
          ? String(row.updated_at)
          : null,
    }));
  }

  return {
    id: resolvedId,
    userHandle: String(u.user_handle || sanitizeHandle(String(u.name))),
    name: String(u.name),
    role: String(u.role || 'Verified Member'),
    avatarGradient: String(
      u.avatar_gradient || 'from-indigo-500 to-violet-600'
    ),
    avatarUrl: String(u.avatar_url || ''),
    bio: String(u.bio || ''),
    isPrivate: isPrivateProfile,
    createdAt:
      u.created_at instanceof Date
        ? u.created_at.toISOString()
        : String(u.created_at),
    messages,
  };
}