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

function Background() {
  return (
    // FIXED + z-0 (NOT negative). Content wrapper uses z-10 so it's always
    // above. This is the bulletproof pattern — no body-bg-covering trap.
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080d1a 0%, #0a101e 50%, #070b15 100%)' }}
    >
      {/* Orb 1 — top right, bright core ON screen */}
      <div
        className="animate-orb1 absolute rounded-full"
        style={{
          width: '500px', height: '500px', right: '-120px', top: '-80px',
          background: 'radial-gradient(circle, rgba(227,200,145,0.6) 0%, rgba(201,169,106,0.25) 40%, transparent 70%)',
        }}
      />
      {/* Orb 2 — mid left */}
      <div
        className="animate-orb2 absolute rounded-full"
        style={{
          width: '440px', height: '440px', left: '-100px', top: '30%',
          background: 'radial-gradient(circle, rgba(227,200,145,0.5) 0%, rgba(201,169,106,0.18) 40%, transparent 70%)',
        }}
      />
      {/* Orb 3 — bottom center */}
      <div
        className="animate-orb3 absolute rounded-full"
        style={{
          width: '480px', height: '480px', left: '40%', bottom: '-160px',
          background: 'radial-gradient(circle, rgba(212,182,118,0.45) 0%, rgba(201,169,106,0.12) 40%, transparent 70%)',
        }}
      />
      {/* Breathing center glow */}
      <div
        className="animate-breathe absolute rounded-full"
        style={{
          width: '600px', height: '600px', left: '50%', top: '45%', transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(212,182,118,0.18) 0%, transparent 65%)',
        }}
      />
      {/* Faint grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,169,106,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,169,106,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_35%,transparent_45%,rgba(0,0,0,0.5)_100%)]" />
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
    <>
      <Background />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header
          view={view}
          onHome={() => (student ? setView('student') : setView('landing'))}
          onLogout={logout}
          identity={student?.student_name_ar}
        />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">{body}</main>
        <Footer />
      </div>
    </>
  );
}
