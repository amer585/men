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

// Deterministic particle positions (stable across renders, no hydration issues).
const PARTICLES = [
  { left: '8%', size: 3, delay: 0, dur: 18 },
  { left: '18%', size: 2, delay: 4, dur: 22 },
  { left: '26%', size: 4, delay: 2, dur: 16 },
  { left: '35%', size: 2, delay: 7, dur: 25 },
  { left: '44%', size: 3, delay: 1, dur: 19 },
  { left: '52%', size: 2, delay: 9, dur: 23 },
  { left: '61%', size: 4, delay: 3, dur: 17 },
  { left: '70%', size: 2, delay: 6, dur: 21 },
  { left: '78%', size: 3, delay: 8, dur: 26 },
  { left: '87%', size: 2, delay: 5, dur: 20 },
  { left: '93%', size: 3, delay: 10, dur: 24 },
  { left: '14%', size: 2, delay: 12, dur: 28 },
  { left: '48%', size: 2, delay: 14, dur: 15 },
  { left: '65%', size: 3, delay: 11, dur: 27 },
];

function Background() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #070c18 0%, #0a101e 45%, #080d18 100%)' }}
    >
      {/* Layer 1: Animated gradient mesh — slow-shifting warm gold tones */}
      <div
        className="animate-mesh absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 75% 0%, rgba(201,169,106,0.12), transparent 50%),
            radial-gradient(ellipse 60% 70% at 10% 30%, rgba(212,182,118,0.08), transparent 50%),
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(180,150,80,0.06), transparent 50%)
          `,
          backgroundSize: '200% 200%, 200% 200%, 200% 200%',
        }}
      />

      {/* Layer 2: Royal god-rays — rotating golden beams from top center */}
      <div
        className="animate-rays-breathe absolute left-1/2 top-[-60%]"
        style={{ width: '150vw', height: '150vw', transform: 'translateX(-50%)' }}
      >
        <div
          className="animate-rays absolute inset-0"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(212,182,118,0.06) 8deg, transparent 16deg, transparent 40deg, rgba(212,182,118,0.04) 48deg, transparent 56deg, transparent 80deg, rgba(212,182,118,0.05) 88deg, transparent 96deg, transparent 130deg, rgba(212,182,118,0.03) 138deg, transparent 146deg, transparent 180deg, rgba(212,182,118,0.06) 188deg, transparent 196deg, transparent 230deg, rgba(212,182,118,0.04) 238deg, transparent 246deg, transparent 280deg, rgba(212,182,118,0.05) 288deg, transparent 296deg, transparent 330deg, rgba(212,182,118,0.03) 338deg, transparent 346deg)',
            borderRadius: '50%',
            maskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 60%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Layer 3: Cinematic gold orbs — layered for depth */}
      <div
        className="animate-orb1 absolute rounded-full"
        style={{ width: '520px', height: '520px', right: '-100px', top: '-60px', background: 'radial-gradient(circle, rgba(231,205,150,0.5) 0%, rgba(201,169,106,0.2) 40%, transparent 70%)' }}
      />
      <div
        className="animate-orb2 absolute rounded-full"
        style={{ width: '460px', height: '460px', left: '-80px', top: '28%', background: 'radial-gradient(circle, rgba(227,200,145,0.4) 0%, rgba(201,169,106,0.15) 40%, transparent 70%)' }}
      />
      <div
        className="animate-orb3 absolute rounded-full"
        style={{ width: '500px', height: '500px', left: '38%', bottom: '-140px', background: 'radial-gradient(circle, rgba(212,182,118,0.35) 0%, rgba(180,150,80,0.1) 40%, transparent 70%)' }}
      />

      {/* Layer 4: Breathing center warmth */}
      <div
        className="animate-breathe absolute rounded-full"
        style={{ width: '700px', height: '700px', left: '50%', top: '42%', background: 'radial-gradient(circle, rgba(212,182,118,0.12) 0%, transparent 60%)' }}
      />

      {/* Layer 5: Floating gold particles — drifting upward like embers */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: 'rgba(231,205,150,0.9)',
            boxShadow: '0 0 6px rgba(212,182,118,0.8)',
            animation: `particleFloat ${p.dur}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Layer 6: Twinkling static stars for depth */}
      {STARS.map((s, i) => (
        <div
          key={`s${i}`}
          className="absolute rounded-full bg-gold-300"
          style={{
            left: s.left, top: s.top, width: '2px', height: '2px',
            animation: `twinkle ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Layer 7: Faint institutional grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,169,106,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,169,106,0.035)_1px,transparent_1px)] bg-[size:52px_52px]" />

      {/* Layer 8: Top edge glow */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gold-500/[0.06] to-transparent" />

      {/* Layer 9: Vignette for cinematic depth */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_120%_at_50%_40%,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
}

const STARS = [
  { left: '12%', top: '15%', dur: 4, delay: 0 },
  { left: '88%', top: '22%', dur: 5, delay: 2 },
  { left: '30%', top: '8%', dur: 3.5, delay: 1 },
  { left: '62%', top: '12%', dur: 4.5, delay: 3 },
  { left: '8%', top: '55%', dur: 6, delay: 1.5 },
  { left: '92%', top: '48%', dur: 5, delay: 0.5 },
  { left: '45%', top: '75%', dur: 4, delay: 2.5 },
  { left: '72%', top: '68%', dur: 5.5, delay: 4 },
];

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
