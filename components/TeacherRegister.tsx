import React, { useState } from 'react';
import { teacherRegister } from '../apiService';
import { Logo } from './Logo';

interface Props {
  onBack: () => void;
  onGoLogin: () => void;
}

const SUBJECTS = [
  'اللغة العربية',
  'اللغة الإنجليزية',
  'الرياضيات',
  'العلوم',
  'الدراسات الاجتماعية',
  'التربية الدينية',
  'الحاسب الآلي',
];

export function TeacherRegister({ onBack, onGoLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
      return;
    }
    setLoading(true);
    try {
      await teacherRegister({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        subject: subject || undefined,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر إنشاء الحساب.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md animate-rise">
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
          <h2 className="text-[clamp(1.75rem,4vw,2.25rem)] font-black tracking-tight text-white">تسجيل معلّم جديد</h2>
          <p className="mt-2 text-sm text-slate-400">سيتم مراجعة طلبك من الإدارة قبل التفعيل</p>
        </div>

        {done ? (
          <div className="space-y-5 text-center">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-6">
              <div className="mb-2 text-3xl">✅</div>
              <p className="text-sm font-semibold text-emerald-200">
                تم استلام طلب التسجيل بنجاح. حسابك الآن قيد المراجعة من قِبل الإدارة.
              </p>
              <p className="mt-2 text-xs text-emerald-300/70">ستتمكن من تسجيل الدخول بعد تفعيل حسابك.</p>
            </div>
            <button onClick={onGoLogin} className="btn-gold w-full rounded-2xl py-3.5 text-base font-bold">
              الذهاب لتسجيل الدخول
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">الاسم الكامل</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                dir="rtl"
                placeholder="الاسم"
                className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">البريد الإلكتروني</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                dir="ltr"
                placeholder="teacher@example.com"
                className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-300">رقم الهاتف</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                  inputMode="tel"
                  dir="ltr"
                  placeholder="01000000000"
                  className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-300">المادة</span>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-white focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                >
                  <option value="" className="bg-ink-900">— اختر —</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s} className="bg-ink-900">{s}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">كلمة المرور (8 أحرف على الأقل)</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                dir="ltr"
                placeholder="••••••••"
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
              {loading ? 'جارٍ الإرسال…' : 'إنشاء الحساب ←'}
            </button>

            <p className="text-center text-sm text-slate-400">
              لديك حساب بالفعل؟{' '}
              <button type="button" onClick={onGoLogin} className="font-semibold text-gold-400 hover:text-gold-300">
                تسجيل الدخول
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
