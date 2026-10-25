# E3-GRAF-03 · Rolle Grafiker · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): src/assets/icons/{waffenschrank,telefon,telefon-nacht,rueckruf,sonne,zahlung-karte,bar,extern,drucken}.svg
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E3-GRAF-03/**
Umfang: 8 neue Icons + 1 Neuzeichnung (telefon)

## Rollenbriefing Grafiker
Du zeichnest SVG nach einem Formsystem und prüfst es mit Werkzeugen. Häufige Fehler: Detailreichtum statt Lesbarkeit in 20 px; schiefe Winkel; Formen, die über die aktive Fläche ragen; jede Form neu erfunden statt aus der Familie abgeleitet.

## Aufgabe in einem Satz
Zeichne die Hörer-Familie (telefon neu, telefon-nacht, rueckruf) regelkonform sowie Waffenschrank, Sonne, Zahlung und Oberflächen-Icons.

## Regeln
`_werkstatt/pakete/_icons-regeln.md` vollständig lesen und einhalten. Parallel baut E3-GRAF-01 den Linter `bau/pruefen/icons.mjs`; existiert er bei deiner Schlussprüfung, führe ihn aus, sonst prüfe die Regeln von Hand (Winkel, Fläche 2–22 inklusive Bogenscheitel, keine Béziers) und schreibe das ins Ergebnis.

## Icons
| Name | Motiv (Vorschlag, Komposition darfst du verbessern) |
|---|---|
| telefon | **Neuzeichnung** des vorhandenen Hörers (`telefon.svg` hat Segmente mit freien Winkeln): Hörer als Bogen von unten links nach oben rechts mit zwei Muscheln, nur aus 0°/45°/90°-Segmenten und Kreisbögen. Er ist das wichtigste Icon der Seite (Rufknopf): in 20 px sofort als Telefon erkennbar. Vor dem Überschreiben die alte Datei nach `.cache/E3-GRAF-03/telefon-alt.svg` sichern und beide im Bericht vergleichen. |
| telefon-nacht | Der neue Hörer etwas kleiner nach unten links gerückt, oben rechts eine Mondsichel (zwei Kreisbögen) – Familienähnlichkeit zu `mond.svg`. |
| rueckruf | Der neue Hörer, oben rechts ein Rückpfeil (Bogen mit Pfeilspitze aus zwei 45°-Strichen), der zum Hörer zurückzeigt. |
| waffenschrank | Hoher, schmaler Schrank (hoch 16×20 oder schmaler), Tür mit Fuge, oben ein abgeteiltes Fach (waagerechte Linie), unten drei kurze senkrechte Halter nebeneinander – keine Waffe zeichnen. |
| sonne | Kreis r = 4 in der Mitte, acht Strahlen (0°/45°/90°) mit gleichem Abstand zum Kreis; Gegenstück zu `mond.svg`. |
| zahlung-karte | Karte quer 20×14 (Radius 2), Magnetstreifen als waagerechte Linie, kleiner Chip (Rechteck Radius 1) links. Kein Markenlogo. |
| bar | Banknote quer (Radius 1) mit Kreis in der Mitte und davor/darunter eine Münze (Kreis) – Geldschein und Münze, kein Währungszeichen. |
| extern | Quadrat 14 mit offener Ecke oben rechts, daraus ein Pfeil 45° nach oben rechts mit Spitze aus zwei Strichen (0° und 90°). |
| drucken | Druckerkörper quer (Radius 2), oben einliegendes Blatt, unten ausgegebenes Blatt, das über den Körper ragt; kleiner Punkt als Leuchte. |

## Schnellprüfung und Selbstprüfung
- Iconbogen deiner neun (`--namen`) und Gesamtbogen ansehen, mindestens eine Überarbeitungsrunde, Pfade nennen; Vergleich alt/neu für `telefon`.
- Linter oder Handprüfung ohne Befund an deinen Icons.
- Schreibrechte eingehalten; nichts committet.
