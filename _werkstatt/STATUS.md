STATUS · Branch claude/bold-noether-fk2n4f · Etappe 4/6 · Welle E4-W3 · Pflicht 56/67 · Kür 0/8 · Kriterien 0/10 · Ausnahmen 0 · Bestand grün (238 Tests, 11 Prüfer grün, 5.544 Seiten) · Nächster Schritt: E4-BAU-18…21 einarbeiten; E4-OPUS-05 Lahnbogen/M-20; Suche und 404 (M-21)

# STATUS

## Einstellungen (Standardwerte als Annahmen, Abweichungen durch Antworten des Menschen)
- VORHABEN (geschärft, eigene Worte):
  1. Aus den Exporten zweier Wettbewerber entsteht eine eigene, rein statische Website (HTML/CSS/Vanilla-JS) für einen neuen Schlüsseldienst mit Sitz in Weilburg, die jedes Thema und jede Seitenart beider Vorbilder abdeckt – zusammengelegt, neu geschrieben, ohne Kopien.
  2. Die Seite ist so sicher, wie eine statische Seite sein kann (strikte CSP mit Trusted Types, keine Drittanbieter, kein Backend), und für Suchmaschinen maximal sauber gebaut (eindeutige Titel, strukturierte Daten, Linkgraph, ~6.000 ehrliche Ortsseiten).
  3. Gestaltung, Bewegung und SVG-Grafik heben sich sichtbar von beiden Wettbewerbern ab („Scherlinie“), schnell und zugänglich nach WCAG 2.2 AA.
- SCHWERPUNKT: alles (Standard) · BEREICH: ganzes Projekt · AUSBAU: maximal (ohne 3D/Shader, Begründung in ENTSCHEIDUNGEN)
- MARKE UND ZIELGRUPPE: abgeleitet, ANNAHME – neuer Schlüsseldienst (Name offen) in Weilburg/Lahn; Menschen in einer Notlage (ausgesperrt, oft mobil, nachts) und Eigentümer/Betriebe, die Einbruchschutz, Sicherheitstechnik, Einbau oder Tresore planen.
- GESCHMACK: keine · UNANTASTBAR: Standard (es gibt noch keinen Bestand an Logo/Rechtstexten/Logik)
- TEXTE: Es gibt keine eigenen Bestandstexte; alle Texte sind neu und werden direkt in `src/inhalte` geschrieben, als Entwurf zur menschlichen Prüfung (MENSCHEN.md). TEXTVORSCHLAEGE.md sammelt Alternativen.
- FREIGABE: nein (Plan wurde in der Planungsphase vom Menschen genehmigt) · LAUFZEIT: bis Pflicht und Kür erfüllt
- HAIKU-PLÄTZE: 4 · ARBEITSBRANCH: claude/bold-noether-fk2n4f · PUSH: nur dieser Branch · VERÖFFENTLICHUNG: nie
- GERÄTEGRÖSSEN: 390×844 · 768×1024 · 1440×900 · BUDGETS: LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms, Bewegungscode ≤ 60 KB gz
- Repo ist öffentlich (Entscheidung des Menschen: „Öffentlich lassen“).

## Werkzeug-Einrichtung
- Prüfwerkzeuge: `_werkstatt/werkzeuge/` (Skripte), Module in `/home/user/werkzeuge-cache` (außerhalb des Repos). Nach Neustart: `mkdir -p /home/user/werkzeuge-cache && cp _werkstatt/werkzeuge/{package.json,package-lock.json,.npmrc} /home/user/werkzeuge-cache/ && cd /home/user/werkzeuge-cache && npm ci --ignore-scripts && npm audit signatures`.
- Chromium 153 (Playwright 1.63, `/opt/pw-browsers/chromium-1243`), Java 21 für vnu.
- Orts-Daten: `node pipeline/orte/alle.mjs` (GeoNames-Cache in `.cache/geonames`, bei Neustart `NODE_USE_ENV_PROXY=1 node pipeline/orte/00-laden.mjs --neu-einlesen`).
- Build/Vorschau: `node bau/bauen.mjs [--messen|--release --ziel=…] [--pruefen]`, `node bau/vorschau.mjs` (Port 4173).

## Verlauf (eine Zeile je Stunde/Meilenstein)
- 2026-10-25 13:05 MEZ · E0 gestartet · _werkstatt angelegt, Auftrag wörtlich gesichert, Planberichte gesichert
- 2026-10-25 14:00 MEZ · E0/E1 abgeschlossen (Werkzeuge, Themenmatrizen, KERN v1, PLAN v2, ABNAHME) · E2: Generator, Prüfer (12 Module), Orts-Pipeline (5.252 Orte), Referenz V01 gebaut · 95 Tests grün
- 2026-10-25 14:15 MEZ · E0-PRUEF-03 Vorher-Baseline fertig (Wettbewerber Perf 55–74, LCP 4,7–8,7 s) · E2-PRUEF-08 Prüfstufe B V01: Perf 98, LCP 2,1 s, CLS 0, INP 48 ms, Bildrate 2 %, 0 Überlauf; A11y-Befund (Suchlink) behoben → axe 0, Lighthouse A11y 100 · E2-OPUS-07 Register: Routen, Themenpässe (66 Seiten + 3 Muster), 33 Faktenblätter, Quellenabdeckung 48 R + 18 A · Links-Prüfer unterscheidet geplant/unbekannt · 104 Tests grün
- 2026-10-25 14:45 MEZ · E2-REVIEW Anlauf 1: 6,8 (nicht bestanden) → alle 10 Befunde eingearbeitet, Anlauf 2 läuft · E3-W1: Icons 56/56 nach Vertrag + Geometrie-Linter (GRAF-01…04), Unit-Tests Ortsindex/Redirect (PRUEF-09) fanden Lücke „//“ in SICHERER_PFAD → behoben · Szenen-Engine M-17 + I-03/04/05 + V02-Vorlage mit /notoeffnung/ · laufend: E3-BAU-01…03, E4-KUND-03
- 2026-10-25 15:20 MEZ · E3 W2 fertig: 22/22 Detailseiten (BAU-04…11), Kopffiguren Fenster/Türschließer/Video/Nebel/Datenschrank (Opus) · V06 Hubs (BAU-12): 15 Länder + 228 Kreise, Titel ohne falschen Dativ, Kreise nach Namenskern, Sitz markiert · Ortsseiten jetzt gebaut (5.252), Titel > 60 von 588 auf 72 (Kurzname) · V08-Vorlagen + Musterartikel (E4-OPUS-04) · laufend: E4-KUND-04/05, E4-BAU-13/14
- 2026-10-25 16:00 MEZ · E3 abgeschlossen: Prüfstufe B (7 Pfade) Perf 99–100, A11y/BP/SEO 100, LCP ≤ 1,96 s, INP ≤ 48 ms, axe 0; Linkgraph ohne Waisen, Klicktiefe 3; Ortsstichprobe 100/100 · E4: V04 Preise (Tagesband, Rechner), V10 Kontakt (Composer), CSS je Ansicht (D-CSS-01), 16/19 Ratgeber, 21 Faktenblätter Recht/Statistik · Prüfer-Fehlalarme behoben (Nr. 1 in Fundstellen, S20 Rückweichen) · laufend: E4-BAU-18/19/20/21
