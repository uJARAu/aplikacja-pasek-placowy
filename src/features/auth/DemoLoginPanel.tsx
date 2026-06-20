"use client";

import { LockKeyhole, LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName } from "@/components/ui/Field";
import {
  authenticateDemoUser,
  getDemoAccounts,
  saveDemoSession,
} from "@/lib/demo-auth";
import { useDemoSession } from "@/lib/use-demo-session";

type DemoLoginPanelProps = {
  redirectTo?: string;
  showTitle?: boolean;
};

const demoAccounts = getDemoAccounts();

export function DemoLoginPanel({
  redirectTo = "/dashboard",
  showTitle = true,
}: DemoLoginPanelProps) {
  const router = useRouter();
  const { session } = useDemoSession();
  const [username, setUsername] = useState(demoAccounts[0]?.user.username ?? "");
  const [password, setPassword] = useState(demoAccounts[0]?.password ?? "");
  const [error, setError] = useState<string | null>(null);

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextSession = authenticateDemoUser(username, password);

    if (!nextSession) {
      setError("Niepoprawny login lub haslo demo.");
      return;
    }

    saveDemoSession(nextSession);
    setError(null);
    router.push(redirectTo);
  }

  return (
    <Card>
      {showTitle ? (
        <CardHeader
          title={session ? "Aktywna sesja" : "Logowanie demo"}
          description={
            session
              ? "Mozesz kontynuowac prace albo wybrac inne konto demonstracyjne."
              : "Wybierz jedno z kont pokazowych albo wpisz login i haslo recznie."
          }
        />
      ) : null}
      <CardBody>
        {session ? (
          <div className="mb-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-950 dark:border-teal-900/70 dark:bg-teal-950/40 dark:text-teal-200">
            Zalogowano jako <strong>{session.displayName}</strong> ({session.username}).
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={submitLogin}>
          <Field label="Login" htmlFor="username">
            <input
              id="username"
              className={inputClassName}
              onChange={(event) => setUsername(event.target.value)}
              value={username}
            />
          </Field>
          <Field label="Haslo" htmlFor="password">
            <input
              id="password"
              className={inputClassName}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </Field>

          {error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          <Button icon={LockKeyhole} tone="primary" type="submit">
            Zaloguj
          </Button>
        </form>

        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
            Konta pokazowe
          </p>
          <div className="mt-3 grid gap-2">
            {demoAccounts.map((account) => (
              <button
                className="rounded-lg border border-slate-200 bg-white/60 p-3 text-left text-sm transition hover:border-teal-300 hover:bg-teal-50 dark:border-slate-800 dark:bg-slate-950/35 dark:hover:border-teal-800 dark:hover:bg-teal-950/30"
                key={account.user.id}
                onClick={() => {
                  setUsername(account.user.username);
                  setPassword(account.password);
                  setError(null);
                }}
                type="button"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-950 dark:text-slate-50">
                    {account.user.username}
                  </span>
                  <Badge tone={account.user.role === "Admin" ? "rose" : account.user.role === "HR" ? "indigo" : "teal"}>
                    {account.roleLabel}
                  </Badge>
                </div>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Haslo: <strong>{account.password}</strong>
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  {account.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
          <LogIn className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            To jest lokalne logowanie demonstracyjne. Sesja jest zapisywana w przegladarce,
            bez prawdziwej bazy i bez przesylania danych.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
