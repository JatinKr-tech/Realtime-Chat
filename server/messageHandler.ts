/**
 * Production-Ready Socket.IO Message, Room & Notification Handler (Node.js + TypeScript + PostgreSQL)
 *
 * Capabilities:
 * - Single Default Room: "Global Chat" with `jatinpersonalx` as Admin
 * - Custom Room Creation, Co-Admin Appointment (max 1 other admin), & Admin Room Deletion
 * - In-Chat Invite Command (`invite @userID y`) & Room Join Flow
 * - Windowed Pagination: Strictly <= 40 messages loaded at a time (scroll up / scroll down)
 * - `@userID` Mention Detection & Top-Right Notifications (Strictly <= 40 notifications at a time)
 * - 2-Hour Edit Window Enforcement & Permanent Author-Only Deletion
 */

import { Server, Socket } from 'socket.io';
import { Pool, QueryResult } from 'pg';

// ---------------------------------------------------------------------------
// 1. Forward-Compatible Types & Socket.IO Contracts
// ---------------------------------------------------------------------------

export type MessageType = 'text' | 'link';

export const GLOBAL_CHAT_ROOM_ID = '11111111-2222-4333-8444-555555555555';
export const GLOBAL_CHAT_ROOM_CODE = '000000';
export const GLOBAL_ADMIN_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
export const GLOBAL_ADMIN_HANDLE = 'jatinpersonalx';
/** Strictly never load more than 40 messages or 40 notifications at a time */
export const MAX_PAGE_SIZE = 40;
/** Messages are editable only within 2 hours (7,200,000 ms) of posting */
export const EDIT_WINDOW_MS = 2 * 60 * 60 * 1000;
const MAX_CONTENT_LENGTH = 4096;
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface LinkMetadata {
  url: string;
  hostname: string;
  protocol: 'http:' | 'https:';
  pathname: string;
  unfurl?: {
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
    accentColor?: string;
  };
}

export type MessageMetadata = Record<string, unknown> & Partial<LinkMetadata>;

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: MessageType;
  metadata: MessageMetadata;
  clientMessageId: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface RoomRecord {
  id: string;
  roomCode: string; // Unique @roomID (Only Global Chat has '000000')
  name: string;
  topic: string;
  adminId: string;
  adminHandle: string;
  coAdminId: string | null;
  coAdminHandle: string | null;
  isGlobal: boolean;
  memberStatus?: 'joined' | 'invited' | 'public';
  createdAt: string;
}

export interface UserNotification {
  id: string;
  recipientHandle: string;
  senderId: string;
  senderName: string;
  senderHandle: string;
  roomId: string;
  roomName: string;
  messageId: string | null;
  content: string;
  type: 'mention' | 'room_invite';
  isRead: boolean;
  createdAt: string;
}

export interface SendMessagePayload {
  roomId: string;
  content: string;
  clientMessageId?: string;
  metadata?: Record<string, unknown>;
}

export interface EditMessagePayload {
  messageId: string;
  content: string;
}

export interface DeleteMessagePayload {
  messageId: string;
}

export type AckResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export interface ClientToServerEvents {
  'message:send': (
    payload: SendMessagePayload,
    ack?: (response: AckResponse<ChatMessage>) => void
  ) => Promise<void>;
  'message:edit': (
    payload: EditMessagePayload,
    ack?: (response: AckResponse<ChatMessage>) => void
  ) => Promise<void>;
  'message:delete': (
    payload: DeleteMessagePayload,
    ack?: (
      response: AckResponse<{ messageId: string; roomId: string }>
    ) => void
  ) => Promise<void>;
  'message:history': (
    payload: { roomId: string; before?: string; after?: string },
    ack?: (
      response: AckResponse<{
        messages: ChatMessage[];
        hasMoreOlder: boolean;
        hasMoreNewer: boolean;
      }>
    ) => void
  ) => Promise<void>;
}

export interface ServerToClientEvents {
  'message:new': (message: ChatMessage) => void;
  'message:updated': (message: ChatMessage) => void;
  'message:deleted': (payload: { messageId: string; roomId: string }) => void;
  'notification:new': (notification: UserNotification) => void;
  'room:updated': (room: RoomRecord) => void;
  'room:deleted': (payload: { roomId: string }) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  userId: string;
  userHandle?: string;
  rooms?: Set<string>;
}

export type ChatServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type ChatSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// ---------------------------------------------------------------------------
// 2. URL Classifier & Mention / Invite Command Parsers
// ---------------------------------------------------------------------------

export function parseValidHttpUrl(candidate: string): URL | null {
  const trimmed = candidate.trim();
  if (!trimmed || /\s/.test(trimmed)) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    if (
      !parsed.hostname ||
      (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function extractMentionedHandles(text: string): string[] {
  const matches = text.matchAll(/@([a-zA-Z0-9_.-]{2,32})/g);
  const handles = new Set<string>();
  for (const m of matches) {
    if (m[1]) {
      handles.add(m[1].toLowerCase());
    }
  }
  return Array.from(handles);
}

/**
 * Checks if message content matches the room invite command: `invite @userID y`
 */
export function parseInviteCommand(text: string): string | null {
  const match = text
    .trim()
    .match(/^invite\s+@?([a-zA-Z0-9_.-]{2,32})\s+y$/i);
  return match ? match[1].toLowerCase() : null;
}

export function classifyMessage(
  rawContent: string,
  customMetadata: Record<string, unknown> = {}
): {
  sanitizedContent: string;
  type: MessageType;
  metadata: MessageMetadata;
} {
  const sanitizedContent = rawContent.trim();
  const parsedUrl = parseValidHttpUrl(sanitizedContent);
  const mentions = extractMentionedHandles(sanitizedContent);

  const cleanedCustom = { ...customMetadata };
  delete cleanedCustom.url;
  delete cleanedCustom.hostname;
  delete cleanedCustom.protocol;
  delete cleanedCustom.pathname;
  delete cleanedCustom.unfurl;

  if (mentions.length > 0) {
    cleanedCustom.mentions = mentions;
  } else {
    delete cleanedCustom.mentions;
  }

  if (parsedUrl) {
    const linkMetadata: LinkMetadata = {
      url: parsedUrl.href,
      hostname: parsedUrl.hostname,
      protocol: parsedUrl.protocol as 'http:' | 'https:',
      pathname: parsedUrl.pathname,
      unfurl: {
        title: `${parsedUrl.hostname}${parsedUrl.pathname !== '/' ? parsedUrl.pathname : ''}`,
        description: `Verified ${parsedUrl.protocol.replace(':', '').toUpperCase()} link stored in PostgreSQL with JSONB metadata.`,
        siteName: parsedUrl.hostname,
      },
    };

    return {
      sanitizedContent,
      type: 'link',
      metadata: {
        ...cleanedCustom,
        ...linkMetadata,
      },
    };
  }

  return {
    sanitizedContent,
    type: 'text',
    metadata: { ...cleanedCustom },
  };
}

// ---------------------------------------------------------------------------
// 3. Database Schema & Persistence Layer (Messages, Rooms, Invites, Notifications)
// ---------------------------------------------------------------------------

interface MessageRow {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  type: MessageType;
  metadata: MessageMetadata;
  client_message_id: string | null;
  created_at: Date;
  updated_at?: Date | null;
}

const INIT_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code VARCHAR(32) UNIQUE,
    name VARCHAR(80) NOT NULL,
    topic TEXT NOT NULL DEFAULT '',
    admin_id UUID NOT NULL,
    admin_handle VARCHAR(64) NOT NULL,
    co_admin_id UUID,
    co_admin_handle VARCHAR(64),
    is_global BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  ALTER TABLE rooms ADD COLUMN IF NOT EXISTS room_code VARCHAR(32) UNIQUE;

  CREATE TABLE IF NOT EXISTS room_members (
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_handle VARCHAR(64) NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'joined',
    invited_by VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (room_id, user_handle)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(32) NOT NULL DEFAULT 'text',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    client_message_id VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    CONSTRAINT uq_client_message UNIQUE (sender_id, client_message_id)
  );

  ALTER TABLE messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

  CREATE INDEX IF NOT EXISTS idx_messages_room_created
    ON messages (room_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_messages_sender_created
    ON messages (sender_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_messages_metadata_gin
    ON messages USING GIN (metadata);

  CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_handle VARCHAR(64) NOT NULL,
    sender_id UUID NOT NULL,
    sender_name VARCHAR(120) NOT NULL,
    sender_handle VARCHAR(64) NOT NULL,
    room_id UUID NOT NULL,
    room_name VARCHAR(80) NOT NULL,
    message_id UUID,
    content TEXT NOT NULL,
    type VARCHAR(32) NOT NULL DEFAULT 'mention',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_notifications_recipient_created
    ON notifications (LOWER(recipient_handle), created_at DESC);
`;

export async function ensureMessagesTable(dbPool: Pool): Promise<void> {
  await dbPool.query(INIT_SCHEMA_SQL);

  // Remove old placeholder rooms & any non-Global seed rooms from previous versions
  await dbPool.query(
    `DELETE FROM rooms WHERE id IN ('22222222-3333-4444-8555-666666666666', '33333333-4444-4555-8666-777777777777')`
  );
  await dbPool.query(
    `DELETE FROM messages WHERE room_id IN ('22222222-3333-4444-8555-666666666666', '33333333-4444-4555-8666-777777777777')`
  );

  // Ensure the single default room "Global Chat" has @000000 and `jatinpersonalx` as Admin
  await dbPool.query(
    `INSERT INTO rooms (id, room_code, name, topic, admin_id, admin_handle, is_global)
     VALUES ($1, '000000', 'Global Chat', 'Official Global Chat • Admin: @jatinpersonalx', $2, $3, TRUE)
     ON CONFLICT (id) DO UPDATE SET
       room_code = '000000',
       name = 'Global Chat',
       admin_handle = 'jatinpersonalx',
       is_global = TRUE`,
    [GLOBAL_CHAT_ROOM_ID, GLOBAL_ADMIN_ID, GLOBAL_ADMIN_HANDLE]
  );

  // Backfill any custom rooms that lack a unique room_code (never '000000')
  await dbPool.query(`
    UPDATE rooms
    SET room_code = SUBSTR(REPLACE(id::text, '-', ''), 1, 6)
    WHERE (room_code IS NULL OR room_code = '') AND is_global = FALSE;
  `);
}

function mapRowToChatMessage(row: MessageRow): ChatMessage {
  return {
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
  };
}

// ---------------------------------------------------------------------------
// 4. Windowed Message Loading (Strictly <= 40 Messages at a Time)
// ---------------------------------------------------------------------------

export async function getMessagesByRoomWindowed(
  dbPool: Pool,
  params: {
    roomId: string;
    before?: string;
    after?: string;
    limit?: number;
  }
): Promise<{
  messages: ChatMessage[];
  hasMoreOlder: boolean;
  hasMoreNewer: boolean;
}> {
  const safeLimit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, params.limit || MAX_PAGE_SIZE)
  );

  // Case 1: Scrolling UP -> Load older messages before cursor
  if (params.before) {
    const res: QueryResult<MessageRow> = await dbPool.query(
      `SELECT id, room_id, sender_id, content, type, metadata, client_message_id, created_at, updated_at
       FROM messages
       WHERE room_id = $1 AND created_at < $2::timestamptz
       ORDER BY created_at DESC
       LIMIT $3`,
      [params.roomId, params.before, safeLimit + 1]
    );
    const hasMoreOlder = res.rows.length > safeLimit;
    const slice = res.rows.slice(0, safeLimit).reverse();
    return {
      messages: slice.map(mapRowToChatMessage),
      hasMoreOlder,
      hasMoreNewer: true,
    };
  }

  // Case 2: Scrolling DOWN -> Load newer messages after cursor
  if (params.after) {
    const res: QueryResult<MessageRow> = await dbPool.query(
      `SELECT id, room_id, sender_id, content, type, metadata, client_message_id, created_at, updated_at
       FROM messages
       WHERE room_id = $1 AND created_at > $2::timestamptz
       ORDER BY created_at ASC
       LIMIT $3`,
      [params.roomId, params.after, safeLimit + 1]
    );
    const hasMoreNewer = res.rows.length > safeLimit;
    const slice = res.rows.slice(0, safeLimit);
    return {
      messages: slice.map(mapRowToChatMessage),
      hasMoreOlder: true,
      hasMoreNewer,
    };
  }

  // Case 3: Initial / Latest Window -> Load latest 40 messages
  const res: QueryResult<MessageRow> = await dbPool.query(
    `SELECT id, room_id, sender_id, content, type, metadata, client_message_id, created_at, updated_at
     FROM messages
     WHERE room_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [params.roomId, safeLimit + 1]
  );

  const hasMoreOlder = res.rows.length > safeLimit;
  const slice = res.rows.slice(0, safeLimit).reverse();
  return {
    messages: slice.map(mapRowToChatMessage),
    hasMoreOlder,
    hasMoreNewer: false,
  };
}

export async function getMessagesByRoom(
  dbPool: Pool,
  roomId: string
): Promise<ChatMessage[]> {
  const windowed = await getMessagesByRoomWindowed(dbPool, {
    roomId,
    limit: MAX_PAGE_SIZE,
  });
  return windowed.messages;
}

// ---------------------------------------------------------------------------
// 5. Room Management, Co-Admin Appointment, Invites & Notifications
// ---------------------------------------------------------------------------

function mapRowToRoom(
  r: Record<string, unknown>,
  memberStatus: 'joined' | 'invited' | 'public' = 'joined'
): RoomRecord {
  const isGlobal = Boolean(r.is_global);
  return {
    id: String(r.id),
    roomCode: isGlobal
      ? '000000'
      : String(r.room_code || String(r.id).replace(/-/g, '').slice(0, 6)),
    name: String(r.name),
    topic: String(r.topic || ''),
    adminId: String(r.admin_id),
    adminHandle: String(r.admin_handle),
    coAdminId: r.co_admin_id ? String(r.co_admin_id) : null,
    coAdminHandle: r.co_admin_handle ? String(r.co_admin_handle) : null,
    isGlobal: Boolean(r.is_global),
    memberStatus,
    createdAt:
      r.created_at instanceof Date
        ? r.created_at.toISOString()
        : String(r.created_at || new Date().toISOString()),
  };
}

/**
 * Lists rooms visible to a user:
 * - Always includes "Global Chat"
 * - Includes any room where the user is admin, co-admin, joined member, or invited
 */
export async function listRoomsForUser(
  dbPool: Pool,
  userHandle?: string | null
): Promise<RoomRecord[]> {
  const cleanHandle = (userHandle || '').trim().toLowerCase();

  if (!cleanHandle) {
    const res = await dbPool.query(
      `SELECT * FROM rooms WHERE is_global = TRUE ORDER BY created_at ASC`
    );
    return res.rows.map((r) => mapRowToRoom(r, 'public'));
  }

  const res = await dbPool.query(
    `SELECT
       r.*,
       rm.status AS member_status
     FROM rooms r
     LEFT JOIN room_members rm
       ON rm.room_id = r.id AND LOWER(rm.user_handle) = LOWER($1)
     WHERE r.is_global = TRUE
        OR LOWER(r.admin_handle) = LOWER($1)
        OR LOWER(COALESCE(r.co_admin_handle, '')) = LOWER($1)
        OR rm.user_handle IS NOT NULL
     ORDER BY r.is_global DESC, r.created_at ASC`,
    [cleanHandle]
  );

  return res.rows.map((r) => {
    const status: 'joined' | 'invited' | 'public' = r.is_global
      ? 'public'
      : LOWER(String(r.admin_handle)) === cleanHandle ||
        LOWER(String(r.co_admin_handle || '')) === cleanHandle
      ? 'joined'
      : r.member_status === 'invited'
      ? 'invited'
      : 'joined';
    return mapRowToRoom(r, status);
  });
}

function LOWER(s: string): string {
  return s.toLowerCase();
}

export async function createCustomRoom(
  dbPool: Pool,
  params: {
    name: string;
    roomCode?: string;
    topic?: string;
    creatorId: string;
    creatorHandle: string;
  }
): Promise<RoomRecord> {
  const cleanName = params.name.trim();
  if (cleanName.length < 2 || cleanName.length > 60) {
    throw new Error('Room name must be between 2 and 60 characters.');
  }

  let roomCode = (params.roomCode || '')
    .trim()
    .replace(/^@+/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 16);

  if (roomCode === '000000') {
    throw new Error('@000000 is reserved exclusively for Global Chat.');
  }

  if (roomCode) {
    const existing = await dbPool.query(
      `SELECT id FROM rooms WHERE LOWER(room_code) = LOWER($1) LIMIT 1`,
      [roomCode]
    );
    if (existing.rows.length > 0) {
      throw new Error(`Room ID @${roomCode} is already taken. Choose another ID.`);
    }
  } else {
    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate = String(Math.floor(100000 + Math.random() * 900000));
      const check = await dbPool.query(
        `SELECT id FROM rooms WHERE room_code = $1 LIMIT 1`,
        [candidate]
      );
      if (check.rows.length === 0) {
        roomCode = candidate;
        break;
      }
    }
    if (!roomCode) {
      roomCode = String(Date.now()).slice(-6);
    }
  }

  const cleanTopic =
    params.topic?.trim() ||
    `Created by @${params.creatorHandle} • Invite members with: invite @userID y`;

  const res = await dbPool.query(
    `INSERT INTO rooms (room_code, name, topic, admin_id, admin_handle, is_global)
     VALUES ($1, $2, $3, $4, $5, FALSE)
     RETURNING *`,
    [
      roomCode,
      cleanName,
      cleanTopic,
      params.creatorId,
      params.creatorHandle.toLowerCase(),
    ]
  );

  const room = mapRowToRoom(res.rows[0], 'joined');

  await dbPool.query(
    `INSERT INTO room_members (room_id, user_handle, status, invited_by)
     VALUES ($1, $2, 'joined', $2)
     ON CONFLICT (room_id, user_handle) DO UPDATE SET status = 'joined'`,
    [room.id, params.creatorHandle.toLowerCase()]
  );

  return room;
}

/**
 * Allows the room's primary admin to appoint 1 other admin (co-admin).
 */
export async function assignRoomCoAdmin(
  dbPool: Pool,
  params: {
    roomId: string;
    requesterHandle: string;
    targetCoAdminHandle: string;
  }
): Promise<RoomRecord> {
  const roomRes = await dbPool.query(
    `SELECT * FROM rooms WHERE id = $1 LIMIT 1`,
    [params.roomId]
  );
  if (roomRes.rows.length === 0) {
    throw new Error('Room not found.');
  }

  const room = roomRes.rows[0];
  if (
    String(room.admin_handle).toLowerCase() !==
    params.requesterHandle.toLowerCase()
  ) {
    throw new Error('Only the primary room admin can appoint the co-admin.');
  }

  const cleanTarget = params.targetCoAdminHandle
    .trim()
    .toLowerCase()
    .replace(/^@+/, '');
  if (!cleanTarget) {
    throw new Error('Please provide a valid @userID to make admin.');
  }

  const userLookup = await dbPool.query(
    `SELECT id, user_handle FROM users WHERE LOWER(user_handle) = LOWER($1) LIMIT 1`,
    [cleanTarget]
  );
  const coAdminId = userLookup.rows.length > 0 ? userLookup.rows[0].id : null;

  const updated = await dbPool.query(
    `UPDATE rooms
     SET co_admin_id = $2,
         co_admin_handle = $3
     WHERE id = $1
     RETURNING *`,
    [params.roomId, coAdminId, cleanTarget]
  );

  // Also ensure the co-admin is a joined member of the room
  await dbPool.query(
    `INSERT INTO room_members (room_id, user_handle, status, invited_by)
     VALUES ($1, $2, 'joined', $3)
     ON CONFLICT (room_id, user_handle) DO UPDATE SET status = 'joined'`,
    [params.roomId, cleanTarget, params.requesterHandle.toLowerCase()]
  );

  return mapRowToRoom(updated.rows[0], 'joined');
}

/**
 * Allows a room admin (primary admin or co-admin) to delete the room.
 */
export async function deleteRoomByAdmin(
  dbPool: Pool,
  params: {
    roomId: string;
    requesterHandle: string;
  }
): Promise<{ roomId: string }> {
  const roomRes = await dbPool.query(
    `SELECT * FROM rooms WHERE id = $1 LIMIT 1`,
    [params.roomId]
  );
  if (roomRes.rows.length === 0) {
    throw new Error('Room not found.');
  }

  const room = roomRes.rows[0];
  const reqHandle = params.requesterHandle.toLowerCase();
  const isAdmin =
    String(room.admin_handle).toLowerCase() === reqHandle ||
    String(room.co_admin_handle || '').toLowerCase() === reqHandle;

  if (!isAdmin) {
    throw new Error('Only a room admin can delete this room.');
  }

  if (room.is_global) {
    throw new Error(
      'Global Chat is the primary default room and cannot be deleted.'
    );
  }

  await dbPool.query(`DELETE FROM messages WHERE room_id = $1`, [params.roomId]);
  await dbPool.query(`DELETE FROM rooms WHERE id = $1`, [params.roomId]);

  return { roomId: params.roomId };
}

/**
 * Invites `@userID` to a room (triggered by `invite @userID y` or the invite endpoint)
 * and creates a notification for `@userID`.
 */
export async function inviteUserToRoom(
  dbPool: Pool,
  params: {
    roomId: string;
    inviterId: string;
    inviterName: string;
    inviterHandle: string;
    targetHandle: string;
  }
): Promise<{ room: RoomRecord; notification: UserNotification }> {
  const cleanTarget = params.targetHandle
    .trim()
    .toLowerCase()
    .replace(/^@+/, '');
  const roomRes = await dbPool.query(
    `SELECT * FROM rooms WHERE id = $1 LIMIT 1`,
    [params.roomId]
  );
  if (roomRes.rows.length === 0) {
    throw new Error('Room not found.');
  }

  const room = mapRowToRoom(roomRes.rows[0], 'joined');

  await dbPool.query(
    `INSERT INTO room_members (room_id, user_handle, status, invited_by)
     VALUES ($1, $2, 'invited', $3)
     ON CONFLICT (room_id, user_handle) DO NOTHING`,
    [params.roomId, cleanTarget, params.inviterHandle.toLowerCase()]
  );

  const notifRes = await dbPool.query(
    `INSERT INTO notifications (
       recipient_handle, sender_id, sender_name, sender_handle, room_id, room_name, content, type
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'room_invite')
     RETURNING *`,
    [
      cleanTarget,
      params.inviterId,
      params.inviterName,
      params.inviterHandle.toLowerCase(),
      room.id,
      room.name,
      `@${params.inviterHandle} invited you to join #${room.name}`,
    ]
  );

  return {
    room,
    notification: mapRowToNotification(notifRes.rows[0]),
  };
}

export async function acceptRoomInvite(
  dbPool: Pool,
  params: {
    roomId: string;
    userHandle: string;
  }
): Promise<RoomRecord> {
  const cleanHandle = params.userHandle.trim().toLowerCase().replace(/^@+/, '');
  await dbPool.query(
    `INSERT INTO room_members (room_id, user_handle, status)
     VALUES ($1, $2, 'joined')
     ON CONFLICT (room_id, user_handle) DO UPDATE SET status = 'joined'`,
    [params.roomId, cleanHandle]
  );

  const roomRes = await dbPool.query(
    `SELECT * FROM rooms WHERE id = $1 LIMIT 1`,
    [params.roomId]
  );
  if (roomRes.rows.length === 0) {
    throw new Error('Room not found.');
  }
  return mapRowToRoom(roomRes.rows[0], 'joined');
}

function mapRowToNotification(row: Record<string, unknown>): UserNotification {
  return {
    id: String(row.id),
    recipientHandle: String(row.recipient_handle),
    senderId: String(row.sender_id),
    senderName: String(row.sender_name),
    senderHandle: String(row.sender_handle),
    roomId: String(row.room_id),
    roomName: String(row.room_name),
    messageId: row.message_id ? String(row.message_id) : null,
    content: String(row.content),
    type:
      row.type === 'room_invite' ? 'room_invite' : 'mention',
    isRead: Boolean(row.is_read),
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
  };
}

/**
 * Fetches notifications for `@userID` strictly capped at <= 40 notifications at a time.
 */
export async function getNotificationsForUserWindowed(
  dbPool: Pool,
  params: {
    userHandle: string;
    before?: string;
    limit?: number;
  }
): Promise<{
  notifications: UserNotification[];
  hasMoreOlder: boolean;
}> {
  const cleanHandle = params.userHandle.trim().toLowerCase().replace(/^@+/, '');
  const safeLimit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, params.limit || MAX_PAGE_SIZE)
  );

  const res = params.before
    ? await dbPool.query(
        `SELECT * FROM notifications
         WHERE LOWER(recipient_handle) = LOWER($1)
           AND created_at < $2::timestamptz
         ORDER BY created_at DESC
         LIMIT $3`,
        [cleanHandle, params.before, safeLimit + 1]
      )
    : await dbPool.query(
        `SELECT * FROM notifications
         WHERE LOWER(recipient_handle) = LOWER($1)
         ORDER BY created_at DESC
         LIMIT $2`,
        [cleanHandle, safeLimit + 1]
      );

  const hasMoreOlder = res.rows.length > safeLimit;
  const slice = res.rows.slice(0, safeLimit);
  return {
    notifications: slice.map(mapRowToNotification),
    hasMoreOlder,
  };
}

export async function markNotificationsRead(
  dbPool: Pool,
  userHandle: string
): Promise<void> {
  const cleanHandle = userHandle.trim().toLowerCase().replace(/^@+/, '');
  await dbPool.query(
    `UPDATE notifications SET is_read = TRUE WHERE LOWER(recipient_handle) = LOWER($1)`,
    [cleanHandle]
  );
}

// ---------------------------------------------------------------------------
// 6. Message Insertion (with `@userID` Mention Notifications & `invite @userID y`)
// ---------------------------------------------------------------------------

const INSERT_MESSAGE_SQL = `
  INSERT INTO messages (
    room_id,
    sender_id,
    content,
    type,
    metadata,
    client_message_id
  )
  VALUES ($1, $2, $3, $4, $5::jsonb, $6)
  ON CONFLICT (sender_id, client_message_id)
  DO UPDATE SET content = EXCLUDED.content
  RETURNING
    id,
    room_id,
    sender_id,
    content,
    type,
    metadata,
    client_message_id,
    created_at,
    updated_at;
`;

export async function insertMessage(
  dbPool: Pool,
  params: {
    roomId: string;
    senderId: string;
    content: string;
    type: MessageType;
    metadata: MessageMetadata;
    clientMessageId?: string;
  }
): Promise<{
  message: ChatMessage;
  createdNotifications: UserNotification[];
}> {
  const senderHandle =
    typeof params.metadata?.senderHandle === 'string'
      ? params.metadata.senderHandle.toLowerCase()
      : 'user';
  const senderName =
    typeof params.metadata?.senderName === 'string'
      ? params.metadata.senderName
      : senderHandle;

  const roomRes = await dbPool.query(
    `SELECT id, name FROM rooms WHERE id = $1 LIMIT 1`,
    [params.roomId]
  );
  const roomName =
    roomRes.rows.length > 0 ? String(roomRes.rows[0].name) : 'Global Chat';

  const createdNotifications: UserNotification[] = [];

  // Check if the message is the room invite command: `invite @userID y`
  const inviteTargetHandle = parseInviteCommand(params.content);
  if (inviteTargetHandle) {
    const inviteRes = await inviteUserToRoom(dbPool, {
      roomId: params.roomId,
      inviterId: params.senderId,
      inviterName: senderName,
      inviterHandle: senderHandle,
      targetHandle: inviteTargetHandle,
    });
    createdNotifications.push(inviteRes.notification);
  }

  const values = [
    params.roomId,
    params.senderId,
    params.content,
    params.type,
    JSON.stringify(params.metadata ?? {}),
    params.clientMessageId ?? null,
  ];

  const result: QueryResult<MessageRow> = await dbPool.query(
    INSERT_MESSAGE_SQL,
    values
  );
  const savedMessage = mapRowToChatMessage(result.rows[0]);

  // Create notifications for every `@userID` tagged in the message
  const mentionedHandles = extractMentionedHandles(params.content);
  for (const handle of mentionedHandles) {
    if (handle === inviteTargetHandle) continue; // Already sent room_invite notification
    const notifRes = await dbPool.query(
      `INSERT INTO notifications (
         recipient_handle, sender_id, sender_name, sender_handle, room_id, room_name, message_id, content, type
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'mention')
       RETURNING *`,
      [
        handle,
        params.senderId,
        senderName,
        senderHandle,
        params.roomId,
        roomName,
        savedMessage.id,
        savedMessage.content,
      ]
    );
    createdNotifications.push(mapRowToNotification(notifRes.rows[0]));
  }

  return { message: savedMessage, createdNotifications };
}

export async function updateMessageByOwnerWithinWindow(
  dbPool: Pool,
  params: {
    messageId: string;
    senderId: string;
    newContent: string;
  }
): Promise<ChatMessage> {
  const trimmed = (params.newContent || '').trim();
  if (!trimmed) {
    throw new Error('Message content cannot be empty.');
  }
  if (trimmed.length > MAX_CONTENT_LENGTH) {
    throw new Error(
      `Message exceeds maximum length of ${MAX_CONTENT_LENGTH} characters.`
    );
  }

  const existingRes: QueryResult<MessageRow> = await dbPool.query(
    `SELECT id, room_id, sender_id, content, type, metadata, client_message_id, created_at
     FROM messages
     WHERE id = $1
     LIMIT 1`,
    [params.messageId]
  );

  if (existingRes.rows.length === 0) {
    throw new Error('Message not found.');
  }

  const existing = existingRes.rows[0];
  if (existing.sender_id !== params.senderId) {
    throw new Error('You can only edit messages that you posted.');
  }

  const createdMs =
    existing.created_at instanceof Date
      ? existing.created_at.getTime()
      : new Date(String(existing.created_at)).getTime();
  const ageMs = Date.now() - createdMs;

  if (ageMs > EDIT_WINDOW_MS) {
    throw new Error(
      'Edit window expired: Messages can only be edited within 2 hours of posting.'
    );
  }

  const nowIso = new Date().toISOString();
  const classified = classifyMessage(trimmed, {
    ...(existing.metadata || {}),
    edited: true,
    editedAt: nowIso,
  });

  const updateRes: QueryResult<MessageRow> = await dbPool.query(
    `UPDATE messages
     SET content = $2,
         type = $3,
         metadata = $4::jsonb,
         updated_at = NOW()
     WHERE id = $1 AND sender_id = $5
     RETURNING id, room_id, sender_id, content, type, metadata, client_message_id, created_at, updated_at`,
    [
      params.messageId,
      classified.sanitizedContent,
      classified.type,
      JSON.stringify(classified.metadata),
      params.senderId,
    ]
  );

  return mapRowToChatMessage(updateRes.rows[0]);
}

export async function deleteMessageByOwnerPermanently(
  dbPool: Pool,
  params: {
    messageId: string;
    senderId: string;
  }
): Promise<{ messageId: string; roomId: string }> {
  const existingRes = await dbPool.query(
    `SELECT id, room_id, sender_id FROM messages WHERE id = $1 LIMIT 1`,
    [params.messageId]
  );

  if (existingRes.rows.length === 0) {
    throw new Error('Message not found.');
  }

  if (existingRes.rows[0].sender_id !== params.senderId) {
    throw new Error('You can only delete messages that you posted.');
  }

  const delRes = await dbPool.query(
    `DELETE FROM messages WHERE id = $1 AND sender_id = $2 RETURNING id, room_id`,
    [params.messageId, params.senderId]
  );

  return {
    messageId: String(delRes.rows[0].id),
    roomId: String(delRes.rows[0].room_id),
  };
}

// ---------------------------------------------------------------------------
// 7. Socket.IO Event Registration
// ---------------------------------------------------------------------------

export interface MessageHandlerDependencies {
  io: ChatServer;
  dbPool: Pool;
  logger?: Pick<Console, 'info' | 'warn' | 'error'>;
}

export function registerMessageHandlers(
  socket: ChatSocket,
  { io, dbPool, logger = console }: MessageHandlerDependencies
): void {
  socket.on('message:history', async (payload, ack) => {
    try {
      const roomId = payload?.roomId;
      if (!roomId || !UUID_REGEX.test(roomId)) {
        if (typeof ack === 'function') {
          ack({
            ok: false,
            error: { code: 'INVALID_ROOM', message: 'Valid roomId UUID required.' },
          });
        }
        return;
      }

      const windowed = await getMessagesByRoomWindowed(dbPool, {
        roomId,
        before: payload.before,
        after: payload.after,
        limit: MAX_PAGE_SIZE,
      });
      if (typeof ack === 'function') {
        ack({ ok: true, data: windowed });
      }
    } catch (err) {
      logger.error('[Socket.IO] Failed to load message:history', err);
      if (typeof ack === 'function') {
        ack({
          ok: false,
          error: { code: 'DB_ERROR', message: 'Failed to load messages.' },
        });
      }
    }
  });

  socket.on('message:send', async (payload, ack) => {
    const respondError = (code: string, message: string) => {
      if (typeof ack === 'function') {
        ack({ ok: false, error: { code, message } });
      }
    };

    try {
      const senderId = socket.data.userId;
      if (!senderId || !UUID_REGEX.test(senderId)) {
        return respondError('UNAUTHORIZED', 'Socket session is not authenticated.');
      }

      if (!payload || typeof payload !== 'object') {
        return respondError('INVALID_PAYLOAD', 'Message payload must be an object.');
      }

      const { roomId, content, clientMessageId, metadata } = payload;

      if (!roomId || !UUID_REGEX.test(roomId)) {
        return respondError('INVALID_ROOM', 'A valid roomId UUID is required.');
      }

      if (typeof content !== 'string' || content.trim().length === 0) {
        return respondError('EMPTY_MESSAGE', 'Message content cannot be empty.');
      }

      if (content.length > MAX_CONTENT_LENGTH) {
        return respondError(
          'MESSAGE_TOO_LONG',
          `Message exceeds maximum length of ${MAX_CONTENT_LENGTH} characters.`
        );
      }

      const classified = classifyMessage(content, metadata);

      const { message: savedMessage, createdNotifications } =
        await insertMessage(dbPool, {
          roomId,
          senderId,
          content: classified.sanitizedContent,
          type: classified.type,
          metadata: classified.metadata,
          clientMessageId,
        });

      io.to(roomId).emit('message:new', savedMessage);
      for (const notif of createdNotifications) {
        io.emit('notification:new', notif);
      }

      if (typeof ack === 'function') {
        ack({ ok: true, data: savedMessage });
      }
    } catch (err) {
      logger.error('[Socket.IO] Failed to process message:send', {
        socketId: socket.id,
        userId: socket.data.userId,
        error: err instanceof Error ? err.message : String(err),
      });

      respondError(
        'INTERNAL_SERVER_ERROR',
        'Could not save message. Please try again.'
      );
    }
  });

  socket.on('message:edit', async (payload, ack) => {
    try {
      const senderId = socket.data.userId;
      if (!senderId || !UUID_REGEX.test(senderId)) {
        if (typeof ack === 'function') {
          ack({
            ok: false,
            error: { code: 'UNAUTHORIZED', message: 'Login required.' },
          });
        }
        return;
      }

      const updated = await updateMessageByOwnerWithinWindow(dbPool, {
        messageId: payload.messageId,
        senderId,
        newContent: payload.content,
      });

      io.to(updated.roomId).emit('message:updated', updated);
      if (typeof ack === 'function') {
        ack({ ok: true, data: updated });
      }
    } catch (err) {
      if (typeof ack === 'function') {
        ack({
          ok: false,
          error: {
            code: 'EDIT_FAILED',
            message: err instanceof Error ? err.message : 'Could not edit message.',
          },
        });
      }
    }
  });

  socket.on('message:delete', async (payload, ack) => {
    try {
      const senderId = socket.data.userId;
      if (!senderId || !UUID_REGEX.test(senderId)) {
        if (typeof ack === 'function') {
          ack({
            ok: false,
            error: { code: 'UNAUTHORIZED', message: 'Login required.' },
          });
        }
        return;
      }

      const deleted = await deleteMessageByOwnerPermanently(dbPool, {
        messageId: payload.messageId,
        senderId,
      });

      io.to(deleted.roomId).emit('message:deleted', deleted);
      if (typeof ack === 'function') {
        ack({ ok: true, data: deleted });
      }
    } catch (err) {
      if (typeof ack === 'function') {
        ack({
          ok: false,
          error: {
            code: 'DELETE_FAILED',
            message:
              err instanceof Error ? err.message : 'Could not delete message.',
          },
        });
      }
    }
  });
}