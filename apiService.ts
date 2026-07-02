import { API_BASE_URL, getStaffToken } from './config';

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

export const ACTION_TYPES = {
  LOGIN: 1,
  LOGOUT: 2,
  VIEW_PROFILE: 3,
  VIEW_GRADES: 4,
} as const;

// --- Generic request helper ---

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(
  endpoint: string,
  options: { method: 'GET' | 'POST'; body?: unknown; auth?: boolean } = { method: 'GET' },
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth) {
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
): Promise<{ message: string; student: StudentProfile }> {
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

export async function logAction(payload: {
  ssn_encrypted: string;
  grade_level: number;
  action_type: number;
}): Promise<{ message: string; total_inserted: number }> {
  return request('logAction', { method: 'POST', body: payload });
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

export interface PortalData {
  student: StudentProfile;
  grades: PortalGrade[];
  average: string | null;
  attendance: PortalAttendance[];
  attendanceStats: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
    percentage: number;
  };
  schedule: Record<string, PortalScheduleItem[]>;
  announcements: PortalAnnouncement[];
}

export async function getStudentPortal(
  ssn_encrypted: string,
  grade_level: number,
): Promise<PortalData> {
  const qs = `?ssn_encrypted=${encodeURIComponent(ssn_encrypted)}&grade_level=${grade_level}`;
  return request(`student/portal${qs}`, { method: 'GET' });
}
