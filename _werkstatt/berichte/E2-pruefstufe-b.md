# E2 · Prüfstufe B · Referenzansicht V01 (Startseite `/`) und 404-Seite

Paket E2-PRUEF-08 · Prüfer (Haiku) · 2026-10-25, 13:00–13:11 UTC
Messbuild: `node bau/bauen.mjs --messen --pruefen` (Ausgabe `dist/`). Vorschau-Server `http://127.0.0.1:4173` lief bereits und liefert den Messbuild (`robots` index, canonical 127.0.0.1:4173); er wurde nicht neu gestartet.
Maßstab: KERN K-011 und ABNAHME Z-02…Z-09. Mediane aus 3 Läufen, wo das Werkzeug Läufe fährt. Rohdaten: `.cache/e2/` (gitignored), Bilder: `_werkstatt/bilder/E2/`.

## 1. Kriterien

| Kriterium | Messung | Ergebnis | Schwelle | Beleg |
|---|---|---|---|---|
| Z-02 Bestand (Teil) | `npm test` | 95 pass, 0 fail | `node --test` grün | `.cache/e2/npm-test.txt` · erfüllt |
| Z-02 Bestand (Teil) | `bauen --messen --pruefen`, 10 Prüfer | 162 Fehler, alle `links/ziel-fehlt`; 0 Warnungen; 9 Prüfer ohne Befund | Build grün | `.cache/e2/bauen-messen-pruefen.txt`, `.cache/pruefbefunde.json` · **verfehlt** |
| Z-02 Bestand (Teil) | smoke `/` bei 390×844 und 1440×900 | fremde Anfragen 0 · CSP-Verstöße 0 · Konsolenfehler 0 · h1 je 1 | 0 · 0 · 0 | `.cache/e2/smoke.json` · erfüllt |
| Z-02 Bestand (Teil) | smoke `/gibt-es-nicht/` | Status 404, Titel „Seite nicht gefunden“, h1 je 1; je Viewport 3 Befunde, alle der 404 des Hauptdokuments | 404 mit Fehlerseite | `.cache/e2/smoke.json` · erfüllt |
| Z-03 Designsystem (Teil) | Prüfer `token` im Build-Lauf | 0 Fehler, 0 Warnungen | 0 Werte außerhalb der Tokens | `.cache/pruefbefunde.json` · Teilbeleg, kein Token-Linter-Protokoll |
| Z-05 Bewegung | `getAnimations()` nach 200 ms, `reducedMotion: reduce`, 390×844 | 0 laufende Animationen (Kontrolle ohne reduce: 28); `.zy-scherlinie` 1× vorhanden, Stil opacity 1, im Bild sichtbar; `isVisible()` meldet false (Befund 5) | 0 Animationen; Linie sichtbar | `.cache/e2/bewegung-pruefung-ruhig.json`, `_werkstatt/bilder/E2/bewegung/reduce-390x844.jpg` · erfüllt |
| Z-05 Bewegung | `bildrate` 4×, Auslöser laden, 1600 ms, 3 Läufe | verworfen 2,0 / 3,2 / 2,0 % → Median **2,0 %** (95–99 Bilder je Lauf) | ≤ 5 % | `.cache/e2/bildrate-ruhig-1..3.json` · erfüllt (Ersatzmessung, UMGEBUNGSAUSNAHME) |
| Z-07 Zugänglichkeit | axe-core, WCAG 2.0/2.1/2.2 A und AA, 1440×900 | hell: 1 serious (`link-name`, `.kopf-suche`), 0 critical; dunkel: identisch | 0 serious/critical | `.cache/e2/axe-light.json`, `.cache/e2/axe-dark.json` · **verfehlt** |
| Z-08 Leistung | Lighthouse mobil `/`, 3 Läufe, Median (Spanne) | Perf 98 (0) · A11y 96 (0) · BP 100 (0) · SEO 100 (0) · LCP 2 104 ms (2) · CLS 0,000 (0,014) · TBT 0 ms (65) · FCP 1 654 ms (2) | Perf ≥ 95 · A11y/BP/SEO 100 · LCP ≤ 2 500 ms · CLS ≤ 0,1 | `.cache/e2/lighthouse.json` · **A11y verfehlt**, übrige erfüllt |
| Z-08 Leistung | INP, Aktionen `_werkstatt/werkzeuge/aktionen/v01-inp.json`, Drossel 4×, 3 Läufe | max 48 / 48 / 64 ms → Median **48 ms** (p98 = max) | ≤ 200 ms | `.cache/e2/inp-ruhig-1..3.json` · erfüllt |
| Z-08 Leistung | Budgets des Builds | JS gz gesamt 5 931 B (Grenze 16 384); CSS gz 9 315 B (Grenze 14 336) | Bewegungscode ≤ 60 KB gz | `.cache/pruefbefunde.json` (Prüfer budgets) · Bewegungscode nicht gesondert ausgewiesen (Offene Frage 2) |
| Z-08 Leistung | Vergleich mit erster eigener Messung | diese Messung ist die Baseline (E2) | Abweichung nicht über Spanne | `.cache/e2/lighthouse.json` · kein Vergleich möglich |
| Z-09 Darstellung (Teil) | `ueberlauf` `/`: 320, 390, 768, 1440, 1920; erzwungene Farben; 200 % Zoom | 11 Messungen, 0 mit Dokumentüberlauf | 0 Überlauf | `.cache/e2/ueberlauf.json` · erfüllt |
| Z-09 Darstellung (Teil) | Bildsatz `/`, hell und dunkel, 390/768/1440 | 60 Bilder + `index.json`, 3 647 066 B (3,6 MB; Ziel < 6 MB), JPEG Q70, max. 1 440 px | Sichtprüfung in Stufe C | `_werkstatt/bilder/E2/v01/index.json` · Bereitstellung, keine Bewertung |

## 2. Befunde (Datei · Selektor)

1. **axe `link-name` (serious), hell und dunkel:** Selektor `.kopf-suche`, 1 Knoten. Quellen: `src/vorlagen/teile/kopf.mjs:32` (Link mit Icon und `<span>Suche</span>`) und `src/assets/css/layout.css:33` (`.kopf-suche span { display: none; }`, ohne Medienabfrage).
2. **Lighthouse A11y 96** (in allen 3 Läufen 96): `lighthouse.mjs` speichert keine Audit-Details; welcher Audit die Punkte kostet, ist nicht belegt (Offene Frage 1).
3. **`links/ziel-fehlt`: 162 Fehler** (Quelle `/index.html`: 96, `/404.html`: 66) auf **59 Ziel-URLs**. Zusätzlich Info `links/graph`: erreichbar 1/2, max. Tiefe 0 (im Messbuild existiert nur die Startseite als Ziel). Gruppierte Liste (Anzahl Fehler je Ziel):

Ziele: 59, Fehler gesamt 162 (Quellen: /index.html 96, /404.html 66).

- `/barrierefreiheit/` (2)
- `/datenschutz/` (2)
- `/einbau-tresore/` (7)
- `/einbau-tresore/datensicherungsschraenke/` (2)
- `/einbau-tresore/moebeltresore/` (2)
- `/einbau-tresore/sicherheitsfenster/` (2)
- `/einbau-tresore/sicherheitstueren/` (2)
- `/einbau-tresore/waffenschraenke/` (2)
- `/einbau-tresore/wertschutzschraenke/` (2)
- `/einbruchschutz/` (7)
- `/einbruchschutz/fenstersicherung/` (2)
- `/einbruchschutz/schliessanlagen/` (2)
- `/einbruchschutz/schliesszylinder/` (3)
- `/einbruchschutz/schutzbeschlaege/` (2)
- `/einbruchschutz/tuerschliesser/` (2)
- `/einbruchschutz/tuerschloesser/` (2)
- `/einbruchschutz/tuersicherung/` (2)
- `/einbruchschutz/zusatzschloesser/` (2)
- `/einsatzgebiet/` (10)
- `/impressum/` (2)
- `/kontakt/` (7)
- `/leistungen/` (7)
- `/notoeffnung/` (7)
- `/notoeffnung/autooeffnung/` (3)
- `/notoeffnung/einbruchschaden/` (3)
- `/notoeffnung/garagenoeffnung/` (2)
- `/notoeffnung/tresoroeffnung/` (2)
- `/notoeffnung/tueroeffnung/` (5)
- `/preise/` (9)
- `/quellen-lizenzen/` (2)
- `/ratgeber/` (6)
- `/ratgeber/schluesseldienst-abzocke-erkennen/` (1)
- `/schluesseldienst-beselich/` (1)
- `/schluesseldienst-braunfels/` (1)
- `/schluesseldienst-brechen/` (1)
- `/schluesseldienst-ehringshausen/` (1)
- `/schluesseldienst-elbtal/` (1)
- `/schluesseldienst-elsoff/` (1)
- `/schluesseldienst-leun/` (1)
- `/schluesseldienst-loehnberg/` (1)
- `/schluesseldienst-mengerskirchen/` (1)
- `/schluesseldienst-merenberg/` (1)
- `/schluesseldienst-neunkirchen-westerwaldkreis/` (1)
- `/schluesseldienst-runkel/` (1)
- `/schluesseldienst-solms/` (1)
- `/schluesseldienst-villmar/` (1)
- `/schluesseldienst-waldbrunn/` (1)
- `/schluesseldienst-weilburg/` (1)
- `/schluesseldienst-weilmuenster/` (1)
- `/schluesseldienst-weinbach/` (1)
- `/sicherheitstechnik/` (7)
- `/sicherheitstechnik/alarmanlagen/` (2)
- `/sicherheitstechnik/nebelsysteme/` (2)
- `/sicherheitstechnik/rauchmelder/` (2)
- `/sicherheitstechnik/videoueberwachung/` (2)
- `/sitemap/` (2)
- `/suche/` (6)
- `/ueber-uns/` (6)
- `/widerruf/` (2)

4. **Smoke `/gibt-es-nicht/`:** je Viewport drei Befunde („Hauptdokument Status 404“, „Unterressource 404“ mit derselben URL, „Konsolenfehler 404“). Alle drei sind die 404-Antwort der Seite selbst; weitere Befunde gibt es nicht.
5. **`.zy-scherlinie` (Startseite, reduziert):** Playwright `isVisible()` meldet `false`. Diagnose (`.cache/e2/scherlinie-diagnose.json`): der Pfad ist waagerecht (`M72 120H432`), `getBoundingClientRect().height` ist 0. Computed Style: opacity 1, visibility visible, display inline, Stroke rgb(168, 74, 34), 3 px. Das Bild `reduce-390x844.jpg` zeigt die Linie. `boundingBox()` liefert dagegen 1,97 px Höhe. Die Methoden widersprechen sich, `isVisible()` ist für diesen Elementtyp nicht belastbar.
6. **Sichtbeobachtung im Bild `reduce-390x844.jpg` (nicht gemessen):** Am unteren Rand der mobilen Leiste berühren sich die Beschriftung „Jetzt anrufen“ (`src/vorlagen/teile/rufknopf.mjs:7`) und der gestrichelte Rahmen des Platzhalters „[Telefonnummer]“. Keine automatische Prüfung auf Überlappung; offen für Stufe C (Z-09).
7. **Große Momente M-16 (Ist-Zeiten):** Desktop 1440×900 und mobil 390×844 je 5 Fotos. Ist-Zeit des ersten Fotos 112 ms bzw. 78 ms nach domcontentloaded, die übrigen 300/600/900/1300 ms auf ±2 ms genau (`_werkstatt/bilder/E2/moment/*/moment.json`). Keine Schwelle in dieser Stufe.

## 3. Nicht geprüft

- Z-02 Stufe C: Funktionsliste F01–F20, Negativtest `--release` mit Platzhaltern, Konsolen- und CSP-Prüfung über alle Seiten.
- Z-03 Token-Linter-Protokoll (nur Teilbeleg oben).
- Z-04 Gestaltung (Endprüfung und Blindvergleich).
- Z-05 Register K-007 (jede Animation) und Lage-/Größenkonstanz über die Zeit bei reduzierter Bewegung (geprüft nur: keine laufende Animation nach 200 ms).
- Z-06 Grafik (Icon-Familie, Geometrie-Linter, doppelte IDs).
- Z-07 Tastaturprotokoll H1–H5, sichtbarer Fokus, Kontraste nach K-005.
- Z-08 Bewegungscode separat; Folgemessungen gegen die Baseline.
- Z-09 Stichprobe (10 %, mindestens 20 Ortsseiten), Ansichten bei 768, 320 und 1920 px im Bild, Text-Überlappung und Abschneiden im Bild.
- Firefox, Safari (U-2) und echte Geräte (U-1).

## 4. Ausführungsnotizen

- Schritt 1: Der Messbuild hat `dist/` neu geschrieben (gitignored, Teil des Schritts).
- Schritt 2: Server lief bereits. Kein Start, kein `.cache/vorschau.log` von mir.
- Mess-Sperre: `.cache/mess.lock` habe ich nicht manuell gesetzt, weil die Datei außerhalb der Schreibrechte liegt. Die Werkzeuge `bild`, `axe`, `smoke`, `ueberlauf`, `bildsatz` und `moment` setzen die Sperre selbst. `inp`, `bildrate`, `lighthouse` und der Bewegungsaufruf tun es nicht.
- Überlappung: Während des ersten INP-Laufs (13:03:26–33) und des ersten bildrate-Laufs (13:04:18–25) lief eine fremde Lighthouse-Messung (`lh-lauf.sh`, Lock „lighthouse 9080“; V01-R bis 13:03:59, V01-A bis 13:04:47). Der Bewegungsaufruf (13:04:58) und die Diagnose (13:05:16) liefen ebenfalls parallel zu einer fremden Messung. Die Erstläufe liegen unter `.cache/e2/inp-1..3.json` (max 64/80/64 ms) und `.cache/e2/bildrate-1..3.json` (2,2/3,2/0,0 %), `.cache/e2/bewegung-pruefung.json`. Maßgeblich sind die Wiederholungen ohne fremde Messung (13:10 UTC, `*-ruhig*`).
- Lighthouse (13:02:50) und Smoke, axe, Überlauf (13:01–13:02) liefen vor der fremden Messung.
- Moment: zwei Unterordner (`desktop-1440x900`, `mobil-390x844`) statt einer Ablage, weil `moment-<nn>.jpg` sich sonst überschreibt.
- Neue Dateien: `_werkstatt/werkzeuge/moment.mjs`, `_werkstatt/werkzeuge/aktionen/v01-inp.json`. Hilfsskripte nur in `.cache/e2/`: `bewegung-pruefung.mjs`, `scherlinie-diagnose.mjs`.

## 5. Offene Fragen

1. Welcher Lighthouse-Audit verursacht A11y 96? Das Werkzeug speichert nur Kennzahlen.
2. Bewegungscode-Größe: nicht ausgewiesen. Gesamt-JS gz 5 931 B ist nur eine Obergrenze, falls der Bewegungscode darin enthalten ist.
3. Sichtbarkeitsmethode für die Scherlinie festlegen (`isVisible()` ist bei waagerechten Pfaden ungeeignet).
4. Bestätigen, dass die 59 Ziel-URLs in späteren Etappen laut PLAN entstehen.
5. Der Sperrhinweis in `_werkstatt/werkzeuge/README.md` („Die Werkzeuge setzen die Sperre nicht selbst“) passt nicht zu `bild`, `axe`, `smoke`, `ueberlauf`, `bildsatz`, `moment` und `vorher`. Entscheidung beim Orchestrator.

## 6. Gemeinsame Dateien (gewünschte Änderungen, nicht umgesetzt)

- `src/vorlagen/teile/kopf.mjs` Zeile 32 und `src/assets/css/layout.css` Zeile 33: Der Text „Suche“ muss für Hilfstechnik zugänglich bleiben, etwa durch visuelles Verbergen statt `display: none`, oder durch `aria-label` am Link (axe `link-name`, Befund 1).
- `_werkstatt/werkzeuge/README.md`: Sperrhinweis präzisieren (Offene Frage 5).
- `_werkstatt/werkzeuge/inp.mjs`, `bildrate.mjs`, `lighthouse.mjs`: Mess-Sperre über `mitMessSperre` aus `lib.mjs` einbinden (Orchestrator entscheidet, `lib.mjs` ist nicht Teil meiner Rechte).
