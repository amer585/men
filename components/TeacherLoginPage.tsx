import React, { useState } from 'react';
import { CreditCard, ArrowRight, Loader2, GraduationCap, BookOpen, ArrowLeft } from 'lucide-react';
import { SUBJECTS } from '../App';

interface TeacherLoginPageProps {
  onLoginSuccess: (subject: string) => void;
  onBackToStudent: () => void;
}

export const TeacherLoginPage: React.FC<TeacherLoginPageProps> = ({ onLoginSuccess, onBackToStudent }) => {
  const [ssn, setSsn] = useState('');
  // Explicitly type as string to avoid literal type inference issues
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ssn.length >= 14) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(subject);
      }, 1500);
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-12 animate-in fade-in duration-500">
      <div className="w-full max-w-lg bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-12 relative overflow-hidden backdrop-blur-sm transition-colors duration-300">
        
        {/* Decorative top accent - Purple for teachers to distinguish */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-indigo-500"></div>

        <div className="text-center mb-10 mt-4">
          <div className="inline-flex items-center justify-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">دخول المعلمين</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">أدخل الرقم القومي واختر المادة التي تدرسها</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SSN Field — single identifier for all users */}
          <div className="space-y-2">
            <label htmlFor="teacher-ssn" className="sr-only">الرقم القومي</label>
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-purple-500 transition-colors" />
              </div>
              <input
                id="teacher-ssn"
                type="text"
                value={ssn}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 14);
                  setSsn(val);
                }}
                placeholder="الرقم القومي (14 رقم)"
                className="block w-full pr-12 pl-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg font-medium tracking-wide"
                dir="rtl"
                maxLength={14}
                required
              />
            </div>
          </div>

          {/* Subject Selector */}
          <div className="space-y-2">
             <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">المادة التي تدرسها</label>
             <div className="relative group">
                 <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                 </div>
                 <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="block w-full pr-12 pl-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg font-medium appearance-none cursor-pointer"
                 >
                     {SUBJECTS.map(s => (
                         <option key={s} value={s}>{s}</option>
                     ))}
                 </select>
             </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || ssn.length < 14}
            className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] group mt-4"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <ArrowRight className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <button 
                type="button"
                onClick={onBackToStudent}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium transition-colors text-sm"
            >
                العودة لتسجيل دخول الطلاب
            </button>
        </div>

        <div className="mt-2 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            تأكد من كتابة الرقم القومي بشكل صحيح
          </p>
        </div>
      </div>
    </div>
  );
};