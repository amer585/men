import type { PortalData } from '../../apiService';

const DAY_ORDER = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

// Muted, formal variations — all warm gold-tinted slates, no neon rainbow
const SUBJECT_TONES: Record<string, string> = {
  'اللغة العربية': 'border-gold-500/15 bg-gold-500/[0.05] text-gold-300',
  'اللغة الإنجليزية': 'border-sky-500/12 bg-sky-500/[0.04] text-sky-200/80',
  'الرياضيات': 'border-violet-500/12 bg-violet-500/[0.04] text-violet-200/80',
  'العلوم': 'border-teal-500/12 bg-teal-500/[0.04] text-teal-200/80',
  'الدراسات الاجتماعية': 'border-amber-500/12 bg-amber-500/[0.04] text-amber-200/80',
  'التربية الدينية': 'border-cyan-500/12 bg-cyan-500/[0.04] text-cyan-200/80',
  'الحاسب الآلي': 'border-rose-500/12 bg-rose-500/[0.04] text-rose-200/80',
};

function subjectStyle(subject: string): string {
  return SUBJECT_TONES[subject] || 'border-slate-500/12 bg-slate-500/[0.04] text-slate-300';
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

  return (
    <div className="space-y-4">
      {days.map((day, di) => {
        const periods = data.schedule[day] || [];
        return (
          <div key={day}>
            <div className="mb-2 flex items-center gap-2 px-1">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              <h3 className="text-sm font-bold text-white">{day}</h3>
            </div>
            <div className="space-y-2">
              {periods.map((p, pi) => (
                <div
                  key={`${day}-${p.period}`}
                  className={`flex items-center gap-3 rounded-2xl border ${subjectStyle(p.subject_name)} p-3.5 transition hover:scale-[1.01]`}
                  style={{ animation: `tabRise 0.3s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${(di * 7 + pi) * 40}ms` }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500">من</span>
                    <span dir="ltr" className="font-mono text-xs font-bold text-white">{p.start_time}</span>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{p.subject_name}</p>
                    {p.teacher_name && <p className="text-xs text-slate-400">{p.teacher_name}</p>}
                  </div>
                  <span className="rounded-lg bg-black/20 px-2 py-1 text-[11px] font-medium text-slate-400">حصة {p.period}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
