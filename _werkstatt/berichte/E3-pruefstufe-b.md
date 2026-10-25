# E3 · Prüfstufe B · Ansichten V02, V03, V05, V06, V07 (7 Referenzpfade)

Paket E3-PRUEF-11 · Prüfer (Haiku) · 2026-10-25, Messzeitraum 14:33–14:43 UTC
Messbuild: `node bau/bauen.mjs --messen --pruefen --aus=.cache/e3/dist` (ohne `--port`, siehe Befund 4). Eigene Vorschau `http://127.0.0.1:4201` (PID 6295, am Ende beendet).
Maßstab: KERN K-011 und ABNAHME Z-02…Z-09. Mediane aus 3 Läufen bei lighthouse, inp und bildrate; smoke, axe, ueberlauf, vnu und bildsatz fahren je einen Lauf. Rohdaten `.cache/e3/` (gitignored), Bilder `_werkstatt/bilder/E3/`.
Referenzpfade: `/einbruchschutz/` · `/notoeffnung/tueroeffnung/` · `/einbau-tresore/datensicherungsschraenke/` · `/einsatzgebiet/` · `/einsatzgebiet/hessen/limburg-weilburg/` · `/schluesseldienst-weilburg/` · `/schluesseldienst-loehnberg/`

## 1. Kriterien

| Kriterium | Pfad | Messung | Ergebnis | Schwelle | Beleg |
|---|---|---|---|---|---|
| Z-02 Bestand (Teil) | alle | `npm test` | 225 Tests: 224 pass, 0 fail, 1 todo | `node --test` grün | `.cache/e3/npm-test.txt` · erfüllt |
| Z-02 Bestand (Teil) | alle (5 533 Seiten) | `bauen --messen --pruefen` | Exit 0; 0 Fehler in allen Prüfern; Warnungen: seo 72, links 2 | Build grün | `.cache/e3/bauen-messen-pruefen.txt`, `.cache/e3/dist.pruefbefunde.json` · erfüllt (Befunde 5, 6) |
| Z-02 Bestand (Teil) | alle 7 | smoke bei 390×844 und 1440×900 (14 Messungen) | fremde Anfragen 0 · CSP-Verstöße 0 · Konsolenfehler 0 · Konsolenwarnungen 0 · Status 200 · h1 je 1 · Titel vorhanden | 0 · 0 · 0 | `.cache/e3/smoke.json` · erfüllt |
| Z-02 Bestand (Teil) | alle 7 | vnu über die sieben Seiten in `.cache/e3/dist` | 0 Fehler · 43 Warnungen (5–7 je Seite) | 0 Fehler | `.cache/e3/vnu.json` · erfüllt bei Fehlern; Warnungen Befund 3 |
| Z-03 Designsystem (Teil) | alle | Prüfer `token` im Messbuild | 0 Fehler, 0 Warnungen | 0 Werte außerhalb der Tokens | `.cache/e3/dist.pruefbefunde.json` · Teilbeleg, kein Token-Linter-Protokoll |
| Z-05 Bewegung | `/einbruchschutz/` | `reducedMotion: reduce`, 390×844, `getAnimations()` nach 200 ms | 0 laufende Animationen. Kontrolle ohne reduce: ebenfalls 0 (Befund 9) | 0 Animationen | `.cache/e3/bewegung-einbruchschutz.json` · Teilbeleg |
| Z-05 Bewegung | `/einbruchschutz/` (M-17) | Scrollen über die ganze Szene, 22 Proben, 390×844 | reduce: max. 0 laufende Animationen; ohne reduce: max. 2. Größe der Schritte in allen Proben gleich | keine Lage-/Größenänderung | `.cache/e3/bewegung-einbruchschutz-scroll2.json` · erfüllt für die Szene |
| Z-05 Bewegung | `/einbruchschutz/` (M-17) | reduce: Inhalte sichtbar | 5 von 5 `.szene-einzelbild` je einmal sichtbar (Deckkraft 1); `.szene-buehne` `display: none`. Ohne reduce: Einzelbilder ausgeblendet, Bühne `block` | alle Inhalte sichtbar | `.cache/e3/bewegung-einzelbild.json` · erfüllt |
| Z-05 Bewegung | `/einbruchschutz/` (M-17) | bildrate, Auslöser scroll, 4×, 3 Läufe | verworfen 0,71 / 0,00 / 0,00 % → Median **0,0 %** (140 / 141 / 141 Bilder) | ≤ 5 % | `.cache/e3/bildrate-m17-scroll-1..3.json` · erfüllt (Ersatzmessung, UMGEBUNGSAUSNAHME) |
| Z-05 Bewegung | `/einsatzgebiet/` (M-18) | bildrate, Auslöser scroll, 4×, 3 Läufe | verworfen 0,71 / 2,88 / 0,71 % → Median **0,71 %** (140 / 139 / 140 Bilder) | ≤ 5 % | `.cache/e3/bildrate-m18-scroll-1..3.json` · erfüllt (Ersatzmessung) |
| Z-07 Zugänglichkeit (axe) | alle 7 | axe-core, WCAG 2.0/2.1/2.2 A und AA, hell | minor 0 · moderate 0 · serious 0 · critical 0 auf allen 7 | 0 serious/critical | `.cache/e3/axe-light.json` · erfüllt (nur axe-Teil) |
| Z-07 Zugänglichkeit (axe) | alle 7 | axe-core, dunkel | identisch: 0 auf allen 7 | 0 serious/critical | `.cache/e3/axe-dark.json` · erfüllt (nur axe-Teil) |
| Z-08 Leistung | alle 7 | Lighthouse mobil, 3 Läufe, Median (Spanne) | Perf 99–100 (0–7) · A11y 100 (0) · BP 100 (0) · SEO 100 (0) · LCP 1 652–1 962 ms (4–166) · CLS 0,000 (0,000) · TBT 0–45 ms (0–328) · FCP 1 352–1 662 ms (4–16) | Perf ≥ 95 · A11y/BP/SEO 100 · LCP ≤ 2 500 ms · CLS ≤ 0,1 | `.cache/e3/lighthouse.json` · erfüllt, 0 verfehlt. TBT hat in ABNAHME keine Schwelle |
| Z-08 Leistung (INP) | `/einsatzgebiet/` | Aktionen `e3-einsatzgebiet.json` (Klick Ortsfeld, tippen „löhn“, ArrowDown, Enter), Drossel 4×, 3 Läufe | max. je Lauf 40 / 32 / 56 ms → Median **40 ms** (ArrowDown ohne Meldung, unter 16 ms) | ≤ 200 ms | `.cache/e3/inp-einsatzgebiet-1..3.json` · erfüllt |
| Z-08 Leistung (INP) | `/einsatzgebiet/hessen/limburg-weilburg/` | Aktionen `e3-hub.json` (Klick „W“, Tab), Drossel 4×, 3 Läufe | max. je Lauf 48 / 56 / 40 ms → Median **48 ms** | ≤ 200 ms | `.cache/e3/inp-hub-1..3.json` · erfüllt |
| Z-08 Leistung (Budgets) | alle | Prüfer `budgets` im Messbuild | JS gz gesamt 6 277 B (Grenze 16 384) · CSS gz gemeinsam 9 284 B, je Seite max. 12 445 B (Grenze 14 336) · Ortsseite größte 30 576 B roh (Grenze 30 720) · Schriften 70 840 B (Grenze 76 800) | K-011 | `.cache/e3/dist.pruefbefunde.json` · erfüllt. Bewegungscode nicht gesondert ausgewiesen (Offene Frage 4) |
| Z-08 Leistung (Vergleich E2) | alle 7 | Baseline E2 (V01, Median (Spanne)): Perf 98 (0) · A11y 96 (0) · LCP 2 104 (2) · CLS 0,000 (0,014) · TBT 0 (65) · FCP 1 654 (2) | Die Baseline gilt je Hauptansicht über die Zeit. Die E3-Pfade sind andere Ansichten, daher kein Vergleich. Zur Information: Perf 99–100, A11y 100, LCP 1 652–1 962 ms, TBT 0–45 ms, FCP 1 352–1 662 ms | Baseline `.cache/e2/lighthouse.json` · nicht vergleichbar |
| Z-09 Darstellung (Teil) | alle 7 | ueberlauf bei 320, 390, 768, 1440, 1920 px, erzwungene Farben je Breite, 200 % Zoom | 77 Messungen (11 je Pfad), 0 mit Dokumentüberlauf | 0 Überlauf | `.cache/e3/ueberlauf.json` · erfüllt (Teil) |
| Z-09 Darstellung (Bildsatz) | alle 7 | bildsatz, 390 / 768 / 1 440 px, hell und dunkel, JPEG Q70 | 298 Bilder; mobil 4,60 MB · tablet 5,68 MB · desktop 6,59 MB; gesamt **16,86 MB** | Ziel < 12 MB | `_werkstatt/bilder/E3/index.json` · **Größenziel verfehlt** (Befund 1). Sichtprüfung in Stufe C |

## 2. Befunde (Datei · Selektor)

1. **Bildsatz zu groß:** 16,86 MB gegen Ziel < 12 MB. Der Umfang folgt aus der Seitenhöhe: je Pfad, Gerät und Schema ein Bild pro Bildschirmhöhe (Summe 298). Datei `_werkstatt/bilder/E3/index.json`.
2. **Bildsatz kürzt eine Seite:** `/einsatzgebiet/hessen/limburg-weilburg/`, mobil, hell und dunkel: 12 von 13 Ausschnitten (Seitenhöhe 10 536 px). Die Obergrenze steht in `_werkstatt/werkzeuge/bildsatz.mjs:7` (`MAX_AUSSCHNITTE = 12`). Die Seite ist in der Bildmenge nicht vollständig.
3. **vnu: 43 Warnungen, 0 Fehler.** 20 Meldungen „Inline script violates CSP (meta tag)“ betreffen `<script type="application/ld+json">`, z. B. `.cache/e3/dist/einbruchschutz/index.html` Zeile 28. 23 Meldungen betreffen externe Dateien unter `/assets/` (CSS und JS) gegen `style-src`/`script-src` der Meta-CSP. vnu hat die Dateien auf dem Datenträger geprüft, nicht über den Vorschau-Server. Quelle `.cache/e3/vnu.json`.
4. **Messbuild-Basis:** Ohne `--port` trägt der Messbuild `http://127.0.0.1:4173` als Basis ein (JSON-LD, z. B. `.cache/e3/dist/einbruchschutz/index.html` Zeile 28). Standard in `bau/bauen.mjs:83`. Die Vorschau lief auf 4201. smoke meldete dennoch 0 fremde Anfragen.
5. **SEO-Titel:** 72 Warnungen `seo/titel-laenge` (Titel über 60 Zeichen). Betroffen sind Ortsseiten unter `/schluesseldienst-…/`, z. B. `.cache/e3/dist/schluesseldienst-altdorf-suedliche-weinstrasse/index.html` mit 65 Zeichen. Liste in `.cache/e3/dist.pruefbefunde.json` (seo).
6. **Eingehende Links:** `links/eingehend` < 3 bei `/ratgeber/schliesszylinder-wechseln/` und `/einsatzgebiet/schleswig-holstein/pinneberg/` (je 2). Liste in `.cache/e3/dist.pruefbefunde.json` (links).
7. **E2-Befund 1 (axe `link-name`, `.kopf-suche`) ist im aktuellen Stand nicht mehr vorhanden.** `src/vorlagen/teile/kopf.mjs:32` nutzt `<span class="unsichtbar">Suche</span>`. Die `display:none`-Regel in `src/assets/css/layout.css` ist entfernt. Stand im Commit 7422b0f. axe meldet 0 serious/critical.
8. **Reduzierte Bewegung, Szene M-17:** Die Figur `.szene-figur svg` ist unter reduce 0×0, weil `.szene-buehne` in `src/assets/css/ansichten/gruppe/szene.css` ausgeblendet ist. Die Inhalte stehen in den fünf `.szene-einzelbild`, die gemessen alle sichtbar sind. Die CSS-Kommentare beschreiben diese Ansicht als beabsichtigt. Kein Befund, nur Einordnung.
9. **Zählung im Ruhezustand ohne Aussage:** `getAnimations()` nach 200 ms ist auf `/einbruchschutz/` auch ohne reduce 0 (E2 Startseite: 28). Die Szene wechselt ihren Zustand nur beim Scrollen (`src/assets/js/module/szene.mjs`, IntersectionObserver). Deshalb wurde die Zählung beim Scrollen ergänzt (Schritt 9 angepasst).
10. **Scherlinie nicht vorhanden:** `.zy-scherlinie` gibt es auf `/einbruchschutz/` nicht (Anzahl 0). Der Linienteil aus Schritt 9 entfällt für diese Seite.
11. **Fremde Änderungen während des Laufs:** Der Messbuild um 14:33 UTC enthielt die damals vorhandenen untracked Dateien anderer Pakete (u. a. `src/assets/js/logik/preise.mjs`, `src/inhalte/ratgeber/*.mjs`). Während des Laufs kamen geänderte Dateien in `src/` hinzu (u. a. `M src/konfig/betrieb.mjs`, `M src/konfig/preise.mjs`, `M src/assets/js/app.mjs`) und es wurde committet (HEAD 3476272, 14:44 UTC). Die Messungen laufen gegen den unveränderten Build `.cache/e3/dist`, nicht gegen den aktuellen Arbeitsbaum. Ich habe nichts davon geändert.
12. **Mess-Sperre:** Alle Browser-Werkzeuge (inkl. inp, bildrate, lighthouse) und meine Hilfsskripte setzen `.cache/mess.lock` über `mitMessSperre`. Sämtliche Läufe liefen nacheinander. Die E2-Offene-Frage 5 zur README ist damit erledigt.

## 3. Nicht geprüft

- Z-02 Stufe C: Funktionsliste F01–F20, `--release`-Negativtest mit Platzhaltern, Konsolen- und CSP-Prüfung über alle Seiten.
- Z-03 Token-Linter-Protokoll (nur Teilbeleg oben).
- Z-04 Gestaltung (Endprüfung, Blindvergleich).
- Z-05 Register K-007 (jede Animation). Lage- und Größenkonstanz nur für die Szene auf `/einbruchschutz/`. Großer Moment M-16 ist nicht Teil dieser Stufe.
- Z-06 Grafik (Icon-Familie, Geometrie-Linter, doppelte IDs).
- Z-07 Tastaturprotokoll H1–H5, sichtbarer Fokus, Kontraste nach K-005. axe nur automatisiert.
- Z-08 Bewegungscode separat (≤ 60 KB gz). Lighthouse nur mobil. Folgemessungen gegen die Baseline.
- Z-09 Sichtprüfung der Bildsätze (Text-Überlappung, Abschneiden), Stichprobe 10 % mit 20 Ortsseiten, Bilder bei 768, 320 und 1920 px. Die Zahlen aus `ueberlauf` decken 320 und 1920 ab, Bilder dazu fehlen.
- U-6 Platzhalter und ungeprüfte Fakten (42 Platzhalter in der Ausgabe, 33 ungeprüfte Fakten im Build) nicht bewertet.
- Firefox, Safari (U-2) und echte Geräte (U-1).

## 4. Ausführungsnotizen

- Alle Browser-Läufe nacheinander, nie parallel. Lighthouse in einem Aufruf: 21 Läufe (7 Pfade × 3), Exit 0.
- Schritt 9: `bild.mjs --bewegung reduce` nimmt den Kopfbereich bei Scroll 0 auf, die Szene liegt nicht darin. Die Zählungen laufen über eigene Skripte in `.cache/e3/bewegung-einbruchschutz.mjs`, `bewegung-einbruchschutz-scroll2.mjs` und `bewegung-einzelbild.mjs`. Die erste Scroll-Fassung (`bewegung-einbruchschutz-scroll.mjs`, Ausgabe `bewegung-einbruchschutz-scroll.json`) war fehlerhaft: Der Selektor traf den Rufknopf, und die Scrollbereiche waren verschieden. Sie ist verworfen und durch `scroll2` ersetzt.
- Aktionsdatei `e3-hub.json`: Nach dem Klick auf „W“ folgt `Tab`, also der Fokus auf den ersten Ort („Waldbrunn“) ohne Navigation, wie im Paket beschrieben.
- Aktionsdatei `e3-einsatzgebiet.json`: `ArrowDown` erzeugt keine Event-Timing-Meldung unter 16 ms. Das Werkzeug weist das aus.
- Schreibrechte eingehalten: neu nur `_werkstatt/bilder/E3/**` (298 Bilder, `index.json`, `bewegung/`), `_werkstatt/werkzeuge/aktionen/e3-einsatzgebiet.json`, `e3-hub.json` und dieser Bericht. Nichts committet, kein Schreibzugriff auf `src/`.

## 5. Offene Fragen

1. Bildsatz: Soll die Obergrenze von 12 Ausschnitten (Befund 2) angehoben oder das Größenziel von 12 MB angepasst werden? Entscheidung Orchestrator.
2. vnu: Soll die Prüfung künftig gegen den laufenden Vorschau-Server statt gegen Dateien laufen (Befund 3)?
3. Messbuild-Basis: Soll der Paketbefehl `--port 4201` erhalten, damit kanonische URLs zur Vorschau passen (Befund 4)?
4. Bewegungscode: Die Größe ist nicht ausgewiesen (E2-Offene-Frage 2 bleibt offen).
5. Schritt 9 bei V02–V07: Die Scherlinie ist auf diesen Seiten nicht vorhanden. Soll der Schritt künftig die Szene oder die Linie prüfen?

## 6. Gemeinsame Dateien (gewünschte Änderungen, nicht umgesetzt)

- `_werkstatt/werkzeuge/bildsatz.mjs` Zeile 7: `MAX_AUSSCHNITTE` oder Ausschnitt-Zählung für lange Seiten (Befund 2).
- Paketblatt `_werkstatt/pakete/E3-PRUEF-11.md`, Schritt 1 und Schritt 2: `--port 4201` im Messbuild (Befund 4), falls gewünscht.

## Nachtrag Opus (Orchestrator)
- Bildsatz gekürzt auf 190 Bilder, 11,4 MB (Ziel < 12 MB): Hell Desktop und Mobil vollständig, Tablet und Dunkel nur Ausschnitte 1–3 (`index.json`, Feld `gekuerzt`). Befund 1 damit erledigt.
- Messbuild-Port: Künftige Pakete bauen mit `--port`, wenn kanonische URLs geprüft werden; für diese Messungen ohne Einfluss.
