"use client";

import { CheckCircle2, Landmark, Play, RotateCcw } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { ModulePage } from "@/components/layout/ModulePage";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName } from "@/components/ui/Field";
import { StatusCard } from "@/components/ui/StatusCard";
import { DataTable, TableCell, TableRow } from "@/components/ui/Table";
import {
  calculatePensionSimulation,
  defaultPensionSimulationParams,
  formatMonthsAsYears,
  parsePercent,
  parsePositiveNumber,
} from "@/lib/calculations/pension";
import { formatMoney } from "@/lib/formatters";
import type {
  EmployeeProfile,
  LifeExpectancyTable,
  PensionSimulation,
} from "@/types/domain";

type PensionSimulationToolProps = {
  averageMonthlyContribution: number;
  employee: EmployeeProfile;
  historicalContributions: number;
  initialCapital: number;
  initialSimulations: PensionSimulation[];
  lifeExpectancyTable: LifeExpectancyTable[];
  userId: string;
};

type FormState = {
  contributionGrowthRate: string;
  indexationRate: string;
  initialCapital: string;
  retirementAge: string;
  salaryGrowthRate: string;
};

const STORAGE_KEY = "payslip-pension-simulations-v1";

function createInitialForm(initialCapital: number): FormState {
  return {
    contributionGrowthRate: `${defaultPensionSimulationParams.contributionGrowthRate * 100}`,
    indexationRate: `${defaultPensionSimulationParams.indexationRate * 100}`,
    initialCapital: String(initialCapital),
    retirementAge: String(defaultPensionSimulationParams.retirementAge),
    salaryGrowthRate: `${defaultPensionSimulationParams.salaryGrowthRate * 100}`,
  };
}

function readSavedSimulations() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");

    return Array.isArray(parsed) ? (parsed as PensionSimulation[]) : [];
  } catch {
    return [];
  }
}

function writeSavedSimulations(simulations: PensionSimulation[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(simulations));
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1).replace(".", ",")}%`;
}

function formatRateInput(value: string) {
  return `${value.replace("%", "").replace(",", ".")}%`;
}

export function PensionSimulationTool({
  averageMonthlyContribution,
  employee,
  historicalContributions,
  initialCapital,
  initialSimulations,
  lifeExpectancyTable,
  userId,
}: PensionSimulationToolProps) {
  const [form, setForm] = useState<FormState>(() => createInitialForm(initialCapital));
  const [simulations, setSimulations] = useState<PensionSimulation[]>(() => [
    ...readSavedSimulations(),
    ...initialSimulations,
  ]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentSimulation = simulations[0];
  const periodLabel = currentSimulation
    ? formatMonthsAsYears(currentSimulation.lifeExpectancyMonths)
    : "-";
  const latestRates = currentSimulation
    ? [
        ["Wiek emerytalny", `${currentSimulation.retirementAge} lat`],
        ["Wzrost wynagrodzenia", formatPercent(currentSimulation.salaryGrowthRate)],
        ["Wzrost skladek", formatPercent(currentSimulation.contributionGrowthRate)],
        ["Waloryzacja", formatPercent(currentSimulation.indexationRate)],
      ]
    : [];
  const tableSource = useMemo(() => {
    const matchingTable = lifeExpectancyTable.find(
      (item) => item.months === currentSimulation?.lifeExpectancyMonths,
    );

    return matchingTable?.source ?? "GUS mock";
  }, [currentSimulation?.lifeExpectancyMonths, lifeExpectancyTable]);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  function runSimulation() {
    const retirementAge = Number(form.retirementAge);
    const salaryGrowthRate = parsePercent(form.salaryGrowthRate);
    const contributionGrowthRate = parsePercent(form.contributionGrowthRate);
    const indexationRate = parsePercent(form.indexationRate);
    const parsedInitialCapital = parsePositiveNumber(form.initialCapital);

    if (!Number.isInteger(retirementAge) || retirementAge < 50 || retirementAge > 80) {
      setError("Wiek emerytalny musi byc liczba calkowita z zakresu 50-80.");
      setSuccessMessage(null);
      return;
    }

    if (
      !Number.isFinite(salaryGrowthRate) ||
      !Number.isFinite(contributionGrowthRate) ||
      !Number.isFinite(indexationRate)
    ) {
      setError("Stawki procentowe musza byc poprawnymi liczbami, np. 3 albo 3%.");
      setSuccessMessage(null);
      return;
    }

    if (!Number.isFinite(parsedInitialCapital) || parsedInitialCapital < 0) {
      setError("Kapital poczatkowy musi byc liczba nieujemna.");
      setSuccessMessage(null);
      return;
    }

    const newSimulation = calculatePensionSimulation({
      averageMonthlyContribution,
      birthDate: employee.birthDate,
      contributionGrowthRate,
      historicalContributions,
      indexationRate,
      initialCapital: parsedInitialCapital,
      lifeExpectancyTable,
      retirementAge,
      salaryGrowthRate,
      userId,
    });
    const savedSimulations = [newSimulation, ...readSavedSimulations()].slice(0, 10);

    setSimulations([newSimulation, ...simulations]);
    writeSavedSimulations(savedSimulations);
    setError(null);
    setSuccessMessage("Symulacja zostala przeliczona i dodana do historii.");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSimulation();
  }

  function resetForm() {
    setForm(createInitialForm(initialCapital));
    setError(null);
    setSuccessMessage(null);
  }

  return (
    <ModulePage
      title="Symulacje emerytalne"
      eyebrow="Pracownik"
      description="Parametry symulacji wplywaja na wynik od razu po uruchomieniu obliczen. Dane sa demonstracyjne i sluza do projektu PWSI."
      actions={
        <Button icon={Play} onClick={runSimulation} tone="primary">
          Uruchom symulacje
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          label="Prognozowany kapital"
          value={currentSimulation ? formatMoney(currentSimulation.projectedCapital) : "-"}
          icon={Landmark}
        />
        <StatusCard
          label="Miesieczna emerytura"
          value={currentSimulation ? formatMoney(currentSimulation.projectedMonthlyPension) : "-"}
          tone="teal"
        />
        <StatusCard
          label="Szacowany okres pobierania"
          value={periodLabel}
          helper={
            currentSimulation
              ? `${currentSimulation.lifeExpectancyMonths} mies. wedlug tablicy`
              : undefined
          }
          tone="rose"
        />
      </div>

      {successMessage ? (
        <div className="mt-4 flex gap-2 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-950 dark:border-teal-900/70 dark:bg-teal-950/40 dark:text-teal-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader title="Parametry symulacji" />
          <CardBody>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <Field label="Wiek emerytalny" htmlFor="retirementAge">
                <input
                  id="retirementAge"
                  className={inputClassName}
                  inputMode="numeric"
                  max={80}
                  min={50}
                  onChange={(event) => updateForm("retirementAge", event.target.value)}
                  type="number"
                  value={form.retirementAge}
                />
              </Field>
              <Field label="Wzrost wynagrodzenia rocznie" htmlFor="salaryGrowthRate">
                <input
                  id="salaryGrowthRate"
                  className={inputClassName}
                  inputMode="decimal"
                  onBlur={(event) =>
                    updateForm("salaryGrowthRate", formatRateInput(event.target.value))
                  }
                  onChange={(event) => updateForm("salaryGrowthRate", event.target.value)}
                  value={form.salaryGrowthRate}
                />
              </Field>
              <Field label="Wzrost skladek rocznie" htmlFor="contributionGrowthRate">
                <input
                  id="contributionGrowthRate"
                  className={inputClassName}
                  inputMode="decimal"
                  onBlur={(event) =>
                    updateForm("contributionGrowthRate", formatRateInput(event.target.value))
                  }
                  onChange={(event) => updateForm("contributionGrowthRate", event.target.value)}
                  value={form.contributionGrowthRate}
                />
              </Field>
              <Field label="Waloryzacja kapitalu rocznie" htmlFor="indexationRate">
                <input
                  id="indexationRate"
                  className={inputClassName}
                  inputMode="decimal"
                  onBlur={(event) =>
                    updateForm("indexationRate", formatRateInput(event.target.value))
                  }
                  onChange={(event) => updateForm("indexationRate", event.target.value)}
                  value={form.indexationRate}
                />
              </Field>
              <Field label="Kapital poczatkowy" htmlFor="initialCapital">
                <input
                  id="initialCapital"
                  className={inputClassName}
                  inputMode="decimal"
                  onChange={(event) => updateForm("initialCapital", event.target.value)}
                  value={form.initialCapital}
                />
              </Field>

              {error ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200 md:col-span-2">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2 md:col-span-2">
                <Button icon={Play} tone="primary" type="submit">
                  Przelicz symulacje
                </Button>
                <Button icon={RotateCcw} onClick={resetForm}>
                  Przywroc domyslne
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Przyjete dane" description="Dane uzyte w ostatnim wyniku." />
          <CardBody className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-400">Pracownik</span>
              <strong>
                {employee.firstName} {employee.lastName}
              </strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-400">Kapital poczatkowy</span>
              <strong>
                {currentSimulation ? formatMoney(currentSimulation.initialCapitalUsed) : "-"}
              </strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-400">Historyczne skladki</span>
              <strong>{formatMoney(historicalContributions)}</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-400">Srednia skladka miesieczna</span>
              <strong>{formatMoney(averageMonthlyContribution)}</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-400">Tablica okresu swiadczenia</span>
              <strong>
                {periodLabel} ({currentSimulation?.lifeExpectancyMonths ?? 0} mies.)
              </strong>
            </div>
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
              Zrodlo: {tableSource}. W projekcie jest to uproszczona tabela demonstracyjna,
              a wynik nie jest oficjalna prognoza emerytalna.
            </p>
            <div className="grid gap-2 pt-1">
              {latestRates.map(([label, value]) => (
                <div className="flex justify-between gap-3" key={label}>
                  <span className="text-slate-600 dark:text-slate-400">{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <DataTable
          columns={[
            "Data",
            "Wiek",
            "Kapital",
            "Okres swiadczenia",
            "Emerytura miesieczna",
          ]}
        >
          {simulations.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{new Date(item.createdAt).toLocaleString("pl-PL")}</TableCell>
              <TableCell>{item.retirementAge} lat</TableCell>
              <TableCell>{formatMoney(item.projectedCapital)}</TableCell>
              <TableCell>{formatMonthsAsYears(item.lifeExpectancyMonths)}</TableCell>
              <TableCell className="font-semibold">
                {formatMoney(item.projectedMonthlyPension)}
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </ModulePage>
  );
}
