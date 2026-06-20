"use client";

import {
  Calculator,
  ClipboardList,
  FileText,
  Gauge,
  History,
  Landmark,
  LockKeyhole,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { appRoutes, getRoutesForRole } from "@/lib/rbac";
import type { UserRole } from "@/types/domain";

const groups = ["System", "Pracownik", "Kadry", "Administracja"] as const;

const routeIcons: Record<string, ComponentType<{ className?: string }>> = {
  "/dashboard": Gauge,
  "/payrolls": FileText,
  "/pension/private-data": LockKeyhole,
  "/pension/simulations": Landmark,
  "/hr/employees": Users,
  "/hr/payrolls": ClipboardList,
  "/hr/payrolls/new": Calculator,
  "/admin/users": ShieldCheck,
  "/admin/audit-logs": History,
  "/admin/settings": Settings,
};

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
}

export function SidebarNav({ role }: { role: UserRole | null }) {
  const pathname = usePathname();
  const availableRoutes = role
    ? getRoutesForRole(role)
    : appRoutes.filter((route) => route.href === "/dashboard");

  return (
    <nav className="mt-8 space-y-6">
      {groups.map((group) => {
        const routes = availableRoutes.filter((route) => route.area === group);

        if (routes.length === 0) {
          return null;
        }

        return (
          <div key={group}>
            <p className="px-3 text-xs font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-500">
              {group}
            </p>
            <div className="mt-2 space-y-1">
              {routes.map((route) => {
                const Icon = routeIcons[route.href] ?? FileText;
                const active = isActive(pathname, route.href);

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-teal-50 text-teal-800 shadow-sm dark:bg-teal-950/60 dark:text-teal-200"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{route.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
