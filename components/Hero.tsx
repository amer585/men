interface HeroProps {
  onStudent: () => void;
  onStaff: () => void;
}

const FEATURES = [
  { icon: '🎓', title: 'بوابة الطلاب', desc: 'متابعة البيانات الدراسية والدرجات بسهولة وأمان.' },
  { icon: '🏫', title: 'إدارة المدارس', desc: 'تسجيل الطلاب وإدخال الدرجات وإدارة الفصول.' },
  { icon: '🛡️', title: 'حماية متقدمة', desc: 'مصادقة مشفّرة (JWT + bcrypt) وصلاحيات دقيقة.' },
  { icon: '⚡', title: 'أداء فائق', desc: 'قاعدة بيانات PostgreSQL وطبقة تخزين مؤقت Redis.' },
];

const STATS = [
  { value: '12', label: 'صف دراسي' },
  { value: '27', label: 'محافظة' },
  { value: '99.9%', label: 'وقت التشغيل' },
  { value: 'REST', label: 'واجهة برمجية' },
];

export function Hero({ onStudent, onStaff }: HeroProps) {
  return (
    <div className="animate-rise">
      {/* Headline */}
      <section className="relative overflow-hidden rounded-[2rem] glass-strong p-8 text-center md:p-14">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
            النظام يعمل الآن · PostgreSQL + Redis
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
            منصة <span className="text-gradient">مدرستنا</span> التعليمية
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
            بوابة موحّدة للطلاب والمدرسين والإدارة — سجّل الدخول لمتابعة بياناتك الدراسية،
            أو أدِر فصولك ودرجات طلابك من مكان واحد.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={onStudent}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-emerald-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand-500/30 transition hover:shadow-brand-500/50 hover:brightness-110 sm:w-auto"
            >
              🎓 دخول الطالب
              <span className="transition group-hover:-translate-x-1">←</span>
            </button>
            <button
              onClick={onStaff}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-bold text-slate-100 backdrop-blur transition hover:bg-white/10 sm:w-auto"
            >
              🏫 دخول المدرّس / الإدارة
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl glass p-4 text-center">
            <p className="text-2xl font-black text-white md:text-3xl">{s.value}</p>
            <p className="mt-1 text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="group rounded-2xl glass p-5 transition hover:border-brand-400/30 hover:bg-white/[0.06]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl">{f.icon}</div>
            <h3 className="mt-4 font-bold text-white">{f.title}</h3>
            <p className="mt-1.5 text-sm text-slate-400">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
