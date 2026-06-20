import { PensionSimulationTool } from "@/features/pension/PensionSimulationTool";
import { mockDb } from "@/lib/mock-db";

export default function PensionSimulationsPage() {
  const employee = mockDb.employeeProfiles[0];
  const userId = employee.userId;
  const privateData = mockDb.privatePensionData.find((item) => item.userId === userId);
  const employeePayrolls = mockDb.payrolls.filter(
    (payroll) => payroll.employeeProfileId === employee.id,
  );
  const historicalContributions = employeePayrolls.reduce(
    (sum, payroll) => sum + payroll.pensionContribution,
    0,
  );
  const averageMonthlyContribution =
    employeePayrolls.length > 0 ? historicalContributions / employeePayrolls.length : 0;

  return (
    <PensionSimulationTool
      averageMonthlyContribution={averageMonthlyContribution}
      employee={employee}
      historicalContributions={historicalContributions}
      initialCapital={privateData?.initialCapital ?? 0}
      initialSimulations={mockDb.pensionSimulations.filter((item) => item.userId === userId)}
      lifeExpectancyTable={mockDb.lifeExpectancyTable}
      userId={userId}
    />
  );
}
