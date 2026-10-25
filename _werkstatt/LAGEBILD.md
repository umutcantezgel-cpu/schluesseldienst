# LAGEBILD (E0, 2026-10-25)

## Das Projekt in fünf Sätzen
1. Aus den Exporten zweier Schlüsseldienst-Websites (Richter, Adam) entsteht eine eigene, rein statische Website für einen neuen Schlüsseldienst mit Sitz in Weilburg an der Lahn; der Firmenname steht noch nicht fest.
2. Die Seite deckt alle Themen beider Vorbilder ab – Notöffnungen, mechanischer Einbruchschutz, elektronische Sicherheitstechnik, Einbau und Tresore, Preise, Einsatzgebiet mit rund 6.000 Ortsseiten, Ratgeber, Kontakt und Recht –, aber mit eigenen Texten und ohne Kopien.
3. Ein eigener Generator in Node 22 ohne Abhängigkeiten erzeugt reines HTML, CSS und Vanilla-JavaScript; es gibt kein Backend, keine Drittanbieter und keine Cookies.
4. Sicherheit hat Vorrang: strikte Content-Security-Policy mit Trusted Types, Sicherheits-Header für jeden Hoster und ein Sicherheits-Linter über die gesamte Ausgabe.
5. Die Gestaltung „Scherlinie“ ist ruhig, präzise und offen im Preis, mit einer Kupferlinie als Leitelement, schnell und zugänglich nach WCAG 2.2 AA.

## Ausgangslage (Bestand)
- Kein eigener Code, kein Designsystem, keine Tests, keine eigenen Inhalte. Bestand = zwei Wettbewerber-Exporte als Rohdaten (Commit `ad81157`), die unverändert bleiben und nur von der Pipeline gelesen werden.
- **Richter** (Contao, Höchst i. Odw., bundesweites Netz): 23 Kern-/Produktseiten gescrapt; Sitemap mit 5.357 URLs (5.308 Orte inkl. 50 NL, 24 Produkte, 7 News, sitemap.html). Ortsseiten: drei Schablonenfamilien, gesponnener Text (~11,6 % eigener Anteil), einheitlicher Lockpreis, Google-Maps-Kacheln, keine Querverlinkung zwischen Orten. Drittanbieter laut Datenschutzerklärung: Cloudflare, Google Analytics 4, YouTube, Google Maps, Consent-Tool. Widersprüchliche robots-Angabe auf der Startseite.
- **Adam** (React-SPA mit Vite/Tailwind, Hochheim am Main): 10 Seiten gescrapt; Sitemap 550 URLs (532 Rhein-Main-Orte, 98 % identische Schablone, Blog mit 6 Artikeln, keine Kontakt-/Über-uns-Seite). Clientseitig gerendert (SEO-Nachteil), Template-Lecks („Ihrer Stadt“), widersprüchliche Angaben (Anfahrtszeit, Schadensfreiheit), Google-Maps-Einbettung, Bewertungs-Widgets.
- Beide Vorbilder liegen ganz oder teilweise im Weilburger Umfeld (Adam: Weilburg, Löhnberg, Merenberg, Mengerskirchen, Weilmünster, Runkel, Villmar, Limburg, Braunfels, Wetzlar; Richter: rund 50 Ortsteile im Kreis Limburg-Weilburg).

## Marke und Zielgruppe (abgeleitet = ANNAHME)
- Neuer, inhabergeführter Schlüsseldienst in Weilburg (Name offen), Handwerk statt Callcenter.
- Zielgruppe 1 (Notlage): ausgesperrte Menschen, Schlüssel abgebrochen/verloren, nach einem Einbruch – mobil, unter Stress, oft abends oder nachts, eine Hand frei.
- Zielgruppe 2 (Planung): Mieter, Eigentümer, Hausverwaltungen, kleine Betriebe, die Einbruchschutz, Schließanlagen, Alarm-/Videotechnik, Sicherheitstüren/-fenster oder Tresore planen.
- Hauptaufgaben: (1) sofort anrufen, (2) vor dem Anruf den Preis verstehen, (3) prüfen, ob der eigene Ort bedient wird, (4) seriösen Betrieb erkennen, (5) Beratung/Termin anfragen, (6) sich zu Sicherheitsthemen informieren.

## Hauptansichten (festgelegt, unveränderlich)
V01 Startseite (Referenz, Erzählung) · V02 Leistungsgruppe (Erzählung) · V03 Leistungsdetail · V04 Preise · V05 Einsatzgebiet (Erzählung) · V06 Orts-Hub (Land/Kreis) · V07 Ortsseite · V08 Ratgeber (Übersicht + Artikel) · V09 Über uns (Erzählung) · V10 Kontakt · V11 Suche · V12 Recht/System/404.

## Funktionsliste (Soll, Bestandsschutz ab Fertigstellung)
| Nr. | Funktion | Herkunft | Ansicht |
|---|---|---|---|
| F01 | Anruf mit einem Tipp von jeder Seite (Rufleiste mobil, Rufknopf Desktop) | R, A | alle |
| F02 | Orts-/PLZ-Suche mit Sprung zur Ortsseite | R (Ortssuche), A (PLZ-Check) | V01, V05, V11, 404 |
| F03 | PLZ-Prüfung „Bedienen Sie meinen Ort?“ mit ehrlichem Zonen-Ergebnis | A (PLZ-Check, in der Nähe) | V01, V05 |
| F04 | Preistabelle mit Zeitfenstern und Zuschlägen | A | V04, Auszug V01/V02 |
| F05 | Preisrechner (Leistung × Zeitpunkt × Zone → Gesamtpreis) | neu (aus A-Preisen) | V04 |
| F06 | Häufige Fragen je Seite (aufklappbar, ohne JS nutzbar) | A | V01–V03, V07 |
| F07 | Ablauf in Schritten | A | V01, V02 |
| F08 | Leistungsregister mit Gruppenfilter | R (Produktfilter) | `/leistungen/` |
| F09 | Ortsverzeichnis A–Z je Land/Kreis | R (Standorte-Akkordeon), A (Einsatzgebiete) | V05, V06 |
| F10 | Ortsseite mit Faktenblock, Nachbarorten, Lagekarte | R, A | V07 |
| F11 | Kontakt: Anruf, E-Mail, E-Mail-Composer (ohne Server) | R (Formular) | V10 |
| F12 | Seitensuche (statischer Index) | R (Suche) | V11 |
| F13 | Ratgeber-Artikel mit Inhaltsverzeichnis | R (News), A (Blog) | V08 |
| F14 | „Seriösen Schlüsseldienst erkennen“ | R (Achtung Abzocker) | V01, V07, V08 |
| F15 | Hell/Dunkel nach Systemeinstellung | neu | alle |
| F16 | Reduzierte Bewegung nach Systemeinstellung | neu | alle |
| F17 | HTML-Sitemap und XML-Sitemaps | R | `/sitemap/` |
| F18 | Fehlerseite mit Suche | neu | 404 |
| F19 | Rechtstexte erreichbar von jeder Seite | R, A | Fuß |
| F20 | Druckansicht für Preise und Ratgeber | neu | V04, V08 |
| entfällt | Sprachumschalter (Schein), Video-Einbettungen, Karten-Einbettungen, Bewertungs-Widgets, Partner-Logo-Laufband, Bildergalerie mit fremden Fotos | R, A | – |

## Ausgangswerte
- Eigene Seite existiert noch nicht → die erste eigene Messung in E2 ist die E0-Baseline im Sinne von Z-08 (Spanne aus 3 Läufen).
- Wettbewerber-Werte (nur informativ, Kennzahlen ohne Bilder): siehe `_werkstatt/berichte/E0-vorher-kennzahlen.md` (folgt aus E0-PRUEF-03).

## Stärken der Vorbilder (die wir in eigener Form übernehmen)
- Klare Notfall-Ansprache und Telefon im Vordergrund (beide).
- Preistransparenz mit Zeitfenstern (A).
- Riesige Ortsabdeckung (R) und regionale Gruppierung (A).
- Verbraucherschutz-Thema „Abzocke erkennen“ (R).
- Breites Sortiment Sicherungstechnik (R), Einbau RC2/RC3 (A).

## Schwächen mit Wirkung
- Gesponnene/identische Ortsseiten ohne echte Ortsdaten → Spam-Risiko, geringe Nützlichkeit.
- Lockpreise („ab …“) und widersprüchliche Angaben → Misstrauen, rechtliches Risiko.
- Clientseitiges Rendering (A) → schwächere Indexierung; Slider/Karussells (R) → schwache Leistungswerte (VERMUTUNG, Messung folgt).
- Drittanbieter (Maps, YouTube, Analytics, Widgets) → Datenschutz-Einwilligung nötig, langsamer.
- Keine Querverlinkung der Orte, keine Hubs pro Kreis → schwache interne Verlinkung.
- Markennamen und Herstellertexte auf Produktseiten (R) → austauschbar.

## Chancen
- Ehrlichkeit als Alleinstellung: Sitz und Entfernung offen, Gesamtpreise statt Lockpreise, keine erfundenen Bewertungen.
- Echte Ortsdaten (PLZ, Kreis, Entfernung, Nachbarorte) und dichter Linkgraph über Land- und Kreis-Hubs.
- Statische Auslieferung ohne Drittanbieter: kein Cookie-Banner, sehr schnell, sehr sicher.
- Lokale Verankerung in Weilburg (Lahn, Schiffstunnel) als unverwechselbare Gestaltungsidee.
- Ratgeber mit geprüften Fakten deckt Informations-Suchanfragen ab, die beide Vorbilder kaum bedienen.
