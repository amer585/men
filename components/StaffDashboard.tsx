import { useEffect, useState } from 'react';
import {
  getSchools,
  getClasses,
  getRoster,
  updateGrades,
  type StaffUser,
  type School,
  type ClassInfo,
  type RosterStudent,
} from '../apiService';
import { gradeLabel } from '../schoolData';

interface Props {
  user: StaffUser;
  onLogout: () => void;
}

export function StaffDashboard({ user, onLogout }: Props) {
  const [schools, setSchools] = useState<School[]>([]);
  const [school, setSchool] = useState('');
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [cls, setCls] = useState<{ grade: number; name: string } | null>(null);
  const [subject, setSubject] = useState('اللغة العربية');
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setLoading('schools');
    getSchools()
      .then((r) => setSchools(r.schools))
      .catch((e) => setError(e instanceof Error ? e.message : 'فشل تحميل المدارس'))
      .finally(() => setLoading(''));
  }, []);

  function pickSchool(name: string) {
    setSchool(name);
    setClasses([]);
    setCls(null);
    setRoster([]);
    setLoading('classes');
    getClasses(name)
      .then((r) => setClasses(r.classes))
      .catch((e) => setError(e instanceof Error ? e.message : 'فشل تحميل الفصول'))
      .finally(() => setLoading(''));
  }

  function pickClass(grade: number, name: string) {
    const c = { grade, name };
    setCls(c);
    setRoster([]);
    setLoading('roster');
    getRoster(school, grade, name, subject)
      .then((r) => {
        setRoster(r.students);
        const d: Record<string, string> = {};
        for (const s of r.students) {
          const g = s.grades.find((x) => x.subject_name === subject);
          d[s.ssn_encrypted] = g?.grade_value ?? '';
        }
        setDrafts(d);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'فشل تحميل الكشف'))
      .finally(() => setLoading(''));
  }

  function reloadSubject(newSubject: string) {
    setSubject(newSubject);
    if (cls) {
      setLoading('roster');
      getRoster(school, cls.grade, cls.name, newSubject)
        .then((r) => {
          setRoster(r.students);
          const d: Record<string, string> = {};
          for (const s of r.students) {
            const g = s.grades.find((x) => x.subject_name === newSubject);
            d[s.ssn_encrypted] = g?.grade_value ?? '';
          }
          setDrafts(d);
        })
        .finally(() => setLoading(''));
    }
  }

  async function saveGrades() {
    if (!cls) return;
    setError(null);
    setLoading('save');
    const entries = Object.entries(drafts)
      .filter(([, v]) => v.trim() !== '')
      .map(([ssn_encrypted, grade_value]) => ({ ssn_encrypted, grade_value: grade_value.trim() }));
    if (entries.length === 0) {
      setError('لا توجد درجات للحفظ.');
      setLoading('');
      return;
    }
    try {
      const res = await updateGrades(entries, {
        grade_level: cls.grade,
        class_name: cls.name,
        subject_name: subject,
      });
      setToast(`تم حفظ ${res.updated} درجة بنجاح ✓`);
      setTimeout(() => setToast(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل حفظ الدرجات');
    } finally {
      setLoading('');
    }
  }

  return (
    <div className="animate-rise space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 rounded-[2rem] glass-strong p-6 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 text-2xl">
          👨‍🏫
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white">{user.teacher_name_ar || user.name}</h1>
          <p className="text-sm text-slate-400">
            الدور: <span className="text-sky-300">{user.role}</span>
            {user.school_name && user.school_name !== 'ALL' && ` · ${user.school_name}`}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          خروج
        </button>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* Step 1: schools */}
      <Panel step="1" title="اختر المدرسة" loading={loading === 'schools'}>
        <div className="flex flex-wrap gap-2">
          {schools.map((s) => (
            <Chip key={s.school_name} active={school === s.school_name} onClick={() => pickSchool(s.school_name)}>
              {s.school_name}
            </Chip>
          ))}
          {schools.length === 0 && loading !== 'schools' && <Empty text="لا توجد مدارس متاحة." />}
        </div>
      </Panel>

      {/* Step 2: classes */}
      {school && (
        <Panel step="2" title={`فصول ${school}`} loading={loading === 'classes'}>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <Chip
                key={`${c.grade_level}-${c.class_name}`}
                active={cls?.grade === c.grade_level && cls?.name === c.class_name}
                onClick={() => pickClass(c.grade_level, c.class_name)}
              >
                {gradeLabel(c.grade_level)} — {c.class_name}
                <span className="ms-1 rounded-full bg-white/10 px-1.5 text-[10px]">{c.student_count}</span>
              </Chip>
            ))}
            {classes.length === 0 && loading !== 'classes' && <Empty text="لا توجد فصول." />}
          </div>
        </Panel>
      )}

      {/* Step 3: roster + grades */}
      {cls && (
        <Panel step="3" title={`كشف الدرجات — ${gradeLabel(cls.grade)} / ${cls.name}`} loading={loading === 'roster'}>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="text-sm text-slate-300">المادة:</label>
            <select
              value={subject}
              onChange={(e) => reloadSubject(e.target.value)}
              className="rounded-lg border border-white/10 bg-ink-900/60 px-3 py-2 text-sm text-white focus:border-sky-400/50 focus:outline-none"
            >
              {['اللغة العربية', 'الرياضيات', 'العلوم', 'الدراسات الاجتماعية', 'اللغة الإنجليزية'].map((s) => (
                <option key={s} value={s} className="bg-ink-900">
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={saveGrades}
              disabled={loading === 'save'}
              className="ms-auto rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition hover:brightness-110 disabled:opacity-50"
            >
              {loading === 'save' ? 'جارٍ الحفظ…' : '💾 حفظ الدرجات'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-white/10 text-xs text-slate-400">
                <tr>
                  <th className="px-3 py-2">الاسم</th>
                  <th className="px-3 py-2">النوع</th>
                  <th className="px-3 py-2 text-center">الدرجة الحالية</th>
                  <th className="px-3 py-2 text-center">درجة جديدة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {roster.map((s) => {
                  const current = s.grades.find((g) => g.subject_name === subject)?.grade_value;
                  return (
                    <tr key={s.ssn_encrypted} className="hover:bg-white/[0.02]">
                      <td className="px-3 py-2.5 font-medium text-white">{s.student_name_ar || '—'}</td>
                      <td className="px-3 py-2.5 text-slate-400">{s.gender === 'F' ? 'أنثى' : 'ذكر'}</td>
                      <td className="px-3 py-2.5 text-center text-slate-300">{current ?? '—'}</td>
                      <td className="px-3 py-2.5 text-center">
                        <input
                          value={drafts[s.ssn_encrypted] ?? ''}
                          onChange={(e) => setDrafts((d) => ({ ...d, [s.ssn_encrypted]: e.target.value }))}
                          inputMode="decimal"
                          dir="ltr"
                          className="w-20 rounded-lg border border-white/10 bg-ink-900/60 px-2 py-1.5 text-center text-white focus:border-brand-400/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {roster.length === 0 && loading !== 'roster' && <Empty text="لا يوجد طلاب في هذا الفصل." />}
          </div>
        </Panel>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function Panel({ step, title, loading, children }: { step: string; title: string; loading?: boolean; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl glass p-5">
      <h2 className="mb-3 flex items-center gap-2 font-bold text-white">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs text-sky-300">{step}</span>
        {title}
        {loading && <span className="ms-1 text-xs text-slate-400">…</span>}
      </h2>
      {children}
    </section>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
        active
          ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20'
          : 'bg-white/5 text-slate-300 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-slate-500">{text}</p>;
}
