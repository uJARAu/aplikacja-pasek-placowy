import { Search, UserPlus } from "lucide-react";
import { ModulePage } from "@/components/layout/ModulePage";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName } from "@/components/ui/Field";
import { StatusCard } from "@/components/ui/StatusCard";
import { DataTable, TableCell, TableRow } from "@/components/ui/Table";
import { mockDb } from "@/lib/mock-db";
import { getSearchParam, matchesText, type PageSearchParams } from "@/lib/search-params";

type EmployeesPageProps = {
  searchParams?: Promise<PageSearchParams>;
};

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
  const params = await searchParams;
  const query = getSearchParam(params, "q");
  const department = getSearchParam(params, "department");
  const employmentStatus = getSearchParam(params, "status") || "active";
  const departments = Array.from(
    new Set(mockDb.employeeProfiles.map((employee) => employee.department)),
  );
  const employees = mockDb.employeeProfiles.filter((employee) => {
    const fullText = `${employee.firstName} ${employee.lastName} ${employee.employeeNumber}`;
    const matchesDepartment = !department || employee.department === department;
    const matchesStatus = employmentStatus === "all" || employmentStatus === "active";

    return matchesText(fullText, query) && matchesDepartment && matchesStatus;
  });

  return (
    <ModulePage
      title="Pracownicy"
      eyebrow="Kadry"
      description="Widok kadrowy z lista profili pracownikow. Prywatne dane emerytalne pozostaja poza tym modulem."
      actions={<ButtonLink href="/hr/payrolls/new" icon={UserPlus} tone="primary">Nalicz wyplate</ButtonLink>}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard label="Profile kadrowe" value={String(mockDb.employeeProfiles.length)} />
        <StatusCard label="Dzialy" value="2" tone="teal" />
        <StatusCard label="Dostep kadr" value="Placowy" tone="rose" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Wyszukiwanie"
          description="Filtrowanie profili po nazwisku, numerze pracownika, dziale i statusie."
        />
        <CardBody>
          <form action="/hr/employees" className="grid gap-4 md:grid-cols-4">
            <Field label="Nazwisko lub numer" htmlFor="employeeSearch">
              <input
                id="employeeSearch"
                className={inputClassName}
                defaultValue={query}
                name="q"
                placeholder="np. Kowalski"
              />
            </Field>
            <Field label="Dzial" htmlFor="department">
              <select
                id="department"
                className={inputClassName}
                defaultValue={department}
                name="department"
              >
                <option value="">Wszystkie</option>
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status zatrudnienia" htmlFor="employmentStatus">
              <select
                id="employmentStatus"
                className={inputClassName}
                defaultValue={employmentStatus}
                name="status"
              >
                <option value="active">Aktywni</option>
                <option value="all">Wszyscy</option>
              </select>
            </Field>
            <div className="flex items-end">
              <Button icon={Search} type="submit">
                Szukaj
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="mt-6">
        <DataTable columns={["Numer", "Pracownik", "Dzial", "Stanowisko", "Zatrudnienie", "Status"]}>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.employeeNumber}</TableCell>
              <TableCell>{employee.firstName} {employee.lastName}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{new Date(employee.employmentDate).toLocaleDateString("pl-PL")}</TableCell>
              <TableCell><Badge tone="teal">Aktywny</Badge></TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </ModulePage>
  );
}
