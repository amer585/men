import React, { useEffect, useState } from 'react';
import {
  getTeacherProfile,
  getTeacherStudents,
  linkStudent,
  unlinkStudent,
  updateTeacherProfile,
  type TeacherAccount,
  type LinkedStudent,
} from '../apiService';
import { gradeLabel } from '../schoolData';
import { Logo } from './Logo';

interface Props {
  account: TeacherAccount;
  onLogout: () => void;
}

export function TeacherDashboard({ account: initial, onLogout }: Props) {
  const [account, setAccount] = useState<TeacherAccount>(initial);
  const [students, setStudents] = useState<LinkedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newSsn, setNewSsn] = useState('');
  const [linkBusy, setLinkBusy] = useState(false);
  const [linkMsg, setLinkMsg] = useState<string | null>(null);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [eName, setEName] = useState(initial.name);
  const [ePhone, setEPhone] = useState(initial.phone ?? '');
  const [eSubject, setESubject] = useState(initial.subject ?? '');
  const [saveBusy, setSaveBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [profile, roster] = await Promise.all([
          getTeacherProfile().catch(() => account),
          getTeacherStudents().catch(() => ({ teacher_id: '', students: [] })),
        ]);
        if (!cancelled) {
          setAccount(profile);
          setStudents(roster.students);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'فشل تحميل البيانات');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function link(e: React.FormEvent) {
    e.preventDefault();
    setLinkMsg(null);
    if (!/^\d{14}$/.test(newSsn)) {
      setLinkMsg('رقم الطالب يجب أن يكون 14 رقمًا.');
      return;
    }
    setLinkBusy(true);
    try {
      await linkStudent(newSsn);
      setNewSsn('');
      const roster = await getTeacherStudents();
      setStudents(roster.students);
      setLinkMsg('تم ربط الطالب بنجاح ✅');
    } catch (err) {
      setLinkMsg(err instanceof Error ? err.message : 'تعذّر ربط الطالب.');
    } finally {
      setLinkBusy(false);
    }
  }

  async function unlink(s: LinkedStudent) {
    setLinkMsg(null);
    setUnlinkingId(s.student_id);
    try {
      await unlinkStudent(s.student_id);
      // Optimistic local removal — the backend already busted the roster cache.
      setStudents((prev) => prev.filter((x) => x.student_id !== s.student_id));
      setLinkMsg('تم إلغاء ربط الطالب.');
    } catch (err) {
      setLinkMsg(err instanceof Error ? err.message : 'تعذّر إلغاء الربط.');
    } finally {
      setUnlinkingId(null);
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaveBusy(true);
    try {
      const { account: updated } = await updateTeacherProfile({
        name: eName.trim(),
        phone: ePhone.trim() || undefined,
        subject: eSubject || undefined,
      });
      setAccount(updated);
      setEditing(false);
    } catch (err) {
      setLinkMsg(err instanceof Error ? err.message : 'تعذّر حفظ التعديلات.');
    } finally {
      setSaveBusy(false);
    }
  }

  return (
    <div className="animate-rise space-y-5">
      {/* Profile header */}
      <section className="card-accent relative overflow-hidden rounded-3xl glass-strong p-7 md:p-9">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold-500/[0.08] blur-3xl" />
        <div className="absolute -left-12 -bottom-20 h-56 w-56 rounded-full bg-gold-500/[0.05] blur-2xl" />
        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-right">
          <div className="relative shrink-0">
            <div className="animate-breathe absolute inset-0 -m-2 rounded-2xl blur-md" style={{ background: 'radial-gradient(circle, rgba(201,169,106,0.25), transparent 70%)' }} />
            <Logo size={72} glow className="relative rounded-2xl border border-gold-500/20 bg-ink-900/50 p-2.5" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-500/70">بوابة المعلّم</p>
            <h1 className="mt-1.5 text-[clamp(1.5rem,4vw,2rem)] font-black tracking-tight text-white">{account.name}</h1>
            <p className="mt-1.5 text-sm text-slate-400">
              {account.subject || 'مادة غير محددة'} · <span dir="ltr">{account.email}</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {account.is_verified ? (
                <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  ✓ حساب مُفعّل
                </span>
              ) : (
                <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  ⏳ قيد المراجعة
                </span>
              )}
              {account.phone && (
                <span className="rounded-full border border-gold-500/15 bg-white/[0.03] px-3 py-1 text-xs text-slate-300" dir="ltr">
                  {account.phone}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="rounded-xl border border-rose-400/15 bg-rose-500/5 px-5 py-2.5 text-sm font-semibold text-rose-300/90 transition hover:bg-rose-500/15"
          >
            خروج
          </button>
        </div>
      </section>

      {/* Pending notice */}
      {!account.is_verified && (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/[0.07] px-5 py-4 text-sm text-amber-200">
          حسابك قيد المراجعة من قِبل الإدارة. بعض الميزات قد تكون محدودة حتى يتم التفعيل.
        </div>
      )}

      {loading && (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-gold-500/15 border-t-gold-400" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-rose-400/15 bg-rose-500/5 px-5 py-4 text-sm text-rose-300">{error}</div>
      )}

      {!loading && (
        <div className="grid gap-5 md:grid-cols-2">
          {/* Link a student */}
          <section className="rounded-3xl border border-gold-500/10 bg-white/[0.02] p-6">
            <h2 className="mb-1 text-lg font-bold text-white">ربط طالب</h2>
            <p className="mb-4 text-sm text-slate-400">أضف طالبًا إلى قائمتك برقمه (14 رقمًا).</p>
            <form onSubmit={link} className="space-y-3">
              <input
                value={newSsn}
                onChange={(e) => setNewSsn(e.target.value.replace(/\D/g, '').slice(0, 14))}
                inputMode="numeric"
                dir="ltr"
                placeholder="00000000000000"
                className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-3 text-center font-mono tracking-widest text-white placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
              />
              <button type="submit" disabled={linkBusy} className="btn-gold w-full rounded-xl py-3 text-sm font-bold disabled:opacity-50">
                {linkBusy ? 'جارٍ الربط…' : 'ربط الطالب'}
              </button>
            </form>
            {linkMsg && <p className="mt-3 text-xs text-slate-400">{linkMsg}</p>}
          </section>

          {/* Edit profile */}
          <section className="rounded-3xl border border-gold-500/10 bg-white/[0.02] p-6">
            <h2 className="mb-1 text-lg font-bold text-white">الملف الشخصي</h2>
            <p className="mb-4 text-sm text-slate-400">عدّل بياناتك (البريد لا يمكن تغييره).</p>
            {!editing ? (
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-slate-400">الاسم</dt><dd className="text-slate-200">{account.name}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-400">الهاتف</dt><dd className="text-slate-200" dir="ltr">{account.phone || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-400">المادة</dt><dd className="text-slate-200">{account.subject || '—'}</dd></div>
                <button onClick={() => setEditing(true)} className="mt-2 w-full rounded-xl border border-gold-500/20 bg-gold-500/5 px-4 py-2.5 text-sm font-semibold text-gold-400 hover:bg-gold-500/10">
                  تعديل البيانات
                </button>
              </dl>
            ) : (
              <form onSubmit={saveProfile} className="space-y-3">
                <input value={eName} onChange={(e) => setEName(e.target.value)} dir="rtl" placeholder="الاسم" className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-2.5 text-white focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15" />
                <input value={ePhone} onChange={(e) => setEPhone(e.target.value.replace(/\D/g, '').slice(0, 15))} dir="ltr" placeholder="الهاتف" className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-2.5 text-white focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15" />
                <input value={eSubject} onChange={(e) => setESubject(e.target.value)} dir="rtl" placeholder="المادة" className="w-full rounded-xl border border-gold-500/10 bg-ink-900/60 px-4 py-2.5 text-white focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-500/15" />
                <div className="flex gap-2">
                  <button type="submit" disabled={saveBusy} className="btn-gold flex-1 rounded-xl py-2.5 text-sm font-bold disabled:opacity-50">{saveBusy ? 'جارٍ الحفظ…' : 'حفظ'}</button>
                  <button type="button" onClick={() => setEditing(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5">إلغاء</button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}

      {/* Linked students */}
      {!loading && (
        <section className="rounded-3xl border border-gold-500/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-bold text-white">طلابي ({students.length})</h2>
          {students.length === 0 ? (
            <p className="text-sm text-slate-400">لم تقم بربط أي طالب بعد.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="text-slate-400">
                    <th className="pb-2 pr-2 font-medium">الاسم</th>
                    <th className="pb-2 font-medium">الصف</th>
                    <th className="pb-2 font-medium">الفصل</th>
                    <th className="pb-2 font-medium">المدرسة</th>
                    <th className="pb-2 pl-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.student_id} className="border-t border-white/5">
                      <td className="py-2.5 pr-2 text-slate-200">{s.student_name_ar || '—'}</td>
                      <td className="py-2.5 text-slate-300">{gradeLabel(s.grade_level)}</td>
                      <td className="py-2.5 text-slate-300">{s.class_name || '—'}</td>
                      <td className="py-2.5 text-slate-300">{s.school_name || '—'}</td>
                      <td className="py-2.5 pl-2 text-left">
                        <button
                          onClick={() => unlink(s)}
                          disabled={unlinkingId === s.student_id}
                          title="إلغاء الربط (يبقى الطالب محفوظًا في قاعدة بيانات الطلاب)"
                          className="rounded-lg border border-rose-400/15 bg-rose-500/5 px-3 py-1.5 text-xs font-semibold text-rose-300/90 transition hover:bg-rose-500/15 disabled:opacity-50"
                        >
                          {unlinkingId === s.student_id ? 'جارٍ الإلغاء…' : 'إلغاء الربط'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
