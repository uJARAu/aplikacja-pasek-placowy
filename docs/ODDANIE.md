# Checklist oddania

Dokument pomocniczy do finalnej prezentacji projektu PWSI.

## Co pokazac prowadzacemu

- `/dashboard` - podzial systemu na moduly i szybkie podsumowanie danych,
- `/login` - ekran logowania demonstracyjnego,
- `/payrolls` - historia paskow pracownika z filtrowaniem,
- `/payrolls/pay-2026-04-anna` - szczegoly paska placowego,
- `/payrolls/pay-2026-04-anna/print` - wydruk i zapis PDF,
- `/hr/payrolls/new` - naliczanie nowej wyplaty,
- `/hr/payrolls` - lista wyplat z perspektywy kadr,
- `/hr/employees` - lista profili pracownikow,
- `/pension/private-data` - prywatne dane emerytalne pracownika,
- `/pension/simulations` - symulacje emerytalne,
- `/admin/users` - uzytkownicy i role,
- `/admin/settings` - konfiguracja stawek,
- `/admin/audit-logs` - audyt operacji,
- przelacznik jasnego i ciemnego motywu.

## Zakres gotowy

- szkielet Next.js z App Router,
- wspolny layout i komponenty UI,
- widoki dla trzech rol,
- mockowy model danych,
- kalkulator brutto-netto,
- endpoint naliczania paska,
- mockowy endpoint zapisu szkicu,
- widok wydruku i PDF przez druk przegladarki,
- ciemny motyw,
- dokumentacja uruchomienia w `README.md`.

## Uproszczenia do powiedzenia wprost

- aplikacja nie korzysta z prawdziwej bazy danych,
- logowanie jest demonstracyjne,
- zapis nowej wyplaty nie jest trwaly po stronie serwera,
- PDF jest generowany przez mechanizm drukowania przegladarki,
- dane pracownikow, skladek, symulacji i audytu sa mockowe,
- obliczenia skladek sa uproszczone na potrzeby projektu.

## Komendy przed oddaniem

```bash
npm install
npm run check
npm run dev
```

Po uruchomieniu:

```txt
http://localhost:3000/dashboard
```

## Szybka kontrola

- strona startowa przekierowuje do dashboardu,
- wszystkie pozycje menu otwieraja sie bez bledu,
- `/hr/payrolls/new` poprawnie przelicza brutto-netto,
- zapis szkicu pokazuje komunikat sukcesu,
- `/payrolls/[id]/print` otwiera czysty widok dokumentu,
- motyw ciemny zostaje po odswiezeniu strony,
- `npm run check` konczy sie bez bledow.
