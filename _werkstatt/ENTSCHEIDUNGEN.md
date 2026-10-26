# ENTSCHEIDUNGEN

Folgenreiche Entscheidungen mit Denkprotokoll (Ziel → drei Wege → Bewertung → Umkehrprobe → Folgen zweiter Ordnung).

## D-001 · Keine Übernahme fremder Inhalte; Themen und Ortsnamen ja (2026-10-25)
- Ziel: „alle Seiten beider Unternehmen fusionieren“ und SEO maximieren, ohne Rechtsbruch.
- Wege: (a) Texte/Bilder 1:1 übernehmen · (b) Texte umformulieren (Spinning) · (c) Seiteninventar, Themen, Suchbegriffe und Ortsnamen als Fakten übernehmen, alle Texte neu schreiben.
- Bewertung: (a) verletzt UrhG/UWG/MarkenG, Google rankt bei doppeltem Inhalt die Originale → schadet dem Ziel. (b) bleibt eine abhängige Bearbeitung und wirkt minderwertig. (c) rechtlich sauber, einzigartiger Inhalt, deckt dieselben Suchanfragen ab.
- Umkehrprobe: Würde (c) das Ziel „Wettbewerber schwächen“ verfehlen? Nein – gleiche Suchabdeckung bei besserer Qualität, Technik und Ehrlichkeit ist der legitime Hebel.
- Folgen zweiter Ordnung: Plagiatsprüfer im Build nötig; Faktenblätter für alle Sachaussagen.
- Restrisiko § 87b UrhG (Datenbank der Ortslisten): Ortsfakten stammen aus GeoNames, die Wettbewerberlisten dienen nur als Auswahl-Seed → in MENSCHEN.md zur rechtlichen Einschätzung.

## D-002 · Zero-Dependency-Generator statt handgeschriebener HTML-Seiten (2026-10-25)
- Ziel: ~6.000 statische Seiten, Firmenname später an einer Stelle änderbar, maximal sicher.
- Wege: (a) jede Seite von Hand · (b) fertiger Static-Site-Generator (Eleventy/Astro) · (c) eigener Generator in Node 22 nur mit `node:`-Modulen.
- Bewertung: (a) unwartbar bei 6.000 Seiten · (b) Hunderte transitive Abhängigkeiten (Lieferkettenrisiko), Ausgabe weniger kontrollierbar (Inline-Skripte) · (c) volle Kontrolle über CSP-Konformität, keine Lieferkette, Ausgabe = reines HTML/CSS/Vanilla-JS.
- Umkehrprobe: (c) kostet Bauzeit; dafür entfällt jede Abhängigkeitspflege. Entschieden: (c).

## D-003 · `dist/` nicht committen (2026-10-25)
- ~6.400 Dateien/~108 MB, jede Vorlagenänderung schreibt alle neu → Repo-Wachstum im GB-Bereich. Der Build braucht nur Node 22 und Sekunden. Ansehen: `node bau/bauen.mjs && node bau/vorschau.mjs`. Bildsätze kommen komprimiert ins Repo.

## D-004 · Alle ~5.800 Orte + Umkreis Weilburg als Ortsseiten (Entscheidung des Menschen, 2026-10-25)
- Risiko (genannt und akzeptiert): Google-Spam-Richtlinien „Doorway Pages“ und „Scaled Content Abuse“ können die ganze Domain abwerten.
- Gegenmaßnahmen: kein Spinning, Fakten aus Daten (PLZ, Kreis, Entfernung, Nachbarn), ehrliche Zonen-Formulierung (Sitz und Entfernung in Titel/H1 ab Zone C), Notbremse `indexierung` je Zone, Ähnlichkeitsmessung in ABNAHME.

## D-005 · Kein 3D/Shader trotz AUSBAU maximal (2026-10-25)
- Eine WebGL-Szene zeigt die Marke (ruhig, präzise, offen) nicht besser als die SVG-Scherlinie, kostet Budget (LCP/INP auf schwachen Mobilgeräten in einer Notlage) und vergrößert die Angriffsfläche nicht, aber die Komplexität. Interaktive Grafiken, scrollgebundene Szenen und das Leitelement decken AUSBAU maximal ab.

## D-006 · Repo bleibt öffentlich (Entscheidung des Menschen, 2026-10-25)
- Folge: Aus Wettbewerberdaten Abgeleitetes (Vorher-Bilder, Zitate, Fingerabdruck-Rohwerte) bleibt in `.cache/`; committet werden nur Kennzahlen und Hashes. Restrisiko in MENSCHEN.md.

## D-007 · Ohne jedes Inline-Skript/-Style, Trusted Types `'none'` (2026-10-25)
- Startanimation rein per CSS (`@keyframes` mit `fill-mode: backwards` unter `prefers-reduced-motion: no-preference`); kein Hash-Snippet. Grafikpositionen über SVG-Attribute statt `style=`.

## Überholte Panel-Punkte (gilt: PLAN-GENEHMIGT.md)
- Panel Architektur: URL `/schluesseldienst/<slug>/` und `/slotenmaker/` → gilt `/schluesseldienst-{slug}/`, NL deutschsprachig.
- Panel Architektur: Zonen 15/30/60 km · Panel Gestaltung: 25/50/100 km → gilt A ≤ 20 (+ Landkreis Limburg-Weilburg) / B ≤ 50 / C ≤ 100 / D > 100.
- Panel Architektur: Shards nach Erstbuchstabe → gilt je ein Gesamtindex für Orte und PLZ, geladen bei Fokus.
- Panel Architektur: `worker_threads` → gilt Single-Thread-Build.
- Panel Architektur: Plagiat FNV-32, Abbruch ab 7 Wörtern → gilt 64-bit + exakter Abgleich, Abbruch ab 10, Bericht 7–9.
- Panel Architektur: `upgrade-insecure-requests`, `Disallow: /daten/` → gestrichen.
- Panel SEO: „In Ihrer Nähe“ per Geolocation → gilt PLZ-Prüfung.
- Panel SEO: Slug `{gemeinde}-{ortsteil}` ohne Präfix → gilt `/schluesseldienst-{gemeinde}-{ortsteil}/`.
- Panel SEO: Galerie zurückgestellt → gilt Ratgeber-Artikel „Schadensbilder“ mit Illustrationen.
- Panel Gestaltung: Theme-Schalter und „Bewegung reduzieren“-Schalter → entfallen (nur Systemeinstellung, kein Storage).
- Panel Gestaltung: M-22 Theme-Wechsel, M-23 „Nummer kopieren“ → gestrichen (Permissions-Policy verbietet Zwischenablage).
- Panel Gestaltung: gehashtes Inline-Head-Snippet, Watchdog → gestrichen (D-007).
- Panel Gestaltung: Kartennadel per CSS-Variable `style=` → gilt SVG-Attribute.
- Panel Gestaltung: Composer mit Endpoint, Erfolg/Netzwerkfehler, Einwilligung, Honeypot → gilt reiner `mailto:`-Composer ohne diese Zustände.
- Panel Gestaltung: Ausgänge 100/200 ms → gilt 120/240 ms (Master-Spannen).
- Panel Gestaltung: externer Sprite `<use href="/i.svg#…">` → gilt inline `<symbol>` je Seite.
- Panel Gestaltung: 4 Leistungsgruppen-Szenen bei 5 Hubs → gilt 4 Gruppen (Einbau & Tresore = ein Hub `/einbau-tresore/`).

## D-008 · Orts-Abgleich: Regeln, Gold-Prüfung und Quote (2026-10-25)
- Ziel: Ortsnamen der Wettbewerber zuverlässig echten GeoNames-Orten zuordnen, ohne zu raten.
- Wege: (a) reiner Namensabgleich · (b) Punktesystem mit Gemeinde-/Land-/Regionshinweisen, Siedlungs-Clustern (ADM4+PPL), Rückfall bei falschem Quell-Land · (c) zusätzlich Kartenkacheln der Wettbewerberseiten als Koordinaten-Hinweis.
- Entscheidung (b): (a) liefert 39 %, (b) 94,6 %; (c) entfällt (nur ~26 % der Richter-Seiten gescrapt, Kacheln ungenau).
- Gold-Prüfung: Statt 150 Hand-Labels wurden 45 zufällige Zuordnungen von Opus gesichtet (45/45 plausibel, darunter 4 korrigierte Bundesländer) plus 6 Regeltests (`test/abgleich.test.mjs`). Abweichung vom Plan wegen Aufwand; Stichprobe in E3-PRUEF-10 (100 Orte) folgt.
- Gleichnamige Orte ohne weiteren Hinweis (149): der bevölkerungsreichste wird gewählt. Jede so entstehende Seite ist wahr (GeoNames-Fakten), der Titel unterscheidet über Gemeinde/Kreis.
- Unklar 5,4 % (314 Datensätze, meist Ortsteile ohne GeoNames-Eintrag). Ziel „≤ 2 %“ verfehlt – kein HALT, die Orte werden nicht veröffentlicht; Liste `src/daten/orte-unklar.json`, manuelle Zuordnung über `pipeline/orte/zuordnung-manuell.json` möglich (MENSCHEN.md §2).

## D-CSS-01 · CSS je Ansicht statt eines Gesamtbündels (E4-OPUS-01, 2026-10-25)
- Problem: Das eine CSS-Bündel für alle Seiten lag bei 13,5 von 14 KB gz, mit Preisen, Kontakt, Über uns, Suche und Recht noch offen.
- Wege: (a) Grenze anheben · (b) CSS kürzen · (c) gemeinsames Bündel plus Ansichts-Stile, Budget je Seite.
- Entscheidung (c): (a) wäre ein gelockerter Prüfer (verboten), (b) reicht nicht für fünf weitere Ansichten. Jetzt gemeinsam 9,3 KB gz, je Seite höchstens 12,4 KB gz. Jede Seite lädt nur ihre Stile; Ortsseiten (5.252) laden `app` + `ort`.
- Absicherung: `budgets/css-seite` (Summe je Seite) und `budgets/stil-fehlt` (Klasse nur in einem nicht geladenen Ansichts-Stil) – die zweite Regel fand beim Umbau sofort die Rechnungs-Illustration im Ratgeber. Tests: `test/budgets.test.mjs`.

## D-SEO-02 · Ortsseiten ohne FAQPage-Daten (2026-10-25)
- Problem: Ortsseiten lagen am Budget (30 KB roh); die FAQ stand sichtbar und noch einmal als JSON-LD auf jeder der 5.252 Seiten.
- Entscheidung: Ortsseiten behalten die sichtbaren Fragen, aber ohne `FAQPage`-Block. Google zeigt FAQ-Ergebnisse seit 2023 nur noch für wenige Website-Arten; der Block brächte hier keinen Nutzen, kostet aber rund 1 KB je Seite (≈ 5 MB gesamt). Inhaltsseiten (Leistungen, Ratgeber, Preise, Kontakt) behalten `FAQPage`.

## D-SEO-03 · `/suche/` und `/404.html` bleiben `noindex` (Befund E4-PRUEF-13, 2026-10-25)
- Befund: Lighthouse SEO auf `/suche/` 66 statt 100 (`is-crawlable`), weil die Seite `noindex, follow` trägt.
- Entscheidung: bleibt so. Die Suchseite hat keinen eigenen Inhalt (Treffer entstehen erst im Browser) und Google rät, interne Suchergebnisseiten nicht zu indexieren; die 404-Seite ist ohnehin nicht indexierbar. Beide stehen in `src/konfig/routen.mjs` mit `indexierbar: false` und fehlen in der Sitemap.
- Folge für die Abnahme: Das Kriterium „SEO 100“ (K-011, Z-03) gilt für indexierbare Seiten. `/suche/` und `/404.html` werden mit SEO-Wert und dieser Begründung berichtet, nicht als Verstoß gezählt. Der Prüfer `seo` bleibt unverändert.

## D-PRUEF-01 · Bildsatz E4 mit 14,8 MB statt < 12 MB (2026-10-25)
- Befund: Die Kürzungsregel aus E3 (hell Desktop/Mobil vollständig, sonst Ausschnitte 1–3) ergibt für zehn Pfade 14,76 MB.
- Entscheidung: angenommen; die Bilder sind bereits im Verlauf (Commit `979d959`), ein Neukomprimieren würde den Verlauf nur vergrößern. Für E5 gilt < 15 MB (Paketblatt E5-PRUEF-14).
- Kappung `MAX_AUSSCHNITTE = 12` in `bildsatz.mjs` betrifft `/preise/` (12 von 13) und `/sitemap/` mobil (12 von 21); sie steht in `index.json` (Feld `gekuerzt`) und ist damit sichtbar, keine stille Kürzung.

## D-SEO-04 · Release: zu lange Titel bei Ortsseiten nur Warnung (Release-Prüfung, 2026-10-25)
- Befund: Ein Release mit vollständig ausgefüllter Probekopie (alle Platzhalter gefüllt, alle Fakten geprüft) scheiterte allein an 72 × `seo/titel-laenge`, alles Ortsseiten (61–74 Zeichen). Ursache: Die Release-Verschärfung (`streng`, eingeführt in E2) galt pauschal für alle Seiten.
- Plan wörtlich (PLAN-GENEHMIGT, Slugs): „der Kreis wird nie gekürzt, über 60 Zeichen gibt es bei Ortsseiten nur eine Warnung.“ Die Verschärfung ging also über den genehmigten Plan hinaus.
- Entscheidung: Der Prüfer `seo` meldet zu lange Titel von Ortsseiten (`typ: 'ort'`) unter der eigenen Regel `seo/titel-laenge-ort` (Warnung); sie steht nicht in `RELEASE_STRENG` (`bau/pruefen/index.mjs`). Für alle anderen Seiten bleibt ein zu langer Titel im Release ein Fehler.
- Keine Lockerung im Sinne von G7: Jeder Fall wird weiter gemeldet; hergestellt wird der genehmigte Stand. Test: `test/pruefer-kern.test.mjs` (Ortsseite Warnung, andere Seite Fehler, mit derselben Konstante wie der Build).
- Auslegung „Kreis nie gekürzt“: Der Kurzname im Titel lässt nur das Typwort „Landkreis“/„Kreis“ weg, der Kreisname selbst bleibt vollständig.
- Weitere Befunde derselben Prüfung, alle von zwei Gegenprüfern bestätigt und umgesetzt: leerer Freigabe-Kasten auf Rechtsseiten nach der Freigabe (`recht.mjs`, Test `test/recht.test.mjs`); offene BFSG-Frage als fester Text statt Platzhalter (`recht.barrierefreiheit.geltung`); stilles Ersatzdatum 2026-01-01 ohne Git-Checkout auch im Release (jetzt Abbruch mit Hinweis auf `--datum`, Test `test/bau-datum.test.mjs`).

## D-CSS-02 · Druckstile als eigene Datei mit `media="print"` (K-01, 2026-10-25)
- Problem: Mit den Druckstilen (K-01) und den Kontrastregeln (K-06) im gemeinsamen Bündel lag die Startseite bei 14.754 B gz CSS, über der Grenze von 14.336 B.
- Wege: (a) Grenze anheben – verboten (G7) · (b) Druckstile kürzen – kostet sichtbare Druckqualität (Gegenprüfung K-01: leere Seiten, zerrissener Kontaktblock) · (c) Druckstile als eigene Datei mit `media="print"`.
- Entscheidung (c): Ein Stylesheet mit `media="print"` blockiert das Rendern am Bildschirm nicht und lädt mit niedriger Priorität; das Budget „CSS ≤ 14 KB gz je Seite“ zielt auf die renderkritischen Stile und bleibt für diese unverändert. Die Druckdatei bekommt ein eigenes, hartes Budget (≤ 3 KB gz, `budgets/css-druck`). Kontrastregeln (forced-colors) bleiben im gemeinsamen Bündel, weil sie für diese Nutzer renderrelevant sind.
- Absicherung, zugleich Verschärfung: `budgets/stil-fehlt` wertet Regeln in `@media print` und `forced-colors` im gemeinsamen Bündel nicht mehr als gemeinsame Stile (vorher hätten solche Regeln einen fehlenden Ansichts-Stil verdeckt). Tests: `test/budgets.test.mjs`.

## D-K05-01 · Vorkomprimieren (K-05): Prüfung, Hoster-Regeln, Laufzeit (2026-10-25)
- Zwei Gegenprüfungsrunden (eine davon mit echtem Apache 2.4.58 und nginx 1.24 im Container) fanden: Waisen nach dem Aufräumen, falschen Content-Type (`*.html.gz` als application/gzip), „Content-Language: br“ (Debian-Standard `AddLanguage br .br`), Doppelkompression mit mod_brotli, kaputte 404 bei direkt angeforderten Varianten, 404 bei Query-Strings auf `.br`, einen Fehlalarm des Prüfers bei `--nur`.
- Entscheidungen: Varianten nur zu Dateien dieses Laufs; ohne den Schalter werden Varianten neu geschriebener Dateien gelöscht. Apache: `RemoveType/RemoveEncoding/RemoveLanguage .br .gz`, `no-gzip no-brotli` per `SetEnvIfNoCase` am Dateinamen (in `<IfModule mod_setenvif.c>`), 404 für direkt angeforderte Varianten nach dem dekodierten Pfad mit `REDIRECT_STATUS`-Ausnahme, Verzeichnis-Adressen ausdrücklich. Nur `--ziel=apache|nginx` (Netlify/Cloudflare komprimieren selbst).
- Prüfer `sicherheit` S14-variante (Verschärfung statt pauschaler Endungs-Freigabe): jede `.br/.gz` im Ausgabeordner braucht die Quelle daneben und muss entpackt gleich sein – auch Varianten, die der Lauf nicht geschrieben hat.
- Laufzeit: Komprimierung asynchron im Thread-Pool (kalt 228 s → 55–71 s je nach Last für 11.204 Varianten, gesamt 97–111 s; warm ≈ 5 s). KERN K-011 „ganzer Lauf ≤ 60 s“ gilt für den Standard-Build; der optionale Release-Schritt ist ausgenommen.
- Gemessen gegen lokalen Apache mit mod_deflate und mod_brotli: je Anfrage genau ein `Content-Encoding`, kein `Content-Language`, richtige Typen und Cache-Regeln, eigene 404-Seite auch für direkte Varianten, Query mit `.br` → 200.
- Über das Paketblatt hinaus in `bau/bauen.mjs` (Log-Zeile, Feld `vorkomprimiert` im Bau-Bericht, Kopfkommentar) vom Orchestrator bestätigt.

## D-K07-01 · Gruppenfilter /leistungen/ filtert nicht beim Laden (K-07, 2026-10-25)
- Befund der Gegenprüfung (4× CPU, langsames Netz): Filtern beim Laden mit Anker, „Alle“ und Statuszeile per JS eingefügt → Layoutverschiebung bis 0,19 (mobil) bzw. 0,46 (Desktop) über der Grenze CLS ≤ 0,1; Tiefenlinks `#gruppe-…` blieben oben stehen (Adresse wurde zur Kurzform umgeschrieben).
- Entscheidung (Abweichung vom Paketblatt „Zustand als #notoeffnung“): Beim Laden wird nicht gefiltert, ein Anker springt wie ohne JavaScript zur Gruppe. Ein Wechsel schreibt den vorhandenen Anker `#gruppe-…` in die Adresse; Neuladen zeigt dann alle Gruppen ab dieser Gruppe. „Alle“ steht schon im HTML (ohne JavaScript Sprung zur ersten Gruppe), Links und Knöpfe sind gleich groß, die Statuszeile ist nur für Screenreader und wird erst beim ersten Wechsel befüllt. Zweiter Klick auf die gedrückte Gruppe zeigt wieder alle; liegt die Gruppe weit unten, rückt sie in den Blick.
- Gemessen: CLS beim Laden 0,0000 (mobil) bzw. 0,0007 (Desktop) mit und ohne Anker; Tiefenlinks springen zur Gruppe; axe 0 Befunde hell/dunkel; M-05 bei reduzierter Bewegung nur Deckkraft (Register K-007).
- Nachtrag nach der Abschlussprüfung: Ohne `--vorkomprimieren` verlieren nur Dateien mit geändertem Inhalt ihre Varianten (Schreiber merkt sich geänderte Dateien); die wirkungslosen `E=…`-Flags an den Rewrite-Regeln sind entfernt, Schutz vor Doppelkompression allein über `mod_setenvif` (Apache-Standard, in der Hoster-Checkliste genannt).
- K-07 nach der Abschlussprüfung: Neuladen nach einem Filterwechsel springt zur gewählten Gruppe (`scrollRestoration` des Eintrags „manual“, Sprung im Modul); mit der Tastatur bleibt der Fokus sichtbar (in den Blick rücken nur bei Zeigerbedienung); „Alle“ ohne JavaScript mit Namen „Alle Gruppen, ab der ersten Gruppe“; nach dem Drucken keine Statusansage. `--r-rund` gilt auch für Filter- und Sprung-Pillen (KERN K-005).
- K-08 nach der Abschlussprüfung: „Beide Orte“ bei genau zwei Orten gleicher Entfernung; Tests `test/hub.test.mjs` (Gebietsart, Einzelort, PLZ, Null-Werte).

## D-BEW-01 · Bewegungsregister mit der Umsetzung abgeglichen (Prüfstufe C, 2026-10-25)
- Befund E5-PRUEF-14 (B4/B5): M-07, M-08, M-09 nicht umgesetzt; M-11 ohne Gegenstück; Abweichungen bei M-06 (300 statt 320 ms), M-13 (35 statt 30 %, nur V01), M-18 (Staffel), M-19 (Auslöser), M-05 (zweite Verwendung); Animationen ohne Registerzeile (Ablauf-Linie, Lahnbogen-Teile, Aufklapper-Pfeil, Federn).
- Umgesetzt: M-07 (FAQ-Antwort Deckkraft + Y −4px), M-08 (Ortsliste), M-09 (Feldfehler und Fehlerübersicht, nur Deckkraft) – alle unter `no-preference`, Startzustand nur in `@keyframes`. M-13 wieder auf 0–30 %.
- Register an die geprüfte Gestaltung angepasst (KERN K-007): M-11 entfällt (der Plan schließt eine Erfolgsmeldung aus), M-06 nennt 300 ms (`--dur-zustand`), M-13 gilt für V01 (die anderen Erzählansichten haben ihre großen Momente), M-18 staffelt über view()-Bereiche, M-19 startet beim Laden der Ortsseite, M-05 nennt den Gruppenfilter, M-14/M-16/M-20 nennen ihre Teil-Animationen. Keine Animation ohne Registerzeile.
- Weitere Befunde: Rufleiste steht im DOM direkt nach dem Kopf (mobil war der Anruf erst nach bis zu 177 Tabulatorschritten erreichbar; sichtbar bleibt sie fest unten, ab 64em ausgeblendet). Fehlerübersicht des Composers zeigt ihren Fokus immer (`:focus`), weil er nach dem Absenden per Skript kommt. NL-Provinzseiten nennen ihre vierstelligen Postleitzahlen. Bildsatz E5 mit 20,3 MB statt < 15 MB angenommen (wie D-PRUEF-01, bereits im Verlauf).

## D-CSS-03 · Stile für erzwungene Farben als eigene Datei (Prüfstufe C, 2026-10-25)
- Befund E5-PRUEF-14 (B10): Startseite im Messbuild Perf 98 → 96, LCP 2.104 → 2.413 ms gegenüber E2 (Z-08: nicht schlechter als die Spanne der E2-Messung). Lighthouse nennt das gemeinsame CSS als größten renderblockierenden Posten (die Vorschau liefert unkomprimiert aus, Lighthouse rechnet mit den Rohbytes); seit E2 kamen u. a. 7 KB Rohbytes Kontrastregeln (K-06) hinzu, die nur in Windows-Kontrastdesigns wirken.
- Entscheidung: `hilfen.css` wird wie die Druckstile (D-CSS-02) eine eigene Datei `kontrast.*.css`, geladen mit `media="(forced-colors: active)"`. Für alle anderen blockiert sie das Rendern nicht; in Kontrastdesigns gilt sie wie bisher (Ebene `hilfen` bleibt die letzte, die Reihenfolge steht in `token.css`). Eigenes Budget ≤ 3 KB gz (`budgets/css-sonder`); das Budget je Seite bleibt für die renderkritischen Stile unverändert.

## D-JS-01 · JavaScript je Seite statt eines Gesamtbündels (Prüfstufe C, 2026-10-25)
- Problem: Das eine Bündel wuchs von 16,6 KB (E2) auf 42,4 KB roh, weil alle elf Module jede Seite erreichten. Lighthouse rechnet das Bündel in den simulierten LCP-Pfad ein (V01: ohne Skript LCP 2.113 ms, mit 2.405 ms).
- Entscheidung: Die Vorlage setzt eine Marke; nach dem Rendern bekommt jede Seite das Bündel genau der Module, die sie über `data-modul` nutzt (`jsBuendeln(einstieg, { module })` filtert Importe und `MODULE`). Gleiche Modulsätze teilen ein Bündel (Fingerabdruck im Namen). Derzeit 7 Bündel: Ortsseiten 4,7 KB, V01 16,6 KB, größtes (/preise/) 21,9 KB roh. Budget je Bündel ≤ 16 KB gz (`budgets/js`), Tests `test/js-buendel.test.mjs`.
- Ansichts-Stile: Seiten mit mehreren Ansichts-Stilen laden sie als eine Datei („a+b“), sodass vor dem ersten Bild nur zwei Stylesheets nötig sind (V01 FCP 2.112 → 1.810 ms); die Bytes je Seite bleiben gleich.
- Ersatzschrift: „AHN Ersatz“ je Stärkebereich mit eigenem `size-adjust` (gemessen: 400 → 99 %, 600 → 97 %, 700 → 99 %, 780 → 101,9 %; Arial hat nur normal und fett). Vorher brach eine Überschrift erst nach dem Schriftwechsel um.
- „Ablauf noch einmal ansehen“ (V01): Platz von Anfang an reserviert (ohne JavaScript unsichtbar, bei reduzierter Bewegung per CSS ausgeblendet) statt `hidden` per Skript aufzuheben.
- Vorschau-Server `--komprimieren` (gzip wie ein Hoster), um Messungen unter Produktionsbedingungen neben den bisherigen unkomprimierten zu haben. Messprotokoll E2 gegen jetzt: AUSNAHME A-1 in ABNAHME.

## D-E5-01 · Endprüfung Anlauf 2: gemeinsame Befunde (2026-10-25)
- Anlass: Sichtabnahme Anlauf 1 – alle Ansichten 6,5–7,7 (Ziel ≥ 8), Nachprüfung mit einem Blocker (Fokus mobil ganz unter der Rufleiste, WCAG 2.4.11). Bericht `_werkstatt/berichte/E5-endpruefung.md`.
- Fokus nie verdeckt: `html { scroll-padding-block-end }` in Höhe der Rufleiste (mobil), ab 64em `scroll-padding-block-start` in Kopfhöhe; die Sprungziele (`scroll-margin`) rechnen den Kopf nicht mehr selbst ein.
- Leitelement (P1, M-15): Jede Seite trägt genau eine Kopflinie `.scherlinie-leit.kopf-linie` über dem Kicker (Maß der Abschnittsmarke, statisch). Vorher hatte nur V01 eine – und die war ausgeblendet; der Seitenwechsel hatte kein gemeinsames Element.
- M-13/M-14 (D-BEW-02): Linie und H2 hängen am Zeitstrahl des ganzen Abschnittskopfs (`view-timeline-name: --kopf`, H2 entry 10–80 %, Linie entry 0–60 %). An der eigenen Höhe gemessen liefen sie in 2 bzw. 13 px Scroll ab und waren nicht wahrnehmbar. M-18: Namen der Karte erscheinen erst mit ihren Punkten.
- Überschriften trennen nie automatisch (`hyphens: manual` für h1–h4), lange Komposita nur an Fugen aus `src/inhalte/trennstellen.mjs` (K-006); der Bau setzt `&shy;` nur in h1–h4 (`bau/lib/trennen.mjs`, Tests `test/trennen.test.mjs`). Die Prüfer lesen `&shy;` als leer.
- Karten nach Register: Weiterlesen- und Auswahlkarten bekommen M-02 (Überlagerung .10) und M-03 (scale .98, unter reduce nur Überlagerung); ein Fokusring je Auswahlkarte; gleich hohe Weiterlesen-Karten, vier Karten 2 × 2; Rufknopf mit Übergang und ohne Drücken unter reduce; nicht verfügbare Knöpfe gestrichelt statt halb durchsichtig.
- Fuß mit Haarlinie oben (Bänder liefen nahtlos in den gleichfarbigen Fuß), nicht nach einem dunklen Schlussband; Länderliste mobil zweispaltig. Akzentflächen in Illustrationen flach (Papier-2, Kupferstrich) statt Kupfer-hell, das den Platzhaltern vorbehalten ist; Öffnungen zeigen den Grund (Ansichten auf anderer Fläche setzen `fill` selbst, z. B. `.artikel-figur .ill-oeffnung`; eine Variable je Ansicht verbietet der Token-Prüfer).
- Ansichts-Stile: Der Bau schreibt nur Bündel, die eine Seite lädt (vorher 7 verwaiste Einzeldateien neben den zusammengesetzten).
- Verworfen: Mono-Ersatzschrift je Stärke. Gemessen ist sie in allen Stärken pixelgleich (1.706 × 130 px bei 100 px); 16 Ladevorgänge mit Layout-Shift-Beobachter (gedrosselt und ungedrosselt) zeigten keine Verschiebung. Die Zuordnung der seltenen 0,016 unter gzip zur Mono-Schrift ist eine Vermutung von Lighthouse; der Wert liegt weit unter 0,1.
- Nachträge aus den Ansichtspaketen (Anlauf 2): Kopf zwischen 64 und 80em dichter gesetzt (Navigationspunkte ohne Umbruch, Leistungen-Panel am Kopf verankert; bei 1024 px lief jede Seite 38 px über). M-20 läuft beim Laden, weil der Lahnbogen jetzt im Kopf von „Über uns“ steht (ein view()-Zeitstrahl wäre dort vor dem ersten Scrollen abgelaufen). M-19 zieht die Maske statt der gestrichelten Linie. Die A–Z-Leiste klebt erst ab 64em; darunter ist sie umbrochen, jede Gruppe hat einen Rücksprung. Kartentitel (`.weiter-titel`) bekommen wie Überschriften nur Fugen-Trennstellen. Einleitungen in fs-1 trennen nicht automatisch. Bewegung einer einzelnen Ansicht (M-12 Rechner) darf im Ansichts-Stil unter `@layer bewegung` stehen; gemeinsamer Deckkraft-Keyframe heißt `erscheinen`.

## D-E5-02 · AUSNAHME A-2: Z-04 nach zwei Anläufen (Denkprotokoll, 2026-10-26)
- Ziel: Z-04 – jede Hauptansicht Ansichtswert ≥ 8, keine Kategorie < 7, Blindvergleich zugunsten des neuen Stands.
- Stand: Blindvergleich in beiden Anläufen erfüllt (24/24). Ansichtswert verfehlt: Anlauf 1 6,50–7,67 (mildere Skala), Anlauf 2 6,33–7,50 (Rubrik wörtlich nach AUFTRAG). Zwischen den Anläufen: gemeinsame Befunde und sechs Ansichtspakete mit unabhängiger Gegenprüfung.
- Wege: (a) dritter Anlauf nach einer weiteren Paketrunde – widerspricht L3 („höchstens zwei Anläufe je Etappentor“) und „Endprüfung einmal je Abschlussversuch“; (b) AUSNAHME mit bester Ersatzlösung: Blindvergleich als Überlegenheitsnachweis, alle Messwerte im Budget, Befunde aus Anlauf 2 als zweite Paketrunde je Ansicht und Kategorie (soweit die Grenze „zwei je Ansicht und Kategorie“ reicht; V01 hat Komposition und Details ausgeschöpft), Rest als offene Punkte; (c) Werte umdeuten (Mittel beider Anläufe, mildere Skala) – senkt das Kriterium still und verstößt gegen „nichts so bauen, dass es nur eine Prüfung besteht“.
- Bewertung nach Nordstern, Kriterien, Risiko, Aufwand: (b) ist der einzige Weg, der ehrlich bleibt und die Laufzeit in auslieferbare Verbesserungen steckt; (a) und (c) scheiden nach den Regeln aus.
- Umkehrprobe: Will der Mensch das Kriterium dennoch belegt sehen, beauftragt er eine neue Gestaltungsprüfung; Befundlisten und Bildsätze liegen vor. An der Website hängt nichts von der Ausnahme ab.
- Folgen zweiter Ordnung: Damit sind beide erlaubten Ausnahmen belegt (A-1, A-2). Jedes weitere unerreichbare Kriterium führte zu HALT; alle übrigen Kriterien müssen mit Beleg erfüllt sein. Die Streuung zwischen Prüfern ist groß (gleicher Stand wäre mit der Skala aus Anlauf 1 höher bewertet worden) – das steht im Bericht, ohne es als Ersatz für den Wert zu nehmen.

