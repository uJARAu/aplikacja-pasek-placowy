import { Eye, FilePlus2, Filter } from "lucide-react";
import Link from "next/link";
import { ModulePage } from "@/components/layout/ModulePage";
import { PayrollStatusBadge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName } from "@/components/ui/Field";
import { StatusCard } from "@/components/ui/StatusCard";
import { DataTable, TableCell, TableRow } from "@/components/ui/Table";
import { formatMoney, formatPeriod } from "@/lib/formatters";
import { getEmployeeName, mockDb } from "@/lib/mock-db";
import {
  getSearchParam,
  monthParamIndex,
  payrollPeriodIndex,
  type PageSearchParams,
} from "@/lib/search-params";

type HrPayrollsPageProps = {
  searchParams?: Promise<PageSearchParams>;
};

export default async function HrPayrollsPage({ searchParams }: HrPayrollsPageProps) {
  const params = await searchParams;
  const employee = getSearchParam(params, "employee");
  const fromMonth = getSearchParam(params, "from") || "2026-03";
  const toMonth = getSearchParam(params, "to") || "2026-05";
  const status = getSearchParam(params, "status");
  const fromIndex = monthParamIndex(fromMonth);
  const toIndex = monthParamIndex(toMonth);
  const payrolls = mockDb.payrolls.filter((payroll) => {
    const periodIndex = payrollPeriodIndex(payroll.periodMonth, payroll.periodYear);
    const matchesEmployee = !employee || payroll.employeeProfileId === employee;
    const matchesFrom = fromIndex === null || periodIndex >= fromIndex;
    const matchesTo = toIndex === null || periodIndex <= toIndex;
    const matchesStatus = !status || payroll.status === status;

    return matchesEmployee && matchesFrom && matchesTo && matchesStatus;
  });
  const draftCount = mockDb.payrolls.filter((payroll) => payroll.status === "Draft").length;
  const approvedCount = mockDb.payrolls.filter((payroll) => payroll.status === "Approved").length;
  const totalGross = mockDb.payrolls.reduce((sum, payroll) => sum + payroll.grossAmount, 0);

  return (
    <ModulePage
      title="Wyplaty pracownikow"
      eyebrow="Kadry"
      description="Kadry widza liste paskow wszystkich pracownikow, ale nie widza prywatnych danych emerytalnych ani historii symulacji."
      actions={<ButtonLink href="/hr/payrolls/new" icon={FilePlus2} tone="primary">Nowa wyplata</ButtonLink>}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard label="Robocze" value={String(draftCount)} tone="rose" />
        <StatusCard label="Zatwierdzone" value={String(approvedCount)} tone="teal" />
        <StatusCard label="Suma brutto" value={formatMoney(totalGross)} />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Filtry kadrowe"
          description="Zakres okresu, pracownik i status."
        />
        <CardBody>
          <form action="/hr/payrolls" className="grid gap-4 md:grid-cols-5">
            <Field label="Pracownik" htmlFor="employee">
              <select
                id="employee"
                className={inputClassName}
                defaultValue={employee}
                name="employee"
              >
                <option value="">Wszyscy</option>
                {mockDb.employeeProfiles.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.firstName} {item.lastName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Miesiac od" htmlFor="hrFromMonth">
              <input
                id="hrFromMonth"
                className={inputClassName}
                defaultValue={fromMonth}
                name="from"
                type="month"
              />
            </Field>
            <Field label="Miesiac do" htmlFor="hrToMonth">
              <input
                id="hrToMonth"
                className={inputClassName}
                defaultValue={toMonth}
                name="to"
                type="month"
              />
            </Field>
            <Field label="Status" htmlFor="hrPayrollStatus">
              <select
                id="hrPayrollStatus"
                className={inputClassName}
                defaultValue={status}
                name="status"
              >
                <option value="">Wszystkie</option>
                <option value="Draft">Robocza</option>
                <option value="Approved">Zatwierdzona</option>
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
        <DataTable columns={["Okres", "Pracownik", "Brutto", "Netto", "Status", "Akcje"]}>
          {payrolls.map((payroll) => (
            <TableRow key={payroll.id}>
              <TableCell className="font-medium">
                {formatPeriod(payroll.periodMonth, payroll.periodYear)}
              </TableCell>
              <TableCell>{getEmployeeName(payroll.employeeProfileId)}</TableCell>
              <TableCell>{formatMoney(payroll.grossAmount)}</TableCell>
              <TableCell>{formatMoney(payroll.netAmount)}</TableCell>
              <TableCell><PayrollStatusBadge status={payroll.status} /></TableCell>
              <TableCell>
                <Link
                  href={`/payrolls/${payroll.id}`}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  <Eye className="h-4 w-4" />
                  <span>Podglad</span>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </ModulePage>
  );
}
