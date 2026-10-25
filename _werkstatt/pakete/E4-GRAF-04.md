# E4-GRAF-04 · Rolle Grafiker · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): _werkstatt/werkzeuge/og.mjs (neu), _werkstatt/werkzeuge/og/** (neu, Vorlagen des Werkzeugs), src/assets/og/*.png (neu; `standard.png` darf überschrieben werden)
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E4-GRAF-04/**
Umfang: Werkzeug + 12 OG-Bilder (1200 × 630 PNG)

## Rollenbriefing Grafiker
Du gestaltest nach dem Designsystem „Scherlinie“ (`_werkstatt/KERN.md`, K-001…K-012) und erfindest keine neue Bildsprache. Häufige Fehler: fremde Schriften oder Bilder; Firmenname oder Telefonnummer erfinden; Text zu klein für die Vorschau in Messengern; Dateien zu groß.

## Aufgabe in einem Satz
Schreibe ein Werkzeug, das aus einer kleinen HTML-Vorlage mit den lokalen Schriften und den Farbtokens die OG-Vorschaubilder je Seitentyp und Zone als PNG rendert, und erzeuge damit zwölf Bilder.

## Bilder (Dateiname → Inhalt)
- `standard.png` (Startseite und Rest): „Schlüsseldienst in Weilburg an der Lahn“
- `leistungen.png` · `notoeffnung.png` · `einbruchschutz.png` · `sicherheitstechnik.png` · `einbau-tresore.png`: Gruppentitel bzw. „Leistungen“, darunter „Schlüsseldienst · Weilburg“
- `preise.png`: „Preise, die am Ende stimmen“ · `ratgeber.png`: „Ratgeber: Schloss, Schlüssel, Einbruchschutz“ · `einsatzgebiet.png`: „Einsatzgebiet ab Weilburg“
- `ort-nah.png` (Zone A/B): „Schlüsseldienst für Ihren Ort – aus Weilburg“ · `ort-fern.png` (Zone C/D/NL): „Planbare Arbeiten nach Absprache – aus Weilburg“
## Gestaltung (verbindlich)
- Fläche Papier `#F4F2ED`, Text Tinte `#13202A`, Akzent Lahn `#1C5A4F`; die Scherlinie als waagerechte Kupferlinie `#A84A22`, 6 px, über die ganze Breite auf Höhe der Grundlinie der Überschrift; links oben das Signet als einfache Form (Zylinderkreis + Schlüsselbart wie `src/vorlagen/teile/signet.mjs`, nachgebaut als SVG in der Vorlage).
- Schrift Atkinson Hyperlegible Next aus `src/assets/schriften/atkinson-next-latin-wght.woff2` (per `@font-face` mit file-URL), Titel ≥ 64 px fett, Unterzeile ≥ 32 px; Ränder ≥ 72 px; höchstens zwei Zeilen Titel.
- KEIN Firmenname, keine Telefonnummer, keine Preise, keine Personen, keine Fotos, keine Marken. Kein Text außer den oben genannten.
## Werkzeug
- `node _werkstatt/werkzeuge/og.mjs [--nur <name>] [--aus src/assets/og]`: Playwright aus `/home/user/werkzeuge-cache` (wie `lib.mjs`), Viewport 1200 × 630, `deviceScaleFactor: 1`, PNG. Danach je Datei Größe ausgeben; Ziel ≤ 60 KB je Bild (sonst Farbfläche vereinfachen).
- Vorlage(n) unter `_werkstatt/werkzeuge/og/` (HTML/CSS), Texte als Liste im Werkzeug.
## Prüfen
- Alle 12 PNG ansehen (Read); Lesbarkeit verkleinert auf 300 px Breite prüfen (Bild verkleinern und ansehen).
- `node bau/bauen.mjs --messen --pruefen --aus=.cache/E4-GRAF-04/dist` bleibt grün (die PNGs werden als statische Assets mitkopiert).
- Bericht nach `_werkstatt/pakete/_gemeinsam.md` mit Dateigrößen; das Einbinden je Seitentyp übernimmt Opus.
