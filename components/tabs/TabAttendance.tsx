import type { PortalData } from '../../apiService';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; mark: string }> = {
  present: { label: 'حاضر', color: 'text-gold-400', bg: 'bg-gold-500/10 border-gold-500/15', mark: '✓' },
  absent: { label: 'غائب', color: 'text-rose-300/80', bg: 'bg-rose-500/8 border-rose-500/15', mark: '✕' },
  late: { label: 'متأخر', color: 'text-amber-300/80', bg: 'bg-amber-500/8 border-amber-500/15', mark: '!' },
  excused: { label: 'بعذر', color: 'text-sky-300/80', bg: 'bg-sky-500/8 border-sky-500/15', mark: 'ـ' },
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
  } catch {
    return iso;
  }
}

export function TabAttendance({ data }: { data: PortalData }) {
  const s = data.attendanceStats;

  const summary = [
    { key: 'present', label: 'حاضر', value: s.present, color: 'text-gold-400', ring: 'ring-gold-500/20', bg: 'bg-gold-500/[0.06]' },
    { key: 'absent', label: 'غائب', value: s.absent, color: 'text-rose-300/80', ring: 'ring-rose-500/15', bg: 'bg-rose-500/[0.05]' },
    { key: 'late', label: 'متأخر', value: s.late, color: 'text-amber-300/80', ring: 'ring-amber-500/15', bg: 'bg-amber-500/[0.05]' },
    { key: 'excused', label: 'بعذر', value: s.excused, color: 'text-sky-300/80', ring: 'ring-sky-500/15', bg: 'bg-sky-500/[0.05]' },
  ];

  return (
    <div className="space-y-4">
      {/* Donut + percentage */}
      <div className="card-accent flex items-center gap-6 rounded-2xl glass-strong p-6">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(201,169,106,0.1)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34" fill="none" stroke="#c9a96a" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${(s.percentage / 100) * 214} 214`}
            />
          </svg>
          <span className="absolute text-lg font-black text-gold-400">{s.percentage}%</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white">نسبة الحضور</p>
          <p className="mt-1 text-xs text-slate-500">من إجمالي {s.total} يوم دراسي</p>
        </div>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-4 gap-2">
        {summary.map((item) => (
          <div key={item.key} className={`rounded-2xl ${item.bg} p-3 text-center ring-1 ring-inset ${item.ring}`}>
            <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Recent records */}
      <div className="space-y-2">
        <h3 className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">سجل الحضور الأخير</h3>
        {data.attendance.map((a, i) => {
          const cfg = STATUS_CONFIG[String(a.status).toLowerCase()] || STATUS_CONFIG.present;
          return (
            <div
              key={`${a.date}-${i}`}
              className="flex items-center gap-3 rounded-xl glass p-3.5 transition hover:border-gold-500/15"
              style={{ animation: `tabRise 0.3s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${i * 30}ms` }}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.bg} border text-sm font-bold ${cfg.color}`}>
                {cfg.mark}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{formatDate(a.date)}</p>
                {a.note && <p className="text-xs text-slate-500">{a.note}</p>}
              </div>
              <span className={`rounded-lg px-3 py-1 text-xs font-bold border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
