# BERICHT

## Kurzfassung für dich

- **Fertig:** Die Website ist gebaut, 5.556 Seiten, davon 5.252 Ortsseiten. Die Bilder findest du in `_werkstatt/bilder/galerie.html` (Galerie) und `_werkstatt/bilder/abschluss/` (510 Abschlussbilder: 13 Pfade × 3 Gerätegrößen × hell/dunkel).
- **Stand der Kriterien:** Acht von zehn sind erfüllt. Zwei haben eine Ausnahme: Die Gestaltung erreicht den Zielwert 8 nicht (Z-04), und die Startseite zeigt ihren Hauptinhalt rund 0,3 Sekunden später als ein früherer Stand (Z-08). Beides ist begründet dokumentiert.
- **Nicht prüfbar hier:** echte Handys, Firefox, Safari und die Bewertung durch Google. Wo Telefonnummer, Preise oder Rechtstexte fehlen, zeigt die Vorschau Platzhalter, und der Release-Bau verweigert die Ausgabe.
- **Was du prüfen oder entscheiden solltest:**
  - Firmendaten, Notruf-Telefonnummer, Zeiten und Preise eintragen (`docs/OFFENE-PUNKTE.md` Nr. 1, 3, 4).
  - Rechtstexte prüfen lassen und die mit „VERIFIZIEREN“ markierten Fakten freigeben (Nr. 11, 12).
  - Den Umgang mit den Wettbewerber-Rohdaten im Git-Verlauf klären (Nr. 24).
  - Beim Seitenwechsel entscheiden, ob das Kopf-Skript oder `blocking="render"` gilt (Nr. 45).
- **Keine Veröffentlichung:** Es gab weder ein Deploy noch einen Push auf `main`.

## Abschlussbericht

Stand: Endstand `72ed87c` (Endmessung), Arbeitsbranch `claude/bold-noether-fk2n4f`. Seit `72ed87c` hat sich unter `src/`, `bau/`, `test/` und `pipeline/` nichts geändert; die späteren Commits betreffen nur Dokumentation und Messbelege (`_werkstatt/`, `docs/`, `README.md`, `CLAUDE.md`).

### Ergebnis in Zahlen

- **Seiten:** 5.556 im Messbau, davon 5.252 Ortsseiten. 314 unklare Orte sind nicht veröffentlicht.
- **Pakete:** Pflichtpakete 66 von 66 erledigt und abgenommen (nachgezählt; PLAN.md nannte zuvor 67), Kür 8 von 8.
- **Prüfer:** 11 Build-Prüfer ohne Fehler, 72 bekannte Warnungen (Titellänge auf Ortsseiten, D-SEO-04).
- **Tests:** 331 Tests, 330 bestanden, 0 fehlgeschlagen, 1 als offen markiert (Postleitzahl NL, offene Frage).
- **Budgets (Endmessung):** CSS je Seite höchstens 13.666 von 14.336 B gzip; größtes JavaScript-Bündel 9.837 von 16.384 B gzip; größte Ortsseite 30.390 von 30.720 B; Bewegungscode je Seite einschließlich Ansichts-Stilen höchstens 2,0 KB gzip, mit Übergängen nach einer Näherung 2,6 KB (weiches Budget 12 KB, hartes 60 KB).
- **Messwerte (Endmessung):** Mobile Ladezeit-Messung auf 12 Hauptansichten, Median aus drei Läufen: Leistung 96 bis 99, Barrierefreiheit und Best Practices 100, SEO 100 außer `/suche/` (66, bewusst nicht indexierbar). LCP-Mediane 1.955 bis 2.409 ms, CLS 0. Startseite komprimiert: Leistung 100, LCP 1.658 ms. INP höchstens 64 ms (Grenze 200 ms).

### Kriterien Z-01 bis Z-10

| Kriterium | Status | Beleg |
|---|---|---|
| Z-01 Plan | erfüllt | `_werkstatt/PLAN.md` (Spalte Commit) |
| Z-02 Bestand | erfüllt | `_werkstatt/berichte/E5-abschluss-pruefung.md` §5, `_werkstatt/protokolle/E5-abschluss/n5-bestand/` |
| Z-03 Designsystem | erfüllt | `_werkstatt/protokolle/E5-abschluss/bau-72ed87c.log`, `endstand-nach/token-stichprobe.json`, früher `z-pruefer/css-stichprobe.txt` |
| Z-04 Gestaltung | AUSNAHME A-2 | `_werkstatt/berichte/E5-endpruefung.md` |
| Z-05 Bewegung | erfüllt | `_werkstatt/protokolle/E5-abschluss/n5-bewegung/`, `_werkstatt/KERN.md` (K-007) |
| Z-06 Grafik | erfüllt | `_werkstatt/protokolle/E5-abschluss/z-pruefer/svg-ids.json` |
| Z-07 Zugänglichkeit | erfüllt mit U-6-Ersatz | `_werkstatt/protokolle/E5-abschluss/n5-bewegung/`, `endstand-nach/` (mit `ersatz/`), früher `pruefer-z07-z09/` |
| Z-08 Leistung | erfüllt mit AUSNAHME A-1 | `_werkstatt/protokolle/E5-abschluss/n5-leistung/` |
| Z-09 Darstellung | erfüllt | `_werkstatt/protokolle/E5-abschluss/z09-stichprobe/` (Zufallsstichprobe 50 Seiten, Sichtung), `n5-bewegung/ueberlauf.json`, dunkel `pruefer-z07-z09/ueberlauf-dunkel.json` (Stand `4898dec`), `_werkstatt/bilder/abschluss/index.json` |
| Z-10 Übergabe | erfüllt – siehe dieser Bericht, docs/, README, MENSCHEN.md | `_werkstatt/BERICHT.md`, `docs/ZUSAMMENFUEHREN.md` |

### Umgebungsausnahmen U-1 bis U-6

- **U-1 Echte Geräte:** Ersatz ist die Chromium-Emulation mit 390 × 844 Pixeln. Touch emulieren zusätzlich die Fokusprotokolle, die Seitenwechsel-Probe und Lighthouse; die übrigen Läufe (u. a. smoke, Überlauf, Bildsätze, axe, Bewegung, Verdeckung) nur die Fenstergröße.
- **U-2 Firefox und Safari:** Nur Chromium ist installiert. Funktionen mit Rückfall gebaut, geprüft mit Chromium und durch Code-Durchsicht.
- **U-3 Bildrate mit GPU:** Ersatz ist die Messung mit vierfach gedrosselter CPU. Verworfene Bilder 0,83 bis 2,94 % (Grenze 5 %).
- **U-4 Live-Header beim Hoster:** Kein Deploy. Die Header des Vorschau-Servers stammen aus derselben Quelle wie `_headers`, `.htaccess` und nginx (`kopfzeilen()`); nur HSTS lässt der Vorschau-Server bewusst weg, weil er über http läuft. Die Live-Prüfung `_werkstatt/werkzeuge/live-check.mjs` führt der Betrieb nach dem Deploy aus.
- **U-5 Wirkung in Google:** Keine Veröffentlichung. Ersatz sind Ähnlichkeitsmessung, Linkgraph und ehrliche Zonentexte.
- **U-6 Konfigurationslücken:** Name, Telefon, Preise, Rechtsdaten und ungeprüfte Fakten fehlen. Die Vorschau zeigt sichtbare Platzhalter; der Anruf wurde nur mit Testnummer in einer lokalen Kopie geprüft; die Release-Sperre ist als Negativtest belegt.

### Ausnahmen A-1 und A-2

**A-1 · Z-08 Ladezeit.** Unter gleichen Bedingungen gemessen (E2-Commit frisch gebaut, je 5 Läufe in zwei Zeitfenstern) erreicht die Startseite ihren größten Inhalt nach 2.400–2.407 ms statt 2.104–2.109 ms (mit gzip wie beim Hoster 1.667 statt 1.508–1.510 ms); die Grenzen (LCP ≤ 2.500 ms, Leistung ≥ 95, CLS ≤ 0,1) sind auf allen Hauptansichten eingehalten. Rund 150 ms kosten die eigenen Dateien für Druck und erzwungene Farben (gemessen). Die übrigen rund 150 ms entstehen bis zum ersten Inhalt; naheliegend ist die zweite renderblockierende Stildatei je Ansicht, getrennt gemessen ist das nicht. Beide zurückzunehmen hieße, das CSS-Budget zu sprengen oder Druck und Kontrastdesign von JavaScript abhängig zu machen (Denkprotokoll D-E5-04).

**A-2 · Z-04 Gestaltung.** Der Ansichtswert 8 wurde nach zwei Anläufen nicht erreicht (Anlauf 1: 6,50 bis 7,67, Anlauf 2: 6,33 bis 7,50). Der Blindvergleich ist erfüllt (siehe Gestaltung). Ein dritter Anlauf widersprach der Regel von höchstens zwei Anläufen je Tor; die Befunde aus Anlauf 2 wurden als zweite Paketrunde umgesetzt, nicht erneut bewertet, und die Restpunkte sind offen.

### Gestaltung

- **Blindvergleich:** 24 von 24 Paaren zogen den neuen Stand vor (je Anlauf 12 von 12; in Anlauf 2 elfmal „sehr klar“, einmal „klar“). Die Vorbilder waren maskiert, die Reihenfolge zufällig, der Schlüssel wurde erst nach dem Urteil zugeordnet. Geprüft wurden V01, V03, V04 und V07.
- **Ansichtswert:** Mittel aus sechs Kategorien nach der Rubrik aus AUFTRAG Abschnitt 9. Anlauf 1 nutzte eine mildere Skala, die Anläufe sind deshalb nur eingeschränkt vergleichbar. Bei Anlauf 2 lag in sieben Ansichten eine Kategorie unter 7 (V12 mit Impressum und 404 als eine Ansicht gezählt).
- **Runde 3:** Umgesetzt wurden Befunde zu Kopf, Fuß, Karten, Ratgebern, Ortsseiten und Hubs. Dafür gab es keine neue formale Bewertung. Restpunkte stehen in `docs/OFFENE-PUNKTE.md` Nr. 36 bis 39; Nr. 40 führt die Ausnahme A-2.

### Sicherheit

- **Richtlinie (CSP):** Ein Ort für alle Header (`src/konfig/sicherheit.mjs`): `default-src 'none'`, Skripte nur von der eigenen Domain, `require-trusted-types-for 'script'` mit `trusted-types 'none'`, `object-src 'none'`, `frame-ancestors 'none'`, Formulare nur an `mailto:`.
- **Keine Drittanbieter:** Die Messung zählt 0 externe Anfragen. Die Smoke-Läufe (je 26 auf den Vorschau-Servern 4251 unkomprimiert und 4254 gzip) melden 0 CSP-Verstöße.
- **Prüfer:** Der Sicherheits-Prüfer (`bau/pruefen/sicherheit.mjs`, Regeln S01 bis S21; die im Entwurf als S16 geführte Gleichheit der Header-Dateien prüfen die Unit-Tests in `test/redirect.test.mjs`) prüft die Richtlinie in jeder Seite. Die Prüfer sind mit schlechten Testseiten kalibriert (Negativtests in `test/`).

### Abschluss-Nachprüfung und Seitenwechsel-Fehler

Die Abschluss-Nachprüfung lief in zwei Durchgängen mit Haiku-Prüfern; die Protokolle liegen unter `_werkstatt/protokolle/E5-abschluss/`. Der erste Durchgang fand Lücken bei Seitenwechsel, reduzierter Bewegung und im Register K-007 sowie einen ungenauen Wortlaut zu A-1. Die Behebungen stehen in den Commits `e719627`, `5807770` und `b5a1ebd`. Die Endmessung auf `72ed87c` ist grün.

- **Befund:** Bei etwa jedem sechsten bis achten Seitenwechsel meldete Chromium „Transition was aborted because of invalid state. ViewTransition opt-in disabled“ als Fehler. Z-02 verlangt null Konsolenfehler und erlaubt dafür keine Ausnahme. Ein erster Fix, der die Ablehnungen abfing, wirkte nicht.
- **Ursache:** Chromium legt die Freigabe des Übergangs beim Einfügen von `<body>` fest. Liegen die Stylesheets dann noch nicht vor, verwirft der Browser den vorbereiteten Übergang. Die Versuche zeigten 12 von 78 Wechseln mit Fehler im Ist-Stand.
- **Lösung (D-E5-03):** Das Modul-Skript trägt `blocking="render"`. Ergebnis: 0 von 156 Wechseln mit Fehler, ohne zusätzliche Datei, die CSP unverändert. Lighthouse bildet diese Angabe an Modulen nicht ab; im gedrosselten Browser ist die Lösung 20 bis 90 ms langsamer als ganz ohne Fix.
- **Offene Wahl (OFFENE-PUNKTE Nr. 45):** Ein klassisches Kopf-Skript (Commit `5807770`) wäre im gedrosselten Browser rund 250 ms schneller (FCP 1.107 statt 1.376 ms), verfehlt in der Simulation aber die Grenze von 2.500 ms auf `/preise/` (2.552 bis 2.557 ms). Die Umstellung übernimmt Kopf-Skript und Einbindung aus `5807770` und entfernt `blocking="render"`.

### Galerie und Bildsätze

- `_werkstatt/bilder/galerie.html`: Galerie mit 1.372 Bildern in zehn Abschnitten (E2 bis E5, Abschluss, Morgenstand).
- `_werkstatt/bilder/abschluss/`: 510 Bilder in 78 Varianten (13 Pfade × 3 Gerätegrößen × hell/dunkel); das Verzeichnis liegt in `index.json`.
- Die Vorher-Nachher-Galerie zeigt den eigenen Stand von E2 bis zum Abschluss. Die Vorher-Bilder der Wettbewerber (97 JPEG unter `.cache/vorher/bilder/`) bleiben nach dem genehmigten Plan außerhalb des öffentlichen Repositorys; die Galerie sagt das, die Kennzahlen stehen in `_werkstatt/berichte/E0-vorher-kennzahlen.md`.

### Offene Punkte

Die vollständige Liste mit Zuständigkeiten steht in `docs/OFFENE-PUNKTE.md` (Nr. 1 bis 47). Der Build zählt 58 Platzhalter in der Konfiguration, 65 auf den Seiten und 92 ungeprüfte Fakten. Die wichtigsten fünf:

1. **Nr. 1 Betrieb:** Firmenname, Rechtsform, Inhaber, Anschrift, Notruf-Telefon und E-Mail (blockiert den Release).
2. **Nr. 4 Preise:** Gesamtpreise je Zone, Zuschläge, Umsatzsteuer-Modus, Zahlarten (blockiert den Release).
3. **Nr. 11 Rechtsseiten:** Impressum, Datenschutz, Widerruf und Barrierefreiheit sind Entwürfe und brauchen eine juristische Prüfung.
4. **Nr. 12 Fakten:** 92 ungeprüfte Fakten gegen Primärquellen prüfen und freigeben.
5. **Nr. 24 Repository:** Das öffentliche Repository enthält die Wettbewerber-Rohdaten im Verlauf; die Entscheidung liegt beim Betrieb und blockiert den Release nicht.

### Übergabe

Die Anleitung in `docs/ZUSAMMENFUEHREN.md` beschreibt nur; ausgeführt ist nichts davon.

- **Zusammenführen:** Pull Request von `claude/bold-noether-fk2n4f` nach `main`. Vorher `npm test` und `npm run pruefen`. Die Merge-Art bestimmt das Zurückrollen: Merge-Commit mit `git revert -m 1`, Squash-Merge ohne `-m 1`.
- **Zurückrollen:** Ein Revert nimmt die Änderungen zurück und schreibt die Historie nicht um.
- **`_werkstatt/`:** Entfernen oder bewusst behalten. Beim Entfernen werden Verweise in README und `docs/` tot; die Befehle für OG-Bilder und Live-Prüfung brauchen `_werkstatt/werkzeuge/`.
- **Historie:** Die Wettbewerber-Exporte liegen seit `ad81157` im Verlauf. Eine Bereinigung ändert diesen Commit und bricht `npm test`, `npm run orte` und `pipeline/fingerabdruck.mjs`.
- **Kein Deploy:** Der Standardbau erzeugt nur eine Vorschau mit noindex. Ein Release braucht die Basis-URL und alle Punkte mit „Blockiert Release: ja“ aus `docs/OFFENE-PUNKTE.md` sowie die [RELEASE]-Punkte aus `_werkstatt/MENSCHEN.md`. Die Wahl zum Seitenwechsel (Nr. 45) ist eine Empfehlung, kein Blocker.
- **Abschluss:** Der Abschnitt „Werkstatt-Lauf“ ist aus `CLAUDE.md` entfernt; die Datei bestand nur daraus und ist gelöscht (ZUSAMMENFUEHREN, Abschnitt 7). Ein frischer Opus-Prüfer hat jedes Kriterium, jede AUSNAHME und jede UMGEBUNGSAUSNAHME gegen ihre Belege geprüft; Durchgang 2 bestätigt alle 18 Zeilen ohne Nachforderung (`_werkstatt/berichte/E5-abschlusspruefer.md`).

## Morgenbericht 26. Oktober 2026 (Stand 06:06 Uhr, überholt)
_Unverändert aufbewahrt; Zahlen und Aussagen gelten für den Stand 06:06 Uhr (damals 319 bestandene Tests und 1 todo; Fokus nie ganz verdeckt). Maßgeblich ist der Abschlussbericht oben._
- **Fertig:** Die Website steht komplett: 5.556 Seiten, darunter 5.252 Ortsseiten, 27 Leistungsseiten, 19 Ratgeber und alle Rechtsseiten als Entwurf. Bilder vom Stand der letzten Prüfung: `_werkstatt/bilder/morgen-2026-10-26/` (Startseite hell auf Desktop und Handy, Preise, Ortsseite Löhnberg, Karte des Einsatzgebiets, Über uns).
- **Prüfungen:** 320 automatische Tests und alle elf Prüfprogramme sind grün. Barrierefreiheit ohne Fehler, kein Layout läuft über, Ladezeiten im Ziel. Der Tastaturfokus verschwindet nie mehr hinter der Anrufleiste.
- **Vergleich mit den beiden Vorbildern:** Zwei unabhängige Prüfer haben jeweils zwölf anonymisierte Bildpaare verglichen. Alle 24 Urteile fielen für die neue Seite aus, fast alle „sehr klar“.
- **Gestaltungsnote:** Das Ziel „mindestens 8 von 10 je Seite“ ist nach den zwei erlaubten Versuchen nicht erreicht (zuletzt 6,3 bis 7,5 bei strenger Bewertung). Ich habe das ehrlich als zweite Ausnahme eingetragen, mit Begründung in `_werkstatt/ENTSCHEIDUNGEN.md` (D-E5-02). Mehr Ausnahmen erlaubt der Auftrag nicht.
- **Läuft gerade:** Die Hinweise der letzten Prüfer setze ich in einer letzten Runde je Seite um. Ein Nutzungslimit hatte sie nachts unterbrochen, sie ist neu gestartet.
- **Danach:** Abschlussbilder, Bericht mit Galerie, Prüfung aller Belege durch einen unabhängigen Prüfer, dann Abschluss auf dem Branch `claude/bold-noether-fk2n4f`. Es gibt keine Veröffentlichung.
- **Was du prüfen oder entscheiden solltest:**
  - Firmendaten, Telefonnummer, Preise und Zeiten eintragen (`docs/BETRIEB.md`).
  - Die Rechtstexte prüfen lassen.
  - Die mit „VERIFIZIEREN“ markierten Fakten freigeben.
  - Den Umgang mit den Wettbewerber-Rohdaten im Git-Verlauf klären (`docs/ZUSAMMENFUEHREN.md`, Abschnitt 5).
  - Die vollständige Liste steht in `docs/OFFENE-PUNKTE.md`.
