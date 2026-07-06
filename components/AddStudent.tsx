import React, { useState } from 'react';
import { addStudent, type AddStudentPayload } from '../apiService';
import { GRADE_LABELS } from '../schoolData';

interface Defaults {
  gov_code?: string;
  admin_zone?: string;
  school_name?: string;
}

interface Props {
  defaults?: Defaults;
  onSaved?: () => void;
}

const inputCls =
  'w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15';

export function AddStudent({ defaults, onSaved }: Props) {
  const [ssn, setSsn] = useState('');
  const [studentNameAr, setStudentNameAr] = useState('');
  const [gender, setGender] = useState('ذكر');
  const [govCode, setGovCode] = useState(defaults?.gov_code ?? '');
  const [adminZone, setAdminZone] = useState(defaults?.admin_zone ?? '');
  const [schoolName, setSchoolName] = useState(defaults?.school_name ?? '');
  const [gradeLevel, setGradeLevel] = useState(7);
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(null);
    if (!/^\d{14}$/.test(ssn)) {
      setError('رقم الطالب يجب أن يكون 14 رقمًا بالضبط.');
      return;
    }
    if (!studentNameAr.trim()) {
      setError('الاسم مطلوب.');
      return;
    }
    setLoading(true);
    try {
      const payload: AddStudentPayload = {
        ssn_encrypted: ssn,
        student_name_ar: studentNameAr.trim(),
        gender,
        gov_code: govCode.trim(),
        admin_zone: adminZone.trim(),
        school_name: schoolName.trim(),
        grade_level: gradeLevel,
        class_name: className.trim(),
      };
      const { affectedRows } = await addStudent(payload);
      setDone(affectedRows > 0 ? `تمت إضافة الطالب «${payload.student_name_ar}» بنجاح ✅` : 'لم يُحدّث أي صف (قد يكون الطالب مسجّلاً بالفعل).');
      setSsn('');
      setStudentNameAr('');
      setClassName('');
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر إضافة الطالب.');
    } finally {
      setLoading(false);
    }
  }

  const labelCls = 'mb-1.5 block text-xs font-semibold text-slate-400';

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={labelCls}>رقم الطالب (14 رقمًا)</span>
          <input
            value={ssn}
            onChange={(e) => setSsn(e.target.value.replace(/\D/g, '').slice(0, 14))}
            inputMode="numeric"
            dir="ltr"
            placeholder="00000000000000"
            required
            className={`${inputCls} text-center font-mono tracking-widest`}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelCls}>الاسم الكامل</span>
          <input
            value={studentNameAr}
            onChange={(e) => setStudentNameAr(e.target.value)}
            dir="rtl"
            placeholder="مثال: محمد أحمد إبراهيم"
            required
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>النوع</span>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputCls}>
            <option value="ذكر" className="bg-ink-900">ذكر</option>
            <option value="أنثى" className="bg-ink-900">أنثى</option>
          </select>
        </label>

        <label className="block">
          <span className={labelCls}>الفصل</span>
          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            dir="rtl"
            placeholder="مثال: 1/8"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>الصف</span>
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
          <span className={labelCls}>م محافظة (gov_code)</span>
          <input
            value={govCode}
            onChange={(e) => setGovCode(e.target.value.replace(/\D/g, '').slice(0, 2))}
            dir="ltr"
            placeholder="01"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>الإدارة التعليمية</span>
          <input
            value={adminZone}
            onChange={(e) => setAdminZone(e.target.value)}
            dir="rtl"
            placeholder="شمال القاهرة"
            className={inputCls}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelCls}>المدرسة</span>
          <input
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            dir="rtl"
            placeholder="مدرسة النيل التجريبية"
            className={inputCls}
          />
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
      )}
      {done && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{done}</div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-gold rounded-2xl px-8 py-3.5 text-sm font-bold disabled:opacity-50"
        >
          {loading ? 'جارٍ الإضافة…' : 'إضافة الطالب ←'}
        </button>
      </div>
    </form>
  );
}
