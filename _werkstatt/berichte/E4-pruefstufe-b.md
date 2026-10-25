# E4 · Prüfstufe B · Ansichten V04, V08, V09, V10, V11, V12 (10 Referenzpfade)

Paket E4-PRUEF-13 · Prüfer (Haiku) · 2026-10-25, Messzeitraum 15:15–15:33 UTC
Messbuild: `node bau/bauen.mjs --messen --pruefen --port=4201 --aus=.cache/e4/dist` (Stand 3ec9f31, Build 15:15 UTC). Eigene Vorschau `http://127.0.0.1:4201` (PID 26279, am Ende beendet).
Maßstab: KERN K-011 und ABNAHME Z-02…Z-09. Mediane aus 3 Läufen bei lighthouse, inp und bildrate; smoke, axe, ueberlauf, vnu und bildsatz je einen Lauf. Rohdaten `.cache/e4/` (gitignored), Bilder `_werkstatt/bilder/E4/`.
Referenzpfade: `/preise/` · `/ratgeber/` · `/ratgeber/rauchmelderpflicht/` · `/ueber-uns/` · `/kontakt/` · `/leistungen/` · `/sitemap/` · `/suche/` · `/impressum/` · `/gibt-es-nicht/` (404).

## 1. Kriterien

| Kriterium | Pfad | Messung | Ergebnis | Schwelle | Beleg |
|---|---|---|---|---|---|
| Z-02 Bestand (Teil) | alle | `npm test` | 246 Tests: 245 pass, 0 fail, 1 todo | `node --test` grün | `.cache/e4/npm-test.txt` · erfüllt |
| Z-02 Bestand (Teil) | alle (5 556 Seiten) | `bauen --messen --pruefen --port=4201` | Exit 0; 0 Fehler in allen Prüfern; Warnungen: seo 72 | Build grün | `.cache/e4/bauen-messen-pruefen.txt`, `.cache/e4/dist.pruefbefunde.json` · erfüllt (Befund 7) |
| Z-02 Bestand (Teil) | alle 10 | smoke bei 390×844 und 1440×900 (20 Messungen) | fremde Anfragen 0 · CSP-Verstöße 0 · Konsolenfehler 2 (beide: 404 des Hauptdokuments `/gibt-es-nicht/`) · Konsolenwarnungen 0 · h1 je 1 · Titel 20/20 · Status 200 (18×), 404 (2×, `/gibt-es-nicht/`) | 0 · 0 · 0 außer dem 404 | `.cache/e4/smoke.json` · erfüllt |
| Z-02 Bestand (Teil) | alle 10 | vnu über 10 Dateien in `.cache/e4/dist` (404: `404.html`) | **1 Fehler** (`preise/index.html:76`) · 53 Warnungen | 0 Fehler | `.cache/e4/vnu.json` · **nicht erfüllt** (Befund 2); Warnungen Befund 3 |
| Z-03 Designsystem (Teil) | alle | Prüfer `token` im Messbuild | 0 Fehler, 0 Warnungen | 0 Werte außerhalb der Tokens | `.cache/e4/dist.pruefbefunde.json` · Teilbeleg, kein Token-Linter-Protokoll |
| Z-05 Bewegung | `/gibt-es-nicht/` (V12) | `reducedMotion: reduce`, 390×844, `getAnimations()` nach 200 ms und an 13 Scroll-Positionen | 0 nach 200 ms · max. 0 beim Scrollen · Lage und Größe aller Zielelemente konstant · Inhalte sichtbar (Figur, Stifte, drei Wege, h1; Scherlinien-Hälften siehe Ausführungsnotiz 3) | 0 Animationen · keine Lage-/Größenänderung · Inhalte sichtbar | `.cache/e4/bewegung-reduziert.json` · erfüllt (Teil). Kontrolle ohne reduce: 7 Animationen (Zähler erfasst) |
| Z-05 Bewegung | `/ueber-uns/` (V09) | wie oben | 0 nach 200 ms · max. 0 beim Scrollen · Tunnel sichtbar (`.lb-tunnel`, `.lb-tor`, `.lb-text-tunnel`, `.lb-fluss-teil`) · Lage konstant | 0 Animationen · keine Lage-/Größenänderung · sichtbar | `.cache/e4/bewegung-reduziert.json` · erfüllt (Teil). Kontrolle ohne reduce: 5 Animationen |
| Z-05 Bewegung (M-20) | `/ueber-uns/` | bildrate, Auslöser scroll, 4×, 2 000 ms, 3 Läufe | verworfen 0,00 / 0,00 / 0,00 % → Median **0,00 %** (140 / 140 / 141 Bilder) | ≤ 5 % | `.cache/e4/bildrate-m20-scroll-1..3.json` · erfüllt (Ersatzmessung, U-3) |
| Z-05 Bewegung (M-21) | `/gibt-es-nicht/` | bildrate, Auslöser laden, 4×, 1 600 ms, 3 Läufe | verworfen 2,11 / 1,02 / 2,04 % → Median **2,04 %** (95 / 98 / 98 Bilder) | ≤ 5 % | `.cache/e4/bildrate-m21-laden-1..3.json` · erfüllt (Ersatzmessung, U-3) |
| Z-07 Zugänglichkeit (axe) | alle 10 | axe-core, WCAG 2.0/2.1/2.2 A und AA, hell | minor 0 · moderate 0 · serious 0 · critical 0 auf allen 10 | 0 serious/critical | `.cache/e4/axe-light.json` · erfüllt (nur axe-Teil) |
| Z-07 Zugänglichkeit (axe) | alle 10 | axe-core, dunkel | identisch: 0 auf allen 10 | 0 serious/critical | `.cache/e4/axe-dark.json` · erfüllt (nur axe-Teil) |
| Z-08 Leistung | alle 6 Lighthouse-Pfade | Lighthouse mobil, 3 Läufe, Median (Spanne) | Perf 97–99 · A11y 100 · BP 100 · SEO 100, **außer `/suche/` 66** · LCP 1 674–2 255 ms · CLS 0,000 · TBT 0–27 ms · je Pfad siehe Tabelle unten | Perf ≥ 95 · A11y/BP/SEO 100 · LCP ≤ 2 500 ms · CLS ≤ 0,1 | `.cache/e4/lighthouse.json` · **1 verfehlt** (Befund 4). TBT hat in ABNAHME keine Schwelle |
| Z-08 Leistung (INP) | `/preise/` | Aktionen `e4-preise.json` (Klick Zone B, Klick „Schließzylinder tauschen“), Drossel 4×, 3 Läufe | max. je Lauf 40 / 32 / 40 ms → Median **40 ms** | ≤ 200 ms | `.cache/e4/inp-preise-1..3.json` · erfüllt |
| Z-08 Leistung (INP) | `/kontakt/` | `e4-kontakt.json` (Klick „E-Mail vorbereiten“ ohne Eingaben, Tippen „Weilburg“ in `#k-ort`), Drossel 4×, 3 Läufe | max. je Lauf 24 / 32 / 40 ms → Median **32 ms** (Tippen ohne Meldung, unter 16 ms) | ≤ 200 ms | `.cache/e4/inp-kontakt-1..3.json` · erfüllt |
| Z-08 Leistung (INP) | `/suche/` | `e4-suche.json` (Klick `#suche-eingabe`, Tippen „zyl“), Drossel 4×, 3 Läufe | max. je Lauf 24 / 24 / 32 ms → Median **24 ms** | ≤ 200 ms | `.cache/e4/inp-suche-1..3.json` · erfüllt |
| Z-08 Leistung (Budgets) | alle | Prüfer `budgets` im Messbuild | CSS gz gemeinsam 9 677 B, je Seite max 12 838 B (Grenze 14 336) · JS gz 12 421 B (Grenze 16 384) · Schriften 70 840 B (Grenze 76 800) · Ortsseiten größte 29 574 B roh (Grenze 30 720) | K-011 | `.cache/e4/dist.pruefbefunde.json` · erfüllt. Bewegungscode nicht gesondert ausgewiesen |
| Z-08 Leistung (Vergleich E2) | alle 6 | Baseline E2 gilt für V01 | keine Baseline für diese Ansichten | — | `.cache/e2/lighthouse.json` · nicht vergleichbar |
| Z-09 Darstellung (Teil) | alle 10 | ueberlauf bei 320, 390, 768, 1440, 1920 px, erzwungene Farben je Breite, 200 % Zoom | 110 Messungen (11 je Pfad), **2 mit Dokumentüberlauf**: `/kontakt/` bei 320 px (hell und erzwungene Farben) | 0 Überlauf | `.cache/e4/ueberlauf.json` · **nicht erfüllt** (Befund 1) |
| Z-09 Darstellung (Bildsatz) | alle 10 | bildsatz, 390 / 768 / 1 440 px, hell und dunkel, JPEG Q70 | 380 erzeugt, 253 behalten · mobil hell 2,77 MB (79 Bilder) · mobil dunkel 1,13 MB (30) · tablet hell 2,07 MB (30) · tablet dunkel 2,07 MB (30) · desktop hell 4,33 MB (54) · desktop dunkel 2,40 MB (30) · gesamt **14,76 MB** | Ziel < 12 MB | `_werkstatt/bilder/E4/index.json` · **Größenziel verfehlt** (Befund 6). Kappung bei zwei Seiten (Befund 5). Sichtprüfung in Stufe C |

### Z-08 Lighthouse je Pfad (mobil, Median (Spanne aus 3 Läufen))

| Pfad | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP |
|---|---|---|---|---|---|---|---|---|
| `/preise/` | 97 (0) | 100 (0) | 100 (0) | 100 (0) | 2 255 ms (157) | 0,000 (0,000) | 0 (0) | 1 805 ms (7) |
| `/ratgeber/rauchmelderpflicht/` | 99 (0) | 100 (0) | 100 (0) | 100 (0) | 1 805 ms (137) | 0,000 (0,000) | 0 (0) | 1 369 ms (4) |
| `/ueber-uns/` | 98 (0) | 100 (0) | 100 (0) | 100 (0) | 2 106 ms (5) | 0,000 (0,000) | 0 (0) | 1 806 ms (5) |
| `/kontakt/` | 99 (0) | 100 (0) | 100 (0) | 100 (0) | 1 806 ms (7) | 0,000 (0,000) | 27 ms (37) | 1 380 ms (3) |
| `/suche/` | 99 (0) | 100 (0) | 100 (0) | **66 (0)** | 1 674 ms (138) | 0,000 (0,004) | 0 (0) | 1 365 ms (9) |
| `/impressum/` | 99 (0) | 100 (0) | 100 (0) | 100 (0) | 1 803 ms (141) | 0,000 (0,000) | 0 (0) | 1 368 ms (11) |

## 2. Befunde (Datei · Selektor)

1. **Überlauf auf `/kontakt/` bei 320 px.** Das Dokument ist 340 px breit (mit erzwungenen Farben 342 px) bei 320 px Ansicht. Betroffen sind `main#inhalt > section:nth-of-type(1) > div > div > section:nth-of-type(1)` und `…section:nth-of-type(2)`, also je `section.kontakt-weg` in `div.kontakt-wege`. Rechte Kante 340 px, Breite 324 px. Quellen: `src/vorlagen/seiten/kontakt.mjs` Zeilen 28–29 und 35; `src/assets/css/ansichten/kontakt/kontakt.css` Zeile 6 (`.kontakt-wege` ohne Spaltenvorgabe unter 48em; `minmax(0, 1fr)` erst ab Zeile 48). Ursache nicht abschließend geprüft.
2. **vnu-Fehler.** `.cache/e4/dist/preise/index.html:76`: `<div class="preise-formel" aria-labelledby="formel-titel">`. `aria-labelledby` an einem `div` ohne `role`. Quelle `src/vorlagen/seiten/preise.mjs:55`.
3. **vnu-Warnungen (53).** 22 × „Inline script violates CSP“ bei `<script type="application/ld+json">` (z. B. `.cache/e4/dist/kontakt/index.html:28` und `:29`; Quelle `src/vorlagen/layout.mjs`). 31 × „Resource violates CSP“ bei `/assets/*.css` und `/assets/*.js` (z. B. `404.html:23` und `:25`). vnu prüft die Dateien auf dem Datenträger, nicht den Vorschau-Server (wie E3 Befund 3).
4. **SEO `/suche/` 66.** Audit `seo/is-crawlable` in 3 von 3 Läufen. Ursache belegt: `<meta name="robots" content="noindex, follow">` in `.cache/e4/dist/suche/index.html`, gesetzt über `src/konfig/routen.mjs:32` (`indexierbar: false`) und `src/vorlagen/seiten/suche.mjs:14`. Die Bewertung gegenüber K-011 (SEO 100) liegt beim Orchestrator.
5. **Bildsatz-Kappung auf 12 Ausschnitte.** `/preise/` mobil: 10 828 px hoch, 12 von 13 Ausschnitten, der Seitenteil ab 10 128 px fehlt (700 px). `/sitemap/` mobil: 17 202 px hoch, 12 von 21 Ausschnitten, ab 10 128 px fehlen 7 074 px. Quelle `_werkstatt/werkzeuge/bildsatz.mjs:7` (`MAX_AUSSCHNITTE = 12`). Gleiche Befundart wie E3 Befund 2. Das Feld `gekuerzt: true` steht in `_werkstatt/bilder/E4/index.json` bei vier Mobil-Einträgen (zwei Seiten, hell und dunkel).
6. **Bildsatz-Größe.** 14,76 MB nach der Kürzung (Ziel < 12 MB, Dezimal-MB wie in E3). Die vorgegebene Regel (Hell Desktop und Mobil vollständig, Tablet und Dunkel Ausschnitte 1–3) reproduziert bei E3 exakt die 190 Bilder, bei E4 ergibt sie diese Größe. Eine weitere Kürzung habe ich nicht vorgenommen.
7. **SEO-Titel (Build).** 72 Warnungen `seo/titel-laenge` (Titel über 60 Zeichen), gleiche Anzahl wie in E3. Beispiel `.cache/e4/dist/schluesseldienst-altdorf-suedliche-weinstrasse/index.html` mit 65 Zeichen. Liste in `.cache/e4/dist.pruefbefunde.json` (seo).

## 3. Nicht geprüft

- Z-02 Stufe C: Funktionsliste F01–F20, `--release`-Negativtest mit Platzhaltern, Konsolen- und CSP-Prüfung über alle Seiten.
- Z-03 Token-Linter-Protokoll (nur Teilbeleg oben).
- Z-04 Gestaltung (Endprüfung, Blindvergleich).
- Z-05 Register K-007 (jede Animation). Große Momente außerhalb von M-20 und M-21 sind nicht Teil dieser Stufe. Lage- und Größenkonstanz nur für `/gibt-es-nicht/` und `/ueber-uns/`.
- Z-06 Grafik (Icon-Familie, Geometrie-Linter, doppelte IDs).
- Z-07 Tastaturprotokoll H1–H5, sichtbarer Fokus, Kontraste nach K-005. axe nur automatisiert.
- Z-08 Bewegungscode separat (≤ 60 KB gz). Lighthouse nur mobil. Das Erscheinen der Fehlerübersicht in `/kontakt/` nach dem Klick ist nicht gemessen; INP misst nur die Latenz. Keine Baseline für diese Ansichten.
- Z-09 Sichtprüfung der Bildsätze (Text-Überlappung, Abschneiden). Bilder bei 320 und 1 920 px fehlen; die Zahlen aus `ueberlauf` decken sie ab. Stichprobe mit Ortsseiten nicht Teil dieses Umfangs.
- U-6 Platzhalter (64 in der Ausgabe, 58 in der Konfiguration) und ungeprüfte Fakten (92 im Build) nicht bewertet. Sichtbar im Bildsatz zum Beispiel `[Firmenname]` und `[Telefonnummer]`.
- Firefox, Safari (U-2) und echte Geräte (U-1).

## 4. Ausführungsnotizen

1. Alle Browser-Läufe nacheinander, nie parallel (Mess-Sperre der Werkzeuge; eigene Skripte über `mitMessSperre`). Lighthouse in einem Aufruf: 18 Läufe (6 Pfade × 3), Exit 1 durch die eine Verfehlung.
2. Der Messbuild lief mit `--port=4201`. Die kanonische Basis in der JSON-LD ist daher `127.0.0.1:4201` (E3 Befund 4 vermieden).
3. Schritt 9 hat kein fertiges Werkzeug. Eigenes Skript `.cache/e4/bewegung-reduziert.mjs`, Ausgabe `.cache/e4/bewegung-reduziert.json` und `.cache/e4/bewegung-reduziert.txt`. Das Kriterium „Fläche > 0“ meldete die beiden Scherlinien-Hälften `.zy-scherlinie-links` und `.zy-scherlinie-rechts` als nicht sichtbar. Diese sind horizontale SVG-Pfade mit Höhe 0, Breite 112,9 px, Deckkraft 1, `visibility: visible` und `display: inline`. Sie sind als sichtbar gewertet, das JSON-Feld `sichtbarBei200` steht unverändert auf `false`. Zwischen den beiden Hälften liegt im gebrochenen Zustand eine Lücke von 10,5 px (x 230,4 bis 240,9).
4. Schritt 7: Die Aktion `tippen` in `#k-ort` meldet keine Event-Timing-Meldung (unter 16 ms). Deshalb melden `/preise/` 2 von 2 Aktionen, `/kontakt/` 1 von 2, `/suche/` 3 bis 4 Ereignisse. Der Text „Weilburg“ ist meine Wahl, das Paket nennt keinen Text.
5. Git-Stand: Die Aktionsdateien `e4-preise.json`, `e4-kontakt.json` und `e4-suche.json` stehen seit Commit `b0ddfa9` („Zwischenstand … E4-PRUEF-13 Aktionsdateien“, 15:21:50 UTC) im Index. Die Bildsätze (254 Dateien unter `_werkstatt/bilder/E4/`, einschließlich `index.json`) stehen seit Commit `979d959` („Zwischenstand … E4-PRUEF-13 Bildsätze“, 15:35:10 UTC) im Index; dieser Commit enthält außerdem `src/assets/css/druck.css` (K-01). Beide Commits stammen nicht von mir. Inhalt und Arbeitskopie stimmen überein. Ich habe keine git-Befehle ausgeführt, die etwas verändern.
6. Während des Laufs wechselte HEAD von `3ec9f31` (15:14:38) auf `863b235` (15:31:40, fremder Commit). Außerdem erschien `src/assets/css/druck.css` unversioniert (15:29:17). Die Messungen laufen gegen den Build von 15:15 (`.cache/e4/dist`), nicht gegen den aktuellen Arbeitsbaum. Ich habe nichts davon geändert.
7. Bildsatz: 380 Bilder erzeugt. Nach der Kürzung 253 Bilder, 127 Dateien gelöscht. `index.json` hat das Feld `gekuerzt` auf oberster Ebene erhalten, das Array `bilder` ist auf die 253 behaltenen Bilder reduziert. Die Angaben `seiten` (Ausschnitte je Gerät) blieben unverändert.
8. Vorschau: Neben meiner Vorschau liefen weitere Vorschau-Prozesse anderer Pakete (Ports 4180 und 4185 sowie ein Prozess mit Standardport 4173). Diese habe ich nicht berührt.

## 5. Offene Fragen

1. Bildsatz: 14,76 MB gegen das Ziel < 12 MB. Soll die Regel verschärft oder das Ziel angepasst werden? Entscheidung Orchestrator (wie E3 Offene Frage 1).
2. Kappung auf 12 Ausschnitte (Befund 5): anheben oder bei langen Seiten teilen?
3. `/suche/` SEO 66 (Befund 4): bewusstes noindex als Ausnahme zu K-011 festhalten oder die Messung anders führen?
4. vnu-Fehler in `src/vorlagen/seiten/preise.mjs:55` (Befund 2): Korrekturauftrag an den Verantwortlichen?
5. Überlauf auf `/kontakt/` (Befund 1): Ursache und zuständige Datei bestätigen.
6. Erscheinen der Fehlerübersicht nach dem leeren Klick in `/kontakt/`: Soll Stufe C das prüfen?

## 6. Gemeinsame Dateien (gewünschte Änderungen, nicht umgesetzt)

- `_werkstatt/werkzeuge/bildsatz.mjs` Zeile 7: `MAX_AUSSCHNITTE` oder eine Zählung für lange Seiten (Befund 5).
- Für Schritt 9 existiert kein gemeinsames Werkzeug. `.cache/e4/bewegung-reduziert.mjs` könnte als Werkzeug übernommen werden. Das Sichtbarkeitskriterium müsste Linien mit Höhe 0 berücksichtigen (Ausführungsnotiz 3).

## Selbstprüfung

- Alle 12 Schritte ausgeführt. Mediane aus 3 Läufen bei lighthouse, inp und bildrate. Belegpfade existieren.
- Schreibrechte eingehalten: neu `_werkstatt/bilder/E4/**`, `_werkstatt/werkzeuge/aktionen/e4-*.json` (drei Dateien), dieser Bericht. Ausgaben unter `.cache/e4/**`. Kein Schreibzugriff auf `src/`. Von mir nichts committet; die Zwischenstand-Commits `b0ddfa9` und `979d959` (Ausführungsnotiz 5) stammen nicht von mir.
- Vorschau per PID 26279 beendet.
