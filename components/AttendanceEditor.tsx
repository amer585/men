import React, { useState } from 'react';
import {
  getRoster,
  updateAttendance,
  type RosterStudent,
  type AttendanceStatus,
} from '../apiService';
import { HierarchySelector, type HierarchySelection } from './HierarchySelector';
import { gradeLabel } from '../schoolData';

interface Mark {
  status: AttendanceStatus;
  note: string;
}

interface Props {
  /** Date in YYYY-MM-DD; defaults to today. */
  defaultDate?: string;
}

function today(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const STATUS_LABELS: Array<{ value: AttendanceStatus; label: string; tone: string }> = [
  { value: 'present', label: 'حاضر', tone: 'text-emerald-300' },
  { value: 'absent', label: 'غائب', tone: 'text-rose-300' },
  { value: 'late', label: 'متأخر', tone: 'text-amber-300' },
  { value: 'excused', label: 'بعذر', tone: 'text-slate-300' },
];

export function AttendanceEditor({ defaultDate }: Props) {
  const [date, setDate] = useState(defaultDate ?? today());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<RosterStudent[]>([]);
  const [gradeLevel, setGradeLevel] = useState(0);
  const [className, setClassName] = useState('');
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function loadRoster(sel: HierarchySelection) {
    setLoading(true);
    setError(null);
    setResult(null);
    setStudents([]);
    setGradeLevel(sel.gradeLevel);
    setClassName(sel.className);
    try {
      const { students: list } = await getRoster(sel.school, sel.gradeLevel, sel.className);
      const init: Record<string, Mark> = {};
      for (const s of list) init[s.ssn_encrypted] = { status: 'present', note: '' };
      setStudents(list);
      setMarks(init);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل تحميل القائمة');
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setError(null);
    setResult(null);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError('صيغة التاريخ غير صحيحة (YYYY-MM-DD).');
      return;
    }
    const entries = students.map((s) => ({
      ssn_encrypted: s.ssn_encrypted,
      date,
      status: marks[s.ssn_encrypted]?.status ?? 'present',
      note: marks[s.ssn_encrypted]?.note?.trim() || null,
    }));
    setSaving(true);
    try {
      const { updated } = await updateAttendance(entries, { grade_level: gradeLevel });
      setResult(`تم تسجيل حضور ${updated} طالبًا بنجاح ✅`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل حفظ الحضور');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <HierarchySelector onShow={loadRoster} loading={loading} />

      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
      )}
      {result && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{result}</div>
      )}

      {loading && (
        <div className="flex min-h-[180px] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-gold-500/15 border-t-gold-400" />
        </div>
      )}

      {!loading && students.length > 0 && (
        <div className="rounded-3xl border border-gold-500/10 bg-white/[0.02] p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">تسجيل الحضور ({students.length})</h3>
              <p className="mt-0.5 text-xs text-slate-400">{gradeLabel(gradeLevel)} · فصل {className}</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-400">
                التاريخ
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  dir="ltr"
                  className="rounded-lg border border-gold-500/15 bg-ink-900/70 px-3 py-2 text-white focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                />
              </label>
              <button
                onClick={save}
                disabled={saving}
                className="btn-gold rounded-xl px-7 py-3 text-sm font-bold disabled:opacity-50"
              >
                {saving ? 'جارٍ الحفظ…' : 'حفظ الحضور ←'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto" dir="rtl">
            <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-right text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th className="px-3 pb-1 font-semibold">الاسم</th>
                  <th className="px-3 pb-1 font-semibold">الحالة</th>
                  <th className="px-3 pb-1 font-semibold">ملاحظة</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr
                    key={s.ssn_encrypted}
                    className="rounded-xl bg-white/[0.02]"
                    style={{ animation: `tabRise 0.3s ease both`, animationDelay: `${i * 25}ms` }}
                  >
                    <td className="rounded-r-xl border-y border-r border-gold-500/10 px-3 py-2.5 text-slate-200">
                      {s.student_name_ar}
                    </td>
                    <td className="border-y border-gold-500/10 px-3 py-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {STATUS_LABELS.map((opt) => {
                          const active = (marks[s.ssn_encrypted]?.status ?? 'present') === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setMarks((m) => ({ ...m, [s.ssn_encrypted]: { ...(m[s.ssn_encrypted] ?? { note: '' }), status: opt.value } }))}
                              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                                active
                                  ? 'border-gold-400/40 bg-gold-500/15 ' + opt.tone
                                  : 'border-gold-500/10 bg-ink-900/40 text-slate-400 hover:bg-gold-500/10'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="rounded-l-xl border-y border-l border-gold-500/10 px-3 py-2.5">
                      <input
                        value={marks[s.ssn_encrypted]?.note ?? ''}
                        onChange={(e) => setMarks((m) => ({ ...m, [s.ssn_encrypted]: { status: m[s.ssn_encrypted]?.status ?? 'present', note: e.target.value } }))}
                        dir="rtl"
                        placeholder="ملاحظة اختيارية"
                        className="w-full rounded-lg border border-gold-500/10 bg-ink-900/50 px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:border-gold-400/30 focus:outline-none focus:ring-1 focus:ring-gold-500/15"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && students.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-500">اختر المدرسة والصف والفصل ثم اضغط «عرض القائمة».</p>
      )}
    </div>
  );
}
