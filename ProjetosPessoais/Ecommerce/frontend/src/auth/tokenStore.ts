// Demo token store backed by localStorage.
// DEMO-ONLY: storing a JWT in localStorage exposes it to XSS. Acceptable here
// because the token is a passwordless demo mint with no real identity/PII.
// A production build would move to an httpOnly cookie + a real IdP.

const TOKEN_KEY = "crys.token";
const SUBJECT_KEY = "crys.subject";

type Listener = () => void;
const listeners = new Set<Listener>();

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getSubject(): string | null {
  return localStorage.getItem(SUBJECT_KEY);
}

export function setToken(token: string, subject: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SUBJECT_KEY, subject);
  notify();
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SUBJECT_KEY);
  notify();
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/** Subscribe to token changes (login/logout/401-clear). Returns an unsubscribe. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(): void {
  listeners.forEach((l) => l());
}
