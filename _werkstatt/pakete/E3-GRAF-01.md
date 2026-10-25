# E3-GRAF-01 · Rolle Grafiker · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): bau/pruefen/icons.mjs, test/icons.test.mjs, src/assets/icons/{einsteckschloss,kastenschloss,schliessanlage,schliessblech,querriegel,pilzkopf,bandsicherung,fenster}.svg
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E3-GRAF-01/**
Umfang: 1 Prüfer + 1 Testdatei + 8 Icons

## Rollenbriefing Grafiker
Du zeichnest SVG nach einem Formsystem und prüfst es mit Werkzeugen. Häufige Fehler: Detailreichtum statt Lesbarkeit in 20 px; schiefe Winkel; Formen, die über die aktive Fläche ragen; jede Form neu erfunden statt aus der Familie abgeleitet.

## Aufgabe in einem Satz
Baue den Geometrie-Linter für Icons und zeichne die acht Mechanik-Icons aus der Liste.

## Teil A – Linter `bau/pruefen/icons.mjs`
Schnittstelle wie die anderen Prüfer (Muster: `bau/pruefen/emoji.mjs`, `bau/pruefen/index.mjs`): `export const name = 'icons'; export async function pruefe(ctx)` → `[{ regel, schwere, datei, meldung }]`, liest `ctx.wurzel + '/src/assets/icons/*.svg'` (nicht dist). Zusätzlich `export function pruefeIcon(name, svgText)` → Befunde für ein Icon (für Tests). Vertrag: `import { VERTRAG } from '../../src/konfig/icon-vertrag.mjs'`. Keine Abhängigkeiten, nur `node:`-Module.
Regeln (Regel-ID `icons/<kürzel>`):
| Kürzel | Prüfung | Schwere |
|---|---|---|
| datei | genau ein `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">`, keine weiteren svg-Attribute; Name im VERTRAG | fehler |
| element | nur path/circle/rect/line/polyline; Attribute nur Geometrie (d, cx, cy, r, x, y, width, height, rx, ry, x1, y1, x2, y2, points) + `fill="currentColor"` nur auf circle mit r ≤ 1 | fehler |
| bezier | Pfadbefehle C/c/S/s/Q/q/T/t | fehler |
| flaeche | ein Punkt außerhalb [2, 22] (Toleranz 0,01) – Pfade vollständig auswerten (relative Befehle, H/V, Z), Kreise als Mittelpunkt ± r, Rechtecke als Ecken, **Bögen**: Mittelpunktsdarstellung nach SVG 1.1 Anhang F.6.5 berechnen und 32 Punkte entlang des Bogens prüfen | fehler |
| winkel | gerades Segment (L/H/V/Z, line, polyline, Rechteckkanten trivial) nicht 0°/45°/90° (Toleranz 0,01 auf |dx|−|dy|) | fehler |
| bogen | rx ≠ ry, oder Radius kein Vielfaches von 0,5; Kreis-r kein Vielfaches von 0,25 | fehler |
| raster | Koordinate kein Vielfaches von 0,25 | warnung |
| groesse | Datei > 1.024 Byte | warnung |
| vollstaendig | Vertragsname ohne Datei: im Modus `release` fehler, sonst ein Sammel-Befund `warnung` mit Liste | siehe links |
Außerdem ein `info`-Befund mit Anzahl geprüfter Icons.
Tests `test/icons.test.mjs` (node:test, Muster `test/emoji.test.mjs` falls vorhanden, sonst `test/token.test.mjs`): je Regel mindestens ein Fixture-String, der rot wird, und ein gutes Icon, das grün bleibt; ein Test für den Bogen-Scheitel (z. B. `M20.5 7a6 6 0 0 1 0 10` muss `flaeche` melden); ein Test, dass alle vorhandenen Dateien eingelesen werden. Fixtures als Strings im Test, keine neuen Dateien.
Hinweis: Einige der 31 vorhandenen Icons verletzen vermutlich Regeln (z. B. `alarmzentrale`, `telefon`). Ändere sie NICHT – liste alle Befunde an fremden Icons unter GEMEINSAME DATEIEN.

## Teil B – acht Icons (Regeln: `_werkstatt/pakete/_icons-regeln.md` lesen)
| Name | Motiv (Vorschlag, Komposition darfst du verbessern) |
|---|---|
| einsteckschloss | Einsteckschloss von der Seite: senkrechter Stulp links (volle Höhe der Form), rechts daran der Schlosskasten (Rechteck, Radius 1); aus dem Stulp ragen oben die Falle (mit 45°-Schräge) und darunter der Riegel (Rechteck) nach links; im Kasten das Zylinderloch (Kreis). |
| kastenschloss | Kastenzusatzschloss von vorn: querliegender Kasten links (Radius 2) mit Knauf (Kreis), rechts mit Abstand der Schließkasten; der Riegel verbindet beide als waagerechter Strich. |
| schliessanlage | Ein Schlüssel quer unten; darüber drei kleine, gleich große Türen nebeneinander; je eine kurze senkrechte Linie von jeder Tür zum Schlüssel (Prinzip „ein Schlüssel – mehrere Türen“). |
| schliessblech | Hochformatiges Schließblech mit Radius 2, oben und unten je eine Schraube (Kreis r ≤ 1, gefüllt erlaubt), dazwischen zwei rechteckige Aussparungen (Falle, Riegel). |
| querriegel | Tür (Rechteck wie `tuer.svg` ohne Boden) mit einem Querbalken über die ganze aktive Breite in halber Höhe; in der Mitte ein Schloss (Kreis); an beiden Enden kurze senkrechte Halter. |
| pilzkopf | Pilzkopfzapfen im Schnitt: Schaft senkrecht, oben ein Pilzkopf (Halbkreisbogen), der von einem hakenförmigen Schließstück (Winkel aus 90°-Linien) umgriffen wird. |
| bandsicherung | Türkante (senkrechte Linie) und Zarge (parallele senkrechte Linie, Abstand ≥ 3); oben ein Band (Scharnier, kleines gerundetes Rechteck über beide Linien); unten ein Sicherungsbolzen (Rechteck) quer durch den Spalt. |
| fenster | Fensterrahmen (Hochformat 16×20 oder Quadrat 18, Radius 1), senkrechter Mittelpfosten oder Kämpfer, rechts ein Griff (kurzer senkrechter Strich mit Punkt); passt neben `tuer.svg`. |

## Schnellprüfung und Selbstprüfung
- `node --check bau/pruefen/icons.mjs`; `node --test test/icons.test.mjs` grün; `npm test` gesamt grün.
- Linter über alle Icons: deine acht ohne Befund.
- Iconbogen (eigene acht + Gesamtbogen) angesehen und nachgebessert; Pfade nennen.
- `node bau/bauen.mjs --messen --pruefen --aus=.cache/E3-GRAF-01/dist` läuft (der neue Prüfer erscheint in der Liste).
- Schreibrechte eingehalten; nichts committet.
