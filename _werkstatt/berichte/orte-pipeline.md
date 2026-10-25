# Orts-Pipeline (Stufen 00–90)

Erzeugt von `pipeline/orte/alle.mjs`. Ausgaben: `src/daten/orte.json`, `src/daten/plz.json`, `src/daten/slug-register.json`, `src/daten/weiterleitungen.json`, `src/daten/orte-pruefliste.json` (nicht veröffentlicht).

## Umfang und Zählungen

- Orte gesamt: **5252** (Gemeinden 2270, Ortsteile 2982)
- Je Zone: A 244, B 795, C 998, D 3168, NL 47
- Je Land: Baden-Württemberg 548, Bayern 213, Berlin 3, Brandenburg 101, Bremen 50, Hessen 1395, Mecklenburg-Vorpommern 50, Niederlande 47, Niedersachsen 710, Nordrhein-Westfalen 1209, Rheinland-Pfalz 643, Saarland 178, Sachsen-Anhalt 49, Schleswig-Holstein 1, Thüringen 55
- Je Quelle (Orte mit Quelle): R 4894, A 490, U 146
- Umkreis (Stufe 40): 565 Kandidaten im Radius, 411 schon vorhanden, 5 Dubletten, 3 auf der Prüfliste, 146 aufgenommen
- Gemeinde-Dubletten zusammengeführt (Stufe 50): 6
- Namen gesäubert (Stufe 50): 2; Orte ohne Gemeinde in der Quelle: 2
- Slugs (Stufe 60): Orte mit Slug abweichend vom Grund-Slug (Kollisionszusatz oder Register): 28; in diesem Lauf neue Kollisionsgruppen: 0 (das Register hält bestehende Slugs fest); Stufen dieses Laufs 1/2/3: 0/0/0; übersprungene Weiterleitungen: 0
- Orte mit kreisSlug „-stadt“ (kreisfreie Stadt mit gleichem Rest wie ein Landkreis): 18

### Prüfliste (src/daten/orte-pruefliste.json, 3 Einträge)

- Name endet auf Mühle/Hof/Forsthaus/Hütte/Ziegelei/Bahnhof/Siedlung/Gut, 0 Einwohner: 3

## PLZ und Nachbarn

- Orte ohne PLZ: 10 (0.19 %); mit unsicherer PLZ (Fallback leer): 10
- PLZ-Index: 10815 Einträge, davon 2662 mit Slug
- Nachbarn je Ort: min 4, max 10, Mittel 8.92; Orte unter 3 Nachbarn: 0

## Prüfungen (Stufe 90)

154540 Einzelprüfungen bestanden, keine Verletzung. Prüfarten: IDs eindeutig; Slugs eindeutig; Felder genau; Slug gültig; Typ gültig; Koordinaten im Land; Quellen gültig; Zone gültig; Nachbarn 3 bis 10; Plz Liste; Nachbar existiert; Nachbarschaft symmetrisch; gemeindeId existiert; ortsteile-ID existiert; Weilburg vorhanden; Anteil ohne PLZ unter 3 Prozent; PLZ-Index vollständig; PLZ-Slug existiert; Register vollständig; Register-Slugs gültig; Prüfliste nicht veröffentlicht; Prüfliste mit Grund.

## Dateigrößen

- src/daten/orte.json: 2.58 MB (Ziel unter 4 MB)
- src/daten/plz.json: 0.77 MB

## Laufzeiten

- 00-laden.mjs: 0.1 s
- 10-quellen.mjs: 0.2 s
- 20-index.mjs: 1.6 s
- 30-abgleich.mjs: 1.9 s
- 40-umkreis.mjs: 0.5 s
- 50-anreichern.mjs: 1.1 s
- 60-slugs.mjs: 0.3 s

## Stichprobe (10 Orte)

| Name | Slug | Gemeinde | Kreis | PLZ | km | Zone |
|---|---|---|---|---|---|---|
| Fürstengrund | bad-koenig-fuerstengrund | Bad König | Odenwaldkreis | 64732 | 98 | C |
| Neue Vahr Südwest | bremen-neue-vahr-suedwest | Bremen | Bremen | 28203 | 292 | D |
| Enger | enger | Enger | Kreis Herford | 32130 | 185 | D |
| Richen | gross-umstadt-richen | Groß-Umstadt | Landkreis Darmstadt-Dieburg | 64823 | 81 | C |
| Vahlhausen | horn-bad-meinberg-vahlhausen | Horn-Bad Meinberg | Kreis Lippe | 32805 | 164 | D |
| Hörspe | lemwerder-hoerspe | Lemwerder | Landkreis Wesermarsch | 27809 | 296 | D |
| Birken | much-birken | Much | Rhein-Sieg-Kreis | 53804 | 80 | C |
| Püttlingen | puettlingen | Püttlingen | Regionalverband Saarbrücken | 66346 | 166 | D |
| Sörgenloch | soergenloch | Sörgenloch | Landkreis Mainz-Bingen | 55270 | 67 | C |
| Oberlauken | weilrod-oberlauken | Weilrod | Hochtaunuskreis | 61276 | 21 | B |
