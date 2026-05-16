import type { UserRole } from "@/types/domain";

export type AppRoute = {
  href: string;
  label: string;
  area: "Pracownik" | "Kadry" | "Administracja" | "System";
  roles: UserRole[];
};

export const appRoutes: AppRoute[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    area: "System",
    roles: ["Employee", "HR", "Admin"],
  },
  {
    href: "/payrolls",
    label: "Moje wyplaty",
    area: "Pracownik",
    roles: ["Employee"],
  },
  {
    href: "/pension/private-data",
    label: "Dane emerytalne",
    area: "Pracownik",
    roles: ["Employee"],
  },
  {
    href: "/pension/simulations",
    label: "Symulacje",
    area: "Pracownik",
    roles: ["Employee"],
  },
  {
    href: "/hr/employees",
    label: "Pracownicy",
    area: "Kadry",
    roles: ["HR"],
  },
  {
    href: "/hr/payrolls",
    label: "Wyplaty pracownikow",
    area: "Kadry",
    roles: ["HR"],
  },
  {
    href: "/hr/payrolls/new",
    label: "Nalicz wyplate",
    area: "Kadry",
    roles: ["HR"],
  },
  {
    href: "/admin/users",
    label: "Uzytkownicy",
    area: "Administracja",
    roles: ["Admin"],
  },
  {
    href: "/admin/audit-logs",
    label: "Logi audytowe",
    area: "Administracja",
    roles: ["Admin"],
  },
  {
    href: "/admin/settings",
    label: "Konfiguracja",
    area: "Administracja",
    roles: ["Admin"],
  },
];

export function canAccessRoute(role: UserRole, href: string) {
  const route = appRoutes.find((item) => item.href === href);
  return route ? route.roles.includes(role) : false;
}

export function getRoutesForRole(role: UserRole) {
  return appRoutes.filter((route) => route.roles.includes(role));
}
