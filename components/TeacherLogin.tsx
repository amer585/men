import React, { useState } from 'react';
import { teacherLogin, type TeacherAccount } from '../apiService';
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, account } = await teacherLogin(email.trim(), password);
      setTeacherToken(token);
      onSuccess(account);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر تسجيل الدخول.');
    } finally {
      setLoading(false);
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

        <form onSubmit={submit} className="space-y-5">
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

        <p className="mt-6 text-center text-sm text-slate-400">
          ليس لديك حساب؟{' '}
          <button onClick={onRegister} className="font-semibold text-gold-400 hover:text-gold-300">
            أنشئ حساب معلّم جديد
          </button>
        </p>
      </div>
    </div>
  );
}
