# E3-orte · Messbericht Linkgraph, Textähnlichkeit, Ortsstichprobe

Paket E3-PRUEF-10 · Kern-Version 1 · Stand 2026-10-25. Build aus HEAD `8462382` mit Arbeitsbaum-Änderungen paralleler Pakete (14:33 u. a. `src/konfig/preise.mjs`, `src/inhalte/orte/weilburg.mjs`). Messgrundlage: `.cache/E3-PRUEF-10/dist`; JSON-Ergebnisse in `.cache/E3-PRUEF-10/`.

## 1. Build

`node bau/bauen.mjs --messen --pruefen --aus=.cache/E3-PRUEF-10/dist`, Exit 0, 5.533 Seiten (5.532 index.html, 404.html). Fehler: 0 in allen elf Prüfern. Warnungen: links 2, seo 72. Build-Hinweis: 9 interne Links auf geplante Seiten. Platzhalter: 42 in der Ausgabe, 56 in der Konfiguration; ungeprüfte Fakten: 33.

## 2. Linkgraph

Grundgesamtheit: 5.532 Seiten.

| Kennzahl | Wert |
|---|---|
| Kanten (verschieden, ohne Selbstlinks) | 327.991 |
| Interne Link-Vorkommen | 613.655, davon 141.376 auf fehlende Ziele |
| Eingehend je Seite: Min / 5 %-Quantil / Median / Max | 2 / 8 / 11 / 5.531 (Max: Startseite) |
| Seiten mit < 3 eingehenden Links | 2 |
| Waisen (0 eingehend, außer /) | 0 |
| Klicktiefe, Verteilung Tiefe 0 / 1 / 2 / 3 | 1 / 63 / 407 / 5.061 (max 3) |
| Tiefe > 4 · unerreichbar | 0 · 0 |

Keine Links auf Dateien, ohne Schrägstrich oder auf index.html. 7 Vorkommen mit Anker (Ziel = Seite).

## 3. Textähnlichkeit

Grundgesamtheit: 5.252 Ortsseiten. Wörter im `<main>` Median 386, verschiedene 5-Gramme Median 377.

| Gruppe | n | Median | 95 %-Quantil | Maximum |
|---|---|---|---|---|
| Zufallspaare (Saat 7) | 2.000 | 0,281 | 0,437 | 0,545 |
| Nachbarpaare (aus 23.430 verschiedenen) | 2.000 | 0,471 | 0,540 | 0,660 |

Die 10 ähnlichsten Paare je Gruppe (Jaccard; Slugs ohne Präfix `/schluesseldienst-`):

| # | Zufall: Wert · Paar | Nachbar: Wert · Paar |
|---|---|---|
| 1 | 0,5451 · ettinghausen – helferskirchen | 0,6595 · idstein-gassenbach – idstein |
| 2 | 0,5311 · streithausen – unnau | 0,6124 · biebrich – ebertshausen |
| 3 | 0,5278 · guckheim – haertlingen | 0,6020 · flacht – oberneisen |
| 4 | 0,4989 · menslage – ostercappeln | 0,5996 · hofheim-langenhain – hofheim-lorsbach |
| 5 | 0,4867 · lemgo-lueerdissen – lemgo-welstorf | 0,5967 · horn-bad-meinberg-horn – horn-bad-meinberg |
| 6 | 0,4855 · berod-bei-wallmerod – wied | 0,5944 · marsberg-niedermarsberg – marsberg |
| 7 | 0,4755 · lollar – pohlheim-hausen | 0,5890 · idstein-niederrod – idstein-oberrod |
| 8 | 0,4747 · lobbach – tamm | 0,5872 · nisterau-pfuhl – nisterau |
| 9 | 0,4708 · eberdingen – grossbottwar | 0,5869 · wiesbaden-hessloch – wiesbaden-medenbach |
| 10 | 0,4693 · herdorf-dermbach – kuhnhoefen | 0,5855 · kleinkahl-grosslaudenbach – kleinkahl-kleinlaudenbach |

## 4. Ortsstichprobe

Saat 7, je Zone aus der nach Slug sortierten Population.

| Zone | Grundgesamtheit | gezogen | Gemeinde / Ortsteil |
|---|---|---|---|
| A | 244 | 25 | 2 / 23 |
| B | 795 | 25 | 6 / 19 |
| C | 998 | 25 | 8 / 17 |
| D | 3.168 | 15 | 7 / 8 |
| NL | 47 | 10 | 1 / 9 |

In der Stichprobe: 0 Stadtstaaten, 0 Orte ohne Kreis, 0 Orte ohne PLZ.

| Prüfung | n | ok | abweichend | entfällt |
|---|---|---|---|---|
| Seite existiert; H1 enthält Ortsnamen | 100 | 100 | 0 | 0 |
| Faktenzeile Gemeinde (nur Ortsteile) | 76 | 76 | 0 | 24 |
| Faktenzeile Kreis, Land, alle PLZ, km und Richtung (je exakt) | 100 | 100 | 0 | 0 |
| Titel nennt Weilburg; Titel nennt km-Zahl (C, D, NL) | 50 | 50 | 0 | 50 |
| H1 nennt Weilburg (C, D, NL) | 50 | 50 | 0 | 50 |
| H1 nennt km-Zahl (C, D, NL) | 50 | 0 | 50 | 50 |
| NL ohne `class="preis"` | 10 | 10 | 0 | 90 |
| JSON-LD parsebar; ohne LocalBusiness/Locksmith; ohne aggregateRating | 100 | 100 | 0 | 0 |
| Brotkrumen: Reihenfolge und Bezeichnung | 100 | 98 | 2 | 0 |
| Brotkrumen-Links existieren | 100 | 100 | 0 | 0 |

## 5. Abweichungen mit Pfad

**A. H1 nennt km-Zahl nicht: 50 von 50 (C, D, NL).** Die H1 lautet etwa „Schlüsseldienst für Schalksmühle – aus Weilburg“. Die Titel nennen die km-Zahl in 50 von 50 Fällen.
- C (25): /schluesseldienst-gruenberg-lardenbach/ /schluesseldienst-hanau-mittelbuchen/ /schluesseldienst-bornheim-hersel/ /schluesseldienst-borken/ /schluesseldienst-selzen/ /schluesseldienst-grossostheim-wenigumstadt/ /schluesseldienst-dreieich-offenthal/ /schluesseldienst-moembris-reichenbach/ /schluesseldienst-haibach/ /schluesseldienst-bad-koenig-fuerstengrund/ /schluesseldienst-netphen-frohnhausen/ /schluesseldienst-sommerkahl-vormwald/ /schluesseldienst-lohmar-breidt/ /schluesseldienst-reinheim-spachbruecken/ /schluesseldienst-much-hillesheim/ /schluesseldienst-sommerkahl/ /schluesseldienst-bonn-duisdorf/ /schluesseldienst-lindenfels-seidenbuch/ /schluesseldienst-much-gerlinghausen/ /schluesseldienst-schalksmuehle/ /schluesseldienst-werdohl/ /schluesseldienst-riedstadt-goddelau/ /schluesseldienst-meinerzhagen/ /schluesseldienst-wesseling/ /schluesseldienst-wetter-amoenau/
- D (15): /schluesseldienst-leinfelden-echterdingen-echterdingen/ /schluesseldienst-schlangen/ /schluesseldienst-aerzen-flakenholz/ /schluesseldienst-koengen/ /schluesseldienst-garrel/ /schluesseldienst-owen/ /schluesseldienst-lemgo-brake-lemgo/ /schluesseldienst-rastede-barghorn/ /schluesseldienst-wiesloch/ /schluesseldienst-lemwerder-ritzenbuettel/ /schluesseldienst-schoenau/ /schluesseldienst-hirschberg-an-der-bergstrasse/ /schluesseldienst-minden-minderheide/ /schluesseldienst-porta-westfalica-lerbeck/ /schluesseldienst-lemgo-wahmbeck/
- NL (10): /schluesseldienst-dinkelland-tilligte/ /schluesseldienst-dinkelland-noord-deurningen/ /schluesseldienst-almelo-aadorp/ /schluesseldienst-beuningen/ /schluesseldienst-twenterand-vriezenveen/ /schluesseldienst-tubbergen-mariaparochie/ /schluesseldienst-losser-glane/ /schluesseldienst-borne-zenderen/ /schluesseldienst-losser-overdinkel/ /schluesseldienst-borne-hertme/

**B. Brotkrumen-Bezeichnung Kreis (2 von 100).** Reihenfolge und Links stimmen, nur die Bezeichnung weicht ab:
- /schluesseldienst-wiesbaden-frauenstein/ (B): „Wiesbaden (kreisfreie Stadt)“ statt „Kreisfreie Stadt Wiesbaden“
- /schluesseldienst-bonn-duisdorf/ (C): „Bonn (kreisfreie Stadt)“ statt „Kreisfreie Stadt Bonn“

**C. Beobachtung außerhalb der Prüfpunkte.** /schluesseldienst-lemgo-brake-lemgo/ (D): H1 und Titel lauten „Brake (Lemgo) (Lemgo)“.

**D. Links auf fehlende Ziele (Linkgraph).** 23 Ziele, 141.376 Vorkommen:
- 11 Ziele von allen 5.532 Seiten: /preise/ (27.069 Vorkommen), /kontakt/ (20.838), /leistungen/, /suche/, /ueber-uns/ (je 16.596), /quellen-lizenzen/ (10.784), /barrierefreiheit/, /datenschutz/, /impressum/, /sitemap/, /widerruf/ (je 5.532)
- /ratgeber/rauchmelderpflicht/: 5.210 Vorkommen, 5.207 Quellseiten (davon 5.205 Ortsseiten)
- 11 weitere /ratgeber/…-Ziele mit 1 bis 6 Vorkommen

**E. Build-Warnungen.** links: /ratgeber/schliesszylinder-wechseln/ und /einsatzgebiet/schleswig-holstein/pinneberg/ (je 2 eingehende Links). seo: 72 Ortsseiten-Titel über 60 Zeichen (D 41, C 30, B 1); Liste in `.cache/E3-PRUEF-10/dist.pruefbefunde.json`.

## 6. Selbstprüfung

- Jedes Werkzeug zweimal mit Saat 7: Ausgaben byte-identisch.
- Drei Jaccard-Werte und drei Linkzahlen stimmen mit einer unabhängigen Auswertung überein (Skript im Scratchpad; grep).
- Werkzeugtest über alle 5.252 Orte (kein Teil der Messung, Ausgabe in `.cache/E3-PRUEF-10/selbsttest/`): Stadtstaat-Zweig (53 Orte, Berlin und Bremen) und Orte ohne Kreis (2) ok; H1-km abweichend 4.213 von 4.213 (C, D, NL); Brotkrumen-Reihenfolge abweichend 254 von 5.252 (alle wie B); Brotkrumen-Links 5.252 von 5.252 ok.

## 7. Nicht geprüft

- Browser-Messungen (Rendering, Lighthouse, axe, Bildrate, INP): nicht durchgeführt, daher keine Bildbelege.
- 5.152 Orte außerhalb der Stichprobe (nur Werkzeugtest oben). Der Stadtstaat-Zweig ist in der Stichprobe nicht besetzt.
- Textähnlichkeit: Inhalt außerhalb `<main>` und Titel nicht gezählt.
- JSON-LD ohne Schema-Validierung; NL-Preisfreiheit nur über `class="preis"`.
- Status-Codes und HTTP-Header (statisch).
- Ursache der Differenz zwischen Build-Hinweis (9) und Linkgraph (23 fehlende Ziele) nicht untersucht.
