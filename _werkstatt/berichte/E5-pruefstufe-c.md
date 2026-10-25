# E5 · Prüfstufe C (Endprüfung des Bestands) · Paket E5-PRUEF-14

Rolle Prüfer (Haiku) · 2026-10-25, Messfenster 19:50–20:55 UTC · Branch claude/bold-noether-fk2n4f (Stand 8db2c56)
Messbuild: `node bau/bauen.mjs --messen --pruefen --port=4201 --aus=.cache/e5/dist`, Vorschau auf 4201 (am Ende beendet, PID 26514). Rohdaten und Protokolle unter `.cache/e5/` (gitignored). Diagnosekopien mit Testwerten unter `.cache/e5/diagnose2/` (nicht ausgeliefert).

Stichprobe (Saat 25, mulberry32 mit teilweisem Fisher-Yates):
- Übrige Nicht-Ortsseiten: Grundgesamtheit 292 (304 ohne 11 Hauptansichten und 404.html), gezogen 30 (10 % aufgerundet, mindestens 5). Liste `.cache/e5/stichprobe-uebrige.json`.
- Ortsseiten: `ortsstichprobe.mjs --saat 25 --zonen A:4,B:4,C:4,D:4,NL:4`, 20 Orte, `.cache/e5/ortsstichprobe.json`.
- Zusammen mit den 13 Hauptansichten 63 Pfade, Liste `.cache/e5/pfade.json`.
- Sprachen: entfällt. Alle 5.556 Seiten tragen `lang="de"`, es gibt keine weitere Sprache.

## 1. Kriterien

| Kriterium | Ergebnis | Beleg |
|---|---|---|
| Z-02 Bestand | **nicht erfüllt** | `.cache/e5/npm-test.txt`, `.cache/e5/bauen-messen-pruefen.txt`, `.cache/e5/release-diagnose.txt`, `.cache/e5/funktionen.json`, `.cache/e5/smoke.json` |
| Z-03 Designsystem | erfüllt | `.cache/e5/dist.pruefbefunde.json` (token: 0 Befunde); Gegenprobe: 0 Werte außerhalb der Tokens, 11 Treffer nur in Kommentaren oder als `1px` |
| Z-05 Bewegung | **nicht erfüllt** (Register) · erfüllt (reduzierte Bewegung, Bildrate) | `.cache/e5/register-abgleich-entwurf.md`, `.cache/e5/bewegung.json`, `.cache/e5/bildrate-m*-*.json` |
| Z-06 Grafik | erfüllt | `.cache/e5/svg.json`, `.cache/e5/dist.pruefbefunde.json` (icons: 56 Icons, 0 Befunde) |
| Z-07 Zugänglichkeit | axe erfüllt · Hauptaufgaben im Vorschau-Zustand **nicht erfüllt** | `.cache/e5/axe-light.json`, `.cache/e5/axe-dark.json`, `.cache/e5/tastatur.json`, `.cache/e5/tastatur-diagnose.json` |
| Z-08 Leistung | **nicht erfüllt** | `.cache/e5/lighthouse.json`, `.cache/e5/lighthouse-wiederholung.json`, `.cache/e5/inp-*.json`, `.cache/e5/dist.pruefbefunde.json` (budgets) |
| Z-09 Darstellung | Überlauf erfüllt · Bildsatz-Größe **nicht erfüllt** | `.cache/e5/ueberlauf.json`, `_werkstatt/bilder/E5/index.json` |

Die Befunde unten (B1 bis B16) begründen die Einstufungen.

## 2. Schritte

1. **Bestand.** `npm test`: 292 Tests, 291 bestanden, 0 fehlgeschlagen, 1 todo. Messbuild: Exit 0, 5.556 Seiten, alle Prüfer 0 Fehler, SEO 72 Warnungen (alle `seo/titel-laenge-ort`, Ortsseiten, D-SEO-04). Platzhalter in der Ausgabe 65, in der Konfiguration 58, ungeprüfte Fakten 92.
2. **Vorschau 4201.** Antwortet mit 200, Header identisch zur Produktion. Unbekannter Pfad 404.
3. **Hauptansichten.** 13 Pfade, V12 mit `/impressum/` und `/gibt-es-nicht/`.
4. **Stichprobe.** Siehe oben.
5. **smoke, axe, ueberlauf, vnu.**
   - smoke: 126 Messungen (63 × 2). Fremde Anfragen 0, CSP-Verstöße 0, Titel 126/126, genau eine h1 je Seite. Status 200 (124), 404 (2, `/gibt-es-nicht/`). Konsolenmeldungen 2, beide das Protokoll des absichtlichen 404.
   - axe hell und dunkel: je 63 Seiten, serious 0, critical 0, moderate 0, minor 0.
   - ueberlauf: 693 Messungen (63 Pfade × 11 Varianten: 320/390/768/1440/1920 px, erzwungene Farben je Breite, 200 % Zoom). 0 Dokumentüberlauf.
   - vnu: 63 Dateien, 0 Fehler, 395 Warnungen. Alle 395 sind CSP-Meta-Hinweise (vnu liest die Dateien ohne HTTP-Header, Inline-JSON-LD, Verweise auf `app.*.css`/`app.*.js`/`druck.*.css`). Gleiche Befundart wie E3 und E4.
6. **Lighthouse mobil, 3 Läufe, Median (Spanne in Klammern).**

   | Pfad | Perf | A11y | BP | SEO | LCP ms | CLS |
   |---|---|---|---|---|---|---|
   | `/` | 96 (0) | 100 | 100 | 100 | 2416 (9) | 0 |
   | `/einbruchschutz/` | 96 (0) | 100 | 100 | 100 | 2408 (2) | 0 |
   | `/notoeffnung/tueroeffnung/` | 98 (1) | 100 | 100 | 100 | 2109 (151) | 0 |
   | `/preise/` | 96 (1) | 100 | 100 | 100 | 2404 (153) | 0 |
   | `/einsatzgebiet/` | 97 (1) | 100 | 100 | 100 | 2255 (154) | 0 |
   | `/einsatzgebiet/hessen/limburg-weilburg/` | 98 (1) | 100 | 100 | 100 | 2104 (156) | 0 |
   | `/schluesseldienst-loehnberg/` | 98 (1) | 100 | 100 | 100 | 2127 (143) | 0 |
   | `/ratgeber/rauchmelderpflicht/` | 99 (0) | 100 | 100 | 100 | 1953 (2) | 0 |
   | `/ueber-uns/` | 97 (0) | 100 | 100 | 100 | 2258 (7) | 0 |
   | `/kontakt/` | 99 (0) | 100 | 100 | 100 | 1956 (7) | 0 |
   | `/suche/` | 99 (0) | 100 | 100 | **66** | 1955 (1) | 0 |
   | `/impressum/` | 99 (0) | 100 | 100 | 100 | 1954 (150) | 0 |
   | `/gibt-es-nicht/` | nicht messbar (Werkzeugfehler, siehe W1) | | | | | |

   Vergleich: E2-Baseline V01 (`.cache/e2/lighthouse.json`, 3 Läufe): Perf 98 (Spanne 0), LCP 2104 ms (Spanne 2,2). Wiederholung der E5-Messung: V01 Perf 96, LCP 2410 ms; `/einbruchschutz/` Perf 96, LCP 2411 ms. Zum Vergleich E3 `/einbruchschutz/` Perf 99, LCP 1960 ms; E4 `/preise/` Perf 97, LCP 2255 ms.
7. **INP** (Drossel 4×, je 3 Läufe, Median des Maximums): v01-inp 40 ms · e3-einsatzgebiet 32 ms · e3-hub 40 ms · e4-preise 40 ms · e4-kontakt 32 ms · e4-suche 24 ms. Schwelle 200 ms erfüllt. Höchster Einzelwert 48 ms.
8. **Funktionsliste F01–F24**: siehe Abschnitt 3 (Ergebnisse je Funktion).
9. **Tastatur, K-002.** Protokoll `.cache/e5/tastatur-diagnose.json` (mit Testwerten) und `.cache/e5/tastatur.json` (Vorschau). Details in B1 bis B3 sowie B12 und B13.
10. **Bewegung.** Registerabgleich in `.cache/e5/register-abgleich-entwurf.md` (statisch, mit Laufzeitinventar). Reduzierte Bewegung auf allen 13 Hauptansichten: laufende Animationen nach 200 ms 0, Scroll-Stichprobe 0; Lage- oder Größenänderungen 0 (13 Schritte je Seite); nicht sichtbare Textelemente 0. Bildrate (Drossel 4×, 3 Läufe, Median verworfen): M-16 1,63 % · M-17 0,72 % · M-18 0,72 % · M-20 0,00 % · M-21 1,02 %, alle unter 5 % (Ersatzmessung headless, U-3).
11. **SVG.** 63 Seiten, 1.019 SVG-Elemente: 995 dekorativ (`aria-hidden`), 24 inhaltstragend (`role="img"`, alle mit `<title>` oder über `aria-labelledby` mit Titel), 0 unklassifiziert. Doppelte IDs auf keiner der 63 Seiten. Eigenständige SVG-Datei: nur `favicon.*.svg` (ohne Skript, ohne Raster). Icon-Prüfer: 56 Icons, 0 Befunde.
12. **Bildsatz** `_werkstatt/bilder/E5/`: 78 Seiten (13 Pfade × 3 Geräte × 2 Schemata), 526 Bilder vor der Kürzung. Kürzung nach der E3-Regel (Hell Desktop und Mobil vollständig, Tablet und Dunkel nur Ausschnitte 1 bis 3): 341 Bilder, 20,3 MB. Ziel unter 15 MB **verfehlt** (B11). Gekappte Seiten (12-Ausschnitt-Grenze): `/` mobil hell und dunkel, `/preise/` mobil hell und dunkel, `/einsatzgebiet/hessen/limburg-weilburg/` mobil hell und dunkel. Commit 8db2c56 enthält diese Dateien bereits (vom Orchestrator).
13. **Bericht**: diese Datei.

## 3. Funktionsliste F01–F24 (Ergebnis je Funktion, Beleg `.cache/e5/funktionen.json`, `.cache/e5/debug-*`, `.cache/e5/f08-f12-korr.json`, `.cache/e5/suche-rolle.json`)

| Nr. | Funktion | Ergebnis |
|---|---|---|
| F01 | Anruf von jeder Seite | **abweichend** in der Vorschau (kein Anruf-Link, B1). Mit Testwerten: Anruf auf allen 13 Hauptansichten erreichbar (B12) |
| F02 | Orts-/PLZ-Suche mit Sprung | ok. Modus prüfen (`/`, `/einsatzgebiet/`): Enter zeigt Ergebnis mit Link „Zur Seite für …“, Link führt zur Ortsseite. Modus navigieren (404): Enter springt direkt. Auf allen Geräten |
| F03 | PLZ-Prüfung mit Zonen-Ergebnis | ok (PLZ 35781: Ergebnisbox mit Entfernung und Zone) |
| F04 | Preistabelle | **abweichend**: Struktur vorhanden (3 Tabellen/dl), Preise nur als Platzhalter „[Preis folgt]“ (B9, U-6) |
| F05 | Preisrechner | Leerzustand „Berechnung erst mit Preisliste möglich.“ ok. Gesamtpreis nicht prüfbar (keine Preise). Nicht geprüft |
| F06 | FAQ aufklappbar | ok (V01, V02, V03, V07) |
| F07 | Ablauf in Schritten (V01, V02) | **abweichend**: V01 4 Schritte, V02 `/einbruchschutz/` 0 (B5) |
| F08 | Leistungsregister mit Gruppenfilter | ok (korrigierte Prüfung: „Notöffnung“ zeigt eine Gruppe, „Alle“ zeigt vier; die erste Prüfung hatte einen falschen Selektor) |
| F09 | Ortsverzeichnis A–Z, Länder | ok |
| F10 | Ortsseite: Faktenblock, Nachbarn, Lagekarte | ok (Löhnberg) |
| F11 | Kontakt: Anruf, E-Mail-Composer | **abweichend** in der Vorschau (B2). Mit Testwerten: Composer mit 4 Anliegen und Knopf „E-Mail vorbereiten“ ok |
| F12 | Seitensuche | ok (korrigierte Prüfung: „zyl“ 6 Seiten, „Notöff“ 2, „Preis“ 6). Die erste Prüfung hatte einen falschen Selektor |
| F13 | Ratgeber mit Inhaltsverzeichnis | ok (4 Einträge, Sprung zum Ziel) |
| F14 | „Seriösen Schlüsseldienst erkennen“ auf V01, V07, V08 | **abweichend**: nur auf V01 (B6) |
| F15 | Hell/Dunkel nach Systemeinstellung | ok (Körperfarbe wechselt) |
| F16 | Reduzierte Bewegung | ok (siehe Schritt 10) |
| F17 | HTML- und XML-Sitemaps | ok (XML 200, 19 Untersitemaps 200) |
| F18 | Fehlerseite mit Suche | ok (Status 404, Ortsfeld und Startlink) |
| F19 | Rechtstexte im Fuß | ok (auf allen 13 Hauptansichten) |
| F20 | Druckansicht Preise, Ratgeber | ok (Leiste und Navigation ausgeblendet, Tabelle sichtbar, FAQ offen) |
| F21 | Druckstile als eigene Datei | ok (`druck.*.css` mit `media="print"`, 1.165 B gz, Budget 3.072 B) |
| F22 | Erzwungene Farben | ok (Systemfarben Canvas/CanvasText, Links unterstrichen) |
| F23 | Vorkomprimieren | ok (Build mit `--vorkomprimieren`: 5.602 `.br` und 5.602 `.gz`; `app.css` 51.077 B → Brotli 9.496 B, Gzip 10.779 B; Budget ok) |
| F24 | „… in Zahlen“ auf Hubs | **abweichend** auf 3 von 230 Hubs (B7). Auf den übrigen 227 stimmen Gemeinden, Ortsteile, Zonen, PLZ-Spanne überein |

## 4. Befunde (Datei · Selektor)

- **B1 Platzhalter-Vorschau, Anruf.** `src/vorlagen/teile/rufknopf.mjs:12` setzt bei Platzhalter-Telefonnummer ein `<span class="rufknopf …" data-zustand="platzhalter">` statt `<a href="tel:…">`. In der Vorschau gibt es daher keinen Anruf-Link (`a[href^="tel:"]`: 0 auf allen Seiten). Konfigurationsfolge U-6.
- **B2 Platzhalter-Vorschau, Kontakt.** `src/vorlagen/seiten/kontakt.mjs:92` rendert ohne Adresse ein `<div class="composer" data-zustand="platzhalter">` statt `<form>`. Der Knopf „E-Mail vorbereiten“ (`button.knopf-primaer[type=submit]`) hat dann keine Wirkung. Die Felder `#k-ort`, `#k-name`, `#k-rueckruf`, `#k-zeitraum` tragen `data-nur-js hidden`, und nur der Composer-Code deckt sie auf (`composer.mjs`). Ohne Composer-Code bleiben sie verborgen. Tastatur erreicht nur `#k-nachricht`. Mit Testwert (Diagnosekopie) sind alle Felder da und erreichbar.
- **B3 Fehlerübersicht Kontakt (mit Testwerten).** Bei leeren Pflichtfeldern: Übersicht sichtbar, Fokus darauf, zwei Links auf `#k-ort` und `#k-nachricht` (Ziele vorhanden), `aria-invalid` an beiden Feldern. Im Test nach Mausklick ist die Outline der Übersicht `none`. Das CSS mit `:focus-visible` existiert (`src/assets/css/ansichten/kontakt/kontakt.css:34`). Der Tastaturpfad ist nicht gemessen (siehe Abschnitt 5).
- **B4 Bewegungsregister, Einträge ohne Umsetzung** (K-007 gegen CSS/JS): M-07 Antworttext ohne Deckkraft und Y −4 px (`komponenten/faq.css:12`); M-08 Combobox-Liste (`komponenten/ortssuche.css:15`) ohne Animation; M-09 Feldfehler ohne Übergang (`composer.mjs`, `kontakt.css`); M-11 Erfolg ohne Zustand im Composer.
- **B5 Register-Abweichungen und Zusatzanimationen.**
  - M-06 Menü-Blatt 300 ms (`komponenten/menue-blatt.css:19`, `--dur-zustand`), Register 320 ms.
  - M-13 Abschnittsauftritt: `bewegung.css:30–33` nur für V01, Bereich 0–35 % (Register 0–30 %, V02/V05/V09 ohne Eintrag).
  - M-18 Ringe: Staffel über view()-Bereiche statt 120 ms.
  - M-19 Peilungslinie läuft beim Laden der Ortsseite, nicht bei „Ort gewählt“.
  - M-05: `bewegung.css` nutzt die Kennung M-05 für den Gruppenfilter (`.verz-gruppe[data-zustand="neu"]`, −8 px). Im Register steht dafür kein Eintrag.
  - Zusatz ohne Register: `.ablauf::before` (`bewegung.css:34`), `.lb-fluss-teil`, `.lb-tor`, `.lb-text-tunnel` (M-20 nennt nur die Tunnel-Linie, `bewegung.css:44–46`), `.hauptnav-aufklapper .i` (`komponenten/hauptnav.css:17`), `.zy-feder` scaleY (`bewegung.css:8`).
  - Laufzeit bestätigt das Inventar (`.cache/e5/bewegung.json`).
- **B6 F14 fehlt auf V07 und V08.** Der Text „Seriösen Schlüsseldienst erkennen“ steht nur auf `/`. Auf `/schluesseldienst-loehnberg/` und `/ratgeber/rauchmelderpflicht/` fehlt er.
- **B5b M-17 (Szene), offen.** Übergänge laufen nach Schrittwechsel (2 bis 6 gleichzeitig nach 120 ms, nach 670 ms alle beendet, `.cache/e5/szene-kontakt.json`). Der Attributbeobachter zählt jedoch 0 Änderungen. Ursache nicht geklärt.
- **B7 Hub-Zahlen, NL-Provinzen.** `/einsatzgebiet/niederlande/gelderland/`, `…/noord-holland/`, `…/overijssel/`: Überschrift „Die Provinz in Zahlen“, ohne Zeile „Postleitzahlen“, obwohl die Daten PLZ führen (`.cache/e5/hub-zahlen.json`).
- **B8 Lighthouse /suche/, SEO 66.** Ursache `<meta name="robots" content="noindex, follow">` (`src/konfig/routen.mjs:32`, D-SEO-03). Nach K-011 soll SEO 100 sein. Gemeldet, nicht als Verstoß gewertet.
- **B9 Preistabelle.** `/preise/`, `#preisliste`: alle Beträge als `[Preis folgt]`. Die Preisliste fehlt (U-6).
- **B10 Lighthouse V01 gegen E2.** Perf 98 → 96, LCP 2104 → 2410/2416 ms (Wiederholung bestätigt). Spanne E2 2,2 ms. Ursache nicht geklärt; Umgebungseinfluss nicht ausgeschlossen, aber nicht belegt.
- **B11 Bildsatz-Größe.** `_werkstatt/bilder/E5/`: 20,3 MB nach E3-Regel, Ziel unter 15 MB verfehlt.
- **B12 Hauptaufgabe H1 auf V06 mobil.** Mit Testwerten: Anruf nach 177 Tabulatorschritten (Desktop 11). Im DOM liegen vor der Rufleiste 247 Links. Der Anruf ist also lösbar, aber weit hinten in der Reihenfolge.
- **B13 Hauptaufgaben mit Testwerten** (`.cache/e5/tastatur-diagnose.json`): H2 Preis mobil 9 / desktop 5 Schritte. H3 Ort prüfen mobil 4 / desktop 13 (Eingabe, Pfeil, Enter, Link). H4 seriös 36 / 45. H5 Anfrage mobil 70 bis Kontaktlink, 8 bis `#k-ort`, 4 bis Nachricht, 1 bis Absenden; desktop 9 / 16 / 4 / 1. H6 Ratgeber mobil 69 / desktop 7. Die `mailto:`-Übergabe ist im Headless-Browser nicht beobachtbar.
- **B14 vnu-Warnungen.** 395, alle CSP-Meta-Hinweise (Inline-JSON-LD 138, Verweise auf Stylesheets und Skripte). Quelle `src/vorlagen/layout.mjs` (JSON-LD), Befundart wie E3/E4.
- **B15 Konsolenmeldung 404.** Zwei Meldungen des absichtlichen 404 von `/gibt-es-nicht/`. Wörtlich widerspricht das „0 Konsolen-Fehler“ in Z-02.
- **B16 Titel-Warnungen.** 72 Ortsseiten mit Titel über 60 Zeichen (`seo/titel-laenge-ort`), nach D-SEO-04 nur Warnung.

## 5. Nicht geprüft

- Z-04 Gestaltung und Z-10 Übergabe (nicht Teil dieses Pakets).
- Tastaturpfad der Fehlerübersicht (Fokusring) und die Sichtprüfung auf überlappenden Text. Die Sichtabnahme liegt beim Orchestrator.
- Bildsatz für die Stichprobe (Schritt 12 nennt nur die Hauptansichten). Überlauf-Zahlen liegen vor.
- Lighthouse für `/gibt-es-nicht/` (W1).
- Preisrechner-Rechnung (keine Preise in der Vorschau) und die `mailto:`-Übergabe.
- Firefox und Safari (U-2), echte Geräte (U-1), GPU-Bildrate (U-3), Live-Header (U-4).
- Bewegungscode-Gewicht nur geschätzt: `bewegung.css` 1.906 B gz, `szene.mjs` 513 B gz, `abspielen.mjs` 440 B gz, zusammen etwa 2,9 KB gz (Grenze 60 KB). Nicht im Bündel gemessen.
- Stichprobe-Ortsseiten: 287 Einzelprüfungen des Ortsstichprobenwerkzeugs ohne Abweichung (`.cache/e5/ortsstichprobe.json`). Keine Lighthouse- oder Bildmessung je Ort.

## 6. Werkzeug-Wünsche

- **W1** `lighthouse.mjs`: bricht bei 404-Dokumenten mit `ERRORED_DOCUMENT_REQUEST` ab und schreibt keine JSON-Datei. Wunsch: 404-Seiten als Messergebnis führen.
- **W2** Hauptaufgaben-Protokoll (Tabulatorfolge) als Werkzeug in `_werkstatt/werkzeuge/`. Bisher nur als Skript unter `.cache/e5/skripte/tastatur.mjs`.
- **W3** `bauen.mjs --release` bricht zuerst bei der Basis-URL ab und nennt dann keine Platzhalter und ungeprüften Fakten. Wunsch: alle Sperren gemeinsam ausgeben.
- **W4** `vnu.mjs`: CSP-Meta-Hinweise getrennt ausweisen oder auf dem HTTP-Vorschau-Server prüfen.
- **W5** `bildsatz.mjs`: keine Option für gekürzte Sätze und keine Grenze je Seite außer 12.

## 7. Eigene Fehler (korrigiert, zur Transparenz)

- Die erste Lighthouse-Läufe bei 12 Pfaden brachen wegen 404 ab, neu gemessen.
- Die erste Diagnosekopie hatte einen verschachtelten Ausgabepfad und die Vorschau bediente einen leeren Ordner. Die H1-, H5- und Funktionswerte daraus sind verworfen und neu gemessen.
- F08 und F12 hatten falsche Selektoren. Korrigierte Werte stehen oben.

=== ENDE E5-PRUEF-14 · BEREIT ZUR RÜCKGABE ===
