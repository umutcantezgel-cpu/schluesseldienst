# E3-BAU-12 · Rolle Baumeister · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): src/vorlagen/seiten/hub.mjs, src/assets/css/komponenten/az.css
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E3-BAU-12/**
Umfang: Vorlage V06 für Länder- und Kreis-Hubs mit A–Z-Verzeichnis (Vorschau-Port 4192)

## Rollenbriefing Baumeister
Du baust nach fertigen Mustern und änderst die Muster nicht. Häufige Fehler: Muster „verbessern“ statt befolgen; erfundene Angaben (Fläche, Einwohner, „bekannt für …“); Seiten ohne eingehende Links; Tastaturbedienung vergessen.

## Aufgabe in einem Satz
Baue die Seitenvorlage für `/einsatzgebiet/{land}/` und `/einsatzgebiet/{land}/{kreis}/`, die alle veröffentlichten Orte aus `src/daten/orte.json` übersichtlich und verlinkt erschließt.

## Muster (lesen, nicht ändern)
- Seitenmodul-Schnittstelle: `src/vorlagen/seiten/ort.mjs` (`vorbereiten(k)`, `seiten(k)`, Seitenobjekt mit `pfad`, `titel`, `beschreibung`, `typ`, `ansicht`, `sitemap`, `brotkrumen`, `jsonld`, `inhalt`). Brotkrumen-Stufen und Pfade exakt wie dort in `stufenVon()`.
- Teile: `src/vorlagen/teile/abschnitt.mjs`, `teile/brotkrumen.mjs` (`brotkrumenLd`), `teile/lagekarte.mjs` (optional).
- CSS-Muster: `src/assets/css/komponenten/ort.css` (Listen `.ort-liste`, Tokens nur aus `src/assets/css/token.css`; der Token-Linter prüft).
- Themenpass-Muster: `MUSTER_PAESSE['land-hub']` und `['kreis-hub']` in `src/konfig/themenpaesse.mjs`.

## Anforderungen
1. `export function vorbereiten(k)`: setzt `k.hubs.aktiv = true` und `k.hubs.laender = [{ titel, pfad }]` (alphabetisch, „Niederlande“ zuletzt) – davon hängen die Ortsseiten (`ort.mjs`) und später die Fußnavigation ab.
2. Land-Hub `/einsatzgebiet/{landSlug}/` je Land mit veröffentlichten Orten (Ort hat `slug`):
   - H1 „Schlüsseldienst in {Land}“, Satz mit Anzahl der Orte und der Entfernungsspanne ab Weilburg (aus den Daten, in `<span data-daten>`);
   - Liste der Kreise mit Ortszahl und kleinster/größter Entfernung, verlinkt auf den Kreis-Hub.
   - Stadtstaaten und Länder, in denen `kreisSlug === landSlug`: direkt die Ortsliste wie im Kreis-Hub, ohne Kreisebene.
   - Niederlande: `land: 'Niederlande'`, Kreise = Provinzen.
3. Kreis-Hub `/einsatzgebiet/{landSlug}/{kreisSlug}/`:
   - H1 „Schlüsseldienst im {Kreis}“; bei Kreisnamen ohne „Landkreis/Kreis/Stadtkreis“ „Schlüsseldienst in {Kreis}“.
   - A–Z-Verzeichnis aller Orte des Kreises: Gemeinden fett, ihre Ortsteile darunter eingerückt, je mit km und Zone.
   - Klebende Buchstabenleiste (Sprunglinks zu `#buchstabe-a` …, leere Buchstaben als Text ohne Link).
   - CSS-Spalten mit Mindestbreite über einen vorhandenen Token (z. B. `--spalte-az`).
4. Titel ≤ 60 Zeichen, Beschreibung 70–155 Zeichen, ehrlich: Sitz Weilburg und Zonen nennen, keine Leistungszusage je Land. Ab Zone C keine Formulierung wie „vor Ort“ oder „in Ihrer Nähe“; der Ehrlichkeitsprüfer bricht sonst ab.
5. JSON-LD: `BreadcrumbList` (über `brotkrumenLd`) plus `CollectionPage` mit `name` und `url` (absolute URL aus `k.basisUrl`). Kein `LocalBusiness`, kein `Offer`.
6. `sitemap: 'hubs'`, `typ: 'hub'`, `ansicht: 'V06'`. Brotkrumen: Einsatzgebiet › Land (› Kreis). Jede Seite verlinkt ihre Eltern und Kinder.
7. Keine Zahlen außer aus Daten; keine Fakten über Länder oder Kreise, die nicht in `orte.json` stehen.

## Prüfen
- `node bau/bauen.mjs --messen --pruefen --aus=.cache/E3-BAU-12/dist` baut jetzt alle Ortsseiten mit (rund 5.300 Seiten, etwa 40 s). Alle Prüfer grün. Die Klicktiefe-Warnungen auf Ortsseiten müssen deutlich sinken; Zahl vorher/nachher berichten. Die Befunde stehen in `.cache/E3-BAU-12/dist.pruefbefunde.json`.
- Vorschau `node bau/vorschau.mjs --aus .cache/E3-BAU-12/dist --port 4192 --still &`.
- Bildsatz für `/einsatzgebiet/hessen/`, `/einsatzgebiet/hessen/limburg-weilburg/`, `/einsatzgebiet/berlin/` (falls vorhanden) und `/einsatzgebiet/niederlande/` ansehen. Mit Tastatur prüfen: Buchstabenleiste per Tab, Fokus sichtbar.
- Deinen Vorschau-Prozess am Ende per PID beenden (node-Prozess, nicht die Shell).
