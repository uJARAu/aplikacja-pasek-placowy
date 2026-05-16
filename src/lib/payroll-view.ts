import { mockDb } from "@/lib/mock-db";
import type { EmployeeProfile, Payroll, PayrollComponent } from "@/types/domain";

export function getPayrollOrFallback(id: string) {
  return mockDb.payrolls.find((item) => item.id === id) ?? mockDb.payrolls[0];
}

export function getPayrollEmployee(payroll: Payroll): EmployeeProfile | undefined {
  return mockDb.employeeProfiles.find(
    (employee) => employee.id === payroll.employeeProfileId,
  );
}

export function getPrintablePayrollComponents(payroll: Payroll): PayrollComponent[] {
  const components = mockDb.payrollComponents.filter(
    (component) => component.payrollId === payroll.id,
  );

  if (components.length > 0) {
    return components;
  }

  return [
    {
      id: `${payroll.id}-gross`,
      payrollId: payroll.id,
      componentType: "GrossSalary",
      name: "Wynagrodzenie brutto",
      amount: payroll.grossAmount,
      calculationBasis: null,
      rate: null,
      description: "Wartosc zapisana w rekordzie wyplaty.",
    },
    {
      id: `${payroll.id}-pension`,
      payrollId: payroll.id,
      componentType: "PensionContribution",
      name: "Skladka emerytalna",
      amount: payroll.pensionContribution,
      calculationBasis: payroll.grossAmount,
      rate: 0.0976,
      description: "Wartosc zapisana w rekordzie wyplaty.",
    },
    {
      id: `${payroll.id}-health`,
      payrollId: payroll.id,
      componentType: "HealthContribution",
      name: "Skladka zdrowotna",
      amount: payroll.healthContribution,
      calculationBasis: null,
      rate: 0.09,
      description: "Wartosc zapisana w rekordzie wyplaty.",
    },
    {
      id: `${payroll.id}-pit`,
      payrollId: payroll.id,
      componentType: "PitAdvance",
      name: "Zaliczka PIT",
      amount: payroll.pitAdvance,
      calculationBasis: null,
      rate: null,
      description: "Wartosc zapisana w rekordzie wyplaty.",
    },
    {
      id: `${payroll.id}-net`,
      payrollId: payroll.id,
      componentType: "NetSalary",
      name: "Wynagrodzenie netto",
      amount: payroll.netAmount,
      calculationBasis: null,
      rate: null,
      description: "Kwota do wyplaty.",
    },
  ];
}
