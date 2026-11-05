# Triathlon Lipiany 2027

Strona zawodów w React, TypeScript i Vite, w wersji polskiej i niemieckiej.

## Uruchomienie

Wymagany Node.js 20.19 lub nowszy.

```bash
npm ci
npm run dev
```

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
- `src/components.tsx` — nawigacja, stopka i wspólne elementy.
- `src/styles.css` — typografia, układ i kolory.
- `src/data.ts` — dane kontaktowe, partnerzy i tłumaczenia interfejsu.
- `src/urls.ts` — adresy plików i obsługa ścieżki hostingu.
- `src/motion.tsx` — łagodny fade-in oraz interaktywne tło jezior.
- `src/water.ts` — tłumione fale powierzchni i odkształcanie linii tła.
- `public/assets/` — zdjęcia, logotypy, fonty i dokumenty.

Brakujące informacje edycji 2027 mają wartość `null` lub pustą listę.
Przed uruchomieniem zapisów należy uzupełnić prawdziwe linki w `src/edition.ts`.
Fonty są hostowane lokalnie; ich licencje znajdują się w `public/assets/fonts/`.

Tło jezior jest wspólne dla strony. Reaguje na dotyk i przewijanie, a sekcje
oddzielają cienkie linie. Animacje uwzględniają systemowe ustawienie
ograniczonego ruchu.

Archiwa, lokalne instrukcje, prompty, dane środowiska i pliki poświadczeń są
wykluczone z repozytorium przez `.gitignore`.
