/**
 * Modular User Profile & Message History Page (React Router Compatible)
 * Place this file at: `client/src/pages/ProfilePage.tsx`
 *
 * Features:
 * 1. View any user's profile picture, name, self-description (bio), and full message history
 * 2. Edit your own profile (name, profile picture URL or file upload, description/bio, role)
 * 3. Persists changes securely to PostgreSQL (`PUT http://localhost:4000/api/users/profile`)
 */

import React, { useState, useEffect, useMemo } from 'react';
import type {
  AuthUser,
  ChatMessage,
  Room
} from '../types';

import { AVATAR_PRESETS, formatSmartTimestamp, getInitials } from '../types';

export interface ProfilePageProps {
  targetUserId: string;
  authUser: AuthUser | null;
  sessionToken: string | null;
  allMessages: ChatMessage[];
  rooms: Room[];
  isDark: boolean;
  onToggleTheme: () => void;
  onBackToChat: () => void;
  onSelectRoomAndClose: (roomId: string, messageId?: string) => void;
  onProfileUpdated: (updated: AuthUser) => void;
  onOpenAuth: () => void;
  initialEditMode?: boolean;
}

export function ProfilePage({
  targetUserId,
  authUser,
  sessionToken,
  allMessages,
  rooms,
  isDark,
  onToggleTheme,
  onBackToChat,
  onSelectRoomAndClose,
  onProfileUpdated,
  onOpenAuth,
  initialEditMode = false,
}: ProfilePageProps) {
  const isOwnProfile = Boolean(authUser && authUser.id === targetUserId);
  const [isEditing, setIsEditing] = useState(isOwnProfile && initialEditMode);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [remoteMessages, setRemoteMessages] = useState<ChatMessage[] | null>(
    null
  );
  const [remoteProfile, setRemoteProfile] = useState<{
    name: string;
    role: string;
    avatarGradient: string;
    avatarUrl: string;
    bio: string;
  } | null>(null);

  // Derive fallback profile from authUser or existing messages in state
  const derivedProfile = useMemo(() => {
    if (isOwnProfile && authUser) {
      return {
        id: authUser.id,
        name: authUser.name,
        role: authUser.role,
        avatarGradient: authUser.avatarGradient,
        avatarUrl: authUser.avatarUrl || '',
        bio:
          authUser.bio ||
          'Building real-time apps with React, Socket.IO, and PostgreSQL.',
      };
    }

    if (remoteProfile) {
      return { id: targetUserId, ...remoteProfile };
    }

    const sampleMsg = allMessages.find((m) => m.senderId === targetUserId);
    const meta = (sampleMsg?.metadata || {}) as Record<string, unknown>;
    return {
      id: targetUserId,
      name:
        sampleMsg?.senderName ||
        (typeof meta.senderName === 'string' ? meta.senderName : 'PulseChat User'),
      role:
        sampleMsg?.senderRole ||
        (typeof meta.senderRole === 'string' ? meta.senderRole : 'Member'),
      avatarGradient:
        sampleMsg?.avatarGradient || 'from-emerald-500 to-teal-600',
      avatarUrl:
        sampleMsg?.senderAvatarUrl ||
        (typeof meta.senderAvatarUrl === 'string' ? meta.senderAvatarUrl : ''),
      bio:
        sampleMsg?.senderBio ||
        (typeof meta.senderBio === 'string'
          ? meta.senderBio
          : 'PulseChat engineer collaborating on real-time Socket.IO & PostgreSQL systems.'),
    };
  }, [isOwnProfile, authUser, remoteProfile, allMessages, targetUserId]);

  const [nameInput, setNameInput] = useState(derivedProfile.name);
  const [roleInput, setRoleInput] = useState(derivedProfile.role);
  const [avatarUrlInput, setAvatarUrlInput] = useState(
    derivedProfile.avatarUrl
  );
  const [bioInput, setBioInput] = useState(derivedProfile.bio);

  useEffect(() => {
    setNameInput(derivedProfile.name);
    setRoleInput(derivedProfile.role);
    setAvatarUrlInput(derivedProfile.avatarUrl);
    setBioInput(derivedProfile.bio);
  }, [derivedProfile]);

  // Fetch user profile + complete message history from PostgreSQL backend
  useEffect(() => {
    let cancelled = false;
    async function loadFromPostgres() {
      try {
        const res = await fetch(
          `http://localhost:4000/api/users/${encodeURIComponent(
            targetUserId
          )}/profile`
        );
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled || !json?.ok || !json.data) return;

        setRemoteProfile({
          name: json.data.name,
          role: json.data.role,
          avatarGradient: json.data.avatarGradient,
          avatarUrl: json.data.avatarUrl || '',
          bio: json.data.bio || '',
        });

        if (Array.isArray(json.data.messages)) {
          setRemoteMessages(json.data.messages);
        }
      } catch {
        // Fallback to local state when server is offline
      }
    }
    loadFromPostgres();
    return () => {
      cancelled = true;
    };
  }, [targetUserId]);

  // Combine local & PostgreSQL message history for this user (newest first)
  const userMessageHistory = useMemo(() => {
    const map = new Map<string, ChatMessage>();
    for (const m of allMessages.filter((x) => x.senderId === targetUserId)) {
      map.set(m.id, m);
    }
    if (remoteMessages) {
      for (const rm of remoteMessages) {
        map.set(rm.id, {
          ...rm,
          senderName: derivedProfile.name,
          senderRole: derivedProfile.role,
          avatarGradient: derivedProfile.avatarGradient,
          senderAvatarUrl: derivedProfile.avatarUrl,
          senderBio: derivedProfile.bio,
        });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [allMessages, remoteMessages, targetUserId, derivedProfile]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Please choose an image smaller than 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrlInput(reader.result);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser || !isOwnProfile) return;

    const cleanName = nameInput.trim();
    if (cleanName.length < 2) {
      setErrorMsg('Name must be at least 2 characters long.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const res = await fetch('http://localhost:4000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({
          name: cleanName,
          role: roleInput.trim() || 'Verified Member',
          avatarUrl: avatarUrlInput.trim(),
          bio: bioInput.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error?.message || 'Failed to save profile.');
      }

      onProfileUpdated(json.data);
      setIsEditing(false);
    } catch {
      // Fallback update when running in standalone frontend mode
      const updatedFallback: AuthUser = {
        ...authUser,
        name: cleanName,
        role: roleInput.trim() || 'Verified Member',
        avatarUrl: avatarUrlInput.trim(),
        bio: bioInput.trim(),
      };
      onProfileUpdated(updatedFallback);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const getRoomName = (rId: string) =>
    rooms.find((r) => r.id === rId)?.name || 'general';

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Navigation Bar */}
      <header
        className={`flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-8 ${
          isDark
            ? 'border-slate-800/80 bg-slate-900/80'
            : 'border-slate-200 bg-white/90'
        } backdrop-blur-md`}
      >
        <button
          type="button"
          onClick={onBackToChat}
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
              onClick={onOpenAuth}
              className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-500"
            >
              Log In / Sign Up
            </button>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
              isDark
                ? 'border-slate-800 bg-slate-800 text-amber-400 hover:bg-slate-700'
                : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isDark ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      {/* Main Profile Content */}
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-6 p-4 sm:p-8">
        {/* Profile Header Card */}
        <div
          className={`overflow-hidden rounded-3xl border shadow-lg ${
            isDark
              ? 'border-slate-800 bg-slate-900/90'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div
            className={`h-28 w-full bg-gradient-to-r ${derivedProfile.avatarGradient}`}
          />

          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                {derivedProfile.avatarUrl ? (
                  <img
                    src={derivedProfile.avatarUrl}
                    alt={derivedProfile.name}
                    className="h-24 w-24 rounded-3xl border-4 border-slate-900 bg-slate-800 object-cover shadow-md"
                  />
                ) : (
                  <div
                    className={`flex h-24 w-24 items-center justify-center rounded-3xl border-4 ${
                      isDark ? 'border-slate-900' : 'border-white'
                    } bg-gradient-to-br ${
                      derivedProfile.avatarGradient
                    } text-2xl font-bold text-white shadow-md`}
                  >
                    {getInitials(derivedProfile.name)}
                  </div>
                )}

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold sm:text-2xl">
                      {derivedProfile.name}
                    </h1>
                    <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
                      {derivedProfile.role}
                    </span>
                  </div>
                  {isOwnProfile && authUser && (
                    <p
                      className={`text-xs ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {authUser.email}
                    </p>
                  )}
                </div>
              </div>

              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditing((v) => !v)}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-500"
                >
                  {isEditing ? 'Cancel Editing' : '✎ Edit My Profile'}
                </button>
              )}
            </div>

            {/* Bio / Self-Description Display */}
            {!isEditing && (
              <div className="mt-5">
                <h2
                  className={`text-xs font-bold tracking-wider uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  About / Description
                </h2>
                <p
                  className={`mt-1.5 text-sm leading-relaxed ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  {derivedProfile.bio}
                </p>
              </div>
            )}

            {/* Edit Profile Form (Only for Own Profile) */}
            {isOwnProfile && isEditing && (
              <form
                onSubmit={handleSaveProfile}
                className={`mt-6 space-y-4 rounded-2xl border p-4 sm:p-5 ${
                  isDark
                    ? 'border-slate-800 bg-slate-950/70'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <h3 className="text-sm font-bold">
                  Edit Your Profile (Saved to PostgreSQL)
                </h3>

                {errorMsg && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
                    {errorMsg}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold">
                      Profile Name
                    </label>
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
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
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-sm ${
                        isDark
                          ? 'border-slate-800 bg-slate-900 text-slate-100'
                          : 'border-slate-300 bg-white text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Profile Picture URL or File Upload */}
                <div>
                  <label className="mb-1 block text-xs font-semibold">
                    Profile Picture (Image URL or Upload File)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={avatarUrlInput}
                      onChange={(e) => setAvatarUrlInput(e.target.value)}
                      placeholder="https://example.com/avatar.png or upload below"
                      className={`min-w-[220px] flex-1 rounded-xl border px-3 py-2 text-xs ${
                        isDark
                          ? 'border-slate-800 bg-slate-900 text-slate-100'
                          : 'border-slate-300 bg-white text-slate-900'
                      }`}
                    />
                    <label className="cursor-pointer rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-3 py-2 text-xs font-semibold text-indigo-400 hover:bg-indigo-500/25">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {avatarUrlInput && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrlInput('')}
                        className="rounded-xl border border-rose-500/30 px-2.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>

                  {/* Quick Avatar Presets */}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] opacity-75">
                      Quick avatars:
                    </span>
                    {AVATAR_PRESETS.map((presetUrl, i) => (
                      <button
                        key={presetUrl}
                        type="button"
                        onClick={() => setAvatarUrlInput(presetUrl)}
                        className={`h-8 w-8 overflow-hidden rounded-full border-2 transition ${
                          avatarUrlInput === presetUrl
                            ? 'border-indigo-500 scale-110'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        title={`Preset Avatar ${i + 1}`}
                      >
                        <img
                          src={presetUrl}
                          alt={`Preset ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Self-Description / Bio */}
                <div>
                  <label className="mb-1 block text-xs font-semibold">
                    Description About Self (Bio)
                  </label>
                  <textarea
                    rows={3}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="Tell the team about yourself, your tech stack, or what you're working on..."
                    className={`w-full rounded-xl border px-3 py-2 text-sm ${
                      isDark
                        ? 'border-slate-800 bg-slate-900 text-slate-100'
                        : 'border-slate-300 bg-white text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className={`rounded-xl border px-4 py-2 text-xs font-semibold ${
                      isDark
                        ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {saving ? 'Saving to PostgreSQL...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* User Message History Section */}
        <div
          className={`rounded-3xl border p-6 shadow-sm ${
            isDark
              ? 'border-slate-800 bg-slate-900/90'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">
                Message History ({userMessageHistory.length})
              </h2>
              <p
                className={`text-xs ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                All messages posted by {derivedProfile.name} across rooms
              </p>
            </div>
          </div>

          {userMessageHistory.length === 0 ? (
            <div
              className={`rounded-2xl border p-8 text-center text-xs ${
                isDark
                  ? 'border-slate-800 bg-slate-950/40 text-slate-400'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              No messages posted by {derivedProfile.name} yet.
            </div>
          ) : (
            <div className="space-y-3">
              {userMessageHistory.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectRoomAndClose(m.roomId, m.id)}
                  title="Click to jump to this exact message in the chat room"
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    isDark
                      ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                  }`}
                >
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onSelectRoomAndClose(m.roomId, m.id); }}
                        className="rounded-lg bg-indigo-500/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-indigo-400 hover:bg-indigo-500/25"
                      >
                        #{getRoomName(m.roomId)}
                      </button>
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
                        <span className="text-[10px] italic opacity-70">
                          (edited)
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[11px] ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {formatSmartTimestamp(m.createdAt)}
                    </span>
                  </div>

                  {m.type === 'link' ? (
                    <a
                      href={m.metadata.url || m.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-400 underline break-all hover:text-indigo-300"
                    >
                      {m.content}
                    </a>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {m.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;