import React from 'react';
import { GraduationCap, Moon, Sun, LogOut } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, isLoggedIn, onLogout }) => {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      
      {/* Right Side: Logo (In RTL, this appears on the Right) */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">بوابة المدرسة</span>
      </div>

      {/* Left Side: Controls (In RTL, this appears on the Left) */}
      <div className="flex items-center gap-4">
        {isLoggedIn && (
           <button 
             onClick={onLogout}
             className="text-sm font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-2"
           >
             <LogOut className="w-4 h-4" />
             <span className="hidden sm:inline">تسجيل خروج</span>
           </button>
        )}
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 active:scale-95"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};