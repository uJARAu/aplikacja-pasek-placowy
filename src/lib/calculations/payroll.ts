import type {
  Payroll,
  PayrollCalculationInput,
  PayrollCalculationRates,
  PayrollCalculationResult,
  PayrollComponent,
  PayrollComponentType,
  PayrollStatus,
} from "@/types/domain";

export const payrollRateKeys = [
  "pensionContributionRate",
  "disabilityContributionRate",
  "sicknessContributionRate",
  "healthContributionRate",
  "pitRate",
  "monthlyTaxRelief",
] as const;

export type PayrollRateKey = (typeof payrollRateKeys)[number];

export const DEFAULT_PAYROLL_RATES: PayrollCalculationRates = {
  pensionContributionRate: 0.0976,
  disabilityContributionRate: 0.015,
  sicknessContributionRate: 0.0245,
  healthContributionRate: 0.09,
  pitRate: 0.12,
  monthlyTaxRelief: 300,
};

type PayrollComponentDraft = Omit<PayrollComponent, "id" | "payrollId">;

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function parsePolishMoney(value: string) {
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : NaN;
}

export function validatePayrollCalculationInput(input: PayrollCalculationInput) {
  const errors: string[] = [];

  if (!input.employeeProfileId) {
    errors.push("Pracownik jest wymagany.");
  }

  if (!Number.isInteger(input.periodMonth) || input.periodMonth < 1 || input.periodMonth > 12) {
    errors.push("Miesiac okresu rozliczeniowego musi byc z zakresu 1-12.");
  }

  if (!Number.isInteger(input.periodYear) || input.periodYear < 2000 || input.periodYear > 2100) {
    errors.push("Rok okresu rozliczeniowego jest niepoprawny.");
  }

  if (!Number.isFinite(input.grossAmount) || input.grossAmount <= 0) {
    errors.push("Wynagrodzenie brutto musi byc dodatnia liczba.");
  }

  if (input.grossAmount > 1_000_000) {
    errors.push("Wynagrodzenie brutto przekracza limit demonstracyjny.");
  }

  return errors;
}

export function mergePayrollRates(rates?: Partial<PayrollCalculationRates>) {
  return {
    ...DEFAULT_PAYROLL_RATES,
    ...rates,
  };
}

function createComponent(
  componentType: PayrollComponentType,
  name: string,
  amount: number,
  calculationBasis: number | null,
  rate: number | null,
  description: string | null = null,
): PayrollComponentDraft {
  return {
    componentType,
    name,
    amount,
    calculationBasis,
    rate,
    description,
  };
}

export function calculatePayroll(input: PayrollCalculationInput): PayrollCalculationResult {
  const errors = validatePayrollCalculationInput(input);

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }

  const rates = mergePayrollRates(input.rates);
  const grossAmount = roundMoney(input.grossAmount);
  const pensionContribution = roundMoney(grossAmount * rates.pensionContributionRate);
  const disabilityContribution = roundMoney(grossAmount * rates.disabilityContributionRate);
  const sicknessContribution = roundMoney(grossAmount * rates.sicknessContributionRate);
  const socialContributionsTotal = roundMoney(
    pensionContribution + disabilityContribution + sicknessContribution,
  );
  const healthContributionBasis = roundMoney(grossAmount - socialContributionsTotal);
  const healthContribution = roundMoney(healthContributionBasis * rates.healthContributionRate);
  const pitBasis = Math.max(0, Math.round(healthContributionBasis));
  const pitBeforeRelief = roundMoney(pitBasis * rates.pitRate);
  const pitAdvance = roundMoney(Math.max(0, pitBeforeRelief - rates.monthlyTaxRelief));
  const netAmount = roundMoney(
    grossAmount - socialContributionsTotal - healthContribution - pitAdvance,
  );

  const componentDrafts = [
    createComponent(
      "GrossSalary",
      "Wynagrodzenie brutto",
      grossAmount,
      null,
      null,
      "Kwota wprowadzona przez pracownika kadr.",
    ),
    createComponent(
      "PensionContribution",
      "Skladka emerytalna",
      pensionContribution,
      grossAmount,
      rates.pensionContributionRate,
    ),
    createComponent(
      "DisabilityContribution",
      "Skladka rentowa",
      disabilityContribution,
      grossAmount,
      rates.disabilityContributionRate,
    ),
    createComponent(
      "SicknessContribution",
      "Skladka chorobowa",
      sicknessContribution,
      grossAmount,
      rates.sicknessContributionRate,
    ),
    createComponent(
      "HealthContribution",
      "Skladka zdrowotna",
      healthContribution,
      healthContributionBasis,
      rates.healthContributionRate,
    ),
    createComponent("PitAdvance", "Zaliczka PIT", pitAdvance, pitBasis, rates.pitRate),
    createComponent("NetSalary", "Wynagrodzenie netto", netAmount, null, null, "Kwota do wyplaty."),
  ];

  return {
    employeeProfileId: input.employeeProfileId,
    periodMonth: input.periodMonth,
    periodYear: input.periodYear,
    grossAmount,
    pensionContribution,
    disabilityContribution,
    sicknessContribution,
    socialContributionsTotal,
    healthContributionBasis,
    healthContribution,
    pitBasis,
    pitBeforeRelief,
    pitAdvance,
    netAmount,
    rates,
    components: componentDrafts.map((component, index) => ({
      id: `calc-${index + 1}`,
      payrollId: "calculation-preview",
      ...component,
    })),
  };
}

export function createPayrollFromCalculation({
  calculation,
  id,
  createdByUserId,
  status = "Draft",
  createdAt = new Date().toISOString(),
}: {
  calculation: PayrollCalculationResult;
  id: string;
  createdByUserId: string;
  status?: PayrollStatus;
  createdAt?: string;
}): {
  payroll: Payroll;
  components: PayrollComponent[];
} {
  const approvedAt = status === "Approved" ? createdAt : null;

  return {
    payroll: {
      id,
      employeeProfileId: calculation.employeeProfileId,
      periodMonth: calculation.periodMonth,
      periodYear: calculation.periodYear,
      grossAmount: calculation.grossAmount,
      netAmount: calculation.netAmount,
      socialContributionsTotal: calculation.socialContributionsTotal,
      pensionContribution: calculation.pensionContribution,
      healthContribution: calculation.healthContribution,
      pitAdvance: calculation.pitAdvance,
      status,
      createdByUserId,
      createdAt,
      approvedAt,
      updatedAt: createdAt,
    },
    components: calculation.components.map((component, index) => ({
      ...component,
      id: `${id}-component-${index + 1}`,
      payrollId: id,
    })),
  };
}
