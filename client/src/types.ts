/**
 * Shared Types, URL Classifier, Smart Timestamp Formatter, 2-Hour Edit Helpers & @userID Mention Parser
 * Place this file at: `client/src/types.ts`
 */

export type MessageType = 'text' | 'link';

export const GLOBAL_CHAT_ROOM_ID = '11111111-2222-4333-8444-555555555555';
export const GLOBAL_ADMIN_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
export const GLOBAL_ADMIN_HANDLE = 'jatinpersonalx';
/** Maximum messages or notifications loaded in memory/view at a single time */
export const MAX_PAGE_SIZE = 40;
/** 2-hour edit window in milliseconds (7,200,000 ms) */
export const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export interface LinkMetadata {
  url: string;
  hostname: string;
  protocol: 'http:' | 'https:';
  pathname: string;
  unfurl?: {
    title?: string;
    description?: string;
    siteName?: string;
    accentColor?: string;
  };
}

export type MessageMetadata = Record<string, unknown> & Partial<LinkMetadata>;

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderHandle?: string;
  senderName: string;
  senderRole: string;
  avatarGradient: string;
  senderAvatarUrl?: string;
  senderBio?: string;
  content: string;
  type: MessageType;
  metadata: MessageMetadata;
  clientMessageId: string | null;
  createdAt: string;
  updatedAt?: string | null;
  status?: 'sending' | 'sent' | 'delivered';
}

export interface Room {
  id: string;
  roomCode: string; // Unique @roomID ('000000' for Global Chat)
  name: string;
  topic: string;
  adminId: string;
  adminHandle: string;
  coAdminId?: string | null;
  coAdminHandle?: string | null;
  isGlobal?: boolean;
  memberStatus?: 'joined' | 'invited' | 'public';
  unreadCount: number;
  onlineCount: number;
}

export interface AuthUser {
  id: string;
  userHandle: string;
  email: string;
  name: string;
  role: string;
  avatarGradient: string;
  avatarUrl?: string;
  bio?: string;
  isPrivate?: boolean;
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

export interface OtpDevPreview {
  otpCode: string;
  magicToken: string;
  magicLinkUrl: string;
}

export function sanitizeHandle(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[^a-z0-9_.-]/g, '')
    .slice(0, 32);
}

export function extractMentionedHandles(text: string): string[] {
  const matches = text.matchAll(/@([a-zA-Z0-9_.-]{2,32})/g);
  const set = new Set<string>();
  for (const m of matches) {
    if (m[1]) set.add(m[1].toLowerCase());
  }
  return Array.from(set);
}

export function parseInviteCommand(text: string): string | null {
  const match = text
    .trim()
    .match(/^invite\s+@?([a-zA-Z0-9_.-]{2,32})\s+y$/i);
  return match ? match[1].toLowerCase() : null;
}

export function isWithinTwoHourEditWindow(createdAtIso: string): boolean {
  try {
    const createdMs = new Date(createdAtIso).getTime();
    if (Number.isNaN(createdMs)) return false;
    const elapsed = Date.now() - createdMs;
    return elapsed >= 0 && elapsed <= TWO_HOURS_MS;
  } catch {
    return false;
  }
}

export function getRemainingEditMinutes(createdAtIso: string): number {
  try {
    const createdMs = new Date(createdAtIso).getTime();
    const remainingMs = TWO_HOURS_MS - (Date.now() - createdMs);
    return Math.max(0, Math.ceil(remainingMs / 60000));
  } catch {
    return 0;
  }
}

export function formatSmartTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    const isSameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();

    const timeStr = d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (isSameDay) {
      return timeStr;
    }

    const dateStr = d.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
    return `${dateStr} • ${timeStr}`;
  } catch {
    return '';
  }
}

export function getInitials(name: string): string {
  return (
    name
      .replace(/\(.*\)/, '')
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'
  );
}

export const AVATAR_PRESETS = [
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Elena',
  'https://api.dicebear.com/9.x/bottts/svg?seed=PulseBot',
];