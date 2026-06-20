"use client";

import {
  CheckCircle2,
  KeyRound,
  Plus,
  Save,
  Search,
  UserCog,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { ModulePage } from "@/components/layout/ModulePage";
import { Badge, RoleBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Field, inputClassName } from "@/components/ui/Field";
import { StatusCard } from "@/components/ui/StatusCard";
import { DataTable, TableCell, TableRow } from "@/components/ui/Table";
import {
  readCreatedAccounts,
  writeCreatedAccounts,
  type CreatedAccount,
} from "@/lib/client-created-accounts";
import { matchesText } from "@/lib/search-params";
import type { EmployeeProfile, Gender, User, UserRole } from "@/types/domain";

type AdminUsersManagerProps = {
  initialEmployeeProfiles: EmployeeProfile[];
  initialFilters: {
    query: string;
    role: string;
    status: string;
  };
  initialUsers: User[];
};

type AccountFormState = {
  birthDate: string;
  department: string;
  email: string;
  employeeNumber: string;
  employmentDate: string;
  firstName: string;
  gender: Gender;
  isActive: "true" | "false";
  lastName: string;
  mustChangePassword: "true" | "false";
  pesel: string;
  position: string;
  role: UserRole;
  username: string;
};

const genderLabel: Record<Gender, string> = {
  Female: "Kobieta",
  Male: "Mezczyzna",
  Other: "Inna",
};

function createEmptyForm(): AccountFormState {
  return {
    birthDate: "",
    department: "",
    email: "",
    employeeNumber: "",
    employmentDate: new Date().toISOString().slice(0, 10),
    firstName: "",
    gender: "Female",
    isActive: "true",
    lastName: "",
    mustChangePassword: "false",
    pesel: "",
    position: "",
    role: "Employee",
    username: "",
  };
}

function normalizePesel(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function findProfileByUserId(profiles: EmployeeProfile[], userId: string) {
  return profiles.find((profile) => profile.userId === userId);
}

function createUserSearchText(user: User, profile?: EmployeeProfile) {
  return [
    user.username,
    user.email,
    profile?.firstName,
    profile?.lastName,
    profile?.pesel,
    profile?.employeeNumber,
    profile?.department,
  ]
    .filter(Boolean)
    .join(" ");
}

export function AdminUsersManager({
  initialEmployeeProfiles,
  initialFilters,
  initialUsers,
}: AdminUsersManagerProps) {
  const [createdAccounts, setCreatedAccounts] = useState<CreatedAccount[]>(readCreatedAccounts);
  const [form, setForm] = useState<AccountFormState>(createEmptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const allUsers = useMemo(
    () => [...initialUsers, ...createdAccounts.map((account) => account.user)],
    [createdAccounts, initialUsers],
  );
  const allEmployeeProfiles = useMemo(
    () => [
      ...initialEmployeeProfiles,
      ...createdAccounts.map((account) => account.employeeProfile),
    ],
    [createdAccounts, initialEmployeeProfiles],
  );
  const filteredUsers = useMemo(
    () =>
      allUsers.filter((user) => {
        const profile = findProfileByUserId(allEmployeeProfiles, user.id);
        const matchesRole = !initialFilters.role || user.role === initialFilters.role;
        const matchesStatus =
          initialFilters.status === "all" ||
          (initialFilters.status === "active" && user.isActive) ||
          (initialFilters.status === "inactive" && !user.isActive);

        return (
          matchesText(createUserSearchText(user, profile), initialFilters.query) &&
          matchesRole &&
          matchesStatus
        );
      }),
    [allEmployeeProfiles, allUsers, initialFilters],
  );
  const activeUsers = allUsers.filter((user) => user.isActive).length;
  const roleCount = new Set(allUsers.map((user) => user.role)).size;

  function updateForm<K extends keyof AccountFormState>(
    key: K,
    value: AccountFormState[K],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  function validateForm() {
    const username = normalizeUsername(form.username);
    const email = form.email.trim().toLowerCase();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const pesel = normalizePesel(form.pesel);

    if (!username || !email || !firstName || !lastName || !pesel) {
      return "Uzupelnij login, email, imie, nazwisko i PESEL.";
    }

    if (!email.includes("@")) {
      return "Email musi zawierac znak @.";
    }

    if (pesel.length !== 11) {
      return "PESEL musi miec 11 cyfr.";
    }

    if (!form.birthDate) {
      return "Data urodzenia jest wymagana.";
    }

    if (!form.department.trim()) {
      return "Wydzial jest wymagany.";
    }

    if (allUsers.some((user) => normalizeUsername(user.username) === username)) {
      return "Konto z takim loginem juz istnieje.";
    }

    if (allUsers.some((user) => user.email.toLowerCase() === email)) {
      return "Konto z takim adresem email juz istnieje.";
    }

    if (allEmployeeProfiles.some((profile) => profile.pesel === pesel)) {
      return "Profil z takim numerem PESEL juz istnieje.";
    }

    return null;
  }

  function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setSuccessMessage(null);
      return;
    }

    const createdAt = new Date().toISOString();
    const userId = createId("usr");
    const employeeProfileId = createId("emp");
    const username = normalizeUsername(form.username);
    const email = form.email.trim().toLowerCase();
    const employeeNumber =
      form.employeeNumber.trim() ||
      `EMP-${String(allEmployeeProfiles.length + 1).padStart(3, "0")}`;
    const newAccount: CreatedAccount = {
      user: {
        id: userId,
        username,
        email,
        role: form.role,
        isActive: form.isActive === "true",
        mustChangePassword: form.mustChangePassword === "true",
        createdAt,
        updatedAt: createdAt,
      },
      employeeProfile: {
        id: employeeProfileId,
        userId,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        pesel: normalizePesel(form.pesel),
        gender: form.gender,
        birthDate: form.birthDate,
        employeeNumber,
        employmentDate: form.employmentDate || createdAt.slice(0, 10),
        position: form.position.trim() || "Nieokreslone",
        department: form.department.trim(),
      },
    };
    const nextAccounts = [newAccount, ...createdAccounts];

    setCreatedAccounts(nextAccounts);
    writeCreatedAccounts(nextAccounts);
    setForm(createEmptyForm());
    setError(null);
    setSuccessMessage(`Utworzono konto ${newAccount.user.username}.`);
    setIsFormOpen(false);
  }

  return (
    <ModulePage
      title="Uzytkownicy"
      eyebrow="Administracja"
      description="Administrator zarzadza kontami, rolami i danymi osobowymi uzytkownikow systemu."
      actions={
        <Button
          icon={isFormOpen ? X : Plus}
          onClick={() => {
            setIsFormOpen((currentValue) => !currentValue);
            setError(null);
          }}
          tone={isFormOpen ? "secondary" : "primary"}
        >
          {isFormOpen ? "Zamknij formularz" : "Nowe konto"}
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard label="Konta" value={String(allUsers.length)} />
        <StatusCard label="Aktywne" value={String(activeUsers)} tone="teal" />
        <StatusCard label="Role" value={String(roleCount)} tone="rose" />
      </div>

      {successMessage ? (
        <div className="mt-4 flex gap-2 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-950 dark:border-teal-900/70 dark:bg-teal-950/40 dark:text-teal-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      ) : null}

      {isFormOpen ? (
        <Card className="mt-6">
          <CardHeader
            title="Nowe konto"
            description="Uzupelnij dane konta oraz profil osobowy. Rekord zostanie dodany do listy uzytkownikow."
          />
          <CardBody>
            <form className="grid gap-4 lg:grid-cols-3" onSubmit={handleCreateAccount}>
              <div className="lg:col-span-3">
                <h3 className="text-sm font-semibold uppercase tracking-normal text-teal-700 dark:text-teal-300">
                  Dane logowania
                </h3>
              </div>
              <Field label="Login" htmlFor="newUsername">
                <input
                  id="newUsername"
                  className={inputClassName}
                  onChange={(event) => updateForm("username", event.target.value)}
                  placeholder="np. adam.zielinski"
                  value={form.username}
                />
              </Field>
              <Field label="Email" htmlFor="newEmail">
                <input
                  id="newEmail"
                  className={inputClassName}
                  onChange={(event) => updateForm("email", event.target.value)}
                  placeholder="np. adam.zielinski@firma.test"
                  type="email"
                  value={form.email}
                />
              </Field>
              <Field label="Rola" htmlFor="newRole">
                <select
                  id="newRole"
                  className={inputClassName}
                  onChange={(event) => updateForm("role", event.target.value as UserRole)}
                  value={form.role}
                >
                  <option value="Employee">Pracownik</option>
                  <option value="HR">Kadry</option>
                  <option value="Admin">Administrator</option>
                </select>
              </Field>
              <Field label="Status" htmlFor="newStatus">
                <select
                  id="newStatus"
                  className={inputClassName}
                  onChange={(event) =>
                    updateForm("isActive", event.target.value as AccountFormState["isActive"])
                  }
                  value={form.isActive}
                >
                  <option value="true">Aktywne</option>
                  <option value="false">Nieaktywne</option>
                </select>
              </Field>
              <Field label="Zmiana hasla" htmlFor="newPasswordChange">
                <select
                  id="newPasswordChange"
                  className={inputClassName}
                  onChange={(event) =>
                    updateForm(
                      "mustChangePassword",
                      event.target.value as AccountFormState["mustChangePassword"],
                    )
                  }
                  value={form.mustChangePassword}
                >
                  <option value="false">Nie</option>
                  <option value="true">Tak</option>
                </select>
              </Field>

              <div className="lg:col-span-3">
                <h3 className="mt-2 text-sm font-semibold uppercase tracking-normal text-teal-700 dark:text-teal-300">
                  Dane osobowe
                </h3>
              </div>
              <Field label="Imie" htmlFor="newFirstName">
                <input
                  id="newFirstName"
                  className={inputClassName}
                  onChange={(event) => updateForm("firstName", event.target.value)}
                  placeholder="np. Adam"
                  value={form.firstName}
                />
              </Field>
              <Field label="Nazwisko" htmlFor="newLastName">
                <input
                  id="newLastName"
                  className={inputClassName}
                  onChange={(event) => updateForm("lastName", event.target.value)}
                  placeholder="np. Zielinski"
                  value={form.lastName}
                />
              </Field>
              <Field label="PESEL" htmlFor="newPesel" hint="Dokladnie 11 cyfr.">
                <input
                  id="newPesel"
                  className={inputClassName}
                  inputMode="numeric"
                  maxLength={11}
                  onChange={(event) => updateForm("pesel", normalizePesel(event.target.value))}
                  placeholder="np. 99010112345"
                  value={form.pesel}
                />
              </Field>
              <Field label="Plec" htmlFor="newGender">
                <select
                  id="newGender"
                  className={inputClassName}
                  onChange={(event) => updateForm("gender", event.target.value as Gender)}
                  value={form.gender}
                >
                  <option value="Female">Kobieta</option>
                  <option value="Male">Mezczyzna</option>
                  <option value="Other">Inna</option>
                </select>
              </Field>
              <Field label="Data urodzenia" htmlFor="newBirthDate">
                <input
                  id="newBirthDate"
                  className={inputClassName}
                  onChange={(event) => updateForm("birthDate", event.target.value)}
                  type="date"
                  value={form.birthDate}
                />
              </Field>
              <Field label="Wydzial" htmlFor="newDepartment">
                <input
                  id="newDepartment"
                  className={inputClassName}
                  onChange={(event) => updateForm("department", event.target.value)}
                  placeholder="np. Finanse"
                  value={form.department}
                />
              </Field>
              <Field label="Stanowisko" htmlFor="newPosition">
                <input
                  id="newPosition"
                  className={inputClassName}
                  onChange={(event) => updateForm("position", event.target.value)}
                  placeholder="np. Specjalista"
                  value={form.position}
                />
              </Field>
              <Field label="Numer pracownika" htmlFor="newEmployeeNumber" hint="Opcjonalnie.">
                <input
                  id="newEmployeeNumber"
                  className={inputClassName}
                  onChange={(event) => updateForm("employeeNumber", event.target.value)}
                  placeholder="np. EMP-003"
                  value={form.employeeNumber}
                />
              </Field>
              <Field label="Data zatrudnienia" htmlFor="newEmploymentDate">
                <input
                  id="newEmploymentDate"
                  className={inputClassName}
                  onChange={(event) => updateForm("employmentDate", event.target.value)}
                  type="date"
                  value={form.employmentDate}
                />
              </Field>

              {error ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200 lg:col-span-3">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2 lg:col-span-3">
                <Button icon={Save} tone="primary" type="submit">
                  Utworz konto
                </Button>
                <Button
                  icon={X}
                  onClick={() => {
                    setIsFormOpen(false);
                    setError(null);
                  }}
                >
                  Anuluj
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : null}

      <Card className="mt-6">
        <CardHeader
          title="Filtry uzytkownikow"
          description="Wyszukiwanie kont administracyjnych, kadrowych i pracowniczych."
        />
        <CardBody>
          <form action="/admin/users" className="grid gap-4 md:grid-cols-4">
            <Field label="Login, email lub PESEL" htmlFor="userSearch">
              <input
                id="userSearch"
                className={inputClassName}
                defaultValue={initialFilters.query}
                name="q"
                placeholder="np. anna.nowak"
              />
            </Field>
            <Field label="Rola" htmlFor="role">
              <select
                id="role"
                className={inputClassName}
                defaultValue={initialFilters.role}
                name="role"
              >
                <option value="">Wszystkie</option>
                <option value="Employee">Pracownik</option>
                <option value="HR">Kadry</option>
                <option value="Admin">Administrator</option>
              </select>
            </Field>
            <Field label="Status" htmlFor="userStatus">
              <select
                id="userStatus"
                className={inputClassName}
                defaultValue={initialFilters.status}
                name="status"
              >
                <option value="active">Aktywne</option>
                <option value="inactive">Nieaktywne</option>
                <option value="all">Wszystkie</option>
              </select>
            </Field>
            <div className="flex items-end">
              <Button icon={Search} type="submit">
                Szukaj
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="mt-6">
        <DataTable columns={["Login", "Dane osobowe", "Email", "Rola", "Wydzial", "Status", "Akcje"]}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const profile = findProfileByUserId(allEmployeeProfiles, user.id);
              const isCreated = createdAccounts.some((account) => account.user.id === user.id);

              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    {profile ? (
                      <div>
                        <p className="font-medium text-slate-950 dark:text-slate-50">
                          {profile.firstName} {profile.lastName}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          PESEL: {profile.pesel} · {genderLabel[profile.gender]} · ur.{" "}
                          {new Date(profile.birthDate).toLocaleDateString("pl-PL")}
                        </p>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>{profile?.department ?? "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {user.isActive ? (
                        <Badge tone="teal">Aktywne</Badge>
                      ) : (
                        <Badge tone="rose">Nieaktywne</Badge>
                      )}
                      {user.mustChangePassword ? <Badge tone="amber">Zmiana hasla</Badge> : null}
                      {isCreated ? <Badge tone="indigo">Nowe</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                        type="button"
                      >
                        <UserCog className="h-4 w-4" />
                        <span>Edytuj</span>
                      </button>
                      <button
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                        type="button"
                      >
                        <KeyRound className="h-4 w-4" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <tr>
              <td
                className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                colSpan={7}
              >
                Brak uzytkownikow spelniajacych wybrane filtry.
              </td>
            </tr>
          )}
        </DataTable>
      </div>
    </ModulePage>
  );
}
