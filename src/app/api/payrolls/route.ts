import { NextResponse } from "next/server";
import {
  calculatePayroll,
  createPayrollFromCalculation,
  validatePayrollCalculationInput,
} from "@/lib/calculations/payroll";
import { mockDb } from "@/lib/mock-db";
import type { ApiError } from "@/types/api";
import type { PayrollCalculationInput, PayrollStatus } from "@/types/domain";

function errorResponse(error: string, status: number, code: ApiError["code"]) {
  return NextResponse.json<ApiError>({ error, code }, { status });
}

function toCalculationInput(payload: unknown): PayrollCalculationInput & {
  status?: PayrollStatus;
} {
  const data = payload as Partial<PayrollCalculationInput> & {
    status?: PayrollStatus;
  };

  return {
    employeeProfileId: String(data.employeeProfileId ?? ""),
    periodMonth: Number(data.periodMonth),
    periodYear: Number(data.periodYear),
    grossAmount: Number(data.grossAmount),
    rates: data.rates,
    status: data.status,
  };
}

export async function GET() {
  return NextResponse.json({
    items: mockDb.payrolls,
    total: mockDb.payrolls.length,
  });
}

export async function POST(request: Request) {
  let input: PayrollCalculationInput & { status?: PayrollStatus };

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

  const status = input.status === "Approved" ? "Approved" : "Draft";
  const calculation = calculatePayroll(input);
  const savedPayroll = createPayrollFromCalculation({
    calculation,
    id: `pay-${input.periodYear}-${String(input.periodMonth).padStart(2, "0")}-${
      input.employeeProfileId
    }-${Date.now()}`,
    createdByUserId: "usr-hr",
    status,
  });

  return NextResponse.json(
    {
      ...savedPayroll,
      persisted: false,
      message:
        "Wersja demonstracyjna zwraca naliczony szkic. Trwaly zapis do bazy zastapiono mockowym API.",
    },
    { status: 201 },
  );
}
