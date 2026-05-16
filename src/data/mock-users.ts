import type { EmployeeProfile, User } from "@/types/domain";

export const users: User[] = [
  {
    id: "usr-admin",
    username: "admin",
    email: "admin@firma.test",
    role: "Admin",
    isActive: true,
    mustChangePassword: false,
    createdAt: "2026-01-02T08:00:00.000Z",
    updatedAt: "2026-01-02T08:00:00.000Z",
  },
  {
    id: "usr-hr",
    username: "kadry",
    email: "kadry@firma.test",
    role: "HR",
    isActive: true,
    mustChangePassword: false,
    createdAt: "2026-01-02T08:10:00.000Z",
    updatedAt: "2026-01-02T08:10:00.000Z",
  },
  {
    id: "usr-anna",
    username: "anna.nowak",
    email: "anna.nowak@firma.test",
    role: "Employee",
    isActive: true,
    mustChangePassword: false,
    createdAt: "2026-01-03T09:00:00.000Z",
    updatedAt: "2026-01-03T09:00:00.000Z",
  },
  {
    id: "usr-jan",
    username: "jan.kowalski",
    email: "jan.kowalski@firma.test",
    role: "Employee",
    isActive: true,
    mustChangePassword: false,
    createdAt: "2026-01-03T09:15:00.000Z",
    updatedAt: "2026-01-03T09:15:00.000Z",
  },
];

export const employeeProfiles: EmployeeProfile[] = [
  {
    id: "emp-anna",
    userId: "usr-anna",
    firstName: "Anna",
    lastName: "Nowak",
    birthDate: "1992-04-12",
    employeeNumber: "EMP-001",
    employmentDate: "2021-03-01",
    position: "Specjalistka ds. analiz",
    department: "Finanse",
  },
  {
    id: "emp-jan",
    userId: "usr-jan",
    firstName: "Jan",
    lastName: "Kowalski",
    birthDate: "1988-09-21",
    employeeNumber: "EMP-002",
    employmentDate: "2020-07-15",
    position: "Programista",
    department: "IT",
  },
];
