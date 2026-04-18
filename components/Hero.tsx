import React from 'react';
import { CalendarClock, GraduationCap, LayoutGrid, ShieldCheck } from 'lucide-react';
import { Illustration } from './Illustration';

interface HeroProps {
  onLogin: () => void;
}

const serviceCards = [
  {
    icon: ShieldCheck,
    title: 'متابعة الحضور والانضباط',
    description: 'عرض آخر 30 يوماً دراسياً مع رصيد الغياب والتنبيهات الرسمية للطالب.',
  },
  {
    icon: LayoutGrid,
    title: 'جدول يومي بتوقيت الحصص',
    description: 'حصة بحصة مع أسماء المواد والمعلمين والقاعات طوال أيام الأسبوع.',
  },
  {
    icon: CalendarClock,
    title: 'تقييمات وإشعارات المدرسة',
    description: 'الدرجات الشهرية، التقييمات الأسبوعية، والتنبيهات المهمة من إدارة المدرسة.',
  },
];

export const Hero: React.FC<HeroProps> = ({ onLogin }) => {
  return (
    <div className="space-y-8 py-6 lg:py-10 animate-in fade-in duration-700">
      <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-10">
        <div className="space-y-6 text-right">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-bold text-blue-700 shadow-sm backdrop-blur-sm dark:border-blue-800 dark:bg-slate-900/80 dark:text-blue-300">
            <GraduationCap className="h-4 w-4" />
            بوابة المرحلة الإعدادية في المدارس المصرية
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 dark:text-white lg:text-6xl">
              متابعة الطالب اليومية من
              <span className="bg-gradient-to-l from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-200">
                {' '}
                الحضور حتى الدرجات
              </span>
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              تعرض المنصة بيانات الطالب المدرسية بشكل واضح وممتلئ: المواد الأساسية للمرحلة الإعدادية، التقييمات
              الأسبوعية، الامتحانات الشهرية، الجدول الدراسي بتوقيت الحصص، والتنبيهات الرسمية من المدرسة.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={onLogin}
              className="rounded-2xl bg-slate-900 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-slate-300/20 transition-all hover:-translate-y-0.5 hover:shadow-2xl dark:bg-white dark:text-slate-900 dark:shadow-none"
            >
              الدخول إلى بيانات الطالب
            </button>
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
              تسجيل بالرقم القومي والمرحلة الدراسية للوصول إلى التفاصيل الكاملة
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Illustration />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {serviceCards.map((card) => (
          <div
            key={card.title}
            className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/80"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
              <card.icon className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{card.title}</h3>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
