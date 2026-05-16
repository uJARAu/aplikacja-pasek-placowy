import type {
  AuditLog,
  PensionSimulation,
  PrivatePensionData,
  SystemSetting,
} from "@/types/domain";

export const privatePensionData: PrivatePensionData[] = [
  {
    id: "priv-anna",
    userId: "usr-anna",
    initialCapital: 48200,
    notes: "Dane demonstracyjne do symulacji.",
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-01T10:00:00.000Z",
  },
];

export const pensionSimulations: PensionSimulation[] = [
  {
    id: "sim-anna-001",
    userId: "usr-anna",
    retirementAge: 65,
    salaryGrowthRate: 0.03,
    contributionGrowthRate: 0.03,
    indexationRate: 0.04,
    initialCapitalUsed: 48200,
    historicalContributionsUsed: 1390.8,
    projectedCapital: 418520.44,
    lifeExpectancyMonths: 218,
    projectedMonthlyPension: 1919.82,
    createdAt: "2026-05-10T14:20:00.000Z",
  },
];

export const systemSettings: SystemSetting[] = [
  {
    id: "set-pension-rate",
    key: "pensionContributionRate",
    value: "0.0976",
    description: "Stawka skladki emerytalnej po stronie pracownika.",
    updatedByUserId: "usr-admin",
    updatedAt: "2026-01-02T08:30:00.000Z",
  },
  {
    id: "set-health-rate",
    key: "healthContributionRate",
    value: "0.09",
    description: "Stawka skladki zdrowotnej.",
    updatedByUserId: "usr-admin",
    updatedAt: "2026-01-02T08:30:00.000Z",
  },
];

export const auditLogs: AuditLog[] = [
  {
    id: "aud-001",
    userId: "usr-admin",
    action: "CREATE_USER",
    entityName: "User",
    entityId: "usr-anna",
    result: "Success",
    createdAt: "2026-01-03T09:00:00.000Z",
    ipAddress: "127.0.0.1",
    details: "Utworzono konto demonstracyjne pracownika.",
  },
  {
    id: "aud-002",
    userId: "usr-hr",
    action: "APPROVE_PAYROLL",
    entityName: "Payroll",
    entityId: "pay-2026-04-anna",
    result: "Success",
    createdAt: "2026-04-28T11:25:00.000Z",
    ipAddress: "127.0.0.1",
    details: "Zatwierdzono demonstracyjna wyplate.",
  },
  {
    id: "aud-003",
    userId: "usr-anna",
    action: "RUN_PENSION_SIMULATION",
    entityName: "PensionSimulation",
    entityId: "sim-anna-001",
    result: "Success",
    createdAt: "2026-05-10T14:20:00.000Z",
    ipAddress: "127.0.0.1",
    details: "Wykonano symulacje emerytalna na danych mockowych.",
  },
];
