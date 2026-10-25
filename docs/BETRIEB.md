# Betrieb: Was vor dem ersten Release eingetragen werden muss

Dieses Dokument sagt, welche Angaben Sie eintragen müssen, in welcher Datei und in welcher Reihenfolge. Die Begründungen und die offenen Fragen stehen in `_werkstatt/MENSCHEN.md`; alle offenen Punkte fasst [OFFENE-PUNKTE.md](OFFENE-PUNKTE.md) zusammen.

## So erkennen Sie den Stand

Platzhalter sind sichtbar markiert, zum Beispiel mit „[Telefon fehlt]“. Der Release verweigert, solange einer übrig ist. `npm run bauen` zeigt die Anzahl (Zeile „Platzhalter: …“) und die Zahl der ungeprüften Fakten.

Alle Platzhalter der Konfiguration mit Pfad und Beschriftung listet dieser Befehl. Er liest nur:

```sh
node --input-type=module -e "
const { platzhalterIn } = await import('./bau/lib/platzhalter.mjs');
const betrieb = (await import('./src/konfig/betrieb.mjs')).default;
const preise = (await import('./src/konfig/preise.mjs')).default;
const zonen = (await import('./src/konfig/zonen.mjs')).default;
for (const p of platzhalterIn({ betrieb, preise, zonen })) console.log(p.pfad, '–', p.beschriftung);
"
```

Die Platzhalter auf den Seiten entstehen aus diesen Angaben und aus den Inhaltsdateien. Sie verschwinden, wenn die Quelle gefüllt ist.

## 1. `src/konfig/betrieb.mjs`

| Feld | Was eintragen | Hinweis |
|---|---|---|
| `name`, `rechtsform`, `inhaber` | Firmenname, Rechtsform, Inhaber oder Vertretungsberechtigte | Der Firmenname erscheint als Wortmarke und im Impressum. |
| `adresse.strasse`, `adresse.plz` | Anschrift in Weilburg | Der Ort ist fest auf Weilburg gesetzt. |
| `telefon.anzeige`, `telefon.e164` | Notrufnummer als Anzeige und im Format `+49…` | Die Rufleiste zeigt die Nummer auf jeder Seite. |
| `email` | Adresse für Kontakt und Anfragen | Dieselbe Adresse steht in `security.txt`. Solange der Platzhalter steht, schreibt der Build `sicherheit@example.invalid` dorthin. |
| `erreichbarkeit.zeiten`, `erreichbarkeit.nachtdienst` | Zeiten je Wochentag; Nachtdienst ja oder nein | Ohne Angabe zeigt die Rufleiste nur die Nummer. |
| `impressum.register`, `ustId`, `kammer`, `berufsbezeichnung`, `verantwortlichMStV`, `vsbg` | Angaben nach MENSCHEN §1 | Nichts erfinden. Ein Eintrag wie „kein Registereintrag“ ist eine gültige Angabe. |
| `zusagen.preisVorAuftrag`, `rechnungMitPositionen`, `kartenzahlung`, `erfolglos` | `true`, wenn der Betrieb die Zusage gibt; `false` für die neutrale Fassung | Bei `true` zeigt die Vorlage den Zusagentext. Bei `false` zeigt sie den neutralen Text oder nichts. |
| `bewertungen.profilUrl` | Link zum Bewertungsprofil, nur mit Nachweis | Ohne Eintrag gibt es keine Bewertungsangaben. |
| `gruendungsjahr`, `qualifikationen`, `team` | Nur mit Nachweis eintragen | Die Über-uns-Seite zeigt sie nur, wenn sie gefüllt sind. |
| `stellen` | Stellenangebote | Ohne Eintrag entsteht keine Karriere-Seite. |
| `basisUrl` | `https://` und die Domain, ohne Pfad und ohne Schrägstrich | Erlaubt sind Kleinbuchstaben, Ziffern, Punkt und Bindestrich. Der Release prüft das Format. |

## 2. `src/konfig/preise.mjs`

- **`ustModus`**: `'klein'` für Kleinunternehmer; dann erscheint kein Satz „inkl. MwSt.“. Der Code prüft nur auf `'klein'`. Jeder andere Wert ergibt den Satz „Alle Preise enthalten die Umsatzsteuer.“. Für die Regelbesteuerung empfiehlt sich `'regel'`.
- **`zeitfenster[].zeit`**: Uhrzeit oder Zeitraum je Zeitfenster als Text.
- **`tagesband`**: Objekt mit `werktags` und `wochenende`. Jede Liste enthält Einträge `[Zeitfenster-ID, von, bis]`, etwa `['nacht', '00:00', '07:00']`. Die Zeiten müssen lückenlos von 00:00 bis 24:00 reichen. Ein fehlerhaftes Tagesband bricht den Build mit der Meldung „preise.tagesband ungültig“ ab. Feiertage gelten wie das Wochenende; der Preisrechner erkennt sie nicht.
- **`positionen[].preise`**: Gesamtpreis je Zeitfenster in Cent als ganze Zahl (12990 steht für 129,90 €), inklusive Umsatzsteuer und Anfahrt in Zone A. `null` zeigt „nach Absprache“.
- **`anfahrt`**: Aufschlag je Zone in Cent. Zone A ist `0`, weil die Anfahrt in den Positionen steckt. Zone D steht auf `null` („nach Absprache“).
- **`zahlarten`**: Die Zahlarten als Text, ohne Aufschläge (§ 270a BGB).

## 3. `src/konfig/zonen.mjs`

- **`bisKm`** je Zone: A bis 20 km (mit dem Landkreis Limburg-Weilburg), B bis 50 km, C bis 100 km, D darüber. Die Radien bestätigen oder ändern (MENSCHEN §2), danach bauen und prüfen.
- **`leistungenBestaetigt`** je Zone: `true` zeigt die Leistungen dieser Zone auf den Ortsseiten, `false` blendet den Abschnitt aus. Solange der Platzhalter steht, erscheint der Hinweis „[Leistungen in Zone X bestätigen]“.
- **`notoeffnung`** je Zone: `'ja'` oder `'nach-absprache'`. Ob Notöffnungen in den Zonen C und D angeboten werden, entscheidet der Betrieb.
- **`indexierung`** je Zone: `false` nimmt die Ortsseiten der Zone aus dem Index und der Sitemap.
- **`nl`**: Die Niederlande gelten wie Zone D und zeigen keine Preise.

## 4. `src/konfig/seo.mjs`

- `standardBeschreibung`: Beschreibung der Startseite. Der Prüfer `seo` warnt, wenn Beschreibungen außerhalb von `beschreibungMin` (70) und `beschreibungMax` (155) Zeichen liegen.
- `titelMax` (60): Grenze für den Prüfer `seo`. Der Markenzusatz im Titel wird nur angehängt, wenn der Titel darunter bleibt. Im Release ist ein längerer Titel ein Fehler, außer bei Ortsseiten: Dort bleibt es eine Warnung (`seo/titel-laenge-ort`), weil Namensdoppel und Entfernungsangabe nicht gekürzt werden.
- `ogBild`, `themeColor`: Standardbild und Farben.

Die Basis-Adresse steht nicht in dieser Datei, sondern in `betrieb.basisUrl`.

## 5. Faktenblätter freigeben

Jeder Fakt steht in `src/inhalte/fakten/<blatt>.mjs` als `fakt({ id, text, quelle, status })`. Der Status ist `'verifizieren'` oder `'geprueft'`; ein anderer Wert bricht den Build ab. Die Quellen stehen im Feld `quellen` mit `id`, `titel`, `url` und `abgerufen`.

So geben Sie einen Fakt frei:

1. Den Text an der Primärquelle prüfen, nicht an einer Zusammenfassung.
2. Die Quelle im Blatt ergänzen oder korrigieren, mit Abrufdatum.
3. `status: 'geprueft'` setzen.
4. `npm run bauen` ausführen und die Zahl der ungeprüften Fakten prüfen.

Die Freigabe entfernt die Markierung. Sie ersetzt keine fachliche oder rechtliche Prüfung (MENSCHEN §3). Zum Stand dieser Dokumentation sind alle 190 Fakten noch „verifizieren“.

## 6. Rechtsseiten

Impressum, Datenschutz, Widerruf, Barrierefreiheit sowie Quellen und Lizenzen sind Entwürfe. Jede Datei in `src/inhalte/recht/` enthält `freigabe: platzhalter('recht.<seite>.freigabe', …)`. Der Platzhalter erscheint als Hinweis oben auf der Seite und verhindert den Release.

- Die Angaben im Impressum kommen aus `betrieb.mjs`.
- Nach der Freigabe `freigabe: null` setzen; der Hinweis oben auf der Seite entfällt dann. Wer stattdessen einen Vermerk als Text einträgt, sieht ihn als schlichten Hinweis ohne Platzhalterfläche. Wie ein solcher Vermerk lauten soll, ist im Code nicht festgelegt.
- Offene Rechtsfragen stehen als eigene Platzhalter im Text und sperren den Release ebenfalls: `recht.widerruf.notoeffnung` (Ausnahme für Notöffnungen) und `recht.barrierefreiheit.geltung` (gilt das Barrierefreiheitsstärkungsgesetz für den Betrieb?).
- Die rechtliche Prüfung nimmt ein Jurist vor (MENSCHEN §3).

## 7. Orte nachpflegen

`npm run orte` führt die Ortspipeline aus (Stufen 00 bis 90). Sie lädt die GeoNames-Archive, was einen Netzzugriff braucht, liest die Ortslisten aus der Git-Historie und schreibt neu:

- `src/daten/` (`orte.json`, `plz.json`, `slug-register.json`, `weiterleitungen.json`, `orte-unklar.json`, `orte-pruefliste.json`),
- `pipeline/orte/quellen.lock.json`, sobald sich eine Prüfsumme ändert,
- `_werkstatt/berichte/orte-abgleich.md` und `_werkstatt/berichte/orte-pipeline.md`.

Sichern oder committen Sie den Stand vorher. Danach zeigt `git diff --stat`, was sich geändert hat.

**Manuelle Zuordnung** in `pipeline/orte/zuordnung-manuell.json`: Das ist ein Objekt. Der Schlüssel lautet `Quellenkürzel:Slug`; Kürzel und Slug stehen in `.cache/orte/quellen.json`, das Stufe 10 erzeugt. Der Wert ist `"verwerfen"` oder `"gn:<GeoNames-ID>"`, wobei die ID aus `.cache/orte/gazetteer.json` stammt. Eine unbekannte ID bricht die Pipeline ab. Die Datei ist derzeit leer (`{}`).

Nach einer Änderung führen Sie `npm run orte` aus, damit die Zuordnung wirkt, und danach `npm run bauen` und `npm run pruefen`.

## 8. Ratgeber-Artikel anlegen

1. Das Muster `src/inhalte/ratgeber/schluesseldienst-abzocke-erkennen.mjs` als `src/inhalte/ratgeber/<id>.mjs` kopieren. Die ID aus Kleinbuchstaben und Bindestrichen wird zur Adresse `/ratgeber/<id>/`.
2. Die Felder anpassen: `titel`, `beschreibung`, `kategorie`, `kurztitel`, `h1`, `kurz`, `stand` (JJJJ-MM-TT), `wichtig`, `abschnitte`, `faq` und `weiter` (Einträge mit `pfad`, `titel`, `text`).
3. Die Abbildung `figur` ist optional. Zulässig sind `falle-riegel`, `tuer-schichten`, `grundriss`, `stufen`, `rechnung`, `fenster-schichten`, `objekte` und `zylinder`. Mit `figurText` kommt eine Bildunterschrift dazu.
4. Die ID in `RATGEBER` in `src/konfig/routen.mjs` eintragen. Die Reihenfolge dort ist die Reihenfolge der Übersicht. Ohne Eintrag wird der Artikel nicht gebaut.
5. Fakten nur über Faktenblätter in `src/inhalte/fakten/` verwenden; die Fakt-ID beginnt mit dem Blattnamen. Keine Rechtsaussage ohne geprüftes Faktenblatt.
6. Die Themenpässe in `src/konfig/themenpaesse.mjs` sind eine Arbeitsvorlage. Der Build prüft sie für Artikel nicht.
7. `npm run bauen` ausführen und die Seite in der Vorschau ansehen.

## 9. OG-Vorschaubilder neu erzeugen

`node _werkstatt/werkzeuge/og.mjs` schreibt elf PNG-Dateien nach `src/assets/og/`: `standard`, `leistungen`, `notoeffnung`, `einbruchschutz`, `sicherheitstechnik`, `einbau-tresore`, `preise`, `ratgeber`, `einsatzgebiet`, `ort-nah` und `ort-fern`. Die Optionen lauten `--nur <name>`, `--aus <ordner>` und `--klein`. Die Bildtexte stehen in der Liste `BILDER` im Skript und enthalten keinen Firmennamen.

Der Lauf braucht Chromium und die Werkzeugabhängigkeiten (`_werkstatt/werkzeuge/README.md`). Die Syntax stammt aus dem Skriptkopf; ein Probelauf vor dem Release ist sinnvoll.

## 10. Reihenfolge bis zum Release

1. Die Platzhalterliste oben ist leer.
2. `npm run pruefen` meldet keine Fehler und „ungeprüfte Fakten: 0“.
3. Der Deploy folgt [HOSTER-CHECKLISTE.md](HOSTER-CHECKLISTE.md).
