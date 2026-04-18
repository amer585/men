import React from 'react';
import { BellRing, Clock3, MonitorSmartphone, Sparkles } from 'lucide-react';

const previewSubjects = [
  'اللغة العربية',
  'الرياضيات',
  'اللغة الإنجليزية',
  'اللغة الفرنسية',
  'العلوم',
  'الدراسات الاجتماعية',
];

const todaySchedule = [
  { time: '08:00', subject: 'الرياضيات' },
  { time: '08:50', subject: 'اللغة العربية' },
  { time: '09:55', subject: 'العلوم' },
  { time: '10:45', subject: 'اللغة الفرنسية' },
];

export const Illustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-[560px]">
      <div className="absolute inset-x-6 top-10 h-72 rounded-full bg-gradient-to-r from-blue-200/40 via-cyan-200/40 to-emerald-200/40 blur-3xl dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-emerald-900/20" />

      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/85 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">لوحة الطالب</div>
            <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">الثاني الإعدادي - فصل 2/ج</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              مدرسة المستقبل الرسمية الإعدادية المشتركة
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 px-4 py-3 text-right text-white shadow-lg dark:bg-blue-500">
            <div className="text-[11px] font-bold text-slate-300 dark:text-blue-50">متوسط الأداء</div>
            <div className="mt-1 text-3xl font-black">91%</div>
          </div>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              <MonitorSmartphone className="h-4 w-4 text-blue-500" />
              المواد الأساسية
            </div>
            <div className="flex flex-wrap gap-2">
              {previewSubjects.map((subject) => (
                <span
                  key={subject}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              <Clock3 className="h-4 w-4 text-emerald-500" />
              جدول اليوم
            </div>
            <div className="space-y-2">
              {todaySchedule.map((item) => (
                <div
                  key={`${item.time}-${item.subject}`}
                  className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm shadow-sm dark:bg-slate-900"
                >
                  <span className="font-bold text-slate-700 dark:text-slate-200">{item.subject}</span>
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500">حضور آخر 30 يوماً</div>
            <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">27</div>
            <div className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">3 حالات تأخير وغياب فقط</div>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500">الامتحانات الشهرية</div>
            <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">18</div>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">درجات محدثة لكل مادة</div>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500">الإشعارات</div>
            <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">4</div>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">تنبيهات المدرسة والمبادرات</div>
          </div>
        </div>
      </div>

      <div className="absolute -left-3 top-12 rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
          <BellRing className="h-4 w-4" />
          مبادرة انطلاقة رقمية
        </div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">ورش برمجة داخل معمل الحاسب</div>
      </div>

      <div className="absolute -bottom-4 right-4 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          <Sparkles className="h-4 w-4" />
          كل صفحة ممتلئة ببيانات فعلية
        </div>
      </div>
    </div>
  );
};
