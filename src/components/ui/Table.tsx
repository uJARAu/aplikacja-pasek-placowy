type DataTableProps = {
  columns: string[];
  children: React.ReactNode;
};

export function DataTable({ columns, children }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-t border-slate-200 align-top transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/35">
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 ${className} text-slate-700 dark:text-slate-300`}>{children}</td>;
}
