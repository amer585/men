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
      {/* Subtle, formal gold radial glow — no neon */}
      <div className="absolute inset-0 bg-[radial-gradient(55rem_55rem_at_88%_-8%,rgba(201,169,106,0.10),transparent),radial-gradient(45rem_45rem_at_-8%_8%,rgba(201,169,106,0.05),transparent)]" />
      {/* Faint institutional grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,169,106,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,169,106,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
      {/* Vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_60%,rgba(0,0,0,0.5)_100%)]" />
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
