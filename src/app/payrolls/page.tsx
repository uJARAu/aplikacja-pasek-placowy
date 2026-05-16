import { Download, Eye, Filter } from "lucide-react";
import Link from "next/link";
import { ModulePage } from "@/components/layout/ModulePage";
import { PayrollStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName } from "@/components/ui/Field";
import { StatusCard } from "@/components/ui/StatusCard";
import { DataTable, TableCell, TableRow } from "@/components/ui/Table";
import { formatMoney, formatPeriod } from "@/lib/formatters";
import { mockDb } from "@/lib/mock-db";
import {
  getSearchParam,
  monthParamIndex,
  payrollPeriodIndex,
  type PageSearchParams,
} from "@/lib/search-params";

type PayrollsPageProps = {
  searchParams?: Promise<PageSearchParams>;
};

export default async function PayrollsPage({ searchParams }: PayrollsPageProps) {
  const params = await searchParams;
  const fromMonth = getSearchParam(params, "from") || "2026-03";
  const toMonth = getSearchParam(params, "to") || "2026-04";
  const status = getSearchParam(params, "status") || "Approved";
  const fromIndex = monthParamIndex(fromMonth);
  const toIndex = monthParamIndex(toMonth);
  const employee = mockDb.employeeProfiles[0];
  const payrolls = mockDb.payrolls.filter((payroll) => {
    const periodIndex = payrollPeriodIndex(payroll.periodMonth, payroll.periodYear);
    const matchesEmployee = payroll.employeeProfileId === employee.id;
    const matchesFrom = fromIndex === null || periodIndex >= fromIndex;
    const matchesTo = toIndex === null || periodIndex <= toIndex;
    const matchesStatus = !status || payroll.status === status;

    return matchesEmployee && matchesFrom && matchesTo && matchesStatus;
  });
  const totalNet = payrolls.reduce((sum, payroll) => sum + payroll.netAmount, 0);
  const totalPension = payrolls.reduce((sum, payroll) => sum + payroll.pensionContribution, 0);

  return (
    <ModulePage
      title="Moje wyplaty"
      eyebrow="Pracownik"
      description="Historia paskow placowych zalogowanego pracownika. Widok pilnuje zasady z PDF-a: pracownik oglada tylko wlasne dane."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard label="Liczba paskow" value={String(payrolls.length)} helper="Mock: Anna Nowak" />
        <StatusCard label="Suma netto" value={formatMoney(totalNet)} tone="teal" />
        <StatusCard label="Skladki emerytalne" value={formatMoney(totalPension)} tone="rose" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Filtry"
          description="Zakres okresu i status paska dla zalogowanego pracownika."
        />
        <CardBody>
          <form action="/payrolls" className="grid gap-4 md:grid-cols-4">
            <Field label="Od miesiaca" htmlFor="fromMonth">
              <input
                id="fromMonth"
                className={inputClassName}
                defaultValue={fromMonth}
                name="from"
                type="month"
              />
            </Field>
            <Field label="Do miesiaca" htmlFor="toMonth">
              <input
                id="toMonth"
                className={inputClassName}
                defaultValue={toMonth}
                name="to"
                type="month"
              />
            </Field>
            <Field label="Status" htmlFor="status">
              <select id="status" className={inputClassName} defaultValue={status} name="status">
                <option value="">Wszystkie</option>
                <option value="Approved">Zatwierdzone</option>
                <option value="Draft">Robocze</option>
              </select>
            </Field>
            <div className="flex items-end">
              <Button icon={Filter} type="submit">
                Filtruj
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="mt-6">
        <DataTable columns={["Okres", "Brutto", "Emerytalna", "Netto", "Status", "Akcje"]}>
          {payrolls.map((payroll) => (
            <TableRow key={payroll.id}>
              <TableCell className="font-medium">
                {formatPeriod(payroll.periodMonth, payroll.periodYear)}
              </TableCell>
              <TableCell>{formatMoney(payroll.grossAmount)}</TableCell>
              <TableCell>{formatMoney(payroll.pensionContribution)}</TableCell>
              <TableCell>{formatMoney(payroll.netAmount)}</TableCell>
              <TableCell>
                <PayrollStatusBadge status={payroll.status} />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/payrolls/${payroll.id}`}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Podglad</span>
                  </Link>
                  <Link
                    href={`/payrolls/${payroll.id}/print`}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </ModulePage>
  );
}
