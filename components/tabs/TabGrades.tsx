import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { PortalData } from '../../apiService';

const SUBJECT_ICONS: Record<string, string> = {
  'اللغة العربية': 'ع',
  'اللغة الإنجليزية': 'E',
  'الرياضيات': '∑',
  'العلوم': '⚗',
  'الدراسات الاجتماعية': '◙',
  'التربية الدينية': '☪',
  'الحاسب الآلي': '⌘',
};

const CHART_COLORS = ['#c9a96a', '#38bdf8', '#a78bfa', '#2dd4bf', '#fbbf24', '#22d3ee', '#fb7185'];

function gradeColor(value: number): string {
  if (value >= 45) return 'text-gold-400';
  if (value >= 38) return 'text-sky-300/80';
  if (value >= 25) return 'text-amber-300/70';
  return 'text-rose-300/80';
}

function gradeBar(value: number): string {
  if (value >= 45) return 'from-gold-500 to-gold-300';
  if (value >= 38) return 'from-sky-500/60 to-sky-400/50';
  if (value >= 25) return 'from-amber-500/50 to-amber-400/40';
  return 'from-rose-500/50 to-rose-400/40';
}

export function TabGrades({ data }: { data: PortalData }) {
  const [showChart, setShowChart] = useState(true);
  const subjects = Object.keys(data.weeklyAssessments || {});

  // Build chart data: one row per week, columns per subject.
  const maxWeek = Math.max(0, ...subjects.flatMap((s) => (data.weeklyAssessments[s] || []).map((w) => w.week)));
  const chartData = Array.from({ length: maxWeek }, (_, i) => {
    const week = i + 1;
    const row: Record<string, number | string> = { week: `أسبوع ${week}` };
    for (const subj of subjects) {
      const wa = (data.weeklyAssessments[subj] || []).find((w) => w.week === week);
      if (wa) row[subj] = wa.score;
    }
    return row;
  });

  return (
    <div className="space-y-4">
      {/* Average donut */}
      {data.average && (
        <div className="card-accent flex items-center justify-between rounded-2xl glass-strong p-6">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">المعدل العام</p>
            <p className="mt-1 text-3xl font-black text-white">{data.average} <span className="text-base text-slate-500">/ 50</span></p>
          </div>
          <div className="relative flex h-16 w-16 items-center justify-center">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(201,169,106,0.1)" strokeWidth="5" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="#c9a96a" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(parseFloat(data.average) / 50) * 176} 176`} />
            </svg>
            <span className="absolute text-sm font-bold text-gold-400">{Math.round((parseFloat(data.average) / 50) * 100)}%</span>
          </div>
        </div>
      )}

      {/* Weekly assessments line chart toggle */}
      {subjects.length > 0 && (
        <div className="card-accent rounded-2xl glass-strong p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">التقديرات الأسبوعية</h3>
              <p className="mt-0.5 text-xs text-slate-500">اتجاه الدرجات على مدار الترم</p>
            </div>
            <button
              onClick={() => setShowChart((v) => !v)}
              className="rounded-lg border border-gold-500/15 bg-gold-500/[0.06] px-3 py-1.5 text-xs font-semibold text-gold-400 transition hover:bg-gold-500/10"
            >
              {showChart ? 'عرض الجدول' : 'عرض الرسم البياني'}
            </button>
          </div>

          {showChart ? (
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,169,106,0.08)" />
                  <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} stroke="rgba(201,169,106,0.15)" />
                  <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 11 }} stroke="rgba(201,169,106,0.15)" />
                  <Tooltip
                    contentStyle={{ background: 'rgba(10,15,28,0.95)', border: '1px solid rgba(201,169,106,0.2)', borderRadius: 12, color: '#fff', fontSize: 12 }}
                    labelStyle={{ color: '#c9a96a', fontWeight: 700 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                  {subjects.map((subj, i) => (
                    <Line key={subj} type="monotone" dataKey={subj} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            /* Weekly assessment table */
            <div className="overflow-x-auto" dir="ltr">
              <table className="w-full min-w-[600px] border-separate border-spacing-1 text-center text-xs">
                <thead>
                  <tr>
                    <th className="rounded-lg bg-ink-900/60 px-2 py-2 text-right text-gold-400">المادة</th>
                    {Array.from({ length: maxWeek }, (_, i) => (
                      <th key={i} className="rounded-lg bg-ink-900/60 px-2 py-2 text-slate-400">أ{i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subj, si) => (
                    <tr key={subj} style={{ animation: `tabRise 0.3s ease both`, animationDelay: `${si * 40}ms` }}>
                      <td className="rounded-lg border border-gold-500/10 bg-ink-900/40 px-2 py-2 text-right font-bold text-white">{subj}</td>
                      {Array.from({ length: maxWeek }, (_, i) => {
                        const wa = (data.weeklyAssessments[subj] || []).find((w) => w.week === i + 1);
                        return (
                          <td key={i} className="rounded-lg bg-white/[0.02] px-1 py-2 font-mono text-slate-300">
                            {wa ? wa.score.toFixed(1) : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Final grades list */}
      <div className="space-y-2.5">
        <h3 className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">الدرجات النهائية</h3>
        {data.grades.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">لا توجد درجات مسجلة</p>
        ) : (
          data.grades.map((g, i) => {
            const val = parseFloat(g.grade_value);
            const numVal = isNaN(val) ? 0 : val;
            const icon = SUBJECT_ICONS[g.subject_name] || '◉';
            return (
              <div key={g.subject_name} className="flex items-center gap-4 rounded-2xl glass p-4 transition hover:border-gold-500/20" style={{ animation: `tabRise 0.4s ease both`, animationDelay: `${i * 50}ms` }}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-500/15 bg-gold-500/[0.05] font-mono text-lg text-gold-400">{icon}</div>
                <div className="flex-1">
                  <p className="font-bold text-white">{g.subject_name}</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className={`animate-fill h-full rounded-full bg-gradient-to-r ${gradeBar(numVal)}`} style={{ width: `${(numVal / 50) * 100}%` }} />
                  </div>
                </div>
                <div className="text-left">
                  <span className={`text-xl font-black ${gradeColor(numVal)}`}>{g.grade_value}</span>
                  <span className="text-xs text-slate-600"> /50</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
