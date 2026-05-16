import { KeyRound, Plus, Search, UserCog } from "lucide-react";
import { ModulePage } from "@/components/layout/ModulePage";
import { Badge, RoleBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName } from "@/components/ui/Field";
import { StatusCard } from "@/components/ui/StatusCard";
import { DataTable, TableCell, TableRow } from "@/components/ui/Table";
import { mockDb } from "@/lib/mock-db";
import { getSearchParam, matchesText, type PageSearchParams } from "@/lib/search-params";

type AdminUsersPageProps = {
  searchParams?: Promise<PageSearchParams>;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const params = await searchParams;
  const query = getSearchParam(params, "q");
  const role = getSearchParam(params, "role");
  const status = getSearchParam(params, "status") || "active";
  const activeUsers = mockDb.users.filter((user) => user.isActive).length;
  const users = mockDb.users.filter((user) => {
    const fullText = `${user.username} ${user.email}`;
    const matchesRole = !role || user.role === role;
    const matchesStatus =
      status === "all" ||
      (status === "active" && user.isActive) ||
      (status === "inactive" && !user.isActive);

    return matchesText(fullText, query) && matchesRole && matchesStatus;
  });

  return (
    <ModulePage
      title="Uzytkownicy"
      eyebrow="Administracja"
      description="Administrator zarzadza kontami i rolami, ale nie ma w tym module dostepu do danych placowych."
      actions={<Button icon={Plus} tone="primary">Nowe konto</Button>}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard label="Konta" value={String(mockDb.users.length)} />
        <StatusCard label="Aktywne" value={String(activeUsers)} tone="teal" />
        <StatusCard label="Role" value="3" tone="rose" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Filtry uzytkownikow"
          description="Wyszukiwanie kont administracyjnych, kadrowych i pracowniczych."
        />
        <CardBody>
          <form action="/admin/users" className="grid gap-4 md:grid-cols-4">
            <Field label="Login lub email" htmlFor="userSearch">
              <input
                id="userSearch"
                className={inputClassName}
                defaultValue={query}
                name="q"
                placeholder="np. anna.nowak"
              />
            </Field>
            <Field label="Rola" htmlFor="role">
              <select id="role" className={inputClassName} defaultValue={role} name="role">
                <option value="">Wszystkie</option>
                <option value="Employee">Pracownik</option>
                <option value="HR">Kadry</option>
                <option value="Admin">Administrator</option>
              </select>
            </Field>
            <Field label="Status" htmlFor="userStatus">
              <select
                id="userStatus"
                className={inputClassName}
                defaultValue={status}
                name="status"
              >
                <option value="active">Aktywne</option>
                <option value="inactive">Nieaktywne</option>
                <option value="all">Wszystkie</option>
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
        <DataTable columns={["Login", "Email", "Rola", "Status", "Wymus zmiane hasla", "Akcje"]}>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell><RoleBadge role={user.role} /></TableCell>
              <TableCell>{user.isActive ? <Badge tone="teal">Aktywne</Badge> : <Badge tone="rose">Nieaktywne</Badge>}</TableCell>
              <TableCell>{user.mustChangePassword ? "Tak" : "Nie"}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    type="button"
                  >
                    <UserCog className="h-4 w-4" />
                    <span>Edytuj</span>
                  </button>
                  <button
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    type="button"
                  >
                    <KeyRound className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      </div>
    </ModulePage>
  );
}
