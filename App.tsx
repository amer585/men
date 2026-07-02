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
      {/* Base navy */}
      <div className="absolute inset-0 bg-ink-950" />

      {/* Layer 1: animated floating golden orbs (the living glow) */}
      <div
        className="animate-orb1 absolute right-[-8rem] top-[-10rem] h-[42rem] w-[42rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(201,169,106,0.22), rgba(201,169,106,0.08) 40%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <div
        className="animate-orb2 absolute left-[-12rem] top-[20%] h-[38rem] w-[38rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(201,169,106,0.15), rgba(201,169,106,0.05) 40%, transparent 70%)', filter: 'blur(50px)' }}
      />
      <div
        className="animate-orb3 absolute bottom-[-15rem] left-[25%] h-[44rem] w-[44rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(201,169,106,0.12), rgba(201,169,106,0.04) 40%, transparent 70%)', filter: 'blur(60px)' }}
      />

      {/* Layer 2: central breathing warmth */}
      <div
        className="animate-breathe absolute left-1/2 top-1/3 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(201,169,106,0.06), transparent 60%)' }}
      />

      {/* Layer 3: static ambient glows for richness */}
      <div className="absolute inset-0 bg-[radial-gradient(60rem_60rem_at_50%_-10%,rgba(201,169,106,0.06),transparent_50%)]" />

      {/* Layer 4: subtle institutional grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,169,106,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,169,106,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Layer 5: diagonal luxury sheen */}
      <div className="absolute inset-0 opacity-[0.02] bg-[repeating-linear-gradient(135deg,transparent,transparent_120px,rgba(201,169,106,1)_120px,rgba(201,169,106,1)_121px)]" />

      {/* Layer 6: vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_130%_at_50%_0%,transparent_50%,rgba(0,0,0,0.55)_100%)]" />
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
