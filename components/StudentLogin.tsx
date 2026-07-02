import { useState } from 'react';
import { studentLogin, logAction, ACTION_TYPES, type StudentProfile } from '../apiService';
import { GRADE_LABELS } from '../schoolData';
import { Logo } from './Logo';

interface Props {
  onSuccess: (profile: StudentProfile) => void;
  onBack: () => void;
}

export function StudentLogin({ onSuccess, onBack }: Props) {
  const [ssn, setSsn] = useState('');
  const [grade, setGrade] = useState('3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\d{14}$/.test(ssn)) {
      setError('رقم الطالب يجب أن يكون 14 رقمًا.');
      return;
    }
    setLoading(true);
    try {
      const { student } = await studentLogin(ssn, Number(grade));
      void logAction({
        ssn_encrypted: student.ssn_encrypted,
        grade_level: student.grade_level,
        action_type: ACTION_TYPES.LOGIN,
      }).catch(() => {});
      onSuccess(student);
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
      <div className="card-accent rounded-[2rem] glass-strong p-8">
        <div className="mb-7 text-center">
          <Logo size={56} glow className="mx-auto rounded-2xl border border-gold-500/15 bg-ink-900/40 p-2" />
          <h2 className="mt-4 text-2xl font-black text-white">دخول الطالب</h2>
          <p className="mt-1 text-sm text-slate-400">أدخل رقم الطالب والصف الدراسي</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-300">رقم الطالب (14 رقمًا)</span>
            <input
              value={ssn}
              onChange={(e) => setSsn(e.target.value.replace(/\D/g, '').slice(0, 14))}
              inputMode="numeric"
              dir="ltr"
              placeholder="00000000000000"
              className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-center font-mono text-lg tracking-widest text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-300">الصف الدراسي</span>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
            >
              {Object.entries(GRADE_LABELS).map(([k, v]) => (
                <option key={k} value={k} className="bg-ink-900">
                  {v}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full rounded-xl py-3.5 text-base font-bold text-ink-950 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'جارٍ التحقق…' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
