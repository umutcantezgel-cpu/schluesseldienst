# Ortsdaten: wie sie entstehen und wie Sie sie pflegen

Dieses Dokument beschreibt, woher die Ortsliste der Website stammt, wie die Pipeline sie erzeugt und wie Sie einzelne Orte korrigieren. Das Ergebnis liegt in `src/daten/orte.json`: Jeder Eintrag ist ein Ort mit Adresse (Slug), Gemeinde, Kreis, Entfernung, Zone und Nachbarorten.

## Zweck

Jeder Ort im Einsatzgebiet bekommt eine eigene Seite. Die Ortsnamen zweier Wettbewerber dienen nur als Auswahl, welche Orte es gibt. Alle Angaben zu einem Ort (Schreibweise, Lage, Gemeinde, Kreis, Land, Postleitzahlen) stammen aus GeoNames. Der letzte Lauf ergab 5.252 Orte: Zone A 244, Zone B 795, Zone C 998, Zone D 3.168 und Niederlande 47.

## Quellen

- **Ortsnamen der Wettbewerber.** Die beiden Ortslisten liegen im ersten Commit des Repositorys (`ad81157`). Das Kürzel `R` steht für Richter, `A` für Adam; diese Kürzel stehen auch in den Schlüsseln der Dateien. Es gibt 5.840 Quelldatensätze: 5.308 aus R und 532 aus A. Übernommen werden nur Namen, keine Texte oder Bilder (Entscheidung D-001 in [ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md)).
- **Ortsfakten aus GeoNames.** Die Archive für Deutschland und die Niederlande, die Verwaltungscodes und die PLZ-Dateien kommen von `download.geonames.org`. Sie stehen unter der Lizenz CC BY 4.0. Die Seite „Quellen und Lizenzen“ nennt GeoNames als Quelle und vermerkt: „Die Ortsdaten sind verändert. Entfernungen und Zonen ab Weilburg sind eigene Berechnungen.“ (`src/inhalte/recht/quellen-lizenzen.mjs`).
- **Offen:** Das Faktenblatt zur Lizenz ist noch nicht freigegeben, und die Lizenzversion ist nicht bestätigt ([OFFENE-PUNKTE.md](OFFENE-PUNKTE.md), Nr. 19).
- **Prüfsummen.** `pipeline/orte/quellen.lock.json` hält die SHA-256-Summen der sechs heruntergeladenen Dateien fest.

## Pipeline und Befehle

Der ganze Lauf startet mit:

```sh
npm run orte
```

Das führt `node pipeline/orte/alle.mjs` aus. Die Stufen laufen nacheinander und brechen beim ersten Fehler ab. Ohne Herunterladen dauerte der letzte Lauf rund sechs Sekunden (`.cache/orte/laufzeiten.json`).

Voraussetzungen: Node 22, ein Git-Checkout mit vollständiger Historie (Stufe 10 liest den Commit `ad81157`) und beim ersten Lauf Netzzugang für Stufe 00. Die Kopfzeile von Stufe 00 nennt `NODE_USE_ENV_PROXY=1`; das brauchen Sie nur, wenn die Verbindung über einen Proxy läuft.

| Stufe | Datei | Was sie tut | Ausgabe |
|---|---|---|---|
| 00 | `00-laden.mjs` | Lädt die GeoNames-Archive und prüft jede Datei gegen `quellen.lock.json`. Fehlt eine gelockte Datei oder weicht ihre Prüfsumme ab, bricht die Stufe ab. | `.cache/geonames/` |
| 10 | `10-quellen.mjs` | Liest die beiden Ortslisten aus dem Commit `ad81157`. | `.cache/orte/quellen.json` |
| 20 | `20-index.mjs` | Baut den Gazetteer (alle GeoNames-Orte), den PLZ-Index und die Verwaltungsnamen. | `.cache/orte/gazetteer.json`, `plz.json`, `verwaltung.json` |
| 30 | `30-abgleich.mjs` | Ordnet die Quelldatensätze GeoNames-Orten zu (Regeln unten). Unklare Fälle werden gelistet, nicht geraten. | `.cache/orte/abgleich.json`, `src/daten/orte-unklar.json`, Bericht |
| 40 | `40-umkreis.mjs` | Ergänzt Orte im Umkreis von 30 km um Weilburg, die keine Quelle nennt. | `.cache/orte/umkreis.json`, `src/daten/orte-pruefliste.json` |
| 50 | `50-anreichern.mjs` | Säubert Namen, bestimmt Typ (Gemeinde oder Ortsteil), führt Gemeinde-Dubletten zusammen und setzt Kreis, Land, PLZ, Entfernung, Richtung, Zone und 3 bis 10 Nachbarorte. | `.cache/orte/angereichert.json` |
| 60 | `60-slugs.mjs` | Vergibt die Adressen (Slugs) und pflegt Register und Weiterleitungen. | `src/daten/orte.json`, `plz.json`, `slug-register.json`, `weiterleitungen.json` |
| 90 | `90-pruefen.mjs` | Prüft die Ausgabe hart: eindeutige IDs und Slugs, Koordinaten im Land, symmetrische Nachbarschaft, vollständiges Register, gültige Weiterleitungen. Bei einem Verstoß bricht sie ab. | Bericht `_werkstatt/berichte/orte-pipeline.md` |

Einzelne Stufen lassen sich mit `node pipeline/orte/<Datei>` starten, wenn die Ausgaben der Vorstufen im Cache liegen. Nach einer manuellen Änderung starten Sie aber den ganzen Lauf mit `npm run orte`. Danach `npm run bauen` und `npm run pruefen`.

## Abgleich: Regeln und Schwelle (Stufe 30)

Für jeden Quelldatensatz bewertet die Stufe alle GeoNames-Orte mit gleichem Namen, auch über Alternativnamen. Die Punkte:

- **Namensgleichheit:** 10 Punkte. Stimmt nur der Kern des Namens ohne Zusatz überein, gibt es 8, bei einem Alternativnamen 6.
- **Gemeinde:** stimmt sie überein, +6. Passt der Kreis oder liegt der Ort höchstens 25 km von einem gleichnamigen Ort der Gemeinde entfernt, +3. Liegt er mehr als 40 km vom nächsten gleichnamigen Gemeinde-Ort entfernt, −4.
- **Klammerhinweis** im Quellnamen, der zu Gemeinde, Kreis, Land oder einem Alternativnamen passt: +4.
- **Region** (nur Quelle A, Auswahl nach Region): +5.
- **Ortstyp und Einwohner:** Verwaltungssitze (PPLA-Codes) +2, Siedlungen (PPL) und Verwaltungsflächen (ADM4) +1; Einwohner bis +4, logarithmisch gestaffelt.
- **Abzüge:** umgekehrte Lesart „Gemeinde, Ortsteil“ −8; Quelle A bei der Lesart „Ort-Gemeinde“ −6; bei der zweiten, bundesweiten Suche −2.

Eine Siedlung zählt als ein Ort, wenn Name und Verwaltungseinheit übereinstimmen oder die Orte höchstens 5 km auseinander liegen. Ein Verwaltungsgebiet wird durch den besiedelten Ort derselben Siedlung ersetzt, wenn er höchstens 2 Punkte schlechter ist.

Ein Quelldatensatz gilt als zugeordnet, wenn eine dieser Bedingungen zutrifft (Werte aus `pipeline/orte/regeln.json`):

1. **eindeutig:** mindestens 10 Punkte, kein Namenstreffer in einer anderen Siedlung und kein Abzug;
2. **stark:** mindestens 12 Punkte, und nur der beste Kandidat trägt einen Gemeinde-, Region- oder Klammerhinweis, den der zweite nicht hat;
3. **gleichnamig ohne Hinweis:** mindestens 10 Punkte ohne Gemeinde- oder Klammerhinweis; gewählt wird der einwohnerstärkste Ort, und der Seitentitel nennt Gemeinde und Kreis zur Unterscheidung;
4. **Abstand:** mindestens 12 Punkte und mindestens 3 Punkte Abstand zur nächsten anderen Siedlung.

Alle anderen Fälle bleiben unklar, mit dem Grund „zu wenig Punkte“, „mehrdeutig“ oder „kein Kandidat“. Findet Quelle R im angegebenen Bundesland nichts, sucht die Stufe bundesweit neu; so ergeben sich Orte mit korrigiertem Land (79 im letzten Lauf). Für Quelle A gilt ein Suchkreis von 140 km um Hochheim am Main.

Eine manuelle Zuordnung hat Vorrang vor allen Regeln (siehe unten).

## Quote und unklare Orte

Die Zahlen stammen aus den Dateien, die Stufe 30 und die Stufen danach schreiben:

| Größe | Zahl | Herkunft |
|---|---|---|
| Quelldatensätze | 5.840 (R 5.308, A 532) | `.cache/orte/quellen.json` |
| zugeordnet | 5.526, also 94,6 % | 5.840 minus 314 unklare |
| unklar | 314, also 5,4 % | `src/daten/orte-unklar.json` |
| verschiedene Orte nach dem Abgleich | 5.112 | `.cache/orte/abgleich.json` |
| dazu Umkreis (Stufe 40) | 146 | `.cache/orte/umkreis.json` |
| minus Gemeinde-Dubletten (Stufe 50) | 6 | `.cache/orte/zaehlung-50.json` |
| Orte in der Website | 5.252 | `src/daten/orte.json` |

Die 314 unklaren Orte verteilen sich nach Grund auf 185 „zu wenig Punkte“, 94 „kein Kandidat“ und 35 „mehrdeutig“. Nach Land: Nordrhein-Westfalen 128, Niedersachsen 44, Hessen 42, Baden-Württemberg 25, Bremen 20, Rheinland-Pfalz 16, Bayern 12, Saarland 9, Niederlande 3, je 1 in Berlin, Mecklenburg-Vorpommern und Thüringen. Die übrigen 12 stammen aus Quelle A und tragen eine Region statt eines Landes (etwa Offenbach 3, Darmstadt 2).

Das Ziel war höchstens 2 % unklar. Es wurde mit 5,4 % verfehlt. Unklare Orte werden nicht veröffentlicht; sie stehen mit ihren besten Kandidaten in `src/daten/orte-unklar.json`.

**Richtigkeit.** Ein Gold-Set mit Handlabels, wie es ursprünglich vorgesehen war, gibt es nicht. Laut Entscheidungsprotokoll (D-008) wurden 45 zufällige Zuordnungen gesichtet; alle waren plausibel, vier Bundesländer wurden dabei korrigiert. Dazu kommen sechs Regeltests in `test/abgleich.test.mjs`. Die Richtigkeit ist also stichprobenhaft geprüft, nicht gemessen.

## Manuelle Zuordnung

Einen unklaren Ort geben Sie frei, indem Sie ihn in `pipeline/orte/zuordnung-manuell.json` eintragen. Die Datei ist ein JSON-Objekt und derzeit leer (`{}`).

1. **Eintrag suchen.** In `src/daten/orte-unklar.json` steht im Feld `quelle` der Schlüssel, etwa `R:schluesseldienst-…`. Das Feld `top` nennt bis zu drei Kandidaten mit GeoNames-ID, Gemeinde und Kreis.
2. **Quelle prüfen.** Die Adresse der Quellseite steht in `.cache/orte/quellen.json` im Feld `url`. Richtig ist der Kandidat, dessen Gemeinde und Kreis zur Quelle passen.
3. **Eintragen.** Der Schlüssel ist der Quellen-Schlüssel, der Wert die GeoNames-ID oder `verwerfen`:

   ```json
   {
     "R:<Quellen-Schlüssel>": "gn:<GeoNames-ID>"
   }
   ```

   Die ID finden Sie in `.cache/orte/gazetteer.json`, am besten durch Suche nach dem Namen. Eine unbekannte ID bricht die Pipeline ab. Mit `"verwerfen"` erscheint die Quelle auf keiner Seite.
4. **Neu berechnen.** `npm run orte` ausführen, dann `npm run bauen` und `npm run pruefen`. Mit `git diff --stat src/daten/` sehen Sie, was sich geändert hat.

Eine manuelle Zuordnung gilt vor den Regeln und nimmt den Ort aus der Liste der unklaren Orte heraus.

## Umkreis Weilburg (Stufe 40)

Bezugspunkt ist der Sitz Weilburg (GeoNames-ID `gn:2812626`). Die Stufe ergänzt Siedlungen bis 30 km Luftlinie, die keine Quelle nennt, und nur deutsche Orte mit den PPL-Codes von GeoNames. Dubletten fallen weg, wenn der Name gleich ist und entweder die Verwaltungseinheit übereinstimmt oder ein vorhandener Ort höchstens 2 km entfernt liegt. Orte mit Prüfgrund landen nur in `src/daten/orte-pruefliste.json` und erscheinen nicht auf der Website. Prüfgründe sind 0 Einwohner und eine Endung wie „Mühle“, „Hof“, „Hütte“ oder „Bahnhof“ sowie ein PPLX-Ort ohne Verwaltungsbezug.

Im letzten Lauf: 565 Kandidaten im Radius, 411 bereits vorhanden, 5 Dubletten, 3 auf der Prüfliste, 146 aufgenommen (`.cache/orte/zaehlung-40.json`).

## Zonen

Die Zone bestimmt den Titel, den Text und das Notöffnungsangebot der Ortsseite. Die Regeln stehen in `src/konfig/zonen.mjs`.

| Zone | Entfernung ab Weilburg (Luftlinie) | Orte |
|---|---|---|
| A | bis 20 km, dazu der ganze Landkreis Limburg-Weilburg | 244 |
| B | bis 50 km | 795 |
| C | bis 100 km | 998 |
| D | über 100 km | 3.168 |
| NL | Niederlande, wie Zone D, ohne Preise | 47 |

Die Radien und die Notöffnung in den Zonen C und D nach Absprache sind Annahmen, bis der Betrieb sie bestätigt (`_werkstatt/MENSCHEN.md`, §2). Mit `indexierung: false` nehmen Sie eine Zone aus Index und Sitemap.

## Adressen, Register und Weiterleitungen (Stufe 60)

- **Adresse.** Jede Ortsseite hat die Adresse `/schluesseldienst-<slug>/`. Der Slug besteht aus Kleinbuchstaben, Ziffern und Bindestrichen, höchstens 80 Zeichen. Bei einer Gemeinde ist der Slug ihr Name, bei einem Ortsteil „Gemeinde-Ortsteil“.
- **Kollisionen.** Haben zwei Orte denselben Slug, behält der einwohnerstärkste ihn. Die anderen bekommen Zusätze: zuerst den Kreis, dann die Postleitzahl, dann GeoNames-Ziffern. Im letzten Lauf gab es keine neuen Kollisionen; 28 Orte weichen vom Grund-Slug ab (`.cache/orte/zaehlung-60.json`).
- **Register** (`src/daten/slug-register.json`). Das Register ordnet jede GeoNames-ID ihrem Slug zu und wird nur ergänzt. Ein vergebener Slug bleibt, solange der Ort besteht und der Slug nicht kollidiert. Einträge für Orte, die nicht mehr in den Daten stehen, bleiben erhalten. Das Register hat 5.252 Einträge. Entfernen Sie keine Einträge von Hand: Ein fehlender Eintrag ändert die Adresse des Ortes.
- **Weiterleitungen** (`src/daten/weiterleitungen.json`). Ändert sich der Slug, entsteht eine Weiterleitung von der alten zur neuen Adresse. Gehört der alte Pfad inzwischen einem anderen Ort, entsteht keine Weiterleitung, weil sie dessen Seite umleiten würde; die Stufe zählt solche Fälle. Im letzten Lauf gab es keine Weiterleitungen (`[]`). Stufe 90 prüft, dass Weiterleitungen nicht auf lebende Seiten zeigen und ihr Ziel existiert.

## Neu einlesen (`--neu-einlesen`)

Verwenden Sie das nur, wenn Sie die GeoNames-Dateien bewusst aktualisieren wollen. Ohne den Schalter bricht Stufe 00 bei einer abweichenden Prüfsumme ab.

1. Die Dateien neu laden:

   ```sh
   NODE_USE_ENV_PROXY=1 node pipeline/orte/00-laden.mjs --neu-einlesen
   ```

   Fehlt im Serverkopf das Datum, verlangt die Stufe `--datum JJJJ-MM-TT`.
2. **Die Ausgabe ist der Vergleich.** Je Datei steht `=` für unverändert oder identischen Inhalt, `+` für eine neue Datei und `!` für eine geänderte Prüfsumme, mit alter und neuer Summe. Geänderte Dateien trägt die Stufe in `quellen.lock.json` ein. Einen eigenen Diff-Bericht schreibt der Lauf nicht.
3. Dann `npm run orte` ausführen. `git diff --stat src/daten/` zeigt, welche Ortsdaten sich geändert haben.

## Restrisiko: Datenbankrecht

Die Auswahl der Orte folgt den Ortslisten der Wettbewerber. Nach § 87b UrhG kann eine Datenbank geschützt sein. Ob die Auswahl oder die Ortsdaten davon betroffen sind, ist nicht geklärt. Die Ortsfakten stammen aus GeoNames unter CC BY 4.0; die Wettbewerberlisten dienen nur als Auswahl. Eine rechtliche Einschätzung steht aus ([OFFENE-PUNKTE.md](OFFENE-PUNKTE.md), Nr. 13; Begründung in `_werkstatt/MENSCHEN.md`, §3).
