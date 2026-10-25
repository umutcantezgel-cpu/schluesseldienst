# Plan – Eigene statische Schlüsseldienst-Website (Sitz Weilburg) aus zwei Wettbewerber-Exporten

## Context
- Das Repo enthält nur Rohdaten, keinen Code:
  - **Richter** (richter-sicherheitstechnik.de, Contao): 1.400 gescrapte Seiten = 23 Kern-/Produktseiten, Sitemap, 1.376 Ortsseiten. Die Sitemap nennt 5.308 Orte (davon 50 NL), 24 Produkt-, 7 News-Seiten und sitemap.html. Die Standorte-Seite listet alle Orte je Bundesland.
  - **Adam** (schluesseldienst-adam.de, React-SPA, Hochheim): 10 Seiten als ZIP. Die Sitemap nennt 550 URLs: 5 Leistungen, Preise, Einsatzgebiete, In der Nähe, Blog (6), Impressum/Datenschutz, 532 Rhein-Main-Orte.
  - Beide Ortsbestände sind Schablonen bzw. gesponnener Text, ohne Querverlinkung. Beide Sites nutzen Google Maps, YouTube und Analytics.
- **Ziel:** eine eigene, rein statische Website (HTML/CSS/Vanilla-JS) für einen neuen Schlüsseldienst mit Sitz in **Weilburg**. Sie deckt alle Themen beider Sites ab, legt Doppeltes zusammen, ist SEO-stark und so sicher wie technisch möglich.
- Gearbeitet wird nach dem Master-Auftrag des Nutzers (Gedächtnis in `_werkstatt/`, Opus orchestriert, Haiku baut nach Muster und prüft, Etappen und Wellen, Abnahme Z-01…Z-10).
- **Quellen der Entscheidungen:**
  - Erkundung: 3 Agenten.
  - Design-Panel: 3 Perspektiven; die Berichte werden in E0 nach `_werkstatt/berichte/` gesichert.
  - Kritik-Panel: 3 Linsen; alle Korrekturen sind unten eingearbeitet. **Wo ein Panel-Bericht abweicht, gilt dieser Plan.** Die Berichte bekommen einen Kopfvermerk „überholt durch PLAN“, und ENTSCHEIDUNGEN.md führt die Liste der überholten Punkte.

## Entscheidungen des Nutzers (verbindlich)
- Name, Telefon, Adresse, Rechts- und Preisdaten sind unbekannt → eine zentrale Konfiguration mit markierten Platzhaltern. Release nur ohne Platzhalter.
- **Sitz Weilburg.** Ortsseiten entstehen für **alle Orte beider Sitemaps** (Seed ~5.800) plus **alle umliegenden Orte um Weilburg** (Radius 30 km, ANNAHME). Das Risiko von Brückenseiten bei Google ist akzeptiert.
- **Alle vier Leistungsgruppen**; die eigene Preisliste folgt.

## Leitplanken (nicht verhandelbar)
- **Nichts kopieren:** keine fremden Texte, Bilder, Logos, Bewertungen, Teamdaten, Preise, Slogans, Rechtstexte oder Markennamen (UrhG/UWG/MarkenG).
  - Übernommen werden nur Seiteninventar, Themen, Suchbegriff-Abdeckung und Ortsnamen als Auswahl-Seed.
  - Alle Ortsfakten (Schreibweise, PLZ, Kreis, Koordinaten) stammen aus GeoNames.
  - Das Restrisiko des Datenbankrechts (§ 87b UrhG) wird in ENTSCHEIDUNGEN.md und MENSCHEN.md festgehalten.
- **Nichts erfinden:** keine Bewertungen, Sterne, Minuten, „seit X Jahren“, Zertifikate oder „24/7“ ohne Beleg in der Konfiguration. Keine Niederlassungs-Behauptung außerhalb Weilburgs.
- **Ehrliche Titel:** In den Zonen C/D und NL nennen Titel, H1 und Meta Sitz und Entfernung, z. B. „Schlüsseldienst für {Ort} – aus Weilburg (≈ {d} km)“. Leistungen einer Zone erscheinen nur, wenn der Mensch `zonen.X.leistungenBestaetigt` gesetzt hat; ohne diese Bestätigung kein Release.
- **Keine Drittanbieter:** keine Maps, YouTube, Analytics, Google Fonts, Cookies oder Storage → kein Cookie-Banner. Keine Dark Patterns.
- **Begriff „Platzhalter“:** Der harte Katalog meint Füll- und Blindtext sowie erfundene Werte; davon gibt es null. Konfigurationslücken (Name, Preise …) erscheinen sichtbar als `data-platzhalter`, werden gezählt und als UMGEBUNGSAUSNAHME geführt (Liste in MENSCHEN.md). Release-Builds sperren sie hart, ebenso alle `VERIFIZIEREN`-Fakten.

## Architektur (Zero-Dependency-Generator, Node 22, nur `node:`-Module)
```
package.json (nur Skripte) · .node-version 22 · README.md
src/konfig/  betrieb.mjs (Impressum-Pflichtfelder) preise.mjs (ustModus, anfahrtJeKm) zonen.mjs leistungen.mjs
             navigation.mjs sicherheit.mjs seo.mjs marken.mjs quellen.mjs (Allowlist externer Belege)
src/daten/   orte.json (committet, 1 Datensatz/Zeile) orte-unklar.json slug-register.json bundeslaender.json
             quellen-abdeckung.json (alle 49 R- und 18 A-Kern-URLs → Ziel oder „entfällt“ mit Grund) lastmod.json
src/inhalte/ eigene Texte als Module (Mini-Syntax), Faktenblätter je Themenpass
src/vorlagen/ layout.mjs, teile/*.mjs, seiten/*.mjs   · Registries per Verzeichnis-Scan
src/assets/  css/token.css basis.css layout.css komponenten/*.css bewegung.css · js/module/ js/logik/
             schriften/ (+ OFL.txt) · icons/*.svg · og/*.png
bau/         bauen.mjs vorschau.mjs paket.mjs lib/ pruefen/ (fingerabdruck.json = nur Hashes)
pipeline/orte/ 00-laden … 90-pruefen.mjs, regeln.json, zuordnung-manuell.json, gold.json, quellen.lock.json
test/        node:test
_werkstatt/  Lauf-Gedächtnis; werkzeuge/ (package.json + Lockfile; node_modules außerhalb des Repos)
dist/ .cache/ release/ → gitignored
```
- **Build-Modi:**
  - `--vorschau` (Standard): `noindex`, robots `Disallow: /`, Platzhalter sichtbar.
  - `--messen`: indexierbar, Origin `http://127.0.0.1:4173`, nie deploybar; dient allen Messungen.
  - `--release`: strikt; scheitert an Platzhaltern, `VERIFIZIEREN`, fehlenden Pflichtfeldern oder roten Prüfungen.
  - Mit `--ziel=apache|nginx|netlify|cloudflare` wird nur die passende Hoster-Datei geschrieben.
- **Ansehen ohne committetes `dist/`:** `node bau/bauen.mjs && node bau/vorschau.mjs` → http://127.0.0.1:4173. `node bau/paket.mjs --vorschau` erzeugt ein Upload-Archiv für Tests. Das steht im README.
  - `dist/` wird nicht committet: ~6.400 Dateien und ~108 MB, die bei jeder Vorlagenänderung komplett neu geschrieben würden.
  - Bildsätze der Hauptansichten gehen komprimiert (≤ 1.440 px) ins Repo.
- **Escaping ist Pflicht** (`bau/lib/html.mjs`): `html`` ` escaped jeden Wert, `attrUrl()` nutzt eine Schema-Allowlist, `jsonLd()` escaped `<`, U+2028 und U+2029. Rohes HTML gibt es nur in `bau/lib`, erzwungen durch einen Quelltext-Linter.
- **Determinismus:** Das Verbot von `Date.now`/`Math.random` gilt nur für `bau/`, `pipeline/` und `src/{konfig,vorlagen,inhalte}`. Datum aus dem Commit, `Intl.Collator('de')`. Ein Test baut zweimal und vergleicht. Die Fußzeile „Stand“ entfällt auf Ortsseiten.
- **Single-Thread-Build** (Schätzung 3–5 s für ~6.000 Seiten). Schreiben nur bei Änderung. Jeder Haiku-Slot baut in einen eigenen Ausgabeordner mit eigenem Port (`--aus=.cache/slot-N`, Port 4173+N). Messungen laufen exklusiv mit einer Sperrdatei.

## Orts-Datenpipeline (`node pipeline/orte/alle.mjs`)
1. **Rohdaten** liest die Pipeline aus dem Git-Commit `ad81157` (`git archive` → `.cache/roh/`); ZIPs nur per `unzip -p`. Zusicherungen: 5.308 / 5.357 / 532 Datensätze.
2. **GeoNames** DE/NL (Gazetteer und PLZ, CC BY 4.0) liegen in getrennten Ordnern, weil beide Archive `DE.txt` heißen.
   - `quellen.lock.json` pinnt den gecachten Schnappschuss. Neu eingelesen wird nur mit `--neu-einlesen` und Diff-Bericht.
   - `orte.json` ist die committete Wahrheit.
3. **Abgleich:**
   - Normalisierung: ä→ae, ß→ss, Diakritika weg, St.→sankt, i.→im.
   - Punkte: Name 10 / Kern 6 / Alternativname 4. Gemeinde oder Kreis +4, wenn admin4 bzw. admin3 übereinstimmt oder der Ort ≤ 25 km entfernt ist; −4 erst ab > 40 km. Land +3, Region +3, Typ +1/+2.
   - Als Zweitbester zählt nur ein anderes admin4-Cluster oder ein Kandidat > 5 km entfernt.
   - Opus labelt 150 geschichtete Gold-Datensätze. Die Schwelle wird auf Präzision ≥ 99 % kalibriert; der Recall wird berichtet.
   - Sonderfälle: Bremen (zwei Schreibweisen), „Berlin Hennigsdorf/Oranienburg“, Slug-Suffixe, Kastel, „, Gießen“ als Kreis-Hinweis.
   - Unklare Orte werden nicht veröffentlicht. Opus löst sie über `zuordnung-manuell.json`; Ziel ≤ 2 % unklar, kein HALT.
4. **Umkreis:** Alle Orte im Radius 30 km um Weilburg, die noch fehlen, kommen hinzu. Ausgeschlossen sind PPLH/PPLQ/PPLW. PPLX ohne admin4 sowie Mühlen und Höfe gehen in die Prüfliste.
5. **Anreicherung:**
   - PLZ, Gemeinde, Kreis, Land.
   - km (Haversine) und Himmelsrichtung von Weilburg.
   - Nachbarn symmetrisiert (≤ 10) für ≥ 3 eingehende Links.
   - Ortsteile je Gemeinde, Zone.
6. **Zonen** (ANNAHME, in der Konfiguration):

   | Zone | Bereich | Notöffnung |
   |---|---|---|
   | A „Kern“ | Landkreis Limburg-Weilburg ∪ ≤ 20 km | ja |
   | B „Umland“ | ≤ 50 km | ja |
   | C „Region“ | ≤ 100 km | nach Absprache |
   | D „Überregional“ | > 100 km | nach Absprache |
   | NL | immer D-Regeln | nach Absprache |

   - **NL-Seiten** sind deutschsprachig, **ohne Preise** (die USt-Frage in den Niederlanden ist offen) und ohne Landesregel-Block. Hubs unter `/einsatzgebiet/niederlande/{provinz}/`. Die Sprache klärt MENSCHEN.md.
   - Ein Schalter `indexierung` je Zone dient als Notbremse; Standard ist alles indexiert.
7. **Slugs:**
   - Gemeinde `/schluesseldienst-{gemeinde}/`, Ortsteil `/schluesseldienst-{gemeinde}-{ortsteil}/`.
   - Kollisionen erhalten `-{kreis}`, in NL `-nl`.
   - Das Register ist append-only; geänderte Slugs werden per 301 weitergeleitet.
   - Titel unterscheiden Namensdoppel mit `{Ort} ({Gemeinde})` → `+Kreis` → `+Land`; der Kreis wird nie gekürzt, über 60 Zeichen gibt es bei Ortsseiten nur eine Warnung.

## Sicherheit
- **CSP** als Header, dazu ein Meta-Fallback ohne `frame-ancestors`:
  `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; manifest-src 'self'; form-action mailto:; frame-ancestors 'none'; base-uri 'none'; object-src 'none'; require-trusted-types-for 'script'; trusted-types 'none'`
  - Ohne `upgrade-insecure-requests`, ohne jedes Inline-Script oder -Style (auch kein Hash-Snippet) und ohne `style=`-Attribute.
  - Die Kartennadel und die Peilung werden über SVG-Attribute (`transform`/`cx`/`cy`) gesetzt, `view-transition-name` nur über Klassen.
  - Icons stehen pro Seite als inline `<symbol>`, damit kein externer Sprite nötig ist.
  - JSON-LD ist ein Datenblock und wird nicht ausgeführt.
- **Header:**
  - HSTS 2 Jahre (`preload` erst nach Freigabe).
  - `nosniff`, `X-Frame-Options DENY`, `Referrer-Policy no-referrer`.
  - COOP `same-origin`, COEP `require-corp`, CORP `same-origin`, `Origin-Agent-Cluster`.
  - Permissions-Policy: alles verboten (inkl. Geolocation und Zwischenablage); die Liste wird gegen Chromium bereinigt.
  - Cache: HTML `no-cache`; Assets und Daten 1 Jahr `immutable`. `/daten/*` bekommt `X-Robots-Tag: noindex`, ohne robots-Disallow.
  - Vollständige MIME-Liste (`.webmanifest`, `.avif`, `.woff2`, charset).
- **Hoster-Konfigurationen** (`_headers`, `.htaccess`, nginx-Snippet, Vorschau-Server) entstehen alle aus `sicherheit.mjs`.
  - Weiterleitungen nur mit absolutem, fest eingetragenem Host (nie `HTTP_HOST`/`$host`), Pfad-Regex `^/[a-z0-9/-]*$`, und nur wenn das Ziel existiert.
  - Tests gegen `//`, `/\` und `%2F%2F` (Open Redirect).
  - nginx: `default_server 444`, Dotfiles gesperrt.
  - Die Hoster-Checkliste in MENSCHEN.md verlangt, dass Rocket Loader, E-Mail-Verschleierung und Snippet-Injection aus sind.
  - `werkzeuge/live-check.mjs` prüft nach dem Deploy Header, MIME, 404-Status und Weiterleitungen.
- **Client-JS:**
  - nur `createElement`/`textContent`/`replaceChildren`;
  - `fetch` nur auf `/daten/` mit SRI;
  - kein `eval`, kein `innerHTML`; Trusted Types setzen das hart durch.
  - Orts- und PLZ-Index liegen als **je eine Datei** vor (~70 KB bzw. ~40 KB gzip) und laden erst beim Fokus des Suchfelds, damit Server-Logs keine Region des Nutzers verraten.
- **Kontakt ohne Backend:**
  - `tel:` und `mailto:` sind immer sichtbar.
  - Der Composer erzeugt eine `mailto:`-URL: Header-Injection-Schutz, kodierte Länge ≤ 1.900 Zeichen, Hinweis „keine Codes oder Alarmdaten per E-Mail“.
  - Ohne Erfolgsmeldung, ohne Einwilligungs-Häkchen (Art. 6 Abs. 1 lit. b), ohne Honeypot.
  - Kein Kopierknopf. „In der Nähe“ funktioniert über die PLZ-Prüfung, nicht über Geolocation.
- **Sicherheits-Linter über `dist/`** (S01–S21, jede Verletzung = Abbruch):
  - kein Inline-Script/-Style, keine `on*`-Handler, keine fremden Ressourcen, keine iframes, keine HTML-Kommentare;
  - SRI stimmt;
  - Geheimnis-Muster (`AIza…`, site-verification, GA/GTM, Schlüssel) sowie Telefonnummern, Domains und Namen der Wettbewerber, abgeglichen über `fingerabdruck.json` (nur Hashes);
  - Datei-Allowlist; externe Links nur aus `quellen.mjs` mit `noopener noreferrer`;
  - Header-Gleichheit aller Konfigurationen;
  - Platzhalter und `VERIFIZIEREN`.
- **Weitere Prüfer:**
  - **Plagiat:** 64-bit-Schindeln mit exaktem Gegenabgleich, nur Fließtext. Abbruch ab ≥ 10 gleichen Wörtern in Folge, 7–9 werden berichtet.
  - **Ehrlichkeit:** Minuten, Sterne, Jahre, Zertifikate, Niederlassungs-Behauptung, Dark Patterns, Marken-Sperrliste (Jablotron, UR FOG, GEZE, SimonsVoss, ABUS, BKS, EVVA, „VdS“, „polizeilich empfohlen“ …); Freigaben nur über `marken.mjs`.
  - **Fakten:** Jede Zahl, Norm, jeder § und jede Prozentangabe braucht einen Treffer im Faktenblatt.
  - Außerdem: JSON-LD, Linkgraph, vnu (HTML-Validität), Token-Linter (Werte außerhalb der Tokens), Emoji-Linter, Budgets.
- **Lieferkette:** Die Werkzeuge sind exakt gepinnt (`playwright-core` 1.63.0 passend zum installierten Chromium, lighthouse, axe-core, svgo, vnu-jar, @fontsource). Installiert wird mit `npm ci --ignore-scripts` und `npm audit signatures`, nur Versionen ≥ 14 Tage alt, Start mit `env -i`.

## Recht und Fakten
- **Impressum (§ 5 DDG):** Name, Rechtsform, Vertretungsberechtigte, Anschrift, Kontakt, Register, USt-IdNr./W-IdNr., Kammer und Berufsbezeichnung, § 18 Abs. 2 MStV, § 36 VSBG; ohne OS-Link. Alles sind Release-Pflichtfelder. Impressum und Datenschutz sind überall sichtbar, auch auf der 404-Seite.
- **Datenschutz-Entwurf:** Hosting-Logs, E-Mail- und Telefonkontakt, § 25 TDDDG (keine Cookies).
- **Seite `/widerruf/`:** planbare Fernabsatz-Aufträge (Ausnahme § 312g Abs. 2 Nr. 11).
- **`/barrierefreiheit/`:** freiwillige Erklärung.
- **`/quellen-lizenzen/`:** GeoNames CC BY 4.0, „verändert“; OFL.
- **PAngV:**
  - Gesamtpreise inkl. USt und Anfahrt, `ustModus` (Regel- oder Kleinunternehmer).
  - Zahlart-Zuschläge sind verboten (ein Test prüft das).
  - Der Rechner zeigt immer den Gesamtpreis.
  - `Offer` in JSON-LD nur mit echten Preisen.
- **Faktenblätter:** Ratgeber und Landesregeln (Rauchmelderpflicht, KfW-Status 2026, § 35a EStG, WaffG, DIN/EN-Normen) werden gegen Primärquellen recherchiert, als `VERIFIZIEREN` markiert und vom Menschen freigegeben (redaktionelle Verantwortung, KI-VO Art. 50).

## Seitenstruktur (Zusammenlegung, exakt)

| Ziel | Quellen (R = Richter, A = Adam) |
|---|---|
| `/` | R `/` + A `/` |
| `/notoeffnung/` + `tueroeffnung/`, `autooeffnung/`, `garagenoeffnung/`, `tresoroeffnung/`, `einbruchschaden/` (5) | R notoeffnungen, einbruchschaden-beseitigung; A tuer-, auto-, garage-, tresoroeffnung |
| `/einbruchschutz/` + `schliesszylinder/`, `schliessanlagen/`, `tuerschloesser/`, `zusatzschloesser/`, `schutzbeschlaege/`, `tuersicherung/`, `fenstersicherung/`, `tuerschliesser/` (8) | R 14 Produktslugs: schliesszylinder, id-3-ax-zylinder, k10-wendeschluesselsystem, schliessanlagen, einsteckschloss, kastenzusatzschloss, querriegelschloss, schutzbeschlag, schutzbeschlag-europa, bandsicherung, schliessblech, fenster-tuersicherung, pilzkopfverriegelung, tuerschliesser – markenneutral |
| `/sicherheitstechnik/` + `alarmanlagen/`, `videoueberwachung/`, `nebelsysteme/`, `rauchmelder/` (4) | R alarmanlage-ja-100, funk-aussensirene, bewegungsmelder, gsm-kamera, ur-fog-nebelsysteme, rauchmelder |
| `/einbau-tresore/` + `sicherheitstueren/`, `sicherheitsfenster/`, `moebeltresore/`, `wertschutzschraenke/`, `datensicherungsschraenke/`, `waffenschraenke/` (6) | A tuer-fenstereinbau; R elektronik-moebel-tresore, wertschutzschraenke, tresore-datensicherungsschraenke, waffenschraenke |
| `/leistungen/` | R sicherungstechnik + produkt-details (Gesamtregister mit Gruppenfilter) |
| `/preise/` | A preise (Zonenpreise, Zuschläge, Zahlarten, Preisrechner) |
| `/einsatzgebiet/` (+ PLZ-Prüfung) · `/einsatzgebiet/{land}/` · `/einsatzgebiet/{land}/{kreis}/` | R standorte; A einsatzgebiete, in-der-naehe. Hubs nur für Länder mit Orten, Stadtstaaten ohne Kreisebene |
| `/schluesseldienst-{slug}/` (~6.000) | alle Ortsseiten beider Sites (R schluesseldienst-*/slotenmaker-*, A /{ort}) + neue Orte um Weilburg; die **Weilburg-Seite schreibt Opus von Hand** |
| `/suche/` | R suche (statischer Index aus Seiten und Orten) |
| `/sitemap/` | R sitemap.html (HTML-Sitemap) |
| `/ratgeber/` + 19 Artikel | R aktuelle-news, news-leser, 7 News, achtung-abzocker, galerie-kurioses (als Artikel „Schäden durch Feuerwehr, Selbstversuch, Einbruch“ mit Illustrationen); A blog + 6 Posts. Themen: ausgesperrt, zugefallen/abgeschlossen, Abzocke erkennen, Kosten, Schlüssel verloren, Schlüssel im Auto, Zylinder wechseln, Einbruchschutz Wohnung/Haus, Haustür-Check, nach Einbruch, Schadensbilder, RC-Klassen, Förderung, Rauchmelderpflicht, Tresor kaufen, Waffenschrank, elektronische Schließanlagen, Alarmanlage planen |
| `/ueber-uns/` | R ueber-uns + team; nur Konfigurationsfakten, leere Abschnitte entfallen |
| `/karriere/` | R stellenangebote. Die Vorlage wird gebaut und mit Fixture getestet; ausgegeben wird sie nur, wenn Stellen konfiguriert sind |
| `/kontakt/` | R kontakt (Notfall-Ruf-Panel + Composer) |
| `/impressum/`, `/datenschutz/`, `/widerruf/`, `/barrierefreiheit/`, `/quellen-lizenzen/`, `/404.html` | R/A Recht → eigene Entwürfe zur menschlichen Prüfung |

- **Entfällt** (mit ENTSCHEIDUNGEN-Eintrag): R Radiospot und Lokalpresse (fremde PR), der Schein-Sprachumschalter, die Galerie-Fotos (bis eigene Fotos da sind). Die Abdeckung jeder Quell-URL prüft ein Test über `quellen-abdeckung.json`.
- **Ortsseite**, Blöcke in dieser Reihenfolge:
  1. H1 mit Faktenzeile: Gemeinde, Kreis, Land, alle PLZ, „{n} km {Richtung} von Weilburg“; Ortsteile < 3 km bekommen eine eigene Formulierung.
  2. Zonensatz.
  3. Bestätigte Leistungen.
  4. Zonen-Gesamtpreis (außer NL).
  5. SVG-Lagekarte.
  6. Landesregel (`VERIFIZIEREN`).
  7. Ortsteile bzw. Gemeinde.
  8. Orts-FAQ aus Daten.
  9. „Seriös erkennen“.
  10. Nachbarorte mit km.
  11. GeoNames-Hinweis.

  Kein Spinning; Textvarianz entsteht nur über Daten und Zone. Die Ähnlichkeit (Jaccard) wird in ABNAHME.md berichtet.
- **SEO:**
  - Eindeutige Titel (≤ 60 Zeichen) und Meta-Beschreibungen (≤ 155); eine H1; absolute Canonicals.
  - Sitemap-Index (Seiten, Leistungen, Ratgeber, Hubs, `orte-{land}.xml`).
  - Klicktiefe ≤ 4, ≥ 3 eingehende Links je Seite, keine Waisen.
  - JSON-LD: `Locksmith` (nur Start/Über uns/Kontakt), `Service`, `BreadcrumbList`, `FAQPage`, `CollectionPage`/`ItemList`, `Article`. Nie `aggregateRating`, nie ein LocalBusiness je Ort.
  - OG-PNG je Seitentyp und Zone, erzeugt per Werkzeugskript.

## Gestaltung (Designsystem „Scherlinie“ → KERN.md K-001…K-012)
- **Leitidee:** „Wie der Weilburger Schiffstunnel den Lahnbogen auf gerader Linie durchquert, suchen wir in jedem Schloss die eine Linie, auf der es ohne Gewalt aufgeht – ruhig im Ton, präzise im Handwerk, offen im Preis.“ Der Tunnel-Fakt wird geprüft, die Grafik ist als „stilisiert“ gekennzeichnet.
- **Prinzipien:** Eine Linie führt · Ruhe ist die Dienstleistung · Offen vor überzeugend · Präzision im Detail · Daumen zuerst, Nacht mitgedacht · Erzählen beim Planen, arbeiten bei Eile · Ort mit Maß.
- **Leitelement:** die Scherlinie als 2-px-Kupferlinie, beim Seitenwechsel per View Transition (Chromium/Safari, sonst einfacher Wechsel).
- **Farben** mit `light-dark()`, nur nach Systemeinstellung (kein Schalter, kein Storage):
  - Papier #F4F2ED / #0E161B
  - Tinte #13202A / #EDEAE3
  - Lahn #1C5A4F / #7BCDB6
  - Kupfer #A84A22 / #E8956B (Linie und Fokus)
  - Statusfarben; alle Textpaare ≥ 4,5:1 (berechnet).
  - Kein Gelb, kein Türkis, keine Karos.
- **Schrift:** Atkinson Hyperlegible Next Variable + Mono (OFL, lokal, 3 Dateien ≈ 71 KB). Ersatzschrift mit abgestimmten Metriken, Textmaß 32em (kein `ch`), `hyphens:auto` mit Limit, keine Kursive.
- **Skalen:**
  - Schrift `--fs--1…5` (clamp 320→1280); Zeilenhöhen 1,6 / 1,45 / 1,15 / 1,05.
  - Abstände `--sp-3xs…3xl` + fluid; Radien 0/2/4/8/16; Schatten 1–3; z-Stufen.
  - Dauern: Rückmeldung 150 ms, Ausgang 120; Zustand 300, Ausgang 240; Auftritt 640/880; Moment ≤ 1.400.
  - Kurven: standard, ein, aus, linie, einrasten (die einzige Überschwingkurve).
- **Komposition:**
  - Raster mit benannten Linien, Subgrid ab 64em.
  - Mobil ist eine eigene Komposition.
  - Die **Rufleiste** ist mobil fest unten und nie versteckt; ihr Status richtet sich nach den konfigurierten Zeiten, ohne Pulsieren.
  - Benachbarte Abschnitte unterscheiden sich in ≥ 2 von 3 Merkmalen: Fläche, Layout, Dichte.
- **Komponenten mit allen Zuständen:**
  - Schaltfläche, Rufknopf, Preistabelle (mobil als `dl`), Preisrechner (`output` + `aria-live`);
  - FAQ (`details`), Ortssuche als ARIA-1.2-Combobox (Name, Wortanfang, PLZ; Navigier- und Prüfmodus);
  - Brotkrumen, nicht-uniforme Karten, Hinweise, Composer, A–Z-Verzeichnis;
  - Leerzustände, 404 („Dieser Schlüssel passt nicht.“), Platzhalter- und VERIFIZIEREN-Stil (nur in der Vorschau).
- **SVG-Formsystem:**
  - Icons: Raster 24, Strich 1,5, runde Enden, nur 0/45/90°. Die ~56 Icon-Namen sind ein Vertrag; ein Geometrie-Linter prüft sie.
  - 12 Illustrationen: Zylinder-Schnitt, Tür-Schichten, Grundriss, Widerstandsstufen, Tür/Auto/Garage/Tresor, Rasterkarte aus GeoNames-Punkten, Lahnbogen, 404-Schlüssel, Schadensbilder.
  - Muster: Schnittschraffur, Messraster, Bartprofil.
  - Kein 3D/Shader; die Begründung kommt in ENTSCHEIDUNGEN.md: zeigt die Marke nicht, kostet Budget.
- **Bewegungsregister** M-01…M-21 (ohne Theme-Wechsel und Kopieren):
  - nur `transform`/`opacity`, Szenen per CSS `animation-timeline` mit IntersectionObserver-Fallback, ≤ 12 KB gz;
  - Startzustände nur in `@keyframes` unter `prefers-reduced-motion: no-preference` mit `fill-mode: backwards` (Endzustand ist die Basis, Inhalte sind immer sichtbar), `transform-box: fill-box`.
  - Große Momente:
    - M-16 Start: Stifte rasten auf die Scherlinie, ≤ 1,4 s; H1, Suche und Anruf werden nie animiert.
    - M-17 je Leistungsgruppe eine Szene (Notöffnung „Stift für Stift“, Einbruchschutz Tür-Schichten, Sicherheitstechnik Grundriss-Zonen, Einbau & Tresore Widerstandsstufen).
    - M-18 Einsatzgebiet: Ringe um Weilburg.
    - M-20 Über uns: der gerade Weg.
  - Reduzierte Bewegung: Endzustand bzw. Überblendung.
  - Animationen auf SVG-Kindern prüft ein Spike; laufen sie auf dem Main-Thread, bewegen sich stattdessen HTML-Hüllen.
- **Hauptansichten (12):**

  | Nr. | Ansicht | Art |
  |---|---|---|
  | V01 | Startseite | Referenz, Erzählansicht |
  | V02 | Leistungsgruppe | Erzählansicht |
  | V03 | Leistungsdetail | Arbeitsansicht |
  | V04 | Preise | Arbeitsansicht |
  | V05 | Einsatzgebiet | Erzählansicht |
  | V06 | Orts-Hub | Arbeitsansicht |
  | V07 | Ortsseite | Arbeitsansicht |
  | V08 | Ratgeber | Arbeitsansicht |
  | V09 | Über uns | Erzählansicht |
  | V10 | Kontakt | Arbeitsansicht |
  | V11 | Suche | Arbeitsansicht |
  | V12 | Recht/System/404 | Arbeitsansicht |

## Ablauf nach Master-Auftrag
- **E0 Start**
  1. Branch `claude/bold-noether-fk2n4f` sicherstellen. Das Repo ist **öffentlich, und das bleibt so** (Entscheidung des Nutzers): normal pushen.
     - Aus Wettbewerberdaten Abgeleitetes (Vorher-Bilder, Themeninventare mit Zitaten, Fingerabdruck-Rohwerte) bleibt in `.cache/` außerhalb des Repos; committet werden nur Kennzahlen und Hashes.
     - Das Restrisiko (Scrapes, fremde API-Schlüssel und Personendaten öffentlich in der Historie) steht in MENSCHEN.md.
  2. `_werkstatt/` anlegen: AUFTRAG.md wörtlich, alle Pflichtdateien, Ordner.
  3. CLAUDE.md-Block setzen, `.gitignore` ergänzen.
  4. Erkundungs-, Panel- und Kritikberichte mit Kopfvermerk sichern.
  5. Haiku richtet die Werkzeuge ein: Einzelbild, Bildsatz, axe (`bypassCSP`), Lighthouse-Median (`CHROME_PATH`, `--no-sandbox`), Smoke, INP-Interaktionsskript, Bildraten-Messung (CDP-Drosselung 4×), Überlauf-Check (320/1920 px, 200 % Zoom, forced-colors), vnu (JSON).
  6. Haiku nimmt die Vorher-Baseline auf: ≤ 6 Wettbewerberseiten live, Namen und Nummern maskiert, Bilder nur in `.cache/`.
  7. Haiku erstellt Themeninventare (nur Überschriften und Themen).
  8. Opus schreibt LAGEBILD.md mit Funktionsliste.
- **E1 Plan**
  - KERN.md mit Sprachregeln: „Sie“, verbotene Behauptungen und Floskeln, Rechtschreibung.
  - PLAN.md mit exakter Routenliste und allen ~75 Paketen (~75 % Haiku).
  - ABNAHME.md Z-01…Z-10. Die E0-Baseline ist die erste eigene Messung in E2; Wettbewerberwerte sind nur informativ.
  - UMGEBUNGSAUSNAHMEN: echte Geräte, Firefox/WebKit, GPU-Bildrate, Live-Header des Hosters, Search-Console-Wirkung, Platzhalter.
  - L0-Prüfung durch Haiku, dann weiter.
- **E2 Kern und Referenz** (Opus; parallel Haiku-Pakete mit eigenen Dateien)
  - E2a: Generator-Kern, Escaping, Build-Modi, Vorschau-Server, Hoster-Konfigurationen, **alle Prüfer** (Sicherheit, Plagiat, Ehrlichkeit, Fakten, Links, JSON-LD, vnu, Token, Emoji, Budgets) mit je einem bewusst fehlerhaften Fixture, das rot werden muss.
  - E2b: Technik-Spike auf einer Stub-Seite mit voller CSP, Trusted Types, COEP, Schrift, View Transition, Symbolen und SVG-Animation. Kalibriert Lighthouse, axe, vnu, Smoke und Bildrate.
  - E2c: Datenvertrag (`orte.json`, Indizes) mit einem Fixture aus 60 Orten. Haiku baut Pipeline 00/10/20 mit Zusicherungen. Opus baut 30-Abgleich mit Gold-Set; danach Haiku 40–90.
  - E2d: Tokens/CSS, Kopf, Fuß, Rufleiste, Icon-Grundsatz, **V01 komplett** mit M-16, Ortssuche und Preisteil.
  - Alle Registries (Routen, Navigation, Themenpässe mit Faktenblättern) füllt Opus vollständig.
  - Etappentor: Prüfstufe B und Sichtabnahme durch einen frischen Opus-Agenten, Ansichtswert ≥ 8.
- **E3 ff. Wellen** (4 Haiku-Slots; Pakete schreiben nur eigene Module; jedes Paket gilt erst mit grünem `--pruefen` als fertig)
  - Vor W1 baut Opus die Szenen-Engine (M-17) und die Illustrationen I-01/03/04/05.
  - W1: V02-Vorlage (Opus) → 4 Gruppenseiten; Icons nach Vertrag; Unit-Tests.
  - W2: V03-Vorlage (Opus) → 23 Detailseiten in Dreierpaketen. V07-Vorlage, Zonentexte und Weilburg-Seite schreibt Opus; V06-Hubs baut Haiku; Linkgraph.
  - W3: Preise mit Rechner, Kontakt-Composer, Über uns, Karriere-Vorlage, Recht-Entwürfe, 404, Suche, HTML-Sitemap; 19 Ratgeber nach Faktenblatt.
  - W4: Sitemaps, robots, security.txt, OG-Bilder, live-check, README/docs.
  - Danach die Kür nach Wirkung.
- **Takt:**
  - Nach jeder Welle Build und Push (wenn erlaubt, siehe unten), stündlich STATUS/PRUEFPUNKT.
  - Morgenbericht 07:00.
  - Je Etappe Prüfstufe B und Sichtabnahme, höchstens 2 Anläufe je Tor.
  - Z-04 blind: Wettbewerber und neu maskiert, A/B zufällig, feste Paare V01/V03/V04/V07.
- **Abschluss:**
  - Prüfstufe C, BERICHT.md mit Galerie.
  - `docs/` (BETRIEB, OFFENE-PUNKTE, ENTSCHEIDUNGEN, orte-abgleich) und `werkzeuge/` aus `_werkstatt` herauslösen, damit beim Zusammenführen nichts verloren geht.
  - Anleitung zum Zusammenführen und Zurückrollen.
  - Endprüfung durch einen frischen Opus-Agenten; danach den CLAUDE.md-Block entfernen.

## MENSCHEN.md (von Anfang an)
- **Betrieb:** Firmendaten und Impressum-Pflichtfelder, Erreichbarkeit und Nachtdienst, Preisliste und `ustModus`.
- **Zonen:** Radien, Leistungen je Zone (`leistungenBestaetigt`), Partnernetz, Indexierung C/D/NL, NL-Sprache und USt.
- **Rechtliche Prüfung:** Rechtstexte, VERIFIZIEREN-Fakten, Tunnel-Fakt, Restrisiko § 87b, Marken.
- **Orte:** unklare Orte.
- **Hoster und Domain:**
  - Hoster: EU, AVV, IP-Kürzung, Logs ≤ 14 Tage, Header-fähig; Rocket Loader und Injection aus.
  - Domain: www oder apex, HSTS-Preload, DMARC/SPF/DKIM, CAA, DNSSEC, Registrar-Lock, 2FA überall, Postfach für security.txt mit Erinnerung vor `Expires`.
- **Inhalte:** KI-Crawler-Sperre, eigene Fotos, Bewertungsprofil-Link.
- **Tests:** echte Geräte, Firefox/Safari.

## Verifikation
- `node --test test/`:
  - Escaping, Slugs/Register, Abgleich (Fixture und Gold), Geo/Zonen;
  - Preise (Gesamtpreis, keine Zahlart-Zuschläge, `ustModus`);
  - Mailto (Injection, Länge), Ortsindex/Wortanfänge, Platzhalter/VERIFIZIEREN;
  - CSP-Gleichheit, Redirects (`//`, `/\`, `%2F%2F`), Quelltext-Regeln, Determinismus, `quellen-abdeckung`.
- `node bau/bauen.mjs --messen --pruefen`: alle Prüfer grün. `--release` muss **mit** Platzhaltern scheitern; das ist ein ausdrücklich geprüfter Negativtest.
- **Werkzeuge** gegen die Vorschau:
  - Smoke: 0 externe Requests, 0 Konsolen-/CSP-Fehler; „weilb“ → Weilburg, „homburg“ → Bad Homburg, PLZ 35781 → Zone A; Rechner, Composer-Href, Navigation bei 375 px, Tastaturpfad, reduzierte Bewegung.
  - axe: 0 ernste oder kritische Befunde.
  - Lighthouse-Median aus 3 Läufen: Perf ≥ 95, A11y/BP/SEO 100, LCP ≤ 2,5 s, CLS ≤ 0,1.
  - INP ≤ 200 ms über das Interaktionsskript; M-16 mit ≤ 5 % verworfenen Bildern bei 4× Drosselung.
  - Bildsätze 390×844, 768×1024, 1440×900, hell und dunkel, ohne Überlauf.
