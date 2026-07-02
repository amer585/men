import type { PortalData } from '../../apiService';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; mark: string; dot: string }> = {
  present: { label: 'حاضر', color: 'text-gold-400', bg: 'bg-gold-500/10 border-gold-500/15', mark: '✓', dot: 'bg-gold-400' },
  absent: { label: 'غائب', color: 'text-rose-300/80', bg: 'bg-rose-500/8 border-rose-500/15', mark: '✕', dot: 'bg-rose-400' },
  late: { label: 'متأخر', color: 'text-amber-300/80', bg: 'bg-amber-500/8 border-amber-500/15', mark: '!', dot: 'bg-amber-400' },
  excused: { label: 'بعذر', color: 'text-sky-300/80', bg: 'bg-sky-500/8 border-sky-500/15', mark: 'ـ', dot: 'bg-sky-400' },
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

const WEEKDAYS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export function TabAttendance({ data }: { data: PortalData }) {
  const s = data.attendanceStats;
  const limit = data.absenceLimit;

  // Build calendar: group attendance by year-month.
  const byMonth: Record<string, { date: string; status: string; note: string | null }[]> = {};
  for (const a of data.attendance) {
    const monthKey = a.date.slice(0, 7); // YYYY-MM
    if (!byMonth[monthKey]) byMonth[monthKey] = [];
    byMonth[monthKey].push(a);
  }

  const monthNames = ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  const summary = [
    { key: 'present', label: 'حاضر', value: s.present, color: 'text-gold-400', ring: 'ring-gold-500/20', bg: 'bg-gold-500/[0.06]' },
    { key: 'absent', label: 'غائب', value: s.absent, color: 'text-rose-300/80', ring: 'ring-rose-500/15', bg: 'bg-rose-500/[0.05]' },
    { key: 'late', label: 'متأخر', value: s.late, color: 'text-amber-300/80', ring: 'ring-amber-500/15', bg: 'bg-amber-500/[0.05]' },
    { key: 'excused', label: 'بعذر', value: s.excused, color: 'text-sky-300/80', ring: 'ring-sky-500/15', bg: 'bg-sky-500/[0.05]' },
  ];

  const absencePct = (limit.used / limit.limit) * 100;

  return (
    <div className="space-y-4">
      {/* Donut + percentage */}
      <div className="card-accent flex items-center gap-6 rounded-2xl glass-strong p-6">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(201,169,106,0.1)" strokeWidth="6" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="#c9a96a" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(s.percentage / 100) * 214} 214`} />
          </svg>
          <span className="absolute text-lg font-black text-gold-400">{s.percentage}%</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white">نسبة الحضور</p>
          <p className="mt-1 text-xs text-slate-500">من إجمالي {s.total} يوم دراسي</p>
        </div>
      </div>

      {/* 30-day absence limit warning (Egyptian rule: حرمان) */}
      <div className={`rounded-2xl border p-4 ${absencePct > 80 ? 'border-rose-500/20 bg-rose-500/[0.06]' : 'border-gold-500/10 bg-gold-500/[0.03]'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${absencePct > 80 ? 'bg-rose-500/15 text-rose-400' : 'bg-gold-500/10 text-gold-400'}`}>⚠</span>
            <div>
              <p className="text-sm font-bold text-white">حد الغياب (حرمان)</p>
              <p className="text-xs text-slate-500">{limit.used} / {limit.limit} يوم غياب بدون عذر</p>
            </div>
          </div>
          <span className={`text-sm font-black ${absencePct > 80 ? 'text-rose-400' : 'text-gold-400'}`}>
            {limit.remaining} متبقٍ
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className={`animate-fill h-full rounded-full ${absencePct > 80 ? 'bg-gradient-to-r from-rose-500 to-red-400' : 'bg-gradient-to-r from-gold-500 to-gold-300'}`}
            style={{ width: `${Math.min(absencePct, 100)}%` }}
          />
        </div>
        {absencePct > 80 && (
          <p className="mt-2 text-xs text-rose-300/80">تحذير: اقتربت من الحد الأقصى للغياب المسموح. تجاوز 30 يومًا يؤدي للحرمان من الامتحان.</p>
        )}
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

      {/* Calendar view — month-by-month */}
      <div className="space-y-4">
        <h3 className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">التقويم</h3>
        {Object.entries(byMonth).map(([monthKey, days]) => {
          const [year, month] = monthKey.split('-').map(Number);
          // Build calendar grid for this month.
          const dayMap: Record<string, string> = {};
          for (const d of days) {
            const day = parseInt(d.date.slice(8, 10), 10);
            dayMap[day] = d.status;
          }
          // Get first day of month + days in month.
          const firstDay = new Date(year, month - 1, 1);
          let startCol = firstDay.getDay() + 1; // 0=Sat in our WEEKDAYS
          // Adjust: our week starts Saturday (index 0).
          startCol = (firstDay.getDay() + 1) % 7;
          const daysInMonth = new Date(year, month, 0).getDate();

          return (
            <div key={monthKey} className="card-accent rounded-2xl glass p-5">
              <h4 className="mb-3 text-sm font-bold text-white">{monthNames[month]} {year}</h4>
              {/* Weekday headers */}
              <div className="mb-1 grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map((wd) => (
                  <div key={wd} className="text-[10px] font-bold text-slate-600">{wd.slice(0, 2)}</div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1" dir="rtl">
                {Array.from({ length: startCol }).map((_, i) => (
                  <div key={`e${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const status = dayMap[day];
                  const cfg = status ? (STATUS_CONFIG[status.toLowerCase()] || null) : null;
                  return (
                    <div
                      key={day}
                      className={`flex aspect-square items-center justify-center rounded-lg border text-xs font-bold transition ${
                        cfg ? cfg.bg + ' ' + cfg.color : 'border-white/[0.03] bg-white/[0.01] text-slate-600'
                      }`}
                      title={cfg ? `${day} ${monthNames[month]}: ${cfg.label}` : undefined}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent records list */}
      <div className="space-y-2">
        <h3 className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">سجل الحضور التفصيلي</h3>
        {data.attendance.slice(0, 15).map((a, i) => {
          const cfg = STATUS_CONFIG[String(a.status).toLowerCase()] || STATUS_CONFIG.present;
          return (
            <div key={`${a.date}-${i}`} className="flex items-center gap-3 rounded-xl glass p-3.5 transition hover:border-gold-500/15">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.bg} border text-sm font-bold ${cfg.color}`}>{cfg.mark}</div>
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
