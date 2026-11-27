export type AuthUser = { id: string; displayName: string; email: string };

export type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string };

export interface AuthService {
  login(email: string, password: string): Promise<AuthResult>;
  register(name: string, email: string, password: string): Promise<AuthResult>;
  recover(email: string): Promise<{ ok: true } | { ok: false; error: string }>;
  logout(): Promise<void>;
}

export const mockAuthService: AuthService = {
  async login(email, password) {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    if (!email.includes('@') || password.length < 6) {
      return { ok: false, error: 'Enter a valid email and a password of at least 6 characters.' };
    }
    return { ok: true, user: { id: 'mock-user-1', displayName: 'Alex Harper', email } };
  },
  async register(name, email, password) {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    if (!name.trim() || !email.includes('@') || password.length < 8) {
      return { ok: false, error: 'Complete all fields and use at least 8 password characters.' };
    }
    return { ok: true, user: { id: 'mock-user-1', displayName: name.trim(), email } };
  },
  async recover(email) {
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    return email.includes('@') ? { ok: true } : { ok: false, error: 'Enter a valid email address.' };
  },
  async logout() {},
};
