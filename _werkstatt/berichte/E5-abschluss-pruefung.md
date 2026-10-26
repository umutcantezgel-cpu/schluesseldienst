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

## 3. Nachprüfung 2 (Stand `e719627`, Workflow `e5-abschluss-nachpruefung-2`)

(wird nach dem Lauf ergänzt)
