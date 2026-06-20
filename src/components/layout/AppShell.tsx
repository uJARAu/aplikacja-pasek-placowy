"use client";

import { LogIn, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { clearDemoSession } from "@/lib/demo-auth";
import { formatRole } from "@/lib/formatters";
import { appRoutes, getRoutesForRole } from "@/lib/rbac";
import { useDemoSession } from "@/lib/use-demo-session";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const { session } = useDemoSession();
  const mobileRoutes = session
    ? getRoutesForRole(session.role)
    : appRoutes.filter((route) => route.href === "/dashboard");

  function logout() {
    clearDemoSession();
    router.push("/dashboard");
  }

  return (
    <div className="app-surface min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200/80 bg-white/90 px-5 py-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 lg:block">
        <div className="flex h-full flex-col">
          <Link
            href="/dashboard"
            className="block rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-teal-800 dark:hover:bg-slate-900"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-normal text-teal-700 dark:text-teal-300">
                  PWSI
                </p>
                <h1 className="mt-1 text-xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">
                  Pasek placowy
                </h1>
              </div>
              <Badge tone="teal">v1</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Fikcyjne paski placowe, role i symulacja emerytalna.
            </p>
          </Link>

          <SidebarNav role={session?.role ?? null} />

          <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/80">
            {session ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/70 dark:bg-teal-950/50 dark:text-teal-200">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                      {session.displayName}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {formatRole(session.role)}
                    </p>
                  </div>
                </div>
                <button
                  className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
                  onClick={logout}
                  type="button"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Wyloguj</span>
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                  Brak sesji
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Zaloguj sie jednym z kont pokazowych, aby zobaczyc menu dla roli.
                </p>
                <Link
                  className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-teal-700 bg-teal-700 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 dark:border-teal-500 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
                  href="/login"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Zaloguj sie</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 px-5 py-4 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-black/20 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/dashboard" className="font-semibold text-slate-950 dark:text-slate-50 lg:hidden">
              Pasek placowy
            </Link>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right text-sm sm:block">
                <p className="font-medium text-slate-900 dark:text-slate-100">Aplikacja PWSI</p>
                <p className="text-slate-500 dark:text-slate-400">
                  {session
                    ? `${session.username} / ${formatRole(session.role)}`
                    : "Brak aktywnej sesji"}
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {session ? "Zalogowano" : "Demo"}
              </div>
              <ThemeToggle />
            </div>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {mobileRoutes.slice(0, 6).map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
