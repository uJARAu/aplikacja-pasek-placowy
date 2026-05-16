import type { EmployeeProfile, Payroll, PayrollComponent } from "@/types/domain";
import { formatMoney, formatPayrollStatus, formatPeriod } from "@/lib/formatters";

type PayrollPrintDocumentProps = {
  components: PayrollComponent[];
  employee?: EmployeeProfile;
  payroll: Payroll;
};

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-normal text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export function PayrollPrintDocument({
  components,
  employee,
  payroll,
}: PayrollPrintDocumentProps) {
  const employeeName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : "Nieznany pracownik";

  return (
    <article className="mx-auto w-full max-w-[210mm] bg-white p-8 text-slate-950 shadow-sm print:max-w-none print:p-0 print:shadow-none">
      <header className="flex items-start justify-between gap-8 border-b-2 border-slate-950 pb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-teal-700">
            Pasek placowy PWSI
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal">Pasek wyplaty</h1>
          <p className="mt-2 text-sm text-slate-600">
            Dokument demonstracyjny wygenerowany dla projektu zaliczeniowego.
          </p>
        </div>
        <div className="text-right text-sm leading-6">
          <p className="font-semibold text-slate-950">Fikcyjna Organizacja Sp. z o.o.</p>
          <p>ul. Przykladowa 1</p>
          <p>00-001 Warszawa</p>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-4 border-b border-slate-200 pb-6 md:grid-cols-4">
        <InfoItem label="Okres" value={formatPeriod(payroll.periodMonth, payroll.periodYear)} />
        <InfoItem label="Status" value={formatPayrollStatus(payroll.status)} />
        <InfoItem label="Numer dokumentu" value={payroll.id} />
        <InfoItem
          label="Data utworzenia"
          value={new Date(payroll.createdAt).toLocaleDateString("pl-PL")}
        />
      </section>

      <section className="mt-6 grid gap-6 border-b border-slate-200 pb-6 md:grid-cols-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-normal text-slate-500">
            Pracownik
          </h2>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-lg font-semibold text-slate-950">{employeeName}</p>
            <p>Numer pracownika: {employee?.employeeNumber ?? "-"}</p>
            <p>Dzial: {employee?.department ?? "-"}</p>
            <p>Stanowisko: {employee?.position ?? "-"}</p>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-normal text-slate-500">
            Podsumowanie
          </h2>
          <div className="mt-3 grid gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <span>Brutto</span>
              <strong>{formatMoney(payroll.grossAmount)}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span>Skladki spoleczne</span>
              <strong>{formatMoney(payroll.socialContributionsTotal)}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span>Skladka zdrowotna</span>
              <strong>{formatMoney(payroll.healthContribution)}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span>Zaliczka PIT</span>
              <strong>{formatMoney(payroll.pitAdvance)}</strong>
            </div>
            <div className="mt-2 flex justify-between gap-4 border-t border-slate-300 pt-3 text-lg">
              <span>Do wyplaty</span>
              <strong>{formatMoney(payroll.netAmount)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-bold uppercase tracking-normal text-slate-500">
          Skladniki paska
        </h2>
        <table className="mt-3 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-y border-slate-300 bg-slate-100">
              <th className="px-3 py-2 font-semibold">Skladnik</th>
              <th className="px-3 py-2 text-right font-semibold">Kwota</th>
              <th className="px-3 py-2 text-right font-semibold">Podstawa</th>
              <th className="px-3 py-2 text-right font-semibold">Stawka</th>
            </tr>
          </thead>
          <tbody>
            {components.map((component) => (
              <tr key={component.id} className="border-b border-slate-200">
                <td className="px-3 py-2 font-medium">{component.name}</td>
                <td className="px-3 py-2 text-right">{formatMoney(component.amount)}</td>
                <td className="px-3 py-2 text-right">
                  {component.calculationBasis === null
                    ? "-"
                    : formatMoney(component.calculationBasis)}
                </td>
                <td className="px-3 py-2 text-right">
                  {component.rate === null ? "-" : `${(component.rate * 100).toFixed(2)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-10 grid gap-8 text-sm md:grid-cols-2">
        <div className="border-t border-slate-400 pt-3">
          Podpis pracownika kadr
        </div>
        <div className="border-t border-slate-400 pt-3">
          Potwierdzenie odbioru pracownika
        </div>
      </section>

      <footer className="mt-8 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
        Dokument ma charakter fikcyjny i sluzy do projektu PWSI. Nie jest oficjalnym
        dokumentem kadrowo-placowym ani potwierdzeniem przelewu.
      </footer>
    </article>
  );
}
