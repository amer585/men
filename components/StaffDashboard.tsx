import { useState } from 'react';
import type { StaffUser } from '../apiService';
import { Logo } from './Logo';
import { AddStudent } from './AddStudent';
import { RosterEditor } from './RosterEditor';
import { AttendanceEditor } from './AttendanceEditor';
import { TeacherClassAssigner } from './TeacherClassAssigner';
import { TeacherApprovalQueue } from './TeacherApprovalQueue';
import { AddTeacherStaff } from './AddTeacherStaff';

interface Props {
  user: StaffUser;
  onLogout: () => void;
}

type TabId = 'overview' | 'students' | 'grades' | 'attendance' | 'assign' | 'approve' | 'addteacher';

const ROLE_LABELS: Record<string, string> = {
  admin: 'مدير عام',
  principal: 'مدير مدرسة',
  directorate: 'إدارة تعليمية',
  directorate_manager: 'مدير إدارة تعليمية',
  district: 'حي/منطقة',
  district_manager: 'مدير حي/منطقة',
  teacher: 'معلّم',
};

function norm(role: string | undefined): string {
  return String(role || '').trim().toLowerCase();
}

/** Roles that may approve pending teacher accounts (mirrors backend APPROVAL_ROLES). */
function canApprove(role: string): boolean {
  const r = norm(role);
  return (
    r === 'admin' ||
    r === 'principal' ||
    r === 'directorate' ||
    r === 'directorate_manager' ||
    r === 'district' ||
    r === 'district_manager'
  );
}

/** Roles that may assign teacher→class scope (mirrors backend assignTeacherClass). */
function canAssignClass(role: string): boolean {
  const r = norm(role);
  return r === 'admin' || r === 'principal' || r.includes('manager') || r === 'directorate' || r === 'district';
}

/** Only principals may add a teacher (scoped to their own school). */
function canAddTeacherStaff(role: string): boolean {
  return norm(role) === 'principal';
}

/** Whether to show the AddStudent form. Teachers edit grades/attendance only. */
function canEnrollStudent(role: string): boolean {
  return norm(role) !== 'teacher';
}

export function StaffDashboard({ user, onLogout }: Props) {
  const role = norm(user.role);
  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'نظرة عامة' },
  ];
  if (canEnrollStudent(role)) tabs.push({ id: 'students', label: 'إضافة طالب' });
  tabs.push({ id: 'grades', label: 'الدرجات' });
  tabs.push({ id: 'attendance', label: 'الحضور' });
  if (canAssignClass(role)) tabs.push({ id: 'assign', label: 'تكليف المعلّمين' });
  if (canApprove(role)) tabs.push({ id: 'approve', label: 'اعتماد المعلّمين' });
  if (canAddTeacherStaff(role)) tabs.push({ id: 'addteacher', label: 'إضافة معلّم' });

  const [tab, setTab] = useState<TabId>('overview');

  const defaults = {
    gov_code: user.gov_code ?? undefined,
    admin_zone: user.admin_zone && user.admin_zone !== 'ALL' ? user.admin_zone : undefined,
    school_name: user.school_name && user.school_name !== 'ALL' ? user.school_name : undefined,
  };

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
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-500/70">بوابة الإدارة</p>
            <h1 className="mt-1.5 text-[clamp(1.5rem,4vw,2rem)] font-black tracking-tight text-white">
              {user.teacher_name_ar || user.name || user.role}
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              {ROLE_LABELS[role] ?? user.role}
              {user.school_name && user.school_name !== 'ALL' ? ` · ${user.school_name}` : ''}
              {user.admin_zone && user.admin_zone !== 'ALL' ? ` · ${user.admin_zone}` : ''}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-xl border border-rose-400/15 bg-rose-500/5 px-5 py-2.5 text-sm font-semibold text-rose-300/90 transition hover:bg-rose-500/15"
          >
            خروج
          </button>
        </div>
      </section>

      {/* Floating tab bar */}
      <div className="sticky top-[64px] z-20 flex justify-center py-3">
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-gold-500/15 bg-ink-900/70 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
                  active ? 'text-ink-950' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {active && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 shadow-lg shadow-gold-500/25" />
                )}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div key={tab} className="animate-tab-rise">
        {tab === 'overview' && (
          <div className="rounded-3xl border border-gold-500/10 bg-white/[0.02] p-6 md:p-8">
            <h2 className="mb-1 text-lg font-bold text-white">مرحبًا بك في بوابة الإدارة 👋</h2>
            <p className="mb-5 text-sm text-slate-400">
              استخدم التبويبات أعلاه للوصول إلى الأدوات المتاحة لك وفق صلاحيات دورك.
            </p>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="flex justify-between rounded-xl border border-gold-500/10 bg-ink-900/40 px-4 py-3 text-sm">
                <dt className="text-slate-400">الدور</dt>
                <dd className="text-slate-200">{ROLE_LABELS[role] ?? user.role}</dd>
              </div>
              <div className="flex justify-between rounded-xl border border-gold-500/10 bg-ink-900/40 px-4 py-3 text-sm">
                <dt className="text-slate-400">المدرسة</dt>
                <dd className="text-slate-200">{user.school_name || '—'}</dd>
              </div>
              <div className="flex justify-between rounded-xl border border-gold-500/10 bg-ink-900/40 px-4 py-3 text-sm">
                <dt className="text-slate-400">الإدارة التعليمية</dt>
                <dd className="text-slate-200">{user.admin_zone || '—'}</dd>
              </div>
              <div className="flex justify-between rounded-xl border border-gold-500/10 bg-ink-900/40 px-4 py-3 text-sm">
                <dt className="text-slate-400">كود المحافظة</dt>
                <dd className="text-slate-200" dir="ltr">{user.gov_code || '—'}</dd>
              </div>
            </dl>
            {role === 'teacher' && (
              <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-500/[0.07] px-4 py-3 text-sm text-amber-200">
                حسابك بدور «معلّم» — يمكنك تسجيل الدرجات والحضور للفصول والمواد المُكلّف بها فقط.
              </div>
            )}
          </div>
        )}

        {tab === 'students' && (
          <div className="rounded-3xl border border-gold-500/10 bg-white/[0.02] p-5 md:p-6">
            <h2 className="mb-4 text-lg font-bold text-white">إضافة طالب جديد</h2>
            <AddStudent defaults={defaults} />
          </div>
        )}

        {tab === 'grades' && <RosterEditor />}

        {tab === 'attendance' && <AttendanceEditor />}

        {tab === 'assign' && <TeacherClassAssigner />}

        {tab === 'approve' && <TeacherApprovalQueue />}

        {tab === 'addteacher' && <AddTeacherStaff />}
      </div>
    </div>
  );
}
