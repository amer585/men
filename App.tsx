import { useEffect, useState, type ReactNode } from 'react';
import { Hero } from './components/Hero';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StudentLogin } from './components/StudentLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { StaffLogin } from './components/StaffLogin';
import { StaffDashboard } from './components/StaffDashboard';
import type { StudentProfile, StaffUser } from './apiService';
import { clearStaffToken } from './config';

type View = 'landing' | 'student-login' | 'student' | 'staff-login' | 'staff';

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
  const [view, setView] = useState<View>('landing');
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [staff, setStaff] = useState<StaffUser | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  function onStudentLogin(profile: StudentProfile) {
    setStudent(profile);
    setView('student');
  }

  function onStaffLogin(user: StaffUser) {
    setStaff(user);
    setView('staff');
  }

  function logout() {
    setStudent(null);
    setStaff(null);
    clearStaffToken();
    setView('landing');
  }

  let body: ReactNode;
  if (view === 'landing') {
    body = (
      <Hero
        onStudent={() => setView('student-login')}
        onStaff={() => setView('staff-login')}
      />
    );
  } else if (view === 'student-login') {
    body = <StudentLogin onSuccess={onStudentLogin} onBack={() => setView('landing')} />;
  } else if (view === 'student' && student) {
    body = <StudentDashboard student={student} onLogout={logout} />;
  } else if (view === 'staff-login') {
    body = <StaffLogin onSuccess={onStaffLogin} onBack={() => setView('landing')} />;
  } else if (view === 'staff' && staff) {
    body = <StaffDashboard user={staff} onLogout={logout} />;
  } else {
    body = <Hero onStudent={() => setView('student-login')} onStaff={() => setView('staff-login')} />;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <AuroraBackground />
      <Header
        view={view}
        onHome={() => setView('landing')}
        onLogout={logout}
        identity={student?.student_name_ar || staff?.teacher_name_ar}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">{body}</main>
      <Footer />
    </div>
  );
}
