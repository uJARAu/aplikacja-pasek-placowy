# Aplikacja Pasek Placowy

Projekt zaliczeniowy PWSI: demonstracyjna aplikacja webowa do obslugi fikcyjnych paskow placowych, zgodna z zalozeniami architektury opisanej w PDF-ie.

System pokazuje trzy obszary pracy:

- pracownik: podglad wlasnych paskow placowych, dane prywatne i symulacje emerytalne,
- kadry: lista pracownikow, lista wyplat i naliczanie brutto-netto,
- administrator: konta, role, konfiguracja systemowa i logi audytowe.

Projekt jest wersja demonstracyjna. Nie laczy sie z prawdziwa baza danych, nie przetwarza realnych danych placowych i nie generuje oficjalnych dokumentow kadrowych.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- lucide-react
- mockowe dane w plikach TypeScript

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja startuje lokalnie pod adresem:

```txt
http://localhost:3000/dashboard
```

Strona glowna `/` przekierowuje do `/dashboard`.

## Weryfikacja

```bash
npm run lint
npm run typecheck
npm run build
```

Mozna tez uruchomic pelny zestaw:

```bash
npm run check
```

## Glowne funkcje

- dashboard z podsumowaniem systemu,
- jasny i ciemny motyw z zapisem preferencji w `localStorage`,
- widok logowania demonstracyjnego,
- historia paskow placowych pracownika,
- szczegoly paska placowego,
- druk i zapis do PDF przez systemowe okno drukowania przegladarki,
- kalkulator paska placowego brutto-netto,
- API do naliczania paska: `POST /api/payrolls/calculate`,
- API mockowego zapisu szkicu: `POST /api/payrolls`,
- lista pracownikow dla kadr,
- lista wszystkich wyplat dla kadr,
- dane prywatne emerytalne pracownika,
- symulacje emerytalne na danych mockowych,
- zarzadzanie uzytkownikami i rolami w widoku admina,
- konfiguracja stawek systemowych,
- logi audytowe read-only,
- proste filtrowanie list przez parametry URL.

## Trasy aplikacji

| Trasa | Opis |
| --- | --- |
| `/login` | Widok logowania demonstracyjnego |
| `/dashboard` | Panel startowy i mapa modulow |
| `/payrolls` | Paski placowe zalogowanego pracownika |
| `/payrolls/[id]` | Szczegoly paska placowego |
| `/payrolls/[id]/print` | Widok drukowania / zapisu PDF |
| `/pension/private-data` | Prywatne dane emerytalne pracownika |
| `/pension/simulations` | Symulacje emerytalne |
| `/hr/employees` | Lista pracownikow dla kadr |
| `/hr/payrolls` | Lista wyplat dla kadr |
| `/hr/payrolls/new` | Naliczanie nowego paska placowego |
| `/admin/users` | Uzytkownicy i role |
| `/admin/settings` | Konfiguracja systemowa |
| `/admin/audit-logs` | Logi audytowe |
| `/api/payrolls` | Lista wyplat i mockowy zapis szkicu |
| `/api/payrolls/calculate` | Naliczanie brutto-netto |

## Struktura katalogow

```txt
src/
  app/                 trasy Next.js, strony i endpointy API
  components/
    layout/            shell aplikacji, nawigacja, przelacznik motywu
    ui/                wspolne komponenty UI
  data/                mockowe dane domenowe
  features/payrolls/   kalkulator i dokument wydruku paska
  lib/                 logika domenowa, formatowanie, RBAC, helpery
  types/               typy domenowe i API
```

## Model danych

Najwazniejsze typy sa w `src/types/domain.ts`:

- `User`
- `EmployeeProfile`
- `Payroll`
- `PayrollComponent`
- `PrivatePensionData`
- `PensionSimulation`
- `LifeExpectancyTable`
- `SystemSetting`
- `AuditLog`

Dane demonstracyjne sa w:

- `src/data/mock-users.ts`
- `src/data/mock-payrolls.ts`
- `src/data/mock-system.ts`
- `src/data/mock-life-expectancy.ts`

Wspolny punkt dostepu do danych mockowych znajduje sie w `src/lib/mock-db.ts`.

## Zasady naliczania paska

Logika paska znajduje sie w `src/lib/calculations/payroll.ts`.

Uproszczony model:

- skladka emerytalna: 9.76% od brutto,
- skladka rentowa: 1.5% od brutto,
- skladka chorobowa: 2.45% od brutto,
- skladka zdrowotna: 9% od podstawy po skladkach spolecznych,
- PIT: 12% podstawy po skladkach spolecznych minus 300 zl,
- netto: brutto minus skladki spoleczne, zdrowotna i PIT.

To model demonstracyjny do projektu PWSI, a nie pelny kalkulator kadrowo-placowy.

## Zakres zgodny z PDF

Zrealizowane elementy obowiazkowe:

- podzial na role: Employee, HR, Admin,
- osobne moduly dla pracownika, kadr i administratora,
- model uzytkownikow, profili pracownikow, paskow, skladnikow, danych emerytalnych i audytu,
- historia i szczegoly paskow placowych,
- naliczanie paska placowego z walidacja danych,
- widok wydruku i zapis PDF przez drukarke przegladarki,
- dane prywatne emerytalne i symulacje,
- konfiguracja systemowa,
- logi audytowe tylko do odczytu,
- zasada ograniczenia dostepu do danych prywatnych w podziale widokow.

Elementy uproszczone na potrzeby zaliczenia:

- brak prawdziwej autoryzacji i sesji,
- brak prawdziwej bazy danych,
- zapis nowego paska jest mockowy i uzywa odpowiedzi API oraz `localStorage`,
- PDF powstaje przez natywne `window.print()`, nie przez backendowy generator plikow,
- stawki i dane GUS sa mockowe,
- akcje administracyjne typu reset hasla sa widokiem demonstracyjnym,
- logi audytowe sa statyczne.

## Scenariusz prezentacji

1. Wejdz na `/dashboard` i pokaz podzial aplikacji na moduly.
2. Przejdz do `/payrolls` i pokaz historie paskow pracownika oraz filtrowanie.
3. Otworz szczegoly paska i widok `/print`, nastepnie pokaz druk lub zapis do PDF.
4. Przejdz do `/hr/payrolls/new`, nalicz nowa wyplate i zapisz szkic.
5. Pokaz `/hr/payrolls` oraz `/hr/employees` jako widoki kadrowe.
6. Pokaz `/pension/private-data` i `/pension/simulations`.
7. Pokaz `/admin/users`, `/admin/settings` i `/admin/audit-logs`.
8. Przelacz jasny/ciemny motyw.

## Status oddania

Projekt jest przygotowany jako kompletna demonstracja frontendu i logiki domenowej na potrzeby zaliczenia. Przed oddaniem warto uruchomic `npm run check` i przejsc scenariusz prezentacji z tej instrukcji.
