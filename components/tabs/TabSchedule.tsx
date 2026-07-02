import type { PortalData } from '../../apiService';

const DAY_ORDER = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

const SUBJECT_COLORS: Record<string, string> = {
  'اللغة العربية': 'from-emerald-500/20 to-emerald-600/10 text-emerald-300',
  'اللغة الإنجليزية': 'from-blue-500/20 to-blue-600/10 text-blue-300',
  'الرياضيات': 'from-violet-500/20 to-violet-600/10 text-violet-300',
  'العلوم': 'from-teal-500/20 to-teal-600/10 text-teal-300',
  'الدراسات الاجتماعية': 'from-amber-500/20 to-amber-600/10 text-amber-300',
  'التربية الدينية': 'from-cyan-500/20 to-cyan-600/10 text-cyan-300',
  'الحاسب الآلي': 'from-rose-500/20 to-rose-600/10 text-rose-300',
};

function subjectStyle(subject: string): string {
  return SUBJECT_COLORS[subject] || 'from-slate-500/20 to-slate-600/10 text-slate-300';
}

export function TabSchedule({ data }: { data: PortalData }) {
  const days = Object.keys(data.schedule).sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));

  if (days.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <span className="text-4xl opacity-40">📅</span>
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
              <span className="h-2 w-2 rounded-full bg-brand-400" />
              <h3 className="text-sm font-bold text-white">{day}</h3>
            </div>
            <div className="space-y-2">
              {periods.map((p, pi) => (
                <div
                  key={`${day}-${p.period}`}
                  className={`flex items-center gap-3 rounded-2xl bg-gradient-to-l ${subjectStyle(p.subject_name)} border border-white/5 p-3.5 transition hover:scale-[1.01]`}
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
