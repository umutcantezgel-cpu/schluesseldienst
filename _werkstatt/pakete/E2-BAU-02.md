# E2-BAU-02 · Rolle Baumeister · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): pipeline/orte/40-umkreis.mjs, pipeline/orte/50-anreichern.mjs, pipeline/orte/60-slugs.mjs, pipeline/orte/90-pruefen.mjs, pipeline/orte/alle.mjs, src/daten/orte.json, src/daten/plz.json, src/daten/slug-register.json, src/daten/weiterleitungen.json, src/daten/orte-pruefliste.json, test/geo.test.mjs, test/slug.test.mjs, _werkstatt/berichte/orte-pipeline.md
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/orte/**
Umfang: 5 Pipeline-Dateien, 2 Testdateien, Datendateien, 1 Bericht

## Rollenbriefing Baumeister
Du baust einen Baustein nach Muster, Kern-Auszug und Konventionen und machst die Schnellprüfung. Häufige Fehler: Konventionen verletzen; Fälle vergessen; Dateien außerhalb der Schreibrechte ändern.

## Aufgabe in einem Satz
Vollende die Orts-Pipeline: Orte im Umkreis von 30 km um Weilburg ergänzen, alle Orte mit PLZ, Entfernung, Richtung, Zone, Nachbarn und Ortsteilen anreichern, stabile Slugs vergeben und das Ergebnis prüfen – Ausgabe `src/daten/orte.json` und `src/daten/plz.json`.

## Kern-Auszug
- K-004: nur `node:`-Module, ES-Module, deutsche Bezeichner, deterministisch (kein Math.random/Date.now), JSON mit einem Datensatz pro Zeile (Helfer `schreibeZeilenJson` aus `pipeline/orte/lib.mjs`), Sortierung mit `Intl.Collator('de')` bzw. nach `id`.
- Normalisierung: `schluessel()` und `kern()` aus `src/assets/js/logik/normalisieren.mjs`; Entfernung `haversineKm`, Richtung `richtung8` aus `pipeline/orte/lib.mjs`.

## Muster und Eingaben (lesen)
- Muster für Stil/Struktur: `pipeline/orte/30-abgleich.mjs` (Stufe 30, vom Orchestrator; NICHT ändern). Es exportiert `verwaltungsnamen(e, verwaltung, regeln)`.
- Eingaben: `.cache/orte/abgleich.json` (zugeordnete Orte: `{id,name,cc,a1,a2,a3,a4,fcode,pop,lat,lon,gemeinde,kreis,land,quellen,punkte}`), `.cache/orte/gazetteer.json`, `.cache/orte/plz.json`, `.cache/orte/verwaltung.json`, `pipeline/orte/regeln.json` (enthält `laenderDe`, `provinzenNl`), `src/konfig/zonen.mjs` (Stufen A–D mit `bisKm`, `auchKreis`; `sitzKreis`), `src/konfig/betrieb.mjs` (`sitz`).
- Sitz Weilburg: der Datensatz `gn:2812626` (aus abgleich.json bzw. gazetteer.json) ist der Bezugspunkt für Entfernungen.

## Schritte
1. `40-umkreis.mjs` → `.cache/orte/umkreis.json`: alle Gazetteer-Einträge `cc DE`, `fc P`, Feature-Codes PPL, PPLA, PPLA2, PPLA3, PPLA4, PPLC, PPLX mit Entfernung ≤ 30 km zu Weilburg, die nicht schon (gleiche id) in abgleich.json sind und nicht dieselbe Siedlung wie ein vorhandener Ort sind (gleicher `kern(name)` und gleiches `a4`, oder gleicher `kern(name)` und ≤ 2 km). Ausschluss in die **Prüfliste** `src/daten/orte-pruefliste.json` (nicht veröffentlichen, mit Grund): Namen, die auf `mühle|muehle|hof|höfe|forsthaus|hütte|huette|ziegelei|bahnhof|siedlung|gut` enden (Groß/klein egal) und `pop` 0 haben; PPLX ohne `a4`. Datensatzformat wie abgleich.json, `quellen: ['U:umkreis']`, `gemeinde/kreis/land` über `verwaltungsnamen`. Zählung berichten.
2. `50-anreichern.mjs` → `.cache/orte/angereichert.json` aus abgleich.json + umkreis.json:
   - **Namen säubern**: Gemeindename ohne Zusätze nach Komma („Großostheim, Markt“ → „Großostheim“; „Darmstadt, Wissenschaftsstadt“ → „Darmstadt“; „Bevern, Flecken“ → „Bevern“) – Regel: alles ab dem ersten Komma entfernen. Gleiches für `name`. Ortsname mit Komma kommt sonst nicht vor.
   - **typ**: `gemeinde`, wenn `kern(name) === kern(gemeinde)` oder `fcode` ∈ {PPLA, PPLA2, PPLA3, PPLA4, PPLC, ADM4} und kein anderer Ort dieser Gemeinde diesen Typ schon hat; sonst `ortsteil`. Fehlt `gemeinde` (z. B. NL oder ohne a4), ist der Ort `gemeinde` mit `gemeinde = name`.
   - **Duplikate**: Haben zwei Datensätze `typ gemeinde` mit gleichem `a3+a4` und gleichem `kern(name)`, bleibt der mit `fc P` (bei mehreren der mit größter `pop`), Quellen werden vereinigt.
   - **kreisSlug**: `schluessel(kreis)` ohne führende Präfixe `landkreis-`, `kreis-`, `kreisfreie-stadt-`, `stadtkreis-`, `regionalverband-`, `region-`, `staedteregion-`; gibt es für denselben Rest einen Landkreis und eine kreisfreie Stadt (z. B. Kassel, Offenbach), bekommt die kreisfreie Stadt `-stadt` angehängt. NL: `kreis` = Provinz aus `regeln.provinzenNl`, `kreisSlug` = `schluessel(provinz)`. Bremen/Berlin/Hamburg: `kreis` = Stadtname, `kreisSlug` = Stadt.
   - **landSlug**: `schluessel(land)`; NL: `land = 'Niederlande'`, `landSlug = 'niederlande'`.
   - **plz**: alle PLZ-Zeilen derselben `cc`, deren `schluessel(ort)` gleich `schluessel(name)` ist und deren `kreisCode` gleich `a3` ist (DE) – sonst gleich `schluessel(gemeinde)` und `kreisCode` = `a3`; gefunden → sortierte eindeutige Liste (max. 12, bei mehr: die 12 nächstgelegenen zum Ort). Nichts gefunden → die eine PLZ mit dem nächstgelegenen Mittelpunkt innerhalb 5 km; sonst leere Liste (`plzUnsicher: true`).
   - **km** (gerundet auf ganze Kilometer, Luftlinie zu Weilburg), **richtung** (`richtung8` vom Sitz zum Ort; Weilburg selbst: `null`), **zone**: `NL` für cc NL; sonst A wenn `km ≤ 20` oder `kreis === zonen.sitzKreis`, B wenn `km ≤ 50`, C wenn `km ≤ 100`, sonst D.
   - **nachbarn**: die 8 nächstgelegenen anderen Orte (Gitterindex 0,25° für Tempo), dann symmetrisieren: Ist B Nachbar von A, wird A Nachbar von B; Obergrenze 10 je Ort (die nächsten behalten); jeder Ort soll ≥ 3 Nachbarn haben. Speichern als Liste von IDs, nach Entfernung sortiert.
   - **ortsteile** (nur für `typ gemeinde`): IDs aller Orte mit `typ ortsteil`, gleichem `cc+a1+a2+a3+a4`; umgekehrt bekommen Ortsteile `gemeindeId` (falls die Gemeinde als Datensatz existiert, sonst `null`).
3. `60-slugs.mjs` → `src/daten/orte.json`, `src/daten/slug-register.json`, `src/daten/weiterleitungen.json`:
   - Grund-Slug: `typ gemeinde` → `schluessel(name)`; `typ ortsteil` → `schluessel(kern(gemeinde)) + '-' + schluessel(name)` (wenn der Name schon mit dem Gemeindekern beginnt, nicht doppeln).
   - Kollision (gleicher Grund-Slug bei verschiedenen IDs): **alle** Beteiligten außer dem mit der größten `pop` (bei Gleichstand kleinste id) bekommen `-{kreisSlug}`; NL-Orte bei Kollision mit DE `-nl`; besteht dann noch Kollision: zusätzlich `-{plz[0]}`, sonst `-{id-Ziffern}`.
   - Gültigkeit: `^[a-z0-9]+(-[a-z0-9]+)*$`, Länge ≤ 80.
   - Register: `src/daten/slug-register.json` ist append-only `{ id: slug }`: existiert eine id schon im Register, behält sie ihren Slug (außer er kollidiert jetzt – dann neuer Slug und Eintrag `{von:'/schluesseldienst-alt/', nach:'/schluesseldienst-neu/'}` in `weiterleitungen.json`). Erster Lauf: Register = alle aktuellen Slugs, `weiterleitungen.json` = `[]`.
   - Ausgabe `src/daten/orte.json` (ein Datensatz pro Zeile, sortiert nach `slug`), Felder genau: `id, slug, name, gemeinde, gemeindeId, typ, kreis, kreisSlug, land, landSlug, staat (cc), plz, plzUnsicher (nur wenn true), lat, lon (4 Nachkommastellen), km, richtung, zone, pop, quellen (nur Kürzel R/A/U, sortiert, dedupliziert), nachbarn, ortsteile (nur bei gemeinde)`.
   - **PLZ-Index** `src/daten/plz.json`: für **alle** DE-PLZ aus `.cache/orte/plz.json` (je PLZ ein Eintrag): `{ plz, ort (häufigster Ortsname dieser PLZ), km (Mittel der Zeilen-Koordinaten → Entfernung zu Weilburg, ganzzahlig), zone (Regel wie oben, Kreis-Regel über kreisCode = a3 von Weilburg), slug (Slug eines Ortes aus orte.json, dessen plz-Liste diese PLZ enthält – der mit größter pop; sonst null) }`, sortiert nach plz.
4. `90-pruefen.mjs` (Zusicherungen, Abbruch bei Verstoß) und Bericht `_werkstatt/berichte/orte-pipeline.md`: IDs und Slugs eindeutig; alle Slugs gültig; Koordinaten in Bounding Box DE (47.2–55.1 N, 5.8–15.1 O) bzw. NL (50.7–53.6 N, 3.3–7.3 O); Weilburg vorhanden mit `zone A`, `km 0`, `typ gemeinde`; jeder Ort hat ≥ 3 Nachbarn und jede Nachbar-ID existiert; jede `gemeindeId`/`ortsteile`-ID existiert; Anteil Orte ohne PLZ < 3 %; Zählungen: Orte gesamt, je Zone, je Land, je Typ, je Quelle (R, A, U), Kollisionen, Prüfliste; Laufzeiten.
5. `alle.mjs`: führt 00 (ohne Download, nur Prüfung), 10, 20, 30, 40, 50, 60, 90 nacheinander als Kindprozesse aus (`execFile(process.execPath, [datei])`), bricht bei Fehler ab.
6. Tests: `test/geo.test.mjs` (Weilburg→Wetzlar ≈ 19 km ±2; Richtung Weilburg→Limburg „südwestlich“; Zonenregel an Grenzen 20/50/100 km; Kreis-Regel), `test/slug.test.mjs` (Gemeinde-Slug; Ortsteil-Slug „Kubach“/„Weilburg“ → `weilburg-kubach`; kein Doppeln „Weilburg-Kubach“; Kollisionsauflösung mit Kreis; Register behält alten Slug und erzeugt Weiterleitung bei Änderung). Exportiere dafür reine Funktionen aus 50/60 (Hauptlauf nur bei direkter Ausführung).
7. Lauf: `node pipeline/orte/alle.mjs`, dann `node --test test/`.

## Schnellprüfung und Selbstprüfung
- `node --check`; alle Tests unter `test/` grün; Bericht mit Zählungen; Stichprobe 10 Orte (Name, Slug, Gemeinde, Kreis, PLZ, km, Zone) im Bericht; Dateigröße `src/daten/orte.json` (Ziel < 4 MB) und `plz.json`.
- Schreibrechte eingehalten (`git status --short`); nichts committet.
