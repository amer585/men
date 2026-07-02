import type { PortalData } from '../../apiService';

const CATEGORY_CONFIG: Record<string, { label: string; mark: string }> = {
  exams: { label: 'امتحانات', mark: 'EX' },
  meetings: { label: 'اجتماعات', mark: 'ME' },
  trips: { label: 'رحلات', mark: 'TR' },
  awards: { label: 'تكريم', mark: 'AW' },
  schedule: { label: 'جدول', mark: 'SC' },
  general: { label: 'عام', mark: 'GE' },
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

export function TabAnnouncements({ data }: { data: PortalData }) {
  if (data.announcements.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <span className="text-3xl text-gold-500/30">—</span>
        <p className="text-sm text-slate-500">لا توجد إعلانات حالياً</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.announcements.map((a, i) => {
        const cat = CATEGORY_CONFIG[a.category] || CATEGORY_CONFIG.general;
        const isHigh = a.importance === 'high';
        return (
          <div
            key={a.id}
            className={`relative overflow-hidden rounded-2xl glass p-5 transition hover:border-gold-500/20 ${
              isHigh ? 'ring-1 ring-inset ring-rose-500/15' : ''
            }`}
            style={{ animation: `tabRise 0.4s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${i * 60}ms` }}
          >
            {isHigh && <div className="absolute right-0 top-0 h-0.5 w-full bg-gradient-to-l from-rose-500/60 to-transparent" />}
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-mono text-[11px] font-bold ${isHigh ? 'border-rose-500/20 bg-rose-500/[0.06] text-rose-300/80' : 'border-gold-500/15 bg-gold-500/[0.05] text-gold-400'}`}>
                {cat.mark}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-white">{a.title}</h3>
                  {isHigh && <span className="rounded-full border border-rose-500/20 bg-rose-500/[0.06] px-2 py-0.5 text-[10px] font-bold text-rose-300/80">هام</span>}
                </div>
                <span className="mt-0.5 inline-block rounded-md border border-white/5 bg-white/[0.02] px-2 py-0.5 text-[11px] text-slate-400">{cat.label}</span>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{a.content}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="h-1 w-1 rounded-full bg-gold-500/50" /> {formatDate(a.created_at)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
