import { AppShell } from "@/components/layout/AppShell";

type ModulePageProps = {
  title: string;
  eyebrow: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function ModulePage({
  title,
  eyebrow,
  description,
  actions,
  children,
}: ModulePageProps) {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700 dark:text-teal-300">{eyebrow}</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </AppShell>
  );
}
