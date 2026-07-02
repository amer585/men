import { Logo } from './Logo';
import { Illustration } from './Illustration';

interface HeroProps {
  onStudent: () => void;
  theme: 'dark' | 'light';
}

export function Hero({ onStudent, theme }: HeroProps) {
  return (
    <div className="animate-rise flex flex-col-reverse items-center justify-between gap-12 py-10 lg:flex-row lg:gap-20 lg:py-16">
      {/* Right side — headline + CTA (text-right in RTL) */}
      <div className="flex-1 text-center lg:text-right">
        <div className="mb-6 flex justify-center lg:justify-start">
          <Logo size={72} glow />
        </div>

        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-500/80">
          منصة الإدارة التعليمية
        </span>

        <h1 className="max-w-2xl text-4xl font-black leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
          بوابة <span className="text-shimmer">إدارتنا الشاملة</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-slate-400 md:text-lg lg:mx-0">
          منصة رسمية لعرض الدرجات، الحضور، الجدول الدراسي والإعلانات —
          بطريقة آمنة ومنظمة لطالب اليوم.
        </p>

        {/* Button — reference style: solid, bold, rounded-2xl, shadow-xl */}
        <button
          onClick={onStudent}
          className="btn-gold group mt-9 inline-flex items-center justify-center gap-3 rounded-2xl px-10 py-4 text-base font-bold transition-all duration-300 hover:scale-[1.03]"
        >
          <span>الدخول إلى عرض التفاصيل</span>
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
        </button>

        {/* Trust line */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600 lg:justify-start">
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-gold-500/50" /> آمن</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-gold-500/50" /> فوري</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-gold-500/50" /> رسمي</span>
        </div>
      </div>

      {/* Left side — illustration card (stats preview) */}
      <div className="flex w-full flex-1 justify-center lg:justify-end">
        <Illustration variant={theme} />
      </div>
    </div>
  );
}
