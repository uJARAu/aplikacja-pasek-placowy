export type PageSearchParams = Record<string, string | string[] | undefined>;

export function getSearchParam(params: PageSearchParams | undefined, key: string) {
  const value = params?.[key];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export function matchesText(value: string, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return value.toLowerCase().includes(normalizedQuery);
}

export function payrollPeriodIndex(month: number, year: number) {
  return year * 12 + month;
}

export function monthParamIndex(value: string) {
  if (!value) {
    return null;
  }

  const [year, month] = value.split("-").map(Number);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  return payrollPeriodIndex(month, year);
}
