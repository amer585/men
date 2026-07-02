import type { PortalData } from '../../apiService';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  present: { label: 'حاضر', color: 'text-brand-300', bg: 'bg-brand-500/10 border-brand-500/20', icon: '✓' },
  absent: { label: 'غائب', color: 'text-rose-300', bg: 'bg-rose-500/10 border-rose-500/20', icon: '✗' },
  late: { label: 'متأخر', color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/20', icon: '⏰' },
  excused: { label: 'بعذر', color: 'text-sky-300', bg: 'bg-sky-500/10 border-sky-500/20', icon: '📝' },
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
    { key: 'present', label: 'حاضر', value: s.present, color: 'text-brand-400', ring: 'ring-brand-500/20', bg: 'bg-brand-500/10' },
    { key: 'absent', label: 'غائب', value: s.absent, color: 'text-rose-400', ring: 'ring-rose-500/20', bg: 'bg-rose-500/10' },
    { key: 'late', label: 'متأخر', value: s.late, color: 'text-amber-400', ring: 'ring-amber-500/20', bg: 'bg-amber-500/10' },
    { key: 'excused', label: 'بعذر', value: s.excused, color: 'text-sky-400', ring: 'ring-sky-500/20', bg: 'bg-sky-500/10' },
  ];

  return (
    <div className="space-y-4">
      {/* Donut + percentage */}
      <div className="flex items-center gap-6 rounded-2xl glass-strong p-6">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34" fill="none" stroke="#34d399" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${(s.percentage / 100) * 214} 214`}
            />
          </svg>
          <span className="absolute text-lg font-black text-white">{s.percentage}%</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white">نسبة الحضور</p>
          <p className="mt-1 text-xs text-slate-400">من إجمالي {s.total} يوم دراسي</p>
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
        <h3 className="px-1 text-sm font-bold text-slate-300">سجل الحضور الأخير</h3>
        {data.attendance.map((a, i) => {
          const cfg = STATUS_CONFIG[String(a.status).toLowerCase()] || STATUS_CONFIG.present;
          return (
            <div
              key={`${a.date}-${i}`}
              className="flex items-center gap-3 rounded-xl glass p-3.5 transition hover:bg-white/[0.06]"
              style={{ animation: `tabRise 0.3s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${i * 30}ms` }}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.bg} border text-sm font-bold ${cfg.color}`}>
                {cfg.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{formatDate(a.date)}</p>
                {a.note && <p className="text-xs text-slate-500">{a.note}</p>}
              </div>
              <span className={`rounded-lg px-3 py-1 text-xs font-bold ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
