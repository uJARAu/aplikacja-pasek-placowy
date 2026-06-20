# Aplikacja Pasek Placowy

Projekt zaliczeniowy PWSI: demonstracyjna aplikacja webowa do obslugi fikcyjnych paskow placowych, kont uzytkownikow i symulacji emerytalnych.

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja startuje lokalnie pod adresem:

```txt
http://localhost:3000/dashboard
```

## Konta demo

| Login | Haslo | Rola |
| --- | --- | --- |
| `admin` | `admin123` | Administrator |
| `kadry` | `kadry123` | Kadry |
| `kierownik.kadr` | `kierownik123` | Kadry |
| `anna.nowak` | `anna123` | Pracownik |
| `jan.kowalski` | `jan123` | Pracownik |

Po zalogowaniu menu i dashboard dostosowuja sie do roli. Wylogowanie jest dostepne w lewym panelu.

## Glowne funkcje

- logowanie demonstracyjne i wylogowanie,
- dashboard zalezy od roli zalogowanego konta,
- tworzenie nowych kont uzytkownikow z danymi osobowymi,
- historia i szczegoly paskow placowych,
- naliczanie paska brutto-netto,
- wydruk i zapis paska jako PDF przez okno drukowania przegladarki,
- dzialajace symulacje emerytalne,
- widoki kadr: pracownicy, wyplaty, naliczanie wyplaty,
- widoki administratora: uzytkownicy, konfiguracja i logi audytowe,
- jasny i ciemny motyw.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- lucide-react
- dane mockowe w plikach TypeScript i `localStorage`

## Przydatne komendy

```bash
npm run lint
npm run typecheck
npm run build
```

Pelna kontrola:

```bash
npm run check
```

## Struktura

```txt
src/
  app/                 trasy Next.js i endpointy API
  components/          layout i wspolne komponenty UI
  data/                dane demonstracyjne
  features/            wieksze moduly ekranow
  lib/                 logika, formatowanie, RBAC i helpery
  types/               typy domenowe
```

Projekt jest demonstracyjny: nie laczy sie z prawdziwa baza danych i nie przetwarza realnych danych placowych.
