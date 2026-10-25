# E3-GRAF-02 · Rolle Grafiker · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): src/assets/icons/{fenstersicherung,tuerschliesser,kamera,nebel,rauchmelder,bewegungsmelder,sirene,wertschrank,datenschrank}.svg
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E3-GRAF-02/**
Umfang: 9 Icons

## Rollenbriefing Grafiker
Du zeichnest SVG nach einem Formsystem und prüfst es mit Werkzeugen. Häufige Fehler: Detailreichtum statt Lesbarkeit in 20 px; schiefe Winkel; Formen, die über die aktive Fläche ragen; jede Form neu erfunden statt aus der Familie abgeleitet.

## Aufgabe in einem Satz
Zeichne neun Icons für Fenstersicherung, Türschließer, Elektronik und Wertbehältnisse nach den Icon-Regeln.

## Regeln
`_werkstatt/pakete/_icons-regeln.md` vollständig lesen und einhalten. Parallel baut E3-GRAF-01 den Linter `bau/pruefen/icons.mjs`; existiert er bei deiner Schlussprüfung, führe ihn aus, sonst prüfe die Regeln von Hand (Winkel, Fläche 2–22 inklusive Bogenscheitel, keine Béziers) und schreibe das ins Ergebnis.

## Icons
| Name | Motiv (Vorschlag, Komposition darfst du verbessern) |
|---|---|
| fenstersicherung | Fensterrahmen wie das Icon `fenster` (zeichnet GRAF-01: Hochformat 16×20, Radius 1, Mittelpfosten, Griff) – hier zusätzlich unten rechts ein kleines Vorhängeschloss (Bügel als Halbkreisbogen, Körper Rechteck Radius 1) über dem Griff. Rahmen dafür ggf. etwas kleiner, Gesamtform bleibt in 2–22. |
| tuerschliesser | Oberes Türblatt (Rechteck ab halber Höhe nach oben angeschnitten ist erlaubt: Tür von 9 bis 21) und darüber der Schließerkörper (flaches Rechteck, Radius 1) mit Gestängearm: ein 45°-Strich und ein waagerechter Strich zur Zarge. |
| kamera | Überwachungskamera von der Seite: Gehäuse quer (Rechteck Radius 2), vorn Objektiv (kurzer Kreisbogen oder Kreis), darunter Halterung: senkrechter Strich zur Wandplatte (kurzer senkrechter Strich rechts). |
| nebel | Links ein kleiner Gerätekasten mit Düse; nach rechts drei waagerechte Nebelbänder aus aneinandergereihten Kreisbögen (Radius 1 oder 1,5), unterschiedlich lang. |
| rauchmelder | Deckenlinie oben über die volle Breite; daran flacher Melder (Rechteck Radius 2 oder Kreisabschnitt) mit kleinem Punkt (LED, gefüllt); darunter zwei kurze Rauchschwaden aus Kreisbögen. |
| bewegungsmelder | Melder als Halbkreis an einer senkrechten Wandlinie links; nach rechts zwei konzentrische Erfassungsbögen (Abstand ≥ 2) – unterscheidet sich von `alarmzentrale` (Kasten + Wellen). |
| sirene | Außensirene: Gehäuse hochkant (Rechteck Radius 2), oben Blitzleuchte als Halbkreisbogen; drei kurze Strahlen (0°, 45°, 90° bzw. 135°) über der Leuchte. Keine Schallwellen (die gehören zu `alarmzentrale`). |
| wertschrank | Standtresor hochkant (16×20, Radius 1) mit Füßen; Türfuge innen; Handrad (Kreis mit Speichen in 0°/45°/90°) – unterscheidbar von `tresor` (querformatig mit Zahlenknopf). |
| datenschrank | Schrankkörper hochkant mit zwei Schubladen (waagerechte Fugen) und je einem Griff; in der oberen Schublade ein Datenträger-Symbol (kleines Rechteck mit Kerbe/Etikett). |

## Schnellprüfung und Selbstprüfung
- Iconbogen deiner neun (`--namen`) und Gesamtbogen ansehen, mindestens eine Überarbeitungsrunde, Pfade nennen.
- Linter oder Handprüfung ohne Befund an deinen Icons.
- Schreibrechte eingehalten; nichts committet.
