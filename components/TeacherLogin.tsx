import React, { useState } from 'react';
import { ApiError, teacherLogin, checkTeacherVerification, type TeacherAccount } from '../apiService';
import { setTeacherToken } from '../config';
import { Logo } from './Logo';

interface Props {
  onSuccess: (account: TeacherAccount) => void;
  onBack: () => void;
  onRegister: () => void;
}

export function TeacherLogin({ onSuccess, onBack, onRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set when the backend rejects the login with 403 PENDING_APPROVAL — the
  // account exists and the password is right, but the admin hasn't approved
  // it yet, so no JWT is issued. From here the teacher can poll their status.
  const [pending, setPending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatusNote(null);
    setLoading(true);
    try {
      const { token, account } = await teacherLogin(email.trim(), password);
      setTeacherToken(token);
      onSuccess(account);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        // Pending admin approval — swap the form for the status panel.
        setPending(true);
        setApproved(false);
      } else {
        setError(err instanceof Error ? err.message : 'تعذّر تسجيل الدخول.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function pollStatus() {
    setChecking(true);
    setStatusNote(null);
    try {
      const res = await checkTeacherVerification(email.trim(), password);
      if (res.is_verified) {
        setApproved(true);
        setStatusNote('تم تفعيل حسابك من الإدارة! يمكنك تسجيل الدخول الآن.');
      } else {
        setStatusNote('حسابك ما زال قيد المراجعة — حاول مرة أخرى لاحقًا.');
      }
    } catch (err) {
      setStatusNote(err instanceof Error ? err.message : 'تعذّر التحقق من الحالة.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="mx-auto max-w-md animate-rise">
      <button
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-gold-500/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]"
      >
        العودة للرئيسية
      </button>
      <div className="card-accent relative overflow-hidden rounded-[2rem] glass-strong p-8 md:p-10">
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-5 w-fit">
            <div
              className="animate-breathe absolute inset-0 -m-3 rounded-full blur-xl"
              style={{ background: 'radial-gradient(circle, rgba(201,169,106,0.3), transparent 70%)' }}
            />
            <Logo size={56} glow className="relative mx-auto rounded-2xl border border-gold-500/20 bg-ink-900/50 p-2.5" />
          </div>
          <h2 className="text-[clamp(1.75rem,4vw,2.25rem)] font-black tracking-tight text-white">دخول المعلّم</h2>
          <p className="mt-2 text-sm text-slate-400">سجّل دخولك بحساب المعلّم للمتابعة</p>
        </div>

        {pending && !approved ? (
          /* ── Pending-approval panel (403 PENDING_APPROVAL from the backend) ── */
          <div className="space-y-5 text-center">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-5 py-6">
              <div className="mb-2 text-3xl">⏳</div>
              <p className="text-sm font-semibold text-amber-200">
                بياناتك صحيحة، لكن حسابك ما زال بانتظار موافقة الإدارة.
              </p>
              <p className="mt-2 text-xs text-amber-300/70">
                ستتمكن من الدخول فور تفعيل حسابك. يمكنك التحقق من الحالة الآن.
              </p>
            </div>

            {statusNote && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                {statusNote}
              </div>
            )}

            <button
              onClick={pollStatus}
              disabled={checking}
              className="btn-gold w-full rounded-2xl py-3.5 text-base font-bold disabled:opacity-50"
            >
              {checking ? 'جارٍ التحقق…' : 'التحقق من حالة التفعيل'}
            </button>
            <button
              onClick={() => { setPending(false); setStatusNote(null); }}
              className="w-full rounded-2xl border border-gold-500/15 bg-white/[0.03] py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]"
            >
              العودة لتسجيل الدخول
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            {approved && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
                ✅ تم تفعيل حسابك — سجّل الدخول الآن.
              </div>
            )}
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">البريد الإلكتروني</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                dir="ltr"
                placeholder="teacher@example.com"
                className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">كلمة المرور</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                dir="ltr"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full rounded-2xl py-4 text-base font-bold disabled:opacity-50"
            >
              {loading ? 'جارٍ التحقق…' : 'تسجيل الدخول ←'}
            </button>
          </form>
        )}

        {(!pending || approved) && (
          <p className="mt-6 text-center text-sm text-slate-400">
            ليس لديك حساب؟{' '}
            <button onClick={onRegister} className="font-semibold text-gold-400 hover:text-gold-300">
              أنشئ حساب معلّم جديد
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
