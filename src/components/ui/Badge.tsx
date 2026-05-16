import type { PayrollStatus, UserRole } from "@/types/domain";

type BadgeTone = "slate" | "teal" | "amber" | "rose" | "indigo";

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
};

const toneClassName: Record<BadgeTone, string> = {
  slate:
    "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  teal:
    "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900/70 dark:bg-teal-950/50 dark:text-teal-200",
  amber:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200",
  rose:
    "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/45 dark:text-rose-200",
  indigo:
    "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900/70 dark:bg-indigo-950/45 dark:text-indigo-200",
};

export function Badge({ children, tone = "slate" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold ${toneClassName[tone]}`}
    >
      {children}
    </span>
  );
}

export function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
  const tone: Record<PayrollStatus, BadgeTone> = {
    Draft: "amber",
    Approved: "teal",
    Corrected: "indigo",
    Cancelled: "rose",
  };

  const label: Record<PayrollStatus, string> = {
    Draft: "Robocza",
    Approved: "Zatwierdzona",
    Corrected: "Skorygowana",
    Cancelled: "Anulowana",
  };

  return <Badge tone={tone[status]}>{label[status]}</Badge>;
}

export function RoleBadge({ role }: { role: UserRole }) {
  const tone: Record<UserRole, BadgeTone> = {
    Employee: "teal",
    HR: "indigo",
    Admin: "rose",
  };

  const label: Record<UserRole, string> = {
    Employee: "Pracownik",
    HR: "Kadry",
    Admin: "Administrator",
  };

  return <Badge tone={tone[role]}>{label[role]}</Badge>;
}
