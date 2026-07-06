import React, { useState } from 'react';
import {
  getRoster,
  updateGrades,
  type RosterStudent,
} from '../apiService';
import { HierarchySelector, type HierarchySelection } from './HierarchySelector';
import { gradeLabel } from '../schoolData';

interface Draft {
  // rowIndex → current edited grade text (kept separate so unsaved edits don't
  // silently mutate the loaded snapshot before the batch save round-trip).
  [ssn: string]: string;
}

export function RosterEditor() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<RosterStudent[]>([]);
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState(0);
  const [className, setClassName] = useState('');
  const [draft, setDraft] = useState<Draft>({});
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function loadRoster(sel: HierarchySelection) {
    setLoading(true);
    setError(null);
    setResult(null);
    setStudents([]);
    setSubject(sel.subject ?? '');
    setGradeLevel(sel.gradeLevel);
    setClassName(sel.className);
    try {
      const { students: list } = await getRoster(sel.school, sel.gradeLevel, sel.className, sel.subject);
      const init: Draft = {};
      for (const s of list) {
        const g = (s.grades.find((x) => x.subject_name === sel.subject) ?? s.grades[0])?.grade_value ?? '';
        init[s.ssn_encrypted] = g;
      }
      setStudents(list);
      setDraft(init);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل تحميل القائمة');
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setError(null);
    setResult(null);
    const entries = students
      .map((s) => ({ ssn_encrypted: s.ssn_encrypted, grade_value: draft[s.ssn_encrypted] ?? '' }))
      .filter((e) => e.grade_value.trim() !== '' && !Number.isNaN(Number(e.grade_value)));
    if (entries.length === 0) {
      setError('لا توجد درجات صحيحة للحفظ.');
      return;
    }
    setSaving(true);
    try {
      const { updated } = await updateGrades(entries, {
        grade_level: gradeLevel,
        class_name: className,
        subject_name: subject,
      });
      setResult(`تم حفظ ${updated} درجة بنجاح ✅`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل حفظ الدرجات');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <HierarchySelector requireSubject onShow={loadRoster} loading={loading} />

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
              <h3 className="text-lg font-bold text-white">قائمة الفصل ({students.length})</h3>
              <p className="mt-0.5 text-xs text-slate-400">
                {gradeLabel(gradeLevel)} · فصل {className} · مادة «{subject}»
              </p>
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="btn-gold rounded-xl px-7 py-3 text-sm font-bold disabled:opacity-50"
            >
              {saving ? 'جارٍ الحفظ…' : 'حفظ الدرجات ←'}
            </button>
          </div>

          <div className="overflow-x-auto" dir="rtl">
            <table className="w-full min-w-[520px] border-separate border-spacing-y-2 text-right text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th className="px-3 pb-1 font-semibold">الاسم</th>
                  <th className="px-3 pb-1 font-semibold">رقم الطالب</th>
                  <th className="px-3 pb-1 font-semibold">درجة {subject}</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr
                    key={s.ssn_encrypted}
                    className="rounded-xl bg-white/[0.02]"
                    style={{ animation: `tabRise 0.3s ease both`, animationDelay: `${i * 30}ms` }}
                  >
                    <td className="rounded-r-xl border-y border-r border-gold-500/10 px-3 py-2.5 text-slate-200">
                      {s.student_name_ar}
                    </td>
                    <td className="border-y border-gold-500/10 px-3 py-2.5 font-mono text-xs text-slate-400" dir="ltr">
                      {s.ssn_encrypted}
                    </td>
                    <td className="rounded-l-xl border-y border-l border-gold-500/10 px-3 py-2.5">
                      <input
                        value={draft[s.ssn_encrypted] ?? ''}
                        onChange={(e) => setDraft((d) => ({ ...d, [s.ssn_encrypted]: e.target.value }))}
                        dir="ltr"
                        inputMode="numeric"
                        placeholder="—"
                        className="w-24 rounded-lg border border-gold-500/15 bg-ink-900/70 px-3 py-1.5 text-center font-mono text-white focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && students.length === 0 && subject && (
        <p className="py-12 text-center text-sm text-slate-500">اختر المدرسة والصف والفصل والمادة ثم اضغط «عرض القائمة».</p>
      )}
    </div>
  );
}
