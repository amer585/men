import React, { useState } from 'react';
import { studentLogin, logAction, ACTION_TYPES, type StudentProfile } from '../apiService';
import { GRADE_LABELS } from '../schoolData';
import { Logo } from './Logo';

interface Props {
  onSuccess: (profile: StudentProfile, token?: string) => void;
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
      const { student, token } = await studentLogin(ssn, Number(grade));
      // Call onSuccess FIRST so App.onStudentLogin synchronously writes the token
      // via setStudentToken — logAction below uses auth:'student' which calls
      // getStudentToken() synchronously at invoke time (the JWT must already be
      // in localStorage before the fetch fires).
      onSuccess(student, token);
      void logAction({
        ssn_encrypted: student.ssn_encrypted,
        grade_level: student.grade_level,
        action_type: ACTION_TYPES.LOGIN,
      }).catch(() => {});
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
          <h2 className="text-[clamp(1.75rem,4vw,2.25rem)] font-black tracking-tight text-white">دخول الطالب</h2>
          <p className="mt-2 text-sm text-slate-400">أدخل رقم الطالب والصف الدراسي للمتابعة</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
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
            className="btn-gold w-full rounded-2xl py-4 text-base font-bold disabled:opacity-50"
          >
            {loading ? 'جارٍ التحقق…' : 'ابدأ رحلتك ←'}
          </button>
        </form>
      </div>
    </div>
  );
}
