import type { PortalData } from '../../apiService';

const DAY_ORDER = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء'];

const SUBJECT_STYLES: Record<string, string> = {
  'اللغة العربية': 'bg-gold-500/10 text-gold-300 border-gold-500/15',
  'اللغة الإنجليزية': 'bg-sky-500/8 text-sky-200/80 border-sky-500/12',
  'الرياضيات': 'bg-violet-500/8 text-violet-200/80 border-violet-500/12',
  'العلوم': 'bg-teal-500/8 text-teal-200/80 border-teal-500/12',
  'الدراسات الاجتماعية': 'bg-amber-500/8 text-amber-200/80 border-amber-500/12',
  'التربية الدينية': 'bg-cyan-500/8 text-cyan-200/80 border-cyan-500/12',
  'الحاسب الآلي': 'bg-rose-500/8 text-rose-200/80 border-rose-500/12',
};

function subjectStyle(s: string): string {
  return SUBJECT_STYLES[s] || 'bg-slate-500/8 text-slate-300 border-slate-500/12';
}

export function TabSchedule({ data }: { data: PortalData }) {
  const days = Object.keys(data.schedule).sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));

  if (days.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <span className="text-3xl text-gold-500/30">—</span>
        <p className="text-sm text-slate-500">لا يوجد جدول دراسي متاح</p>
      </div>
    );
  }

  // Build a grid: periods (rows) × days (columns).
  // Find all unique periods across all days.
  const allPeriods = Array.from(new Set(
    days.flatMap((d) => (data.schedule[d] || []).map((p) => p.period)),
  )).sort((a, b) => a - b);

  // Build a lookup map: { day-period: scheduleItem }
  const lookup: Record<string, typeof data.schedule[string][0]> = {};
  for (const day of days) {
    for (const item of data.schedule[day] || []) {
      lookup[`${day}-${item.period}`] = item;
    }
  }

  return (
    <div className="animate-tab-rise overflow-x-auto">
      <table className="w-full min-w-[700px] border-separate border-spacing-1.5">
        <thead>
          <tr>
            <th className="sticky right-0 z-10 rounded-xl bg-ink-900/80 px-3 py-3 text-center text-xs font-bold text-gold-400 backdrop-blur-sm">
              الحصة
            </th>
            {days.map((day) => (
              <th key={day} className="rounded-xl bg-ink-900/60 px-2 py-3 text-center text-xs font-bold text-white">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allPeriods.map((period, pi) => {
            const firstItem = days.map((d) => lookup[`${d}-${period}`]).find(Boolean);
            const time = firstItem ? `${firstItem.start_time}` : '';
            return (
              <tr key={period}>
                {/* Period/time label */}
                <td className="sticky right-0 z-10 rounded-xl border border-gold-500/10 bg-ink-900/80 px-2 py-2.5 text-center backdrop-blur-sm">
                  <div className="text-xs font-bold text-white">{time}</div>
                  <div className="text-[10px] text-slate-500">حصة {period}</div>
                </td>
                {/* Day cells */}
                {days.map((day) => {
                  const item = lookup[`${day}-${period}`];
                  if (!item) {
                    return <td key={day} className="rounded-xl border border-white/[0.03] bg-white/[0.01] p-2" />;
                  }
                  return (
                    <td
                      key={day}
                      className={`rounded-xl border p-2.5 text-center transition hover:scale-[1.02] ${subjectStyle(item.subject_name)}`}
                      style={{ animation: `tabRise 0.3s ease both`, animationDelay: `${pi * 30}ms` }}
                    >
                      <div className="text-xs font-bold leading-tight">{item.subject_name}</div>
                      {item.teacher_name && <div className="mt-0.5 text-[10px] opacity-70">{item.teacher_name}</div>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
