import { ModulePage } from "@/components/layout/ModulePage";
import { PayrollCalculator } from "@/features/payrolls/PayrollCalculator";
import { mockDb } from "@/lib/mock-db";

export default function NewPayrollPage() {
  return (
    <ModulePage
      title="Nalicz wyplate"
      eyebrow="Kadry"
      description="Ekran procesu UC-006 i UC-007. Kadry wprowadzaja brutto, system wylicza skladki, PIT i netto oraz generuje skladniki paska."
    >
      <PayrollCalculator employees={mockDb.employeeProfiles} />
    </ModulePage>
  );
}
