# E5 · Abschluss-Nachprüfung des Endstands

Branch claude/bold-noether-fk2n4f · 2026-10-26 · Auswertung durch den Orchestrator (Opus), Messungen ausschließlich durch Haiku-Prüfer mit den Werkzeugen aus `_werkstatt/werkzeuge/`.
Messbuild: `node bau/bauen.mjs --messen --pruefen --aus=.cache/e5-abschluss/dist`, Vorschau auf 4251 (unkomprimiert) und 4254 (gzip, wie beim Hoster).
Belege: Die Protokolle (JSON, Logs, Skripte) liegen unter `_werkstatt/protokolle/E5-abschluss/` in denselben Ordnern wie beim Lauf (`z-pruefer`, `pruefer-z07-z09`, `haiku-z05-z08`, `n2-bestand`, `n2-bewegung`); Bilder, PDFs und der Build bleiben in `.cache/e5-abschluss/` (gitignored). Der Abschluss-Bildsatz liegt in `_werkstatt/bilder/abschluss/` (510 Bilder, `index.json`), die Galerie in `_werkstatt/bilder/galerie.html`.

## 1. Nachprüfung 1 (Stand `ea48cbe`/`4898dec`, Workflow `e5-abschluss-pruefung`)

Vier Haiku-Agenten parallel: Prüfer Z-02/03/06/10 mit Kalibrierung, Prüfer Z-07/09, Prüfer Z-05/08 und der Dokumentar für den Abschluss-Bildsatz.

| Prüfung | Ergebnis | Messung | Beleg (unter `_werkstatt/protokolle/E5-abschluss/`) |
|---|---|---|---|
| Z-02 `npm test` | erfüllt | 331 Tests, 330 bestanden, 0 fehlgeschlagen, 1 todo | `z-pruefer/npm-test.log` |
| Z-02 Messbau mit Prüfern | erfüllt | Exit 0, 5.556 Seiten, 11 Prüfer 0 Fehler, 72 Warnungen nur `seo/titel-laenge-ort` (D-SEO-04) | `z-pruefer/bau-messen-pruefen.log` |
| Z-02 Negativtest `--release` | erfüllt | Abbruch mit Exit 2: „Release: betrieb.basisUrl ist ein Platzhalter.“ | `z-pruefer/bau-release-negativ.log` |
| Z-02 smoke 13 Hauptansichten mobil + desktop | erfüllt | 4251 und 4254 je 26 Läufe: 0 fremde Anfragen, 0 CSP-Verstöße; Meldungen nur an der gewollten 404 | `z-pruefer/smoke-4251.json`, `z-pruefer/smoke-4254.json` |
| Z-02 Funktionsliste F01–F20 | teilweise (U-6) | 18 erfüllt, 2 teilweise: F01 Anruf und F05 Gesamtbetrag im Rechner – beide nur, weil Telefonnummer und Preisliste Platzhalter sind (U-6); Rechenlogik per `test/preise.test.mjs` | `z-pruefer/funktionen.json`, `z-pruefer/funktionen.mjs` |
| Z-02 0 Konsolenfehler | **nicht erfüllt** | 1 Seitenfehler „Transition was aborted because of invalid state. ViewTransition opt-in disabled“ bei F02; Wiederholung: 5 von 19 Skript-Sprüngen, 0 von 12 Link-Navigationen | `z-pruefer/probe-f02-wiederholung.json`, `z-pruefer/probe-navigation.json` |
| Z-03 Token-Prüfer + Stichprobe | erfüllt | token 0/0; Stichprobe 5 Dateien (Saat 20261026): 0 Werte außerhalb `var(--…)` | `z-pruefer/css-stichprobe.txt`, `z-pruefer/token-stichprobe.json` |
| Z-06 Icons + SVG | erfüllt | Geometrie-Linter 56 Icons 0 Befunde; 292 SVG auf 13 Hauptansichten alle `aria-hidden` oder `role="img"` mit Namen; 0 doppelte IDs; 0 fehlende `use`-Ziele | `z-pruefer/svg-ids.json` |
| E2-PRUEF-07 Kalibrierung | erfüllt | eigener Fixture-Server: smoke gut 0 / schlecht 6 Befunde je Ansicht; axe gut 0 / schlecht 2 critical + 2 serious; vnu gut 0 / schlecht 1 Fehler + 1 Warnung; Negativtests der Build-Prüfer in `test/token.test.mjs`, `test/icons.test.mjs`, `test/pruefer-kern.test.mjs`, `test/ehrlichkeit.test.mjs`, `test/budgets.test.mjs` | `z-pruefer/kal-smoke.json`, `z-pruefer/kal-axe.json`, `z-pruefer/kal-vnu.json` |
| Z-07 axe hell + dunkel | erfüllt | 13/13 Seiten 0 serious/critical (auch 0 minor/moderate); Kontrolle `schlecht.html` wird erkannt | `pruefer-z07-z09/axe-hell.json`, `pruefer-z07-z09/axe-dunkel.json`, `pruefer-z07-z09/axe-kontrolle.json` |
| Z-07 Fokus sichtbar | erfüllt | mobil 2.739, desktop 2.670 Fokusstopps, 0 ohne sichtbaren Umriss | `pruefer-z07-z09/tastatur-mobil-vorschau.json`, `pruefer-z07-z09/tastatur-desktop-vorschau.json`, `pruefer-z07-z09/fokus-probe.json` |
| Z-07 Fokus nie ganz verdeckt | erfüllt | mobil vorwärts 461 (Ersatz 471) Schritte, desktop rückwärts 156: 0 ganz, 0 teilweise verdeckt | `pruefer-z07-z09/verdeckt-*.json` |
| Z-07 H1 anrufen / Anruf im Menü-Blatt | U-6-Ersatz erfüllt | Vorschau: kein `tel:`-Link, weil die Nummer ein Platzhalter ist (U-6). Ersatz mit Testnummer in einer lokalen Kopie (nicht veröffentlicht): Anruf nach 5 (mobil) bzw. 11 (desktop) Tab-Schritten auf allen 13 Seiten, Fokus sichtbar; im Menü-Blatt nach 12 Schritten, ganz im Sichtfeld | `pruefer-z07-z09/tastatur-mobil-ersatz.json`, `pruefer-z07-z09/tastatur-desktop-ersatz.json`, `pruefer-z07-z09/blatt-probe.json` |
| Z-07 H2 Preis | erfüllt | mobil 2 Aktivierungen, desktop 1 | `pruefer-z07-z09/tastatur-*-vorschau.json` (ergebnis.h2) |
| Z-07 H3 Ort prüfen | erfüllt | „Löhnberg“ + Auswahl = 2 Eingaben, Ergebnis Kerngebiet | (ergebnis.h3) |
| Z-07 H4 seriösen Betrieb erkennen | Pfad erfüllt, Inhalt U-6 | Über uns → Impressum per Tastatur; Inhalt 23 bzw. 11 Platzhalter (U-6) | (ergebnis.h4) |
| Z-07 H5 Anfrage per E-Mail | Pfad erfüllt, Übergabe U-6 | Ort, Nachricht, Absenden per Tastatur; ohne Empfängeradresse erscheint der Hinweis, Fokus geht dorthin | (ergebnis.h5) |
| Z-09 Überlauf | erfüllt | 38 Seiten (13 Hauptansichten, 5 übrige, 20 Ortsseiten aus A–D und NL) × 11 Varianten (320/390/768/1440/1920, forced-colors, 200 % Zoom) × hell/dunkel = 836 Messungen, 0 Überlauf; Kontrolle erkennt `schlecht.html` 11/11 | `pruefer-z07-z09/ueberlauf-hell.json`, `pruefer-z07-z09/ueberlauf-dunkel.json`, `pruefer-z07-z09/ueberlauf-kontrolle.json`, `pruefer-z07-z09/stichprobe-orte.json` |
| Z-09 Sichtung erster Bildschirm | erfüllt mit Hinweis | 30 Bilder (5 Seiten × 3 Geräte × hell/dunkel): kein abgeschnittener oder überlappender Text; mobil liegt die feste Rufleiste über unteren Zeilen des ersten Bildschirms (gewollt nach KERN K-003, P5; beim Scrollen frei, Fokus nie verdeckt) | `.cache/e5-abschluss/pruefer-z07-z09/bildsatz/` (1.340 Ausschnitte, nicht im Repo) |
| Z-05 Bildrate große Momente | erfüllt (U-3) | M-16 3,42 %, M-17 1,38 %, M-18 1,80 %, M-20 1,69 %, M-21 2,48 % (max. aus je 3 Läufen, 4× Drosselung) | `haiku-z05-z08/bildrate-m*-*.json` |
| Z-05 reduzierte Bewegung Laden/Scrollen | erfüllt | 13/13: 0 Transform-Animationen, alle Inhalte sichtbar; Kontrolle no-preference findet Transforms | `haiku-z05-z08/reduce.json` |
| Z-05 reduzierte Bewegung Interaktionen | **nicht erfüllt** | FAQ-Chevron und Navigationspfeil drehen 300 ms; Panel 300/240 ms statt 150; Menü-Blatt ohne Deckkraftblende; Ortsprüfungs-Ergebnis blendet | `haiku-z05-z08/reduce.json` |
| Z-05 Register | teilweise | jede Animation zugeordnet, neun Zuordnungen unvollständig (Auslöser oder Dauer weichen ab) | Ergebnis im Workflow-Protokoll, Zusammenfassung hier |
| Z-08 Absolutwerte | erfüllt | Lighthouse mobil, 3 Läufe, 12 Hauptansichten: Perf 96–99, A11y/BP 100, SEO 100 (außer /suche/, D-SEO-03), LCP-Mediane 1.954–2.412 ms, CLS ≤ 0,048; gzip-Start Perf 99, LCP 1.666 ms; INP max. 64 ms; Bewegungscode ≤ 20,0 KB gz (hart 60 KB) | `haiku-z05-z08/lighthouse-4251.json`, `haiku-z05-z08/lighthouse-4254.json`, `haiku-z05-z08/inp-*.json`, `haiku-z05-z08/groesse.json` |
| Z-08 gegen E2 (V01) | durch A-1 gedeckt | Median LCP 2.404 ms (2.253/2.408/2.404) gegen E2 2.104 ms; A-1 nannte nur +150 ms | `haiku-z05-z08/lighthouse-4251.json` |
| Z-10 Dateien, Anleitung, Links | erfüllt | alle Übergabedateien vorhanden; `docs/ZUSAMMENFUEHREN.md` mit Zurückrollen und `_werkstatt`-Hinweis; 15 relative Links, 0 tot | `z-pruefer/links-md.json` |
| Z-10 BERICHT aktuell | teilweise | BERICHT.md war noch der Morgenbericht (06:06) | – |
| E5-PRUEF-14 Abschluss-Bildsatz | erfüllt | 510 Bilder (13 Pfade × 3 Geräte × hell/dunkel), byte-gleich kopiert; Galerie neu (1.372 Bilder, 10 Abschnitte) | `_werkstatt/bilder/abschluss/index.json`, `_werkstatt/bilder/galerie.html` |

## 2. Behebungen (Commit `e719627`)

1. **Konsolenfehler beim Seitenwechsel (Z-02, mittel).** Ursache: Startet eine Navigation per Skript, während der Browser einen Seitenwechsel-Übergang (M-15) noch vorbereitet, überspringt er den Übergang und lehnt dessen Promises ab; ohne Abnehmer meldet Chromium das als Seitenfehler. `src/assets/js/app.mjs` fängt die Promises (`ready`, `finished`, `updateCallbackDone`) bei `pageswap` und `pagereveal` still ab – der Übergang selbst bleibt unverändert. Eigene Probe des Orchestrators vor der Haiku-Nachprüfung: 0 von 15 Läufen (vorher 1 von 5).
2. **Reduzierte Bewegung (Z-05, mittel/klein).** `faq.css` Chevron sofort (M-07); `hauptnav.css` Pfeil sofort, Panel nur Deckkraft 150/120 ms (M-05); `menue-blatt.css` Deckkraft 150 ms für Blatt und Hintergrund (M-06); `ortssuche.css` Ergebnis sofort (M-12).
3. **Register K-007 (Z-05, klein).** M-03 (sofort, kein Übergang), M-07 (Anliegen-Wahl im Composer), M-09 (Hinweis „ohne Adresse“), M-12 (Suche, Betreff), M-14 (Ratgeber-Inhaltsschiene), M-17 (Schrittlinie und Stückliste), M-18 (Deckkraft der Karte, Kupferring), M-21 (gegenläufige Stifte) ergänzt.
4. **A-1 (Z-08).** Wortlaut auf „+150 bis +300 ms (zweigipflig)“ berichtigt, Zahlen der Nachprüfung eingetragen.
5. **Aktionsdatei Kontakt.** `_werkstatt/werkzeuge/aktionen/e4-kontakt.json` klickt den Absendeknopf über `data-rolle="absenden"` (der Knopf ist in der Vorschau `type="button"`).
6. Neu gebaut: Exit 0, 5.556 Seiten, 11 Prüfer 0 Fehler, 72 bekannte Warnungen (`.cache/e5-abschluss/bau3.log`).

Nicht geändert, mit Begründung:
- **Anruf und Rechnerbetrag in der Vorschau (F01, F05, H1, H4, H5):** Konfigurationslücken (U-6), kein Codefehler; der Release-Bau sperrt sie (Negativtest), der Ersatz mit Testnummer ist erfüllt.
- **Rufleiste über den unteren Zeilen des ersten Bildschirms (mobil):** gewollt (KERN K-003, Prinzip 5 „Daumen zuerst, Nacht mitgedacht“; Rufleiste nie versteckt); Fokus nie verdeckt, Inhalt beim Scrollen frei.
- **Sitemap- und robots-Adressen 127.0.0.1:4173 im Messbau:** erwartbar für `--messen`; im Release gilt `betrieb.basisUrl`.
- **Kreislinien der Lagekarte am Kartenrahmen angeschnitten (fernere Orte, z. B. Flonheim, Detmold-Berlebeck, Tilligte):** Der gestrichelte Ring um Weilburg reicht dort über den Kartenausschnitt hinaus; kein Text betroffen, kein Überlauf. Gestaltungspunkt ohne Fehlerwirkung, eingetragen in `docs/OFFENE-PUNKTE.md` (Lagekarte: Ausschnitt so wählen, dass der Ring ganz sichtbar bleibt, oder bewusst als Anschnitt gestalten).
- **Weiches Bewegungsbudget 12 KB:** siehe Nachprüfung 2, Punkt Bewegungscode.

## 3. Nachprüfung 2 (Stand `e719627`, Workflows `e5-abschluss-nachpruefung-2` und `n2-bewegung-rest`)

Der erste Lauf brach am Sitzungslimit ab; seine Teilergebnisse sind verwertbar, der Rest wurde nachgeholt. Belege unter `_werkstatt/protokolle/E5-abschluss/n2-bestand/` und `n2-bewegung/`.

| Prüfung | Ergebnis | Messung | Beleg |
|---|---|---|---|
| `npm test` | erfüllt | 331 Tests, 330 bestanden, 0 fehlgeschlagen, 1 todo | `n2-bestand/npm-test.log` |
| smoke 4251/4254 | erfüllt | 0 fremde Anfragen, 0 CSP-Verstöße, Meldungen nur an der gewollten 404 | `n2-bestand/smoke-4251.json`, `n2-bestand/smoke-4254.json` |
| Seitenwechsel ohne Konsolenfehler | **nicht erfüllt** | Der Abfang aus `e719627` wirkt nicht: Skript-Sprung 5 und 6 von 30, Link-Wechsel 8 von 48 | `n2-bestand/seitenwechsel-skript.json`, `n2-bestand/seitenwechsel-links.json` → Abschnitt 4 |
| INP alle Aktionsdateien | erfüllt | max. 88 ms (/einsatzgebiet/hessen/limburg-weilburg/), Kontakt 48/56 ms (Aktionsdatei läuft jetzt) | `n2-bestand/inp-*.json` |
| Lighthouse /, /preise/, gzip / | erfüllt | / Perf 97 · LCP 2.412 ms · CLS 0,014; /preise/ 96 · 2.410 ms · 0; gzip / 99 · 1.659 ms | `n2-bestand/lh-*.json` |
| Reduzierte Bewegung, Interaktionen (FAQ, Navigation, Menü-Blatt, Ortsprüfung, Composer, Gruppenfilter, Drücken) | erfüllt | 0 Übergänge oder Animationen mit transform unter reduce; nur Deckkraft (150 ms ein, 120 ms aus); Kontrolle no-preference zeigt Bewegung | `n2-bewegung/interaktionen.json`, `n2-bewegung/rest-active.json`, `n2-bewegung/ergebnis.md` |
| Reduzierte Bewegung, Laden und Scrollen | erfüllt | 13 Hauptansichten × 2 Geräte: 0 Animationen mit transform, 0 Sichtbarkeitsprobleme | `n2-bewegung/laden.json` |
| Bewegungscode | erfüllt | reiner Bewegungscode 2.349 B gz (CSS-Anteil 1.313, `abspielen.mjs` 465, `szene.mjs` 571); `tagesband.mjs` ist Anzeige- und Rechenlogik, keine Bewegung; weiches Budget 12 KB und hartes 60 KB eingehalten | `n2-bewegung/rest-groesse.json` |
| Register K-007 | teilweise → behoben | Abweichungen: Menü-Blatt schloss ohne Übergang (M-06), Navigationspfeil schloss in 300 statt 240 ms (M-05), Listen- und Registerzeilen drücken mit Übergang (M-03), Kupferring ohne Deckkraft (M-18), M-20 pausiert während eines Seitenwechsels (nicht im Register) | `n2-bewegung/ergebnis.md` |

Behebungen dazu (Commits `5807770` und `b5a1ebd`, Endstand `b5a1ebd`):
- `menue-blatt.css`: Ausgang 240 ms (reduziert 120 ms Deckkraft) über `display`/`overlay` mit `allow-discrete`, damit das Blatt beim Schließen sichtbar bleibt.
- `hauptnav.css`: Pfeil schließt in `--dur-zustand-aus`.
- KERN K-007: M-03 (Listenzeilen mit Übergang), M-06 (aus), M-18 (Kupferring nur scale), M-20 (Pause während `:active-view-transition`) wie umgesetzt beschrieben.

## 4. Seitenwechsel-Fehler: Ursache, Versuche, Entscheidung (D-E5-03)

**Befund:** Chromium meldete bei etwa jedem sechsten bis achten Seitenwechsel als unbehandelte Ablehnung: „Transition was aborted because of invalid state. ViewTransition opt-in disabled“. Z-02 verlangt 0 Konsolenfehler und erlaubt keine AUSNAHME.

**Diagnose:** Haiku hat mit einer eigenen Probe gemessen (`vt-versuche/vt-probe.mjs`). Ein Init-Skript läuft in jedem neuen Dokument vor allen Seitenskripten und protokolliert:
- `pageswap` und `pagereveal` jeweils mit oder ohne Übergang,
- den Ladezustand und ob das Modul schon lief,
- jede unbehandelte Ablehnung mit dem Dokument, in dem sie entsteht.

Ergebnis:
- In **jedem** fehlerhaften Wechsel deckte das neue Dokument früh auf (76–118 ms, das Modul war noch nicht gelaufen) und hatte dabei schon keinen Übergang mehr.
- Die Ablehnung entstand rund 30 ms später im neuen Dokument.
- In fehlerfreien Wechseln deckte es später auf, mit Übergang.

Chromium legt den Opt-in (`@view-transition`) beim Einfügen von `<body>` fest. Liegen die Stylesheets dann noch nicht vor und folgt vor dem Aufdecken kein weiteres Stil-Update, gilt „kein Opt-in“, und der vorbereitete Übergang wird verworfen.

| Variante | Wechsel mit Fehler | Bemerkung | Beleg (`vt-versuche/`) |
|---|---|---|---|
| X0 Ist-Stand | 12 von 78 (Desktop) | pagereveal ohne Übergang genau in den Fehlerfällen | `X0/*.json` |
| X1 Abnehmer vor allen Seitenskripten (Init-Skript) | 14 von 78 (Desktop), 8 von 30 (mobil) | 0 abgefangen – es gibt beim Aufdecken nichts mehr abzufangen | `X1/*.json` |
| X7 Opt-in zusätzlich in jeder Ansichts-CSS | 16 von 156 | Ladefolge der beiden blockierenden Stylesheets ist nicht die Ursache | `X7/*.json` |
| X9 klassisches Skript nach den Stil-Links | **0 von 78** (Desktop) | jeder Wechsel deckt mit Übergang auf | `X9/*.json` |

X2 (Opt-in außerhalb von `@layer`/`@media`), X4 (Skript vor den Stilen), X6 (ohne Opt-in) und X10 (Modul mit `blocking="render"`) wurden nach der Diagnose abgebrochen, bevor sie Ergebnisse hatten:
- X4 setzt wie X1 zu spät an.
- X6 hieße, M-15 abzuschalten.
- X2 und X10 greifen nicht an der Stelle, an der Chromium den Opt-in festlegt.

**Erste Lösung, Kopf-Skript (X9, Endbau `b5a1ebd`):** Ein klassisches Skript nach den Stil-Links hält den Parser vor `<body>` an.
- Seitenwechsel: 0 von 156.
- Lighthouse rechnete dafür auf 10 von 12 Hauptansichten eine Netzrunde mehr bis zum ersten Inhalt (FCP +150 ms).
- `/preise/` lag bei LCP 2.552 ms, über der Grenze von 2.500 ms (Belege `n4-leistung/`). Die Umstellung der Kopf-Reihenfolge änderte nichts: 2.557 ms (`final2-messung/`).

Diagnose (Lighthouse mobil, `vt-versuche/lcp/`):

| Variante (Grundlage Endbau) | / LCP · FCP | /preise/ LCP · FCP |
|---|---|---|
| VH ohne Kopf-Skript | 2.420 · 1.820 | 2.407 · 1.957 |
| VB Kopf-Skript, ohne Druck- und Kontraststile | 2.409 · 1.959 | 2.405 · 2.105 |
| VF Kopf-Skript, nur Druckstile | 2.404 · 1.806 | 2.410 · 2.110 |
| VM Kopf-Skript, beide Sonderstile in einer Datei (5 Läufe) | 2.405 · 1.955 | 2.406 · 2.105 (2 von 5 Läufen 2.554–2.567) |
| K2 Kopf-Skript, zwei Dateien (5 Läufe) | 2.401 · 1.951 | 2.557 · 2.107 |
| VG Modul mit `blocking="render"`, ohne Kopf-Skript | 2.408 · 1.816 | 2.405 · 1.961 |

Die Sonderstile in `app.css` aufzunehmen ginge nur, wenn das CSS-Budget je Seite reichte; es liegt schon bei 13.666 von 14.336 B gz, und Budgets werden nicht gelockert.

Beobachtete Ladezeiten im echten, gedrosselten Chromium (RTT 150 ms, 1,6 Mbit/s, CPU 4×, kalter Cache, 7 Läufe, `vt-versuche/x10-zeiten/zeiten.json`):

| | FCP / | FCP /preise/ |
|---|---|---|
| ohne Fix | 1.355 ms | 1.373 ms |
| Kopf-Skript | 1.107 ms | 1.086 ms |
| `blocking="render"` | 1.376 ms | 1.461 ms |

Seitenwechsel mit `blocking="render"` (X10): 0 von 156, jedes Aufdecken nach dem Modul (`vt-versuche/x10-zeiten/vt-*.json`).

**Entscheidung (D-E5-03):**
- Das Modul-Skript trägt `blocking="render"`. Es läuft vor der ersten Darstellung und frischt dabei Stil und Opt-in auf.
- Es registriert das Abfangen übersprungener Übergänge rechtzeitig.
- Das Kopf-Skript entfällt. Ohne zusätzliches Asset, CSP unverändert.
- Die Abnahme misst Z-08 mit Lighthouse. Dort besteht nur diese Lösung.

Offen gesagt: Lighthouse modelliert `blocking="render"` an Modulen nicht. Im echten Browser ist diese Lösung 20–90 ms langsamer als ohne Fix, das Kopf-Skript dagegen rund 250 ms schneller. Die Wahl zwischen beiden steht dem Menschen offen (`docs/OFFENE-PUNKTE.md`).

## 5. Endmessung (Endstand `72ed87c`, Modul mit `blocking="render"`, Workflow `e5-endmessung-72ed87c`)

Bau: `node bau/bauen.mjs --messen --pruefen --aus=.cache/e5-final/dist`
- Exit 0, 5.556 Seiten, 11 Prüfer mit 0 Fehlern, 72 bekannte Warnungen (`bau-72ed87c.log`).
- CSS je Seite höchstens 13.666 von 14.336 B gz, größtes JS-Bündel 9.837 von 16.384 B gz.
- Größte Ortsseite 30.390 von 30.720 B.

Drei Haiku-Prüfer haben gemessen, mit der Vorschau auf 4251 (unkomprimiert) und 4254 (gzip). Belege unter `_werkstatt/protokolle/E5-abschluss/n5-bestand/`, `n5-leistung/`, `n5-bewegung/`, Zusammenfassung in `endmessung-72ed87c-ergebnisse.txt`.

| Prüfung | Ergebnis | Messung | Beleg |
|---|---|---|---|
| `npm test` | erfüllt | 331 Tests, 330 bestanden, 0 fehlgeschlagen, 1 todo (NL-PLZ, offene Frage) | `n5-bestand/npm-test.log` |
| Release-Negativtest A | erfüllt | Exit 2: „betrieb.basisUrl ist ein Platzhalter“ | `n5-bestand/release-a.log` |
| Release-Negativtest B (Basis-URL nur in einer Kopie eingetragen) | erfüllt | Exit 1: „Release verweigert: 57 Platzhalter in der Konfiguration“, „92 ungeprüfte Fakten“; Ausgabe nach `.verweigert` verschoben | `n5-bestand/release-b.log` |
| smoke 4251 und 4254, 13 Hauptansichten mobil + desktop | erfüllt | je 26 Läufe: 0 fremde Anfragen, 0 CSP-Verstöße, Konsolenmeldungen nur die gewollte 404 | `n5-bestand/smoke-4251.json`, `smoke-4254.json` |
| **Seitenwechsel ohne Konsolenfehler** | **erfüllt** | 156 von 156 Wechseln (Skript und Links, Desktop und mobil): 0 Fehler, jedes Aufdecken mit Übergang und nach dem Modul | `n5-bestand/vt-*.json` |
| Funktionsliste F01–F20 | erfüllt mit U-6 | 18 erfüllt, F01 und F05 teilweise (Telefonnummer und Preisliste sind Platzhalter); 0 Konsolenfehler, 0 fremde Anfragen | `n5-bestand/funktionen.json` |
| Lighthouse mobil, 12 Hauptansichten | erfüllt | Perf 96–99, A11y 100, BP 100, SEO 100 (außer /suche/ 66, noindex nach D-SEO-03), LCP-Mediane 1.955–2.409 ms (höchster Einzellauf 2.413 ms), CLS 0 | `n5-leistung/lh-a.json` bis `lh-d.json` |
| Lighthouse gzip / | erfüllt | Perf 100, LCP 1.658 ms, CLS 0 | `n5-leistung/lh-gzip.json` |
| / gegenüber E2 | über A-1 | LCP 2.407 ms (Einzel 2.256 / 2.407 / 2.407), Perf 97; E2 2.104 ms, Perf 98 | `n5-leistung/lh-a.json` |
| INP, 6 Aktionsdateien × 2 | erfüllt | max. 64 ms | `n5-leistung/inp-*.json` |
| Beobachtete Ladezeit (Einordnung) | – | FCP / 1.351 ms, /preise/ 1.456 ms (gedrosselt, kalter Cache) | `n5-leistung/zeiten.json` |
| Bewegung, Interaktionen a–g | erfüllt | unter reduce kein transform; Dauern nach K-007 (Menü-Blatt 300/240 ms, reduziert 150/120 ms Deckkraft; Pfeil 300/240 ms; Drücken sofort bzw. Zeilen über feedback); Kontrolle no-preference zeigt Bewegung | `n5-bewegung/interaktionen.json` |
| Bewegung, Laden und Scrollen unter reduce | erfüllt | 26 Läufe: 0 transform-Animationen, 0 unsichtbare Inhalte | `n5-bewegung/laden-*.json` |
| Bildrate (U-3) | erfüllt | M-16 1,7 %, M-17 1,4 %, M-18 2,9 %, M-20 1,7 %, M-21 0,8 % verworfen | `n5-bewegung/bildrate-*.json` |
| Menü-Blatt per Tastatur | erfüllt | Enter öffnet, Fokus auf „Menü schließen“; Escape schließt, Fokus zurück auf den Menü-Knopf | `n5-bewegung/tastatur.json` |
| axe hell und dunkel | erfüllt | 13/13 Seiten 0 Befunde aller Stufen | `n5-bewegung/axe-hell.json`, `axe-dunkel.json` |
| Fokus nie ganz verdeckt | erfüllt | 5 Seiten mobil, 461 Fokusstopps: 0 ganz, 0 teilweise verdeckt | `n5-bewegung/verdeckt-mobil-vorwaerts.json` |
| Überlauf | erfüllt | 143 Messungen (13 Seiten × 11 Varianten), 0 Überlauf | `n5-bewegung/ueberlauf.json` |

Kleine Hinweise der Prüfer, ohne Handlungsbedarf vor dem Abschluss:
- Das offene Menü-Blatt hält den Tab-Fokus nicht in einer Schleife; das ist natives `<dialog>`-Verhalten, der Hintergrund bleibt inert.
- F05 zeigt in Zone D eine leere Postenliste neben „nach Absprache“, wie in der Referenz.
- Werkzeug-Exit 1 bei der gewollten 404 (smoke) und bei /suche/ (SEO, noindex) – inhaltlich kein Befund.

Damit sind alle Befunde der Abschluss-Nachprüfung behoben oder als Umgebungsausnahme bzw. offener Punkt geführt. Die Einstufung je Kriterium steht in `_werkstatt/ABNAHME.md`.

## 6. Nachforderungen des Abschlussprüfers (Durchgang 1) und ihre Erledigung

Urteil des ersten Durchgangs: `_werkstatt/berichte/E5-abschlusspruefer.md`. Nicht bestätigt waren A-1 und Z-09; dazu fehlten die Log-Belege im Repository.

| Nachforderung | Erledigung | Beleg |
|---|---|---|
| Log-Belege ins Repository | 93 `.log`-Dateien gezielt mit `git add -f` aufgenommen (`.gitignore` unverändert) | `582ee31` |
| A-1 Denkprotokoll | D-E5-04 (Ziel, vier Wege, Bewertung, Umkehrprobe, Folgen zweiter Ordnung, frühere Anläufe) | `_werkstatt/ENTSCHEIDUNGEN.md` |
| A-1 Vergleichs- und Ursachenmessung | E2 `7422b0f` frisch gebaut und Endstand unter gleichen Bedingungen, je 5 Läufe in zwei Zeitfenstern: E2 LCP 2.109/2.104 ms, Endstand 2.400/2.407 ms (+291/+303), gzip 1.510/1.508 gegen 1.667 ms; ohne Druck-/Kontraststile 2.257/2.255 ms; ohne JS-Modul 2.410/2.407 ms (kein Einfluss; Widerspruch zu D-JS-01 geklärt, Nachtrag dort) | `a1-vergleich/*.json` |
| Z-09 Zufallsstichprobe am Endstand | Saat 20261026: 30 von 292 übrigen Ansichten (10,3 %) und 20 Ortsseiten (Zonen A–D, NL je 4); Überlauf 11 Varianten hell und dunkel: 1.100 Messungen, 0 Überlauf; smoke 100 Läufe, 0 Befunde | `z09-stichprobe/stichprobe.json`, `ueberlauf-hell.json`, `ueberlauf-dunkel.json`, `smoke.json` |
| Z-09 protokollierte Sichtung | 200 erste Bildschirme (mobil hell, Tablet, Desktop, mobil dunkel) von vier Opus-Sichtprüfern: kein abgeschnittener, überlappender oder unlesbarer Text; kleine Befunde: Kartenlinie berührt Beschriftungen (OFFENE-PUNKTE 46), H1-Umbruch bei „(≈ … km)“ auf dem Tablet (Nr. 47) | `z09-stichprobe/sichtung.md` |
| MENSCHEN §6 Negativtest | berichtigt (A: Basis-URL; B: 57 Platzhalter, 92 ungeprüfte Fakten) | `_werkstatt/MENSCHEN.md` |

Hinweise des Prüfers, ebenfalls erledigt:
- KERN Version 4 mit Verlauf; K-004 nennt die vom Token-Prüfer erlaubten Literale (fr-Anteile, `z-index: -1`, em in Container-Queries).
- Pflichtpakete nachgezählt: 66, nicht 67.
- Wortlaut Z-03, U-4, A-2 berichtigt.
- MENSCHEN §4 nennt das Zusammenführen.

Am Endstand nachgemessen (`_werkstatt/protokolle/E5-abschluss/endstand-nach/`):
- Fokus sichtbar an 2.739 (mobil) bzw. 2.670 (desktop) Stopps, 0 ohne Umriss.
- H2–H4 erfüllt, H5 bis zur Übergabe; H1 und der Anruf im Menü-Blatt brauchen die Telefonnummer (U-6).
- H1 und Anruf im Menü-Blatt mit Testnummer (Ersatz-Proxy vor 4251, `endstand-nach/ersatz/`): Anruf auf 13 von 13 Ansichten erreichbar, Fokus sichtbar (mobil nach 5, Desktop nach 11 Tab-Schritten); im Menü-Blatt nach 12 Tab-Schritten, Fokus sichtbar, Unterkante bei 831 px im Sichtfeld von 844 px. In der früheren Messung (`pruefer-z07-z09`, Stand vor `72ed87c`) lag sie bei 870 px und damit außerhalb; die Ursache wurde nicht untersucht, am Endstand ist der Anruf im Sichtfeld.
- Linkprüfung der Übergabe-Dokumente nach den Änderungen vom 26.10. (`endstand-nach/links/links.json`): 13 Dateien, 15 relative Links 0 tot, 259 Pfadangaben in Backticks alle vorhanden (2 Platzhalter-Muster ausgenommen).
- Token-Stichprobe: 0 unerlaubte Werte in 289 Deklarationen.
- Bewegungscode 2.349 B gz.
- Ähnlichkeit der Ortsseiten: Nachbarpaare Median 0,451, Maximum 0,677.

## 7. Hinweise des Abschlussprüfers (Durchgang 2) und ihre Berichtigung

Urteil des zweiten Durchgangs: `_werkstatt/berichte/E5-abschlusspruefer.md` (alle 18 Zeilen bestätigt, 11 davon mit Hinweis, keine Nachforderung). Die Hinweise betreffen Wortlaut und Randgenauigkeit; sie sind ohne neue Messung an der Website berichtigt. Neu gemessen (Haiku) wurde nur die Zahl zu Weg (a) in D-E5-04, die vorher kein Protokoll hatte.

| Zeile | Hinweis | Berichtigung |
|---|---|---|
| Z-02 | `bau-72ed87c.log` nennt weder Exit-Code noch Commit; `E5-pruefstufe-c.md` gilt für `8db2c56` | ABNAHME nennt beides ausdrücklich (Exit 0 und Commit in §5; Prüfstufe C als abgelöster Stand) |
| Z-03 | Status beschrieb nur die frühere Stichprobe | Status nennt jetzt auch die Endstand-Stichprobe: 171 Token-Verweise, 186 erlaubte Literale, 0 unerlaubte Werte, 5 Grenzfälle nach K-004 |
| Z-05, Z-08 | „≤ 2,9 %“ (Höchstwert 2,94 %); 2,3 KB ohne Übergänge außerhalb `@layer bewegung` | 0,83–2,94 %; Übergänge außerhalb der Ebene nach Näherung rund 0,85 KB gz ergänzt (ABNAHME, BERICHT) |
| Z-07 | „nie verdeckt“ am Endstand nur mobil vorwärts gemessen; frühere Ersatzmessung des Menü-Blatts außerhalb des Sichtfelds | Status nennt Umfang (5 Seiten, 461 Stopps) und den früheren Stand des Desktop-Rückwärtslaufs; Menü-Blatt: am Endstand im Sichtfeld, früher 811–870 px, Ursache nicht untersucht |
| Z-09 | Hauptansichten dunkel nur am layoutgleichen Stand `4898dec`; Sichtung nur erste Bildschirme; Wortlaut „unlesbarer“ | Status nennt beides; Wortlaut nach der Schwelle: kein abgeschnittener Text, kein Text über Text, Kartenlinie berührt lesbare Beschriftungen (OFFENE-PUNKTE 46) |
| Z-10 | BERICHT U-4 „identisch“; BERICHT A-1 nannte die nicht getrennt gemessene Ursache als Tatsache; README ohne Verweis auf `docs/ZUSAMMENFUEHREN.md`; `docs/ENTSCHEIDUNGEN.md` ohne D-E5-02/D-E5-04 | BERICHT U-4 und A-1 berichtigt; README verweist auf ZUSAMMENFUEHREN, ENTSCHEIDUNGEN und ORTE-ABGLEICH; `docs/ENTSCHEIDUNGEN.md` um D-E5-02 und D-E5-04 ergänzt (Datum im Kopf: 25. und 26. Oktober) |
| A-1 | „gleicher Vorschau-Server“, obwohl E2 auf 4281 lief; Herkunft des E2-Baus nur indirekt; 2.384 B gz in Weg (a) ohne Protokoll | gleiches Vorschau-Programm mit Ports je Variante; Herkunft belegt (Haiku): Quelle des E2-Baus in allen 129 Dateien sha256-gleich mit `git archive 7422b0f bau src package.json`, Nachbau mit `node bau/bauen.mjs --messen --datum=2026-10-25` in allen 16 Dateien byte-gleich mit dem gemessenen Bau (`a1-vergleich/herkunft/herkunft.json`; ohne `--datum` weichen 3 Dateien mit Datum ab); Weg (a) gemessen: `app.css` +1.806 B gz, größte Seite 15.472 B, 274 Seiten über 14.336 B (`a1-vergleich/weg-a/weg-a.json`, Methode wie `budgets.mjs`, Gegenprobe mit dessen `pruefe()`) |
| A-2 | Werte gelten für `2a69d96`; PLAN „Offene Punkte“ beschrieb Runde 3 im Futur | Stand in A-2 genannt; PLAN im Perfekt mit den Runde-3-Commits |
| U-1 | „grobes Zeigegerät“ gilt nur für einen Teil der Messungen | ABNAHME und BERICHT trennen: Touch-Emulation bei Tastatur, Seitenwechsel und Lighthouse; smoke, Überlauf und Bildsätze nur Fenstergröße |
| U-2 | Code-Durchsicht ohne eigenes Protokoll | ABNAHME nennt die Fundstellen (`token.css`, `bewegung.css`, `einsatzgebiet.css`) |
| U-4 | BERICHT „identisch“ | wie Z-10 |

