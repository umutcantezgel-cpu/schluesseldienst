# E2-PRUEF-05 · Rolle Prüfer · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): bau/pruefen/ehrlichkeit.mjs, bau/pruefen/fakten.mjs, bau/pruefen/emoji.mjs, test/ehrlichkeit.test.mjs, test/fixtures/ehrlichkeit/** (neu)
Umfang: 3 Prüfer-Module + 1 Testdatei + Fixtures

## Rollenbriefing Prüfer
Du schreibst Prüfungen und Tests für neue Logik und berichtest knapp mit Belegpfaden. Häufige Fehler: deuten statt berichten; zu breite Muster (Fehlalarme) oder zu enge (Lücken).

## Aufgabe in einem Satz
Baue drei Prüfer für die gerenderte Website: Ehrlichkeit (verbotene Behauptungen, Marken, Dark Patterns, Floskeln), Fakten (Zahlen/Normen/§ nur mit Faktenbeleg) und Emoji (keine Emojis/Symbolzeichen als Gestaltungsmittel).

## Kern-Auszug
- K-004: nur `node:`-Module; Prüfer-Schnittstelle siehe `bau/pruefen/index.mjs` (lesen!): `export const name = '…'; export async function pruefe(ctx)` → `[{regel, schwere: 'fehler'|'warnung'|'info', datei, meldung}]`; `ctx.seiten = [{pfad, datei, html, typ, indexierbar}]`, `ctx.konfig.betrieb`, `ctx.konfig.preise`, `ctx.konfig.marken.freigegeben`, `ctx.modus`.
- K-010 Ton und Mikrotexte (wörtlich aus `_werkstatt/KERN.md` lesen, Abschnitt K-010) – daraus die Regeln.
- Muster für Prüfer-Code: `bau/pruefen/plagiat.mjs` (Textextraktion aus `<main>`, Entitäten dekodieren).
- Platzhalter erscheinen als `<span class="platzhalter" …>`, ungeprüfte Fakten als `<span class="verifizieren" data-fakt="id">`, geprüfte Fakten als `<span data-fakt="id">`. Aus Daten erzeugte Werte (PLZ, km, Preise, Datumsangaben) stehen in Elementen mit Attribut `data-daten` oder in `<time>` oder in Elementen mit Klasse `preis`.

## Prüfbereich (für alle drei Prüfer)
Je Seite: `<title>`, `<meta name="description">`, `og:title`/`og:description`, alle `alt=`-Attribute, alle JSON-LD-Blöcke (Stringwerte) und der sichtbare Text in `<main>` (Tags entfernt, Entitäten dekodiert). Nicht prüfen: `.platzhalter`-Spans (Inhalt), `<script type="application/json">`, Kopf/Fuß außerhalb `<main>` (außer bei Emoji: ganze Seite).

## Schritte
1. `bau/pruefen/ehrlichkeit.mjs` (name `ehrlichkeit`), Regeln (Groß/klein egal, Wortgrenzen beachten) – Ausgabe je Fund mit Regel-ID, Seite, Fundstelle (± 30 Zeichen):
   - `ehrlichkeit/minuten` fehler: Anfahrts-/Ankunftszeiten in Minuten (`\b\d+\s*(–|-|bis)?\s*\d*\s*(min|minuten)\b`), außer wenn `ctx.konfig.betrieb.anfahrtText` gesetzt ist (Eigenschaft gibt es noch nicht → immer prüfen).
   - `ehrlichkeit/rund-um-die-uhr` fehler: `24/7`, `24 h`, `24h`, `rund um die uhr`, `365 tage` – außer `ctx.konfig.betrieb.erreichbarkeit.rundUmDieUhr === true`.
   - `ehrlichkeit/festpreis` fehler: `festpreis` – außer die Preiskonfiguration enthält keinen Platzhalter (nutze `platzhalterIn` aus `bau/lib/platzhalter.mjs` auf `ctx.konfig.preise`; 0 Funde = erlaubt).
   - `ehrlichkeit/superlativ` fehler: `nr. 1`, `nummer 1`, `bester`, `beste schlüsseldienst`, `günstigste`, `billigste`, `schnellste`, `marktführer`.
   - `ehrlichkeit/garantie` fehler: `garantiert`, `garantie`, `100 %`, `100%`, `schadensfrei garantiert`.
   - `ehrlichkeit/alter-zertifikat` fehler: `seit (19|20)\d\d`, `\d+ jahre erfahrung`, `meisterbetrieb`, `zertifiziert`, `geprüfter betrieb`, `tüv`, `vds`, `polizeilich empfohlen`, `adac` – außer `ctx.konfig.betrieb.qualifikationen` enthält den Begriff.
   - `ehrlichkeit/bewertung` fehler: `sterne`, `★`, `☆`, `\d([.,]\d)?\s*/\s*5`, `bewertungen` mit Zahl davor (`\d+\s+bewertungen`), `kundenstimmen`, `google-bewertung`.
   - `ehrlichkeit/kostenlos` warnung: `kostenlos`, `gratis`, `umsonst`.
   - `ehrlichkeit/ortspraesenz` fehler: auf Seiten mit Pfad `/schluesseldienst-*/` **außer** `/schluesseldienst-weilburg/` und deren Ortsteilen (Pfad beginnt mit `/schluesseldienst-weilburg-`): `vor ort in`, `ihr schlüsseldienst (in|aus) <wort>`, `niederlassung`, `filiale`, `standort in`, `unser büro in`, `in ihrer nähe`. Auf allen anderen Seiten: `niederlassung`, `filiale` → fehler.
   - `ehrlichkeit/dark-pattern` fehler: `nur heute`, `nur noch \d+`, `countdown`, `jetzt oder nie`, `angebot endet`, `begrenzte? (anzahl|plätze|zeit)`, `schnell sein`.
   - `ehrlichkeit/floskel` warnung: `nahtlos`, `innovativ`, `ganzheitlich`, `entdecken sie`, `kompetent und zuverlässig`, `ihr partner in sachen`, `keine panik`, `handschlagqualität`, `alles was zugeht`, `alles, was zugeht`.
   - `ehrlichkeit/marke` fehler: Wortgrenzen-Treffer aus dieser Liste, außer in `ctx.konfig.marken.freigegeben`: Jablotron, UR FOG, URFOG, GEZE, SimonsVoss, Simons Voss, ABUS, BKS, EVVA, ekey, Yale, Wosta, ASSA ABLOY, IKON, effeff, Mediator, BASI, Secteo, KESO, Burg-Wächter, Burg Wächter, Hörmann, Winkhaus, Gretsch-Unitas, Mul-T-Lock, Kaba, dormakaba, Dorma, Somfy, Hikvision, Dahua, Daitem, Telenot, Lupus, Ajax Systems, Nuki, Bosch Sicherheit. (Achtung: keine allgemeinen Wörter wie „Dom“ aufnehmen.)
2. `bau/pruefen/fakten.mjs` (name `fakten`): Im sichtbaren Text von `<main>` gelten diese Muster als **Faktenangabe**: `§\s*\d+`, `Art\.\s*\d+`, `\b(DIN|EN|ISO|VdS)\s*(EN\s*)?\d{2,5}(-\d+)?\b`, `\bRC\s?\d\b`, `\b\d+([.,]\d+)?\s*(%|prozent)\b`, Jahreszahlen `\b(19|20)\d{2}\b`, Zeitdauern `\b\d+\s*(sekunden|stunden|jahre|jahren|monate|monaten)\b`, Geldbeträge `\b\d{1,3}(\.\d{3})*(,\d{2})?\s*(€|euro)\b`. Ein Fund ist **in Ordnung**, wenn er innerhalb eines Elements mit `data-fakt`, `data-daten`, `<time>` oder Klasse `preis`/`platzhalter` liegt (prüfe über die Verschachtelung im HTML, z. B. mit einem kleinen Tag-Stack-Parser über die `<main>`-HTML). Sonst `fakten/ohne-beleg` fehler mit Fundstelle. Zusätzlich `fakten/verifizieren` (info, im Release-Modus fehler): Anzahl der `class="verifizieren"`-Spans je Seite.
3. `bau/pruefen/emoji.mjs` (name `emoji`): ganze Seite (auch Kopf/Fuß und Attribute): Zeichen der Unicode-Eigenschaft `\p{Extended_Pictographic}` sowie die Liste `★☆✓✔✗✘☎☏▾▸►◄≡⏰▷✆⚠❗❕➜➔→←` → `emoji/zeichen` fehler. Ausnahme: die Pfeile `→` und `←` sind im Textinhalt erlaubt (Brotkrumen nutzen „←“ per CSS, nicht im HTML); prüfe sie nur in `<title>` und `meta description`.
4. Tests `test/ehrlichkeit.test.mjs` mit Fixture-Seiten in `test/fixtures/ehrlichkeit/` (je Regel mindestens 1 positiver und 1 negativer Fall, inkl.: Ortsseite außerhalb Weilburg mit „vor Ort in“ → fehler; Weilburg-Ortsteilseite → kein Fehler; Zahl in `<span data-fakt>` → ok; „DIN 18252“ ohne Beleg → fehler; „Dom“ → kein Marken-Treffer; Emoji in alt → fehler; Floskel → warnung). Erzeuge `ctx` in den Tests selbst (Minimal-Konfig).
5. Lauf: `node --test test/ehrlichkeit.test.mjs`; zusätzlich `node bau/bauen.mjs --pruefen` (die aktuelle Ausgabe hat nur 2 Seiten; Befunde nennen).

## Schnellprüfung und Selbstprüfung
- `node --check` aller Module; Tests grün; Laufzeit auf 6.000 synthetischen Seiten (Test mit einer 20-KB-Seite × 6.000 im Speicher) < 10 s – messen und nennen.
- Schreibrechte eingehalten (`git status --short`); nichts committet.
