import React, { useState } from 'react';
import { adminRegister, type RegisterStaffPayload } from '../apiService';
import { Logo } from './Logo';

interface Props {
  onBack: () => void;
  onGoLogin: () => void;
}

const ROLE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'admin', label: 'مدير عام (admin)' },
  { value: 'principal', label: 'مدير مدرسة (principal)' },
  { value: 'directorate', label: 'إدارة تعليمية' },
  { value: 'directorate_manager', label: 'مدير إدارة تعليمية' },
  { value: 'district', label: 'حي/منطقة' },
  { value: 'district_manager', label: 'مدير حي/منطقة' },
  { value: 'teacher', label: 'معلّم (teacher)' },
];

export function AdminRegister({ onBack, onGoLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [teacherNameAr, setTeacherNameAr] = useState('');
  const [govCode, setGovCode] = useState('');
  const [adminZone, setAdminZone] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
      return;
    }
    setLoading(true);
    try {
      const payload: RegisterStaffPayload = {
        username: username.trim(),
        password,
        role,
        teacher_name_ar: teacherNameAr.trim() || undefined,
        gov_code: govCode.trim() || undefined,
        admin_zone: adminZone.trim() || undefined,
        school_name: schoolName.trim() || undefined,
      };
      const { message, userId } = await adminRegister(payload);
      setDone(`${message} (المعرّف: ${userId})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر إنشاء الحساب.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg animate-rise">
      <button
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-gold-500/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]"
      >
        العودة للرئيسية
      </button>
      <div className="card-accent relative overflow-hidden rounded-[2rem] glass-strong p-8 md:p-10">
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-5 w-fit">
            <div
              className="animate-breathe absolute inset-0 -m-3 rounded-full blur-xl"
              style={{ background: 'radial-gradient(circle, rgba(201,169,106,0.3), transparent 70%)' }}
            />
            <Logo size={56} glow className="relative mx-auto rounded-2xl border border-gold-500/20 bg-ink-900/50 p-2.5" />
          </div>
          <h2 className="text-[clamp(1.75rem,4vw,2.25rem)] font-black tracking-tight text-white">إنشاء حساب الإدارة</h2>
          <p className="mt-2 text-sm text-slate-400">
            هذه بوابة التهيئة الأولى — استخدمها لإنشاء حساب الإدارة الأول فقط.
          </p>
        </div>

        {done ? (
          <div className="space-y-5 text-center">
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              ✅ {done}
            </div>
            <button
              onClick={onGoLogin}
              className="btn-gold w-full rounded-2xl py-4 text-base font-bold"
            >
              الانتقال لتسجيل الدخول ←
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block font-medium text-slate-300">اسم المستخدم *</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  dir="ltr"
                  placeholder="admin"
                  required
                  className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-medium text-slate-300">كلمة المرور *</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  dir="ltr"
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block font-medium text-slate-300">الدور الوظيفي *</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value} className="bg-ink-900">
                    {r.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block font-medium text-slate-300">الاسم المعروض (اختياري)</span>
              <input
                value={teacherNameAr}
                onChange={(e) => setTeacherNameAr(e.target.value)}
                dir="rtl"
                placeholder="مثال: أ. سارة محمد"
                className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
              />
            </label>

            <p className="pt-1 text-xs text-slate-500">
              الحقول التالية اختيارية عند أول تهيئة — تُترك «ALL» فارغة إذا لم تكن مناسبة (يمكن إضافتها لاحقًا).
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block font-medium text-slate-300">المحافظة (gov_code)</span>
                <input
                  value={govCode}
                  onChange={(e) => setGovCode(e.target.value)}
                  dir="ltr"
                  placeholder="01"
                  className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-medium text-slate-300">الإدارة التعليمية</span>
                <input
                  value={adminZone}
                  onChange={(e) => setAdminZone(e.target.value)}
                  dir="rtl"
                  placeholder="شمال القاهرة"
                  className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block font-medium text-slate-300">المدرسة</span>
              <input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                dir="rtl"
                placeholder="مدرسة النيل التجريبية (أو «ALL»)"
                className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full rounded-2xl py-4 text-base font-bold disabled:opacity-50"
            >
              {loading ? 'جارٍ الإنشاء…' : 'إنشاء الحساب ←'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

