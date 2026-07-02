// API base URL. Defaults to a RELATIVE path ("/api") so the frontend works when
// served from the backend on the same origin (no CORS issues). Override with
// VITE_API_BASE_URL only when running the frontend on a separate host.
const configured = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL =
  configured && configured.length > 0
    ? configured.replace(/\/$/, '')
    : '/api';

const TOKEN_KEY = 'intlaqa_staff_token';

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
