# E0-PRUEF-01 · Rolle Prüfer · Modell Haiku · Stufe 1 · Kern-Version 0 (vor KERN)
Schreibrechte (exakt): _werkstatt/werkzeuge/bild.mjs, _werkstatt/werkzeuge/bildsatz.mjs, _werkstatt/werkzeuge/ueberlauf.mjs, _werkstatt/werkzeuge/axe.mjs, _werkstatt/werkzeuge/smoke.mjs
Umfang: 5 Skripte, je ≤ 200 Zeilen

## Rollenbriefing Prüfer
Du richtest Prüfwerkzeuge ein, führst Prüfungen aus und berichtest knapp mit Belegpfaden. Häufige Fehler: Einzelmessung statt Median; deuten statt berichten; über die Stufe hinaus prüfen.

## Aufgabe in einem Satz
Baue fünf Playwright-basierte Prüfskripte (Einzelbild, Bildsatz, Überlauf, axe-Zugänglichkeit, Smoke) und weise mit den Fixtures nach, dass sie Gutes grün und Schlechtes rot melden.

## Maßstab und Muster
- Gemeinsame Helfer: `_werkstatt/werkzeuge/lib.mjs` (lesen, NICHT ändern): `importiere()`, `pfadVon()`, `starteBrowser()`, `blockiereExtern()`, `statikServer()`, `schreibeJson()`, `GERAETE`, `STANDARD_CSP`.
- Fixtures (lesen, nicht ändern): `_werkstatt/werkzeuge/fixture/index.html` (gut) und `fixture/schlecht.html` (absichtliche Fehler: Kontrast, fehlendes alt, leerer Button, fremde Ressource, Überbreite, Konsolenfehler, Inline-Style/Script → CSP-Verstoß).
- Alle Skripte: ES-Module, nur `node:`-Module + lib.mjs, CLI-Argumente per `node:util` `parseArgs`, Ausgabe als JSON-Datei (Pfad per `--aus`) plus eine knappe Zusammenfassung auf stdout, Exit-Code 1 bei Befund über Schwelle, 2 bei Werkzeugfehler. Deutsche Bezeichner, Kommentare knapp.

## Schritte
1. `bild.mjs --url <u> --aus <datei.jpg> [--breite 390 --hoehe 844] [--schema light|dark] [--bewegung reduce|no-preference] [--voll]`: ein Bildschirmfoto als JPEG Qualität 70, Gerätepixelverhältnis 1, fremde Requests blockiert.
2. `bildsatz.mjs --basis <http://127.0.0.1:PORT> --pfade /,/x/ --aus <ordner> [--schemata light,dark]`: je Pfad × 3 GERAETE × Schema: Seite laden, dann je Bildschirmhöhe einen Ausschnitt (scrollen per `window.scrollTo`, max. 12 Ausschnitte je Seite) als JPEG Q70 ≤ 1440 px breit; Dateiname `<pfad-slug>__<geraet>__<schema>__<nn>.jpg`; dazu `index.json` mit Liste.
3. `ueberlauf.mjs --basis <u> --pfade … --aus <json>`: je Pfad bei Breiten 320, 390, 768, 1440, 1920 und zusätzlich 200 % Zoom (Breite 640 mit `deviceScaleFactor` 2 und CSS-Breite 320 ist NICHT gleich Zoom – nutze stattdessen Viewport 640 und `document.documentElement.style.zoom` ist verboten wegen CSP; nimm `page.emulateMedia` nicht dafür, sondern Viewport-Breite 640 + CDP `Emulation.setPageScaleFactor` 2 oder melde OFFENE FRAGE) und `forcedColors: 'active'`: prüft `scrollWidth > clientWidth` am `documentElement` und listet bis 10 Elemente, deren `getBoundingClientRect().right` die Viewportbreite übersteigt (Selektor + Breite).
4. `axe.mjs --basis <u> --pfade … --aus <json> [--schema light|dark]`: Kontext mit `bypassCSP: true` (sonst blockieren Trusted Types die Injektion), axe-core aus `pfadVon('axe-core')` per `page.addScriptTag({path})`, Regeln WCAG 2.0/2.1/2.2 A+AA (`runOnly: {type:'tag', values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}`), Ausgabe je Pfad: Anzahl je impact, Liste der serious/critical mit id, help, Ziel-Selektoren (max. 5 je Regel). Exit 1 wenn serious+critical > 0.
5. `smoke.mjs --basis <u> --pfade … --aus <json>`: je Pfad (Viewport 390×844 und 1440×900): fremde Requests blockieren und zählen (Soll 0), Konsolenfehler und -warnungen sammeln, CSP-Verstöße über `page.on('console')` (Meldungen mit „Content Security Policy“/„Trusted Type“) und über `securitypolicyviolation`-Events (per `page.addInitScript` ist wegen CSP evtl. blockiert → nutze CDP `Log.enable`/`Runtime.consoleAPICalled` bzw. `page.on('console')`), HTTP-Status der Seite und aller Unterressourcen (≥ 400 = Befund), `<title>` vorhanden, genau ein `<h1>`. Optionaler Parameter `--skript <modul.mjs>`: ein Modul mit `export default async (page) => [{name, ok, detail}]` für seiten-spezifische Interaktionsprüfungen; Ergebnisse werden angehängt. Exit 1 bei jedem Befund.
6. Nachweis: Starte in einem eigenen Node-Prozess `statikServer('_werkstatt/werkzeuge/fixture', 4290)` (z. B. `node -e "import('./_werkstatt/werkzeuge/lib.mjs').then(m=>m.statikServer('_werkstatt/werkzeuge/fixture',4290))" &`), führe alle 5 Skripte gegen `/` (gut) und `/schlecht.html` aus, Ausgaben nach `/home/user/schluesseldienst/.cache/werkzeug-nachweis/` (gitignored). Erwartung: gut → Exit 0 bei axe/smoke/ueberlauf; schlecht → Exit 1 mit den absichtlichen Fehlern gefunden. Server danach beenden.

## Schnellprüfung (Stufe A) und Selbstprüfung
- `node --check` für jedes Skript; die Nachweisläufe aus Schritt 6 mit Exit-Codes in PRÜFUNG UND ERGEBNIS (Tabelle Skript × Fixture × Exit-Code × gefundene Befunde).
- Mengen gezählt (5 Skripte), Schreibrechte eingehalten (nur die 5 Dateien + .cache-Ausgaben), offene Fragen gelistet.
