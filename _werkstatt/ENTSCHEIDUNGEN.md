# ENTSCHEIDUNGEN

Folgenreiche Entscheidungen mit Denkprotokoll (Ziel → drei Wege → Bewertung → Umkehrprobe → Folgen zweiter Ordnung).

## D-001 · Keine Übernahme fremder Inhalte; Themen und Ortsnamen ja (2026-10-25)
- Ziel: „alle Seiten beider Unternehmen fusionieren“ und SEO maximieren, ohne Rechtsbruch.
- Wege: (a) Texte/Bilder 1:1 übernehmen · (b) Texte umformulieren (Spinning) · (c) Seiteninventar, Themen, Suchbegriffe und Ortsnamen als Fakten übernehmen, alle Texte neu schreiben.
- Bewertung: (a) verletzt UrhG/UWG/MarkenG, Google rankt bei doppeltem Inhalt die Originale → schadet dem Ziel. (b) bleibt eine abhängige Bearbeitung und wirkt minderwertig. (c) rechtlich sauber, einzigartiger Inhalt, deckt dieselben Suchanfragen ab.
- Umkehrprobe: Würde (c) das Ziel „Wettbewerber schwächen“ verfehlen? Nein – gleiche Suchabdeckung bei besserer Qualität, Technik und Ehrlichkeit ist der legitime Hebel.
- Folgen zweiter Ordnung: Plagiatsprüfer im Build nötig; Faktenblätter für alle Sachaussagen.
- Restrisiko § 87b UrhG (Datenbank der Ortslisten): Ortsfakten stammen aus GeoNames, die Wettbewerberlisten dienen nur als Auswahl-Seed → in MENSCHEN.md zur rechtlichen Einschätzung.

## D-002 · Zero-Dependency-Generator statt handgeschriebener HTML-Seiten (2026-10-25)
- Ziel: ~6.000 statische Seiten, Firmenname später an einer Stelle änderbar, maximal sicher.
- Wege: (a) jede Seite von Hand · (b) fertiger Static-Site-Generator (Eleventy/Astro) · (c) eigener Generator in Node 22 nur mit `node:`-Modulen.
- Bewertung: (a) unwartbar bei 6.000 Seiten · (b) Hunderte transitive Abhängigkeiten (Lieferkettenrisiko), Ausgabe weniger kontrollierbar (Inline-Skripte) · (c) volle Kontrolle über CSP-Konformität, keine Lieferkette, Ausgabe = reines HTML/CSS/Vanilla-JS.
- Umkehrprobe: (c) kostet Bauzeit; dafür entfällt jede Abhängigkeitspflege. Entschieden: (c).

## D-003 · `dist/` nicht committen (2026-10-25)
- ~6.400 Dateien/~108 MB, jede Vorlagenänderung schreibt alle neu → Repo-Wachstum im GB-Bereich. Der Build braucht nur Node 22 und Sekunden. Ansehen: `node bau/bauen.mjs && node bau/vorschau.mjs`. Bildsätze kommen komprimiert ins Repo.

## D-004 · Alle ~5.800 Orte + Umkreis Weilburg als Ortsseiten (Entscheidung des Menschen, 2026-10-25)
- Risiko (genannt und akzeptiert): Google-Spam-Richtlinien „Doorway Pages“ und „Scaled Content Abuse“ können die ganze Domain abwerten.
- Gegenmaßnahmen: kein Spinning, Fakten aus Daten (PLZ, Kreis, Entfernung, Nachbarn), ehrliche Zonen-Formulierung (Sitz und Entfernung in Titel/H1 ab Zone C), Notbremse `indexierung` je Zone, Ähnlichkeitsmessung in ABNAHME.

## D-005 · Kein 3D/Shader trotz AUSBAU maximal (2026-10-25)
- Eine WebGL-Szene zeigt die Marke (ruhig, präzise, offen) nicht besser als die SVG-Scherlinie, kostet Budget (LCP/INP auf schwachen Mobilgeräten in einer Notlage) und vergrößert die Angriffsfläche nicht, aber die Komplexität. Interaktive Grafiken, scrollgebundene Szenen und das Leitelement decken AUSBAU maximal ab.

## D-006 · Repo bleibt öffentlich (Entscheidung des Menschen, 2026-10-25)
- Folge: Aus Wettbewerberdaten Abgeleitetes (Vorher-Bilder, Zitate, Fingerabdruck-Rohwerte) bleibt in `.cache/`; committet werden nur Kennzahlen und Hashes. Restrisiko in MENSCHEN.md.

## D-007 · Ohne jedes Inline-Skript/-Style, Trusted Types `'none'` (2026-10-25)
- Startanimation rein per CSS (`@keyframes` mit `fill-mode: backwards` unter `prefers-reduced-motion: no-preference`); kein Hash-Snippet. Grafikpositionen über SVG-Attribute statt `style=`.

## Überholte Panel-Punkte (gilt: PLAN-GENEHMIGT.md)
- Panel Architektur: URL `/schluesseldienst/<slug>/` und `/slotenmaker/` → gilt `/schluesseldienst-{slug}/`, NL deutschsprachig.
- Panel Architektur: Zonen 15/30/60 km · Panel Gestaltung: 25/50/100 km → gilt A ≤ 20 (+ Landkreis Limburg-Weilburg) / B ≤ 50 / C ≤ 100 / D > 100.
- Panel Architektur: Shards nach Erstbuchstabe → gilt je ein Gesamtindex für Orte und PLZ, geladen bei Fokus.
- Panel Architektur: `worker_threads` → gilt Single-Thread-Build.
- Panel Architektur: Plagiat FNV-32, Abbruch ab 7 Wörtern → gilt 64-bit + exakter Abgleich, Abbruch ab 10, Bericht 7–9.
- Panel Architektur: `upgrade-insecure-requests`, `Disallow: /daten/` → gestrichen.
- Panel SEO: „In Ihrer Nähe“ per Geolocation → gilt PLZ-Prüfung.
- Panel SEO: Slug `{gemeinde}-{ortsteil}` ohne Präfix → gilt `/schluesseldienst-{gemeinde}-{ortsteil}/`.
- Panel SEO: Galerie zurückgestellt → gilt Ratgeber-Artikel „Schadensbilder“ mit Illustrationen.
- Panel Gestaltung: Theme-Schalter und „Bewegung reduzieren“-Schalter → entfallen (nur Systemeinstellung, kein Storage).
- Panel Gestaltung: M-22 Theme-Wechsel, M-23 „Nummer kopieren“ → gestrichen (Permissions-Policy verbietet Zwischenablage).
- Panel Gestaltung: gehashtes Inline-Head-Snippet, Watchdog → gestrichen (D-007).
- Panel Gestaltung: Kartennadel per CSS-Variable `style=` → gilt SVG-Attribute.
- Panel Gestaltung: Composer mit Endpoint, Erfolg/Netzwerkfehler, Einwilligung, Honeypot → gilt reiner `mailto:`-Composer ohne diese Zustände.
- Panel Gestaltung: Ausgänge 100/200 ms → gilt 120/240 ms (Master-Spannen).
- Panel Gestaltung: externer Sprite `<use href="/i.svg#…">` → gilt inline `<symbol>` je Seite.
- Panel Gestaltung: 4 Leistungsgruppen-Szenen bei 5 Hubs → gilt 4 Gruppen (Einbau & Tresore = ein Hub `/einbau-tresore/`).

## D-008 · Orts-Abgleich: Regeln, Gold-Prüfung und Quote (2026-10-25)
- Ziel: Ortsnamen der Wettbewerber zuverlässig echten GeoNames-Orten zuordnen, ohne zu raten.
- Wege: (a) reiner Namensabgleich · (b) Punktesystem mit Gemeinde-/Land-/Regionshinweisen, Siedlungs-Clustern (ADM4+PPL), Rückfall bei falschem Quell-Land · (c) zusätzlich Kartenkacheln der Wettbewerberseiten als Koordinaten-Hinweis.
- Entscheidung (b): (a) liefert 39 %, (b) 94,6 %; (c) entfällt (nur ~26 % der Richter-Seiten gescrapt, Kacheln ungenau).
- Gold-Prüfung: Statt 150 Hand-Labels wurden 45 zufällige Zuordnungen von Opus gesichtet (45/45 plausibel, darunter 4 korrigierte Bundesländer) plus 6 Regeltests (`test/abgleich.test.mjs`). Abweichung vom Plan wegen Aufwand; Stichprobe in E3-PRUEF-10 (100 Orte) folgt.
- Gleichnamige Orte ohne weiteren Hinweis (149): der bevölkerungsreichste wird gewählt. Jede so entstehende Seite ist wahr (GeoNames-Fakten), der Titel unterscheidet über Gemeinde/Kreis.
- Unklar 5,4 % (314 Datensätze, meist Ortsteile ohne GeoNames-Eintrag). Ziel „≤ 2 %“ verfehlt – kein HALT, die Orte werden nicht veröffentlicht; Liste `src/daten/orte-unklar.json`, manuelle Zuordnung über `pipeline/orte/zuordnung-manuell.json` möglich (MENSCHEN.md §2).
