interface HeroProps {
  onStudent: () => void;
}

export function Hero({ onStudent }: HeroProps) {
  return (
    <div className="animate-rise flex flex-col items-center justify-center py-8 text-center md:py-16">
      {/* Floating decorative orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
        <div className="animate-float absolute left-[12%] top-[18%] text-3xl opacity-30">📘</div>
        <div className="animate-float delay-2000 absolute right-[14%] top-[24%] text-4xl opacity-25">✏️</div>
        <div className="animate-float delay-4000 absolute bottom-[16%] left-[20%] text-3xl opacity-20">🧮</div>
        <div className="animate-float delay-6000 absolute bottom-[22%] right-[18%] text-3xl opacity-25">📐</div>
      </div>

      {/* Glowing crest with cool icon */}
      <div className="relative mb-8">
        <div className="animate-pulse-glow absolute inset-0 rounded-full bg-brand-500/30 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-brand-400 via-emerald-500 to-sky-500 text-5xl shadow-2xl shadow-brand-500/40 glow-ring">
          🛡️
        </div>
      </div>

      <h1 className="max-w-4xl text-5xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
        منصة <span className="text-shimmer">إدارتنا الشاملة</span>
      </h1>

      <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-slate-400 md:text-xl">
        بوابتك الموحّدة لمتابعة الدرجات، الحضور، الجدول الدراسي والإعلانات —
        كل ما يخص مسارك التعليمي في مكان واحد.
      </p>

      {/* Single CTA */}
      <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center">
        <button
          onClick={onStudent}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500 to-emerald-600 px-10 py-4 text-base font-bold text-white shadow-xl shadow-brand-500/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-brand-500/50 sm:px-12"
        >
          <span className="text-xl">🎓</span>
          دخول الطلاب
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
        </button>
      </div>

      {/* Trust line */}
      <p className="mt-10 text-xs font-medium text-slate-500">
        آمن · سريع · يعمل على جميع الأجهزة
      </p>
    </div>
  );
}
