import type { PortalData } from '../../apiService';

const CATEGORY_CONFIG: Record<string, { label: string; icon: string }> = {
  exams: { label: 'امتحانات', icon: '📝' },
  meetings: { label: 'اجتماعات', icon: '👥' },
  trips: { label: 'رحلات', icon: '🚌' },
  awards: { label: 'تكريم', icon: '🏆' },
  schedule: { label: 'جدول', icon: '📅' },
  general: { label: 'عام', icon: '📢' },
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
        <span className="text-4xl opacity-40">📢</span>
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
            className={`relative overflow-hidden rounded-2xl glass p-5 transition hover:bg-white/[0.06] ${
              isHigh ? 'ring-1 ring-inset ring-rose-500/20' : ''
            }`}
            style={{ animation: `tabRise 0.4s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${i * 60}ms` }}
          >
            {isHigh && (
              <div className="absolute right-0 top-0 h-1 w-full bg-gradient-to-l from-rose-500 to-orange-500" />
            )}
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${isHigh ? 'bg-rose-500/15' : 'bg-white/5'}`}>
                {cat.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white">{a.title}</h3>
                  {isHigh && <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-300">هام</span>}
                </div>
                <span className="mt-0.5 inline-block rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">{cat.label}</span>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{a.content}</p>
                <p className="mt-3 text-xs text-slate-500">📅 {formatDate(a.created_at)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
