# E3-GRAF-04 · Rolle Grafiker · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): src/assets/icons/{alarmzentrale,entfernung,rechnung,standort,tuer-offen,warnung,zylinder}.svg
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E3-GRAF-04/**
Umfang: 7 vorhandene Icons regelkonform überarbeiten (Linter-Befunde aus E3-GRAF-01)

## Rollenbriefing Grafiker
Du zeichnest SVG nach einem Formsystem und prüfst es mit Werkzeugen. Häufige Fehler: Detailreichtum statt Lesbarkeit in 20 px; schiefe Winkel; Formen, die über die aktive Fläche ragen; die Wiedererkennbarkeit eines bekannten Icons opfern.

## Aufgabe in einem Satz
Bringe sieben vorhandene Icons auf die Regeln des Formsystems, ohne ihre Bedeutung und Wiedererkennbarkeit zu verändern.

## Regeln und Linter
`_werkstatt/pakete/_icons-regeln.md` vollständig lesen. Der Linter existiert: `bau/pruefen/icons.mjs` (Aufruf im Regelblatt). Ziel: 0 Befunde an deinen sieben Icons.

## Befunde und Hinweise
| Icon | Befund | Hinweis |
|---|---|---|
| alarmzentrale | flaeche: Bogen `a6 6 0 0 1 0 10` reicht bis x ≈ 23,2 | z. B. Radius 9,5 oder Wellen enger an den Kasten; Kasten ggf. nach links |
| entfernung | element: `stroke-dasharray` verboten | gestrichelte Strecke als einzelne kurze Segmente zeichnen (mehrere `M…h…`), Abstand ≥ 2 |
| rechnung | winkel: Zackenkante mit 36,9° | Zacken mit dx = dy (45°) |
| standort | winkel 53,9°, raster 6,6/14,1/17,4 | Nadel-Kontur aus Kreisbogen und zwei 45°-Flanken, Koordinaten auf 0,25 |
| tuer-offen | winkel 26,6° (7,3)→(13,6) | geöffnetes Türblatt mit 45°-Kante oder als Rechteck mit Fuge |
| warnung | winkel 60,8° an den Flanken | Warnzeichen als Achteck oder Raute (45°) mit Ausrufezeichen – in 20 px als Warnung lesbar; im Bericht begründen |
| zylinder | raster: 13,33 | Bogen-Endpunkte auf Vielfache von 0,25, Form bleibt Profilzylinder-Schlüsselloch |

## Schnellprüfung und Selbstprüfung
- Vorher alle sieben nach `.cache/E3-GRAF-04/alt/` kopieren; Iconbogen alt und neu (`--namen …`, Port 4193) sowie Gesamtbogen ansehen; mindestens eine Überarbeitungsrunde.
- Linter: 0 Befunde an den sieben.
- Schreibrechte eingehalten; nichts committet.
