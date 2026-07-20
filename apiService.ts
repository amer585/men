import { API_BASE_URL, getStaffToken, getTeacherToken, getStudentToken } from './config';

// --- Types matching the backend contract ---

export interface StudentProfile {
  ssn_encrypted: string;
  grade_level: number;
  student_name_ar: string;
  school_name: string;
  class_name: string;
  admin_zone: string;
  gov_code: string;
  gender: string;
}

export interface StaffUser {
  name: string;
  teacher_name_ar: string;
  role: string;
  gov_code: string;
  admin_zone: string;
  school_name: string;
}

export interface School {
  school_name: string;
  admin_zone: string;
  gov_code: string;
}

export interface ClassInfo {
  class_name: string;
  grade_level: number;
  student_count: number;
}

export interface StudentGrade {
  subject_name: string;
  grade_value: string;
  teacher_id: number | null;
  updated_at: string | null;
}

export interface RosterStudent {
  ssn_encrypted: string;
  student_name_ar: string;
  gender: string;
  grades: StudentGrade[];
}

export interface AddStudentPayload {
  ssn_encrypted: string;
  student_name_ar: string;
  gender: string;
  gov_code: string;
  admin_zone: string;
  school_name: string;
  grade_level: number;
  class_name: string;
}

export interface District {
  district_name: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceEntry {
  ssn_encrypted: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string | null;
}

export interface TeacherClassAssignment {
  teacher_id: number;
  username: string | null;
  teacher_name: string | null;
  grade_level: number;
  class_name: string;
  subject_name: string;
}

export interface RegisterStaffPayload {
  username: string;
  password: string;
  role: string;
  teacher_name_ar?: string;
  gov_code?: string;
  admin_zone?: string;
  school_name?: string;
}

export interface AddTeacherPayload {
  username: string;
  password: string;
  teacher_name_ar?: string;
}

export const ACTION_TYPES = {
  LOGIN: 1,
  LOGOUT: 2,
  VIEW_PROFILE: 3,
  VIEW_GRADES: 4,
} as const;

// --- Generic request helper ---

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(
  endpoint: string,
  options: { method: 'GET' | 'POST' | 'PATCH' | 'DELETE'; body?: unknown; auth?: boolean | 'staff' | 'teacher' | 'student' } = { method: 'GET' },
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth === 'teacher') {
    const token = getTeacherToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } else if (options.auth === 'student') {
    const token = getStudentToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } else if (options.auth) {
    const token = getStaffToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: options.method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    // Network-level failure: server unreachable / refused connection / CORS.
    throw new ApiError(0, 'تعذّر الوصول إلى الخادم — تأكد أن الباك-إند يعمل على Hugging Face. (Server unreachable)');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, (data && (data.error || data.message)) || `HTTP ${res.status}`);
  }
  return data as T;
}

// --- Student endpoints ---

export async function studentLogin(
  ssn_encrypted: string,
  grade_level: number,
): Promise<{ message: string; student: StudentProfile; token: string }> {
  return request('studentLogin', { method: 'POST', body: { ssn_encrypted, grade_level } });
}

// --- Staff endpoints ---

export async function staffLogin(
  username: string,
  password: string,
): Promise<{ success: boolean; token: string; user: StaffUser }> {
  return request('login', { method: 'POST', body: { username, password } });
}

export async function getSchools(): Promise<{ schools: School[] }> {
  return request('hierarchy/schools', { method: 'GET', auth: true });
}

export async function getClasses(
  school_name: string,
  grade_level?: number,
): Promise<{ classes: ClassInfo[] }> {
  const qs = grade_level ? `?school_name=${encodeURIComponent(school_name)}&grade_level=${grade_level}` : `?school_name=${encodeURIComponent(school_name)}`;
  return request(`hierarchy/classes${qs}`, { method: 'GET', auth: true });
}

export async function getRoster(
  school_name: string,
  grade_level: number,
  class_name: string,
  subject_name?: string,
): Promise<{ students: RosterStudent[] }> {
  const params = new URLSearchParams({ school_name, grade_level: String(grade_level), class_name });
  if (subject_name) params.set('subject_name', subject_name);
  return request(`hierarchy/students?${params}`, { method: 'GET', auth: true });
}

export async function updateGrades(
  entries: Array<{ ssn_encrypted: string; grade_value: string }>,
  meta: { grade_level: number; class_name: string; subject_name: string },
): Promise<{ message: string; updated: number }> {
  return request('grades/update', {
    method: 'POST',
    auth: true,
    body: entries.map((e) => ({ ...e, ...meta })),
  });
}

export async function addStudent(payload: AddStudentPayload): Promise<{ message: string; affectedRows: number }> {
  return request('addStudent', { method: 'POST', auth: true, body: payload });
}

// --- Staff administration endpoints ---

export async function adminRegister(
  payload: RegisterStaffPayload,
): Promise<{ message: string; userId: number }> {
  return request('admin/register', { method: 'POST', body: payload });
}

export async function getDistricts(): Promise<{ districts: District[] }> {
  return request('hierarchy/districts', { method: 'GET', auth: true });
}

export async function updateAttendance(
  entries: AttendanceEntry[],
  meta: { grade_level: number },
): Promise<{ message: string; updated: number }> {
  // meta.grade_level is forwarded on every entry so the backend's write-through
  // cache can invalidate `portal:<ssn>:<grade_level>` (mirrors updateGrades).
  return request('attendance/update', {
    method: 'POST',
    auth: true,
    body: entries.map((e) => ({ ...e, grade_level: meta.grade_level })),
  });
}

export async function assignTeacherClass(
  payload: { teacher_id: number; grade_level: number; class_name: string; subject_name: string },
): Promise<{ message: string; teacher_id: number; grade_level: number; class_name: string; subject_name: string }> {
  return request('admin/teacher-classes', { method: 'POST', auth: true, body: payload });
}

export async function listTeacherClasses(
  teacherId?: number,
): Promise<{ assignments: TeacherClassAssignment[] }> {
  const qs = teacherId ? `?teacher_id=${teacherId}` : '';
  return request(`staff/teacher-classes${qs}`, { method: 'GET', auth: true });
}

export async function addTeacherStaff(
  payload: AddTeacherPayload,
): Promise<{ message: string; teacherId: number }> {
  return request('admin/add-teacher', { method: 'POST', auth: true, body: payload });
}

export async function getPendingTeachers(): Promise<{ pending: TeacherAccount[] }> {
  return request('teacher/pending', { method: 'GET', auth: true });
}

export async function verifyTeacher(
  id: string,
): Promise<{ message: string; id: string }> {
  return request(`teacher/verify/${encodeURIComponent(id)}`, { method: 'PATCH', auth: true });
}

export async function logAction(payload: {
  ssn_encrypted: string;
  grade_level: number;
  action_type: number;
}): Promise<{ message: string; total_inserted: number }> {
  // v5 — /logAction is now JWT-gated. Students send their own JWT (auth:'student').
  return request('logAction', { method: 'POST', auth: 'student', body: payload });
}

// --- Student portal (full dashboard data) ---

export interface PortalGrade {
  subject_name: string;
  grade_value: string;
  updated_at: string | null;
  teacher_id: number | null;
}

export interface PortalAttendance {
  date: string;
  status: string;
  note: string | null;
}

export interface PortalScheduleItem {
  period: number;
  start_time: string;
  end_time: string;
  subject_name: string;
  teacher_name: string | null;
}

export interface PortalAnnouncement {
  id: number;
  title: string;
  content: string;
  category: string;
  importance: string;
  created_at: string;
}

export interface WeeklyAssessment {
  week: number;
  score: number;
  max_score: number;
}

export interface PortalData {
  student: StudentProfile;
  grades: PortalGrade[];
  average: string | null;
  weeklyAssessments: Record<string, WeeklyAssessment[]>;
  attendance: PortalAttendance[];
  attendanceStats: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
    percentage: number;
  };
  absenceLimit: {
    used: number;
    limit: number;
    remaining: number;
  };
  schedule: Record<string, PortalScheduleItem[]>;
  announcements: PortalAnnouncement[];
}

export async function getStudentPortal(
  ssn_encrypted: string,
  grade_level: number,
): Promise<PortalData> {
  // v5 — the portal endpoint is now POST + JWT-gated (SSN out of URL/logs). For
  // student JWT callers the backend IGNORES the body and uses the JWT's ssn+grade
  // (anti-impersonation); the args here are kept for signature stability and for
  // the staff/teacher cross-check path (when wired).
  return request('student/portal', {
    method: 'POST',
    auth: 'student',
    body: { ssn_encrypted, grade_level },
  });
}

// --- Teacher account (email self-registration → admin approval → JWT) ---

export interface TeacherAccount {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LinkedStudent {
  student_id: string;
  student_name_ar: string | null;
  school_name: string | null;
  grade_level: number;
  class_name: string | null;
  linked_at: string;
}

export async function teacherRegister(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  subject?: string;
}): Promise<{ message: string; account: TeacherAccount }> {
  return request('teacher/register', { method: 'POST', body: payload });
}

export async function teacherLogin(
  email: string,
  password: string,
): Promise<{ success: boolean; token: string; account: TeacherAccount }> {
  return request('teacher/login', { method: 'POST', body: { email, password } });
}

export interface TeacherVerificationStatus {
  id: string;
  name: string;
  is_verified: boolean;
  status: 'pending' | 'approved';
  message: string;
}

/**
 * Poll the approval state of a registered teacher account. A pending teacher
 * cannot log in (the backend blocks with 403 BEFORE issuing a JWT), so this
 * credential-authenticated endpoint (email + password, no token) is the only
 * way to check whether the admin has approved the account yet.
 */
export async function checkTeacherVerification(
  email: string,
  password: string,
): Promise<TeacherVerificationStatus> {
  return request('teacher/verification-status', { method: 'POST', body: { email, password } });
}

export async function getTeacherProfile(): Promise<TeacherAccount> {
  return request('teacher/profile', { method: 'GET', auth: 'teacher' });
}

export async function updateTeacherProfile(payload: {
  name?: string;
  phone?: string;
  subject?: string;
}): Promise<{ message: string; account: TeacherAccount }> {
  return request('teacher/profile', { method: 'PATCH', auth: 'teacher', body: payload });
}

export async function getTeacherStudents(): Promise<{ teacher_id: string; students: LinkedStudent[]; cached?: boolean }> {
  return request('teacher/students', { method: 'GET', auth: 'teacher' });
}

export async function linkStudent(student_id: string): Promise<{ message: string; teacher_id: string; student_id: string }> {
  return request('teacher/students', { method: 'POST', auth: 'teacher', body: { student_id } });
}

export async function unlinkStudent(student_id: string): Promise<{ message: string; teacher_id: string; student_id: string }> {
  // Removes only the relation (teacher DB) — the student record itself stays
  // in the student DB. The backend busts the cached roster on this write.
  return request(`teacher/students/${encodeURIComponent(student_id)}`, { method: 'DELETE', auth: 'teacher' });
}
