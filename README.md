# Triathlon Lipiany 2027

Strona zawodów w React, TypeScript i Vite, w wersji polskiej i niemieckiej.

## Uruchomienie

Wymagany Node.js 20.19 lub nowszy.

```bash
npm ci
npm run dev
```

Lokalny podgląd pokazuje robocze treści edycji 2027 z niebieskim komunikatem.
Zawiera propozycje z przekazanej instrukcji, których organizator jeszcze nie
potwierdził. Aby zobaczyć wersję bez roboczych danych:

```bash
VITE_REVIEW_CONTENT=false npm run dev
```

Zwykły build nie włącza podglądu roboczego. `VITE_REVIEW_CONTENT=true` służy
wyłącznie do przygotowania osobnego builda do przeglądu.

## Build

```bash
npm run build
npm run preview
```

Wynik znajduje się w `dist/`.

## GitHub Pages

Workflow `.github/workflows/deploy.yml` publikuje stronę po zmianach na gałęzi
`main`. W ustawieniach repozytorium jako źródło Pages wybierz **GitHub Actions**.
Adres i ścieżka strony są pobierane z konfiguracji Pages.

Przykład lokalnego builda dla tego repozytorium:

```bash
VITE_BASE_PATH=/Maciek/ VITE_SITE_URL=https://midarq.github.io/Maciek VITE_STATIC_HOSTING=true npm run build:pages
VITE_BASE_PATH=/Maciek/ npm run preview
```

`prepare-pages.mjs` tworzy pliki wejściowe dla podstron, mapę strony i stronę 404.
GitHub Pages obsługuje pliki statyczne: formularz kontaktowy pozwala otworzyć
przygotowaną wiadomość w programie pocztowym. Na hostingu z PHP dostępny jest
endpoint `public/kontakt/wyslij.php`, wymagający działającego `mail()`.

## Edycja

- `src/edition.ts` — termin, konkurencje, dystanse, harmonogram i linki zapisów.
- `src/edition-pages.tsx` — aktualne widoki zawodów i programu.
- `src/details.ts` — dwujęzyczne propozycje treści, wspólne lokalizacje, mapy,
  potwierdzenia danych 2027 i adresy dokumentów.
- `src/rules.tsx` — wspólny wykaz regulaminów i ich robocze szablony.
- `src/components.tsx` — nawigacja, stopka i wspólne elementy.
- `src/styles.css` — typografia, układ i kolory.
- `src/data.ts` — dane kontaktowe, partnerzy i tłumaczenia interfejsu.
- `src/urls.ts` — adresy plików i obsługa ścieżki hostingu.
- `src/motion.tsx` — łagodny fade-in oraz interaktywne tło jezior.
- `src/lakes.ts` — uproszczone obrysy regionalnych jezior.
- `src/water.ts` — tłumione fale powierzchni i odkształcanie linii tła.
- `public/assets/` — zdjęcia, logotypy, fonty i dokumenty.

Brakujące informacje edycji 2027 mają wartość `null` lub pustą listę.
Przed uruchomieniem zapisów należy uzupełnić prawdziwe linki w `src/edition.ts`.
Potwierdzenia tras, lokalizacji, sprzętu i świadczeń są oddzielne w
`confirmations` w `src/details.ts`. Dopóki pozostają `false`, propozycje nie
pojawiają się w zwykłym buildzie. Gotowe, zatwierdzone regulaminy należy
przypisać do `ruleDocuments[].url`; ten sam adres jest używany na podstronach
zawodów, w programie i w informacjach dla zawodnika. Archiwalne dokumenty 2026
są wyłącznie źródłem dla roboczych szablonów; nie są oznaczone jako regulaminy 2027.
Fonty są hostowane lokalnie; ich licencje znajdują się w `public/assets/fonts/`.

Tło jezior pozostaje nieruchome podczas przewijania. Kliknięcie lub pojedyncze
dotknięcie tła wywołuje delikatne, wygasające odkształcenie linii. Gest przewijania
nie uruchamia fal. Animacje uwzględniają systemowe ustawienie ograniczonego ruchu.
Obrysy Wądołu, Kościelnego i Chłopa są inspirowane mapami w
[analizie zagrożeń na obszarach wodnych gminy Lipiany z 2025 roku](https://lipiany.pl/wp-content/uploads/2025/07/Analiza-zagrozen-na-obszarach-wodnych-Gm.-Lipiany-2025.pdf)
(strony 31, 27 i 21). Równoległe kontury wokół brzegów są dekoracją, nie pomiarem głębokości.

Archiwa, lokalne instrukcje, prompty, dane środowiska i pliki poświadczeń są
wykluczone z repozytorium przez `.gitignore`.
