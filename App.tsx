import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { CheckCircle2, X } from 'lucide-react';

// ── BACKEND URL ──
// Gigalixir Express backend
const BACKEND_URL = 'https://madrastna-backend.gigalixirapp.com/api';

// --- CONSTANTS ---
export const SUBJECTS = [
  "اللغة العربية",
  "اللغة الإنجليزية",
  "الرياضيات",
  "العلوم",
  "الدراسات الاجتماعية",
  "التربية الدينية",
  "الحاسب الآلي",
  "التربية الفنية"
] as const;

export const GRADES = [
  "الاول الإعدادي",
  "الثاني الإعدادي",
  "الثالث الإعدادي"
] as const;

// --- TYPES ---
export interface Assessment {
  id: string;
  subject: string;
  title: string;
  score: number;
  maxScore: number;
  status: 'present' | 'absent' | 'excused' | 'late';
  note?: string;
  date?: string;
}

export interface MonthlyExam {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  status: 'present' | 'absent' | 'excused';
  note?: string;
  date?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  lessonName?: string;
  note?: string;
  lateTime?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  importance: 'normal' | 'high';
  targetGrade: string;
}

export interface StudentData {
  id: string;
  name: string;
  grade: string;
  class_name?: string;
  school_name?: string;
  admin_zone?: string;
  gov_code?: string;
  gender?: string;
  weeklyAssessments: Assessment[];
  monthlyExams: MonthlyExam[];
  attendanceRecords: AttendanceRecord[];
  announcements: Announcement[];
}

// --- MOCK DATA GENERATOR ---
const generateWeeklyForSubjects = (weeksCount: number): Assessment[] => {
  const assessments: Assessment[] = [];
  
  for (let w = 1; w <= weeksCount; w++) {
    SUBJECTS.forEach((subj, sIdx) => {
       assessments.push({
        id: `w-${w}-${sIdx}`,
        subject: subj,
        title: `أسبوع ${w}`,
        score: 8 + Math.floor(Math.random() * 3),
        maxScore: 10,
        status: Math.random() > 0.9 ? 'absent' : 'present',
        note: '',
        date: new Date(Date.now() - (10 - w) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
       });
    });
  }
  return assessments;
};

const INITIAL_STUDENTS: StudentData[] = [
  {
    id: "12345678901234",
    name: "أحمد محمد علي",
    grade: "الاول الإعدادي",
    weeklyAssessments: generateWeeklyForSubjects(8),
    monthlyExams: [
      { id: 'm1', subject: "اللغة العربية", score: 42, maxScore: 50, status: 'present', date: '2023-10-15' },
      { id: 'm2', subject: "اللغة الإنجليزية", score: 38, maxScore: 40, status: 'present', date: '2023-10-16' },
      { id: 'm3', subject: "الرياضيات", score: 55, maxScore: 60, status: 'present', date: '2023-10-17' },
      { id: 'm4', subject: "العلوم", score: 18, maxScore: 20, status: 'present', date: '2023-10-18' },
    ],
    attendanceRecords: [
      { id: 'a1', date: '2023-10-01', status: 'present', lessonName: 'Introduction' },
      { id: 'a2', date: '2023-10-02', status: 'absent', lessonName: 'Algebra Basics', note: 'مرضي' },
      { id: 'a3', date: '2023-10-03', status: 'late', lessonName: 'Geometry', lateTime: '08:15' },
    ],
    announcements: [
      { id: 'an1', title: 'موعد رحلة المدرسة', content: 'سيتم تنظيم رحلة إلى المتحف المصري يوم الخميس القادم. يرجى إحضار الموافقة.', date: '2023-10-20', author: 'أ. محمد', importance: 'normal', targetGrade: 'الكل' },
      { id: 'an2', title: 'تنبيه هام', content: 'يرجى الالتزام بالزي المدرسي الكامل.', date: '2023-10-18', author: 'إدارة المدرسة', importance: 'high', targetGrade: 'الاول الإعدادي' }
    ]
  }
];

// Toast Component
const Toast = ({ message, onClose, type = 'success' }: { message: string; onClose: () => void, type?: 'success' | 'info' | 'error' }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none">
    <div className={`
      backdrop-blur-md px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border pointer-events-auto
      ${type === 'success' ? 'bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 border-slate-700 dark:border-slate-200' : ''}
      ${type === 'info' ? 'bg-blue-600/90 text-white border-blue-500' : ''}
    `}>
      <div className={`rounded-full p-1 ${type === 'success' ? 'bg-green-500' : 'bg-white/20'}`}>
        {type === 'success' ? <CheckCircle2 className="w-3 h-3 text-white" /> : null}
      </div>
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 ml-2 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// --- BACKGROUND COMPONENT ---
const DynamicBackground = React.memo(({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none transition-colors duration-700 bg-slate-50 dark:bg-slate-950">
    <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] transition-opacity duration-700 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}></div>
    <div className={`absolute inset-0 transition-opacity duration-700 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute w-1 h-1 bg-white rounded-full top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full top-3/4 right-1/3 animate-pulse" style={{animationDelay: '1s'}}></div>
    </div>
    <div className={`absolute top-0 -left-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob transition-colors duration-700 will-change-transform transform-gpu ${isDarkMode ? 'bg-purple-900/40' : 'bg-purple-300'}`}></div>
    <div className={`absolute top-0 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 transition-colors duration-700 will-change-transform transform-gpu ${isDarkMode ? 'bg-indigo-900/40' : 'bg-cyan-300'}`}></div>
    <div className={`absolute -bottom-32 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 transition-colors duration-700 will-change-transform transform-gpu ${isDarkMode ? 'bg-blue-900/40' : 'bg-pink-300'}`}></div>
  </div>
));

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    }
    return false;
  });

  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [students, setStudents] = useState<StudentData[]>(() => {
    const saved = localStorage.getItem('madrasatuna_data');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('madrasatuna_data', JSON.stringify(students));
  }, [students]);

  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type?: 'success' | 'info' | 'error'} | null>(null);

  const triggerToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleUpdateStudent = useCallback((id: string, data: Partial<StudentData>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  }, []);

  const handleStartJourney = () => {
    setCurrentView('login');
  };

  const handleStudentLoginSuccess = (backendStudent: {
    ssn_encrypted: string;
    grade_level: number;
    student_name_ar: string;
    school_name: string;
    class_name: string;
    admin_zone: string;
    gov_code: string;
    gender: string;
  }) => {
    const id = backendStudent.ssn_encrypted;
    const exists = students.find(s => s.id === id);

    if (exists) {
      handleUpdateStudent(id, {
        name: backendStudent.student_name_ar || exists.name,
        grade: `مرحلة ${backendStudent.grade_level}`,
        class_name: backendStudent.class_name,
        school_name: backendStudent.school_name,
        admin_zone: backendStudent.admin_zone,
        gov_code: backendStudent.gov_code,
        gender: backendStudent.gender,
      });
      setCurrentStudentId(id);
      triggerToast(`مرحباً بك، ${backendStudent.student_name_ar}!`, 'info');
    } else {
      const newStudent: StudentData = {
        id: id,
        name: backendStudent.student_name_ar || 'طالب',
        grade: `مرحلة ${backendStudent.grade_level}`,
        class_name: backendStudent.class_name,
        school_name: backendStudent.school_name,
        admin_zone: backendStudent.admin_zone,
        gov_code: backendStudent.gov_code,
        gender: backendStudent.gender,
        weeklyAssessments: [],
        monthlyExams: [],
        attendanceRecords: [],
        announcements: []
      };
      setStudents(prev => [...prev, newStudent]);
      setCurrentStudentId(id);
      triggerToast(`مرحباً بك، ${backendStudent.student_name_ar}!`, 'info');
    }
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('landing');
    setCurrentStudentId(null);
  };

  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  return (
    <div className={`min-h-screen flex flex-col font-sans relative text-slate-900 dark:text-slate-100`}>
      
      <DynamicBackground isDarkMode={isDarkMode} />

      <Header 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        isLoggedIn={currentView === 'dashboard'} 
        onLogout={handleLogout} 
      />
      
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <main className="flex-grow flex flex-col relative isolate">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8 flex-grow flex flex-col">
          {currentView === 'landing' && <Hero onLogin={handleStartJourney} />}
          
          {currentView === 'login' && (
            <LoginPage 
              onLoginSuccess={handleStudentLoginSuccess} 
              onBack={() => setCurrentView('landing')}
              backendUrl={BACKEND_URL}
            />
          )}

          {currentView === 'dashboard' && (
            <StudentDashboard 
              student={currentStudent} 
              onLogout={handleLogout} 
            />
          )}
        </div>
      </main>


      <Footer />
    </div>
  );
}