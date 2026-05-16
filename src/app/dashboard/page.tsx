import {
  AlertTriangle,
  ClipboardList,
  FileText,
  Landmark,
  ShieldCheck,
  Users,
} from "lucide-react";
import { ModulePage } from "@/components/layout/ModulePage";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusCard } from "@/components/ui/StatusCard";
import { formatMoney } from "@/lib/formatters";
import { mockDb } from "@/lib/mock-db";

export default function DashboardPage() {
  const approvedPayrolls = mockDb.payrolls.filter((payroll) => payroll.status === "Approved");
  const draftPayrolls = mockDb.payrolls.filter((payroll) => payroll.status === "Draft");
  const totalGross = approvedPayrolls.reduce((sum, payroll) => sum + payroll.grossAmount, 0);
  const totalPension = approvedPayrolls.reduce(
    (sum, payroll) => sum + payroll.pensionContribution,
    0,
  );

  return (
    <ModulePage
      title="Dashboard"
      eyebrow="System informacji o wyplatach"
      description="Pierwszy ekran zbiera stan mockowej aplikacji: wyplaty, role, audyt i moduly wymagane w specyfikacji PWSI."
      actions={
        <>
          <ButtonLink href="/hr/payrolls/new" icon={ClipboardList} tone="primary">
            Nalicz wyplate
          </ButtonLink>
          <ButtonLink href="/payrolls" icon={FileText}>
            Moje paski
          </ButtonLink>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          label="Uzytkownicy"
          value={String(mockDb.users.length)}
          helper="Konta demonstracyjne dla trzech rol"
          icon={Users}
        />
        <StatusCard
          label="Pracownicy"
          value={String(mockDb.employeeProfiles.length)}
          helper="Profile kadrowe polaczone z kontami"
          icon={ShieldCheck}
        />
        <StatusCard
          label="Zatwierdzone brutto"
          value={formatMoney(totalGross)}
          helper={`${approvedPayrolls.length} zapisane wyplaty`}
          icon={FileText}
          tone="teal"
        />
        <StatusCard
          label="Skladki emerytalne"
          value={formatMoney(totalPension)}
          helper="Suma z zatwierdzonych paskow"
          icon={Landmark}
          tone="rose"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader
            title="Mapa modulow"
            description="Widoki odpowiadaja obszarom funkcjonalnym z PDF-a."
          />
          <CardBody className="grid gap-3 md:grid-cols-2">
            {[
              ["Pracownik", "Historia wyplat, dane prywatne i symulacje."],
              ["Kadry", "Pracownicy, wyplaty i naliczanie brutto-netto."],
              ["Administrator", "Uzytkownicy, role, konfiguracja i audyt."],
              ["System", "Mock danych, RBAC, API naliczania i widoki wydruku."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-950/35">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-950 dark:text-slate-50">{title}</h3>
                  <Badge tone="teal">PDF</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Stan projektu" description="Gotowosc funkcji wymaganych do prezentacji." />
          <CardBody>
            <div className="space-y-3">
              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/70 dark:bg-amber-950/35">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" />
                <p className="text-sm leading-6 text-amber-900 dark:text-amber-100">
                  {draftPayrolls.length} wyplata robocza pokazuje obieg szkicu przed zatwierdzeniem.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-400">
                Naliczanie brutto-netto, podglad szczegolow oraz druk/PDF sa gotowe w trybie
                demonstracyjnym. Trwaly zapis do bazy zastapiono mockowym API i localStorage.
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </ModulePage>
  );
}
