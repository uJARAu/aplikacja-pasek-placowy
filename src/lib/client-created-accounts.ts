import type { EmployeeProfile, User } from "@/types/domain";

export const CREATED_ACCOUNTS_STORAGE_KEY = "payslip-created-accounts-v1";

export type CreatedAccount = {
  employeeProfile: EmployeeProfile;
  user: User;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCreatedAccount(value: unknown): value is CreatedAccount {
  if (!isRecord(value) || !isRecord(value.user) || !isRecord(value.employeeProfile)) {
    return false;
  }

  return (
    typeof value.user.id === "string" &&
    typeof value.user.username === "string" &&
    typeof value.employeeProfile.id === "string" &&
    typeof value.employeeProfile.userId === "string"
  );
}

export function readCreatedAccounts() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(CREATED_ACCOUNTS_STORAGE_KEY) ?? "[]",
    );

    return Array.isArray(parsed) ? parsed.filter(isCreatedAccount) : [];
  } catch {
    return [];
  }
}

export function writeCreatedAccounts(accounts: CreatedAccount[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CREATED_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}
