import type {
  LifeExpectancyTable,
  PensionSimulation,
} from "@/types/domain";

export const defaultPensionSimulationParams = {
  retirementAge: 65,
  salaryGrowthRate: 0.03,
  contributionGrowthRate: 0.03,
  indexationRate: 0.04,
};

export type PensionSimulationInput = {
  averageMonthlyContribution: number;
  birthDate: string;
  contributionGrowthRate: number;
  createdAt?: string;
  historicalContributions: number;
  indexationRate: number;
  initialCapital: number;
  lifeExpectancyTable: LifeExpectancyTable[];
  retirementAge: number;
  salaryGrowthRate: number;
  userId: string;
};

export function parsePercent(value: string) {
  const parsed = Number(value.replace("%", "").replace(",", ".").trim());

  if (!Number.isFinite(parsed)) {
    return NaN;
  }

  return parsed > 1 ? parsed / 100 : parsed;
}

export function parsePositiveNumber(value: string) {
  const parsed = Number(value.replace(/\s/g, "").replace(",", "."));

  return Number.isFinite(parsed) ? parsed : NaN;
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function getAgeFromBirthDate(birthDate: string, now = new Date()) {
  const date = new Date(birthDate);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  let age = now.getFullYear() - date.getFullYear();
  const monthDelta = now.getMonth() - date.getMonth();
  const beforeBirthday =
    monthDelta < 0 || (monthDelta === 0 && now.getDate() < date.getDate());

  if (beforeBirthday) {
    age -= 1;
  }

  return Math.max(0, age);
}

export function formatMonthsAsYears(months: number) {
  const safeMonths = Math.max(0, Math.round(months));
  const years = Math.floor(safeMonths / 12);
  const remainingMonths = safeMonths % 12;

  if (years === 0) {
    return `${remainingMonths} mies.`;
  }

  if (remainingMonths === 0) {
    return `${years} lat`;
  }

  return `${years} lat ${remainingMonths} mies.`;
}

export function getLifeExpectancyMonths(
  retirementAge: number,
  table: LifeExpectancyTable[],
) {
  const sortedTable = [...table].sort((first, second) => first.age - second.age);
  const exactMatch = sortedTable.find((item) => item.age === retirementAge);

  if (exactMatch) {
    return exactMatch.months;
  }

  const lower = [...sortedTable].reverse().find((item) => item.age < retirementAge);
  const upper = sortedTable.find((item) => item.age > retirementAge);

  if (!lower && !upper) {
    return 0;
  }

  if (!lower) {
    return upper?.months ?? 0;
  }

  if (!upper) {
    return lower.months;
  }

  const progress = (retirementAge - lower.age) / (upper.age - lower.age);

  return Math.round(lower.months + (upper.months - lower.months) * progress);
}

export function calculatePensionSimulation(
  input: PensionSimulationInput,
): PensionSimulation {
  const createdAt = input.createdAt ?? new Date().toISOString();
  const currentAge = getAgeFromBirthDate(input.birthDate, new Date(createdAt));
  const yearsToRetirement = Math.max(0, input.retirementAge - currentAge);
  const monthsToRetirement = yearsToRetirement * 12;
  const monthlyIndexationRate = Math.pow(1 + input.indexationRate, 1 / 12) - 1;
  let projectedCapital = input.initialCapital + input.historicalContributions;

  for (let month = 0; month < monthsToRetirement; month += 1) {
    const elapsedYears = month / 12;
    const projectedContribution =
      input.averageMonthlyContribution *
      Math.pow(1 + input.salaryGrowthRate, elapsedYears) *
      Math.pow(1 + input.contributionGrowthRate, elapsedYears);

    projectedCapital = projectedCapital * (1 + monthlyIndexationRate) + projectedContribution;
  }

  const lifeExpectancyMonths = getLifeExpectancyMonths(
    input.retirementAge,
    input.lifeExpectancyTable,
  );
  const projectedMonthlyPension =
    lifeExpectancyMonths > 0 ? projectedCapital / lifeExpectancyMonths : 0;

  return {
    id: `sim-${Date.now()}`,
    userId: input.userId,
    retirementAge: input.retirementAge,
    salaryGrowthRate: input.salaryGrowthRate,
    contributionGrowthRate: input.contributionGrowthRate,
    indexationRate: input.indexationRate,
    initialCapitalUsed: roundMoney(input.initialCapital),
    historicalContributionsUsed: roundMoney(input.historicalContributions),
    projectedCapital: roundMoney(projectedCapital),
    lifeExpectancyMonths,
    projectedMonthlyPension: roundMoney(projectedMonthlyPension),
    createdAt,
  };
}
