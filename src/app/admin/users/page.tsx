import { AdminUsersManager } from "@/features/admin/AdminUsersManager";
import { mockDb } from "@/lib/mock-db";
import { getSearchParam, type PageSearchParams } from "@/lib/search-params";

type AdminUsersPageProps = {
  searchParams?: Promise<PageSearchParams>;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const params = await searchParams;
  const query = getSearchParam(params, "q");
  const role = getSearchParam(params, "role");
  const status = getSearchParam(params, "status") || "active";

  return (
    <AdminUsersManager
      initialEmployeeProfiles={mockDb.employeeProfiles}
      initialFilters={{ query, role, status }}
      initialUsers={mockDb.users}
    />
  );
}
