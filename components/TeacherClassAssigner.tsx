import React, { useEffect, useState } from 'react';
import {
  assignTeacherClass,
  listTeacherClasses,
  type TeacherClassAssignment,
} from '../apiService';
import { GRADE_LABELS } from '../schoolData';

const SUBJECT_OPTIONS = [
  'اللغة العربية',
  'اللغة الإنجليزية',
  'الرياضيات',
  'العلوم',
  'الدراسات الاجتماعية',
  'التربية الدينية',
  'الحاسب الآلي',
];

const inputCls =
  'w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-2.5 text-white focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15';

export function TeacherClassAssigner() {
  const [assignments, setAssignments] = useState<TeacherClassAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // New assignment form state
  const [teacherId, setTeacherId] = useState('');
  const [gradeLevel, setGradeLevel] = useState(7);
  const [className, setClassName] = useState('');
  const [subjectName, setSubjectName] = useState(SUBJECT_OPTIONS[0]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { assignments: list } = await listTeacherClasses();
      setAssignments(list ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل تحميل التكليفات');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const tid = Number(teacherId);
    if (!Number.isInteger(tid) || tid < 1) {
      setError('معرّف المعلّم يجب أن يكون رقمًا صحيحًا.');
      return;
    }
    if (!className.trim()) {
      setError('الفصل مطلوب.');
      return;
    }
    setSubmitting(true);
    try {
      await assignTeacherClass({
        teacher_id: tid,
        grade_level: gradeLevel,
        class_name: className.trim(),
        subject_name: subjectName,
      });
      setResult('تم حفظ التكليف بنجاح ✅');
      setTeacherId('');
      setClassName('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل حفظ التكليف');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
      )}
      {result && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{result}</div>
      )}

      <form onSubmit={submit} className="rounded-3xl border border-gold-500/10 bg-white/[0.02] p-5 md:p-6">
        <h3 className="mb-1 text-lg font-bold text-white">تكليف معلّم بفصل ومادة</h3>
        <p className="mb-4 text-xs text-slate-400">
          يُعطي المعلّم (موظف بدرجة teacher) صلاحية تسجيل الدرجات لهذا الفصل/المادة. متاح للمدير ومدير المدرسة والمدير الإداري.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-400">معرّف المعلّم</span>
            <input
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value.replace(/\D/g, ''))}
              dir="ltr"
              inputMode="numeric"
              placeholder="2"
              required
              className={`${inputCls} font-mono`}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-400">الصف</span>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(Number(e.target.value))}
              className={inputCls}
            >
              {Object.entries(GRADE_LABELS).map(([k, v]) => (
                <option key={k} value={k} className="bg-ink-900">{v}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-400">الفصل</span>
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              dir="rtl"
              placeholder="1/8"
              required
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-400">المادة</span>
            <select
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className={inputCls}
            >
              {SUBJECT_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-ink-900">{s}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="btn-gold rounded-xl px-7 py-3 text-sm font-bold disabled:opacity-50"
          >
            {submitting ? 'جارٍ الحفظ…' : 'حفظ التكليف ←'}
          </button>
        </div>
      </form>

      <div className="rounded-3xl border border-gold-500/10 bg-white/[0.02] p-5 md:p-6">
        <h3 className="mb-4 text-lg font-bold text-white">التكليفات الحالية ({assignments.length})</h3>
        {loading ? (
          <div className="flex min-h-[120px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-gold-500/15 border-t-gold-400" />
          </div>
        ) : assignments.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">لا توجد تكليفات مسجّلة بعد.</p>
        ) : (
          <div className="overflow-x-auto" dir="rtl">
            <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-right text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th className="px-3 pb-1 font-semibold">المعلّم</th>
                  <th className="px-3 pb-1 font-semibold">معرّف</th>
                  <th className="px-3 pb-1 font-semibold">الصف</th>
                  <th className="px-3 pb-1 font-semibold">الفصل</th>
                  <th className="px-3 pb-1 font-semibold">المادة</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a, i) => (
                  <tr
                    key={`${a.teacher_id}-${a.grade_level}-${a.class_name}-${a.subject_name}`}
                    className="rounded-xl bg-white/[0.02]"
                    style={{ animation: `tabRise 0.25s ease both`, animationDelay: `${i * 25}ms` }}
                  >
                    <td className="rounded-r-xl border-y border-r border-gold-500/10 px-3 py-2.5 text-slate-200">
                      {a.teacher_name || a.username || '—'}
                    </td>
                    <td className="border-y border-gold-500/10 px-3 py-2.5 font-mono text-xs text-slate-400" dir="ltr">
                      {a.teacher_id}
                    </td>
                    <td className="border-y border-gold-500/10 px-3 py-2.5 text-slate-300">
                      {GRADE_LABELS[a.grade_level] ?? a.grade_level}
                    </td>
                    <td className="border-y border-gold-500/10 px-3 py-2.5 text-slate-300">{a.class_name}</td>
                    <td className="rounded-l-xl border-y border-l border-gold-500/10 px-3 py-2.5 text-slate-300">{a.subject_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
