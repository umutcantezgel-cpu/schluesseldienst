# E3-PRUEF-11 · Rolle Prüfer · Modell Haiku · Stufe 1 · Kern-Version 1
Schreibrechte (exakt): _werkstatt/berichte/E3-pruefstufe-b.md, _werkstatt/bilder/E3/** (neu), _werkstatt/werkzeuge/aktionen/e3-*.json (neu)
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/e3/**
Umfang: Prüfstufe B für die Ansichten der Etappe 3 – V02 Gruppe, V03 Detail, V05 Einsatzgebiet, V06 Hub, V07 Ortsseite

## Rollenbriefing Prüfer
Du führst die Prüfungen deiner Stufe aus und berichtest knapp mit Belegpfaden. Häufige Fehler: Einzelmessung statt Median; deuten statt berichten; über die Stufe hinaus prüfen; zwei Browser-Messungen gleichzeitig.

## Aufgabe in einem Satz
Führe Prüfstufe B (KERN K-011, ABNAHME Z-02…Z-09) wie in `_werkstatt/pakete/E2-PRUEF-08.md` für sieben Referenzpfade aus und lege den Bildsatz komprimiert im Repo ab.

## Referenzpfade
`/einbruchschutz/` (V02) · `/notoeffnung/tueroeffnung/` und `/einbau-tresore/datensicherungsschraenke/` (V03) · `/einsatzgebiet/` (V05) · `/einsatzgebiet/hessen/limburg-weilburg/` (V06) · `/schluesseldienst-weilburg/` und `/schluesseldienst-loehnberg/` (V07)

## Schritte (genau diese, nacheinander – nie zwei Messungen gleichzeitig; alle Browser-Werkzeuge nutzen die Mess-Sperre)
1. Bestand: `npm test` (pass/fail) und `node bau/bauen.mjs --messen --pruefen --aus=.cache/e3/dist` → je Prüfer Fehler/Warnungen.
2. Eigene Vorschau: `(setsid node bau/vorschau.mjs --aus .cache/e3/dist --port 4201 --still > .cache/e3/vorschau.log 2>&1 &)`; PID notieren; `curl` auf alle Referenzpfade → 200. Am Ende per PID beenden.
3. `smoke.mjs` auf alle Referenzpfade: fremde Anfragen 0, CSP-Verstöße 0, Konsolenfehler 0.
4. `axe.mjs` auf alle Referenzpfade, hell und dunkel: Anzahl serious/critical, Regeln.
5. `ueberlauf.mjs` auf alle Referenzpfade.
6. `lighthouse.mjs` mobil, 3 Läufe je Pfad (Median + Spanne): Perf, A11y, BP, SEO, LCP, CLS, TBT.
7. INP: Aktionsdateien `_werkstatt/werkzeuge/aktionen/e3-einsatzgebiet.json` (Klick ins Ortsfeld `#gebiet-ort-eingabe`, Tippen „löhn“, `ArrowDown`, `Enter`) und `e3-hub.json` (Klick auf den Buchstaben „W“ der Buchstabenleiste, dann auf den ersten Ort darunter ohne Navigation – nur Fokus per `Tab`). `inp.mjs --drossel 4` (max. Latenz).
8. Bewegung: `bildrate.mjs --url <basis>/einbruchschutz/ --drossel 4 --ausloeser scroll` (Szene M-17) und `--url <basis>/einsatzgebiet/ --ausloeser scroll` (M-18): verworfene Bilder %.
9. Reduzierte Bewegung: wie E2-PRUEF-08 Schritt 9 für `/einbruchschutz/` (Animationen nach 200 ms = 0; alle Szenen-Schritte sichtbar).
10. vnu: `vnu.mjs --dateien` mit den sieben Referenzseiten aus `.cache/e3/dist` → Fehler je Seite.
11. Bildsatz: `bildsatz.mjs --basis http://127.0.0.1:4201 --pfade <alle sieben> --aus _werkstatt/bilder/E3 --schemata light,dark` (JPEG Q70, ≤ 1.440 px). Gesamtgröße nennen (Ziel < 12 MB).
12. Bericht `_werkstatt/berichte/E3-pruefstufe-b.md`: Tabelle Kriterium (Z-02…Z-09) · Pfad · Messung · Ergebnis · Schwelle · Beleg; dann Befunde mit Datei/Selektor; dann „Nicht geprüft“. Keine Deutung.

## Schnellprüfung und Selbstprüfung
- Alle 12 Schritte ausgeführt oder Grund genannt; Mediane aus 3 Läufen; Belegpfade existieren; Schreibrechte eingehalten (`git status --short`); nichts committet.
