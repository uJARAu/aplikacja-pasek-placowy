import { Filter, ShieldAlert } from "lucide-react";
import { ModulePage } from "@/components/layout/ModulePage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName } from "@/components/ui/Field";
import { StatusCard } from "@/components/ui/StatusCard";
import { DataTable, TableCell, TableRow } from "@/components/ui/Table";
import { getUser, mockDb } from "@/lib/mock-db";
import { getSearchParam, matchesText, type PageSearchParams } from "@/lib/search-params";

type AuditLogsPageProps = {
  searchParams?: Promise<PageSearchParams>;
};

export default async function AuditLogsPage({ searchParams }: AuditLogsPageProps) {
  const params = await searchParams;
  const dateFrom = getSearchParam(params, "from") || "2026-01-01";
  const dateTo = getSearchParam(params, "to") || "2026-05-16";
  const action = getSearchParam(params, "action");
  const result = getSearchParam(params, "result");
  const auditLogs = mockDb.auditLogs.filter((log) => {
    const logDate = log.createdAt.slice(0, 10);
    const matchesFrom = !dateFrom || logDate >= dateFrom;
    const matchesTo = !dateTo || logDate <= dateTo;
    const matchesAction = matchesText(log.action, action);
    const matchesResult = !result || log.result === result;

    return matchesFrom && matchesTo && matchesAction && matchesResult;
  });
  const deniedLogs = auditLogs.filter((log) => log.result === "Denied").length;

  return (
    <ModulePage
      title="Logi audytowe"
      eyebrow="Administracja"
      description="Widok rozliczalnosci operacji. Zgodnie z PDF-em logi sa tylko do odczytu dla administratora."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard label="Wpisy" value={String(auditLogs.length)} icon={ShieldAlert} />
        <StatusCard label="Odmowy dostepu" value={String(deniedLogs)} tone="rose" />
        <StatusCard label="Tryb" value="Read-only" tone="teal" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Filtry audytu"
          description="Zakres czasu, akcja i wynik operacji."
        />
        <CardBody>
          <form action="/admin/audit-logs" className="grid gap-4 md:grid-cols-5">
            <Field label="Od" htmlFor="auditFrom">
              <input
                id="auditFrom"
                className={inputClassName}
                defaultValue={dateFrom}
                name="from"
                type="date"
              />
            </Field>
            <Field label="Do" htmlFor="auditTo">
              <input
                id="auditTo"
                className={inputClassName}
                defaultValue={dateTo}
                name="to"
                type="date"
              />
            </Field>
            <Field label="Akcja" htmlFor="auditAction">
              <input
                id="auditAction"
                className={inputClassName}
                defaultValue={action}
                name="action"
                placeholder="np. APPROVE_PAYROLL"
              />
            </Field>
            <Field label="Wynik" htmlFor="auditResult">
              <select
                id="auditResult"
                className={inputClassName}
                defaultValue={result}
                name="result"
              >
                <option value="">Wszystkie</option>
                <option value="Success">Success</option>
                <option value="Denied">Denied</option>
                <option value="Error">Error</option>
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
        <DataTable columns={["Czas", "Uzytkownik", "Akcja", "Encja", "Wynik", "Szczegoly"]}>
          {auditLogs.map((log) => {
            const user = getUser(log.userId);

            return (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.createdAt).toLocaleString("pl-PL")}</TableCell>
                <TableCell>{user?.username ?? "System"}</TableCell>
                <TableCell className="font-medium">{log.action}</TableCell>
                <TableCell>{log.entityName}</TableCell>
                <TableCell>
                  <Badge tone={log.result === "Success" ? "teal" : "rose"}>{log.result}</Badge>
                </TableCell>
                <TableCell className="max-w-xs text-slate-600">{log.details}</TableCell>
              </TableRow>
            );
          })}
        </DataTable>
      </div>
    </ModulePage>
  );
}
