export type UserRole = "Employee" | "HR" | "Admin";

export type Gender = "Female" | "Male" | "Other";

export type PayrollStatus = "Draft" | "Approved" | "Corrected" | "Cancelled";

export type PayrollComponentType =
  | "GrossSalary"
  | "PensionContribution"
  | "DisabilityContribution"
  | "SicknessContribution"
  | "HealthContribution"
  | "PitAdvance"
  | "NetSalary";

export type PayrollCalculationRates = {
  pensionContributionRate: number;
  disabilityContributionRate: number;
  sicknessContributionRate: number;
  healthContributionRate: number;
  pitRate: number;
  monthlyTaxRelief: number;
};

export type PayrollCalculationInput = {
  employeeProfileId: string;
  periodMonth: number;
  periodYear: number;
  grossAmount: number;
  rates?: Partial<PayrollCalculationRates>;
};

export type PayrollCalculationResult = {
  employeeProfileId: string;
  periodMonth: number;
  periodYear: number;
  grossAmount: number;
  pensionContribution: number;
  disabilityContribution: number;
  sicknessContribution: number;
  socialContributionsTotal: number;
  healthContributionBasis: number;
  healthContribution: number;
  pitBasis: number;
  pitBeforeRelief: number;
  pitAdvance: number;
  netAmount: number;
  rates: PayrollCalculationRates;
  components: PayrollComponent[];
};

export type User = {
  id: string;
  username: string;
  email: string;
  demoPassword?: string;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  pesel: string;
  gender: Gender;
  birthDate: string;
  employeeNumber: string;
  employmentDate: string;
  position: string;
  department: string;
};

export type Payroll = {
  id: string;
  employeeProfileId: string;
  periodMonth: number;
  periodYear: number;
  grossAmount: number;
  netAmount: number;
  socialContributionsTotal: number;
  pensionContribution: number;
  healthContribution: number;
  pitAdvance: number;
  status: PayrollStatus;
  createdByUserId: string;
  createdAt: string;
  approvedAt: string | null;
  updatedAt: string;
};

export type PayrollComponent = {
  id: string;
  payrollId: string;
  componentType: PayrollComponentType;
  name: string;
  amount: number;
  calculationBasis: number | null;
  rate: number | null;
  description: string | null;
};

export type PrivatePensionData = {
  id: string;
  userId: string;
  initialCapital: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PensionSimulation = {
  id: string;
  userId: string;
  retirementAge: number;
  salaryGrowthRate: number;
  contributionGrowthRate: number;
  indexationRate: number;
  initialCapitalUsed: number;
  historicalContributionsUsed: number;
  projectedCapital: number;
  lifeExpectancyMonths: number;
  projectedMonthlyPension: number;
  createdAt: string;
};

export type LifeExpectancyTable = {
  id: string;
  age: number;
  months: number;
  source: string;
  validFrom: string;
  validTo: string | null;
  createdAt: string;
};

export type SystemSetting = {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updatedByUserId: string;
  updatedAt: string;
};

export type AuditLog = {
  id: string;
  userId: string | null;
  action: string;
  entityName: string;
  entityId: string | null;
  result: "Success" | "Denied" | "Error";
  createdAt: string;
  ipAddress: string | null;
  details: string | null;
};
