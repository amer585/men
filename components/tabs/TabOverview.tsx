import type { StudentProfile, PortalData } from '../apiService';
import { gradeLabel } from '../schoolData';

interface Props {
  student: StudentProfile;
  data: PortalData;
  setTab: (t: any) => void;
}

export function TabOverview({ student, data, setTab }: Props) {
  const avg = data.average ? parseFloat(data.average) : 0;
  const att = data.attendanceStats;

  const stats = [
    { label: 'المعدل العام', value: data.average ? `${data.average} / 50` : '—', icon: '🎯', color: 'from-brand-400 to-emerald-500', pct: data.average ? (avg / 50) * 100 : 0 },
    { label: 'نسبة الحضور', value: `${att.percentage}%`, icon: '✅', color: 'from-sky-400 to-blue-500', pct: att.percentage },
    { label: 'عدد المواد', value: String(data.grades.length), icon: '📚', color: 'from-violet-400 to-purple-500', pct: (data.grades.length / 10) * 100 },
    { label: 'أيام الغياب', value: String(att.absent + att.excused), icon: '📋', color: 'from-amber-400 to-orange-500', pct: att.total > 0 ? ((att.absent + att.excused) / att.total) * 100 : 0 },
  ];

  const tiles = [
    { label: 'المدرسة', value: student.school_name || '—', icon: '🏫' },
    { label: 'الفصل', value: student.class_name || '—', icon: '📌' },
    { label: 'الإدارة التعليمية', value: student.admin_zone || '—', icon: '🗺️' },
    { label: 'المحافظة', value: student.gov_code || '—', icon: '📍' },
  ];

  const latestAnn = data.announcements[0];

  return (
    <div className="space-y-5">
      {/* Stat cards with progress bars */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stats.map((s) => (
          <div key={s.label} className="group relative overflow-hidden rounded-2xl glass p-5 transition hover:bg-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="mt-1 text-2xl font-black text-white">{s.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-xl shadow-lg`}>
                {s.icon}
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className={`animate-fill h-full rounded-full bg-gradient-to-r ${s.color}`}
                style={{ width: `${Math.min(s.pct, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Info tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl glass p-4">
            <div className="text-xl">{t.icon}</div>
            <p className="mt-2 text-xs text-slate-400">{t.label}</p>
            <p className="mt-0.5 font-bold text-white">{t.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickLink icon="📝" label="استعراض الدرجات" hint={`${data.grades.length} مواد`} onClick={() => setTab('grades')} />
        <QuickLink icon="📅" label="الجدول الدراسي" hint="الأسبوع الحالي" onClick={() => setTab('schedule')} />
        <QuickLink icon="📢" label="آخر الإعلانات" hint={`${data.announcements.length} إعلان`} onClick={() => setTab('announcements')} />
      </div>

      {/* Latest announcement preview */}
      {latestAnn && (
        <div
          className="cursor-pointer rounded-2xl glass p-5 transition hover:bg-white/[0.06]"
          onClick={() => setTab('announcements')}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{latestAnn.importance === 'high' ? '🔴' : '🟢'}</span>
            <h3 className="font-bold text-white">{latestAnn.title}</h3>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-slate-400">{latestAnn.content}</p>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl bg-ink-900/60 px-5 py-4">
        <span className="text-xs text-slate-400">الرقم التعريفي للطالب</span>
        <code dir="ltr" className="font-mono text-sm tracking-widest text-brand-300">{student.ssn_encrypted}</code>
      </div>
    </div>
  );
}

function QuickLink({ icon, label, hint, onClick }: { icon: string; label: string; hint: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl glass p-4 text-right transition hover:bg-white/[0.06]"
    >
      <span className="text-2xl transition group-hover:scale-110">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>
      <span className="text-slate-500 transition group-hover:-translate-x-1">←</span>
    </button>
  );
}
