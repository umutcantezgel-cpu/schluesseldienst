# Betrieb: Was vor dem ersten Release eingetragen werden muss

Dieses Dokument sagt, welche Angaben Sie eintragen müssen, wo und in welcher Reihenfolge. Die Angaben, die nur der Betrieb kennt (Firmendaten, Impressum, Erreichbarkeit, Preise, Zusagen, Leistungen je Zone), pflegen Sie in Supabase; der Abschnitt „Betriebswerte in Supabase“ beschreibt Einrichtung und Ablauf. Alles andere steht in den Dateien des Repositorys. Die Begründungen und die offenen Fragen stehen in `_werkstatt/MENSCHEN.md`; alle offenen Punkte fasst [OFFENE-PUNKTE.md](OFFENE-PUNKTE.md) zusammen.

## So erkennen Sie den Stand

Platzhalter sind sichtbar markiert, zum Beispiel mit „[Telefon fehlt]“. Der Release verweigert, solange einer übrig ist. `npm run bauen` zeigt die Anzahl (Zeile „Platzhalter: …“), die Zahl der ungeprüften Fakten und wie viele Betriebswerte aus Supabase übernommen sind (Zeile „Betriebswerte: …“).

Alle 58 Platzhalter der Konfiguration (`betrieb`, `preise`, `zonen`) mit Schlüssel, Beschriftung und Stand listet dieser Befehl. Er liest nur:

```sh
npm run betriebswerte -- --liste
```

Der Stand ist „übernommen“ (bestätigter Wert aus Supabase in `src/daten/betriebswerte.json`), „abgeleitet“ (die vier Uhrzeiten der Preis-Zeitfenster, aus dem Tagesband) oder „offen“. Die Platzhalter auf den Seiten entstehen aus diesen Angaben und aus den Inhaltsdateien. Sie verschwinden, wenn die Quelle gefüllt ist.

## Betriebswerte in Supabase (D-DATEN-01)

Die 54 Betriebswerte pflegen Sie im Supabase-Projekt `schluesseldienst`, Tabelle `betrieb.werte`, nicht in `src/konfig/*.mjs`: Dort bleiben diese Felder Platzhalter, und der Bau setzt die bestätigten Werte aus `src/daten/betriebswerte.json` ein. Besucher der Website erreichen Supabase nie; die Website bleibt statisch, und die Datenschutzerklärung ändert sich dadurch nicht.

**Ablauf**

1. Sie tragen einen Wert im Table Editor ein. Die Datenbank prüft beim Speichern die Form (Telefonnummer, Uhrzeiten, Beträge) und meldet Fehler auf Deutsch. Der Hinweis jeder Zeile sagt, was gemeint ist.
2. Sie setzen `bestaetigt` auf `true`. **Bestätigen heißt veröffentlichen:** Das Repository ist öffentlich (D-006). Der Wert steht beim nächsten Lauf im Pull Request, auch wenn Sie ihn nicht zusammenführen.
3. Zweimal täglich (03:23 und 15:23 UTC) oder von Hand (Actions → „Betriebswerte“ → „Run workflow“) liest `.github/workflows/betriebswerte.yml` die bestätigten Werte. Er prüft sie mit denselben Regeln wie der Bau (`bau/lib/betriebswerte.mjs`, auch über mehrere Werte hinweg: Anzeige und +49-Form nennen dieselbe Nummer, die PLZ gehört zu Weilburg, das Tagesband ist lückenlos). Hat sich etwas geändert, öffnet oder aktualisiert er einen Pull Request vom Zweig `betriebswerte/aktualisierung` mit einer Tabelle „bisher → neu“, den offenen Werten und dem Ergebnis von `npm test` und `npm run pruefen`. Ist eine Prüfung rot, beginnt der Titel mit „[Prüfung rot]“.
4. Sie prüfen den Pull Request. Ändern sich Telefon, E-Mail, Anschrift oder Domain, steht oben eine Warnung: **Rufen Sie die Nummer an**, bevor Sie zusammenführen (Schutz gegen eine untergeschobene Notrufnummer). Dann „Squash and merge“.
5. Erst der Bau aus `main` zeigt die Werte. Was nicht bestätigt ist, bleibt Platzhalter; der Release verweigert, solange einer offen ist.

Entspricht Supabase wieder dem Stand in `main`, schließt der nächste Lauf einen überholten Pull Request selbst. Bei ungültigen Werten endet der Lauf rot (GitHub schickt eine Fehlermail) und nennt Schlüssel und Grund; korrigieren Sie den Wert in Supabase, nicht in der Datei. Die Meldungen zeigen den Wert gekürzt; das sind nur bestätigte Werte, die ohnehin veröffentlicht werden. Werte, die wie ein Zugangsschlüssel aussehen, werden abgewiesen und nie wiederholt.

**Spalten der Tabelle `betrieb.werte`**

| Spalte | Bedeutung |
|---|---|
| `schluessel`, `beschriftung`, `typ`, `hinweis` | Kommen aus `startwerte.sql`; nicht ändern. |
| `wert_text` | Texte, Telefon, E-Mail, PLZ, Adresse der Website, Umsatzsteuer (`regel` oder `klein`) |
| `wert_euro` | Beträge in Euro, z. B. `129.90`; der Export rechnet in Cent um |
| `wert_ja_nein` | ja oder nein: Nachtdienst, Zusagen, Leistungen je Zone |
| `wert_json` | Zeiten und Tagesband als JSON (Beispiele unten) |
| `ohne_wert` | Beträge: „nach Absprache“. Impressumsangaben: Die Zeile entfällt. |
| `bestaetigt` | Freigabe zur Veröffentlichung |
| `notiz` | Eigene Notiz; wird nie exportiert |

Formate, die oft Fragen aufwerfen:

- **Erreichbarkeit** (`betrieb.zeiten`): `{"mo":[["08:00","18:00"]],"di":[["08:00","18:00"]],"mi":[["08:00","18:00"]],"do":[["08:00","18:00"]],"fr":[["08:00","18:00"]],"sa":[["09:00","13:00"]],"so":[]}`. Alle sieben Tage, höchstens drei Zeiträume je Tag, aufsteigend; eine leere Liste heißt „nicht erreichbar“. Über Mitternacht auf zwei Tage teilen (`["22:00","24:00"]` und `["00:00","06:00"]`).
- **Tagesband** (`preise.tagesband`): `{"werktags":[["nacht","00:00","07:00"],["werktag","07:00","18:00"],["abend","18:00","22:00"],["nacht","22:00","24:00"]],"wochenende":[["wochenende","00:00","24:00"]]}`. Je Tagesart lückenlos von 00:00 bis 24:00, jedes Zeitfenster mindestens einmal. Die Uhrzeiten der Preistabelle (`preise.zeit-*`) entstehen daraus.
- **Telefon:** Anzeige (`betrieb.telefon`) z. B. `06471 123456`, dieselbe Nummer international (`betrieb.telefon-e164`) als `+496471123456`. Eine freistehende Vierergruppe wie „2024“ anders gruppieren, sonst wirkt sie wie eine Jahreszahl.
- **Preise:** Gesamtpreis inkl. Umsatzsteuer und Anfahrt in Zone A, 10 bis 3.000 €; Anfahrt Zone B und C 0 € oder 1 bis 500 €. `ohne_wert` heißt „nach Absprache“.

**Nicht in Supabase:** Rechtstext-Freigaben und offene Rechtsfragen (`recht.*`), Zonenradien, `notoeffnung` und `indexierung` je Zone, `rundUmDieUhr`, Bewertungsprofil, Gründungsjahr, Qualifikationen, Team und Stellen. Sie gehören zu einer Textfassung im Repository und werden dort geändert (Abschnitte 1 bis 6).

**Einrichtung (einmal)**

1. **Datenbank:** `pipeline/betriebswerte/datenbank.sql`, danach `pipeline/betriebswerte/startwerte.sql` im Projekt ausführen (Claude über die Supabase-Verbindung oder der SQL-Editor). **Erledigt am 30.10.2026** als Migrationen `sd_0001_datenbank` und `sd_0002_startwerte`: 54 Zeilen, keine bestätigt; Advisors ohne Befund außer dem gewollten Hinweis „RLS enabled, no policy“ für `intern.lebenszeichen`. Beide Dateien lassen sich wiederholen und enthalten kein `DROP`; eingetragene Werte bleiben. Ändern sich Platzhalter in `src/konfig/*.mjs`, erzeugt `npm run betriebswerte -- --startwerte > pipeline/betriebswerte/startwerte.sql` die Datei neu; ein Test hält sie mit der Konfiguration gleich.
2. **Passwort der Rolle `sd_export`** (liest nur bestätigte Werte, höchstens 3 Verbindungen, 15 s je Abfrage): Im Passwortmanager ein Passwort mit mindestens 24 druckbaren ASCII-Zeichen erzeugen. Dann

   ```sh
   node pipeline/betriebswerte/scram-verifier.mjs
   ```

   ausführen und das Passwort eingeben (es wird nicht angezeigt). Die Ausgabe `alter role sd_export password 'SCRAM-SHA-256$…';` im SQL-Editor ausführen. So steht das Passwort weder in der Historie des Editors noch in Protokollen. Den Verifier im Passwortmanager aufbewahren: Nach einer Wiederherstellung oder einem Upgrade fehlen die Passwörter eigener Rollen und werden damit neu gesetzt.
3. **GitHub, Environment `betriebswerte`** (Settings → Environments → New environment): Unter „Deployment branches and tags“ nur `main` zulassen. Diese Secrets eintragen:

   | Secret | Wert |
   |---|---|
   | `SUPABASE_POOLER_HOST` | Host des Session Poolers, wie unter „Connect“ → „Session pooler“ angezeigt, ohne Port |
   | `SUPABASE_EXPORT_BENUTZER` | `sd_export.<Projekt-Ref>` |
   | `SUPABASE_EXPORT_PASSWORT` | das Passwort aus Schritt 2 |
   | `SUPABASE_CA_ZERTIFIKAT` | Inhalt der CA-Datei (Database → Settings → SSL Configuration → „Download certificate“), mit BEGIN- und END-Zeile |

4. **Repository:** Settings → Actions → General → Workflow permissions: „Allow GitHub Actions to create and approve pull requests“ einschalten. Ohne diese Einstellung kann der Workflow keinen Pull Request öffnen.
5. **Erster Lauf:** Actions → „Betriebswerte“ → „Run workflow“ auf `main`. Erwartet: grün mit „Export und Lebenszeichen: ok“. Bis die Secrets eingetragen sind, endet jeder Lauf grün mit der Warnung „noch nicht eingerichtet“, ohne Fehlermail.

**Wach bleiben:** Jeder Lauf liest aus der Datenbank und setzt das Lebenszeichen `betriebswerte` (Tabelle `intern.lebenszeichen`). Das hält das kostenlose Projekt aktiv; Supabase pausiert es sonst nach einer Woche ohne Zugriff. GitHub schaltet Zeitpläne in öffentlichen Repositorys nach 60 Tagen ohne Aktivität ab; der Workflow schaltet sich bei jedem Lauf wieder ein, ob das die Frist verlängert, sagt GitHub nicht. Ob er läuft, zeigt das Lebenszeichen. Fehlermails zu Zeitplänen schickt GitHub an die Person, die die Zeitpläne zuletzt geändert hat; führen Sie den Pull Request mit dem Workflow deshalb selbst zusammen.

**Lokal ausprobieren:** `npm run bauen -- --werte=test/fixtures/betriebswerte/voll.json` baut die Vorschau mit erfundenen Testwerten, `--werte=keine` ohne Schnappschuss. Beides gilt nur für Vorschau und Messbau. Der Release liest immer `src/daten/betriebswerte.json` und verlangt, dass die Datei unverändert committet ist.

## 1. `src/konfig/betrieb.mjs`

Felder mit einem Schlüssel in der Spalte „Supabase“ tragen Sie in Supabase ein (Abschnitt „Betriebswerte in Supabase“); in der Datei bleiben sie Platzhalter. Die übrigen Felder ändern Sie in der Datei.

| Feld | Supabase | Was eintragen | Hinweis |
|---|---|---|---|
| `name`, `rechtsform`, `inhaber` | `betrieb.name`, `betrieb.rechtsform`, `betrieb.inhaber` | Firmenname, Rechtsform, Inhaber oder Vertretungsberechtigte | Der Firmenname erscheint als Wortmarke und im Impressum. |
| `adresse.strasse`, `adresse.plz` | `betrieb.strasse`, `betrieb.plz` | Anschrift in Weilburg | Der Ort ist fest auf Weilburg gesetzt; die PLZ muss laut `src/daten/plz.json` zu Weilburg gehören. |
| `telefon.anzeige`, `telefon.e164` | `betrieb.telefon`, `betrieb.telefon-e164` | Notrufnummer als Anzeige und im Format `+49…` | Die Rufleiste zeigt die Nummer auf jeder Seite. |
| `email` | `betrieb.email` | Adresse für Kontakt und Anfragen | Dieselbe Adresse steht in `security.txt`. Solange der Platzhalter steht, schreibt der Build `sicherheit@example.invalid` dorthin. |
| `erreichbarkeit.zeiten`, `erreichbarkeit.nachtdienst` | `betrieb.zeiten`, `betrieb.nachtdienst` | Zeiten je Wochentag; Nachtdienst ja oder nein | Ohne Angabe zeigt die Rufleiste nur die Nummer. |
| `impressum.register`, `ustId`, `kammer`, `berufsbezeichnung`, `verantwortlichMStV`, `vsbg` | `impressum.register`, `impressum.ust-id`, `impressum.kammer`, `impressum.berufsbezeichnung`, `impressum.mstv`, `impressum.vsbg` | Angaben nach MENSCHEN §1 | Nichts erfinden. Ein Eintrag wie „kein Registereintrag“ ist eine gültige Angabe; `ohne_wert` lässt die Zeile entfallen. |
| `zusagen.preisVorAuftrag`, `rechnungMitPositionen`, `kartenzahlung`, `erfolglos` | `zusagen.preis-vor-auftrag`, `zusagen.rechnung-positionen`, `zusagen.kartenzahlung`, `zusagen.erfolglos` | ja, wenn der Betrieb die Zusage gibt; nein für die neutrale Fassung | Bei ja zeigt die Vorlage den Zusagentext. Bei nein zeigt sie den neutralen Text oder nichts. |
| `bewertungen.profilUrl` | – | Link zum Bewertungsprofil, nur mit Nachweis | Ohne Eintrag gibt es keine Bewertungsangaben. |
| `gruendungsjahr`, `qualifikationen`, `team` | – | Nur mit Nachweis eintragen | Die Über-uns-Seite zeigt sie nur, wenn sie gefüllt sind. |
| `stellen` | – | Stellenangebote | Ohne Eintrag entsteht keine Karriere-Seite. |
| `basisUrl` | `betrieb.basis-url` | `https://` und die Domain, ohne Pfad und ohne Schrägstrich | Erlaubt sind Kleinbuchstaben, Ziffern, Punkt und Bindestrich. Der Release prüft das Format. |

## 2. `src/konfig/preise.mjs`

Die Preisangaben kommen aus Supabase (Schlüssel in Klammern); in der Datei bleiben sie Platzhalter. Fest in der Datei stehen die Zeitfenster, die Positionen, Zone A (`0`) und Zone D (`null`).

- **`ustModus`** (`preise.ust-modus`): `klein` für Kleinunternehmer; dann erscheint kein Satz „inkl. MwSt.“. `regel` ergibt den Satz „Alle Preise enthalten die Umsatzsteuer.“. Andere Werte nimmt die Übernahme nicht an.
- **`zeitfenster[].zeit`** (abgeleitet): Uhrzeit oder Zeitraum je Zeitfenster als Text. Der Bau bildet sie aus dem Tagesband, etwa „Mo–Fr 07:00–18:00“; sie gehören nicht in Supabase.
- **`tagesband`** (`preise.tagesband`): Objekt mit `werktags` und `wochenende`. Jede Liste enthält Einträge `[Zeitfenster-ID, von, bis]`, etwa `['nacht', '00:00', '07:00']`. Die Zeiten müssen lückenlos von 00:00 bis 24:00 reichen. Ein fehlerhaftes Tagesband nimmt die Übernahme nicht an; in der Datei bricht es den Build mit der Meldung „preise.tagesband ungültig“ ab. Feiertage gelten wie das Wochenende; der Preisrechner erkennt sie nicht.
- **`positionen[].preise`** (`preise.<position>.<zeitfenster>`, 24 Werte): Gesamtpreis je Zeitfenster, inklusive Umsatzsteuer und Anfahrt in Zone A. In Supabase in Euro, in der Datei in Cent als ganze Zahl (12990 steht für 129,90 €). Ohne Wert bzw. `null` zeigt „nach Absprache“.
- **`anfahrt`** (`preise.anfahrt-b`, `preise.anfahrt-c`): Aufschlag je Zone. Zone A ist `0`, weil die Anfahrt in den Positionen steckt. Zone D steht auf `null` („nach Absprache“). Die Texte sagen heute für Zone B „fester Aufschlag je Einsatz“ und für Zone C „nach Absprache“; weicht der Wert davon ab, meldet die Übernahme einen Hinweis.
- **`zahlarten`** (`preise.zahlarten`): Die Zahlarten als Text, ohne Beträge und ohne Aufschläge (§ 270a BGB).

## 3. `src/konfig/zonen.mjs`

- **`bisKm`** je Zone: A bis 20 km (mit dem Landkreis Limburg-Weilburg), B bis 50 km, C bis 100 km, D darüber. Die Radien bestätigen oder ändern (MENSCHEN §2), danach bauen und prüfen.
- **`leistungenBestaetigt`** je Zone (Supabase: `zonen.a.leistungen` bis `zonen.d.leistungen`): ja zeigt die Leistungen dieser Zone auf den Ortsseiten, nein blendet den Abschnitt aus. Solange der Platzhalter steht, erscheint der Hinweis „[Leistungen in Zone X bestätigen]“.
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

1. `npm run betriebswerte -- --liste` meldet „0 offen“, und der Pull Request der letzten Übernahme ist zusammengeführt.
2. `npm run pruefen` meldet keine Fehler und „ungeprüfte Fakten: 0“.
3. Der Deploy folgt [HOSTER-CHECKLISTE.md](HOSTER-CHECKLISTE.md).
