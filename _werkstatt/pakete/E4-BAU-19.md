# E4-BAU-19 · Rolle Baumeister · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): src/vorlagen/seiten/{ueber-uns,karriere}.mjs, src/inhalte/{ueber-uns,karriere}.mjs, src/assets/css/ansichten/betrieb/betrieb.css, test/karriere.test.mjs (alle neu)
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E4-BAU-19/**
Umfang: V09 `/ueber-uns/` und Karriere-Vorlage `/karriere/` mit Test, Vorschau-Port 4199

## Rollenbriefing Baumeister
Du baust nach Mustern und änderst die Muster nicht. Häufige Fehler: Teamgröße, Gründungsjahr, Qualifikationen oder Werte erfinden; Abschnitte ohne Inhalt stehen lassen; Werbeton.

## Aufgabe in einem Satz
Baue „Über uns“ ausschließlich aus belegbaren Angaben der Konfiguration und der Leitidee, und eine Karriere-Vorlage, die nur bei konfigurierten Stellen eine Seite erzeugt.

## /ueber-uns/ (Erzählansicht, Themenpass `/ueber-uns/`)
- Abschnitte in dieser Reihenfolge: „Wer wir sind“ (Name, Sitz Weilburg, Leistungsgruppen aus `src/konfig/leistungen.mjs`; `betrieb.gruendungsjahr`, `qualifikationen`, `team` nur, wenn gesetzt – sonst entfällt der jeweilige Satz bzw. Block) · „Wofür wir stehen: ruhig, präzise, offen“ (drei kurze Blöcke) · „Der gerade Weg“ (Leitidee mit dem Fakt `weilburg-tunnel.abkuerzung` aus `src/inhalte/fakten/weilburg-tunnel.mjs`; daneben ein leerer Figurplatz `<figure class="betrieb-figur" data-figur="lahnbogen">` – die Illustration liefert Opus in E4-OPUS-05) · „Wie Sie uns erreichen“ (Rufknopf aus `src/vorlagen/teile/rufknopf.mjs`, Link `/kontakt/`).
- JSON-LD: `AboutPage` mit `about: { '@id': basisUrl + '/#betrieb' }` und `BreadcrumbList`. Keine Personen, keine Bewertungen.
## /karriere/ (Themenpass: nur konfigurierte Stellen; ohne Stellen keine Seite)
- `seiten(k)` liefert `[]`, wenn `k.konfig.betrieb.stellen` leer ist. Sonst eine Seite mit je Stelle: Titel, Umfang, Ort, Aufgaben (Liste), Anforderungen (Liste), Kontakt per E-Mail-Link (`mailto:` aus `betrieb.email`). Felder einer Stelle: `{ id, titel, umfang, ort, aufgaben: [], anforderungen: [] }`.
- JSON-LD je Stelle `JobPosting` nur mit Feldern, die konfiguriert sind (kein Gehalt erfinden).
- `test/karriere.test.mjs` (node:test): (1) ohne Stellen `seiten(k)` = `[]`; (2) mit Fixture-Stelle genau eine Seite `/karriere/`, deren HTML (`inhalt(sk)` mit einem einfachen sk-Stub) Titel und Aufgaben enthält; (3) JSON-LD hat `@type: 'JobPosting'` und kein `baseSalary`. Fixture nur im Test, nie in der Konfiguration.
## Gemeinsame Regeln
`_werkstatt/pakete/_seitenvorlage.md` vollständig lesen und einhalten. Bündelname `betrieb` für beide Seiten.
