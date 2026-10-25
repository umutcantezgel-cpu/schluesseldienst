# E0-PRUEF-02 · Rolle Prüfer · Modell Haiku · Stufe 1 · Kern-Version 0 (vor KERN)
Schreibrechte (exakt): _werkstatt/werkzeuge/lighthouse.mjs, _werkstatt/werkzeuge/vnu.mjs, _werkstatt/werkzeuge/bildrate.mjs, _werkstatt/werkzeuge/inp.mjs, _werkstatt/werkzeuge/README.md
Umfang: 4 Skripte (je ≤ 220 Zeilen) + README

## Rollenbriefing Prüfer
Du richtest Prüfwerkzeuge ein, führst Prüfungen aus und berichtest knapp mit Belegpfaden. Häufige Fehler: Einzelmessung statt Median; deuten statt berichten; über die Stufe hinaus prüfen.

## Aufgabe in einem Satz
Baue Messwerkzeuge für Leistung (Lighthouse-Median aus 3 Läufen), HTML-Validität (vnu), Bildrate bei 4-facher CPU-Drosselung und Eingabelatenz (INP-Näherung) und dokumentiere die Einrichtung im README.

## Maßstab und Muster
- Gemeinsame Helfer `_werkstatt/werkzeuge/lib.mjs` (lesen, NICHT ändern): `importiere`, `pfadVon`, `starteBrowser`, `blockiereExtern`, `statikServer`, `median`, `schreibeJson`, `CHROMIUM`, `MODULE`.
- Fixtures `_werkstatt/werkzeuge/fixture/index.html` (gut, enthält eine 640-ms-Linienanimation `.linie` und einen Zähl-Button `[data-zaehler]`) und `schlecht.html`.
- Konventionen wie bei den anderen Werkzeugen: ES-Module, `parseArgs`, JSON-Ausgabe per `--aus`, knappe stdout-Zusammenfassung, Exit 1 bei Überschreitung der Schwelle, 2 bei Werkzeugfehler.

## Schritte
1. `lighthouse.mjs --basis <u> --pfade /,/x/ --aus <json> [--laeufe 3] [--formfaktor mobile|desktop]`: Lighthouse-Node-API (`importiere('lighthouse')`) gegen einen per `chrome-launcher` (in lighthouse enthalten) oder per Playwright mit `--remote-debugging-port` gestarteten Chromium (`CHROMIUM` aus lib, Flags `--headless=new --no-sandbox`). Je Pfad N Läufe, Median je Kennzahl: Performance-, Accessibility-, Best-Practices-, SEO-Score, LCP, CLS, TBT, FCP, Speed Index, Spanne (max−min) je Kennzahl. Schwellen per Argument (`--min-perf 95 --max-lcp 2500 --max-cls 0.1`), Exit 1 bei Verfehlung.
2. `vnu.mjs --dateien <glob-oder-liste> | --ordner <dir> [--stichprobe N] --aus <json>`: ruft `java -jar <pfadVon('vnu-jar')→ Verzeichnis>/build/dist/vnu.jar --format json --exit-zero-always` (Jar-Pfad im Paket ermitteln) für HTML-Dateien; stderr-Zeile „Picked up JAVA_TOOL_OPTIONS“ ignorieren; Ausgabe: Fehler/Warnungen je Datei. Exit 1 bei Fehlern (type error).
3. `bildrate.mjs --url <u> --aus <json> [--drossel 4] [--dauer 2000] [--ausloeser laden|scroll|klick:<selektor>]`: Chromium mit CDP `Emulation.setCPUThrottlingRate`; misst über `requestAnimationFrame`-Intervalle (per `page.evaluate` gestartete Messschleife, da Init-Skripte unter CSP evtl. blockiert sind; `bypassCSP: true` ist für Messungen erlaubt) während des Auslösers; meldet Anteil verworfener Bilder (Intervall > 1,5 × 16,7 ms gilt als verworfen), Median-Intervall, Long-Animation-Frames falls verfügbar. Viewport 390×844. Schwelle `--max-verworfen 5` (%). Hinweis in der Ausgabe: headless ohne GPU → Ersatzmessung (UMGEBUNGSAUSNAHME).
4. `inp.mjs --url <u> --aktionen <json-datei> --aus <json> [--drossel 4]`: führt eine Liste von Interaktionen aus (`{typ:'klick'|'taste'|'tippen', selektor, text?}`) und misst je Interaktion die Latenz über die Event Timing API (`PerformanceObserver` type `event`, `durationThreshold: 16`, per `page.evaluate` vor den Aktionen registriert, `bypassCSP: true`); Ausgabe: max. und p98-Dauer, Schwelle `--max 200` ms.
5. README.md: Zweck, Einrichtung nach einer neu aufgesetzten Umgebung (exakte Befehle: `mkdir -p /home/user/werkzeuge-cache && cp _werkstatt/werkzeuge/{package.json,package-lock.json,.npmrc} /home/user/werkzeuge-cache/ && cd /home/user/werkzeuge-cache && npm ci --ignore-scripts && npm audit signatures`), Liste aller Werkzeuge (auch bild/bildsatz/ueberlauf/axe/smoke aus E0-PRUEF-01 – nur Name und Zweck, deren Argumente stehen in den Skripten) mit Beispielaufruf, Hinweis: Messungen nie parallel zu Builds (Sperrdatei `.cache/mess.lock`).
6. Nachweis: Fixture-Server auf Port 4291 starten (`statikServer('_werkstatt/werkzeuge/fixture', 4291)` in eigenem Prozess), Lighthouse (1 Lauf genügt zum Nachweis, dann 3 Läufe für die Median-Ausgabe auf `/`), vnu auf `fixture/index.html` (erwartet 0 Fehler) und `fixture/schlecht.html` (erwartet Fehler: fehlendes lang ist nur Warnung, fehlendes alt ist Fehler), bildrate mit Auslöser `laden` auf `/`, inp mit Aktion Klick auf `[data-zaehler]` 5×. Ausgaben nach `/home/user/schluesseldienst/.cache/werkzeug-nachweis/`. Server danach beenden.

## Schnellprüfung (Stufe A) und Selbstprüfung
- `node --check` je Skript; Nachweis-Tabelle (Skript × Ziel × Exit × Kernwerte) in PRÜFUNG UND ERGEBNIS.
- Mengen gezählt (4 Skripte + README), Schreibrechte eingehalten, offene Fragen gelistet.
