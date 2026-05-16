import { NextResponse } from "next/server";
import {
  calculatePayroll,
  validatePayrollCalculationInput,
} from "@/lib/calculations/payroll";
import { mockDb } from "@/lib/mock-db";
import type { ApiError } from "@/types/api";
import type { PayrollCalculationInput } from "@/types/domain";

function errorResponse(error: string, status: number, code: ApiError["code"]) {
  return NextResponse.json<ApiError>({ error, code }, { status });
}

function toCalculationInput(payload: unknown): PayrollCalculationInput {
  const data = payload as Partial<PayrollCalculationInput>;

  return {
    employeeProfileId: String(data.employeeProfileId ?? ""),
    periodMonth: Number(data.periodMonth),
    periodYear: Number(data.periodYear),
    grossAmount: Number(data.grossAmount),
    rates: data.rates,
  };
}

export async function POST(request: Request) {
  let input: PayrollCalculationInput;

  try {
    input = toCalculationInput(await request.json());
  } catch {
    return errorResponse("Niepoprawny JSON zadania.", 400, "VALIDATION_ERROR");
  }

  const employeeExists = mockDb.employeeProfiles.some(
    (employee) => employee.id === input.employeeProfileId,
  );

  if (!employeeExists) {
    return errorResponse("Nie znaleziono profilu pracownika.", 404, "NOT_FOUND");
  }

  const validationErrors = validatePayrollCalculationInput(input);

  if (validationErrors.length > 0) {
    return errorResponse(validationErrors.join(" "), 400, "VALIDATION_ERROR");
  }

  return NextResponse.json(calculatePayroll(input));
}
