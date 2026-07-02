interface IllustrationProps {
  /** Dark mode uses gold bars, light mode uses blue bars — handled via classes. */
  variant?: 'dark' | 'light';
}

/**
 * A premium stats-preview card shown next to the Hero headline. Inspired by the
 * reference design — shows a mini dashboard with bar chart, performance %, and
 * attendance. Adapts to the current theme.
 */
export function Illustration({ variant = 'dark' }: IllustrationProps) {
  const bars = [40, 70, 55, 85, 60, 95];

  return (
    <div className="relative flex aspect-square w-full max-w-[460px] items-center justify-center">
      {/* Glow behind the card */}
      <div
        className="animate-breathe absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            variant === 'dark'
              ? 'radial-gradient(circle, rgba(201,169,106,0.12), transparent 65%)'
              : 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 65%)',
        }}
      />

      <div className="glass-strong relative z-10 flex w-full flex-col gap-5 rounded-3xl p-6 shadow-2xl">
        {/* Header row — avatar + skeleton + status */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black shadow-lg ${
              variant === 'dark'
                ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-ink-950 shadow-gold-500/20'
                : 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-blue-200'
            }`}
          >
            أ
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded-full bg-white/15" />
            <div className="h-2 w-1/4 rounded-full bg-white/10" />
          </div>
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold ${
              variant === 'dark' ? 'bg-gold-500/15 text-gold-400' : 'bg-green-100 text-green-700'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" /> منتظم
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex h-32 items-end justify-between gap-2 px-2">
          {bars.map((h, i) => (
            <div key={i} className="relative h-full w-full overflow-hidden rounded-t-xl bg-white/5">
              <div
                className={`animate-fill absolute bottom-0 left-0 w-full rounded-t-xl ${
                  variant === 'dark' ? 'bg-gradient-to-t from-gold-600 to-gold-400' : 'bg-gradient-to-t from-blue-600 to-cyan-400'
                }`}
                style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
              />
            </div>
          ))}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-3">
            <div className="mb-2 flex items-center gap-2">
              <div
                className={`flex items-center justify-center rounded-lg p-1.5 text-[10px] font-bold ${
                  variant === 'dark' ? 'bg-gold-500/10 text-gold-400' : 'bg-purple-100 text-purple-600'
                }`}
              >
                ↑
              </div>
              <span className="text-[10px] font-bold text-slate-500">الأداء العام</span>
            </div>
            <div className="text-2xl font-black text-white">92%</div>
          </div>
          <div className="glass rounded-2xl p-3">
            <div className="mb-2 flex items-center gap-2">
              <div
                className={`flex items-center justify-center rounded-lg p-1.5 text-[10px] font-bold ${
                  variant === 'dark' ? 'bg-gold-500/10 text-gold-400' : 'bg-amber-100 text-amber-600'
                }`}
              >
                ✓
              </div>
              <span className="text-[10px] font-bold text-slate-500">الحضور</span>
            </div>
            <div className="text-2xl font-black text-white">28/30</div>
          </div>
        </div>
      </div>
    </div>
  );
}
