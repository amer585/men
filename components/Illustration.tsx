import React from 'react';
import { BookOpenText, CalendarClock, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { SHOWCASE_SUBJECTS } from '../schoolData';

const previewItems = [
  {
    icon: BookOpenText,
    title: 'المواد الأساسية للمرحلة الإعدادية',
    description: 'العربية، الإنجليزية، الفرنسية، الرياضيات، العلوم، والدراسات الاجتماعية.',
  },
  {
    icon: CalendarClock,
    title: 'جدول يومي بعد تسجيل الدخول',
    description: 'توقيت الحصص، أسماء المعلمين، والقاعات لكل يوم من أيام الأسبوع.',
  },
  {
    icon: ShieldCheck,
    title: 'حضور وإشعارات المدرسة',
    description: 'سجل الحضور، التنبيهات الرسمية، ومبادرة انطلاقة رقمية داخل لوحة الطالب.',
  },
];

export const Illustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-[540px]">
      <div className="absolute inset-x-8 top-12 h-72 rounded-full bg-gradient-to-r from-blue-200/40 via-cyan-200/35 to-emerald-200/30 blur-3xl dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-emerald-900/15" />

      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/85 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">بوابة الطالب</div>
            <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">واجهة تعريفية قبل تسجيل الدخول</h3>
            <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
              بعد إدخال الرقم القومي والمرحلة الدراسية تظهر كل البيانات التفصيلية داخل لوحة الطالب فقط.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-3 text-white shadow-lg dark:bg-blue-500">
            <GraduationCap className="h-7 w-7" />
          </div>
        </div>

        <div className="space-y-3">
          {previewItems.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80"
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                <item.icon className="h-4 w-4 text-blue-500" />
                {item.title}
              </div>
              <div className="text-sm leading-7 text-slate-500 dark:text-slate-400">{item.description}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 text-sm font-bold text-slate-800 dark:text-white">أمثلة المواد التي ستظهر داخل لوحة الطالب</div>
          <div className="flex flex-wrap gap-2">
            {SHOWCASE_SUBJECTS.slice(0, 6).map((subject) => (
              <span
                key={subject}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -left-4 top-12 rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
          <Sparkles className="h-4 w-4" />
          التفاصيل الكاملة بعد تسجيل الدخول
        </div>
      </div>
    </div>
  );
};
