# E2-PRUEF-04 · Rolle Prüfer · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): pipeline/fingerabdruck.mjs, bau/pruefen/plagiat.mjs, bau/pruefen/fingerabdruck.json, test/plagiat.test.mjs, test/fixtures/plagiat/** (neu anlegen)
Umfang: 2 Module + 1 Datendatei + Tests

## Rollenbriefing Prüfer
Du schreibst Prüfungen und Tests für neue Logik und berichtest knapp mit Belegpfaden. Häufige Fehler: deuten statt berichten; über den Auftrag hinaus prüfen.

## Aufgabe in einem Satz
Baue einen Plagiatsprüfer, der die eigenen gerenderten Fließtexte gegen die Texte beider Wettbewerber abgleicht, wobei im Repo nur Hashes der Wettbewerbertexte liegen (keine Texte).

## Kern-Auszug
- K-004: nur `node:`-Module, ES-Module, deutsche Bezeichner. Prüfer-Schnittstelle: siehe `bau/pruefen/index.mjs` (lesen!): `export const name = 'plagiat'; export async function pruefe(ctx) → [{regel, schwere, datei, meldung}]`, `ctx.seiten = [{pfad, datei, html, typ, indexierbar}]`, `ctx.wurzel`.
- Regel aus dem Plan: 64-bit-Schindeln (Hash), exakter Gegenabgleich nur über Hashes; nur Fließtext; **Abbruch (schwere 'fehler') ab ≥ 10 gleichen Wörtern in Folge**, 7–9 Wörter in Folge nur `warnung`.

## Schritte
1. `pipeline/fingerabdruck.mjs` (einmalig auszuführen, liest Rohdaten über `git show ad81157:<pfad>` bzw. `unzip -p` per execFile; Muster: wie in pipeline/orte geplant): 
   - Korpus: alle Richter-Markdown-Dateien in `Richter Schlüsseldienst/01a12b76-b326-7756-a303-8fa6e684874c 2/*.md` (1.400) und alle Adam-Markdown-Einträge im ZIP `Schlüsseldienst Adam/dba3265a-e101-45c5-a4b2-34f91dac4d75.zip`. Liste der Dateien per `git ls-tree -r --name-only ad81157`.
   - Normalisierung (Funktion `woerter(text)` exportieren und im Prüfer wiederverwenden): Markdown-Links `[t](u)` → `t`, Bild-Syntax entfernen, URLs entfernen, Kleinschreibung (`toLocaleLowerCase('de')`), alles außer Buchstaben (inkl. äöüß) und Ziffern → Leerzeichen, an Leerraum trennen, leere entfernen.
   - Schindeln der Länge 7: Hash = erste 16 Hex-Zeichen von SHA-256 über die 7 Wörter mit einem Leerzeichen verbunden (64 Bit). Menge aller Schindel-Hashes; **Ausschluss häufiger Allerweltsfolgen**: Schindeln, die in > 25 verschiedenen Quelldateien vorkommen, kommen in eine eigene Liste `haeufig` (werden nicht als Plagiat gewertet; das sind Navigationen/Boilerplate).
   - Zusätzlich Hashes von Wettbewerber-Kennungen für den Sicherheits-Linter (gleiche Datei, Feld `kennungen`): SHA-256 (voll, hex) von: beiden Domains, beiden Firmennamen in Kleinschreibung („richter sicherheitstechnik“, „schlüsseldienst adam“, „e. richter“), allen Telefonnummern im Korpus als Ziffernfolge ohne Trennzeichen (Muster: Ziffernfolgen mit ≥ 9 Ziffern nach Entfernen von Leerzeichen, Bindestrichen, Schrägstrichen und `+49`→`0`), allen `AIza…`-Schlüsseln (Regex `AIza[0-9A-Za-z_-]{35}`) und `google-site-verification`-Werten (aus den JSON-Dateien, Feld metadata). **Die Klartexte dürfen nirgends gespeichert oder ausgegeben werden** (nur Anzahl je Art).
   - Ausgabe `bau/pruefen/fingerabdruck.json`: `{ version: 1, schindelLaenge: 7, schindeln: [sortierte Hex-Hashes], haeufig: [...], kennungen: { domains: [...], namen: [...], telefon: [...], schluessel: [...] } }`. Größe berichten (Ziel < 25 MB; wenn größer: Schindeln nur aus Fließtextzeilen mit ≥ 7 Wörtern bilden und Zeilen mit Links/Navigation überspringen; Ergebnis berichten).
2. `bau/pruefen/plagiat.mjs`: lädt `fingerabdruck.json` einmal (Set). Für jede Seite in `ctx.seiten`: Fließtext extrahieren = Inhalt von `<p>`, `<li>`, `<dd>`, `<td>`, `<blockquote>`, `<figcaption>`, `<summary>` innerhalb von `<main>`, **ohne** Elemente mit Klasse `az-liste`, `nachbarorte`, `brotkrumen`, `ortsteile`, `plz-liste` (Ortslisten sind keine Fließtexte) – reine Regex-Extraktion genügt, Tags entfernen, Entitäten dekodieren. Je Textblock `woerter()`, Schindeln bilden, Treffer markieren (Treffer = Hash in `schindeln` und nicht in `haeufig`), zusammenhängende Läufe bestimmen: Lauflänge in Wörtern = Anzahl aufeinanderfolgender Treffer + 6. ≥ 10 → `fehler` (regel `plagiat/lauf`), 7–9 → `warnung`. Meldung: Seite, Lauflänge, die ersten 6 eigenen Wörter des Laufs (aus der eigenen Seite, nicht aus der Quelle).
3. `test/plagiat.test.mjs` mit Fixture-Fingerabdruck (eigener kleiner Korpus in `test/fixtures/plagiat/`, z. B. zwei erfundene Absätze, aus denen ein Test-Fingerabdruck per exportierter Funktion `baueFingerabdruck(texte)` erzeugt wird): Fall 12 gleiche Wörter → fehler; Fall 8 → warnung; Fall 6 → nichts; Ortsliste mit Klasse `az-liste` → ignoriert; Normalisierung (Groß/klein, Satzzeichen, Links).
4. Läufe: `node pipeline/fingerabdruck.mjs` (Zeit und Größe nennen), `node --test test/plagiat.test.mjs`. Zusätzlich Plausibilitätstest: Nimm einen beliebigen Absatz aus einer Richter-Datei, bette ihn in eine Test-HTML-Seite in `<main><p>…</p></main>` ein und rufe `pruefe()` auf – muss `fehler` liefern; und einen selbst geschriebenen Absatz zum Thema Türöffnung – muss leer sein. (Diesen Test als Testfall `echte-daten` aufnehmen, der übersprungen wird, wenn `fingerabdruck.json` fehlt; den Rohabsatz NICHT in die Testdatei schreiben – lies ihn zur Laufzeit über git show.)

## Schnellprüfung und Selbstprüfung
- `node --check`; Tests grün; Größe der JSON-Datei; grep in `fingerabdruck.json` nach „richter“, „adam“, „0163“, „AIza“ = 0 Treffer.
- Schreibrechte eingehalten; nichts committet.
