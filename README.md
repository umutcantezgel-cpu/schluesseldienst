# Website für einen Schlüsseldienst in Weilburg an der Lahn

Dieses Repository erzeugt die statische Website eines Schlüsseldienstes mit Sitz in Weilburg an der Lahn. Der Firmenname steht noch nicht fest; bis dahin stehen Platzhalter an den Stellen, die der Betrieb bestätigen muss. Die Seiten decken Notöffnung, Einbruchschutz, Sicherheitstechnik, Einbau und Tresore, Preise, das Einsatzgebiet mit Ortsseiten, Ratgeber, Kontakt und Recht ab, mit eigenen Texten.

Der Generator ist ein Node-Programm ohne Abhängigkeiten. Er erzeugt reines HTML, CSS und JavaScript, ohne Backend, ohne Drittanbieter und ohne Cookies.

**Stand:** Die Website baut als Vorschau mit `noindex`. Ein Release ist erst möglich, wenn die markierten Angaben vollständig sind. Was dazu noch fehlt, steht in [docs/OFFENE-PUNKTE.md](docs/OFFENE-PUNKTE.md).

## Voraussetzungen

- Node.js 22 (`.node-version`; `package.json` verlangt `>=22.12 <23`).
- Keine npm-Abhängigkeiten. `npm install` ist nicht nötig.
- Für den Plagiatstest und die Ortspipeline ein Git-Checkout mit vollständiger Historie, weil beide Vergleichsdaten aus der Historie lesen.

## Schnellstart

| Befehl | Wirkung |
|---|---|
| `npm run bauen` | Vorschau-Build nach `dist/` (noindex), etwa 11 Sekunden. |
| `npm run vorschau` | Lokaler Server für `dist/` auf `http://127.0.0.1:4173/` mit den Sicherheits-Headern aus `src/konfig/sicherheit.mjs` (ohne HSTS über http). Zuerst bauen; beenden mit Strg+C. |
| `npm test` | Tests mit `node:test`. |
| `npm run pruefen` | Messbuild mit allen elf Prüfern, etwa 40 Sekunden. Schreibt ebenfalls nach `dist/`; Exit-Code 1 bei Fehlern. |
| `npm run release` | Scheitert absichtlich, solange `betrieb.basisUrl` ein Platzhalter ist (siehe unten). |

**Was „Release scheitert an Platzhaltern“ bedeutet.** `npm run release` verlangt eine echte Adresse in `betrieb.basisUrl` (`https://` und die Domain, ohne Pfad). Solange dort der Platzhalter steht, bricht der Lauf sofort mit Exit-Code 2 ab und schreibt nichts. Ist die Adresse gesetzt, prüft der Release weiter und verweigert die Ausgabe bei Platzhaltern in der Konfiguration oder auf den Seiten, bei Fakten mit Status „verifizieren“, bei Fehlern der Prüfer und bei internen Links ohne Ziel. Dann endet der Lauf mit Exit-Code 1. In diesem Fall verschiebt der Build die Ausgabe nach `dist.verweigert/` (bzw. `<--aus>.verweigert/`); ein hochladbarer `dist/`-Ordner bleibt nicht zurück. Die Fehlermeldung nennt, was fehlt.

## Build-Modi und Schalter

| Schalter | Wirkung |
|---|---|
| (keiner) oder `--vorschau` | Vorschau mit `noindex`. Ohne Schalter ist das der Standard. |
| `--messen` | Indexierbar, Basis-Adresse lokal (`http://127.0.0.1:<port>`), für die Messwerkzeuge in `_werkstatt/`. |
| `--release` | Strikt. Basis-Adresse aus `betrieb.basisUrl`; `--ziel` ist Pflicht. |
| `--vorkomprimieren` | Legt zu jeder Textdatei `.br` und `.gz` an (nur wenn kleiner) und entfernt verwaiste Varianten. Nur ohne `--ziel` oder mit `--ziel=apache\|nginx`; Netlify und Cloudflare komprimieren selbst. Der Prüfer `sicherheit` (S14) verlangt zu jeder Variante die Quelldatei mit gleichem Inhalt. Dauer: beim ersten Lauf etwa 1 bis 1,5 Minuten zusätzlich, danach wenige Sekunden. |
| `--ziel=apache\|nginx\|netlify\|cloudflare` | Im Release: Apache `.htaccess` in der Ausgabe; Netlify und Cloudflare `_headers` und `_redirects`; nginx ein Snippet in `release/nginx/`, außerhalb der Ausgabe. In der Vorschau nur `netlify`, `cloudflare` oder `vercel` (Test-Deploy, siehe unten); `_headers` trägt dann zusätzlich `X-Robots-Tag: noindex`. |
| `--basis=https://host` | Nur Vorschau: Adresse für Canonicals, Sitemap und `security.txt` statt `http://127.0.0.1:<port>`, etwa die Test-Domain beim Hoster. Die Seiten bleiben `noindex`. |
| `--aus=<ordner>` | Ausgabeordner statt `dist/`, relativ zum Repository. Die Berichte liegen daneben, zum Beispiel `<ordner>.bau-bericht.json`. |
| `--nur=<pfadpräfix>` | Nur Seiten mit diesem Pfadanfang (plus 404). Räumt die Ausgabe nicht auf. |
| `--stichprobe=<n>` | Nur n Ortsseiten, zum Entwickeln. Verweise auf fehlende Orte sind dann erwartbar. |
| `--pruefen` | Führt alle Prüfer aus. Im Release immer. |
| `--datum=JJJJ-MM-TT` | Build-Datum für Sitemap und `security.txt`. Standard ist das Datum des letzten Commits. Ohne Git-Checkout ist `--datum` im Release Pflicht (sonst bricht er ab). |
| `--port=<n>` | Port der Basis-Adresse in Vorschau und Messung (Standard 4173). |
| `--still` | Nur Fehler und Hinweise auf der Konsole. |

Vorschau-Server: `node bau/vorschau.mjs [--aus <ordner>] [--port <n>] [--komprimieren]` – mit `--komprimieren` liefert er Textdateien gzip-komprimiert aus, wie ein Hoster mit Kompression (Messungen unter Produktionsbedingungen).

## Test-Deploy (Netlify, Vercel)

Bis die Angaben in [docs/BETRIEB.md](docs/BETRIEB.md) vollständig sind, gibt es keinen Release. Für eine Test-Domain lässt sich aber die Vorschau ausliefern: Platzhalter sichtbar, nicht indexierbar (meta robots `noindex`, `robots.txt` mit `Disallow: /`, Header `X-Robots-Tag: noindex`) und mit allen Sicherheits-Headern aus `src/konfig/sicherheit.mjs`.

- **Netlify:** Repository importieren. Die Einstellungen stehen in `netlify.toml`: Bau `node bau/bauen.mjs --ziel=netlify --basis=$URL`, ausgeliefert wird `dist/`. Die Header schreibt der Bau nach `dist/_headers`.
- **Vercel:** Repository importieren (Framework „Other“). Die Einstellungen stehen in `vercel.json`: Bau mit `--ziel=vercel` und der Projektadresse, ausgeliefert wird `dist/`, Header und Weiterleitungen stehen in der Datei selbst. `vercel.json` wird mit `npm run hoster` aus `src/konfig/sicherheit.mjs` erzeugt; passt sie nicht mehr, bricht der Bau ab. `.vercelignore` hält Rohdaten und `_werkstatt/` aus dem Bau heraus.
- Bei beiden Hostern eingeschleuste Skripte abschalten (Netlify Snippet Injection und Drawer, Vercel Toolbar); die strenge CSP blockiert sie sonst mit Konsolenfehlern. Einzelheiten und der Weg zum Release: [docs/HOSTER-CHECKLISTE.md](docs/HOSTER-CHECKLISTE.md), Abschnitt 4.

## Verzeichnisaufbau

- `bau/`: Generator (`bauen.mjs`), Vorschau-Server (`vorschau.mjs`), `lib/` mit Ausgabe, Assets, Platzhaltern, Faktenblöcken und Hoster-Dateien, `pruefen/` mit den Prüfern.
- `src/konfig/`: Betriebsdaten, Preise, Zonen, SEO, Sicherheitsregeln (`sicherheit.mjs`), Routen und Themenpässe. Hier tragen Sie die Angaben ein; siehe [docs/BETRIEB.md](docs/BETRIEB.md).
- `src/daten/`: Orts-, PLZ- und Weiterleitungsdaten sowie Prüflisten, teils von der Pipeline erzeugt.
- `src/inhalte/`: Texte als JavaScript-Module: Leistungen, Ortsseiten, Ratgeber, Faktenblätter (`fakten/`) und Rechtstexte (`recht/`).
- `src/vorlagen/`: Funktionen, die aus den Inhalten HTML erzeugen (`seiten/`, `teile/`, `layout.mjs`).
- `src/assets/`: CSS, JavaScript, Icons, Schriften und Vorschaubilder (`og/`).
- `pipeline/`: Ortspipeline (`orte/`, Befehl `npm run orte`) und das Skript für den Fingerabdruck des Plagiatsprüfers.
- `test/`: Tests mit `node:test`.
- `_werkstatt/`: Arbeitsunterlagen aus der Entstehung (Planung, Freigaben, Berichte, Prüfwerkzeuge). Sie gehören nicht zur Website und werden nicht ausgeliefert.
- `docs/`: Betriebsdokumente.
- `dist/`: Ausgabe des Builds. Nicht im Repository.

## Die elf Prüfer

Der Build führt die Prüfer mit `--pruefen` aus; im Release sind Fehler blockierend.

| Prüfer | Was er prüft |
|---|---|
| `budgets` | Größen von CSS, JavaScript, Schriften, Ortsseiten und Datenindizes |
| `ehrlichkeit` | Verbotene Aussagen und Floskeln in Titeln, Beschreibungen, Alt-Texten, strukturierten Daten und Fließtext |
| `emoji` | Emojis und Symbolzeichen als Gestaltungsmittel |
| `fakten` | Zahlen, Normen, Paragrafen und Fristen brauchen eine Quelle; zählt die ungeprüften Fakten |
| `icons` | Geometrie der Icons: Raster, aktive Fläche, Winkel und Bogenradien |
| `jsonld` | Strukturierte Daten: gültiges JSON, erlaubte Typen, keine Bewertungen, Preise in Euro |
| `links` | Interne Ziele und Anker existieren; Schreibweise der Pfade; Erreichbarkeit ab der Startseite |
| `plagiat` | Übernommene Textpassagen anhand einer Hash-Liste; Fehler ab zehn gleichen Wörtern in Folge, Warnung ab sieben |
| `seo` | Länge von Titel und Beschreibung, genau eine H1, Überschriftenfolge, Canonical, Sitemap |
| `sicherheit` | Linter S01–S21 über die gesamte Ausgabe: Skripte, Ressourcen, Formulare, Platzhalter |
| `token` | Werte in den Quelldateien nur über Designtokens |

## Sicherheit

1. **Content-Security-Policy mit Trusted Types.** Ressourcen dürfen nur von der eigenen Domain kommen. `trusted-types 'none'` erlaubt keine eigenen Policies. Quelle: `src/konfig/sicherheit.mjs`.
2. **Keine Drittanbieter, keine Cookies.** Skripte, Schriften, Bilder und Verbindungen kommen nur von der eigenen Domain. Der Quellcode setzt keine Cookies und nutzt keinen Browser-Speicher.
3. **Sicherheits-Kopfzeilen aus einer Quelle.** `kopfzeilen()` in `src/konfig/sicherheit.mjs` liefert alle Header. Daraus entstehen `_headers`, `.htaccess`, das nginx-Snippet und der Vorschau-Server. Der Hoster muss die Header ausliefern; siehe [docs/HOSTER-CHECKLISTE.md](docs/HOSTER-CHECKLISTE.md).
4. **Weiterleitungen nur geprüft.** Quelle und Ziel sind feste interne Pfade, das Ziel muss existieren, Ketten und Schleifen sind verboten (`bau/lib/hosting.mjs`).
5. **Kontakt per `mailto:`.** Es gibt kein Formular-Backend. Die Kontaktseite erzeugt eine E-Mail. Die Richtlinie erlaubt für Formulare nur `mailto:`.

## Weitere Dokumente

- [docs/BETRIEB.md](docs/BETRIEB.md): Was vor dem ersten Release eingetragen werden muss.
- [docs/OFFENE-PUNKTE.md](docs/OFFENE-PUNKTE.md): Alle offenen Punkte mit Zuständigkeit und Wirkung auf den Release.
- [docs/HOSTER-CHECKLISTE.md](docs/HOSTER-CHECKLISTE.md): Anforderungen an den Hoster, Domain und E-Mail, Ablauf eines Deploys.
- [docs/ZUSAMMENFUEHREN.md](docs/ZUSAMMENFUEHREN.md): Arbeitsbranch zusammenführen und zurückrollen, Umgang mit `_werkstatt/`.
- [docs/ENTSCHEIDUNGEN.md](docs/ENTSCHEIDUNGEN.md): Die wichtigsten Entscheidungen mit Problem und Grund.
- [docs/ORTE-ABGLEICH.md](docs/ORTE-ABGLEICH.md): Wie die Ortsliste aus GeoNames entsteht und geprüft wird.
- `_werkstatt/MENSCHEN.md`: Die Fragen an den Betrieb mit Begründung.
- `_werkstatt/werkzeuge/README.md`: Mess- und Prüfwerkzeuge für Browser und Live-Prüfung.

## Lizenz

Für dieses Repository ist noch keine Lizenz festgelegt; eine Lizenzdatei fehlt.
