# ABNAHME · Definition of Done (Version 1, 2026-10-25)
Kriterium · Methode · Schwelle · Beleg · Status. Erledigt ist nur, was geprüft ist; Kriterien sinken nie still.

| Kriterium | Methode | Schwelle | Beleg | Status |
|---|---|---|---|---|
| Z-01 Plan | Abgleich mit PLAN.md | 100 % der Pflichtpakete erledigt und abgenommen; Kür bis leer | PLAN.md mit Commit-Kennungen | offen |
| Z-02 Bestand | Prüfstufe C | `node --test` grün; `node bau/bauen.mjs --messen --pruefen` grün; `--release` scheitert mit Platzhaltern (Negativtest); Funktionsliste F01–F20 durchlaufen; 0 Konsolen-/CSP-Fehler, 0 externe Requests | `_werkstatt/berichte/E5-pruefstufe-c.md` | offen |
| Z-03 Designsystem | Token-Linter + Stichprobe | 0 Werte außerhalb der Tokens in `src/assets/css/**` und Vorlagen; jede Komponente nutzt Tokens | Token-Linter-Protokoll | offen |
| Z-04 Gestaltung | Endprüfung (frischer Opus) | jede Hauptansicht Ansichtswert ≥ 8, keine Kategorie < 7; Blindvergleich gegen Wettbewerber-Pendants (maskiert, zufällige Reihenfolge, Schlüssel getrennt) für V01/V03/V04/V07: neuer Stand vorgezogen | Bildsätze, `E5-endpruefung.md` | offen |
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
- (keine)
