import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName } from "@/components/ui/Field";

export default function LoginPage() {
  return (
    <main className="app-surface grid min-h-screen place-items-center bg-slate-50 px-5 py-10 dark:bg-slate-950">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="mb-6 block text-center">
          <p className="text-sm font-medium uppercase tracking-normal text-teal-700 dark:text-teal-300">PWSI</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">
            Pasek placowy
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Panel demonstracyjny systemu informacji o wyplatach.
          </p>
        </Link>
        <Card>
          <CardHeader
            title="Logowanie"
            description="Widok demonstracyjny dla kont z mockowych danych projektu."
          />
          <CardBody>
            <form className="space-y-4">
              <Field label="Login" htmlFor="username">
                <input id="username" className={inputClassName} defaultValue="anna.nowak" />
              </Field>
              <Field label="Haslo" htmlFor="password">
                <input
                  id="password"
                  type="password"
                  className={inputClassName}
                  defaultValue="demo"
                />
              </Field>
              <Link
                href="/dashboard"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-teal-700 bg-teal-700 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:border-teal-500 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
              >
                <LockKeyhole className="h-4 w-4" />
                <span>Zaloguj</span>
              </Link>
            </form>
          </CardBody>
        </Card>
        <div className="mt-4 flex justify-center">
          <ButtonLink href="/dashboard">Wroc do dashboardu</ButtonLink>
        </div>
      </div>
    </main>
  );
}
