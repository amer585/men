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
      {/* Base — slightly warmer navy so gold pops */}
      <div className="absolute inset-0 bg-ink-950" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#080c18,#0a0f1c_50%,#070b15)]" />

      {/* ROYAL GOLD ORBS — bright, visible, fast-moving */}
      <div
        className="animate-orb1 absolute right-[-8rem] top-[-8rem] h-[45rem] w-[45rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(212,182,118,0.55), rgba(201,169,106,0.22) 35%, transparent 70%)' }}
      />
      <div
        className="animate-orb2 absolute left-[-10rem] top-[10%] h-[40rem] w-[40rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(227,200,145,0.45), rgba(201,169,106,0.15) 40%, transparent 70%)' }}
      />
      <div
        className="animate-orb3 absolute bottom-[-12rem] left-[28%] h-[42rem] w-[42rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(201,169,106,0.4), rgba(180,150,80,0.1) 40%, transparent 70%)' }}
      />

      {/* ROYAL LIGHT RAYS — golden beams from top center */}
      <div
        className="absolute left-1/2 top-[-20%] h-[80vh] w-[60vw] -translate-x-1/2"
        style={{
          background: 'conic-gradient(from 270deg at 50% 0%, transparent 35deg, rgba(212,182,118,0.12) 45deg, rgba(212,182,118,0.04) 55deg, transparent 65deg, transparent 85deg, rgba(212,182,118,0.08) 95deg, transparent 105deg)',
          animation: 'breathe 12s ease-in-out infinite',
        }}
      />

      {/* Central breathing warmth */}
      <div
        className="animate-breathe absolute left-1/2 top-[40%] h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(212,182,118,0.12), transparent 65%)' }}
      />

      {/* Faint institutional grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,169,106,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,169,106,0.04)_1px,transparent_1px)] bg-[size:52px_52px]" />

      {/* Diagonal luxury sheen */}
      <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(135deg,transparent,transparent_140px,rgba(212,182,118,1)_140px,rgba(212,182,118,1)_141px)]" />

      {/* Top gold edge glow */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gold-500/[0.08] to-transparent" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_130%_at_50%_30%,transparent_45%,rgba(0,0,0,0.5)_100%)]" />
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
