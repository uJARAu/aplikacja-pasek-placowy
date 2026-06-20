"use client";

import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  FileText,
  Landmark,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ModulePage } from "@/components/layout/ModulePage";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusCard } from "@/components/ui/StatusCard";
import { DemoLoginPanel } from "@/features/auth/DemoLoginPanel";
import { formatMoney, formatRole } from "@/lib/formatters";
import { useDemoSession } from "@/lib/use-demo-session";
import type { UserRole } from "@/types/domain";

type DashboardStats = {
  approvedPayrollCount: number;
  draftPayrollCount: number;
  employeeCount: number;
  totalGross: number;
  totalPension: number;
  userCount: number;
};

type DashboardHomeProps = {
  stats: DashboardStats;
};

type ModuleCard = {
  description: string;
  href: string;
  label: string;
  roles: UserRole[];
  title: string;
};

const moduleCards: ModuleCard[] = [
  {
    title: "Moje paski",
    description: "Historia wyplat i szczegoly paska placowego pracownika.",
    href: "/payrolls",
    label: "Otworz paski",
    roles: ["Employee"],
  },
  {
    title: "Symulacje emerytalne",
    description: "Przeliczanie prognozy emerytury na danych demonstracyjnych.",
    href: "/pension/simulations",
    label: "Uruchom symulacje",
    roles: ["Employee"],
  },
  {
    title: "Kadry",
    description: "Pracownicy, wyplaty i naliczanie brutto-netto.",
    href: "/hr/payrolls",
    label: "Otworz kadry",
    roles: ["HR"],
  },
  {
    title: "Nalicz wyplate",
    description: "Formularz naliczania nowego fikcyjnego paska placowego.",
    href: "/hr/payrolls/new",
    label: "Nalicz wyplate",
    roles: ["HR"],
  },
  {
    title: "Uzytkownicy",
    description: "Konta, role, dane osobowe i uprawnienia demonstracyjne.",
    href: "/admin/users",
    label: "Zarzadzaj",
    roles: ["Admin"],
  },
  {
    title: "Audyt i konfiguracja",
    description: "Logi audytowe oraz parametry systemowe administratora.",
    href: "/admin/audit-logs",
    label: "Otworz audyt",
    roles: ["Admin"],
  },
];

function getPrimaryActions(role: UserRole) {
  if (role === "Employee") {
    return (
      <>
        <ButtonLink href="/payrolls" icon={FileText} tone="primary">
          Moje paski
        </ButtonLink>
        <ButtonLink href="/pension/simulations" icon={Landmark}>
          Symulacje
        </ButtonLink>
      </>
    );
  }

  if (role === "HR") {
    return (
      <>
        <ButtonLink href="/hr/payrolls/new" icon={ClipboardList} tone="primary">
          Nalicz wyplate
        </ButtonLink>
        <ButtonLink href="/hr/employees" icon={Users}>
          Pracownicy
        </ButtonLink>
      </>
    );
  }

  return (
    <>
      <ButtonLink href="/admin/users" icon={ShieldCheck} tone="primary">
        Uzytkownicy
      </ButtonLink>
      <ButtonLink href="/admin/audit-logs" icon={FileText}>
        Logi audytowe
      </ButtonLink>
    </>
  );
}

export function DashboardHome({ stats }: DashboardHomeProps) {
  const { session } = useDemoSession();
  const visibleModules = session
    ? moduleCards.filter((card) => card.roles.includes(session.role))
    : [];

  if (!session) {
    return (
      <ModulePage
        title="Dashboard"
        eyebrow="Brak aktywnej sesji"
        description="Zaloguj sie jednym z kont pokazowych, aby zobaczyc pulpit dopasowany do roli i odblokowac menu po lewej stronie."
        actions={<ButtonLink href="/login" icon={UserRound} tone="primary">Logowanie</ButtonLink>}
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <Card>
            <CardHeader
              title="Pusty pulpit"
              description="Po wylogowaniu aplikacja nie pokazuje danych roli. Ten kafelek prowadzi do logowania demonstracyjnego."
            />
            <CardBody>
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950/35">
                <UserRound className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 font-semibold text-slate-950 dark:text-slate-50">
                  Nie wybrano konta
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Zaloguj sie jako pracownik, kadry albo administrator, aby zobaczyc inne
                  uprawnienia i zestaw funkcji.
                </p>
              </div>
            </CardBody>
          </Card>
          <DemoLoginPanel redirectTo="/dashboard" />
        </div>
      </ModulePage>
    );
  }

  return (
    <ModulePage
      title="Dashboard"
      eyebrow={`Zalogowano jako ${formatRole(session.role)}`}
      description="Pulpit pokazuje tylko funkcje dostepne dla aktualnego konta demonstracyjnego."
      actions={getPrimaryActions(session.role)}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          label="Uzytkownicy"
          value={String(stats.userCount)}
          helper="Konta demonstracyjne z haslami"
          icon={Users}
        />
        <StatusCard
          label="Pracownicy"
          value={String(stats.employeeCount)}
          helper="Profile osobowe i kadrowe"
          icon={ShieldCheck}
        />
        <StatusCard
          label="Zatwierdzone brutto"
          value={formatMoney(stats.totalGross)}
          helper={`${stats.approvedPayrollCount} zapisane wyplaty`}
          icon={FileText}
          tone="teal"
        />
        <StatusCard
          label="Skladki emerytalne"
          value={formatMoney(stats.totalPension)}
          helper="Suma z zatwierdzonych paskow"
          icon={Landmark}
          tone="rose"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader
            title="Dostepne moduly"
            description="Kafelki sa prawdziwymi przejsciami do widokow dla aktualnej roli."
          />
          <CardBody className="grid gap-3 md:grid-cols-2">
            {visibleModules.map((item) => (
              <Link
                className="group rounded-lg border border-slate-200 bg-white/60 p-4 transition hover:border-teal-300 hover:bg-teal-50 dark:border-slate-800 dark:bg-slate-950/35 dark:hover:border-teal-800 dark:hover:bg-teal-950/30"
                href={item.href}
                key={item.href}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-950 dark:text-slate-50">
                    {item.title}
                  </h3>
                  <Badge tone="teal">Dostepne</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-300">
                  {item.label}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Sesja i stan projektu" description="Informacje dla prezentacji." />
          <CardBody>
            <div className="rounded-lg border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-950/35">
              <p className="text-sm text-slate-600 dark:text-slate-400">Aktywne konto</p>
              <p className="mt-1 font-semibold text-slate-950 dark:text-slate-50">
                {session.displayName}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {session.username} / {formatRole(session.role)}
              </p>
            </div>
            <div className="mt-3 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/70 dark:bg-amber-950/35">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" />
              <p className="text-sm leading-6 text-amber-900 dark:text-amber-100">
                {stats.draftPayrollCount} wyplata robocza pokazuje obieg szkicu przed zatwierdzeniem.
              </p>
            </div>
            <div className="mt-3 rounded-lg border border-slate-200 p-3 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-400">
              Martwe etykiety PDF zostaly zastapione linkami do modulow. Logowanie jest lokalne i
              pokazowe, ale zmienia widoczne menu oraz pulpit.
            </div>
          </CardBody>
        </Card>
      </div>
    </ModulePage>
  );
}
