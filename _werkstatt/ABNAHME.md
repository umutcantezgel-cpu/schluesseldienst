# ABNAHME · Definition of Done (Version 1, 2026-10-25)
Kriterium · Methode · Schwelle · Beleg · Status. Erledigt ist nur, was geprüft ist; Kriterien sinken nie still.

| Kriterium | Methode | Schwelle | Beleg | Status |
|---|---|---|---|---|
| Z-01 Plan | Abgleich mit PLAN.md | 100 % der Pflichtpakete erledigt und abgenommen; Kür bis leer | PLAN.md mit Commit-Kennungen | offen |
| Z-02 Bestand | Prüfstufe C | `node --test` grün; `node bau/bauen.mjs --messen --pruefen` grün; `--release` scheitert mit Platzhaltern (Negativtest); Funktionsliste F01–F20 durchlaufen; 0 Konsolen-/CSP-Fehler, 0 externe Requests | `_werkstatt/berichte/E5-pruefstufe-c.md` | offen |
| Z-03 Designsystem | Token-Linter + Stichprobe | 0 Werte außerhalb der Tokens in `src/assets/css/**` und Vorlagen; jede Komponente nutzt Tokens | Token-Linter-Protokoll | offen |
| Z-04 Gestaltung | Endprüfung (frischer Opus) | jede Hauptansicht Ansichtswert ≥ 8, keine Kategorie < 7; Blindvergleich gegen Wettbewerber-Pendants (maskiert, zufällige Reihenfolge, Schlüssel getrennt) für V01/V03/V04/V07: neuer Stand vorgezogen | Bildsätze, `E5-endpruefung.md` | AUSNAHME A-2 |
| Z-05 Bewegung | Register + Prüfstufe C | jede Animation im Register K-007; bei reduzierter Bewegung keine Lage-/Größenänderung, alle Inhalte sichtbar; große Momente mobil, 4× Drosselung: ≤ 5 % verworfene Bilder (Ersatzmessung) | `bildrate`-Protokolle | offen |
| Z-06 Grafik | Prüfstufe C | eine Icon-Familie (Geometrie-Linter), alle SVG optimiert und zugänglich, keine doppelten IDs je Ansicht | Prüfliste | offen |
| Z-07 Zugänglichkeit | Prüfstufe C | axe: 0 ernste/kritische Befunde auf allen Hauptansichten (hell + dunkel); Hauptaufgaben H1–H5 nur mit Tastatur lösbar, Fokus sichtbar; Kontraste nach K-005 | axe-Bericht, Tastaturprotokoll | offen |
| Z-08 Leistung | Prüfstufe C (Messbuild) | LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms, Bewegungscode ≤ 60 KB gz; keine Hauptansicht schlechter als die erste eigene Messung (E2) um mehr als deren Spanne aus 3 Läufen | Lighthouse-/INP-Protokolle | offen |
| Z-09 Darstellung | Prüfstufe C | Hauptansichten + Stichprobe (10 %, ≥ 5 übrige Ansichten inkl. 20 Ortsseiten) in 390×844, 768×1024, 1440×900, hell + dunkel, dazu 320/1920 px, 200 % Zoom, forced-colors: 0 Überlauf, kein abgeschnittener/überlappender Text | Bildsatz + `ueberlauf`-Protokoll | offen |
| Z-10 Übergabe | Endprüfung | BERICHT.md, KERN.md, MENSCHEN.md, README, `docs/`, Anleitung Zusammenführen/Zurückrollen vollständig | Dateien | offen |

## Ausgangswerte
- Eigene Website existiert in E0 nicht. Die erste eigene Messung (E2-PRUEF-08, Referenz V01, Messbuild) ist die Baseline für Z-08.
- Wettbewerber-Kennzahlen (nur informativ): `_werkstatt/berichte/E0-vorher-kennzahlen.md`.

## UMGEBUNGSAUSNAHMEN (zählen nicht als AUSNAHME; Ersatzprüfung + Eintrag in MENSCHEN.md §6)
| ID | Was | Warum nicht messbar | Ersatzprüfung |
|---|---|---|---|
| U-1 | Echte Zielgeräte (iOS/Android) | keine Geräte in der Cloud | Chromium-Emulation 390×844, `pointer: coarse` |
| U-2 | Firefox, Safari/WebKit | nur Chromium installiert | Funktionen mit Rückfall gebaut (View Transitions, `animation-timeline`, `light-dark()`); Chromium-Prüfung + Code-Durchsicht |
| U-3 | Bildrate mit GPU | headless ohne GPU | `bildrate.mjs` mit CDP-Drosselung 4× |
| U-4 | Live-Header beim Hoster | kein Deploy (G3) | Header im Vorschau-Server identisch zu `_headers`/`.htaccess`/nginx; `live-check.mjs` für den Menschen |
| U-5 | Wirkung in Google (Indexierung, Spam-Bewertung) | keine Veröffentlichung | Ähnlichkeitsmessung, Linkgraph, ehrliche Zonen-Texte |
| U-6 | Konfigurationslücken (Name, Telefon, Preise, Rechtsdaten) und ungeprüfte Fakten | nur der Mensch kennt sie | sichtbare Platzhalter/VERIFIZIEREN in Vorschau; Release-Sperre als Negativtest geprüft |

## AUSNAHMEN (höchstens 2, keine für Z-02)
- **A-1 · Z-08, V01 gegenüber E2: LCP +150 bis +300 ms (zweigipflig), Perf −1** (Prüfstufe C, 2026-10-25; Zahlen in der Abschluss-Nachprüfung 2026-10-26 berichtigt). Unter gleichen Bedingungen gemessen (E2-Commit `7422b0f` und aktueller Stand nacheinander, gleicher Vorschau-Server, Lighthouse mobil, 3 Läufe): E2 Perf 98 · LCP 2.108 ms · FCP 1.658 ms; jetzt Perf 97 · LCP 2.257–2.410 ms (zweigipflig) · FCP 1.810 ms. Mit gzip wie beim Hoster: E2 100 · 1.511 ms, jetzt 100 · 1.657 ms. Ursache belegt: Ohne die Druck- und Kontraststile (eigene Dateien mit `media="print"` bzw. `forced-colors`, nicht renderblockierend) liegt V01 bei Perf 98 · LCP 2.113 ms, also beim E2-Wert; Lighthouse rechnet die beiden Dateien in den simulierten LCP-Pfad ein. Sie per Skript nachzuladen, würde Druck und Kontrastdesign von JavaScript abhängig machen – deshalb bewusst nicht. Absolute Grenzen erfüllt (LCP ≤ 2.500 ms, Perf ≥ 95, CLS ≤ 0,1). Abschluss-Nachprüfung auf dem Endstand (Messbuild, 3 Läufe): Median LCP 2.404 ms (Einzelläufe 2.253 · 2.408 · 2.404 ms), Perf 97, CLS 0,014 – gegenüber E2 (2.104 ms) +150 ms am unteren und +300 ms am oberen Gipfel; die frühere Angabe „+150 ms“ nannte nur den unteren Gipfel. Mit gzip: Perf 99 · LCP 1.666 ms. Belege: `_werkstatt/berichte/E5-abschluss-pruefung.md`. Behoben auf dem Weg dorthin: JS je Seite (D-JS-01, V01 wieder 16,6 KB wie in E2 statt 42 KB), Ansichts-Stile je Seite in einer Datei, Ersatzschrift je Stärke abgestimmt.
- **A-2 · Z-04, Ansichtswert ≥ 8 nach zwei Anläufen nicht erreicht** (Endprüfung, 2026-10-26). Anlauf 1 (frische Opus-Prüfer, mildere Skala): 6,50–7,67. Dazwischen gemeinsame Befunde (D-E5-01) und sechs Ansichtspakete mit unabhängiger Gegenprüfung. Anlauf 2 (frische Opus-Prüfer, Rubrik wörtlich nach AUFTRAG Abschnitt 9): 6,33–7,50, sieben Ansichten mit einer Kategorie unter 7. Der Blindvergleich ist in beiden Anläufen erfüllt: 24 von 24 Paaren ziehen den neuen Stand vor (Anlauf 2: 11 „sehr klar“, 1 „klar“). Beste Ersatzlösung: Blindvergleich als Nachweis der Überlegenheit gegenüber den Vorbildern; alle Messwerte im Budget (axe 0, Überlauf 0, Lighthouse, INP, Fokus nie verdeckt); die Befunde aus Anlauf 2 werden als zweite Paketrunde je Ansicht und Kategorie umgesetzt, soweit erlaubt, die übrigen stehen als offene Punkte in PLAN.md und `docs/OFFENE-PUNKTE.md`. Denkprotokoll D-E5-02. Beleg: `_werkstatt/berichte/E5-endpruefung.md`.
