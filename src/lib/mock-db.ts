import { lifeExpectancyTable } from "@/data/mock-life-expectancy";
import { payrollComponents, payrolls } from "@/data/mock-payrolls";
import {
  auditLogs,
  pensionSimulations,
  privatePensionData,
  systemSettings,
} from "@/data/mock-system";
import { employeeProfiles, users } from "@/data/mock-users";

export const mockDb = {
  users,
  employeeProfiles,
  payrolls,
  payrollComponents,
  privatePensionData,
  pensionSimulations,
  lifeExpectancyTable,
  systemSettings,
  auditLogs,
};

export function getEmployeeProfile(employeeProfileId: string) {
  return employeeProfiles.find((employee) => employee.id === employeeProfileId);
}

export function getEmployeeName(employeeProfileId: string) {
  const employee = getEmployeeProfile(employeeProfileId);

  if (!employee) {
    return "Nieznany pracownik";
  }

  return `${employee.firstName} ${employee.lastName}`;
}

export function getUser(userId: string | null) {
  if (!userId) {
    return null;
  }

  return users.find((user) => user.id === userId) ?? null;
}
