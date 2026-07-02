import type { PortalData } from '../../apiService';

const SUBJECT_ICONS: Record<string, string> = {
  'اللغة العربية': '📖',
  'اللغة الإنجليزية': '🔤',
  'الرياضيات': '🔢',
  'العلوم': '🔬',
  'الدراسات الاجتماعية': '🌍',
  'التربية الدينية': '🕌',
  'الحاسب الآلي': '💻',
};

function gradeColor(value: number): string {
  if (value >= 45) return 'text-brand-400';
  if (value >= 38) return 'text-sky-400';
  if (value >= 25) return 'text-amber-400';
  return 'text-rose-400';
}

function gradeBar(value: number): string {
  if (value >= 45) return 'from-brand-400 to-emerald-500';
  if (value >= 38) return 'from-sky-400 to-blue-500';
  if (value >= 25) return 'from-amber-400 to-orange-500';
  return 'from-rose-400 to-red-500';
}

export function TabGrades({ data }: { data: PortalData }) {
  if (data.grades.length === 0) {
    return <EmptyState icon="📝" text="لا توجد درجات مسجلة حتى الآن" />;
  }

  return (
    <div className="space-y-4">
      {data.average && (
        <div className="flex items-center justify-between rounded-2xl glass-strong p-5">
          <div>
            <p className="text-xs text-slate-400">المعدل العام</p>
            <p className="mt-1 text-3xl font-black text-white">{data.average} <span className="text-base text-slate-500">/ 50</span></p>
          </div>
          <div className="relative flex h-16 w-16 items-center justify-center">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="28" fill="none" stroke="url(#grad)" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${(parseFloat(data.average) / 50) * 176} 176`}
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-sm font-bold text-white">{Math.round((parseFloat(data.average) / 50) * 100)}%</span>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {data.grades.map((g, i) => {
          const val = parseFloat(g.grade_value);
          const numVal = isNaN(val) ? 0 : val;
          const icon = SUBJECT_ICONS[g.subject_name] || '📚';
          return (
            <div
              key={g.subject_name}
              className="flex items-center gap-4 rounded-2xl glass p-4 transition hover:bg-white/[0.06]"
              style={{ animation: `tabRise 0.4s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${i * 50}ms` }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl">{icon}</div>
              <div className="flex-1">
                <p className="font-bold text-white">{g.subject_name}</p>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`animate-fill h-full rounded-full bg-gradient-to-r ${gradeBar(numVal)}`}
                    style={{ width: `${(numVal / 50) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-left">
                <span className={`text-xl font-black ${gradeColor(numVal)}`}>{g.grade_value}</span>
                <span className="text-xs text-slate-500"> /50</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <span className="text-4xl opacity-40">{icon}</span>
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}
