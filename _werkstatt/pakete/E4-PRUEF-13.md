# E4-PRUEF-13 · Rolle Prüfer · Modell Haiku · Stufe 1 · Kern-Version 1
Schreibrechte (exakt): _werkstatt/berichte/E4-pruefstufe-b.md, _werkstatt/bilder/E4/** (neu), _werkstatt/werkzeuge/aktionen/e4-*.json (neu)
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/e4/**
Umfang: Prüfstufe B für die Ansichten der Etappe 4 – V04, V08, V09, V10, V11, V12

## Rollenbriefing Prüfer
Du führst die Prüfungen deiner Stufe aus und berichtest knapp mit Belegpfaden. Häufige Fehler: Einzelmessung statt Median; deuten statt berichten; zwei Browser-Messungen gleichzeitig.

## Aufgabe in einem Satz
Führe Prüfstufe B (KERN K-011, ABNAHME Z-02…Z-09) wie in `_werkstatt/pakete/E3-PRUEF-11.md` für die zehn Referenzpfade unten aus und lege den Bildsatz komprimiert im Repo ab.

## Referenzpfade
`/preise/` (V04) · `/ratgeber/` und `/ratgeber/rauchmelderpflicht/` (V08) · `/ueber-uns/` (V09) · `/kontakt/` (V10) · `/leistungen/`, `/sitemap/`, `/suche/` (V11) · `/impressum/` und `/gibt-es-nicht/` (V12, 404)

## Schritte (nacheinander; alle Browser-Werkzeuge nutzen die Mess-Sperre)
1. Bestand: `npm test` und `node bau/bauen.mjs --messen --pruefen --port=4201 --aus=.cache/e4/dist` → je Prüfer Fehler/Warnungen.
2. Eigene Vorschau `(setsid node bau/vorschau.mjs --aus .cache/e4/dist --port 4201 --still > .cache/e4/vorschau.log 2>&1 &)`, PID notieren; alle Pfade → 200 (404-Pfad → 404).
3. `smoke.mjs` auf alle Pfade (fremde Anfragen 0, CSP-Verstöße 0, Konsolenfehler 0 außer dem 404 des Hauptdokuments).
4. `axe.mjs` hell und dunkel auf alle Pfade.
5. `ueberlauf.mjs` auf alle Pfade.
6. `lighthouse.mjs` mobil, 3 Läufe je Pfad (Median + Spanne) für `/preise/`, `/ratgeber/rauchmelderpflicht/`, `/ueber-uns/`, `/kontakt/`, `/suche/`, `/impressum/`.
7. INP mit Aktionsdateien: `e4-preise.json` (Klick auf die Zone-B-Option im Rechner, dann auf die Option „Schließzylinder tauschen“), `e4-kontakt.json` (Klick auf „E-Mail vorbereiten“ ohne Eingaben – die Fehlerübersicht erscheint; dann Tippen in `#k-ort`), `e4-suche.json` (Klick in `#suche-eingabe`, Tippen „zyl“). `inp.mjs --drossel 4`, 3 Läufe, Median.
8. Bewegung: `bildrate.mjs --url <basis>/ueber-uns/ --drossel 4 --ausloeser scroll` (M-20) und `--url <basis>/gibt-es-nicht/ --ausloeser laden --dauer 1600` (M-21), je 3 Läufe.
9. Reduzierte Bewegung: `/gibt-es-nicht/` und `/ueber-uns/` – nach 200 ms laufen 0 Animationen; der gebrochene Zustand (404) und der Tunnel (Über uns) sind sichtbar.
10. vnu über die zehn Seiten aus `.cache/e4/dist` (für die 404: `404.html`).
11. Bildsatz: `bildsatz.mjs --basis http://127.0.0.1:4201 --pfade <alle zehn> --aus _werkstatt/bilder/E4 --schemata light,dark`; danach so kürzen wie in `_werkstatt/bilder/E3/index.json` (Feld `gekuerzt`): Hell Desktop und Mobil vollständig, Tablet und Dunkel nur Ausschnitte 1–3; Gesamtgröße < 12 MB.
12. Bericht `_werkstatt/berichte/E4-pruefstufe-b.md` wie E3 (Tabelle Kriterium · Pfad · Messung · Ergebnis · Schwelle · Beleg; Befunde; Nicht geprüft). Keine Deutung.
- Vorschau am Ende per PID beenden.
