/**
 * Modular Email OTP & Magic Link Authentication Page
 * Place this file at: `client/src/pages/AuthPage.tsx`
 */

import React from 'react';
import { OtpDevPreview } from '../types';

export interface AuthPageProps {
  isDark: boolean;
  authMode: 'login' | 'signup';
  authStep: 'request' | 'verify';
  authEmail: string;
  authName: string;
  authRole: string;
  otpInput: string;
  authLoading: boolean;
  authError: string | null;
  devPreview: OtpDevPreview | null;
  onToggleTheme: () => void;
  onBackToChat: () => void;
  onChangeMode: (mode: 'login' | 'signup') => void;
  onChangeStep: (step: 'request' | 'verify') => void;
  onChangeEmail: (val: string) => void;
  onChangeName: (val: string) => void;
  onChangeRole: (val: string) => void;
  onChangeOtp: (val: string) => void;
  onRequestOtp: (e: React.FormEvent) => void;
  onVerifyOtp: (e: React.FormEvent) => void;
  onVerifyMagicLink: (magicToken: string) => void;
}

export function AuthPage({
  isDark,
  authMode,
  authStep,
  authEmail,
  authName,
  authRole,
  otpInput,
  authLoading,
  authError,
  devPreview,
  onToggleTheme,
  onBackToChat,
  onChangeMode,
  onChangeStep,
  onChangeEmail,
  onChangeName,
  onChangeRole,
  onChangeOtp,
  onRequestOtp,
  onVerifyOtp,
  onVerifyMagicLink,
}: AuthPageProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Bar */}
      <div
        className={`flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-8 ${
          isDark
            ? 'border-slate-800/80 bg-slate-900/70'
            : 'border-slate-200 bg-white/90'
        }`}
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
          <span>← Back to Chat (Read-Only Guest)</span>
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
            isDark
              ? 'border-slate-800 bg-slate-800/80 text-slate-200 hover:bg-slate-700'
              : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>{isDark ? '☀ Light Mode' : '🌙 Dark Mode'}</span>
        </button>
      </div>

      {/* Centered Auth Card */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div
          className={`w-full max-w-md rounded-3xl border p-6 shadow-xl sm:p-8 ${
            isDark
              ? 'border-slate-800 bg-slate-900/90 shadow-black/40'
              : 'border-slate-200 bg-white shadow-slate-200/70'
          }`}
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold tracking-tight">
              {authMode === 'login'
                ? 'Welcome back to PulseChat'
                : 'Create your PulseChat account'}
            </h2>
            <p
              className={`mt-1 text-xs ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Passwordless Email OTP &amp; Magic Link Authentication
            </p>
          </div>

          <div
            className={`mb-6 grid grid-cols-2 rounded-2xl p-1 ${
              isDark ? 'bg-slate-950' : 'bg-slate-100'
            }`}
          >
            <button
              type="button"
              onClick={() => onChangeMode('login')}
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
              onClick={() => onChangeMode('signup')}
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
            <form onSubmit={onRequestOtp} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => onChangeEmail(e.target.value)}
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
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => onChangeName(e.target.value)}
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
                      onChange={(e) => onChangeRole(e.target.value)}
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
                <span>
                  {authLoading
                    ? 'Sending OTP & Magic Link...'
                    : 'Send 6-Digit OTP & Magic Link'}
                </span>
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <form onSubmit={onVerifyOtp} className="space-y-4">
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-semibold">
                      Enter 6-Digit OTP sent to {authEmail}
                    </label>
                    <button
                      type="button"
                      onClick={() => onChangeStep('request')}
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
                      onChangeOtp(e.target.value.replace(/\D/g, ''))
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
                  <span>Verify 6-Digit OTP &amp; Unlock Chat</span>
                </button>
              </form>

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
                      onClick={() => onChangeOtp(devPreview.otpCode)}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500"
                    >
                      Auto-Fill OTP ({devPreview.otpCode})
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] opacity-90">
                    Or click the Magic Link below to sign in instantly without
                    typing a code:
                  </p>
                  <button
                    type="button"
                    onClick={() => onVerifyMagicLink(devPreview.magicToken)}
                    className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-600/20 py-2 font-semibold text-emerald-300 transition hover:bg-emerald-600/30"
                  >
                    <span>✨ Click Magic Link to Sign In Instantly</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default AuthPage;