import React, { useEffect, useMemo, useState } from 'react';
import {
  getSchools,
  getClasses,
  getDistricts,
  type School,
  type ClassInfo,
} from '../apiService';
import { GRADE_LABELS } from '../schoolData';

export interface HierarchySelection {
  school: string;
  gradeLevel: number;
  className: string;
  subject?: string;
}

interface Props {
  /** When true, the subject field becomes required before the "show" button enables. */
  requireSubject?: boolean;
  /** Emit a complete selection when the user presses "عرض". */
  onShow: (selection: HierarchySelection) => void;
  /** Parent loading state — disables the show button. */
  loading?: boolean;
}

const SUBJECT_OPTIONS = [
  'اللغة العربية',
  'اللغة الإنجليزية',
  'الرياضيات',
  'العلوم',
  'الدراسات الاجتماعية',
  'التربية الدينية',
  'الحاسب الآلي',
];

const inputCls =
  'w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-2.5 text-white focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15';

export function HierarchySelector({ requireSubject, onShow, loading }: Props) {
  const [schools, setSchools] = useState<School[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const [district, setDistrict] = useState('');
  const [school, setSchool] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(7); // first إعدادي by default
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');

  // Load schools + districts once on mount. The backend already scopes these
  // to the caller (staff JWT), so a principal will only see their own school,
  // a district user will only see their own district, etc.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadErr(null);
      try {
        const [schoolsRes, districtsRes] = await Promise.all([
          getSchools().catch((e) => ({ schools: [], _err: e })),
          getDistricts().catch((e) => ({ districts: [], _err: e })),
        ]);
        if (cancelled) return;
        const s = (schoolsRes as { schools: School[] }).schools ?? [];
        setSchools(s);
        const dl = ((districtsRes as { districts: { district_name: string }[] }).districts ?? [])
          .map((d) => d.district_name)
          .filter(Boolean);
        setDistricts(dl);
        // Auto-pick the only options if the role is scoped to one.
        if (dl.length === 1) setDistrict(dl[0]);
        if (s.length === 1) setSchool(s[0].school_name);
      } catch (e) {
        if (!cancelled) setLoadErr(e instanceof Error ? e.message : 'فشل تحميل قائمة المدارس');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load classes for the chosen (school, gradeLevel). Both must be chosen.
  useEffect(() => {
    let cancelled = false;
    if (!school) {
      setClasses([]);
      setClassName('');
      return;
    }
    (async () => {
      setLoadErr(null);
      setClassName('');
      try {
        const { classes: list } = await getClasses(school, gradeLevel);
        if (!cancelled) {
          setClasses(list ?? []);
          if (list.length === 1) setClassName(list[0].class_name);
        }
      } catch (e) {
        if (!cancelled) setLoadErr(e instanceof Error ? e.message : 'فشل تحميل الفصول');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [school, gradeLevel]);

  const filteredSchools = useMemo(
    () => (district ? schools.filter((s) => s.admin_zone === district) : schools),
    [district, schools],
  );

  const canShow =
    !!school &&
    !!className &&
    (!requireSubject || !!subject) &&
    !loading;

  function handleShow() {
    if (!canShow) return;
    onShow({ school, gradeLevel, className, subject: requireSubject ? subject : undefined });
  }

  const labelCls = 'mb-1.5 block text-xs font-semibold text-slate-400';

  return (
    <div className="rounded-3xl border border-gold-500/10 bg-white/[0.02] p-5 md:p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* District — hidden when there's only one (or none) to avoid a dead dropdown */}
        {districts.length > 1 && (
          <label className="block">
            <span className={labelCls}>الإدارة التعليمية</span>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className={inputCls}>
              <option value="" className="bg-ink-900">— كل الإدارات —</option>
              {districts.map((d) => (
                <option key={d} value={d} className="bg-ink-900">{d}</option>
              ))}
            </select>
          </label>
        )}

        <label className="block">
          <span className={labelCls}>المدرسة</span>
          <select value={school} onChange={(e) => setSchool(e.target.value)} className={inputCls}>
            <option value="" className="bg-ink-900">— اختر المدرسة —</option>
            {filteredSchools.map((s) => (
              <option key={s.school_name} value={s.school_name} className="bg-ink-900">{s.school_name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelCls}>الصف</span>
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(Number(e.target.value))}
            className={inputCls}
          >
            {Object.entries(GRADE_LABELS).map(([k, v]) => (
              <option key={k} value={k} className="bg-ink-900">{v}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelCls}>الفصل</span>
          <div className="relative">
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className={`${inputCls} ${classes.length === 0 ? 'opacity-50' : ''}`}
              disabled={classes.length === 0}
            >
              <option value="" className="bg-ink-900">{classes.length === 0 ? 'لا توجد فصول لهذا الصف' : '— اختر الفصل —'}</option>
              {classes.map((c) => (
                <option key={c.class_name} value={c.class_name} className="bg-ink-900">
                  {c.class_name} ({c.student_count} طالب)
                </option>
              ))}
            </select>
          </div>
        </label>

        {requireSubject && (
          <label className="block">
            <span className={labelCls}>المادة</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputCls}
            >
              <option value="" className="bg-ink-900">— اختر المادة —</option>
              {SUBJECT_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-ink-900">{s}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {loadErr && (
        <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">
          {loadErr}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleShow}
          disabled={!canShow}
          className="btn-gold rounded-xl px-7 py-3 text-sm font-bold disabled:opacity-50"
        >
          {loading ? 'جارٍ التحميل…' : 'عرض القائمة ←'}
        </button>
      </div>
    </div>
  );
}
