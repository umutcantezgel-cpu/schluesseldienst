STATUS · Branch claude/bold-noether-fk2n4f · Etappe 2/6 · Welle E2 · Pflicht 14/67 · Kür 0/8 · Kriterien 0/10 · Ausnahmen 0 · Bestand grün (95/95 Tests, Prüfer grün außer Links zu noch fehlenden Seiten) · Nächster Schritt: Etappentor E2 (Prüfstufe B + Sichtabnahme V01)

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
