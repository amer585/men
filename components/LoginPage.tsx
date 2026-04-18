import React, { useState } from 'react';
import { CreditCard, ArrowRight, Loader2, ArrowLeft, GraduationCap, AlertCircle } from 'lucide-react';
// Grade level mapping: numeric → Arabic display name
const GRADE_OPTIONS = [
  { value: 1, label: 'الأول الابتدائي' },
  { value: 2, label: 'الثاني الابتدائي' },
  { value: 3, label: 'الثالث الابتدائي' },
  { value: 4, label: 'الرابع الابتدائي' },
  { value: 5, label: 'الخامس الابتدائي' },
  { value: 6, label: 'السادس الابتدائي' },
  { value: 7, label: 'الأول الإعدادي' },
  { value: 8, label: 'الثاني الإعدادي' },
  { value: 9, label: 'الثالث الإعدادي' },
  { value: 10, label: 'الأول الثانوي' },
  { value: 11, label: 'الثاني الثانوي' },
];

// Governorates removed

interface LoginPageProps {
  onLoginSuccess: (studentData: {
    ssn_encrypted: string;
    grade_level: number;
    student_name_ar: string;
    school_name: string;
    class_name: string;
    admin_zone: string;
    gov_code: string;
    gender: string;
  }) => void;
  onBack?: () => void;
  backendUrl: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack, backendUrl }) => {
      // States
      const [nationalId, setNationalId] = useState('');
      const [gradeLevel, setGradeLevel] = useState<number>(7);

      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      // Auto-retry fetch to handle backend cold starts (Gigalixir free tier sleep)
      const fetchWithRetry = async (url: string, options: RequestInit, retries = 3): Promise<Response> => {
        const delays = [3000, 5000, 8000];
        for (let i = 0; i < retries; i++) {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            const res = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeout);
            return res;
          } catch (err) {
            if (i < retries - 1) {
              await new Promise(r => setTimeout(r, delays[i]));
            } else {
              throw err;
            }
          }
        }
        throw new Error('All retries failed');
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate SSN
        if (!/^\d{14}$/.test(nationalId)) {
          setError('الرقم القومي يجب أن يكون 14 رقم بالضبط');
          return;
        }

        setIsLoading(true);

        try {
          // --- LOGIN FLOW ---
          const res = await fetchWithRetry(`${backendUrl}/studentLogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ssn_encrypted: nationalId,
              grade_level: gradeLevel,
            }),
          });

          const data = await res.json();

          if (res.ok && data.student) {
            localStorage.setItem(`student_${nationalId}`, JSON.stringify({ ...data.student, cached_at: Date.now() }));
            onLoginSuccess(data.student);
          } else if (res.status === 404) {
            setError('هذا الرقم غير مسجل في هذه المرحلة.');
          } else {
            setError(data.error || 'حدث خطأ في الاتصال');
          }
        } catch (err) {
          const cached = localStorage.getItem(`student_${nationalId}`);
          if (cached) {
            const parsedCache = JSON.parse(cached);
            if (Date.now() - parsedCache.cached_at < 86400000) {
              onLoginSuccess(parsedCache);
              return;
            }
          }
          setError('فشل في الاتصال بالخادم. تأكد من اتصالك بالإنترنت.');
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className="w-full flex justify-center items-center py-12 animate-in fade-in zoom-in duration-300 relative">
          <div className="w-full max-w-lg bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-12 relative overflow-hidden backdrop-blur-sm transition-all duration-500">

            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

            {onBack && (
              <button
                onClick={onBack}
                className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
              </button>
            )}

            <div className="text-center mb-8 mt-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
                تسجيل الدخول
              </h2>
              <p className="text-slate-500 text-sm">
                أدخل الرقم القومي والمرحلة الدراسية للدخول
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm font-bold text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid gap-6 grid-cols-1">

                {/* National ID AND Grade (Always required) */}
                <div className="space-y-2 col-span-1">
                  <label className="block text-sm font-bold text-slate-500 mb-1">الرقم القومي (14 رقم)</label>
                  <div className="relative">
                    <CreditCard className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={nationalId}
                      onChange={(e) => {
                        setNationalId(e.target.value.replace(/\D/g, '').slice(0, 14));
                        setError(null);
                      }}
                      className="block w-full pr-12 pl-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-medium tracking-widest text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      dir="ltr"
                      maxLength={14}
                    />
                    <span className={`absolute left-4 top-4 text-xs font-bold ${nationalId.length === 14 ? 'text-green-500' : 'text-slate-300'}`}>
                      {nationalId.length}/14
                    </span>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-500 mb-1">المرحلة الدراسية</label>
                  <div className="relative">
                    <GraduationCap className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(Number(e.target.value))}
                      className="block w-full pr-12 pl-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                    >
                      <optgroup label="المرحلة الابتدائية">{GRADE_OPTIONS.filter(g => g.value <= 6).map(g => <option key={g.value} value={g.value}>{g.label}</option>)}</optgroup>
                      <optgroup label="المرحلة الإعدادية">{GRADE_OPTIONS.filter(g => g.value >= 7 && g.value <= 9).map(g => <option key={g.value} value={g.value}>{g.label}</option>)}</optgroup>
                      <optgroup label="المرحلة الثانوية">{GRADE_OPTIONS.filter(g => g.value >= 10).map(g => <option key={g.value} value={g.value}>{g.label}</option>)}</optgroup>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || nationalId.length < 14}
                className="w-full flex items-center justify-center py-4 px-6 rounded-xl shadow-lg text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 group"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    <span>تسجيل الدخول</span>
                    <ArrowRight className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      );
    };
