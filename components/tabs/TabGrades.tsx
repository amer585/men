import type { PortalData } from '../../apiService';

const SUBJECT_ICONS: Record<string, string> = {
  'اللغة العربية': 'ع',
  'اللغة الإنجليزية': 'E',
  'الرياضيات': '∑',
  'العلوم': '⚗',
  'الدراسات الاجتماعية': '◙',
  'التربية الدينية': '☪',
  'الحاسب الآلي': '⌘',
};

// Muted, formal palette — gold/slate-based with subtle warmth
function gradeColor(value: number): string {
  if (value >= 45) return 'text-gold-400';
  if (value >= 38) return 'text-sky-300/80';
  if (value >= 25) return 'text-amber-300/70';
  return 'text-rose-300/80';
}

function gradeBar(value: number): string {
  if (value >= 45) return 'from-gold-500 to-gold-300';
  if (value >= 38) return 'from-sky-500/60 to-sky-400/50';
  if (value >= 25) return 'from-amber-500/50 to-amber-400/40';
  return 'from-rose-500/50 to-rose-400/40';
}

export function TabGrades({ data }: { data: PortalData }) {
  if (data.grades.length === 0) {
    return <EmptyState text="لا توجد درجات مسجلة حتى الآن" />;
  }

  return (
    <div className="space-y-4">
      {data.average && (
        <div className="card-accent flex items-center justify-between rounded-2xl glass-strong p-6">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">المعدل العام</p>
            <p className="mt-1 text-3xl font-black text-white">{data.average} <span className="text-base text-slate-500">/ 50</span></p>
          </div>
          <div className="relative flex h-16 w-16 items-center justify-center">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(201,169,106,0.1)" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="28" fill="none" stroke="#c9a96a" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${(parseFloat(data.average) / 50) * 176} 176`}
              />
            </svg>
            <span className="absolute text-sm font-bold text-gold-400">{Math.round((parseFloat(data.average) / 50) * 100)}%</span>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {data.grades.map((g, i) => {
          const val = parseFloat(g.grade_value);
          const numVal = isNaN(val) ? 0 : val;
          const icon = SUBJECT_ICONS[g.subject_name] || '◉';
          return (
            <div
              key={g.subject_name}
              className="flex items-center gap-4 rounded-2xl glass p-4 transition hover:border-gold-500/20"
              style={{ animation: `tabRise 0.4s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${i * 50}ms` }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-500/15 bg-gold-500/[0.05] font-mono text-lg text-gold-400">{icon}</div>
              <div className="flex-1">
                <p className="font-bold text-white">{g.subject_name}</p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`animate-fill h-full rounded-full bg-gradient-to-r ${gradeBar(numVal)}`}
                    style={{ width: `${(numVal / 50) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-left">
                <span className={`text-xl font-black ${gradeColor(numVal)}`}>{g.grade_value}</span>
                <span className="text-xs text-slate-600"> /50</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <span className="text-3xl text-gold-500/30">—</span>
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}
