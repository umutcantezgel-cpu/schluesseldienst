# E3-PRUEF-10 · Rolle Prüfer · Modell Haiku · Stufe 1 · Kern-Version 1
Schreibrechte (exakt): _werkstatt/berichte/E3-orte.md, _werkstatt/werkzeuge/{linkgraph,aehnlichkeit,ortsstichprobe}.mjs (neu)
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E3-PRUEF-10/**
Umfang: Linkgraph, Textähnlichkeit der Ortsseiten, Stichprobe 100 Ortsseiten gegen die Ortsdaten

## Rollenbriefing Prüfer
Du führst die Prüfungen deiner Stufe aus und berichtest knapp mit Belegpfaden. Häufige Fehler: deuten statt berichten; Stichprobe nicht reproduzierbar; Zahlen ohne Grundgesamtheit.

## Aufgabe in einem Satz
Miss den internen Linkgraph aller Seiten, die Textähnlichkeit der Ortsseiten und prüfe 100 Ortsseiten gegen `src/daten/orte.json` – mit drei kleinen, wiederverwendbaren Werkzeugen ohne Abhängigkeiten.

## Schritte
1. Build: `node bau/bauen.mjs --messen --pruefen --aus=.cache/E3-PRUEF-10/dist` → je Prüfer Fehler/Warnungen notieren.
2. `_werkstatt/werkzeuge/linkgraph.mjs --dist <ordner> --aus <json>` (nur `node:`-Module): alle `index.html` lesen, interne Links (`href` beginnt mit `/`, ohne `#…`) als Kanten; Ergebnis: Seitenzahl, Kanten, eingehende Links je Seite (Min, 5 %-Quantil, Median), Seiten mit < 3 eingehenden Links (Liste), Waisen (0 eingehend, außer `/`), Klicktiefe ab `/` per Breitensuche (Maximum, Verteilung, Seiten mit Tiefe > 4), Links auf nicht vorhandene Ziele (Liste, nach Ziel gruppiert).
3. `_werkstatt/werkzeuge/aehnlichkeit.mjs --dist <ordner> --paare 2000 --saat 7 --aus <json>`: sichtbaren Text in `<main>` der Ortsseiten (`/schluesseldienst-*/`) ohne Tags, Wort-5-Gramme (klein, Satzzeichen weg), Jaccard für 2.000 zufällige Paare (feste Saat, gleichverteilt) und für jedes Paar Ort–Nachbarort aus der Seite (bis 2.000). Je Gruppe Median, 95 %-Quantil, Maximum; die 10 ähnlichsten Paare mit Wert.
4. `_werkstatt/werkzeuge/ortsstichprobe.mjs --dist <ordner> --daten src/daten/orte.json --saat 7 --aus <json>`: geschichtete Stichprobe mit fester Saat – Zone A 25, B 25, C 25, D 15, NL 10. Je Ort prüfen und als ok/abweichend melden:
   - Seite existiert unter `/schluesseldienst-<slug>/`, Status-Code der Datei egal (statisch).
   - H1 enthält den Ortsnamen; Faktenzeile nennt Gemeinde (bei Ortsteilen), Kreis, Land, alle PLZ aus den Daten, km und Richtung exakt wie in den Daten.
   - Zone C, D und NL: `<title>` und H1 nennen „Weilburg“ und die km-Zahl (ehrliche Titel, PLAN „Leitplanken“).
   - NL: keine Preisangaben (`class="preis"` kommt nicht vor).
   - JSON-LD enthält kein `LocalBusiness`/`Locksmith` und kein `aggregateRating`.
   - Brotkrumen: Start › Einsatzgebiet › Land › Kreis (Kreis entfällt bei Stadtstaaten) und jeder Brotkrumen-Link existiert.
5. Bericht `_werkstatt/berichte/E3-orte.md` (≤ 900 Wörter): Tabellen je Messung mit Grundgesamtheit, dann Abweichungen mit Pfad, dann „Nicht geprüft“. Keine Deutung, keine Gestaltungsurteile. Die JSON-Ergebnisse bleiben in `.cache/E3-PRUEF-10/`.

## Schnellprüfung und Selbstprüfung
- Werkzeuge laufen zweimal mit gleicher Saat und liefern dieselben Zahlen; Schreibrechte eingehalten (`git status --short`); nichts committet; keine Browser-Messungen (andere Pakete messen parallel).
