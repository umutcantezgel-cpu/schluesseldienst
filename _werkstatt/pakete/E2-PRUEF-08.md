# E2-PRUEF-08 · Rolle Prüfer · Modell Haiku · Stufe 1 · Kern-Version 1
Schreibrechte (exakt): _werkstatt/berichte/E2-pruefstufe-b.md, _werkstatt/bilder/E2/** (neu), _werkstatt/werkzeuge/aktionen/v01-inp.json (neu), _werkstatt/werkzeuge/moment.mjs (neu)
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/e2/**
Umfang: Prüfstufe B für die Referenzansicht V01 (Startseite `/`) und die 404-Seite

## Rollenbriefing Prüfer
Du führst die Prüfungen deiner Stufe aus und berichtest knapp mit Belegpfaden. Häufige Fehler: Einzelmessung statt Median; deuten statt berichten; über die Stufe hinaus prüfen.

## Aufgabe in einem Satz
Führe Prüfstufe B (KERN K-011, ABNAHME Z-02…Z-09) für die Startseite im Messbuild aus und lege den Referenz-Bildsatz komprimiert im Repo ab.

## Maßstab
- Referenzansicht: http://127.0.0.1:4173/ (Startseite). Werkzeuge: `_werkstatt/werkzeuge/*.mjs` (README dort). Budgets: `_werkstatt/KERN.md` K-011.

## Schritte (genau diese, nacheinander – nie zwei Messungen gleichzeitig)
1. Bestand: `npm test` (Anzahl pass/fail) und `node bau/bauen.mjs --messen --pruefen` → je Prüfer Fehler/Warnungen; die `links/ziel-fehlt`-Fehler (Seiten, die in späteren Etappen entstehen) nur zählen und nach Ziel-URL gruppiert auflisten.
2. Vorschau-Server: Prüfe, ob `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4173/` 200 liefert; sonst `(setsid node bau/vorschau.mjs --still > .cache/vorschau.log 2>&1 &)` und erneut prüfen. Der Server liefert `dist/` – nach dem Messbuild aus Schritt 1 ist das der Messbuild.
3. `smoke.mjs` auf `/` und `/gibt-es-nicht/` (Erwartung 404 + Fehlerseite). Fremde Anfragen müssen 0 sein, CSP-Verstöße 0, Konsolenfehler 0 (außer dem 404 des Hauptdokuments).
4. `axe.mjs` auf `/` hell und dunkel (`--schema light|dark`) – Anzahl serious/critical, Regeln.
5. `ueberlauf.mjs` auf `/`.
6. `lighthouse.mjs` auf `/` mobil, 3 Läufe (Median + Spanne): Perf, A11y, BP, SEO, LCP, CLS, TBT.
7. INP: Aktionsdatei `_werkstatt/werkzeuge/aktionen/v01-inp.json` anlegen: Klick auf `#hero-ort-eingabe`, Tippen „weil“, Taste `ArrowDown`, Taste `Enter`, Klick auf die erste `.faq-frage`, Klick auf die zweite `.faq-frage`. `inp.mjs` mit `--drossel 4` (max. Latenz nennen).
8. Großer Moment M-16: Schreibe `_werkstatt/werkzeuge/moment.mjs --url <u> --selektor <css> --aus <ordner> [--zeiten 0,300,600,900,1300] [--breite 390 --hoehe 844]`: Seite laden mit CDP-Drosselung aus (normal), sofort nach `domcontentloaded` Bildschirmfotos des Elements (`locator.screenshot`) zu den angegebenen Zeitpunkten (ms nach Laden) als JPEG Q80 nach `<ordner>/moment-<nn>.jpg`. Ausführen für Selektor `.hero-figur`, Desktop 1440×900 und mobil 390×844, Ausgabe `_werkstatt/bilder/E2/moment/`. Dann `bildrate.mjs --url http://127.0.0.1:4173/ --drossel 4 --ausloeser laden --dauer 1600` (verworfene Bilder %).
9. Reduzierte Bewegung: Mit `bild.mjs --bewegung reduce` ein Bild von `/` (390×844) und per eigenem kurzen Playwright-Aufruf mit `reducedMotion: 'reduce'` prüfen, dass `document.getAnimations().length` nach 200 ms gleich 0 ist (Zahl nennen) und `.zy-scherlinie` sichtbar ist.
10. Bildsatz: `bildsatz.mjs --basis http://127.0.0.1:4173 --pfade / --aus _werkstatt/bilder/E2/v01 --schemata light,dark` (JPEG Q70, ≤ 1.440 px). Gesamtgröße des Ordners nennen (Ziel < 6 MB).
11. Bericht `_werkstatt/berichte/E2-pruefstufe-b.md`: Tabelle Kriterium (Z-02…Z-09) · Messung · Ergebnis · Schwelle · Beleg (Pfad), dann Befunde mit Datei/Selektor, dann „Nicht geprüft“. Keine Deutung, keine Gestaltungsurteile.

## Schnellprüfung und Selbstprüfung
- Alle 11 Schritte ausgeführt oder Grund genannt; Mediane aus 3 Läufen; Belegpfade existieren; Schreibrechte eingehalten (`git status --short`); nichts committet.
