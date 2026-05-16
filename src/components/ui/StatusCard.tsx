type StatusCardProps = {
  label: string;
  value: string;
  helper?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "neutral" | "teal" | "rose";
};

const toneClassName = {
  neutral:
    "border-slate-200 bg-white/95 text-slate-950 shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-50 dark:shadow-black/20",
  teal:
    "border-teal-200 bg-teal-50 text-teal-950 shadow-teal-900/5 dark:border-teal-900/70 dark:bg-teal-950/40 dark:text-teal-50 dark:shadow-black/20",
  rose:
    "border-rose-200 bg-rose-50 text-rose-950 shadow-rose-900/5 dark:border-rose-900/70 dark:bg-rose-950/35 dark:text-rose-50 dark:shadow-black/20",
};

export function StatusCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "neutral",
}: StatusCardProps) {
  return (
    <div className={`rounded-lg border p-4 shadow-sm backdrop-blur ${toneClassName[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal">{value}</p>
        </div>
        {Icon ? (
          <div className="rounded-md border border-current/10 bg-white/60 p-2 dark:bg-white/5">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>
      {helper ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{helper}</p> : null}
    </div>
  );
}
