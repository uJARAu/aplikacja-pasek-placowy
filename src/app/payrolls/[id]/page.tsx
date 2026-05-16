import { Download, Printer } from "lucide-react";
import { ModulePage } from "@/components/layout/ModulePage";
import { PayrollStatusBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusCard } from "@/components/ui/StatusCard";
import { DataTable, TableCell, TableRow } from "@/components/ui/Table";
import { formatMoney, formatPeriod } from "@/lib/formatters";
import { getEmployeeName } from "@/lib/mock-db";
import {
  getPayrollOrFallback,
  getPrintablePayrollComponents,
} from "@/lib/payroll-view";

export default async function PayrollDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payroll = getPayrollOrFallback(id);
  const visibleComponents = getPrintablePayrollComponents(payroll);

  return (
    <ModulePage
      title="Szczegoly wyplaty"
      eyebrow={`${getEmployeeName(payroll.employeeProfileId)} / ${formatPeriod(
        payroll.periodMonth,
        payroll.periodYear,
      )}`}
      description="Pasek placowy pokazuje brutto, skladki, podatek i netto. Akcje PDF oraz druk prowadza do widoku wydruku."
      actions={
        <>
          <ButtonLink href={`/payrolls/${payroll.id}/print`} icon={Printer}>
            Drukuj
          </ButtonLink>
          <ButtonLink href={`/payrolls/${payroll.id}/print`} icon={Download} tone="primary">
            PDF
          </ButtonLink>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <StatusCard label="Brutto" value={formatMoney(payroll.grossAmount)} />
        <StatusCard label="Skladki spoleczne" value={formatMoney(payroll.socialContributionsTotal)} />
        <StatusCard label="Skladka zdrowotna" value={formatMoney(payroll.healthContribution)} />
        <StatusCard label="Netto" value={formatMoney(payroll.netAmount)} tone="teal" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Podsumowanie"
          description="Dane zapisane w momencie naliczenia wyplaty."
          action={<PayrollStatusBadge status={payroll.status} />}
        />
        <CardBody className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Identyfikator</p>
            <p className="mt-1 font-medium text-slate-950 dark:text-slate-50">{payroll.id}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Zaliczka PIT</p>
            <p className="mt-1 font-medium text-slate-950 dark:text-slate-50">{formatMoney(payroll.pitAdvance)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Zatwierdzono</p>
            <p className="mt-1 font-medium text-slate-950 dark:text-slate-50">
              {payroll.approvedAt ? new Date(payroll.approvedAt).toLocaleDateString("pl-PL") : "Nie"}
            </p>
          </div>
        </CardBody>
      </Card>

      <div className="mt-6">
        <DataTable columns={["Skladnik", "Kwota", "Podstawa", "Stawka", "Opis"]}>
          {visibleComponents.map((component) => (
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
      </div>
    </ModulePage>
  );
}
