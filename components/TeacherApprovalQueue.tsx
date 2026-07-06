import React, { useEffect, useState } from 'react';
import { getPendingTeachers, verifyTeacher, type TeacherAccount } from '../apiService';

export function TeacherApprovalQueue() {
  const [pending, setPending] = useState<TeacherAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { pending: list } = await getPendingTeachers();
      setPending(list ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل تحميل حسابات المعلّمين');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string, name: string) {
    setBusyId(id);
    setError(null);
    setResult(null);
    try {
      await verifyTeacher(id);
      setResult(`تم اعتماد حساب «${name}» بنجاح ✅`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل اعتماد الحساب');
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[180px] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-gold-500/15 border-t-gold-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
      )}
      {result && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{result}</div>
      )}

      <h3 className="text-lg font-bold text-white">قائمة اعتماد المعلّمين ({pending.length})</h3>

      {pending.length === 0 ? (
        <div className="rounded-2xl border border-gold-500/10 bg-white/[0.02] px-5 py-10 text-center">
          <p className="text-sm text-slate-400">لا توجد حسابات معلّمين بانتظار الاعتماد ✅</p>
          <p className="mt-1 text-xs text-slate-500">ستظهر هنا الحسابات الجديدة المسجّلة عبر بوابة المعلّمين بمجرد إنشائها.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {pending.map((t) => (
            <div
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl glass p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-bold text-white">{t.name}</p>
                <p className="mt-0.5 truncate text-xs text-slate-400" dir="ltr">{t.email}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {t.subject && <span className="rounded-full border border-gold-500/15 bg-white/[0.03] px-2.5 py-0.5">{t.subject}</span>}
                  {t.phone && <span dir="ltr">{t.phone}</span>}
                  <span>· أُنشئ {new Date(t.created_at).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
              <button
                onClick={() => approve(t.id, t.name)}
                disabled={busyId === t.id}
                className="btn-gold shrink-0 rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-50"
              >
                {busyId === t.id ? 'جارٍ الاعتماد…' : 'اعتماد الحساب ←'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
