import React, { useState, useEffect, useRef, useMemo } from 'react';
// Built-in SVG Icons (Zero external icon package dependencies required)
type IconProps = { className?: string };

const Send = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);
const Sun = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);
const Moon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);
const Link2 = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
);
const MessageSquare = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const Menu = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);
const X = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const Check = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);
const CheckCheck = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
);
const Clock = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const ExternalLink = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
);
const Search = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const Hash = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
);
export const Users = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const Code2 = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
);
const Sparkles = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const Wifi = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/></svg>
);
const WifiOff = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" x2="22" y1="2" y2="22"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="M12 20h.01"/></svg>
);
const Copy = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const Filter = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);
const Globe = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);
const ShieldCheck = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
);
const CornerDownLeft = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>
);
const Info = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);
const Bell = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);
const Plus = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
const ArrowDown = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
);

// ---------------------------------------------------------------------------
// 1. Forward-Compatible Types (Matching Backend `messageHandler.ts`)
// ---------------------------------------------------------------------------

export type MessageType = 'text' | 'link';

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
  senderName: string;
  senderRole: string;
  senderHandle?: string;
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
  roomCode?: string; // Unique @roomID ('000000' reserved exclusively for Global Chat)
  name: string;
  topic: string;
  adminId?: string;
  adminHandle: string;
  coAdminId?: string | null;
  coAdminHandle?: string | null;
  isGlobal?: boolean;
  memberStatus?: 'joined' | 'invited' | 'public';
  unreadCount: number;
  onlineCount: number;
  isPrivate?: boolean;
}

export interface AuthUser {
  id: string;
  userHandle?: string;
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
  senderHandle?: string;
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

// ---------------------------------------------------------------------------
// 2. Client-Side URL Classifier & Metadata Builder (Mirrors Server Logic)
// ---------------------------------------------------------------------------

const KNOWN_UNFURLS: Record<
  string,
  { title: string; description: string; siteName: string; accentColor: string }
> = {
  'socket.io': {
    title: 'Socket.IO — Bidirectional and low-latency communication',
    description:
      'Socket.IO enables real-time, bidirectional and event-based communication between the browser and the server.',
    siteName: 'Socket.IO Docs',
    accentColor: 'from-emerald-500 to-teal-600',
  },
  'www.postgresql.org': {
    title: 'PostgreSQL: JSON Types & JSONB Indexing',
    description:
      'JSON data types are for storing JSON data in binary decomposed format (JSONB) with full GIN index support.',
    siteName: 'PostgreSQL Documentation',
    accentColor: 'from-sky-500 to-blue-600',
  },
  'github.com': {
    title: 'realtime-chat-architecture / server / messageHandler.ts',
    description:
      'Forward-compatible real-time chat using React, TypeScript, Socket.IO, and PostgreSQL JSONB.',
    siteName: 'GitHub Repository',
    accentColor: 'from-violet-500 to-indigo-600',
  },
  'react.dev': {
    title: 'React — The library for web and native user interfaces',
    description:
      'Build user interfaces out of individual pieces called components written in JavaScript and TypeScript.',
    siteName: 'React Official',
    accentColor: 'from-cyan-500 to-blue-500',
  },
};

function parseValidHttpUrl(candidate: string): URL | null {
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

function classifyClientMessage(
  rawContent: string,
  extraMeta: Record<string, unknown> = {}
): {
  sanitizedContent: string;
  type: MessageType;
  metadata: MessageMetadata;
} {
  const sanitizedContent = rawContent.trim();
  const parsedUrl = parseValidHttpUrl(sanitizedContent);

  if (parsedUrl) {
    const hostKey = parsedUrl.hostname.toLowerCase();
    const unfurl = KNOWN_UNFURLS[hostKey] || {
      title: `${parsedUrl.hostname}${parsedUrl.pathname !== '/' ? parsedUrl.pathname : ''}`,
      description: `Verified ${parsedUrl.protocol.replace(':', '').toUpperCase()} link routed via messageHandler.ts with JSONB metadata.`,
      siteName: parsedUrl.hostname,
      accentColor: 'from-indigo-500 to-purple-600',
    };

    return {
      sanitizedContent,
      type: 'link',
      metadata: {
        ...extraMeta,
        url: parsedUrl.href,
        hostname: parsedUrl.hostname,
        protocol: parsedUrl.protocol as 'http:' | 'https:',
        pathname: parsedUrl.pathname,
        unfurl,
      },
    };
  }

  return {
    sanitizedContent,
    type: 'text',
    metadata: {
      ...extraMeta,
      clientVersion: '2.4.0',
    },
  };
}

// ---------------------------------------------------------------------------
// 3. Default Global Chat Room & Constants (No Placeholder Messages)
// ---------------------------------------------------------------------------

const MAX_PAGE_SIZE = 40;

function sanitizeHandle(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[^a-z0-9_.-]/g, '')
    .slice(0, 32);
}

function extractMentionedHandles(text: string): string[] {
  const matches = text.matchAll(/@([a-zA-Z0-9_.-]{2,32})/g);
  const handles = new Set<string>();
  for (const m of matches) {
    if (m[1]) handles.add(m[1].toLowerCase());
  }
  return Array.from(handles);
}

function parseInviteCommand(text: string): string | null {
  const match = text
    .trim()
    .match(/^invite\s+@?([a-zA-Z0-9_.-]{2,32})\s+y$/i);
  return match ? match[1].toLowerCase() : null;
}

const CURRENT_USER = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  userHandle: 'jatinpersonalx',
  name: 'jatinpersonalx',
  role: 'Global Chat Admin',
  avatarGradient: 'from-indigo-500 to-violet-600',
};

const INITIAL_ROOMS: Room[] = [
  {
    id: '11111111-2222-4333-8444-555555555555',
    roomCode: '000000',
    name: 'Global Chat',
    topic: 'Official Global Chat • Admin: @jatinpersonalx',
    adminId: CURRENT_USER.id,
    adminHandle: 'jatinpersonalx',
    coAdminId: null,
    coAdminHandle: null,
    isGlobal: true,
    memberStatus: 'public',
    unreadCount: 0,
    onlineCount: 1,
  },
];

// Cleaned all placeholder messages not in PostgreSQL database
const INITIAL_MESSAGES: ChatMessage[] = [];

const QUICK_SAMPLE_INPUTS = [
  {
    label: 'Paste Postgres Docs URL',
    value: 'https://www.postgresql.org/docs/current/datatype-json.html',
  },
  {
    label: 'Paste GitHub Repo URL',
    value: 'https://github.com/socketio/socket.io/tree/main/packages',
  },
  {
    label: 'Mention @jatinpersonalx',
    value: 'Hey @jatinpersonalx! Checking in on Global Chat.',
  },
  {
    label: 'Invite Command Example',
    value: 'invite @jatinpersonalx y',
  },
];

// ---------------------------------------------------------------------------
// 4. Utility Helpers
// ---------------------------------------------------------------------------

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

const AVATAR_PRESETS = [
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Elena',
  'https://api.dicebear.com/9.x/bottts/svg?seed=PulseBot',
];

function isWithinTwoHourEditWindow(createdAtIso: string): boolean {
  try {
    const createdMs = new Date(createdAtIso).getTime();
    if (Number.isNaN(createdMs)) return false;
    const elapsed = Date.now() - createdMs;
    return elapsed >= 0 && elapsed <= TWO_HOURS_MS;
  } catch {
    return false;
  }
}

function getRemainingEditMinutes(createdAtIso: string): number {
  try {
    const createdMs = new Date(createdAtIso).getTime();
    const remainingMs = TWO_HOURS_MS - (Date.now() - createdMs);
    return Math.max(0, Math.ceil(remainingMs / 60000));
  } catch {
    return 0;
  }
}

/**
 * Shows ONLY time for today's messages, and shows Date + Time for messages posted a day before or earlier.
 */
function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    const isToday =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();

    const timePart = d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (isToday) {
      return timePart;
    }

    const datePart = d.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
    return `${datePart} • ${timePart}`;
  } catch {
    return '';
  }
}

function getInitials(name: string): string {
  return name
    .replace(/\(.*\)/, '')
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function copyTextToClipboard(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// 5. Main Component
// ---------------------------------------------------------------------------

export function App() {
  // Theme state (persisted safely in localStorage)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('chat_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore sandbox storage restrictions
    }
    return 'dark';
  });

  // Navigation & responsive drawers (Only Global Chat by default, persisted custom rooms)
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      localStorage.removeItem('pulsechat_messages_v1'); // Clear legacy placeholder messages
      const savedRooms = localStorage.getItem('pulsechat_rooms_v3');
      if (savedRooms) {
        const parsed = JSON.parse(savedRooms);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_ROOMS;
  });
  const [activeRoomId, setActiveRoomId] = useState<string>(INITIAL_ROOMS[0].id);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [inspectedMessage, setInspectedMessage] = useState<ChatMessage | null>(
    null
  );
  const [showInspectorPanel, setShowInspectorPanel] = useState<boolean>(false);

  // Room Search (@roomID or name), Creation & Co-Admin State
  const [roomSearchQuery, setRoomSearchQuery] = useState('');
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCode, setNewRoomCode] = useState('');
  const [newRoomTopic, setNewRoomTopic] = useState('');
  const [showCoAdminInput, setShowCoAdminInput] = useState(false);
  const [coAdminInputHandle, setCoAdminInputHandle] = useState('');
  const [confirmDeleteRoomId, setConfirmDeleteRoomId] = useState<string | null>(
    null
  );

  // Top-Right Notifications State (Strictly <= 40 notifications loaded at a time)
  const [notifications, setNotifications] = useState<UserNotification[]>(() => {
    try {
      const saved = localStorage.getItem('pulsechat_notifications_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);
  const [notifPageOffset, setNotifPageOffset] = useState(0);

  // Messages & 40-Message Sliding Window Pagination
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const cached = localStorage.getItem('pulsechat_db_messages_v3');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_MESSAGES;
  });
  const [hasMoreOlderInDb, setHasMoreOlderInDb] = useState(false);
  const [hasMoreNewerInDb, setHasMoreNewerInDb] = useState(false);
  const [windowEndOffset, setWindowEndOffset] = useState(0); // 0 = latest 40 messages

  // Smart Scroll Tracking & "↓ New message" Floating Button State
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [pendingNewMessagesCount, setPendingNewMessagesCount] = useState(0);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | MessageType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Composer & Socket simulation
  const [draft, setDraft] = useState('');
  const [customMetaKey, setCustomMetaKey] = useState('');
  const [customMetaVal, setCustomMetaVal] = useState('');
  const [showMetaInputs, setShowMetaInputs] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [typingUser, _setTypingUser] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modular Email OTP & Magic Link Authentication State (Starts in Read-Only Guest Mode)
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('pulsechat_auth_user_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('pulsechat_auth_token_v1');
    } catch {
      return null;
    }
  });
  const [activeView, setActiveView] = useState<'chat' | 'auth' | 'profile'>('chat');
  const [viewedUserId, setViewedUserId] = useState<string>(CURRENT_USER.id);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState('');
  const [profileRoleInput, setProfileRoleInput] = useState('');
  const [profileAvatarInput, setProfileAvatarInput] = useState('');
  const [profileBioInput, setProfileBioInput] = useState('');
  const [profilePrivateInput, setProfilePrivateInput] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [visibleMessageLimit, setVisibleMessageLimit] = useState<number>(MAX_PAGE_SIZE);

  // Message Editing (within 2 hours) & Permanent Deletion State
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageContent, setEditingMessageContent] = useState('');
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authStep, setAuthStep] = useState<'request' | 'verify'>('request');
  const [authEmail, setAuthEmail] = useState('');
  const [authHandle, setAuthHandle] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState('Full-Stack Developer');
  const [profileHandleInput, setProfileHandleInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [devPreview, setDevPreview] = useState<OtpDevPreview | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    try {
      localStorage.setItem('chat_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Persist database-synced messages, rooms, and notifications locally
  useEffect(() => {
    try {
      localStorage.setItem('pulsechat_db_messages_v3', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('pulsechat_rooms_v3', JSON.stringify(rooms));
    } catch {
      // ignore
    }
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem(
        'pulsechat_notifications_v3',
        JSON.stringify(notifications)
      );
    } catch {
      // ignore
    }
  }, [notifications]);

  // Load rooms & notifications for current user from PostgreSQL backend
  useEffect(() => {
    if (!isConnected) return;
    let cancelled = false;

    async function syncRoomsAndNotifications() {
      try {
        const handleParam = authUser?.userHandle || '';
        const roomsRes = await fetch(
          `http://localhost:4000/api/rooms?userHandle=${encodeURIComponent(
            handleParam
          )}`,
          {
            headers: sessionToken
              ? { Authorization: `Bearer ${sessionToken}` }
              : {},
          }
        );
        if (roomsRes.ok) {
          const rJson = await roomsRes.json();
          if (!cancelled && rJson?.ok && Array.isArray(rJson.data) && rJson.data.length > 0) {
            setRooms(
              rJson.data.map((r: Room) => ({
                ...r,
                unreadCount: 0,
                onlineCount: r.isGlobal ? 12 : 3,
              }))
            );
          }
        }

        if (handleParam) {
          const notifRes = await fetch(
            `http://localhost:4000/api/notifications?userHandle=${encodeURIComponent(
              handleParam
            )}&limit=${MAX_PAGE_SIZE}`,
            {
              headers: sessionToken
                ? { Authorization: `Bearer ${sessionToken}` }
                : {},
            }
          );
          if (notifRes.ok) {
            const nJson = await notifRes.json();
            if (!cancelled && nJson?.ok && Array.isArray(nJson.data)) {
              setNotifications(nJson.data.slice(0, MAX_PAGE_SIZE));
            }
          }
        }
      } catch {
        // Offline fallback
      }
    }

    syncRoomsAndNotifications();
    return () => {
      cancelled = true;
    };
  }, [authUser, sessionToken, isConnected]);

  // Load up to 40 messages for the active room from PostgreSQL
  const fetchRoomWindowFromDb = async (opts?: {
    before?: string;
    after?: string;
  }) => {
    if (!isConnected) return;
    try {
      const qs = new URLSearchParams({
        roomId: activeRoomId,
        limit: String(MAX_PAGE_SIZE),
      });
      if (opts?.before) qs.set('before', opts.before);
      if (opts?.after) qs.set('after', opts.after);

      const res = await fetch(
        `http://localhost:4000/api/messages?${qs.toString()}`
      );
      if (!res.ok) return;
      const json = await res.json();
      if (!json?.ok || !Array.isArray(json.data)) return;

      const dbMessages: ChatMessage[] = json.data
        .slice(0, MAX_PAGE_SIZE)
        .map((row: ChatMessage) => {
          const meta = (row.metadata || {}) as Record<string, unknown>;
          return {
            ...row,
            senderHandle:
              typeof meta.senderHandle === 'string'
                ? meta.senderHandle
                : 'jatinpersonalx',
            senderName:
              typeof meta.senderName === 'string'
                ? meta.senderName
                : 'jatinpersonalx',
            senderRole:
              typeof meta.senderRole === 'string'
                ? meta.senderRole
                : 'Member',
            avatarGradient:
              typeof meta.avatarGradient === 'string'
                ? meta.avatarGradient
                : 'from-indigo-500 to-violet-600',
            senderAvatarUrl:
              typeof meta.senderAvatarUrl === 'string'
                ? meta.senderAvatarUrl
                : '',
            senderBio:
              typeof meta.senderBio === 'string' ? meta.senderBio : '',
            status: 'delivered',
          };
        });

      if (!opts?.after) {
        setHasMoreOlderInDb(Boolean(json.hasMoreOlder));
      }
      if (!opts?.before) {
        setHasMoreNewerInDb(Boolean(json.hasMoreNewer));
      }

      setMessages((prev) => {
        const otherRooms = prev.filter((m) => m.roomId !== activeRoomId);
        const existingRoomMap = new Map<string, ChatMessage>();
        for (const m of prev.filter((x) => x.roomId === activeRoomId)) {
          existingRoomMap.set(m.clientMessageId || m.id, m);
        }
        for (const dbM of dbMessages) {
          existingRoomMap.set(dbM.clientMessageId || dbM.id, dbM);
        }
        const merged = Array.from(existingRoomMap.values()).sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        return [...otherRooms, ...merged];
      });
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    setWindowEndOffset(0);
    setVisibleMessageLimit(MAX_PAGE_SIZE);
    setPendingNewMessagesCount(0);
    setIsScrolledToBottom(true);
    fetchRoomWindowFromDb();
  }, [activeRoomId, isConnected]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Live classification preview as the user types in the composer
  const liveDetection = useMemo(() => {
    if (!draft.trim()) return null;
    const extra: Record<string, unknown> = {};
    if (customMetaKey.trim()) {
      extra[customMetaKey.trim()] = customMetaVal.trim() || true;
    }
    return classifyClientMessage(draft, extra);
  }, [draft, customMetaKey, customMetaVal]);

  const activeRoom = useMemo(
    () => rooms.find((r) => r.id === activeRoomId) || rooms[0],
    [rooms, activeRoomId]
  );

  const allRoomFilteredMessages = useMemo(() => {
    return messages
      .filter((m) => {
        if (m.roomId !== activeRoomId) return false;
        if (typeFilter !== 'all' && m.type !== typeFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchContent = m.content.toLowerCase().includes(q);
          const matchSender = m.senderName.toLowerCase().includes(q);
          const matchHandle = (m.senderHandle || '').toLowerCase().includes(q);
          const matchHost = (m.metadata?.hostname || '')
            .toLowerCase()
            .includes(q);
          return matchContent || matchSender || matchHandle || matchHost;
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }, [messages, activeRoomId, typeFilter, searchQuery]);

  // Smooth infinite scroll: loads 40 messages initially, and smoothly expands by 40 on scroll up
  const filteredMessages = useMemo(() => {
    const total = allRoomFilteredMessages.length;
    const startIdx = Math.max(0, total - visibleMessageLimit);
    return allRoomFilteredMessages.slice(startIdx, total);
  }, [allRoomFilteredMessages, visibleMessageLimit]);

  const canLoadOlderMessages =
    hasMoreOlderInDb || allRoomFilteredMessages.length > visibleMessageLimit;
  const canLoadNewerMessages = hasMoreNewerInDb || windowEndOffset > 0;

  // Filter rooms in sidebar by @roomID (e.g. @000000) or room name
  const displayedRooms = useMemo(() => {
    const q = roomSearchQuery.trim().toLowerCase().replace(/^@+/, '');
    if (!q) return rooms;
    return rooms.filter((r) => {
      const code = (r.isGlobal ? '000000' : r.roomCode || '').toLowerCase();
      return code.includes(q) || r.name.toLowerCase().includes(q);
    });
  }, [rooms, roomSearchQuery]);

  // Room message stats
  const roomCounts = useMemo(() => {
    const roomMsgs = messages.filter((m) => m.roomId === activeRoomId);
    return {
      total: roomMsgs.length,
      links: roomMsgs.filter((m) => m.type === 'link').length,
      text: roomMsgs.filter((m) => m.type === 'text').length,
    };
  }, [messages, activeRoomId]);

  const scrollToBottom = () => {
    setWindowEndOffset(0);
    setPendingNewMessagesCount(0);
    setIsScrolledToBottom(true);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 30);
  };

  const handleMessageStreamScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceFromBottom < 85;
    setIsScrolledToBottom(atBottom);
    if (atBottom && windowEndOffset === 0) {
      setPendingNewMessagesCount(0);
    }

    // When user scrolls to top, load older 40-message window
    if (el.scrollTop <= 8 && canLoadOlderMessages) {
      handleLoadOlderMessages();
    }
    // When user scrolls to bottom while viewing older window, load newer 40-message window
    if (atBottom && canLoadNewerMessages) {
      handleLoadNewerMessages();
    }
  };

  const handleLoadOlderMessages = () => {
    const container = messagesContainerRef.current;
    const prevScrollHeight = container ? container.scrollHeight : 0;

    setVisibleMessageLimit((prev) => prev + MAX_PAGE_SIZE);
    if (hasMoreOlderInDb && filteredMessages.length > 0) {
      fetchRoomWindowFromDb({ before: filteredMessages[0].createdAt });
    }

    // Preserve exact reading position when older messages prepend at top
    if (container && prevScrollHeight > 0) {
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop += newScrollHeight - prevScrollHeight;
      });
    }
  };

  const handleLoadNewerMessages = () => {
    if (windowEndOffset > 0) {
      setWindowEndOffset((prev) => Math.max(0, prev - MAX_PAGE_SIZE));
    } else if (hasMoreNewerInDb && filteredMessages.length > 0) {
      fetchRoomWindowFromDb({
        after: filteredMessages[filteredMessages.length - 1].createdAt,
      });
    }
  };

  // Auto-scroll ONLY if user is already scrolled down; otherwise show "↓ New message" button
  const prevMsgCountRef = useRef(allRoomFilteredMessages.length);
  useEffect(() => {
    const prevCount = prevMsgCountRef.current;
    const nextCount = allRoomFilteredMessages.length;
    prevMsgCountRef.current = nextCount;

    if (nextCount > prevCount) {
      if (isScrolledToBottom && windowEndOffset === 0) {
        scrollToBottom();
      } else {
        setPendingNewMessagesCount((c) => c + (nextCount - prevCount));
      }
    }
  }, [allRoomFilteredMessages.length, isScrolledToBottom, windowEndOffset]);

  // Sync React Router style hash routes (#/, #/auth, #/profile, #/users/:id)
  useEffect(() => {
    const checkHash = () => {
      const h = window.location.hash || '';
      if (h.startsWith('#/auth')) {
        setActiveView('auth');
        const qIdx = h.indexOf('?');
        if (qIdx !== -1) {
          const params = new URLSearchParams(h.slice(qIdx + 1));
          const mToken = params.get('magicToken');
          if (mToken) {
            handleVerifyMagicLink(mToken);
          }
        }
      } else if (h.startsWith('#/profile')) {
        if (authUser) {
          setViewedUserId(authUser.id);
          setIsEditingProfile(true);
          setActiveView('profile');
        } else {
          setActiveView('auth');
        }
      } else if (h.startsWith('#/users/')) {
        const targetId = decodeURIComponent(h.replace('#/users/', '').split('?')[0]);
        if (targetId) {
          setViewedUserId(targetId);
          setIsEditingProfile(false);
          setActiveView('profile');
        }
      } else if (h === '#/' || h === '') {
        setActiveView('chat');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [authUser]);

  const openUserProfilePage = (targetId: string, startInEditMode = false) => {
    setViewedUserId(targetId);
    const isMe = Boolean(authUser && authUser.id === targetId);
    setIsEditingProfile(isMe && startInEditMode);
    setActiveView('profile');
    setMobileSidebarOpen(false);
    try {
      window.location.hash = isMe && startInEditMode ? '#/profile' : `#/users/${encodeURIComponent(targetId)}`;
    } catch {
      // ignore
    }
  };

  // Registry of all known @userID handles to enforce strict uniqueness
  const knownUsersMap = useMemo(() => {
    const map = new Map<string, { id: string; email?: string; isPrivate?: boolean }>();
    map.set('jatinpersonalx', {
      id: CURRENT_USER.id,
      email: 'jatinpersonalx@pulsechat.local',
      isPrivate: false,
    });
    try {
      const savedMap = localStorage.getItem('pulsechat_user_registry_v3');
      if (savedMap) {
        const parsed = JSON.parse(savedMap);
        if (parsed && typeof parsed === 'object') {
          for (const [k, v] of Object.entries(parsed)) {
            map.set(k.toLowerCase(), v as { id: string; email?: string; isPrivate?: boolean });
          }
        }
      }
    } catch {
      // ignore
    }
    for (const m of messages) {
      const h = (
        m.senderHandle ||
        (typeof m.metadata?.senderHandle === 'string'
          ? m.metadata.senderHandle
          : '')
      ).toLowerCase();
      if (h) {
        map.set(h, {
          id: m.senderId,
          email:
            typeof m.metadata?.senderEmail === 'string'
              ? m.metadata.senderEmail
              : undefined,
          isPrivate: Boolean(m.metadata?.senderIsPrivate),
        });
      }
    }
    if (authUser && authUser.userHandle) {
      map.set(authUser.userHandle.toLowerCase(), {
        id: authUser.id,
        email: authUser.email,
        isPrivate: Boolean(authUser.isPrivate),
      });
    }
    return map;
  }, [messages, authUser]);

  const registerHandleLocally = (
    handle: string,
    id: string,
    email?: string,
    isPrivate?: boolean
  ) => {
    try {
      const saved = localStorage.getItem('pulsechat_user_registry_v3');
      const obj = saved ? JSON.parse(saved) : {};
      obj[handle.toLowerCase()] = { id, email, isPrivate: Boolean(isPrivate) };
      localStorage.setItem('pulsechat_user_registry_v3', JSON.stringify(obj));
    } catch {
      // ignore
    }
  };

  // Jump from a user's Profile Message History directly to the exact message in the room
  const handleJumpToExactMessage = (targetRoomId: string, targetMsgId: string) => {
    setActiveRoomId(targetRoomId);
    setTypeFilter('all');
    setSearchQuery('');
    setVisibleMessageLimit((prev) => Math.max(prev, 200));
    closeAuthPage();
    setHighlightedMessageId(targetMsgId);

    setTimeout(() => {
      const el = document.getElementById(`chat-msg-${targetMsgId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);

    setTimeout(() => {
      setHighlightedMessageId((curr) => (curr === targetMsgId ? null : curr));
    }, 3600);
  };

  // Compute currently viewed profile details (by UUID or @userID handle) + privacy status
  const viewedProfileData = useMemo(() => {
    const cleanTarget = viewedUserId.replace(/^@+/, '').toLowerCase();
    const isOwn = Boolean(
      authUser &&
        (authUser.id.toLowerCase() === cleanTarget ||
          (authUser.userHandle || '').toLowerCase() === cleanTarget)
    );
    if (isOwn && authUser) {
      const handle =
        authUser.userHandle || sanitizeHandle(authUser.name) || 'user';
      return {
        id: authUser.id,
        userHandle: handle,
        name: authUser.name,
        role: authUser.role,
        email: authUser.email,
        avatarGradient: authUser.avatarGradient,
        avatarUrl: authUser.avatarUrl || '',
        bio:
          authUser.bio ||
          'Building real-time apps with React, Socket.IO, and PostgreSQL.',
        isPrivate: Boolean(authUser.isPrivate),
      };
    }

    if (
      cleanTarget === 'jatinpersonalx' ||
      cleanTarget === CURRENT_USER.id.toLowerCase()
    ) {
      return {
        id: CURRENT_USER.id,
        userHandle: 'jatinpersonalx',
        name: 'jatinpersonalx',
        role: 'Global Chat Admin',
        email: undefined,
        avatarGradient: CURRENT_USER.avatarGradient,
        avatarUrl: '',
        bio: 'Creator & Primary Admin of Global Chat (@000000).',
        isPrivate: false,
      };
    }

    const userMsgs = messages.filter(
      (m) =>
        m.senderId.toLowerCase() === cleanTarget ||
        (m.senderHandle || '').toLowerCase() === cleanTarget ||
        m.senderName.toLowerCase() === cleanTarget
    );
    const sample = userMsgs[userMsgs.length - 1];
    const meta = (sample?.metadata || {}) as Record<string, unknown>;
    const inferredHandle =
      sample?.senderHandle ||
      (typeof meta.senderHandle === 'string'
        ? meta.senderHandle
        : sanitizeHandle(sample?.senderName || cleanTarget));
    const registryEntry = knownUsersMap.get(
      (inferredHandle || cleanTarget).toLowerCase()
    );
    return {
      id: sample?.senderId || registryEntry?.id || viewedUserId,
      userHandle: inferredHandle || cleanTarget,
      name:
        sample?.senderName ||
        (typeof meta.senderName === 'string' ? meta.senderName : `@${cleanTarget}`),
      role:
        sample?.senderRole ||
        (typeof meta.senderRole === 'string' ? meta.senderRole : 'Member'),
      email: typeof meta.senderEmail === 'string' ? meta.senderEmail : undefined,
      avatarGradient:
        sample?.avatarGradient || 'from-emerald-500 to-teal-600',
      avatarUrl:
        sample?.senderAvatarUrl ||
        (typeof meta.senderAvatarUrl === 'string' ? meta.senderAvatarUrl : ''),
      bio:
        sample?.senderBio ||
        (typeof meta.senderBio === 'string'
          ? meta.senderBio
          : 'PulseChat member collaborating on real-time Socket.IO & PostgreSQL channels.'),
      isPrivate: Boolean(meta.senderIsPrivate ?? registryEntry?.isPrivate),
    };
  }, [viewedUserId, authUser, messages, knownUsersMap]);

  const viewedUserMessages = useMemo(() => {
    const cleanTarget = viewedUserId.replace(/^@+/, '').toLowerCase();
    return messages
      .filter(
        (m) =>
          m.senderId.toLowerCase() === cleanTarget ||
          m.senderId === viewedProfileData.id ||
          (m.senderHandle || '').toLowerCase() === cleanTarget
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, MAX_PAGE_SIZE);
  }, [messages, viewedUserId, viewedProfileData.id]);

  useEffect(() => {
    setProfileNameInput(viewedProfileData.name);
    setProfileHandleInput(viewedProfileData.userHandle);
    setProfileRoleInput(viewedProfileData.role);
    setProfileAvatarInput(viewedProfileData.avatarUrl);
    setProfileBioInput(viewedProfileData.bio);
    setProfilePrivateInput(Boolean(viewedProfileData.isPrivate));
  }, [viewedProfileData]);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      triggerToast('Please choose an image under 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileAvatarInput(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfileChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;
    const cleanName = profileNameInput.trim();
    if (cleanName.length < 2) {
      triggerToast('Profile name must be at least 2 characters.');
      return;
    }

    const cleanHandle =
      sanitizeHandle(profileHandleInput) ||
      authUser.userHandle ||
      sanitizeHandle(cleanName);

    if (cleanHandle.length < 2) {
      triggerToast('@userID handle must be at least 2 characters.');
      return;
    }

    // Strict client-side + server-side @userID uniqueness check
    const existingOwner = knownUsersMap.get(cleanHandle.toLowerCase());
    if (
      existingOwner &&
      existingOwner.id !== authUser.id &&
      existingOwner.email !== authUser.email
    ) {
      triggerToast(
        `@${cleanHandle} is already taken by another user. Every @userID must be unique.`
      );
      return;
    }

    setProfileSaving(true);
    const updatedUser: AuthUser = {
      ...authUser,
      userHandle: cleanHandle,
      name: cleanName,
      role: profileRoleInput.trim() || 'Verified Member',
      avatarUrl: profileAvatarInput.trim(),
      bio:
        profileBioInput.trim() ||
        'Building real-time apps with React, Socket.IO, and PostgreSQL.',
      isPrivate: profilePrivateInput,
    };

    try {
      const res = await fetch('http://localhost:4000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({
          userHandle: updatedUser.userHandle,
          name: updatedUser.name,
          role: updatedUser.role,
          avatarUrl: updatedUser.avatarUrl,
          bio: updatedUser.bio,
          isPrivate: updatedUser.isPrivate,
        }),
      });
      const json = await res.json();
      if (!res.ok && json?.error?.message) {
        triggerToast(json.error.message);
        setProfileSaving(false);
        return;
      }
      if (res.ok && json?.ok && json.data) {
        setAuthUser(json.data);
        localStorage.setItem('pulsechat_auth_user_v1', JSON.stringify(json.data));
        registerHandleLocally(
          json.data.userHandle,
          json.data.id,
          json.data.email,
          json.data.isPrivate
        );
      } else {
        setAuthUser(updatedUser);
        localStorage.setItem('pulsechat_auth_user_v1', JSON.stringify(updatedUser));
        registerHandleLocally(
          updatedUser.userHandle || cleanHandle,
          updatedUser.id,
          updatedUser.email,
          updatedUser.isPrivate
        );
      }
    } catch {
      setAuthUser(updatedUser);
      registerHandleLocally(
        updatedUser.userHandle || cleanHandle,
        updatedUser.id,
        updatedUser.email,
        updatedUser.isPrivate
      );
      try {
        localStorage.setItem('pulsechat_auth_user_v1', JSON.stringify(updatedUser));
      } catch {
        // ignore
      }
    } finally {
      // Update user's messages in state so their new name, photo, and bio appear everywhere immediately
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === authUser.id
            ? {
                ...m,
                senderName: updatedUser.name,
                senderRole: updatedUser.role,
                senderAvatarUrl: updatedUser.avatarUrl,
                senderBio: updatedUser.bio,
                senderHandle: updatedUser.userHandle,
                metadata: {
                  ...m.metadata,
                  senderHandle: updatedUser.userHandle,
                  senderName: updatedUser.name,
                  senderRole: updatedUser.role,
                  senderAvatarUrl: updatedUser.avatarUrl,
                  senderBio: updatedUser.bio,
                  senderIsPrivate: Boolean(updatedUser.isPrivate),
                },
              }
            : m
        )
      );
      setProfileSaving(false);
      setIsEditingProfile(false);
      triggerToast('Profile saved to PostgreSQL!');
    }
  };

  const handleStartEditingMessage = (msg: ChatMessage) => {
    if (!authUser || msg.senderId !== authUser.id) {
      triggerToast('You can only edit your own messages.');
      return;
    }
    if (!isWithinTwoHourEditWindow(msg.createdAt)) {
      triggerToast('Messages can only be edited within 2 hours of posting.');
      return;
    }
    setEditingMessageId(msg.id);
    setEditingMessageContent(msg.content);
    setDeletingMessageId(null);
  };

  const handleSaveEditedMessage = async (msgId: string) => {
    const target = messages.find((m) => m.id === msgId);
    if (!target || !authUser || target.senderId !== authUser.id) return;

    if (!isWithinTwoHourEditWindow(target.createdAt)) {
      triggerToast('Edit window expired (2 hours limit).');
      setEditingMessageId(null);
      return;
    }

    const trimmed = editingMessageContent.trim();
    if (!trimmed) {
      triggerToast('Message content cannot be empty.');
      return;
    }

    const nowIso = new Date().toISOString();
    const reClassified = classifyClientMessage(trimmed, {
      ...target.metadata,
      edited: true,
      editedAt: nowIso,
    });

    const optimisticUpdated: ChatMessage = {
      ...target,
      content: reClassified.sanitizedContent,
      type: reClassified.type,
      metadata: reClassified.metadata,
      updatedAt: nowIso,
    };

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? optimisticUpdated : m))
    );
    if (inspectedMessage?.id === msgId) {
      setInspectedMessage(optimisticUpdated);
    }
    setEditingMessageId(null);
    setEditingMessageContent('');

    try {
      const res = await fetch(
        `http://localhost:4000/api/messages/${encodeURIComponent(msgId)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
          },
          body: JSON.stringify({ content: trimmed }),
        }
      );
      const json = await res.json();
      if (res.ok && json?.ok && json.data) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...optimisticUpdated, ...json.data } : m
          )
        );
      }
    } catch {
      // Local state & localStorage already updated
    }
    triggerToast('Message updated in PostgreSQL');
  };

  const handleConfirmPermanentDelete = async (msgId: string) => {
    const target = messages.find((m) => m.id === msgId);
    if (!target || !authUser || target.senderId !== authUser.id) return;

    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    if (inspectedMessage?.id === msgId) {
      setInspectedMessage(null);
    }
    setDeletingMessageId(null);

    try {
      await fetch(
        `http://localhost:4000/api/messages/${encodeURIComponent(msgId)}`,
        {
          method: 'DELETE',
          headers: {
            ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
          },
        }
      );
    } catch {
      // Local state & localStorage already updated
    }
    triggerToast('Message permanently deleted');
  };

  const openAuthPage = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setAuthError(null);
    setActiveView('auth');
    setMobileSidebarOpen(false);
    try {
      window.location.hash = '#/auth';
    } catch {
      // ignore
    }
  };

  const closeAuthPage = () => {
    setActiveView('chat');
    setAuthError(null);
    try {
      window.location.hash = '#/';
    } catch {
      // ignore
    }
  };

  const completeAuthentication = (user: AuthUser, token: string) => {
    if (user.userHandle) {
      registerHandleLocally(user.userHandle, user.id, user.email, user.isPrivate);
    }
    setAuthUser(user);
    setSessionToken(token);
    try {
      localStorage.setItem('pulsechat_auth_user_v1', JSON.stringify(user));
      localStorage.setItem('pulsechat_auth_token_v1', token);
    } catch {
      // ignore
    }
    setAuthStep('request');
    setOtpInput('');
    setDevPreview(null);
    setAuthError(null);
    closeAuthPage();
    triggerToast(`Signed in as ${user.name} (${user.email})`);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = authEmail.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (authMode === 'signup') {
      if (!authName.trim()) {
        setAuthError('Please enter your display name to sign up.');
        return;
      }
      const cleanRequestedHandle = sanitizeHandle(authHandle);
      if (cleanRequestedHandle.length < 2) {
        setAuthError('Please choose a unique @userID (at least 2 characters).');
        return;
      }
      const existing = knownUsersMap.get(cleanRequestedHandle.toLowerCase());
      if (
        existing &&
        existing.email &&
        existing.email !== cleanEmail &&
        existing.email !== 'jatinpersonalx@pulsechat.local'
      ) {
        setAuthError(
          `@${cleanRequestedHandle} is already taken by another user. Please choose a unique @userID.`
        );
        return;
      }
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('http://localhost:4000/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          userHandle: sanitizeHandle(authHandle) || undefined,
          name: authName.trim() || undefined,
          role: authRole.trim() || 'Verified Member',
          clientOrigin: window.location.origin,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error?.message || 'Could not send OTP.');
      }
      setDevPreview(json.data.devPreview);
      setAuthStep('verify');
      triggerToast(`OTP & Magic Link sent to ${cleanEmail}`);
    } catch {
      // Fallback local OTP & Magic Link generator when backend on port 4000 is offline
      const fallbackOtp = String(Math.floor(100000 + Math.random() * 900000));
      const fallbackToken = `local-magic-${Date.now()}`;
      setDevPreview({
        otpCode: fallbackOtp,
        magicToken: fallbackToken,
        magicLinkUrl: `${window.location.origin}/#/auth?magicToken=${fallbackToken}`,
      });
      setAuthStep('verify');
      triggerToast(`Generated OTP & Magic Link for ${cleanEmail}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpInput.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      setAuthError('Please enter the 6-digit numeric OTP code.');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authEmail.trim().toLowerCase(),
          otpCode: cleanOtp,
          userHandle: sanitizeHandle(authHandle) || undefined,
          name: authName.trim() || undefined,
          role: authRole.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error?.message || 'Invalid or expired OTP code.');
      }
      completeAuthentication(json.data.user, json.data.sessionToken);
    } catch (err) {
      // Check if matches local devPreview when running without backend
      if (devPreview && cleanOtp === devPreview.otpCode) {
        const cleanEmail = authEmail.trim().toLowerCase();
        const derivedName =
          authName.trim() ||
          cleanEmail
            .split('@')[0]
            .replace(/[._-]+/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
        const resolvedHandle =
          sanitizeHandle(authHandle) ||
          sanitizeHandle(derivedName) ||
          sanitizeHandle(cleanEmail.split('@')[0]);
        completeAuthentication(
          {
            id:
              resolvedHandle === 'jatinpersonalx'
                ? CURRENT_USER.id
                : `usr-${Date.now()}`,
            userHandle: resolvedHandle,
            email: cleanEmail,
            name: derivedName,
            role:
              resolvedHandle === 'jatinpersonalx'
                ? 'Global Chat Admin'
                : authRole.trim() || 'Verified Member',
            avatarGradient: 'from-indigo-500 to-violet-600',
          },
          `local-session-${Date.now()}`
        );
      } else {
        setAuthError(
          err instanceof Error ? err.message : 'Invalid 6-digit OTP code.'
        );
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyMagicLink = async (tokenToVerify: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(
        'http://localhost:4000/api/auth/verify-magic-link',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ magicToken: tokenToVerify }),
        }
      );
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(
          json?.error?.message || 'Invalid or expired Magic Link.'
        );
      }
      completeAuthentication(json.data.user, json.data.sessionToken);
    } catch {
      if (devPreview && tokenToVerify === devPreview.magicToken) {
        const cleanEmail = authEmail.trim().toLowerCase() || 'user@example.com';
        const derivedName =
          authName.trim() ||
          cleanEmail
            .split('@')[0]
            .replace(/[._-]+/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
        const resolvedHandle =
          sanitizeHandle(authHandle) ||
          sanitizeHandle(derivedName) ||
          sanitizeHandle(cleanEmail.split('@')[0]);
        completeAuthentication(
          {
            id:
              resolvedHandle === 'jatinpersonalx'
                ? CURRENT_USER.id
                : `usr-${Date.now()}`,
            userHandle: resolvedHandle,
            email: cleanEmail,
            name: derivedName,
            role:
              resolvedHandle === 'jatinpersonalx'
                ? 'Global Chat Admin'
                : authRole.trim() || 'Verified Member',
            avatarGradient: 'from-indigo-500 to-violet-600',
          },
          `local-session-${Date.now()}`
        );
      } else {
        setAuthError('Magic link is invalid or has expired.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (sessionToken) {
      try {
        await fetch('http://localhost:4000/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
      } catch {
        // ignore
      }
    }
    setAuthUser(null);
    setSessionToken(null);
    try {
      localStorage.removeItem('pulsechat_auth_user_v1');
      localStorage.removeItem('pulsechat_auth_token_v1');
    } catch {
      // ignore
    }
    triggerToast('Logged out — viewing in Read-Only Guest Mode');
  };

  const handleSelectRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, unreadCount: 0 } : r))
    );
    setMobileSidebarOpen(false);
    setShowCoAdminInput(false);
    setConfirmDeleteRoomId(null);
  };

  // Create a new Room (Creator becomes primary Admin)
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) {
      triggerToast('Please log in to create a room.');
      openAuthPage('login');
      return;
    }
    const cleanName = newRoomName.trim();
    if (cleanName.length < 2) {
      triggerToast('Room name must be at least 2 characters.');
      return;
    }

    const requestedCode = newRoomCode
      .trim()
      .replace(/^@+/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 12);

    if (requestedCode === '000000') {
      triggerToast('@000000 is reserved exclusively for Global Chat.');
      return;
    }
    if (
      requestedCode &&
      rooms.some(
        (r) => (r.roomCode || '').toLowerCase() === requestedCode.toLowerCase()
      )
    ) {
      triggerToast(`Room ID @${requestedCode} is already in use.`);
      return;
    }

    const generatedCode =
      requestedCode || String(Math.floor(100000 + Math.random() * 900000));

    const myHandle =
      authUser.userHandle || sanitizeHandle(authUser.name) || 'user';
    const cleanTopic =
      newRoomTopic.trim() ||
      `Admin: @${myHandle} • Invite members by typing: invite @userID y`;

    try {
      const res = await fetch('http://localhost:4000/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({
          name: cleanName,
          roomCode: generatedCode,
          topic: cleanTopic,
        }),
      });
      const json = await res.json();
      if (!res.ok && json?.error?.message) {
        triggerToast(json.error.message);
        return;
      }
      if (res.ok && json?.ok && json.data) {
        const created: Room = {
          ...json.data,
          roomCode: json.data.roomCode || generatedCode,
          unreadCount: 0,
          onlineCount: 1,
        };
        setRooms((prev) => [...prev, created]);
        setActiveRoomId(created.id);
      } else {
        throw new Error('Fallback room creation');
      }
    } catch {
      const fallbackRoom: Room = {
        id: crypto.randomUUID ? crypto.randomUUID() : `room-${Date.now()}`,
        roomCode: generatedCode,
        name: cleanName,
        topic: cleanTopic,
        adminId: authUser.id,
        adminHandle: myHandle,
        coAdminId: null,
        coAdminHandle: null,
        isGlobal: false,
        memberStatus: 'joined',
        unreadCount: 0,
        onlineCount: 1,
      };
      setRooms((prev) => [...prev, fallbackRoom]);
      setActiveRoomId(fallbackRoom.id);
    }

    setNewRoomName('');
    setNewRoomCode('');
    setNewRoomTopic('');
    setShowCreateRoomModal(false);
    triggerToast(`Created room #${cleanName} (@${generatedCode})`);
  };

  // Primary Room Admin can appoint 1 other user as Co-Admin
  const handleAssignCoAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;
    const cleanTarget = sanitizeHandle(coAdminInputHandle);
    if (!cleanTarget) {
      triggerToast('Enter a valid @userID to appoint as Co-Admin.');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:4000/api/rooms/${encodeURIComponent(
          activeRoom.id
        )}/co-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
          },
          body: JSON.stringify({ coAdminHandle: cleanTarget }),
        }
      );
      const json = await res.json();
      if (res.ok && json?.ok && json.data) {
        setRooms((prev) =>
          prev.map((r) => (r.id === activeRoom.id ? { ...r, ...json.data } : r))
        );
      } else {
        throw new Error('Local update');
      }
    } catch {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === activeRoom.id
            ? { ...r, coAdminHandle: cleanTarget }
            : r
        )
      );
    }

    setCoAdminInputHandle('');
    setShowCoAdminInput(false);
    triggerToast(`Appointed @${cleanTarget} as Co-Admin of #${activeRoom.name}`);
  };

  // Room Admin or Co-Admin can delete a custom room
  const handleDeleteRoom = async (roomIdToDelete: string) => {
    const targetRoom = rooms.find((r) => r.id === roomIdToDelete);
    if (!targetRoom || targetRoom.isGlobal) {
      triggerToast('Global Chat is the default room and cannot be deleted.');
      return;
    }

    try {
      await fetch(
        `http://localhost:4000/api/rooms/${encodeURIComponent(roomIdToDelete)}`,
        {
          method: 'DELETE',
          headers: sessionToken
            ? { Authorization: `Bearer ${sessionToken}` }
            : {},
        }
      );
    } catch {
      // ignore offline
    }

    setRooms((prev) => prev.filter((r) => r.id !== roomIdToDelete));
    setMessages((prev) => prev.filter((m) => m.roomId !== roomIdToDelete));
    setConfirmDeleteRoomId(null);
    setActiveRoomId(INITIAL_ROOMS[0].id);
    triggerToast(`Deleted room #${targetRoom.name}`);
  };

  // Accept an invitation to join a room
  const handleAcceptRoomInvite = async (roomIdToJoin: string) => {
    try {
      await fetch(
        `http://localhost:4000/api/rooms/${encodeURIComponent(
          roomIdToJoin
        )}/join`,
        {
          method: 'POST',
          headers: sessionToken
            ? { Authorization: `Bearer ${sessionToken}` }
            : {},
        }
      );
    } catch {
      // ignore offline
    }

    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomIdToJoin ? { ...r, memberStatus: 'joined' } : r
      )
    );
    setActiveRoomId(roomIdToJoin);
    setShowNotificationsDropdown(false);
    triggerToast('Joined room!');
  };

  // Filtered notifications for the logged-in user's @userID (strictly <= 40 loaded at a time)
  const myHandleLower = (
    authUser?.userHandle ||
    (authUser ? sanitizeHandle(authUser.name) : '')
  ).toLowerCase();

  const myAllNotifications = useMemo(() => {
    if (!myHandleLower) return [];
    return notifications
      .filter((n) => n.recipientHandle.toLowerCase() === myHandleLower)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [notifications, myHandleLower]);

  const displayedNotifications = useMemo(() => {
    return myAllNotifications.slice(
      notifPageOffset,
      notifPageOffset + MAX_PAGE_SIZE
    );
  }, [myAllNotifications, notifPageOffset]);

  const unreadNotificationCount = useMemo(
    () => myAllNotifications.filter((n) => !n.isRead).length,
    [myAllNotifications]
  );

  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.recipientHandle.toLowerCase() === myHandleLower
          ? { ...n, isRead: true }
          : n
      )
    );
    if (sessionToken) {
      try {
        await fetch('http://localhost:4000/api/notifications/read', {
          method: 'POST',
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
      } catch {
        // ignore
      }
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!authUser) {
      triggerToast('Please log in or sign up to send messages.');
      openAuthPage('login');
      return;
    }

    if (!draft.trim()) return;

    if (!isConnected) {
      triggerToast('Socket is offline. Reconnect to send messages.');
      return;
    }

    const senderHandle =
      authUser.userHandle || sanitizeHandle(authUser.name) || 'user';
    const extraMeta: Record<string, unknown> = {
      senderHandle,
    };
    if (customMetaKey.trim()) {
      extraMeta[customMetaKey.trim()] = customMetaVal.trim() || true;
    }

    // Check if the message is the room invite command: `invite @userID y`
    const inviteTargetHandle = parseInviteCommand(draft);
    const mentionedHandles = extractMentionedHandles(draft);
    if (mentionedHandles.length > 0) {
      extraMeta.mentions = mentionedHandles;
    }
    if (inviteTargetHandle) {
      extraMeta.invitedUserHandle = inviteTargetHandle;
    }

    const classified = classifyClientMessage(draft, extraMeta);
    const clientMessageId = `cid-${Date.now()}`;
    const optimisticId = `msg-${Date.now()}`;

    const newMsg: ChatMessage = {
      id: optimisticId,
      roomId: activeRoomId,
      senderId: authUser.id,
      senderHandle,
      senderName: authUser.name,
      senderRole: authUser.role,
      avatarGradient: authUser.avatarGradient,
      senderAvatarUrl: authUser.avatarUrl || '',
      senderBio: authUser.bio || '',
      content: classified.sanitizedContent,
      type: classified.type,
      metadata: {
        ...classified.metadata,
        senderHandle,
        senderEmail: authUser.email,
        senderAvatarUrl: authUser.avatarUrl || '',
        senderBio: authUser.bio || '',
      },
      clientMessageId,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    // Create local notifications for any @userID mentioned or invited via `invite @userID y`
    const createdNotifs: UserNotification[] = [];
    if (inviteTargetHandle) {
      createdNotifs.push({
        id: `notif-inv-${Date.now()}`,
        recipientHandle: inviteTargetHandle,
        senderId: authUser.id,
        senderName: authUser.name,
        senderHandle,
        roomId: activeRoom.id,
        roomName: activeRoom.name,
        messageId: optimisticId,
        content: `@${senderHandle} invited you to join #${activeRoom.name} ("${classified.sanitizedContent}")`,
        type: 'room_invite',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
      triggerToast(`Invited @${inviteTargetHandle} to #${activeRoom.name}`);
    }

    for (const mHandle of mentionedHandles) {
      if (mHandle === inviteTargetHandle) continue;
      createdNotifs.push({
        id: `notif-men-${Date.now()}-${mHandle}`,
        recipientHandle: mHandle,
        senderId: authUser.id,
        senderName: authUser.name,
        senderHandle,
        roomId: activeRoom.id,
        roomName: activeRoom.name,
        messageId: optimisticId,
        content: classified.sanitizedContent,
        type: 'mention',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    if (createdNotifs.length > 0) {
      setNotifications((prev) => [...createdNotifs, ...prev]);
    }

    setMessages((prev) => [...prev, newMsg]);
    setInspectedMessage(newMsg);
    setDraft('');
    setCustomMetaKey('');
    setCustomMetaVal('');

    // Send to Node.js + PostgreSQL server (`http://localhost:4000/api/messages`) with Bearer token
    fetch('http://localhost:4000/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      },
      body: JSON.stringify({
        roomId: activeRoomId,
        senderId: authUser.id,
        content: classified.sanitizedContent,
        clientMessageId,
        metadata: {
          ...classified.metadata,
          senderHandle,
          senderName: authUser.name,
          senderEmail: authUser.email,
          senderRole: authUser.role,
          avatarGradient: authUser.avatarGradient,
          senderAvatarUrl: authUser.avatarUrl || '',
          senderBio: authUser.bio || '',
        },
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('HTTP error');
        const json = await res.json();
        if (json?.ok && json.data) {
          const saved: ChatMessage = {
            ...newMsg,
            id: json.data.id,
            type: json.data.type,
            metadata: json.data.metadata,
            createdAt: json.data.createdAt,
            status: 'delivered',
          };
          setMessages((prev) =>
            prev.map((m) => (m.id === optimisticId ? saved : m))
          );
          setInspectedMessage(saved);
        }
      })
      .catch(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticId ? { ...m, status: 'delivered' } : m
          )
        );
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyJson = (obj: unknown, label: string) => {
    const ok = copyTextToClipboard(JSON.stringify(obj, null, 2));
    if (ok) {
      triggerToast(`Copied ${label} JSON to clipboard`);
    }
  };

  // Helper to render message text with clickable @userID mentions that redirect to profile
  const renderContentWithMentions = (text: string) => {
    const parts = text.split(/(@[a-zA-Z0-9_.-]{2,32})/g);
    return parts.map((part, idx) => {
      if (/^@[a-zA-Z0-9_.-]{2,32}$/.test(part)) {
        const handle = part.slice(1);
        return (
          <button
            key={`${part}-${idx}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openUserProfilePage(handle, false);
            }}
            className="mx-0.5 inline-flex cursor-pointer items-center rounded-md bg-amber-400/20 px-1.5 py-0.5 font-mono text-xs font-bold text-amber-300 underline decoration-amber-400/60 underline-offset-2 transition hover:bg-amber-400/30"
            title={`View @${handle}'s profile & message history`}
          >
            {part}
          </button>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  const isPrimaryRoomAdmin = Boolean(
    authUser &&
      activeRoom.adminHandle &&
      (authUser.userHandle || sanitizeHandle(authUser.name)).toLowerCase() ===
        activeRoom.adminHandle.toLowerCase()
  );

  const isRoomAdminOrCoAdmin = Boolean(
    isPrimaryRoomAdmin ||
      (authUser &&
        activeRoom.coAdminHandle &&
        (authUser.userHandle || sanitizeHandle(authUser.name)).toLowerCase() ===
          activeRoom.coAdminHandle.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen w-full font-sans transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <style>{`button, a, [role="button"], label { cursor: pointer; }`}</style>
      {/* Top Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-medium text-white shadow-lg shadow-indigo-500/25 transition-all">
          <Check className="h-4 w-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* DEDICATED USER PROFILE & MESSAGE HISTORY PAGE (#/profile & #/users/:id) */}
      {activeView === 'profile' && (
        <div
          className={`fixed inset-0 z-50 flex flex-col overflow-y-auto ${
            isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
          }`}
        >
          <div
            className={`flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-8 ${
              isDark
                ? 'border-slate-800/80 bg-slate-900/80'
                : 'border-slate-200 bg-white/90'
            } backdrop-blur-md`}
          >
            <button
              type="button"
              onClick={closeAuthPage}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                isDark
                  ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>← Back to Chat Rooms</span>
            </button>

            <div className="flex items-center gap-2">
              {!authUser && (
                <button
                  type="button"
                  onClick={() => openAuthPage('login')}
                  className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  Log In / Sign Up
                </button>
              )}
              <button
                type="button"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                  isDark
                    ? 'border-slate-800 bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isDark ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-4xl flex-1 space-y-6 p-4 sm:p-8">
            {/* Profile Banner & Identity Card */}
            <div
              className={`overflow-hidden rounded-3xl border shadow-lg ${
                isDark
                  ? 'border-slate-800 bg-slate-900/90'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div
                className={`h-28 w-full bg-gradient-to-r ${viewedProfileData.avatarGradient}`}
              />
              <div className="px-6 pb-6">
                <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
                  <div className="flex items-end gap-4">
                    {viewedProfileData.avatarUrl ? (
                      <img
                        src={viewedProfileData.avatarUrl}
                        alt={viewedProfileData.name}
                        className="h-24 w-24 rounded-3xl border-4 border-slate-900 bg-slate-800 object-cover shadow-md"
                      />
                    ) : (
                      <div
                        className={`flex h-24 w-24 items-center justify-center rounded-3xl border-4 ${
                          isDark ? 'border-slate-900' : 'border-white'
                        } bg-gradient-to-br ${
                          viewedProfileData.avatarGradient
                        } text-2xl font-bold text-white shadow-md`}
                      >
                        {getInitials(viewedProfileData.name)}
                      </div>
                    )}
                    <div className="pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl font-bold sm:text-2xl">
                          {viewedProfileData.name}
                        </h1>
                        <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-bold text-emerald-400">
                          @{viewedProfileData.userHandle}
                        </span>
                        <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
                          {viewedProfileData.role}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            viewedProfileData.isPrivate
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-emerald-500/15 text-emerald-400'
                          }`}
                        >
                          {viewedProfileData.isPrivate
                            ? '🔒 Private Profile'
                            : '🌐 Public Profile'}
                        </span>
                      </div>
                      {viewedProfileData.email && (
                        <p
                          className={`text-xs ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {viewedProfileData.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {authUser && authUser.id === viewedProfileData.id && (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile((v) => !v)}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-500"
                    >
                      {isEditingProfile ? 'Cancel Editing' : '✎ Edit My Profile'}
                    </button>
                  )}
                </div>

                {!isEditingProfile && (
                  <div className="mt-5">
                    <h2
                      className={`text-xs font-bold tracking-wider uppercase ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Description About Self
                    </h2>
                    <p
                      className={`mt-1.5 text-sm leading-relaxed ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      {viewedProfileData.bio}
                    </p>
                  </div>
                )}

                {/* Edit Own Profile Form */}
                {authUser &&
                  authUser.id === viewedProfileData.id &&
                  isEditingProfile && (
                    <form
                      onSubmit={handleSaveProfileChanges}
                      className={`mt-6 space-y-4 rounded-2xl border p-4 sm:p-5 ${
                        isDark
                          ? 'border-slate-800 bg-slate-950/70'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <h3 className="text-sm font-bold">
                        Edit Profile (Saved Securely to PostgreSQL)
                      </h3>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-semibold">
                            Unique @userID Handle
                          </label>
                          <input
                            type="text"
                            required
                            value={profileHandleInput}
                            onChange={(e) =>
                              setProfileHandleInput(
                                sanitizeHandle(e.target.value)
                              )
                            }
                            placeholder="jatinpersonalx"
                            className={`w-full rounded-xl border px-3 py-2 font-mono text-sm ${
                              isDark
                                ? 'border-slate-800 bg-slate-900 text-emerald-400'
                                : 'border-slate-300 bg-white text-indigo-700'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold">
                            Profile Name
                          </label>
                          <input
                            type="text"
                            required
                            value={profileNameInput}
                            onChange={(e) =>
                              setProfileNameInput(e.target.value)
                            }
                            className={`w-full rounded-xl border px-3 py-2 text-sm ${
                              isDark
                                ? 'border-slate-800 bg-slate-900 text-slate-100'
                                : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold">
                            Role / Title
                          </label>
                          <input
                            type="text"
                            value={profileRoleInput}
                            onChange={(e) =>
                              setProfileRoleInput(e.target.value)
                            }
                            className={`w-full rounded-xl border px-3 py-2 text-sm ${
                              isDark
                                ? 'border-slate-800 bg-slate-900 text-slate-100'
                                : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold">
                          Profile Picture (Paste URL, Upload File, or Pick Avatar)
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="text"
                            value={profileAvatarInput}
                            onChange={(e) =>
                              setProfileAvatarInput(e.target.value)
                            }
                            placeholder="https://example.com/photo.png"
                            className={`min-w-[200px] flex-1 rounded-xl border px-3 py-2 text-xs ${
                              isDark
                                ? 'border-slate-800 bg-slate-900 text-slate-100'
                                : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                          <label className="cursor-pointer rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-3 py-2 text-xs font-semibold text-indigo-400 hover:bg-indigo-500/25">
                            Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProfileImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] opacity-75">
                            Presets:
                          </span>
                          {AVATAR_PRESETS.map((preset, idx) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setProfileAvatarInput(preset)}
                              className={`h-8 w-8 overflow-hidden rounded-full border-2 transition ${
                                profileAvatarInput === preset
                                  ? 'border-indigo-500 scale-110'
                                  : 'border-transparent opacity-80 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={preset}
                                alt={`Preset ${idx + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold">
                          Description About Self
                        </label>
                        <textarea
                          rows={3}
                          value={profileBioInput}
                          onChange={(e) => setProfileBioInput(e.target.value)}
                          placeholder="Write a short bio about yourself..."
                          className={`w-full rounded-xl border px-3 py-2 text-sm ${
                            isDark
                              ? 'border-slate-800 bg-slate-900 text-slate-100'
                              : 'border-slate-300 bg-white text-slate-900'
                          }`}
                        />
                      </div>

                      {/* Profile Privacy Option: Public vs Private Message History */}
                      <div
                        className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3.5 ${
                          isDark
                            ? 'border-slate-800 bg-slate-900/90'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">
                            Profile Privacy ({profilePrivateInput ? 'Private' : 'Public'})
                          </div>
                          <p className="text-[11px] opacity-75">
                            When Private is selected, only you can view your message history.
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setProfilePrivateInput(false)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                              !profilePrivateInput
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : isDark
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            🌐 Public
                          </button>
                          <button
                            type="button"
                            onClick={() => setProfilePrivateInput(true)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                              profilePrivateInput
                                ? 'bg-amber-600 text-white shadow-xs'
                                : isDark
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            🔒 Private
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={profileSaving}
                          className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
                        >
                          {profileSaving
                            ? 'Saving to PostgreSQL...'
                            : 'Save Profile Changes'}
                        </button>
                      </div>
                    </form>
                  )}
              </div>
            </div>

            {/* User's Message History (Hidden from others if Private Profile is enabled) */}
            <div
              className={`rounded-3xl border p-6 shadow-sm ${
                isDark
                  ? 'border-slate-800 bg-slate-900/90'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold">
                    {viewedProfileData.isPrivate &&
                    (!authUser || authUser.id !== viewedProfileData.id)
                      ? 'Message History (Private)'
                      : `Message History (${viewedUserMessages.length})`}
                  </h2>
                  <p
                    className={`text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Click any message below to jump directly to that exact
                    message in the chat room
                  </p>
                </div>
                {viewedProfileData.isPrivate &&
                  authUser &&
                  authUser.id === viewedProfileData.id && (
                    <span className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                      🔒 Visible only to you (Private Profile)
                    </span>
                  )}
              </div>

              {viewedProfileData.isPrivate &&
              (!authUser || authUser.id !== viewedProfileData.id) ? (
                <div
                  className={`rounded-2xl border p-8 text-center ${
                    isDark
                      ? 'border-amber-500/25 bg-amber-500/5 text-amber-200'
                      : 'border-amber-300 bg-amber-50 text-amber-900'
                  }`}
                >
                  <p className="text-sm font-bold">
                    🔒 @{viewedProfileData.userHandle}&apos;s Profile is Private
                  </p>
                  <p className="mt-1 text-xs opacity-80">
                    This user has chosen to keep their message history private.
                    Only @{viewedProfileData.userHandle} can view their posted
                    messages.
                  </p>
                </div>
              ) : viewedUserMessages.length === 0 ? (
                <div className="rounded-2xl border border-slate-800/50 p-6 text-center text-xs opacity-70">
                  No messages posted by {viewedProfileData.name} yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {viewedUserMessages.map((m) => {
                    const roomObj = rooms.find((r) => r.id === m.roomId);
                    const roomName = roomObj?.name || 'Global Chat';
                    const roomCode = roomObj?.isGlobal
                      ? '000000'
                      : roomObj?.roomCode || '000000';
                    return (
                      <div
                        key={m.id}
                        onClick={() =>
                          handleJumpToExactMessage(m.roomId, m.id)
                        }
                        title="Click to redirect to this exact message in the chat room"
                        className={`group cursor-pointer rounded-2xl border p-4 transition ${
                          isDark
                            ? 'border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-950'
                            : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-white'
                        }`}
                      >
                        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-indigo-500/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-indigo-400">
                              #{roomName} (@{roomCode})
                            </span>
                            <span
                              className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                                m.type === 'link'
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : 'bg-sky-500/15 text-sky-400'
                              }`}
                            >
                              {m.type}
                            </span>
                            {(m.updatedAt || Boolean(m.metadata?.edited)) && (
                              <span className="text-[10px] italic opacity-75">
                                (edited)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] opacity-75">
                              {formatTime(m.createdAt)}
                            </span>
                            <span className="text-[11px] font-semibold text-indigo-400 opacity-0 transition group-hover:opacity-100">
                              Jump to message →
                            </span>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {m.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED MODULAR LOGIN / SIGN UP PAGE (Email OTP & Magic Link) */}
      {activeView === 'auth' && (
        <div
          className={`fixed inset-0 z-50 flex flex-col overflow-y-auto ${
            isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
          }`}
        >
          {/* Top Bar on Auth Page */}
          <div
            className={`flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-8 ${
              isDark
                ? 'border-slate-800/80 bg-slate-900/70'
                : 'border-slate-200 bg-white/90'
            }`}
          >
            <button
              type="button"
              onClick={closeAuthPage}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                isDark
                  ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>← Back to Chat (Read-Only Guest)</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                isDark
                  ? 'border-slate-800 bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Centered Auth Card */}
          <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
            <div
              className={`w-full max-w-md rounded-3xl border p-6 sm:p-8 shadow-xl ${
                isDark
                  ? 'border-slate-800 bg-slate-900/90 shadow-black/40'
                  : 'border-slate-200 bg-white shadow-slate-200/70'
              }`}
            >
              {/* Brand Header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">
                    {authMode === 'login'
                      ? 'Welcome back to PulseChat'
                      : 'Create your PulseChat account'}
                  </h2>
                  <p
                    className={`text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Passwordless Email OTP &amp; Magic Link Authentication
                  </p>
                </div>
              </div>

              {/* Log In vs Sign Up Mode Switcher */}
              <div
                className={`mb-6 grid grid-cols-2 rounded-2xl p-1 ${
                  isDark ? 'bg-slate-950' : 'bg-slate-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthStep('request');
                    setAuthError(null);
                  }}
                  className={`rounded-xl py-2 text-xs font-bold transition ${
                    authMode === 'login'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthStep('request');
                    setAuthError(null);
                  }}
                  className={`rounded-xl py-2 text-xs font-bold transition ${
                    authMode === 'signup'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {authError && (
                <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-400">
                  {authError}
                </div>
              )}

              {authStep === 'request' ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none ${
                        isDark
                          ? 'border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:border-indigo-500'
                          : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                      }`}
                    />
                  </div>

                  {authMode === 'signup' && (
                    <>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold">
                          Unique @userID Handle (Taggable ID)
                        </label>
                        <input
                          type="text"
                          required
                          value={authHandle}
                          onChange={(e) =>
                            setAuthHandle(sanitizeHandle(e.target.value))
                          }
                          placeholder="e.g. jatinpersonalx"
                          className={`w-full rounded-xl border px-3.5 py-2.5 font-mono text-sm focus:outline-none ${
                            isDark
                              ? 'border-slate-800 bg-slate-950 text-emerald-400 placeholder-slate-500 focus:border-indigo-500'
                              : 'border-slate-300 bg-slate-50 text-indigo-700 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold">
                          Display Name
                        </label>
                        <input
                          type="text"
                          required
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="e.g. Jatin Sharma"
                          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none ${
                            isDark
                              ? 'border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:border-indigo-500'
                              : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold">
                          Role / Badge
                        </label>
                        <input
                          type="text"
                          value={authRole}
                          onChange={(e) => setAuthRole(e.target.value)}
                          placeholder="e.g. Full-Stack Developer"
                          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none ${
                            isDark
                              ? 'border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:border-indigo-500'
                              : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                          }`}
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {authLoading
                        ? 'Sending OTP & Magic Link...'
                        : 'Send 6-Digit OTP & Magic Link'}
                    </span>
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-xs font-semibold">
                          Enter 6-Digit OTP sent to {authEmail}
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthStep('request');
                            setOtpInput('');
                          }}
                          className="text-[11px] font-semibold text-indigo-400 hover:underline"
                        >
                          Change email
                        </button>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) =>
                          setOtpInput(e.target.value.replace(/\D/g, ''))
                        }
                        placeholder="123456"
                        className={`w-full rounded-xl border px-4 py-3 text-center font-mono text-xl font-bold tracking-[0.4em] focus:outline-none ${
                          isDark
                            ? 'border-slate-800 bg-slate-950 text-emerald-400 placeholder-slate-700 focus:border-indigo-500'
                            : 'border-slate-300 bg-slate-50 text-indigo-700 placeholder-slate-300 focus:border-indigo-500'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading || otpInput.length !== 6}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-500 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      <span>Verify 6-Digit OTP &amp; Unlock Chat</span>
                    </button>
                  </form>

                  {/* Instant Dev Inbox Preview for Testing Both OTP and Magic Link */}
                  {devPreview && (
                    <div
                      className={`rounded-2xl border p-4 text-xs ${
                        isDark
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold uppercase tracking-wider">
                          📬 Simulated Email Inbox (Dev Preview)
                        </span>
                        <button
                          type="button"
                          onClick={() => setOtpInput(devPreview.otpCode)}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500"
                        >
                          Auto-Fill OTP ({devPreview.otpCode})
                        </button>
                      </div>
                      <p className="mt-2 text-[11px] opacity-90">
                        Your Node.js terminal also printed this 6-digit OTP and
                        Magic Link. Or click the Magic Link below to sign in
                        instantly without typing a code:
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          handleVerifyMagicLink(devPreview.magicToken)
                        }
                        className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-600/20 py-2 font-semibold text-emerald-300 transition hover:bg-emerald-600/30"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>✨ Click Magic Link to Sign In Instantly</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Responsive App Shell */}
      <div className="mx-auto flex h-screen max-w-[1600px] overflow-hidden">
        {/* Mobile Backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* LEFT SIDEBAR: Rooms, Connection Status & Architecture Legend */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r transition-transform duration-200 lg:static lg:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${
            isDark
              ? 'border-slate-800/80 bg-slate-900/95'
              : 'border-slate-200 bg-white'
          }`}
        >
          {/* Brand Header */}
          <div
            className={`flex h-16 items-center justify-between border-b px-4 ${
              isDark ? 'border-slate-800/80' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-tight">
                    PulseChat
                  </span>
                  <span className="rounded-md bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400">
                    JSONB
                  </span>
                </div>
                <p
                  className={`text-[11px] ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Socket.IO + PostgreSQL
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className={`rounded-lg p-1.5 lg:hidden ${
                isDark
                  ? 'text-slate-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              aria-label="Close channels menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Socket Connection Toggle Card */}
          <div className="p-3">
            <div
              className={`rounded-xl border p-3 ${
                isDark
                  ? 'border-slate-800 bg-slate-950/60'
                  : 'border-slate-200/80 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isConnected
                        ? 'bg-emerald-500 shadow-xs shadow-emerald-500'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-xs font-semibold">
                    {isConnected ? 'Socket Connected' : 'Socket Disconnected'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isConnected;
                    setIsConnected(next);
                    triggerToast(
                      next
                        ? 'Socket.IO reconnected to room'
                        : 'Simulated Socket.IO disconnect'
                    );
                  }}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                    isConnected
                      ? isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {isConnected ? (
                    <>
                      <WifiOff className="h-3 w-3" />
                      <span>Go Offline</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="h-3 w-3" />
                      <span>Reconnect</span>
                    </>
                  )}
                </button>
              </div>
              <p
                className={`mt-1.5 text-[11px] leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Events use <code className="font-mono">message:send</code> with
                PostgreSQL <code className="font-mono">RETURNING *</code> ack.
              </p>
            </div>
          </div>

          {/* Channels List + Unlimited Room Creation */}
          <div className="flex-1 overflow-y-auto px-3 py-2">
            <div className="mb-2 flex items-center justify-between px-2">
              <span
                className={`text-[11px] font-semibold tracking-wider uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Rooms ({rooms.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!authUser) {
                    triggerToast('Log in or sign up to create a new room.');
                    openAuthPage('login');
                    return;
                  }
                  setShowCreateRoomModal((v) => !v);
                }}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-indigo-600/20 px-2 py-1 text-[11px] font-bold text-indigo-400 transition hover:bg-indigo-600/30"
              >
                <Plus className="h-3 w-3" />
                <span>Create Room</span>
              </button>
            </div>

            {/* Search Rooms by @roomID (e.g. @000000) or Room Name */}
            <div className="relative mb-2.5 px-1">
              <Search
                className={`pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              />
              <input
                type="text"
                value={roomSearchQuery}
                onChange={(e) => setRoomSearchQuery(e.target.value)}
                placeholder="Search by @roomID or name..."
                className={`w-full rounded-xl border py-1.5 pr-3 pl-8 text-xs focus:outline-none ${
                  isDark
                    ? 'border-slate-800 bg-slate-950/90 text-slate-200 placeholder-slate-500 focus:border-indigo-500'
                    : 'border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                }`}
              />
            </div>

            {/* Inline Create Room Form */}
            {showCreateRoomModal && (
              <form
                onSubmit={handleCreateRoom}
                className={`mb-3 space-y-2 rounded-2xl border p-3 ${
                  isDark
                    ? 'border-indigo-500/30 bg-slate-950/90'
                    : 'border-indigo-200 bg-indigo-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">
                    New Room (You = Admin)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCreateRoomModal(false)}
                    className="text-xs opacity-70 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Room name (e.g. backend-team)"
                  className={`w-full rounded-xl border px-2.5 py-1.5 text-xs ${
                    isDark
                      ? 'border-slate-800 bg-slate-900 text-slate-100'
                      : 'border-slate-300 bg-white text-slate-900'
                  }`}
                />
                <input
                  type="text"
                  value={newRoomCode}
                  onChange={(e) =>
                    setNewRoomCode(
                      e.target.value.replace(/^@+/, '').replace(/[^a-zA-Z0-9_-]/g, '')
                    )
                  }
                  placeholder="Custom @roomID (optional, auto-generated)"
                  className={`w-full rounded-xl border px-2.5 py-1.5 font-mono text-xs ${
                    isDark
                      ? 'border-slate-800 bg-slate-900 text-emerald-400'
                      : 'border-slate-300 bg-white text-indigo-700'
                  }`}
                />
                <input
                  type="text"
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                  placeholder="Topic (optional)"
                  className={`w-full rounded-xl border px-2.5 py-1.5 text-xs ${
                    isDark
                      ? 'border-slate-800 bg-slate-900 text-slate-100'
                      : 'border-slate-300 bg-white text-slate-900'
                  }`}
                />
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-xl bg-indigo-600 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  Create Room
                </button>
              </form>
            )}

            <div className="space-y-1">
              {displayedRooms.map((room) => {
                const active = room.id === activeRoomId;
                const displayRoomCode = room.isGlobal
                  ? '000000'
                  : room.roomCode || room.id.slice(0, 6);
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => handleSelectRoom(room.id)}
                    className={`group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                      active
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                        : isDark
                        ? 'text-slate-300 hover:bg-slate-800/70'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Hash
                        className={`h-4 w-4 shrink-0 ${
                          active
                            ? 'text-indigo-200'
                            : isDark
                            ? 'text-slate-500'
                            : 'text-slate-400'
                        }`}
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="truncate text-sm font-medium">
                            {room.name}
                          </span>
                          <span
                            className={`shrink-0 rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                              active
                                ? 'bg-white/20 text-white'
                                : isDark
                                ? 'bg-slate-800 text-emerald-400'
                                : 'bg-slate-200/80 text-indigo-700'
                            }`}
                          >
                            @{displayRoomCode}
                          </span>
                        </div>
                        <div
                          className={`truncate text-[10px] ${
                            active
                              ? 'text-indigo-100/85'
                              : isDark
                              ? 'text-slate-500'
                              : 'text-slate-400'
                          }`}
                        >
                          Admin: @{room.adminHandle || 'jatinpersonalx'}
                          {room.coAdminHandle
                            ? ` • Co: @${room.coAdminHandle}`
                            : ''}
                        </div>
                      </div>
                    </div>
                    {room.memberStatus === 'invited' ? (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptRoomInvite(room.id);
                        }}
                        className="ml-2 rounded-lg bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-emerald-400"
                      >
                        Join
                      </span>
                    ) : (
                      room.unreadCount > 0 && (
                        <span
                          className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            active
                              ? 'bg-white text-indigo-600'
                              : 'bg-indigo-500 text-white'
                          }`}
                        >
                          {room.unreadCount}
                        </span>
                      )
                    )}
                  </button>
                );
              })}
            </div>

            {/* Architecture Type Summary */}
            <div className="mt-6">
              <div className="mb-2 px-2">
                <span
                  className={`text-[11px] font-semibold tracking-wider uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Forward-Compatible Types
                </span>
              </div>
              <div
                className={`space-y-2 rounded-xl border p-3 text-xs ${
                  isDark
                    ? 'border-slate-800 bg-slate-950/40 text-slate-300'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex items-center rounded-md bg-sky-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-400">
                    text
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Standard message string with extensible JSONB client
                    metadata.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex items-center rounded-md bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                    link
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Auto-detected HTTP/HTTPS URL with parsed hostname, path, and
                    OpenGraph unfurl card.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Left Corner: Login / Sign Up Button (Guest) OR Authenticated User Profile */}
          <div
            className={`border-t p-3 ${
              isDark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-slate-50/70'
            }`}
          >
            {authUser ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openUserProfilePage(authUser.id, true)}
                    className="group flex min-w-0 items-center gap-2.5 text-left"
                    title="Click to open and edit your profile"
                  >
                    {authUser.avatarUrl ? (
                      <img
                        src={authUser.avatarUrl}
                        alt={authUser.name}
                        className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-indigo-500/40 transition group-hover:ring-indigo-400"
                      />
                    ) : (
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${authUser.avatarGradient} text-xs font-bold text-white shadow-xs ring-2 ring-transparent transition group-hover:ring-indigo-400`}
                      >
                        {getInitials(authUser.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold group-hover:text-indigo-400">
                        {authUser.name}
                      </p>
                      <p
                        className={`truncate text-[11px] ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        Edit Profile →
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className={`rounded-xl border p-2 transition ${
                      isDark
                        ? 'border-slate-800 bg-slate-800/70 text-amber-400 hover:bg-slate-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                    title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                    aria-label="Toggle color theme"
                  >
                    {isDark ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openUserProfilePage(authUser.id, true)}
                    className="rounded-xl bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-400 transition hover:bg-indigo-600/30"
                  >
                    My Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      isDark
                        ? 'border-slate-800 bg-slate-900 text-slate-300 hover:border-rose-500/40 hover:text-rose-300'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:text-rose-600'
                    }`}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span
                      className={`text-xs font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Guest (View-Only)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className={`rounded-xl border p-1.5 transition ${
                      isDark
                        ? 'border-slate-800 bg-slate-800/70 text-amber-400 hover:bg-slate-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                    title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                    aria-label="Toggle color theme"
                  >
                    {isDark ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => openAuthPage('login')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Log In / Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER COLUMN: Chat Header, Filter Bar, Message Stream, Composer */}
        <main className="flex min-w-0 flex-1 flex-col">
          {/* Top Room Navbar */}
          <header
            className={`flex h-16 shrink-0 items-center justify-between border-b px-3 sm:px-5 ${
              isDark
                ? 'border-slate-800/80 bg-slate-900/60'
                : 'border-slate-200 bg-white/90'
            } backdrop-blur-md`}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className={`rounded-xl p-2 lg:hidden ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                aria-label="Open channels sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-sm font-bold sm:text-base">
                    #{activeRoom.name}
                  </h1>
                  <span
                    className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ${
                      isDark
                        ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                        : 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300'
                    }`}
                    title="Unique Room ID"
                  >
                    @{activeRoom.isGlobal ? '000000' : activeRoom.roomCode || activeRoom.id.slice(0, 6)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      openUserProfilePage(
                        activeRoom.adminHandle || 'jatinpersonalx',
                        false
                      )
                    }
                    className="cursor-pointer rounded-md bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/25"
                    title="Click to view Room Admin profile"
                  >
                    Admin: @{activeRoom.adminHandle || 'jatinpersonalx'}
                  </button>
                  {activeRoom.coAdminHandle && (
                    <button
                      type="button"
                      onClick={() =>
                        openUserProfilePage(
                          activeRoom.coAdminHandle || '',
                          false
                        )
                      }
                      className="cursor-pointer rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/25"
                      title="Click to view Co-Admin profile"
                    >
                      Co-Admin: @{activeRoom.coAdminHandle}
                    </button>
                  )}
                </div>
                <p
                  className={`truncate text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {activeRoom.topic}
                </p>
              </div>
            </div>

            {/* Right Controls: Search, Notification Bell (<=40), Theme Toggle & JSONB Inspector */}
            <div className="relative flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search
                  className={`pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages or domains..."
                  className={`w-48 rounded-xl border py-1.5 pr-3 pl-8 text-xs transition focus:w-60 focus:outline-none ${
                    isDark
                      ? 'border-slate-800 bg-slate-950/80 text-slate-200 placeholder-slate-500 focus:border-indigo-500'
                      : 'border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition ${
                  isDark
                    ? 'border-slate-800 bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isDark ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>

              {/* Top-Right Notification Bell Icon (Mentions & Room Invites, Max 40 Loaded) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    const nextOpen = !showNotificationsDropdown;
                    setShowNotificationsDropdown(nextOpen);
                    if (nextOpen && unreadNotificationCount > 0) {
                      handleMarkAllNotificationsRead();
                    }
                  }}
                  className={`relative flex cursor-pointer items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition ${
                    showNotificationsDropdown
                      ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-400'
                      : isDark
                      ? 'border-slate-800 bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                      : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Notifications (@userID mentions & room invites)"
                  aria-label="Open notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotificationCount > 0 && (
                    <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                      {unreadNotificationCount > 40
                        ? '40+'
                        : unreadNotificationCount}
                    </span>
                  )}
                </button>

                {showNotificationsDropdown && (
                  <>
                    {/* Click-away dim/blur backdrop to isolate notification panel from background noise */}
                    <div
                      onClick={() => setShowNotificationsDropdown(false)}
                      className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]"
                    />
                    <div
                      style={{
                        backgroundColor: isDark
                          ? 'rgba(15, 23, 42, 0.97)'
                          : 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(28px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                      }}
                      className={`absolute right-0 z-50 mt-2.5 w-80 rounded-3xl border p-4 shadow-[0_28px_70px_rgba(0,0,0,0.85)] ring-1 sm:w-96 ${
                        isDark
                          ? 'border-slate-700/90 text-slate-100 ring-white/15'
                          : 'border-slate-300 text-slate-900 ring-slate-900/10'
                      }`}
                    >
                    <div className="mb-2 flex items-center justify-between border-b border-slate-800/40 pb-2">
                      <div>
                        <h3 className="text-xs font-bold">
                          Notifications ({displayedNotifications.length} / max 40)
                        </h3>
                        <p className="text-[10px] opacity-70">
                          {authUser
                            ? `Mentions & invites for @${myHandleLower}`
                            : 'Log in to receive @userID tag notifications'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNotificationsDropdown(false)}
                        className="rounded-lg p-1 text-xs opacity-70 hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                      {displayedNotifications.length === 0 ? (
                        <div className="py-8 text-center text-xs opacity-70">
                          No notifications yet. Tag someone with{' '}
                          <code className="font-mono">@userID</code> or send{' '}
                          <code className="font-mono">invite @userID y</code>!
                        </div>
                      ) : (
                        displayedNotifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              setShowNotificationsDropdown(false);
                              if (n.messageId) {
                                handleJumpToExactMessage(n.roomId, n.messageId);
                              } else {
                                handleSelectRoom(n.roomId);
                              }
                            }}
                            className={`cursor-pointer rounded-2xl border p-3 text-xs shadow-sm transition ${
                              isDark
                                ? 'border-slate-700/80 bg-slate-950 hover:border-indigo-500/60'
                                : 'border-slate-200 bg-slate-100 hover:border-indigo-400'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-indigo-400">
                                @{n.senderHandle} in #{n.roomName}
                              </span>
                              <span className="text-[10px] opacity-70">
                                {formatTime(n.createdAt)}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-[11px] opacity-90">
                              {n.content}
                            </p>
                            {n.type === 'room_invite' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptRoomInvite(n.roomId);
                                }}
                                className="mt-2 rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-500"
                              >
                                Accept Invite &amp; Join #{n.roomName}
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {myAllNotifications.length > MAX_PAGE_SIZE && (
                      <div className="mt-2 flex items-center justify-between border-t border-slate-800/40 pt-2 text-[11px]">
                        <button
                          type="button"
                          disabled={notifPageOffset === 0}
                          onClick={() =>
                            setNotifPageOffset((o) =>
                              Math.max(0, o - MAX_PAGE_SIZE)
                            )
                          }
                          className="rounded px-2 py-0.5 font-semibold text-indigo-400 disabled:opacity-40"
                        >
                          ← Newer 40
                        </button>
                        <button
                          type="button"
                          disabled={
                            notifPageOffset + MAX_PAGE_SIZE >=
                            myAllNotifications.length
                          }
                          onClick={() =>
                            setNotifPageOffset((o) => o + MAX_PAGE_SIZE)
                          }
                          className="rounded px-2 py-0.5 font-semibold text-indigo-400 disabled:opacity-40"
                        >
                          Older 40 →
                        </button>
                      </div>
                    )}
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowInspectorPanel((v) => !v)}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition ${
                  showInspectorPanel
                    ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-400'
                    : isDark
                    ? 'border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Toggle PostgreSQL JSONB Inspector"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">JSONB Inspector</span>
              </button>
            </div>
          </header>

          {/* Secondary Filter Bar: Filter by Message Type ('all' | 'text' | 'link') */}
          <div
            className={`flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 sm:px-5 ${
              isDark
                ? 'border-slate-800/60 bg-slate-900/30'
                : 'border-slate-200/70 bg-slate-100/60'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Filter
                className={`h-3.5 w-3.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Type filter:
              </span>
              <div className="flex items-center gap-1">
                {(['all', 'text', 'link'] as const).map((t) => {
                  const active = typeFilter === t;
                  const count =
                    t === 'all'
                      ? roomCounts.total
                      : t === 'link'
                      ? roomCounts.links
                      : roomCounts.text;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTypeFilter(t)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition ${
                        active
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : isDark
                          ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                      }`}
                    >
                      {t} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Room Admin Controls: Appoint 1 Co-Admin & Delete Room */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] opacity-75">
                Showing {filteredMessages.length} msg(s) (max 40/page)
              </span>

              {isPrimaryRoomAdmin && (
                <button
                  type="button"
                  onClick={() => setShowCoAdminInput((v) => !v)}
                  className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-400 hover:bg-indigo-500/20"
                >
                  {activeRoom.coAdminHandle
                    ? `Change Co-Admin (@${activeRoom.coAdminHandle})`
                    : '+ Make 1 Co-Admin'}
                </button>
              )}

              {isRoomAdminOrCoAdmin && !activeRoom.isGlobal && (
                <>
                  {confirmDeleteRoomId === activeRoom.id ? (
                    <div className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 text-[11px]">
                      <span className="font-semibold text-rose-400">
                        Delete #{activeRoom.name}?
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteRoom(activeRoom.id)}
                        className="rounded bg-rose-600 px-2 py-0.5 font-bold text-white hover:bg-rose-500"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteRoomId(null)}
                        className="px-1 text-slate-400 hover:text-white"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteRoomId(activeRoom.id)}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-400 hover:bg-rose-500/20"
                    >
                      🗑 Delete Room
                    </button>
                  )}
                </>
              )}
            </div>

            {showCoAdminInput && isPrimaryRoomAdmin && (
              <form
                onSubmit={handleAssignCoAdmin}
                className="flex w-full items-center gap-2 pt-1"
              >
                <input
                  type="text"
                  value={coAdminInputHandle}
                  onChange={(e) => setCoAdminInputHandle(e.target.value)}
                  placeholder="Enter @userID to appoint as 1 other Admin..."
                  className={`flex-1 rounded-lg border px-2.5 py-1 font-mono text-xs ${
                    isDark
                      ? 'border-slate-800 bg-slate-950 text-slate-200'
                      : 'border-slate-300 bg-white text-slate-800'
                  }`}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  Save Co-Admin
                </button>
              </form>
            )}

            {/* Mobile Search Input */}
            <div className="w-full sm:w-auto md:hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter messages..."
                className={`w-full rounded-lg border px-2.5 py-1 text-xs ${
                  isDark
                    ? 'border-slate-800 bg-slate-950 text-slate-200 placeholder-slate-500'
                    : 'border-slate-200 bg-white text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Message Stream (Strictly <= 40 Messages Loaded at a Time) */}
          <div
            ref={messagesContainerRef}
            onScroll={handleMessageStreamScroll}
            className="relative flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-6"
          >
            {canLoadOlderMessages && (
              <div className="flex justify-center pb-2">
                <button
                  type="button"
                  onClick={handleLoadOlderMessages}
                  className="cursor-pointer rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-400 transition hover:bg-indigo-500/20"
                >
                  ↑ Load older messages (max 40 at a time)
                </button>
              </div>
            )}
            {filteredMessages.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${
                    isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  <MessageSquare className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold">No matching messages</p>
                <p
                  className={`mt-1 max-w-xs text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Try switching the message type filter or send a new URL or
                  text message below.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isOwn = authUser ? msg.senderId === authUser.id : false;
                const isSelected = inspectedMessage?.id === msg.id;

                const isHighlighted = highlightedMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    id={`chat-msg-${msg.id}`}
                    className={`group flex items-start gap-3 rounded-2xl transition-all duration-500 ${
                      isOwn ? 'flex-row-reverse' : 'flex-row'
                    } ${
                      isHighlighted
                        ? 'bg-indigo-500/15 p-2 ring-2 ring-indigo-400'
                        : ''
                    }`}
                  >
                    {/* Clickable Sender Avatar -> Opens Sender's Profile & Message History */}
                    <button
                      type="button"
                      onClick={() => openUserProfilePage(msg.senderId, false)}
                      title={`View ${msg.senderName}'s profile & message history`}
                      className="shrink-0 rounded-full transition hover:scale-105 focus:outline-none"
                    >
                      {msg.senderAvatarUrl ||
                      typeof msg.metadata?.senderAvatarUrl === 'string' ? (
                        <img
                          src={
                            msg.senderAvatarUrl ||
                            String(msg.metadata?.senderAvatarUrl)
                          }
                          alt={msg.senderName}
                          className="h-9 w-9 rounded-full object-cover shadow-sm ring-2 ring-indigo-500/30"
                        />
                      ) : (
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${msg.avatarGradient} text-xs font-bold text-white shadow-sm`}
                        >
                          {getInitials(msg.senderName)}
                        </div>
                      )}
                    </button>

                    {/* Message Bubble Wrapper */}
                    <div
                      className={`flex max-w-[85%] flex-col sm:max-w-[72%] ${
                        isOwn ? 'items-end' : 'items-start'
                      }`}
                    >
                      {/* Clickable Sender Name, Smart Date/Time Timestamp & Type Badge */}
                      <div
                        className={`mb-1 flex flex-wrap items-center gap-2 text-xs ${
                          isOwn ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            openUserProfilePage(msg.senderId, false)
                          }
                          className="font-semibold underline-offset-2 hover:text-indigo-400 hover:underline"
                          title={`View ${msg.senderName}'s profile & message history`}
                        >
                          {msg.senderName}
                        </button>
                        <span
                          className={`text-[11px] ${
                            isDark ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </span>
                        {(msg.updatedAt || Boolean(msg.metadata?.edited)) && (
                          <span
                            className={`text-[10px] italic ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            (edited)
                          </span>
                        )}

                        {/* Forward-Compatible Message Type Pill */}
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                            msg.type === 'link'
                              ? isDark
                                ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                                : 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                              : isDark
                              ? 'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30'
                              : 'bg-sky-100 text-sky-700 ring-1 ring-sky-300'
                          }`}
                        >
                          {msg.type === 'link' ? (
                            <Link2 className="h-2.5 w-2.5" />
                          ) : (
                            <MessageSquare className="h-2.5 w-2.5" />
                          )}
                          {msg.type}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setInspectedMessage(msg);
                            setShowInspectorPanel(true);
                          }}
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium transition ${
                            isSelected
                              ? 'bg-indigo-500/20 text-indigo-400'
                              : isDark
                              ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                              : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
                          }`}
                          title="Inspect JSONB metadata"
                        >
                          JSONB
                        </button>
                      </div>

                      {/* Primary Bubble */}
                      <div
                        onClick={() => setInspectedMessage(msg)}
                        className={`cursor-pointer rounded-2xl px-4 py-3 transition ${
                          isOwn
                            ? 'rounded-tr-xs bg-indigo-600 text-white shadow-sm shadow-indigo-500/15'
                            : isDark
                            ? 'rounded-tl-xs border border-slate-800 bg-slate-900 text-slate-100'
                            : 'rounded-tl-xs border border-slate-200 bg-white text-slate-800 shadow-2xs'
                        } ${
                          isSelected
                            ? 'ring-2 ring-indigo-400 ring-offset-2 ' +
                              (isDark ? 'ring-offset-slate-950' : 'ring-offset-slate-50')
                            : ''
                        }`}
                      >
                        {msg.type === 'link' ? (
                          <div className="space-y-2.5">
                            {/* Clickable URL Line */}
                            <a
                              href={msg.metadata.url || msg.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`inline-flex items-center gap-1.5 font-medium break-all underline underline-offset-4 ${
                                isOwn
                                  ? 'text-indigo-100 hover:text-white'
                                  : isDark
                                  ? 'text-indigo-400 hover:text-indigo-300'
                                  : 'text-indigo-600 hover:text-indigo-700'
                              }`}
                            >
                              <Globe className="h-4 w-4 shrink-0" />
                              <span className="text-sm">{msg.content}</span>
                              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" />
                            </a>

                            {/* Rich Link Unfurl Card from JSONB `metadata` */}
                            <div
                              className={`overflow-hidden rounded-xl border text-left transition ${
                                isOwn
                                  ? 'border-indigo-400/30 bg-indigo-950/45 text-white'
                                  : isDark
                                  ? 'border-slate-800 bg-slate-950/90 text-slate-100'
                                  : 'border-slate-200 bg-slate-50 text-slate-800'
                              }`}
                            >
                              <div
                                className={`h-1.5 w-full bg-gradient-to-r ${
                                  msg.metadata.unfurl?.accentColor ||
                                  'from-emerald-500 to-teal-500'
                                }`}
                              />
                              <div className="p-3">
                                <div className="flex items-center justify-between gap-2 text-[11px] opacity-80">
                                  <span className="font-semibold tracking-wide uppercase">
                                    {msg.metadata.unfurl?.siteName ||
                                      msg.metadata.hostname}
                                  </span>
                                  <span className="inline-flex items-center gap-1 font-mono text-[10px]">
                                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                                    {msg.metadata.protocol}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs font-bold sm:text-sm">
                                  {msg.metadata.unfurl?.title ||
                                    msg.metadata.hostname}
                                </p>
                                {msg.metadata.unfurl?.description && (
                                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed opacity-85">
                                    {msg.metadata.unfurl.description}
                                  </p>
                                )}
                                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] opacity-75">
                                  <span className="rounded bg-black/20 px-1.5 py-0.5 font-mono">
                                    host: {msg.metadata.hostname}
                                  </span>
                                  <span className="rounded bg-black/20 px-1.5 py-0.5 font-mono">
                                    path: {msg.metadata.pathname}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {renderContentWithMentions(msg.content)}
                          </p>
                        )}
                      </div>

                      {/* Inline Message Editor (Active when editing a message within 2 hours) */}
                      {editingMessageId === msg.id && (
                        <div
                          className={`mt-2 w-full rounded-2xl border p-3 ${
                            isDark
                              ? 'border-indigo-500/40 bg-slate-900'
                              : 'border-indigo-300 bg-white shadow-sm'
                          }`}
                        >
                          <textarea
                            rows={2}
                            value={editingMessageContent}
                            onChange={(e) =>
                              setEditingMessageContent(e.target.value)
                            }
                            className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                              isDark
                                ? 'border-slate-800 bg-slate-950 text-slate-100'
                                : 'border-slate-200 bg-slate-50 text-slate-900'
                            }`}
                          />
                          <div className="mt-2 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMessageId(null);
                                setEditingMessageContent('');
                              }}
                              className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEditedMessage(msg.id)}
                              className="rounded-lg bg-indigo-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-indigo-500"
                            >
                              Save Edit
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Inline Permanent Delete Confirmation */}
                      {deletingMessageId === msg.id && (
                        <div className="mt-2 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-[11px]">
                          <span className="font-semibold text-rose-400">
                            Permanently delete this message?
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleConfirmPermanentDelete(msg.id)
                            }
                            className="rounded-md bg-rose-600 px-2 py-0.5 font-bold text-white hover:bg-rose-500"
                          >
                            Yes, Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingMessageId(null)}
                            className="rounded-md px-2 py-0.5 font-medium text-slate-400 hover:text-slate-200"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {/* Delivery Status, 2-Hour Edit Action & Permanent Delete Action Footer */}
                      <div
                        className={`mt-1 flex flex-wrap items-center gap-2 text-[10px] ${
                          isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        {isOwn && (
                          <>
                            <span className="inline-flex items-center gap-1">
                              {msg.status === 'sending' ? (
                                <>
                                  <Clock className="h-3 w-3 animate-spin" />
                                  <span>Saving to PostgreSQL...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                                  <span>Acked</span>
                                </>
                              )}
                            </span>

                            {isWithinTwoHourEditWindow(msg.createdAt) ? (
                              <button
                                type="button"
                                onClick={() => handleStartEditingMessage(msg)}
                                className="rounded px-1.5 py-0.5 font-semibold text-indigo-400 transition hover:bg-indigo-500/15"
                                title="Messages can be edited within 2 hours of posting"
                              >
                                ✎ Edit ({getRemainingEditMinutes(msg.createdAt)}m left)
                              </button>
                            ) : (
                              <span
                                className="opacity-60"
                                title="2-hour edit window has expired"
                              >
                                Edit locked (&gt;2h)
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setDeletingMessageId(msg.id);
                                setEditingMessageId(null);
                              }}
                              className="rounded px-1.5 py-0.5 font-semibold text-rose-400 transition hover:bg-rose-500/15"
                              title="Permanently delete your message"
                            >
                              🗑 Delete
                            </button>
                          </>
                        )}
                        {msg.clientMessageId && (
                          <span className="font-mono opacity-75">
                            id: {msg.clientMessageId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Peer Typing Indicator */}
            {typingUser && (
              <div className="flex items-center gap-2.5 text-xs text-indigo-400">
                <div className="flex space-x-1 rounded-full bg-indigo-500/15 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
                </div>
                <span>{typingUser} is broadcasting via Socket.IO...</span>
              </div>
            )}

            {canLoadNewerMessages && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleLoadNewerMessages}
                  className="cursor-pointer rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-400 transition hover:bg-indigo-500/20"
                >
                  ↓ Load newer messages (max 40 at a time)
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Floating Downward-Pointing "↓ New message" Button when Scrolled Up */}
          {(!isScrolledToBottom || pendingNewMessagesCount > 0) &&
            filteredMessages.length > 0 && (
              <div className="flex justify-center py-1.5">
                <button
                  type="button"
                  onClick={scrollToBottom}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500"
                >
                  <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                  <span>
                    {pendingNewMessagesCount > 0
                      ? `New message (${pendingNewMessagesCount})`
                      : 'New message ↓'}
                  </span>
                </button>
              </div>
            )}

          {/* MESSAGE COMPOSER WITH LIVE URL CLASSIFIER PREVIEW */}
          <div
            className={`border-t p-3 sm:p-4 ${
              isDark
                ? 'border-slate-800/80 bg-slate-900/75'
                : 'border-slate-200 bg-white'
            }`}
          >
            {/* Quick-Fill Pills for Testing Both 'link' and 'text' */}
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`text-[11px] font-medium ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Quick test:
                </span>
                {QUICK_SAMPLE_INPUTS.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => setDraft(sample.value)}
                    className={`rounded-lg border px-2 py-0.5 text-[11px] font-medium transition ${
                      isDark
                        ? 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-indigo-500/50 hover:text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowMetaInputs((v) => !v)}
                className={`text-[11px] font-medium underline-offset-2 hover:underline ${
                  showMetaInputs
                    ? 'text-indigo-400'
                    : isDark
                    ? 'text-slate-400'
                    : 'text-slate-500'
                }`}
              >
                {showMetaInputs ? 'Hide custom JSONB field' : '+ Custom JSONB field'}
              </button>
            </div>

            {/* Optional Custom Metadata Key-Value Builder */}
            {showMetaInputs && (
              <div className="mb-2.5 flex flex-wrap items-center gap-2 rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-2.5">
                <span className="text-[11px] font-semibold text-indigo-400">
                  Extra JSONB Metadata:
                </span>
                <input
                  type="text"
                  value={customMetaKey}
                  onChange={(e) => setCustomMetaKey(e.target.value)}
                  placeholder="Key (e.g. priority)"
                  className={`w-36 rounded-lg border px-2.5 py-1 font-mono text-xs ${
                    isDark
                      ? 'border-slate-800 bg-slate-950 text-slate-200'
                      : 'border-slate-200 bg-white text-slate-800'
                  }`}
                />
                <input
                  type="text"
                  value={customMetaVal}
                  onChange={(e) => setCustomMetaVal(e.target.value)}
                  placeholder="Value (e.g. high)"
                  className={`w-36 rounded-lg border px-2.5 py-1 font-mono text-xs ${
                    isDark
                      ? 'border-slate-800 bg-slate-950 text-slate-200'
                      : 'border-slate-200 bg-white text-slate-800'
                  }`}
                />
              </div>
            )}

            {/* Live Classifier Banner (Appears while typing) */}
            {liveDetection && (
              <div
                className={`mb-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs ${
                  liveDetection.type === 'link'
                    ? isDark
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : isDark
                    ? 'border-sky-500/30 bg-sky-500/10 text-sky-300'
                    : 'border-sky-300 bg-sky-50 text-sky-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Handler classification:{' '}
                    <strong className="font-mono uppercase">
                      type = &apos;{liveDetection.type}&apos;
                    </strong>
                    {liveDetection.type === 'link' &&
                      ` (hostname: ${liveDetection.metadata.hostname})`}
                  </span>
                </div>
                <span className="font-mono text-[11px] opacity-80">
                  metadata keys: [{Object.keys(liveDetection.metadata).join(', ')}]
                </span>
              </div>
            )}

            {/* Guest Read-Only Lock Notice when Not Logged In */}
            {!authUser && (
              <div
                className={`mb-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
                  isDark
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                    : 'border-amber-300 bg-amber-50 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>
                    <strong>Read-Only Guest Mode:</strong> You can view all
                    messages and inspect JSONB payloads, but you must log in to
                    send messages.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthPage('login')}
                  className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-500"
                >
                  Log In / Sign Up →
                </button>
              </div>
            )}

            {/* Textarea + Send Button */}
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              {!authUser && (
                <button
                  type="button"
                  onClick={() => openAuthPage('login')}
                  className="flex h-11 shrink-0 items-center gap-1.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 lg:hidden"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Log In / Sign Up</span>
                </button>
              )}

              <div className="relative flex-1">
                <textarea
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!authUser}
                  placeholder={
                    authUser
                      ? "Paste an HTTP/HTTPS URL to trigger 'link' classification, or type a message..."
                      : 'Log in or sign up using the bottom-left button to send messages...'
                  }
                  className={`max-h-32 min-h-[44px] w-full resize-none rounded-2xl border px-4 py-2.5 pr-12 text-sm transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                    isDark
                      ? 'border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:border-indigo-500'
                      : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                  }`}
                />
                <span
                  className={`pointer-events-none absolute right-3 bottom-3 hidden items-center gap-0.5 text-[10px] sm:inline-flex ${
                    isDark ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  <CornerDownLeft className="h-3 w-3" />
                </span>
              </div>

              <button
                type="submit"
                disabled={!authUser || !draft.trim()}
                className="flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </main>

        {/* RIGHT DRAWER / PANEL: Live PostgreSQL Row & JSONB Metadata Inspector */}
        {showInspectorPanel && (
          <aside
            className={`fixed inset-y-0 right-0 z-30 flex w-80 flex-col border-l shadow-2xl xl:static xl:w-96 xl:shadow-none ${
              isDark
                ? 'border-slate-800/80 bg-slate-900/95'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div
              className={`flex h-16 items-center justify-between border-b px-4 ${
                isDark ? 'border-slate-800/80' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-indigo-400" />
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider">
                    PostgreSQL Row &amp; JSONB
                  </h2>
                  <p
                    className={`text-[11px] ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Click any message bubble to inspect
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInspectorPanel(false)}
                className={`rounded-lg p-1.5 ${
                  isDark
                    ? 'text-slate-400 hover:bg-slate-800'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
                aria-label="Close inspector"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {inspectedMessage ? (
              <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs">
                {/* Summary Card */}
                <div
                  className={`rounded-xl border p-3 ${
                    isDark
                      ? 'border-slate-800 bg-slate-950/60'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-semibold ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Column: <code className="font-mono">type</code>
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 font-mono text-xs font-bold ${
                        inspectedMessage.type === 'link'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-sky-500/15 text-sky-400'
                      }`}
                    >
                      &apos;{inspectedMessage.type}&apos;
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`font-semibold ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Idempotency Key
                    </span>
                    <span className="font-mono text-[11px]">
                      {inspectedMessage.clientMessageId || 'NULL'}
                    </span>
                  </div>
                </div>

                {/* JSONB Metadata Block */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-semibold">
                      <code className="font-mono text-indigo-400">metadata</code>{' '}
                      (JSONB Column)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyJson(inspectedMessage.metadata, 'metadata')
                      }
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition ${
                        isDark
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre
                    className={`overflow-x-auto rounded-xl border p-3 font-mono text-[11px] leading-relaxed ${
                      isDark
                        ? 'border-slate-800 bg-slate-950 text-emerald-300'
                        : 'border-slate-200 bg-slate-900 text-emerald-300'
                    }`}
                  >
                    {JSON.stringify(inspectedMessage.metadata, null, 2)}
                  </pre>
                </div>

                {/* Full Socket.IO `message:new` Payload */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-semibold">
                      Full <code className="font-mono text-indigo-400">message:new</code>{' '}
                      Broadcast
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyJson(inspectedMessage, 'message:new payload')
                      }
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition ${
                        isDark
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre
                    className={`overflow-x-auto rounded-xl border p-3 font-mono text-[11px] leading-relaxed ${
                      isDark
                        ? 'border-slate-800 bg-slate-950 text-slate-300'
                        : 'border-slate-200 bg-slate-900 text-slate-200'
                    }`}
                  >
                    {JSON.stringify(
                      {
                        id: inspectedMessage.id,
                        roomId: inspectedMessage.roomId,
                        senderId: inspectedMessage.senderId,
                        content: inspectedMessage.content,
                        type: inspectedMessage.type,
                        metadata: inspectedMessage.metadata,
                        clientMessageId: inspectedMessage.clientMessageId,
                        createdAt: inspectedMessage.createdAt,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>

                {/* Backend Handler Alignment Note */}
                <div
                  className={`flex items-start gap-2 rounded-xl border p-3 leading-relaxed ${
                    isDark
                      ? 'border-indigo-500/20 bg-indigo-500/5 text-slate-300'
                      : 'border-indigo-200 bg-indigo-50/70 text-slate-700'
                  }`}
                >
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  <p className="text-[11px]">
                    This UI consumes the exact{' '}
                    <code className="font-mono">AckResponse&lt;ChatMessage&gt;</code>{' '}
                    and <code className="font-mono">message:new</code> contract from{' '}
                    <code className="font-mono">messageHandler.ts</code>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center p-6 text-center text-xs text-slate-500">
                Select any message bubble to inspect its PostgreSQL row and
                JSONB metadata.
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;