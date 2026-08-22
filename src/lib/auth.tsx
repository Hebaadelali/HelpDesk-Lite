import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useStaff } from "./staff";
import type { StaffMember } from "./types";

const USERS_KEY = "helpdesk-lite-auth-users";
const SESSION_KEY = "helpdesk-lite-auth-session";

type StoredUser = { email: string; name: string; passwordHash: string; staffId: string };
type SessionUser = { email: string; name: string; staffId: string };

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthApi = {
  user: SessionUser | null;
  staff: StaffMember | null;
  ready: boolean;
  login: (email: string, password: string) => AuthResult;
  signup: (input: { name: string; email: string; password: string; role: string }) => AuthResult;
  logout: () => void;
};

const AuthContext = createContext<AuthApi | null>(null);

/**
 * NOTE: This app has no backend — accounts live in the browser's localStorage.
 * This hash keeps plaintext passwords out of storage for the demo, but it is
 * NOT cryptographically secure. Wire this up to a real auth service (with
 * proper password hashing, e.g. bcrypt/argon2 on a server) before shipping.
 */
function hash(value: string): string {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (Math.imul(31, h) + value.charCodeAt(i)) | 0;
  }
  return `h${(h >>> 0).toString(36)}_${value.length}`;
}

function readUsers(): StoredUser[] {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* storage unavailable */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const { staffById, addStaffMember } = useStaff();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      /* ignore malformed session */
    }
    setReady(true);
  }, []);

  const persistSession = (session: SessionUser) => {
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* storage unavailable */
    }
    setUser(session);
  };

  const login: AuthApi["login"] = (email, password) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !password) return { ok: false, error: "Enter your email and password." };
    const found = readUsers().find((u) => u.email.toLowerCase() === normalized);
    if (!found) return { ok: false, error: "No account found with that email." };
    if (found.passwordHash !== hash(password)) return { ok: false, error: "Incorrect password." };
    persistSession({ email: found.email, name: found.name, staffId: found.staffId });
    return { ok: true };
  };

  const signup: AuthApi["signup"] = ({ name, email, password, role }) => {
    const trimmedName = name.trim();
    const trimmedRole = role.trim();
    const normalized = email.trim().toLowerCase();
    if (!trimmedName || !normalized || !password) return { ok: false, error: "Fill in every field." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    if (!trimmedRole) return { ok: false, error: "Enter your role, e.g. Support Engineer." };
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === normalized)) {
      return { ok: false, error: "An account with that email already exists." };
    }
    const newSeat = addStaffMember({ name: trimmedName, role: trimmedRole });
    const stored: StoredUser = { email: email.trim(), name: trimmedName, passwordHash: hash(password), staffId: newSeat.id };
    writeUsers([...users, stored]);
    persistSession({ email: stored.email, name: stored.name, staffId: stored.staffId });
    return { ok: true };
  };

  const logout = () => {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* storage unavailable */
    }
    setUser(null);
  };

  const staff = user ? staffById(user.staffId) : null;

  return <AuthContext.Provider value={{ user, staff, ready, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
