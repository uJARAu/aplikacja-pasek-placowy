"use client";

import { Calculator, CheckCircle2, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { PayrollStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName } from "@/components/ui/Field";
import { StatusCard } from "@/components/ui/StatusCard";
import { DataTable, TableCell, TableRow } from "@/components/ui/Table";
import {
  calculatePayroll,
  parsePolishMoney,
} from "@/lib/calculations/payroll";
import { formatMoney } from "@/lib/formatters";
import type {
  EmployeeProfile,
  PayrollCalculationResult,
  PayrollStatus,
} from "@/types/domain";

type PayrollCalculatorProps = {
  employees: EmployeeProfile[];
};

type ApiSaveResponse = {
  payroll: {
    id: string;
    status: PayrollStatus;
  };
  message: string;
  persisted: boolean;
};

function parsePeriod(period: string) {
  const [year, month] = period.split("-").map(Number);

  return {
    periodMonth: month,
    periodYear: year,
  };
}

export function PayrollCalculator({ employees }: PayrollCalculatorProps) {
  const [employeeProfileId, setEmployeeProfileId] = useState(employees[0]?.id ?? "");
  const [period, setPeriod] = useState("2026-05");
  const [grossAmount, setGrossAmount] = useState("7200.00");
  const [status, setStatus] = useState<PayrollStatus>("Draft");
  const [result, setResult] = useState<PayrollCalculationResult>(() =>
    calculatePayroll({
      employeeProfileId: employees[0]?.id ?? "",
      grossAmount: 7200,
      ...parsePeriod("2026-05"),
    }),
  );
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === employeeProfileId),
    [employeeProfileId, employees],
  );

  async function calculateFromApi() {
    setIsCalculating(true);
    setError(null);
    setSaveMessage(null);

    try {
      const payload = {
        employeeProfileId,
        grossAmount: parsePolishMoney(grossAmount),
        ...parsePeriod(period),
      };
      const response = await fetch("/api/payrolls/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Nie udalo sie naliczyc wyplaty.");
      }

      setResult(data);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Wystapil blad naliczania.");
    } finally {
      setIsCalculating(false);
    }
  }

  async function saveDraft() {
    setIsSaving(true);
    setError(null);
    setSaveMessage(null);

    try {
      const payload = {
        employeeProfileId,
        grossAmount: parsePolishMoney(grossAmount),
        status,
        ...parsePeriod(period),
      };
      const response = await fetch("/api/payrolls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as ApiSaveResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Nie udalo sie zapisac szkicu wyplaty.");
      }

      const existingDrafts = JSON.parse(localStorage.getItem("payrollDrafts") ?? "[]");
      localStorage.setItem("payrollDrafts", JSON.stringify([data, ...existingDrafts]));
      setSaveMessage(`${data.message} Id szkicu: ${data.payroll.id}`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Wystapil blad zapisu.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader title="Dane wyplaty" description="Dane wejsciowe do naliczenia." />
          <CardBody>
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                void calculateFromApi();
              }}
            >
              <Field label="Pracownik" htmlFor="employeeProfileId">
                <select
                  id="employeeProfileId"
                  className={inputClassName}
                  value={employeeProfileId}
                  onChange={(event) => setEmployeeProfileId(event.target.value)}
                >
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Okres" htmlFor="period">
                <input
                  id="period"
                  className={inputClassName}
                  value={period}
                  type="month"
                  onChange={(event) => setPeriod(event.target.value)}
                />
              </Field>
              <Field label="Wynagrodzenie brutto" htmlFor="grossAmount" hint="Mozesz wpisac kropke albo przecinek.">
                <input
                  id="grossAmount"
                  className={inputClassName}
                  inputMode="decimal"
                  value={grossAmount}
                  onChange={(event) => setGrossAmount(event.target.value)}
                />
              </Field>
              <Field label="Status po zapisie" htmlFor="status">
                <select
                  id="status"
                  className={inputClassName}
                  value={status}
                  onChange={(event) => setStatus(event.target.value as PayrollStatus)}
                >
                  <option value="Draft">Robocza</option>
                  <option value="Approved">Zatwierdzona</option>
                </select>
              </Field>

              <div className="flex flex-wrap gap-2 md:col-span-2">
                <Button disabled={isCalculating} icon={Calculator} type="submit">
                  {isCalculating ? "Przeliczanie..." : "Przelicz"}
                </Button>
                <Button
                  disabled={isSaving}
                  icon={Save}
                  onClick={() => {
                    void saveDraft();
                  }}
                  tone="primary"
                >
                  {isSaving ? "Zapisywanie..." : "Zapisz roboczo"}
                </Button>
              </div>
            </form>

            {error ? (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200">
                {error}
              </div>
            ) : null}
            {saveMessage ? (
              <div className="mt-4 flex gap-2 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-950 dark:border-teal-900/70 dark:bg-teal-950/40 dark:text-teal-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{saveMessage}</span>
              </div>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Podglad naliczenia"
            description={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : undefined}
            action={<PayrollStatusBadge status={status} />}
          />
          <CardBody>
            <div className="grid gap-3 sm:grid-cols-2">
              <StatusCard label="Brutto" value={formatMoney(result.grossAmount)} />
              <StatusCard label="Spoleczne razem" value={formatMoney(result.socialContributionsTotal)} />
              <StatusCard label="Zdrowotna" value={formatMoney(result.healthContribution)} />
              <StatusCard label="PIT" value={formatMoney(result.pitAdvance)} />
            </div>
            <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-900/70 dark:bg-teal-950/40">
              <p className="text-sm text-teal-800 dark:text-teal-200">Do wyplaty</p>
              <p className="mt-1 text-3xl font-semibold text-teal-950 dark:text-teal-50">
                {formatMoney(result.netAmount)}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <DataTable columns={["Skladnik", "Kwota", "Podstawa", "Stawka", "Opis"]}>
        {result.components.map((component) => (
          <TableRow key={component.id}>
            <TableCell className="font-medium">{component.name}</TableCell>
            <TableCell>{formatMoney(component.amount)}</TableCell>
            <TableCell>
              {component.calculationBasis === null
                ? "-"
                : formatMoney(component.calculationBasis)}
            </TableCell>
            <TableCell>{component.rate === null ? "-" : `${(component.rate * 100).toFixed(2)}%`}</TableCell>
            <TableCell className="text-slate-600">{component.description ?? "-"}</TableCell>
          </TableRow>
        ))}
      </DataTable>

      <Card>
        <CardHeader title="Zasady obliczen" description="Uproszczony model do projektu PWSI." />
        <CardBody className="grid gap-3 text-sm leading-6 text-slate-600 dark:text-slate-400 md:grid-cols-2">
          <p>Spoleczne = emerytalna, rentowa i chorobowa liczone od brutto.</p>
          <p>Zdrowotna = 9% od brutto pomniejszonego o skladki spoleczne.</p>
          <p>PIT = 12% podstawy po skladkach spolecznych minus kwota zmniejszajaca 300 zl.</p>
          <p>Netto = brutto minus skladki spoleczne, zdrowotna i zaliczka PIT.</p>
        </CardBody>
      </Card>
    </div>
  );
}
