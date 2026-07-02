// API base URL — points at the Hugging Face Space by default.
// Override locally with a .env file: VITE_API_BASE_URL=http://localhost:7860/api
const configured = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL =
  configured && configured.length > 0
    ? configured.replace(/\/$/, '')
    : 'https://amer21-mcp.hf.space/api';

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
