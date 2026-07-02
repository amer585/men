import { useEffect, useState } from 'react';
import { getStudentPortal, ACTION_TYPES, logAction, type StudentProfile, type PortalData } from '../apiService';
import { gradeLabel } from '../schoolData';
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

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'نظرة عامة', icon: '📊' },
  { id: 'grades', label: 'الدرجات', icon: '📝' },
  { id: 'attendance', label: 'الحضور', icon: '✓' },
  { id: 'schedule', label: 'الجدول', icon: '📅' },
  { id: 'announcements', label: 'الإعلانات', icon: '📢' },
];

export function StudentDashboard({ student, onLogout }: Props) {
  const [tab, setTab] = useState<TabId>('overview');
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logAction({
      ssn_encrypted: student.ssn_encrypted,
      grade_level: student.grade_level,
      action_type: ACTION_TYPES.VIEW_PROFILE,
    }).catch(() => {});

    setLoading(true);
    setError(null);
    // Retry up to 3x so a transient cold-start/DB hiccup never shows an error.
    const fetchPortal = async (attempt = 0): Promise<void> => {
      try {
        const d = await getStudentPortal(student.ssn_encrypted, student.grade_level);
        setData(d);
      } catch (e) {
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
          return fetchPortal(attempt + 1);
        }
        setError(e instanceof Error ? e.message : 'فشل تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };
    void fetchPortal();
  }, [student.ssn_encrypted, student.grade_level]);

  return (
    <div className="animate-rise space-y-5">
      {/* Profile header */}
      <section className="card-accent relative overflow-hidden rounded-[2rem] glass-strong p-6 md:p-8">
        <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-gold-500/[0.07] blur-3xl" />
        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-right">
          <Logo size={64} glow className="rounded-2xl border border-gold-500/15 bg-ink-900/40 p-2" />
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500/70">مرحبًا بك</p>
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

      {/* Animated tab bar */}
      <div className="sticky top-[60px] z-20 -mx-4 overflow-x-auto px-4 py-2 md:mx-0 md:rounded-2xl md:bg-white/[0.03] md:backdrop-blur-xl md:px-2">
        <div className="flex min-w-max gap-1.5">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`group relative flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {active && (
                  <span className="absolute inset-0 rounded-xl border border-gold-500/25 bg-gold-500/10 shadow-lg shadow-gold-500/10 transition-all duration-300" />
                )}
                {!active && (
                  <span className="absolute inset-0 rounded-xl bg-white/0 transition-all duration-300 group-hover:bg-white/5" />
                )}
                <span className="relative text-base">{t.icon}</span>
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-brand-500/20 border-t-brand-400" />
          <p className="text-sm text-slate-400">جارٍ تحميل بياناتك…</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-6 text-center text-sm text-rose-300">
          {error}
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
