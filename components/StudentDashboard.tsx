import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  LayoutGrid,
  LogOut,
  MapPin,
  Megaphone,
  NotebookPen,
  School,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import type { AttendanceRecord, MonthlyExam, StudentData } from '../App';
import { SUBJECTS } from '../App';

interface StudentDashboardProps {
  student: StudentData;
  onLogout: () => void;
}

const getArabicDateLabel = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const calculatePercentage = (score: number, maxScore: number) => {
  if (!maxScore) {
    return 0;
  }

  return Math.round((score / maxScore) * 100);
};

const isRecent = (dateString: string) => {
  const targetDate = new Date(dateString);
  const today = new Date();
  const timeDifference = Math.abs(today.getTime() - targetDate.getTime());
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) <= 5;
};

const StatusPill = ({ status }: { status: AttendanceRecord['status'] | MonthlyExam['status'] }) => {
  if (status === 'present') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
        <CheckCircle2 className="h-3.5 w-3.5" />
        حاضر
      </span>
    );
  }

  if (status === 'late') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
        <Clock3 className="h-3.5 w-3.5" />
        تأخير
      </span>
    );
  }

  if (status === 'excused') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
        <NotebookPen className="h-3.5 w-3.5" />
        بعذر
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300">
      <AlertTriangle className="h-3.5 w-3.5" />
      غياب
    </span>
  );
};

const ScoreRow = ({
  title,
  date,
  score,
  maxScore,
  status,
  note,
}: {
  title: string;
  date?: string;
  score: number;
  maxScore: number;
  status: MonthlyExam['status'] | 'late';
  note?: string;
}) => (
  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-sm font-bold text-slate-800 dark:text-white">{title}</div>
        {date && <div className="mt-1 font-mono text-[11px] text-slate-400 dark:text-slate-500">{getArabicDateLabel(date)}</div>}
      </div>
      <StatusPill status={status} />
    </div>

    <div className="mt-4 flex items-end justify-between">
      <div className="text-3xl font-black text-slate-900 dark:text-white">
        {status === 'present' || status === 'late' ? score : 0}
        <span className="mr-1 text-sm font-bold text-slate-400">/{maxScore}</span>
      </div>
      <div className="text-xs font-bold text-slate-400 dark:text-slate-500">
        {status === 'present' || status === 'late' ? `${calculatePercentage(score, maxScore)}%` : 'لا توجد درجة'}
      </div>
    </div>

    {note && <div className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">{note}</div>}
  </div>
);

const EmptyState = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 py-16 text-slate-300 dark:border-slate-800 dark:bg-slate-900/50">
    <div className="mb-4 rounded-full bg-white p-4 opacity-60 shadow-sm dark:bg-slate-800">{icon}</div>
    <p className="text-sm font-bold text-slate-400 dark:text-slate-500">{text}</p>
  </div>
);

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'attendance' | 'analytics' | 'schedule' | 'announcements'>('subjects');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(SUBJECTS[0]);

  const teacherMap = useMemo(() => {
    const entries = new Map<string, { teacher: string; room: string }>();

    student.schedule.forEach((day) => {
      day.periods.forEach((period) => {
        if (!entries.has(period.subject)) {
          entries.set(period.subject, { teacher: period.teacher, room: period.room });
        }
      });
    });

    return entries;
  }, [student.schedule]);

  const subjectSummaries = useMemo(
    () =>
      SUBJECTS.map((subject) => {
        const weeklyAssessments = student.weeklyAssessments.filter((assessment) => assessment.subject === subject);
        const monthlyExams = student.monthlyExams.filter((exam) => exam.subject === subject);
        const totalScore =
          weeklyAssessments
            .filter((assessment) => assessment.status === 'present')
            .reduce((sum, assessment) => sum + assessment.score, 0) +
          monthlyExams.filter((exam) => exam.status === 'present').reduce((sum, exam) => sum + exam.score, 0);
        const totalMax =
          weeklyAssessments.reduce((sum, assessment) => sum + assessment.maxScore, 0) +
          monthlyExams.reduce((sum, exam) => sum + exam.maxScore, 0);

        return {
          subject,
          weeklyAssessments,
          monthlyExams,
          percentage: totalMax ? Math.round((totalScore / totalMax) * 100) : 0,
          teacher: teacherMap.get(subject)?.teacher || 'لم يحدد المعلم',
          room: teacherMap.get(subject)?.room || 'غير محدد',
        };
      }).filter((summary) => summary.weeklyAssessments.length || summary.monthlyExams.length),
    [student.monthlyExams, student.weeklyAssessments, teacherMap],
  );

  const rankedSubjects = useMemo(
    () => [...subjectSummaries].sort((left, right) => right.percentage - left.percentage),
    [subjectSummaries],
  );

  const weeklyTrend = useMemo(() => {
    const groupedWeeks = new Map<string, { label: string; date?: string; total: number; max: number }>();

    student.weeklyAssessments.forEach((assessment) => {
      if (!groupedWeeks.has(assessment.title)) {
        groupedWeeks.set(assessment.title, {
          label: assessment.title.replace('التقييم الأسبوعي ', 'أسبوع '),
          date: assessment.date,
          total: 0,
          max: 0,
        });
      }

      const currentWeek = groupedWeeks.get(assessment.title)!;

      if (assessment.status === 'present') {
        currentWeek.total += assessment.score;
      }

      currentWeek.max += assessment.maxScore;
    });

    return [...groupedWeeks.values()]
      .sort((left, right) => (left.date || '').localeCompare(right.date || ''))
      .map((week) => ({
        ...week,
        percentage: week.max ? Math.round((week.total / week.max) * 100) : 0,
      }));
  }, [student.weeklyAssessments]);

  const stats = useMemo(() => {
    const maximumAllowedAbsence = 30;
    const absentCount = student.attendanceRecords.filter((record) => record.status === 'absent').length;
    const lateCount = student.attendanceRecords.filter((record) => record.status === 'late').length;
    const excusedCount = student.attendanceRecords.filter((record) => record.status === 'excused').length;
    const presentCount = student.attendanceRecords.filter((record) => record.status === 'present').length;
    const remainingDays = Math.max(0, maximumAllowedAbsence - absentCount);
    const absencePercentage = Math.min(100, Math.round((absentCount / maximumAllowedAbsence) * 100));
    const weeklyAverage = student.weeklyAssessments.length
      ? Math.round(
          student.weeklyAssessments
            .filter((assessment) => assessment.status === 'present')
            .reduce((sum, assessment) => sum + calculatePercentage(assessment.score, assessment.maxScore), 0) /
            Math.max(1, student.weeklyAssessments.filter((assessment) => assessment.status === 'present').length),
        )
      : 0;
    const monthlyAverage = student.monthlyExams.length
      ? Math.round(
          student.monthlyExams
            .filter((exam) => exam.status === 'present')
            .reduce((sum, exam) => sum + calculatePercentage(exam.score, exam.maxScore), 0) /
            Math.max(1, student.monthlyExams.filter((exam) => exam.status === 'present').length),
        )
      : 0;

    return {
      maximumAllowedAbsence,
      absentCount,
      lateCount,
      excusedCount,
      presentCount,
      remainingDays,
      absencePercentage,
      weeklyAverage,
      monthlyAverage,
      overallAverage: Math.round((weeklyAverage + monthlyAverage) / 2),
      riskLevel: remainingDays <= 5 ? 'critical' : remainingDays <= 10 ? 'warning' : 'safe',
    };
  }, [student.attendanceRecords, student.monthlyExams, student.weeklyAssessments]);

  const achievements = useMemo(() => {
    const items = [];

    if (stats.absentCount <= 2) {
      items.push({ icon: ShieldCheck, title: 'انضباط جيد', description: 'سجل حضور مطمئن خلال آخر 30 يوماً' });
    }

    if (rankedSubjects[0] && rankedSubjects[0].percentage >= 90) {
      items.push({
        icon: Trophy,
        title: `تفوق في ${rankedSubjects[0].subject}`,
        description: `متوسط ${rankedSubjects[0].percentage}% في المادة الأقوى حالياً`,
      });
    }

    if (stats.overallAverage >= 85) {
      items.push({
        icon: Sparkles,
        title: 'معدل مرتفع',
        description: 'الطالب يحافظ على مستوى جيد في التقييمات والاختبارات',
      });
    }

    return items;
  }, [rankedSubjects, stats.absentCount, stats.overallAverage]);

  const relevantAnnouncements = student.announcements.filter(
    (announcement) => announcement.targetGrade === 'الكل' || announcement.targetGrade === student.grade,
  );
  const initiativeAnnouncement = relevantAnnouncements.find((announcement) => announcement.title.includes('انطلاقة رقمية'));
  const regularAnnouncements = relevantAnnouncements.filter((announcement) => announcement.id !== initiativeAnnouncement?.id);
  const periodHeaders = student.schedule[0]?.periods.map((period) => period.time) || [];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none md:p-10">
        <div className="absolute right-0 top-0 h-[420px] w-[420px] translate-x-1/4 -translate-y-1/4 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 blur-3xl dark:from-blue-900/30 dark:to-cyan-900/20" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-5">
            <div className="flex items-start gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-slate-900 text-4xl font-black text-white shadow-xl dark:bg-slate-800">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
                  <School className="h-4 w-4" />
                  بيانات الطالب المعتمدة
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">{student.name}</h1>
                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {student.grade} • {student.class_name ? `فصل ${student.class_name}` : 'الفصل غير محدد'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {student.school_name || 'اسم المدرسة غير متوفر'}
              </span>
              {student.admin_zone && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  إدارة {student.admin_zone}
                </span>
              )}
              {student.gov_code && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  محافظة {student.gov_code}
                </span>
              )}
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-mono text-[11px] font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
                الرقم القومي: {student.id}
              </span>
            </div>

            {achievements.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {achievements.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70"
                  >
                    <div className="rounded-2xl bg-slate-900 p-2 text-white dark:bg-blue-500">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-white">{item.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:w-[360px]">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                المتوسط العام
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.overallAverage}%</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">محصلة التقييمات والامتحانات الشهرية</div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                الحضور
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.presentCount}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">يوم حضور مثبت في آخر 30 يوماً</div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                المواد المعروضة
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{subjectSummaries.length}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">مواد فعلية بالدرجات والتوقيتات</div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Bell className="h-4 w-4 text-amber-500" />
                الإشعارات
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{relevantAnnouncements.length}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">إعلانات المدرسة والمبادرات الحالية</div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-[5.25rem] z-30 -mx-4 px-4 py-2">
        <div className="mx-auto w-max max-w-full overflow-x-auto rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-1.5 shadow-lg shadow-slate-200/50 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-none">
          <div className="flex min-w-fit gap-1">
            {([
              { key: 'subjects', label: 'المواد الدراسية', icon: BookOpen },
              { key: 'attendance', label: 'سجل الحضور', icon: Clock3 },
              { key: 'analytics', label: 'تحليل الأداء', icon: BarChart3 },
              { key: 'schedule', label: 'الجدول الدراسي', icon: LayoutGrid },
              { key: 'announcements', label: 'الإعلانات', icon: Megaphone },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-slate-900 text-white shadow-md dark:bg-blue-500'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[420px]">
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500">متوسط التقييمات الأسبوعية</div>
                <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{stats.weeklyAverage}%</div>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500">متوسط الامتحانات الشهرية</div>
                <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{stats.monthlyAverage}%</div>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500">إجمالي السجلات الدراسية</div>
                <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {student.weeklyAssessments.length + student.monthlyExams.length}
                </div>
              </div>
            </div>

            {subjectSummaries.map((summary) => {
              const isExpanded = expandedSubject === summary.subject;

              return (
                <div
                  key={summary.subject}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <button
                    onClick={() => setExpandedSubject(isExpanded ? null : summary.subject)}
                    className="flex w-full items-center justify-between gap-4 p-6 text-right transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black text-white ${
                          summary.percentage >= 85
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-400'
                            : summary.percentage >= 70
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-400'
                              : summary.percentage >= 50
                                ? 'bg-gradient-to-br from-amber-500 to-orange-400'
                                : 'bg-gradient-to-br from-rose-500 to-red-400'
                        }`}
                      >
                        {summary.percentage}%
                      </div>
                      <div>
                        <div className="text-xl font-black text-slate-900 dark:text-white">{summary.subject}</div>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <span>{summary.teacher}</span>
                          <span>•</span>
                          <span>{summary.room}</span>
                          <span>•</span>
                          <span>{summary.weeklyAssessments.length} تقييمات أسبوعية</span>
                          <span>•</span>
                          <span>{summary.monthlyExams.length} امتحانات شهرية</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-100 p-2 text-slate-400 dark:bg-slate-800">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="grid gap-6 border-t border-slate-100 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/60 lg:grid-cols-2">
                      <div>
                        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                          <Calendar className="h-4 w-4 text-violet-500" />
                          التقييمات الأسبوعية
                        </div>
                        <div className="space-y-3">
                          {summary.weeklyAssessments.map((assessment) => (
                            <div key={assessment.id}>
                              <ScoreRow
                                title={assessment.title}
                                date={assessment.date}
                                score={assessment.score}
                                maxScore={assessment.maxScore}
                                status={assessment.status}
                                note={assessment.note}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                          <NotebookPen className="h-4 w-4 text-blue-500" />
                          الامتحانات الشهرية
                        </div>
                        <div className="space-y-3">
                          {summary.monthlyExams.map((exam) => (
                            <div key={exam.id}>
                              <ScoreRow
                                title={exam.title || 'امتحان شهري'}
                                date={exam.date}
                                score={exam.score}
                                maxScore={exam.maxScore}
                                status={exam.status}
                                note={exam.note}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500">أيام الحضور</div>
                <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{stats.presentCount}</div>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500">أيام الغياب</div>
                <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{stats.absentCount}</div>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500">التأخير والأعذار</div>
                <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{stats.lateCount + stats.excusedCount}</div>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500">الأيام المتبقية</div>
                <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{stats.remainingDays}</div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-2xl p-4 ${
                      stats.riskLevel === 'safe'
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : stats.riskLevel === 'warning'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300'
                    }`}
                  >
                    {stats.riskLevel === 'safe' ? <ShieldCheck className="h-8 w-8" /> : <ShieldAlert className="h-8 w-8" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">رصيد الغياب المسموح</h3>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                      يتم عرض آخر 30 يوم دراسي بالتفصيل، مع متابعة الحد الأقصى المسموح به للغياب حتى تكون صورة الالتزام
                      واضحة للطالب وولي الأمر.
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-md space-y-3">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-500 dark:text-slate-400">
                    <span>المستخدم من الحد الأقصى</span>
                    <span>{stats.absentCount} / {stats.maximumAllowedAbsence} يوم</span>
                  </div>
                  <div className="relative h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        stats.riskLevel === 'safe'
                          ? 'bg-emerald-500'
                          : stats.riskLevel === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                      }`}
                      style={{ width: `${stats.absencePercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 dark:text-slate-500">
                    <span>0 يوم</span>
                    <span>{stats.remainingDays} يوم متبقٍ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="text-lg font-bold text-slate-900 dark:text-white">سجل آخر 30 يوماً دراسياً</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">اليوم، التاريخ، الحالة، وأول حصة مجدولة</div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {student.attendanceRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="text-sm font-bold text-slate-800 dark:text-white">{record.dayName}</div>
                        <div className="mt-1 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                          {getArabicDateLabel(record.date)}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-bold text-slate-800 dark:text-white">{record.lessonName || 'اليوم الدراسي الكامل'}</div>
                        {record.note && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{record.note}</div>}
                        {record.lateTime && (
                          <div className="mt-1 text-xs font-bold text-orange-600 dark:text-orange-400">وقت الحضور: {record.lateTime}</div>
                        )}
                      </div>
                    </div>

                    <StatusPill status={record.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">تطور الأداء الأسبوعي</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">متوسط جميع المواد في كل تقييم أسبوعي حديث</p>
                </div>

                {weeklyTrend.length > 0 ? (
                  <div className="flex h-64 items-end justify-between gap-3">
                    {weeklyTrend.map((week) => (
                      <div key={week.label} className="flex flex-1 flex-col items-center gap-3">
                        <div className="flex h-48 w-full items-end overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800">
                          <div
                            className="relative w-full rounded-t-2xl bg-gradient-to-t from-blue-500 to-cyan-400"
                            style={{ height: `${Math.max(week.percentage, 8)}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">
                              {week.percentage}%
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{week.label}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<BarChart3 className="h-10 w-10 text-slate-300 dark:text-slate-600" />} text="لا توجد بيانات تحليلية حالياً" />
                )}
              </div>

              <div className="grid gap-6">
                <div className="rounded-[2rem] bg-gradient-to-br from-indigo-500 to-blue-600 p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-100">أفضل مادة حالياً</div>
                  <div className="mt-3 text-3xl font-black">{rankedSubjects[0]?.subject || 'غير متاح'}</div>
                  <div className="mt-2 text-sm text-indigo-100">
                    {rankedSubjects[0] ? `${rankedSubjects[0].percentage}% مع ${rankedSubjects[0].teacher}` : 'سيظهر هنا أفضل أداء بعد توفر البيانات'}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500">المادة التي تحتاج دعماً</div>
                  <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{rankedSubjects.at(-1)?.subject || 'غير متاح'}</div>
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {rankedSubjects.at(-1) ? `المتوسط الحالي ${rankedSubjects.at(-1)!.percentage}%` : 'جميع المواد مستقرة'}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500">إجمالي التقييمات والاختبارات</div>
                  <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                    {student.weeklyAssessments.length + student.monthlyExams.length}
                  </div>
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">سجل كامل موزع على المواد الأساسية والأنشطة</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-800/40">
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                <CalendarClock className="h-5 w-5 text-blue-500" />
                الجدول الدراسي الأسبوعي بتوقيت الحصص
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                تم إضافة توقيت كل حصة واسم المعلم والقاعـة حتى لا تبقى الصفحة فارغة أو عامة.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-right">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                    <th className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">اليوم</th>
                    {periodHeaders.slice(0, 2).map((time) => (
                      <th key={time} className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                        {time}
                      </th>
                    ))}
                    <th className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                      الفسحة
                      <div className="mt-1 text-[10px] normal-case text-slate-400 dark:text-slate-500">{student.schedule[0]?.breakTime}</div>
                    </th>
                    {periodHeaders.slice(2).map((time) => (
                      <th key={time} className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                        {time}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {student.schedule.map((day) => (
                    <tr key={day.day} className="align-top transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-5 font-black text-slate-900 dark:text-white">{day.day}</td>
                      {day.periods.slice(0, 2).map((period) => (
                        <td key={period.id} className="px-5 py-5">
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{period.subject}</div>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{period.teacher}</div>
                          <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{period.room}</div>
                        </td>
                      ))}
                      <td className="px-5 py-5 text-center">
                        <div className="rounded-2xl bg-slate-50 px-4 py-5 text-xs font-bold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                          فسحة
                        </div>
                      </td>
                      {day.periods.slice(2).map((period) => (
                        <td key={period.id} className="px-5 py-5">
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{period.subject}</div>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{period.teacher}</div>
                          <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{period.room}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-5">
            {initiativeAnnouncement && (
              <div className="relative overflow-hidden rounded-[2rem] border border-blue-200 bg-gradient-to-l from-blue-600 via-cyan-500 to-emerald-400 p-6 text-white shadow-lg shadow-cyan-200 dark:border-blue-900 dark:shadow-none">
                <div className="absolute left-0 top-0 h-32 w-32 -translate-x-1/3 -translate-y-1/3 rounded-full bg-white/15" />
                <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                      <Sparkles className="h-4 w-4" />
                      إشعار خاص
                    </div>
                    <h3 className="mt-3 text-2xl font-black">{initiativeAnnouncement.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-50">{initiativeAnnouncement.content}</p>
                  </div>

                  <div className="rounded-[1.75rem] bg-white/15 p-5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <MapPin className="h-4 w-4" />
                      معمل الحاسب - يوم الثلاثاء
                    </div>
                    <div className="mt-2 text-xs text-blue-50">بعد انتهاء اليوم الدراسي مباشرة ولمدة 90 دقيقة</div>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-[1.75rem] border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <Megaphone className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-300" />
                <div>
                  <h3 className="font-bold text-blue-900 dark:text-blue-200">لوحة الإعلانات المدرسية</h3>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    جميع الإعلانات الظاهرة هنا مرتبطة بصف الطالب أو موجّهة لكل الطلاب داخل المدرسة.
                  </p>
                </div>
              </div>
            </div>

            {regularAnnouncements.length > 0 ? (
              regularAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  {announcement.importance === 'high' && <div className="absolute right-0 top-0 h-full w-1.5 bg-rose-500" />}

                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">{announcement.title}</h3>
                        {isRecent(announcement.date) && (
                          <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">جديد</span>
                        )}
                        {announcement.importance === 'high' && (
                          <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600 dark:bg-rose-900/20 dark:text-rose-300">
                            مهم
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{announcement.content}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-800">
                      <div className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                        {getArabicDateLabel(announcement.date)}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{announcement.author}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState icon={<Bell className="h-10 w-10 text-slate-300 dark:text-slate-600" />} text="لا توجد إعلانات مرتبطة بهذا الصف حالياً" />
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold text-slate-400 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:border-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          تسجيل خروج
        </button>
      </div>
    </div>
  );
};
