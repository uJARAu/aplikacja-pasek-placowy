import { Landmark, Play } from "lucide-react";
import { ModulePage } from "@/components/layout/ModulePage";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName } from "@/components/ui/Field";
import { StatusCard } from "@/components/ui/StatusCard";
import { DataTable, TableCell, TableRow } from "@/components/ui/Table";
import { defaultPensionSimulationParams } from "@/lib/calculations/pension";
import { formatMoney } from "@/lib/formatters";
import { mockDb } from "@/lib/mock-db";

export default function PensionSimulationsPage() {
  const simulation = mockDb.pensionSimulations[0];

  return (
    <ModulePage
      title="Symulacje emerytalne"
      eyebrow="Pracownik"
      description="Widok zbiera parametry symulacji i pokazuje wynik na podstawie mockowych danych historycznych oraz tablic GUS."
      actions={<Button icon={Play} tone="primary">Uruchom symulacje</Button>}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          label="Prognozowany kapital"
          value={formatMoney(simulation.projectedCapital)}
          icon={Landmark}
        />
        <StatusCard
          label="Miesieczna emerytura"
          value={formatMoney(simulation.projectedMonthlyPension)}
          tone="teal"
        />
        <StatusCard
          label="Dalsze trwanie zycia"
          value={`${simulation.lifeExpectancyMonths} mies.`}
          tone="rose"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader title="Parametry symulacji" />
          <CardBody>
            <form className="grid gap-4 md:grid-cols-2">
              <Field label="Wiek emerytalny" htmlFor="retirementAge">
                <input
                  id="retirementAge"
                  className={inputClassName}
                  defaultValue={defaultPensionSimulationParams.retirementAge}
                />
              </Field>
              <Field label="Wzrost wynagrodzenia" htmlFor="salaryGrowthRate">
                <input
                  id="salaryGrowthRate"
                  className={inputClassName}
                  defaultValue={`${defaultPensionSimulationParams.salaryGrowthRate * 100}%`}
                />
              </Field>
              <Field label="Wzrost skladek" htmlFor="contributionGrowthRate">
                <input
                  id="contributionGrowthRate"
                  className={inputClassName}
                  defaultValue={`${defaultPensionSimulationParams.contributionGrowthRate * 100}%`}
                />
              </Field>
              <Field label="Waloryzacja" htmlFor="indexationRate">
                <input
                  id="indexationRate"
                  className={inputClassName}
                  defaultValue={`${defaultPensionSimulationParams.indexationRate * 100}%`}
                />
              </Field>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Przyjete dane" description="Podglad danych uzytych w ostatnim wyniku." />
          <CardBody className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-400">Kapital poczatkowy</span>
              <strong>{formatMoney(simulation.initialCapitalUsed)}</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-400">Historyczne skladki</span>
              <strong>{formatMoney(simulation.historicalContributionsUsed)}</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-400">Tablica GUS</span>
              <strong>{simulation.lifeExpectancyMonths} mies.</strong>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <DataTable columns={["Data", "Wiek", "Kapital", "Emerytura miesieczna"]}>
          {mockDb.pensionSimulations.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{new Date(item.createdAt).toLocaleString("pl-PL")}</TableCell>
              <TableCell>{item.retirementAge}</TableCell>
              <TableCell>{formatMoney(item.projectedCapital)}</TableCell>
              <TableCell className="font-semibold">{formatMoney(item.projectedMonthlyPension)}</TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </ModulePage>
  );
}
