import { useEffect, useState } from 'react';
import { getStudentPortal, type StudentProfile, type PortalData } from '../apiService';
import { gradeLabel } from '../schoolData';
import { Logo } from './Logo';
import { TabOverview } from './tabs/TabOverview';
import { TabGrades } from './tabs/TabGrades';
import { TabAttendance } from './tabs/TabAttendance';
import { TabSchedule } from './tabs/TabSchedule';
import { TabAnnouncements } from './tabs/TabAnnouncements';

interface Props {
  student: StudentProfile;
  onLogout: () => void;
}

type TabId = 'overview' | 'grades' | 'attendance' | 'schedule' | 'announcements';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'grades', label: 'الدرجات' },
  { id: 'attendance', label: 'الحضور' },
  { id: 'schedule', label: 'الجدول' },
  { id: 'announcements', label: 'الإعلانات' },
];

export function StudentDashboard({ student, onLogout }: Props) {
  const [tab, setTab] = useState<TabId>('overview');
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    // FIXED: loading stays true through ALL retries. Only set false at the end.
    (async () => {
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const d = await getStudentPortal(student.ssn_encrypted, student.grade_level);
          if (!cancelled) setData(d);
          return; // success — done
        } catch (e) {
          if (attempt === 3) {
            // Last attempt failed — show error
            if (!cancelled) setError(e instanceof Error ? e.message : 'فشل تحميل البيانات');
            return;
          }
          // Wait before retry (NOT setting loading=false!)
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
        }
      }
    })().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [student.ssn_encrypted, student.grade_level]);

  return (
    <div className="animate-rise space-y-5">
      {/* Profile header — luxurious */}
      <section className="card-accent relative overflow-hidden rounded-3xl glass-strong p-6 md:p-8">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-16 h-48 w-48 rounded-full bg-gold-500/[0.06] blur-2xl" />
        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-right">
          <Logo size={68} glow className="shrink-0 rounded-2xl border border-gold-500/20 bg-ink-900/50 p-2.5" />
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500/70">إدارتنا الشاملة</p>
            <h1 className="mt-1 text-2xl font-black text-white md:text-3xl">{student.student_name_ar || 'عزيزي الطالب'}</h1>
            <p className="mt-1 text-sm text-slate-400">{gradeLabel(student.grade_level)} · {student.school_name}</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-xl border border-rose-400/15 bg-rose-500/5 px-4 py-2 text-sm font-semibold text-rose-300/90 transition hover:bg-rose-500/15"
          >
            خروج
          </button>
        </div>
      </section>

      {/* Tab bar */}
      <div className="sticky top-[60px] z-20 -mx-4 overflow-x-auto border-y border-gold-500/8 bg-ink-950/70 px-4 py-2 backdrop-blur-xl md:mx-0 md:rounded-2xl md:border">
        <div className="flex min-w-max gap-1">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  active ? 'text-gold-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {active && (
                  <>
                    <span className="absolute inset-0 rounded-xl border border-gold-500/25 bg-gold-500/10" />
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gold-500" />
                  </>
                )}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-gold-500/15 border-t-gold-400" />
          <p className="text-sm text-slate-400">جارٍ تحميل بياناتك…</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-rose-400/15 bg-rose-500/5 p-8 text-center">
          <p className="text-sm text-rose-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border border-gold-500/20 bg-gold-500/5 px-5 py-2 text-sm font-semibold text-gold-400 hover:bg-gold-500/10"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <div key={tab} className="animate-tab-rise">
          {tab === 'overview' && <TabOverview student={student} data={data} setTab={setTab} />}
          {tab === 'grades' && <TabGrades data={data} />}
          {tab === 'attendance' && <TabAttendance data={data} />}
          {tab === 'schedule' && <TabSchedule data={data} />}
          {tab === 'announcements' && <TabAnnouncements data={data} />}
        </div>
      )}
    </div>
  );
}
