import type { StudentProfile, PortalData } from '../apiService';

interface Props {
  student: StudentProfile;
  data: PortalData;
  setTab: (t: any) => void;
}

export function TabOverview({ student, data, setTab }: Props) {
  const avg = data.average ? parseFloat(data.average) : 0;
  const att = data.attendanceStats;

  const stats = [
    { label: 'المعدل العام', value: data.average ? `${data.average} / 50` : '—', icon: 'M', pct: data.average ? (avg / 50) * 100 : 0 },
    { label: 'نسبة الحضور', value: `${att.percentage}%`, icon: 'A', pct: att.percentage },
    { label: 'عدد المواد', value: String(data.grades.length), icon: 'S', pct: (data.grades.length / 10) * 100 },
    { label: 'أيام الغياب', value: String(att.absent + att.excused), icon: 'X', pct: att.total > 0 ? ((att.absent + att.excused) / att.total) * 100 : 0 },
  ];

  const tiles = [
    { label: 'المدرسة', value: student.school_name || '—' },
    { label: 'الفصل', value: student.class_name || '—' },
    { label: 'الإدارة التعليمية', value: student.admin_zone || '—' },
    { label: 'المحافظة', value: student.gov_code || '—' },
  ];

  const latestAnn = data.announcements[0];

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stats.map((s) => (
          <div key={s.label} className="card-accent group relative overflow-hidden rounded-2xl glass p-5 transition hover:border-gold-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">{s.label}</p>
                <p className="mt-1 text-2xl font-black text-white">{s.value}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-500/15 bg-gold-500/[0.06] font-mono text-sm font-bold text-gold-400">
                {s.icon}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="animate-fill h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300"
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
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{t.label}</p>
            <p className="mt-1.5 font-bold text-white">{t.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickLink label="استعراض الدرجات" hint={`${data.grades.length} مواد`} onClick={() => setTab('grades')} />
        <QuickLink label="الجدول الدراسي" hint="الأسبوع الحالي" onClick={() => setTab('schedule')} />
        <QuickLink label="آخر الإعلانات" hint={`${data.announcements.length} إعلان`} onClick={() => setTab('announcements')} />
      </div>

      {/* Latest announcement preview */}
      {latestAnn && (
        <div
          className="cursor-pointer rounded-2xl glass p-5 transition hover:border-gold-500/20"
          onClick={() => setTab('announcements')}
        >
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${latestAnn.importance === 'high' ? 'bg-rose-400' : 'bg-gold-400'}`} />
            <h3 className="font-bold text-white">{latestAnn.title}</h3>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-slate-400">{latestAnn.content}</p>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-gold-500/10 bg-ink-900/40 px-5 py-4">
        <span className="text-[11px] uppercase tracking-wider text-slate-500">الرقم التعريفي</span>
        <code dir="ltr" className="font-mono text-sm tracking-widest text-gold-400">{student.ssn_encrypted}</code>
      </div>
    </div>
  );
}

function QuickLink({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl glass p-4 text-right transition hover:border-gold-500/20"
    >
      <div className="flex-1">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>
      <span className="text-gold-500 transition group-hover:-translate-x-1">←</span>
    </button>
  );
}
