import { DashboardHome } from "@/features/dashboard/DashboardHome";
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
    <DashboardHome
      stats={{
        approvedPayrollCount: approvedPayrolls.length,
        draftPayrollCount: draftPayrolls.length,
        employeeCount: mockDb.employeeProfiles.length,
        totalGross,
        totalPension,
        userCount: mockDb.users.length,
      }}
    />
  );
}
