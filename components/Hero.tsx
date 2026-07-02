import { Logo } from './Logo';

interface HeroProps {
  onStudent: () => void;
}

export function Hero({ onStudent }: HeroProps) {
  return (
    <div className="animate-rise flex flex-col items-center justify-center py-10 text-center md:py-20">
      {/* Premium logo crest */}
      <div className="relative mb-9">
        <div
          className="animate-sheen absolute inset-0 -m-6 rounded-full blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(201,169,106,0.3), transparent 70%)' }}
        />
        <Logo size={92} glow className="relative" />
      </div>

      {/* Small formal label */}
      <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-500/80">
        منصة الإدارة التعليمية
      </span>

      <h1 className="max-w-4xl text-4xl font-black leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl">
        بوابة <span className="text-shimmer">إدارتنا الشاملة</span>
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
        تابع درجاتك، حضورك، جدولك الدراسي وآخر الإعلانات —
        في منصة رسمية موحّدة مصممة لطالب اليوم.
      </p>

      {/* Single refined CTA */}
      <button
        onClick={onStudent}
        className="btn-gold group mt-10 inline-flex items-center justify-center gap-2.5 rounded-2xl px-10 py-4 text-base font-bold text-ink-950 transition-all duration-300 hover:scale-[1.03]"
      >
        <span>دخول الطلاب</span>
        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
      </button>

      {/* Formal trust line */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
        <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-gold-500/50" /> آمن</span>
        <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-gold-500/50" /> فوري</span>
        <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-gold-500/50" /> رسمي</span>
      </div>
    </div>
  );
}
