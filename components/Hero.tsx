import { Logo } from './Logo';

interface HeroProps {
  onStudent: () => void;
  theme: 'dark' | 'light';
}

export function Hero({ onStudent, theme }: HeroProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 text-center">
      {/* ── Logo centerpiece: glowing crest with rotating halo rings ── */}
      <div className="relative mb-10">
        {/* Outer rotating dashed ring */}
        <div
          className="halo-ring absolute left-1/2 top-1/2 h-44 w-44 rounded-full border-2 border-dashed border-gold-500/20"
          style={{ animationDuration: '22s' }}
        />
        {/* Inner counter-rotating solid ring */}
        <div
          className="halo-ring-rev absolute left-1/2 top-1/2 h-36 w-36 rounded-full border border-gold-500/15"
          style={{ animationDuration: '28s' }}
        />
        {/* Soft glow behind logo */}
        <div
          className="animate-breathe absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            background:
              theme === 'dark'
                ? 'radial-gradient(circle, rgba(201,169,106,0.35), transparent 70%)'
                : 'radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)',
          }}
        />
        {/* The logo itself */}
        <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-[1.75rem] border border-gold-500/20 bg-ink-900/50 backdrop-blur-sm">
          <Logo size={72} glow />
        </div>
      </div>

      {/* ── Headline — dramatic, large, gradient ── */}
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/[0.04] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-500/80">
        منصة الإدارة التعليمية
      </span>

      <h1 className="max-w-3xl text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-[1.05] tracking-tight text-white">
        بوابة <span className="text-shimmer">إدارتنا</span>
        <br />
        <span className="text-shimmer">الشاملة</span>
      </h1>

      <p className="mt-7 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
        تابع درجاتك، حضورك، جدولك الدراسي وآخر الإعلانات —
        في منصة رسمية موحّدة صُمّمت بعناية لطالب اليوم.
      </p>

      {/* ── Premium CTA button ── */}
      <button
        onClick={onStudent}
        className="btn-gold group mt-11 inline-flex items-center justify-center gap-3 rounded-2xl px-12 py-4.5 text-base font-bold"
      >
        <span>الدخول إلى بوابة الطلاب</span>
        <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1.5">←</span>
      </button>

      {/* ── Feature pills ── */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {[
          { icon: '🔒', label: 'آمن ومشفّر' },
          { icon: '⚡', label: 'فوري ومباشر' },
          { icon: '🏛️', label: 'رسمي ومعتمد' },
        ].map((f) => (
          <span key={f.label} className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="text-sm opacity-60">{f.icon}</span>
            {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}
