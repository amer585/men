import { useState } from 'react';
import { staffLogin, type StaffUser } from '../apiService';
import { setStaffToken } from '../config';

interface Props {
  onSuccess: (user: StaffUser) => void;
  onBack: () => void;
}

export function StaffLogin({ onSuccess, onBack }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await staffLogin(username, password);
      setStaffToken(token);
      onSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md animate-rise">
      <button onClick={onBack} className="mb-4 text-sm text-slate-400 transition hover:text-white">
        → العودة للرئيسية
      </button>
      <div className="rounded-[2rem] glass-strong p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 text-2xl shadow-lg shadow-indigo-500/30">
            🏫
          </div>
          <h2 className="mt-4 text-2xl font-black text-white">دخول المدرّس / الإدارة</h2>
          <p className="mt-1 text-sm text-slate-400">الوصول إلى الفصول والدرجات</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-300">اسم المستخدم</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              dir="ltr"
              placeholder="username"
              className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-300">كلمة المرور</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
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
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'جارٍ التحقق…' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
