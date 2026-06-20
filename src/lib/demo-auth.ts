import { employeeProfiles, users } from "@/data/mock-users";
import { formatRole } from "@/lib/formatters";
import type { EmployeeProfile, User, UserRole } from "@/types/domain";

export const DEMO_SESSION_STORAGE_KEY = "payslip-demo-session-v1";
export const DEMO_SESSION_EVENT = "payslip-demo-session-change";

export type DemoSession = {
  department: string | null;
  displayName: string;
  email: string;
  role: UserRole;
  userId: string;
  username: string;
};

export type DemoAccount = {
  description: string;
  password: string;
  profile: EmployeeProfile | null;
  roleLabel: string;
  user: User;
};

let cachedSessionRaw: string | null | undefined;
let cachedSession: DemoSession | null = null;

function getProfileForUser(userId: string) {
  return employeeProfiles.find((profile) => profile.userId === userId) ?? null;
}

function createDisplayName(user: User, profile: EmployeeProfile | null) {
  return profile ? `${profile.firstName} ${profile.lastName}` : user.username;
}

export function createDemoSession(user: User): DemoSession {
  const profile = getProfileForUser(user.id);

  return {
    department: profile?.department ?? null,
    displayName: createDisplayName(user, profile),
    email: user.email,
    role: user.role,
    userId: user.id,
    username: user.username,
  };
}

export function getDemoAccounts(): DemoAccount[] {
  return users
    .filter((user) => user.isActive && user.demoPassword)
    .map((user) => {
      const profile = getProfileForUser(user.id);

      return {
        description: profile?.position ?? "Konto demonstracyjne",
        password: user.demoPassword ?? "",
        profile,
        roleLabel: formatRole(user.role),
        user,
      };
    });
}

export function authenticateDemoUser(username: string, password: string) {
  const normalizedUsername = username.trim().toLowerCase();
  const user = users.find(
    (item) => item.username.toLowerCase() === normalizedUsername && item.isActive,
  );

  if (!user || user.demoPassword !== password) {
    return null;
  }

  return createDemoSession(user);
}

export function readDemoSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY);

    if (raw === cachedSessionRaw) {
      return cachedSession;
    }

    cachedSessionRaw = raw;

    const parsed: unknown = JSON.parse(raw ?? "null");

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "userId" in parsed &&
      "username" in parsed &&
      "role" in parsed
    ) {
      cachedSession = parsed as DemoSession;
      return cachedSession;
    }

    cachedSession = null;
    return null;
  } catch {
    cachedSession = null;
    return null;
  }
}

export function notifyDemoSessionChange() {
  window.dispatchEvent(new Event(DEMO_SESSION_EVENT));
}

export function saveDemoSession(session: DemoSession) {
  window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(session));
  notifyDemoSessionChange();
}

export function clearDemoSession() {
  window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
  notifyDemoSessionChange();
}
