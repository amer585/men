import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { API_BASE_URL } from './config';
import {
  buildStudentData,
  getGradeLabel,
  INITIAL_STUDENTS,
  normalizeStudentData,
  PREP_GRADE_LABELS,
  SHOWCASE_SUBJECTS,
} from './schoolData';

export const SUBJECTS = SHOWCASE_SUBJECTS;
export const GRADES = PREP_GRADE_LABELS;

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
  title?: string;
  score: number;
  maxScore: number;
  status: 'present' | 'absent' | 'excused';
  note?: string;
  date?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  dayName?: string;
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

export interface SchedulePeriod {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface ScheduleDay {
  day: string;
  breakTime: string;
  periods: SchedulePeriod[];
}

export interface StudentData {
  id: string;
  name: string;
  grade: string;
  gradeLevel?: number;
  class_name?: string;
  school_name?: string;
  admin_zone?: string;
  gov_code?: string;
  gender?: string;
  weeklyAssessments: Assessment[];
  monthlyExams: MonthlyExam[];
  attendanceRecords: AttendanceRecord[];
  announcements: Announcement[];
  schedule: ScheduleDay[];
  dataVersion?: number;
}

const Toast = ({
  message,
  onClose,
  type = 'success',
}: {
  message: string;
  onClose: () => void;
  type?: 'success' | 'info' | 'error';
}) => (
  <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none">
    <div
      className={`
        flex items-center gap-3 rounded-full border px-6 py-3 shadow-2xl backdrop-blur-md pointer-events-auto
        ${type === 'success' ? 'bg-slate-900/90 text-white border-slate-700 dark:bg-white/90 dark:text-slate-900 dark:border-slate-200' : ''}
        ${type === 'info' ? 'bg-blue-600/90 text-white border-blue-500' : ''}
        ${type === 'error' ? 'bg-rose-600/90 text-white border-rose-500' : ''}
      `}
    >
      <div className={`rounded-full p-1 ${type === 'success' ? 'bg-green-500' : 'bg-white/20'}`}>
        {type === 'success' ? <CheckCircle2 className="h-3 w-3 text-white" /> : null}
      </div>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 transition-opacity hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  </div>
);

const DynamicBackground = React.memo(({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className="fixed inset-0 -z-50 overflow-hidden bg-slate-50 pointer-events-none transition-colors duration-700 dark:bg-slate-950">
    <div
      className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] transition-opacity duration-700 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}
    />
    <div className={`absolute inset-0 transition-opacity duration-700 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute top-1/4 left-1/4 h-1 w-1 animate-pulse rounded-full bg-white" />
      <div
        className="absolute right-1/3 top-3/4 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400"
        style={{ animationDelay: '1s' }}
      />
    </div>
    <div
      className={`absolute top-0 -left-4 h-96 w-96 animate-blob rounded-full opacity-30 mix-blend-multiply blur-3xl transition-colors duration-700 will-change-transform transform-gpu ${isDarkMode ? 'bg-purple-900/40' : 'bg-purple-300'}`}
    />
    <div
      className={`animation-delay-2000 absolute top-0 -right-4 h-96 w-96 animate-blob rounded-full opacity-30 mix-blend-multiply blur-3xl transition-colors duration-700 will-change-transform transform-gpu ${isDarkMode ? 'bg-indigo-900/40' : 'bg-cyan-300'}`}
    />
    <div
      className={`animation-delay-4000 absolute -bottom-32 left-20 h-96 w-96 animate-blob rounded-full opacity-30 mix-blend-multiply blur-3xl transition-colors duration-700 will-change-transform transform-gpu ${isDarkMode ? 'bg-blue-900/40' : 'bg-pink-300'}`}
    />
  </div>
));

const loadStoredStudents = () => {
  if (typeof window === 'undefined') {
    return INITIAL_STUDENTS;
  }

  const saved = localStorage.getItem('madrasatuna_data');

  if (!saved) {
    return INITIAL_STUDENTS;
  }

  try {
    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return INITIAL_STUDENTS;
    }

    return parsed.map((student) => normalizeStudentData(student as StudentData));
  } catch {
    return INITIAL_STUDENTS;
  }
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }

    return false;
  });

  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [students, setStudents] = useState<StudentData[]>(loadStoredStudents);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type?: 'success' | 'info' | 'error' } | null>(null);

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

  const triggerToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
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

    setStudents((previousStudents) => {
      const existingStudent = previousStudents.find((student) => student.id === id);
      const hydratedStudent = buildStudentData({
        ...(existingStudent || {}),
        id,
        name: backendStudent.student_name_ar || existingStudent?.name,
        grade: getGradeLabel(backendStudent.grade_level, existingStudent?.grade),
        gradeLevel: backendStudent.grade_level,
        class_name: backendStudent.class_name || existingStudent?.class_name,
        school_name: backendStudent.school_name || existingStudent?.school_name,
        admin_zone: backendStudent.admin_zone || existingStudent?.admin_zone,
        gov_code: backendStudent.gov_code || existingStudent?.gov_code,
        gender: backendStudent.gender || existingStudent?.gender,
      });

      if (existingStudent) {
        return previousStudents.map((student) => (student.id === id ? hydratedStudent : student));
      }

      return [...previousStudents, hydratedStudent];
    });

    setCurrentStudentId(id);
    setCurrentView('dashboard');
    triggerToast(`مرحباً بك، ${backendStudent.student_name_ar || 'عزيزي الطالب'}!`, 'info');
  };

  const handleLogout = () => {
    setCurrentView('landing');
    setCurrentStudentId(null);
  };

  const currentStudent = students.find((student) => student.id === currentStudentId) || students[0];

  return (
    <div className="relative flex min-h-screen flex-col font-sans text-slate-900 dark:text-slate-100">
      <DynamicBackground isDarkMode={isDarkMode} />

      <Header
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode((previousValue) => !previousValue)}
        isLoggedIn={currentView === 'dashboard'}
        onLogout={handleLogout}
      />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <main className="relative isolate flex flex-grow flex-col">
        <div className="mx-auto flex w-full max-w-[1400px] flex-grow flex-col px-4 py-6 md:px-6 md:py-8">
          {currentView === 'landing' && <Hero onLogin={() => setCurrentView('login')} />}

          {currentView === 'login' && (
            <LoginPage
              onLoginSuccess={handleStudentLoginSuccess}
              onBack={() => setCurrentView('landing')}
              backendUrl={API_BASE_URL}
            />
          )}

          {currentView === 'dashboard' && currentStudent && (
            <StudentDashboard student={currentStudent} onLogout={handleLogout} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
