import { API_BASE_URL } from './config';

// --- Types ---
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

export interface LogActionPayload {
  ssn_encrypted: string;
  grade_level: number;
  action_type: number;
  metadata?: Record<string, unknown>;
}

// Action type constants (match backend TINYINT mapping)
export const ACTION_TYPES = {
  LOGIN: 1,
  LOGOUT: 2,
  VIEW_PROFILE: 3,
  VIEW_GRADES: 4,
  VIEW_ATTENDANCE: 5,
  VIEW_SCHEDULE: 6,
  TEACHER_LOGIN: 10,
  TEACHER_GRADE_ENTRY: 11,
  TEACHER_ATTENDANCE_ENTRY: 12,
} as const;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// --- Helper ---
async function request<T>(
  endpoint: string,
  method: 'POST',
  body: Record<string, unknown>
): Promise<ApiResponse<T>> {
  try {
    const apiBaseUrl = API_BASE_URL.replace(/\/$/, '');
    const res = await fetch(`${apiBaseUrl}/${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || `HTTP ${res.status}` };
    }
    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    console.error(`[API] ${endpoint} failed:`, message);
    return { success: false, error: message };
  }
}

// --- Endpoints ---

/** Add / update a student record */
export async function addStudent(payload: AddStudentPayload): Promise<ApiResponse> {
  return request('addStudent', 'POST', payload as unknown as Record<string, unknown>);
}

/** Login: fetch student profile by SSN + grade */
export async function studentLogin(ssn_encrypted: string, grade_level: number): Promise<ApiResponse<{ student: StudentProfile }>> {
  return request('studentLogin', 'POST', { ssn_encrypted, grade_level });
}

/** Log a single action */
export async function logAction(payload: LogActionPayload): Promise<ApiResponse> {
  return request('logAction', 'POST', payload as unknown as Record<string, unknown>);
}

/** Log multiple actions in one batch (saves ~10x RUs) */
export async function logActionBatch(actions: LogActionPayload[]): Promise<ApiResponse> {
  return request('logAction', 'POST', { actions } as unknown as Record<string, unknown>);
}
