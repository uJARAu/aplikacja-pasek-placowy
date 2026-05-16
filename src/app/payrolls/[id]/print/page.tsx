import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PayrollPrintDocument } from "@/features/payrolls/PayrollPrintDocument";
import { PrintActions } from "@/features/payrolls/PrintActions";
import {
  getPayrollEmployee,
  getPayrollOrFallback,
  getPrintablePayrollComponents,
} from "@/lib/payroll-view";

export default async function PayrollPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payroll = getPayrollOrFallback(id);
  const employee = getPayrollEmployee(payroll);
  const components = getPrintablePayrollComponents(payroll);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 dark:bg-slate-950 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex w-full max-w-[210mm] flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/payrolls/${payroll.id}`}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Wroc do szczegolow</span>
        </Link>
        <PrintActions />
      </div>

      <PayrollPrintDocument
        components={components}
        employee={employee}
        payroll={payroll}
      />
    </main>
  );
}
