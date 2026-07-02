import { useEffect } from 'react';
import { logAction, ACTION_TYPES, type StudentProfile } from '../apiService';
import { gradeLabel } from '../schoolData';

interface Props {
  student: StudentProfile;
  onLogout: () => void;
}

export function StudentDashboard({ student, onLogout }: Props) {
  // Log a "view profile" action on mount (best-effort).
  useEffect(() => {
    logAction({
      ssn_encrypted: student.ssn_encrypted,
      grade_level: student.grade_level,
      action_type: ACTION_TYPES.VIEW_PROFILE,
    }).catch(() => {});
  }, [student.ssn_encrypted, student.grade_level]);

  const tiles = [
    { label: 'المدرسة', value: student.school_name || '—', icon: '🏫' },
    { label: 'الفصل', value: student.class_name || '—', icon: '📌' },
    { label: 'الإدارة التعليمية', value: student.admin_zone || '—', icon: '🗺️' },
    { label: 'المحافظة', value: student.gov_code || '—', icon: '📍' },
  ];

  return (
    <div className="animate-rise space-y-6">
      {/* Profile header */}
      <section className="relative overflow-hidden rounded-[2rem] glass-strong p-8">
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-right">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-400 to-sky-500 text-4xl shadow-xl shadow-brand-500/30">
            {student.gender === 'F' ? '👩‍🎓' : '👨‍🎓'}
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">مرحبًا بك</p>
            <h1 className="mt-1 text-3xl font-black text-white">{student.student_name_ar || 'عزيزي الطالب'}</h1>
            <p className="mt-1 text-sm text-slate-400">{gradeLabel(student.grade_level)}</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            خروج
          </button>
        </div>
      </section>

      {/* Info tiles */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl glass p-5">
            <div className="text-2xl">{t.icon}</div>
            <p className="mt-3 text-xs text-slate-400">{t.label}</p>
            <p className="mt-0.5 font-bold text-white">{t.value}</p>
          </div>
        ))}
      </section>

      {/* Identifier card */}
      <section className="rounded-2xl glass p-6">
        <h2 className="mb-4 text-lg font-bold text-white">الرقم التعريفي</h2>
        <div className="flex items-center justify-between rounded-xl bg-ink-900/60 px-5 py-4">
          <span className="text-xs text-slate-400">رقم الطالب</span>
          <code dir="ltr" className="font-mono text-lg tracking-widest text-brand-300">
            {student.ssn_encrypted}
          </code>
        </div>
      </section>

      <p className="text-center text-xs text-slate-500">
        يتم عرض بياناتك مباشرة من قاعدة البيانات. لمزيد من التفاصيل تواصل مع إدارة المدرسة.
      </p>
    </div>
  );
}
