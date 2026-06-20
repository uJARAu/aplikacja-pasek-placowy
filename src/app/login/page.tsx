import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import { DemoLoginPanel } from "@/features/auth/DemoLoginPanel";

export default function LoginPage() {
  return (
    <main className="app-surface grid min-h-screen place-items-center bg-slate-50 px-5 py-10 dark:bg-slate-950">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-lg">
        <Link href="/dashboard" className="mb-6 block text-center">
          <p className="text-sm font-medium uppercase tracking-normal text-teal-700 dark:text-teal-300">
            PWSI
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">
            Pasek placowy
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Panel demonstracyjny systemu informacji o wyplatach.
          </p>
        </Link>
        <DemoLoginPanel redirectTo="/dashboard" />
        <div className="mt-4 flex justify-center">
          <ButtonLink href="/dashboard">Wroc do dashboardu</ButtonLink>
        </div>
      </div>
    </main>
  );
}
