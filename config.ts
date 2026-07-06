// API base URL — bulletproof across hosting setups.
//
// The backend lives at the Hugging Face Space. If the frontend is served FROM
// the backend (same origin), we use a relative "/api" path. If it's hosted
// somewhere else (e.g. Cloudflare Pages), we MUST point at the absolute backend
// URL — otherwise fetch hits the static host, which returns 405.
//
// Priority:
//   1. VITE_API_BASE_URL (explicit override, e.g. for local dev)
//   2. same-origin relative "/api" (frontend served by the backend)
//   3. absolute backend URL (frontend hosted elsewhere)

const BACKEND_ORIGIN = 'https://amer585-intlaqa-backend.hf.space';

const configured = (import.meta as any).env.VITE_API_BASE_URL?.trim();

function resolveApiBaseUrl(): string {
  // 1. Explicit override wins (e.g. local dev via .env.local).
  if (configured && configured.length > 0) {
    return configured.replace(/\/$/, '');
  }
  // 2. Same-origin (frontend served BY the backend, e.g. HF Space full-stack) → relative path.
  if (typeof window !== 'undefined' && window.location && window.location.origin === BACKEND_ORIGIN) {
    return '/api';
  }
  // 3. Cross-origin (frontend hosted elsewhere — Cloudflare/Vercel/Netlify) → absolute URL.
  //    Without this, fetch hits the static host and 405s.
  return `${BACKEND_ORIGIN}/api`;
}

export const API_BASE_URL = resolveApiBaseUrl();

const TOKEN_KEY = 'intlaqa_staff_token';
const TEACHER_TOKEN_KEY = 'intlaqa_teacher_token';

export function getStaffToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStaffToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearStaffToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

// --- Teacher-account (email self-registration) session token ---
export function getTeacherToken(): string | null {
  try {
    return localStorage.getItem(TEACHER_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setTeacherToken(token: string): void {
  try {
    localStorage.setItem(TEACHER_TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearTeacherToken(): void {
  try {
    localStorage.removeItem(TEACHER_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

// --- Student session token (issued by POST /api/studentLogin; sent as Bearer
// on POST /api/student/portal + /api/logAction, both JWT-gated as of v5) ---
const STUDENT_TOKEN_KEY = 'intlaqa_student_token';

export function getStudentToken(): string | null {
  try {
    return localStorage.getItem(STUDENT_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStudentToken(token: string): void {
  try {
    localStorage.setItem(STUDENT_TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearStudentToken(): void {
  try {
    localStorage.removeItem(STUDENT_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}
