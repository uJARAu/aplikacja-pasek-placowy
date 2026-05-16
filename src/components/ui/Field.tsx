type FieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
};

export function Field({ label, htmlFor, children, hint }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor={htmlFor}>
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
}

export const inputClassName =
  "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-500 dark:focus:ring-teal-500/20";

export const textareaClassName =
  "min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-500 dark:focus:ring-teal-500/20";
