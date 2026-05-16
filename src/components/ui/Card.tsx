type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-lg border border-slate-200 bg-white/95 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20 ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-base font-semibold tracking-normal text-slate-950 dark:text-slate-50">{title}</h3>
        {description ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function CardBody({ children, className = "" }: CardProps) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
