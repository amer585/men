import React, { useState } from 'react';
import { CreditCard, ArrowRight, Loader2, UserCog, ArrowLeft, GraduationCap, AlertCircle } from 'lucide-react';

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
  onTeacherLoginClick: () => void;
  onBack?: () => void;
  backendUrl: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onTeacherLoginClick, onBack, backendUrl }) => {
  const [nationalId, setNationalId] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(7); // Default: prep
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate: exactly 14 digits
    if (!/^\d{14}$/.test(nationalId)) {
      setError('الرقم القومي يجب أن يكون 14 رقم بالضبط');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}/studentLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ssn_encrypted: nationalId,
          grade_level: gradeLevel,
        }),
      });

      const data = await res.json();

      if (res.ok && data.student) {
        // ── Cache in browser localStorage for RU savings ──
        const cacheKey = `student_${nationalId}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          ...data.student,
          cached_at: Date.now(),
        }));

        onLoginSuccess(data.student);
      } else if (res.status === 404) {
        setError('لم يتم العثور على هذا الرقم القومي في هذه المرحلة الدراسية');
      } else {
        setError(data.error || 'حدث خطأ في الاتصال بالخادم');
      }
    } catch (err) {
      // ── Offline fallback: check localStorage cache ──
      const cacheKey = `student_${nationalId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        // Use cache if less than 24 hours old
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
      <div className="w-full max-w-lg bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-12 relative overflow-hidden backdrop-blur-sm transition-colors duration-300">
        
        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

        {/* Back Button */}
        {onBack && (
            <button 
                onClick={onBack}
                className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                title="العودة"
            >
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
        )}

        <div className="text-center mb-10 mt-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">تسجيل الدخول</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">أدخل الرقم القومي والمرحلة الدراسية</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm font-bold text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* National ID Input — numeric only */}
          <div className="space-y-2">
            <label htmlFor="nationalId" className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">الرقم القومي</label>
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="nationalId"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={nationalId}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 14);
                  setNationalId(val);
                  setError(null);
                }}
                placeholder="أدخل 14 رقم"
                className="block w-full pr-12 pl-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg font-medium tracking-widest text-center"
                dir="ltr"
                maxLength={14}
                autoComplete="off"
              />
              {/* Character count indicator */}
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className={`text-xs font-bold ${nationalId.length === 14 ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'}`}>
                  {nationalId.length}/14
                </span>
              </div>
            </div>
          </div>

          {/* Grade Level Dropdown */}
          <div className="space-y-2">
            <label htmlFor="gradeLevel" className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">المرحلة الدراسية</label>
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <select
                id="gradeLevel"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(Number(e.target.value))}
                className="block w-full pr-12 pl-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg font-medium appearance-none cursor-pointer"
              >
                <optgroup label="المرحلة الابتدائية">
                  {GRADE_OPTIONS.filter(g => g.value <= 6).map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </optgroup>
                <optgroup label="المرحلة الإعدادية">
                  {GRADE_OPTIONS.filter(g => g.value >= 7 && g.value <= 9).map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </optgroup>
                <optgroup label="المرحلة الثانوية">
                  {GRADE_OPTIONS.filter(g => g.value >= 10).map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || nationalId.length < 14}
            className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] group"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>ابدأ رحلتك</span>
                <ArrowRight className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Teacher Login Section */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <button 
                type="button"
                onClick={onTeacherLoginClick}
                className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors group p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800"
            >
                <UserCog className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                <span>تسجيل دخول المعلمين</span>
            </button>
        </div>

        <div className="mt-2 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            تأكد من كتابة الرقم بشكل صحيح من شهادة الميلاد
          </p>
        </div>
      </div>
    </div>
  );
};