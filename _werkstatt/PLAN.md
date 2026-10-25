# PLAN · Version 2 (2026-10-25, L0-Runde 1 eingearbeitet)
Grundlage: `_werkstatt/PLAN-GENEHMIGT.md` (vom Menschen genehmigt) und KERN v1. Opus = Orchestrator (Stufe 3), H = Haiku (Stufe 1/2). Kennung `[Etappe]-[ROLLE]-[Nr]`. Spalte „Commit“ wird beim Abnehmen gefüllt.

## Mengengerüst
| Art | Menge |
|---|---|
| Kernseiten (ohne Orte/Hubs/Ratgeber) | 38 Routen (siehe Routenliste) |
| Ratgeber | 1 Übersicht + 19 Artikel |
| Hubs | 1 Einsatzgebiet + ~15 Länder (inkl. NL) + ~400 Kreise/Provinzen |
| Ortsseiten | ~6.000 (endgültig nach Abgleich) |
| Komponenten | 14 (K-009) |
| Icons | 56 (K-008-Vertrag) · Illustrationen 13 |
| Bewegungen | 21 Registereinträge, 4 große Momente |
| Sprachen | Deutsch (NL-Ortsseiten ebenfalls Deutsch, ANNAHME) |
| Neue Logik (mit Tests) | Escaping, Slugs/Register, Orts-Abgleich, Geo/Zonen, Preisrechner, Mailto, Ortsindex/Suche, Platzhalter, Redirect-Prüfung, Linkgraph, Prüfer |

## Routenliste (exakt)
`/` · `/notoeffnung/` · `/notoeffnung/tueroeffnung/` · `/notoeffnung/autooeffnung/` · `/notoeffnung/garagenoeffnung/` · `/notoeffnung/tresoroeffnung/` · `/notoeffnung/einbruchschaden/` · `/einbruchschutz/` · `/einbruchschutz/schliesszylinder/` · `/einbruchschutz/schliessanlagen/` · `/einbruchschutz/tuerschloesser/` · `/einbruchschutz/zusatzschloesser/` · `/einbruchschutz/schutzbeschlaege/` · `/einbruchschutz/tuersicherung/` · `/einbruchschutz/fenstersicherung/` · `/einbruchschutz/tuerschliesser/` · `/sicherheitstechnik/` · `/sicherheitstechnik/alarmanlagen/` · `/sicherheitstechnik/videoueberwachung/` · `/sicherheitstechnik/nebelsysteme/` · `/sicherheitstechnik/rauchmelder/` · `/einbau-tresore/` · `/einbau-tresore/sicherheitstueren/` · `/einbau-tresore/sicherheitsfenster/` · `/einbau-tresore/moebeltresore/` · `/einbau-tresore/wertschutzschraenke/` · `/einbau-tresore/datensicherungsschraenke/` · `/einbau-tresore/waffenschraenke/` · `/leistungen/` · `/preise/` · `/einsatzgebiet/` · `/einsatzgebiet/{land}/` · `/einsatzgebiet/{land}/{kreis}/` · `/schluesseldienst-{slug}/` · `/suche/` · `/sitemap/` · `/ratgeber/` + 19 × `/ratgeber/{artikel}/` · `/ueber-uns/` · `/karriere/` (nur mit Stellen) · `/kontakt/` · `/impressum/` · `/datenschutz/` · `/widerruf/` · `/barrierefreiheit/` · `/quellen-lizenzen/` · `/404.html`.
Ratgeber-Artikel: ausgesperrt-was-tun · tuer-zugefallen-oder-abgeschlossen · schluesseldienst-abzocke-erkennen · schluesseldienst-kosten · schluessel-verloren · schluessel-im-auto · schliesszylinder-wechseln · einbruchschutz-wohnung · einbruchschutz-haus · haustuer-sicherheitscheck · nach-einbruch-was-tun · schadensbilder · rc-widerstandsklassen · foerderung-einbruchschutz · rauchmelderpflicht · tresor-kaufen-widerstandsgrade · waffenschrank-vorschriften · elektronische-schliessanlagen · alarmanlage-planen.

## Etappen, Wellen, kritischer Pfad
- **E0** Start/Erkundung → **E1** Plan → **E2** Kern & Referenz (E2a Generator+Prüfer → E2b Spike → E2c Orte → E2d Referenz V01) → **E3** W1 Gruppen/Icons/Tests, W2 Details/Ortsseiten/Hubs → **E4** W3 Preise/Kontakt/Über uns/Recht/Suche/Ratgeber, W4 Einsatzgebiet/OG/Docs → **E5** Kür, Prüfstufe C, Abschluss.
- Kritischer Pfad: Generator-Kern → Prüfer → Tokens/Layout → V01 (Tor) → V03-Vorlage → Detailseiten; parallel Orts-Pipeline → `orte.json` → V07/V06/Indizes → Linkgraph → Z-08 auf Ortsseiten.

## Pflichtpakete (nach Wirkung, je Etappe)
| Kennung | Ziel | Rolle | Modell | Stufe | Schreibrechte (Kern) | Abh. | Kriterium | Commit |
|---|---|---|---|---|---|---|---|---|
| E0-PRUEF-01 | Werkzeuge Bild/Bildsatz/Überlauf/axe/Smoke | Prüfer | H | 1 | `_werkstatt/werkzeuge/{bild,bildsatz,ueberlauf,axe,smoke}.mjs` | – | Z-02 Z-07 Z-09 | |
| E0-PRUEF-02 | Werkzeuge Lighthouse/vnu/Bildrate/INP + README | Prüfer | H | 1 | `_werkstatt/werkzeuge/{lighthouse,vnu,bildrate,inp}.mjs, README.md` | – | Z-05 Z-08 | |
| E0-KUND-01 | Themenmatrix A | Kundschafter | H | 1 | `_werkstatt/berichte/E0-themen-a.md` | – | Z-01 | |
| E0-KUND-02 | Themenmatrix B | Kundschafter | H | 1 | `_werkstatt/berichte/E0-themen-b.md` | – | Z-01 | |
| E0-PRUEF-03 | Vorher-Baseline Wettbewerber (maskiert, Kennzahlen) | Prüfer | H | 1 | `_werkstatt/werkzeuge/vorher.mjs`, `_werkstatt/berichte/E0-vorher-kennzahlen.md` | 01, 02 | Z-04 Z-08 (informativ) | |
| E2-OPUS-01 | Generator-Kern: html-Escaping, Konfig, Platzhalter/Verifizieren, Routen, Layout-Gerüst, Assets (Fingerabdruck, SRI, CSS, JS-Bündel), Build-Modi, Vorschau-Server, Hoster-Konfigurationen | Opus | Opus | 3 | `package.json`, `bau/**`, `src/konfig/**`, `src/vorlagen/layout.mjs` | – | Z-02 | |
| E2-OPUS-02 | Prüfer-Kern: Sicherheits-Linter S01–S21, SEO-Prüfer (Titel/Meta/H1/Canonical/Sitemap), Linkgraph, Prüfer-Schnittstelle | Opus | Opus | 3 | `bau/pruefen/{index,sicherheit,seo,links}.mjs`, `test/fixtures/pruefen/**` | 01 | Z-02 Z-07 | |
| E2-PRUEF-04 | Plagiatsprüfer + Fingerabdruck (nur Hashes) | Prüfer | H | 2 | `bau/pruefen/plagiat.mjs`, `bau/pruefen/fingerabdruck.json`, `pipeline/fingerabdruck.mjs`, `test/plagiat.test.mjs` | 02 | Z-02 | |
| E2-PRUEF-05 | Ehrlichkeits-, Fakten-, Marken-, Emoji-Prüfer | Prüfer | H | 2 | `bau/pruefen/{ehrlichkeit,fakten,emoji}.mjs`, `test/ehrlichkeit.test.mjs` | 02 | Z-02 Z-03 | |
| E2-PRUEF-06 | Token-Linter, JSON-LD-Prüfer, Budget-Prüfer | Prüfer | H | 2 | `bau/pruefen/{token,jsonld,budgets}.mjs`, `test/token.test.mjs` | 02 | Z-03 Z-08 | |
| E2-OPUS-03 | Technik-Spike (Stub-Seite: CSP, Trusted Types, COEP, Schrift, View Transition, Symbole, SVG-Animation) | Opus | Opus | 3 | `src/vorlagen/seiten/spike.mjs` (später entfernt) | 01 | Z-05 Z-08 | |
| E2-PRUEF-07 | Spike vermessen: Smoke, axe, Lighthouse, vnu, Bildrate; Kalibrier-Fixtures rot | Prüfer | H | 1 | `_werkstatt/berichte/E2-spike.md` | 03 | Z-05 Z-08 | |
| E2-BAU-01 | Orts-Pipeline 00-laden/10-quellen/20-index mit Zusicherungen | Baumeister | H | 2 | `pipeline/orte/{00-laden,10-quellen,20-index}.mjs`, `pipeline/orte/lib.mjs`, `test/pipeline-quellen.test.mjs` | 01 | Z-02 | |
| E2-OPUS-04 | Orts-Abgleich 30 + Gold-Set + Kalibrierung | Opus | Opus | 3 | `pipeline/orte/30-abgleich.mjs`, `pipeline/orte/gold.json`, `pipeline/orte/regeln.json`, `pipeline/orte/zuordnung-manuell.json`, `test/abgleich.test.mjs` | BAU-01 | Z-02 | |
| E2-BAU-02 | Orts-Pipeline 40-umkreis/50-anreichern/60-slugs/90-pruefen, `orte.json`, Indizes | Baumeister | H | 2 | `pipeline/orte/{40,50,60,90}-*.mjs`, `pipeline/orte/alle.mjs`, `src/daten/orte*.json`, `src/daten/slug-register.json`, `test/geo.test.mjs`, `test/slug.test.mjs` | OPUS-04 | Z-02 | |
| E2-OPUS-05 | Tokens, Basis-CSS, Layout, Kopf, Fuß, Rufleiste, Icon-Grundlage (15 Icons), Schriften | Opus | Opus | 3 | `src/assets/css/**`, `src/assets/schriften/**`, `src/assets/icons/*.svg` (15), `src/vorlagen/teile/{kopf,fuss,rufleiste,icons}.mjs` | 01 | Z-03 Z-06 Z-07 | |
| E2-OPUS-06 | Referenz V01 Startseite komplett: I-01, M-16, Ortssuche/PLZ-Prüfung (JS), Preisauszug, Triage, Register, Ablauf, Seriös-erkennen, FAQ | Opus | Opus | 3 | `src/vorlagen/seiten/start.mjs`, `src/inhalte/start.mjs`, `src/assets/js/**`, `src/assets/css/komponenten/*.css` | 05 | Z-04 Z-05 | |
| E2-OPUS-07 | Registries: Routen, Navigation, Themenpässe aller Inhaltsseiten | Opus | Opus | 3 | `src/konfig/{navigation,routen,themenpaesse}.mjs` | 01 | Z-01 | |
| E2-PRUEF-08 | Prüfstufe B Referenz + Bildsatz | Prüfer | H | 1 | `_werkstatt/berichte/E2-pruefstufe-b.md`, `_werkstatt/bilder/E2/**` | 06 | Z-02…Z-09 | |
| E2-REVIEW | Sichtabnahme Referenz (frischer Opus-Agent) ≥ 8 | Opus | Opus | 3 | `_werkstatt/berichte/E2-sichtabnahme.md` | PRUEF-08 | Z-04 | 2 Anläufe: 6,8 → 7,5 (offen, s. u.) |
| E3-OPUS-01 | Szenen-Engine M-17 + Illustrationen I-03/I-04/I-05 | Opus | Opus | 3 | `src/assets/js/module/szene.mjs`, `src/vorlagen/teile/illustrationen/*.mjs` | E2 | Z-05 Z-06 | |
| E3-OPUS-02 | V02-Vorlage + Gruppenseite `/notoeffnung/` als Muster | Opus | Opus | 3 | `src/vorlagen/seiten/gruppe.mjs`, `src/inhalte/notoeffnung/index.mjs` | E3-OPUS-01 | Z-04 | |
| E3-BAU-01…03 | Gruppenseiten `/einbruchschutz/`, `/sicherheitstechnik/`, `/einbau-tresore/` (je 1 Paket) | Baumeister | H | 2 | je genau eine Datei: `src/inhalte/einbruchschutz/index.mjs` · `src/inhalte/sicherheitstechnik/index.mjs` · `src/inhalte/einbau-tresore/index.mjs` | E3-OPUS-02 | Z-01 Z-04 | |
| E3-GRAF-01…03 | Icons nach Vertrag (restliche, in 3 Paketen) + Geometrie-Linter | Grafiker | H | 2 | exakte Icon-Dateiliste je Paket (disjunkt, im Paketblatt), `bau/pruefen/icons.mjs` nur GRAF-01 | E2-OPUS-05 | Z-06 | |
| E3-PRUEF-09 | Unit-Tests Logik (Preise, Mailto, Ortsindex, Redirects) | Prüfer | H | 2 | `test/{preise,mailto,ortsindex,redirect}.test.mjs` | E2-OPUS-01, E2-OPUS-02 | Z-02 | |
| E3-OPUS-03 | V03-Vorlage + `/notoeffnung/tueroeffnung/` als Muster | Opus | Opus | 3 | `src/vorlagen/seiten/leistung.mjs`, `src/inhalte/notoeffnung/tueroeffnung.mjs` | E3-OPUS-02 | Z-04 | |
| E3-BAU-04…11 | 22 Detailseiten in Dreierpaketen (8 Pakete) | Baumeister | H | 2 | je 3 Dateien `src/inhalte/{gruppe}/{seite}.mjs`, Namen im Paketblatt, disjunkt | E3-OPUS-03 | Z-01 | |
| E3-OPUS-04 | V07 Ortsseiten-Vorlage, Zonentexte, Orts-FAQ, Lagekarte, Weilburg-Seite | Opus | Opus | 3 | `src/vorlagen/seiten/ort.mjs`, `src/inhalte/orte/**` | E2-BAU-02 | Z-01 Z-08 | |
| E3-BAU-12 | V06 Hubs Land/Kreis + A–Z-Verzeichnis | Baumeister | H | 2 | `src/vorlagen/seiten/hub.mjs`, `src/assets/css/komponenten/az.css` | E3-OPUS-04 | Z-01 | |
| E3-PRUEF-10 | Linkgraph-, Ähnlichkeits- und Ortsstichproben-Messung (100 Orte) | Prüfer | H | 1 | `_werkstatt/berichte/E3-orte.md` | E3-BAU-12, E3-OPUS-04 | Z-02 | |
| E3-PRUEF-11 | Prüfstufe B Etappe 3 + Bildsatz | Prüfer | H | 1 | `_werkstatt/berichte/E3-pruefstufe-b.md` | E3-OPUS-01…04, E3-BAU-01…12 | Z-02…Z-09 | |
| E4-OPUS-01 | V04 Preise + Rechner + 24-h-Zeitfensterleiste | Opus | Opus | 3 | `src/vorlagen/seiten/preise.mjs`, `src/assets/js/module/preisrechner.mjs`, `src/assets/js/logik/preise.mjs` | E3 | Z-01 Z-07 | |
| E4-OPUS-02 | Mailto-Logik + V10 Kontakt | Opus | Opus | 3 | `src/assets/js/logik/mailto.mjs`, `src/assets/js/module/composer.mjs`, `src/vorlagen/seiten/kontakt.mjs` | E3 | Z-01 Z-07 | |
| E4-OPUS-03 | V05 Einsatzgebiet + I-10 Rasterkarte + M-18/M-19 | Opus | Opus | 3 | `src/vorlagen/seiten/einsatzgebiet.mjs`, `pipeline/karte.mjs`, `src/assets/js/module/karte.mjs` | E3 | Z-04 Z-05 | |
| E4-OPUS-04 | V08 Ratgeber-Vorlagen (Übersicht + Artikel) + Muster-Artikel `schluesseldienst-abzocke-erkennen` | Opus | Opus | 3 | `src/vorlagen/seiten/{ratgeber,artikel}.mjs`, `src/inhalte/ratgeber/schluesseldienst-abzocke-erkennen.mjs` | E3 | Z-01 | |
| E4-KUND-03…05 | Faktenblätter mit Primärquellen (Ratgeber, Landesregeln) | Kundschafter | H | 1 | exakte Dateiliste `src/inhalte/fakten/*.mjs` je Paket (disjunkt) | E2-OPUS-07, E4-OPUS-04 | Z-01 | |
| E4-BAU-13…18 | 18 Ratgeber-Artikel in Dreierpaketen (6 Pakete) | Baumeister | H | 2 | je 3 Dateien `src/inhalte/ratgeber/*.mjs`, Namen im Paketblatt, disjunkt | E4-OPUS-04, E4-KUND-03…05 | Z-01 | |
| E4-BAU-19 | V09 Über uns (ohne M-20) + Karriere-Vorlage mit Fixture | Baumeister | H | 2 | `src/vorlagen/seiten/{ueber-uns,karriere}.mjs`, `src/inhalte/ueber-uns.mjs` | E3-OPUS-02 (Muster Erzählansicht) | Z-01 | |
| E4-OPUS-05 | M-20 „Der gerade Weg“ + I-11 Lahnbogen | Opus | Opus | 3 | `src/vorlagen/teile/illustrationen/lahnbogen.mjs` | BAU-19 | Z-04 Z-05 | |
| E4-BAU-20 | Recht-Entwürfe: Impressum, Datenschutz, Widerruf, Barrierefreiheit, Quellen & Lizenzen | Baumeister | H | 2 | `src/inhalte/recht/*.mjs`, `src/vorlagen/seiten/recht.mjs` | E3-OPUS-03 (Muster Arbeitsansicht) | Z-01 Z-10 | |
| E4-BAU-21 | V11 Suche (Index + Modul), `/sitemap/`, `/leistungen/`-Register mit Filter, 404 mit M-21 | Baumeister | H | 2 | `src/vorlagen/seiten/{suche,sitemap,leistungen,fehler}.mjs`, `src/assets/js/module/suche.mjs` | E3-OPUS-03, E2-OPUS-06 (Ortssuche als Muster) | Z-01 | |
| E4-GRAF-04 | OG-Bilder (PNG je Seitentyp und Zone) per Werkzeugskript | Grafiker | H | 2 | `_werkstatt/werkzeuge/og.mjs`, `src/assets/og/*.png` | E2-OPUS-05, E2-OPUS-06 | Z-06 | |
| E4-PRUEF-12 | `live-check.mjs` (Header, MIME, 404, Weiterleitungen) | Prüfer | H | 2 | `werkzeuge/live-check.mjs` | E2-OPUS-01 | Z-10 | |
| E4-DOK-01 | README, `docs/` (BETRIEB, OFFENE-PUNKTE, Hoster-Checkliste) | Dokumentar | H | 1 | `README.md`, `docs/*.md` | E2-OPUS-01, E4-OPUS-01…05 | Z-10 | |
| E4-PRUEF-13 | Prüfstufe B Etappe 4 + Bildsatz | Prüfer | H | 1 | `_werkstatt/berichte/E4-pruefstufe-b.md` | E4-OPUS-01…05, E4-BAU-13…21 | Z-02…Z-09 | |
| E5-PRUEF-14 | Prüfstufe C | Prüfer | H | 1 | `_werkstatt/berichte/E5-pruefstufe-c.md`, `_werkstatt/bilder/abschluss/**` | alle Pflichtpakete E2–E4; Maßstab E2-REVIEW | alle | |
| E5-DOK-02 | BERICHT + Galerie (blind, Schlüssel getrennt), `werkzeuge/` und `docs/` herauslösen | Dokumentar | H | 1 | `_werkstatt/BERICHT.md`, `_werkstatt/bilder/galerie.html` | E5-PRUEF-14, E2-REVIEW | Z-04 Z-10 | |
| E5-REVIEW | Endprüfung frischer Opus-Agent | Opus | Opus | 3 | `_werkstatt/berichte/E5-endpruefung.md` | DOK-02 | alle | |

## Kür (nach Wirkung, wächst nach dem Plan nicht)
| Kennung | Ziel | Rolle | Modell |
|---|---|---|---|
| K-01 | Druckstile Preise/Ratgeber/Ortsseite | Baumeister | H |
| K-02 | Szenen-Feinschliff (Sichtabnahme-Befunde) | Opus | Opus |
| K-03 | I-13 Schadensbilder für Ratgeber „schadensbilder“ | Grafiker | H |
| K-04 | Ortsseiten: Mini-Lagekarte mit Peilungslinie (M-19) auf allen Ortsseiten | Opus | Opus |
| K-05 | Vorkomprimierte `.br/.gz` für Apache/nginx (`--vorkomprimieren`) | Baumeister | H |
| K-06 | Barrierefreiheit: `forced-colors`-Feinschliff aller Komponenten | Baumeister | H |
| K-07 | Leistungsregister: Filter-Zustandswechsel (M-05-Muster) | Baumeister | H |
| K-08 | Kreis-Hub-Intros je Kreis aus Daten (Gemeindezahl, Fläche ohne Erfindung) | Baumeister | H |

## Modellanteil und Kapazität
- Pflicht (Bereiche aufgelöst): 67 Pakete (Haiku 49, Opus 18 inkl. 2 Abnahmen) → Haiku-Anteil 73 %; mit Kür 75 Pakete (Haiku 54).
- Kapazität: 49 Haiku-Pakete ÷ (4 Plätze × 3 Wellen/Tag) × 1,2 ≈ 4,9 Tage Haiku-Laufzeit; Opus-Pakete laufen dazwischen. Erwartete Laufzeit ≈ 6 Etappen.
- Regel aus L0: Bereichspakete (…01…03) bekommen vor Wellenstart ein Paketblatt in `_werkstatt/pakete/` mit exakter, disjunkter Dateiliste.

## Offene Punkte
- **E2-Tor (Sichtabnahme V01) nach zwei Anläufen nicht erreicht (L3):** Anlauf 1 = 6,8, Anlauf 2 = 7,5 (Typografie 8, Komposition 7, Farbe 8, Bewegung 8, Grafik 7, Details 7). Arbeit geht weiter. Die Kategorien unter 8 sind als Pakete der Etappe 3 umgesetzt: E3-V01-KOMP, E3-V01-GRAFIK und E3-V01-DET (je 1 von höchstens 2 im Lauf). Umgesetzt sind die fünf Schwellen-Änderungen aus `berichte/E2-sichtabnahme-2.md`: Hero an Grundlinie und breit-Kante, Preistabelle 4/8, Triage- und Knopfabstände, Karte, kupferne Schließpunkte und alarmzentrale. Nachweis über Prüfstufe C und E5-REVIEW (Z-04).
