import type { PayrollStatus, UserRole } from "@/types/domain";

export function formatMoney(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPeriod(month: number, year: number) {
  return `${String(month).padStart(2, "0")}.${year}`;
}

export function formatRole(role: UserRole) {
  const labels: Record<UserRole, string> = {
    Employee: "Pracownik",
    HR: "Pracownik kadr",
    Admin: "Administrator",
  };

  return labels[role];
}

export function formatPayrollStatus(status: PayrollStatus) {
  const labels: Record<PayrollStatus, string> = {
    Draft: "Robocza",
    Approved: "Zatwierdzona",
    Corrected: "Skorygowana",
    Cancelled: "Anulowana",
  };

  return labels[status];
}
