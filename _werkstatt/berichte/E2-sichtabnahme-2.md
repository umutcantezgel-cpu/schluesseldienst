# E2 · Sichtabnahme V01 (Startseite) – Anlauf 2 von 2

KERN v1. Grundlage: 24 Ausschnitte laut Auftrag, 10 Momentbilder M-16, Messung an 127.0.0.1:4173.

## 1. Werte

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 8 | Die H1 in drei gesetzten Zeilen, Mono für Nummern und Quittung, saubere Trennungen; nur die Zeilenköpfe der Preistabelle brechen auf vier Zeilen. |
| Komposition | 7 | Raster und Flächenwechsel stimmen, doch die Hero-Figur steht klein und tief und ragt über die Kante von Kopf und Fuß; Triage und Preistabelle sind unpräzise. |
| Farbe und Bild | 8 | Papier, Lahn und Kupfer sind ruhig und eigenständig, das dunkle Band ist in beiden Themen eigen; Zone B und C sind kaum zu unterscheiden. |
| Bewegung | 8 | M-16 erzählt Ursache und Wirkung (Stifte heben sich, dann zieht sich die Linie), hält ≤ 1.400 ms ein und lässt die H1 still; Bild 01 zeigt ein Doppelbild. |
| Grafik | 7 | Zylinderschnitt, Signet und Quittung sind eigen; Ringtexte liegen unter Punkten, die Leistungsillustration wirkt wie eine vergrößerte Iconreihe. |
| Details | 7 | Die Platzhalter sind sauber; offen bleiben Querscrollen in der Tabelle, ein Knopf ohne Abstand und ungleiche Listenabstände. |
| **Ansichtswert** | **7,5** | (8+7+8+8+7+7)/6 |

## 2. Behoben/offen

| # | Befund Anlauf 1 | Status | Beleg |
|---|---|---|---|
| 1 | Hero-Raster | behoben | H1 bündig mit H2 bei 144 / 27 / 18 px |
| 2 | Leere im Register | behoben | desktop 04: breite Karte, 02–04 darunter |
| 3 | Platzhalteroptik | behoben | einzeilig, kein Rahmen im Rahmen |
| 4 | Ablauf schwimmt | behoben | Texte bündig bei 386 px; mobil mit Linie |
| 5 | Dunkelmodus-Rhythmus | behoben | desktop dark 07: Band im Lahn-Ton |
| 6 | Zwei Kupferlinien | teilweise | doppelte Linie weg; Figur endet bei 1392 statt 1352 px (Neu 1) |
| 7 | Umbrüche | behoben | H1-Zeilen; „–“ und „·“ am Zeilenende |
| 8 | Preis-Hierarchie | behoben | fs-1, Achsenliste, Hinweis tabellenbreit |
| 9 | Karte, Quittung, Zylinder | teilweise | Raster, Legende, Quittungsposten da; Ringtexte verdeckt (Neu 4), Kernstifte ohne Schraffur |
| 10 | Kleinteile | teilweise | Abspielknopf und Fußabstand behoben; Triage-Abstände streuen (Neu 3) |

## 3. Neue Befunde (nach Wirkung)

1. **Hero-Figur ohne Bezug** (`start__desktop__light__01.jpg` und `__dark__01.jpg`, rechts).
   - Was stört: Die Figur misst 576 × 188 px ab y 387. Darüber bleibt alles leer. Sie endet bei 1392 px, Rufknopf und Fußlinie bei 1352 px. Die Scherlinie (y 490) trifft keine Textlinie (P1).
   - Vorschlag (`hero.css`, ab 64em): `.hero-figur { padding-inline-end: var(--rand); align-self: start; margin-block-start: var(--hero-figur-versatz) }`. Den Token in `token.css` aus `--fs-5` und `--lh-display` so berechnen, dass die Scherlinie auf der Grundlinie von „Wir finden die Linie,“ liegt.
   - Wirkung: Text und Linie berühren sich; Komposition +1.
2. **Preistabelle läuft über** (`start__desktop__light__03.jpg`).
   - Was stört: Die Tabelle ist 655 px breit, die Hülle mit `overflow-x: auto` nur 644 px. Es entsteht Querscrollen, „[Zeitraum folgt]“ steht an der Kante.
   - Vorschlag (`preis.css`): `.preis-teilung` ab 64em mit `minmax(0,4fr) minmax(0,8fr)`; `.preis-tabelle :is(th,td) { padding-inline: var(--sp-2xs) }`.
   - Wirkung: kein Scrollbalken, Zeilenköpfe zweizeilig.
3. **Triage-Abstände streuen** (`start__desktop__light__02.jpg`).
   - Was stört: Die Abstände betragen je Spalte 38, 48 und 59 px. `.triage-schritte` füllt die Subgrid-Zeile und streckt ihre Zeilen.
   - Vorschlag (`triage.css`): `.triage-schritte { align-content: start }`.
   - Wirkung: überall der gleiche Takt `--sp-2xs`.
4. **Ringtexte verdeckt, Zone B und C gleich grau** (`start__desktop__light__05.jpg` unten, `__06.jpg` oben).
   - Was stört: Punkte liegen auf „20 km“ und „50 km“, weil `gk-ring-text` in `.gk-ringe` vor `.gk-punkte` steht.
   - Vorschlag:
     - `gebietskarte.mjs`, Z. 49–54: Ringtexte in eine Gruppe nach den Punkten verschieben;
     - `gebiet.css`: Zone B in `--c-tinte-2`, Zone C deutlich kleiner über den neuen Token `--gk-punkt-c` (statt des Literals 3.5), Legende angleichen.
   - Wirkung: lesbar wie ein Plan, Grafik +1.
5. **Knopf ohne Abstand** (`start__mobil__light__04.jpg`: 3 px, desktop 03: 14 px): In `preis.css` `.preis-aussage > p:last-child { margin-block-start: var(--sp-m) }`; die Handlung wird klar abgesetzt.
6. **Leistungsillustration generisch** (`start__desktop__light__04.jpg`, `start__tablet__light__04.jpg`).
   - Was stört: Tür, Auto, Garage und Tresor auf einer Linie zählen nur auf. Das Icon `alarmzentrale` liest sich wie ein Lautsprecher.
   - Vorschlag:
     - `illustrationen/objekte.mjs`: den Schließpunkt jedes Objekts in Kupfer markieren, als aktiven Zustand nach K-008;
     - `icons.mjs`: `alarmzentrale` als Bedienteil mit Tastenfeld neu zeichnen.
   - Wirkung: zeigt, wo es aufgeht.
7. **Doppelbild beim Einlauf** (`moment/*/moment-01.jpg`): Stifte scheinen durch den halbtransparenten Schlüssel. In `bewegung.css`, Z. 35, `m16-schluessel` nur mit `translateX(-40%)`, ohne Deckkraft; das erste Bild wird sauber.
8. **Kleinere Leeren.** Tablet 01: Figur 480 von 714 px, ab 48em `max-inline-size: none` (`hero.css`). Desktop 07: 300 px leer unter der Quittung, Figur `position: sticky` (`checkliste.css`).

## 4. Urteil

**Tor nicht bestanden:** 7,5 < 8, keine Kategorie unter 7. Sieben von zehn Befunden aus Anlauf 1 sind voll behoben. Letzter Anlauf (L3): Die Lücke kommt als offener Punkt in PLAN.md.

Diese fünf Änderungen heben Komposition, Grafik und Details auf je 8 (Ansichtswert 8,0):

1. Hero-Figur an der Kante von Kopf und Fuß ausrichten, Scherlinie auf die Grundlinie der H1 legen (Neu 1).
2. Preistabelle ohne Querscrollen, Teilung 4/8 (Neu 2).
3. In der Triage `align-content: start` setzen und Abstand über dem Preisknopf schaffen (Neu 3 und 5).
4. Karte: Ringtexte über die Punkte legen, Zone B und C unterscheidbar machen (Neu 4).
5. Kupferne Schließpunkte in der Leistungsillustration, `alarmzentrale` neu zeichnen (Neu 6).
