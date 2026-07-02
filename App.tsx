import { useEffect, useState, type ReactNode } from 'react';
import { Hero } from './components/Hero';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StudentLogin } from './components/StudentLogin';
import { StudentDashboard } from './components/StudentDashboard';
import type { StudentProfile } from './apiService';

type View = 'landing' | 'student-login' | 'student';

const STORAGE_KEY = 'intlaqa_student';

/** Load a saved student session so a page reload never kicks the user out. */
function loadSavedStudent(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.ssn_encrypted && parsed.grade_level) return parsed;
    return null;
  } catch {
    return null;
  }
}

function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ink-950" />
      <div className="absolute inset-0 bg-[radial-gradient(60rem_60rem_at_85%_-10%,rgba(16,185,129,0.16),transparent),radial-gradient(50rem_50rem_at_-10%_10%,rgba(56,189,248,0.12),transparent)]" />
      <div className="animate-blob absolute -top-32 right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-brand-500/20 blur-3xl" />
      <div className="animate-blob delay-2000 absolute top-1/3 left-[-8rem] h-[26rem] w-[26rem] rounded-full bg-sky-500/15 blur-3xl" />
      <div className="animate-blob delay-4000 absolute bottom-[-10rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
    </div>
  );
}

export default function App() {
  // Start from localStorage so reload keeps the user in the dashboard.
  const [student, setStudent] = useState<StudentProfile | null>(loadSavedStudent);
  const [view, setView] = useState<View>(loadSavedStudent() ? 'student' : 'landing');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  function onStudentLogin(profile: StudentProfile) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
    setStudent(profile);
    setView('student');
  }

  function logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setStudent(null);
    setView('landing');
  }

  let body: ReactNode;
  if (view === 'student-login') {
    body = <StudentLogin onSuccess={onStudentLogin} onBack={() => setView('landing')} />;
  } else if (view === 'student' && student) {
    body = <StudentDashboard student={student} onLogout={logout} />;
  } else {
    body = <Hero onStudent={() => setView('student-login')} />;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <AuroraBackground />
      <Header
        view={view}
        onHome={() => (student ? setView('student') : setView('landing'))}
        onLogout={logout}
        identity={student?.student_name_ar}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">{body}</main>
      <Footer />
    </div>
  );
}
