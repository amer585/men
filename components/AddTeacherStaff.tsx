import React, { useState } from 'react';
import { addTeacherStaff, type AddTeacherPayload } from '../apiService';

const inputCls =
  'w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15';

export function AddTeacherStaff() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [teacherNameAr, setTeacherNameAr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
      return;
    }
    setLoading(true);
    try {
      const payload: AddTeacherPayload = {
        username: username.trim(),
        password,
        teacher_name_ar: teacherNameAr.trim() || undefined,
      };
      const { teacherId } = await addTeacherStaff(payload);
      setResult(`تمت إضافة المعلّم بنجاح ✅ (المعرّف: ${teacherId})`);
      setUsername('');
      setPassword('');
      setTeacherNameAr('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل إضافة المعلّم.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-gold-500/10 bg-white/[0.02] p-5 md:p-6">
      <h3 className="mb-1 text-lg font-bold text-white">إضافة معلّم جديد (موظف)</h3>
      <p className="mb-4 text-xs text-slate-400">
        متاح لمدير المدرسة فقط. يُنشأ المعلّم ضمن نفس مدرستك تلقائيًا (لا يمكن تجاوز نطاق المدرسة).
      </p>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-400">اسم المستخدم *</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              dir="ltr"
              placeholder="teacher_sara"
              required
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-400">كلمة المرور *</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              dir="ltr"
              placeholder="8 أحرف على الأقل"
              required
              className={inputCls}
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">الاسم المعروض (اختياري)</span>
          <input
            value={teacherNameAr}
            onChange={(e) => setTeacherNameAr(e.target.value)}
            dir="rtl"
            placeholder="أستاذة سارة محمد"
            className={inputCls}
          />
        </label>

        {error && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
        )}
        {result && (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{result}</div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-gold rounded-2xl px-8 py-3.5 text-sm font-bold disabled:opacity-50"
          >
            {loading ? 'جارٍ الإضافة…' : 'إضافة المعلّم ←'}
          </button>
        </div>
      </form>
    </div>
  );
}
