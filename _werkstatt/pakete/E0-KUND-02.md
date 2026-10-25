# E0-KUND-02 · Rolle Kundschafter · Modell Haiku · Stufe 1 · Kern-Version 0 (vor KERN)
Schreibrechte (exakt): _werkstatt/berichte/E0-themen-b.md
Umfang: 1 Bericht, max. 1.500 Wörter

## Rollenbriefing Kundschafter
Du erfasst einen Bereich vollständig mit Fundstellen. Häufige Fehler: zusammenfassen statt auflisten; Vermutung als Befund; Teile übersehen, die nicht über die Navigation erreichbar sind.

## Aufgabe in einem Satz
Erstelle für die Zielseiten Einbruchschutz (+8), Sicherheitstechnik (+4), Einbau & Tresore (+6) und Ratgeber (19 Themen) eine Themenmatrix: welche Themen, Fragen und Suchabsichten die Quellseiten beider Wettbewerber abdecken – in EIGENEN Worten, ohne Zitate.

## Quellen (nur lesen)
- Richter Markdown: `/home/user/schluesseldienst/Richter Schlüsseldienst/01a12b76-b326-7756-a303-8fa6e684874c 2/` – `_sicherungstechnik.html.md`, `_produkt-details.html.md`, alle `_produkt-details_*.html.md` (7 Dateien), `_aktuelle-news.html.md`, `_galerie-kurioses.html.md`, `_achtung-abzocker.html.md`, `_einbruchschaden-beseitigung.html.md`, `_share_sitemap.xml.json` liegt im Nachbarordner ohne „ 2“ (nur `grep -o 'produkt-details/[a-z0-9-]*'` und `grep -o 'news-leser/[a-z0-9-]*'` für die Slug-Listen).
- Adam (ZIP, NICHT entpacken – nur `unzip -p`): `/home/user/schluesseldienst/Schlüsseldienst Adam/dba3265a-e101-45c5-a4b2-34f91dac4d75.zip`, Einträge `01a12b8b-2e50-769a-a430-39951ec66771/www.schluesseldienst-adam.de_tuer-fenstereinbau.md`, `..._tresoroeffnung.md`, `..._sitemap.xml.md` (Blog-Slugs).

## Grenzen (zusätzlich)
- KEINE Sätze oder Satzteile über 5 Wörter aus den Quellen übernehmen. Keine Personennamen, Telefonnummern, Preise, Bewertungszahlen. **Keine Marken- oder Produktnamen** (Hersteller, Modellbezeichnungen) – beschreibe die Produktart (z. B. „Funk-Alarmzentrale mit Mobilfunkmodul“). Diese Matrix wird öffentlich im Repo liegen.
- Technische Kennwerte, Normen und Gesetze nur als „Thema: …, Norm/Fakt muss aus Primärquelle geprüft werden“ notieren, ohne Zahl.

## Schritte
1. Je Zielseite einen Abschnitt `## <Ziel-URL>` mit: (a) Quellseiten bzw. Quell-Slugs (auch nur aus der Sitemap bekannte Slugs ohne Inhalt, dann „nur Slug“), (b) 5–15 Themen in eigenen Worten, (c) Kundenfragen (eigene Formulierung, zusammengeführt), (d) Suchabsicht in 1 Satz, (e) Lücken (max. 5), (f) Abgrenzung zu Nachbarseiten (was gehört woanders hin).
2. Zielseiten: `/einbruchschutz/`, `/einbruchschutz/schliesszylinder/`, `/einbruchschutz/schliessanlagen/`, `/einbruchschutz/tuerschloesser/`, `/einbruchschutz/zusatzschloesser/`, `/einbruchschutz/schutzbeschlaege/`, `/einbruchschutz/tuersicherung/`, `/einbruchschutz/fenstersicherung/`, `/einbruchschutz/tuerschliesser/`, `/sicherheitstechnik/`, `/sicherheitstechnik/alarmanlagen/`, `/sicherheitstechnik/videoueberwachung/`, `/sicherheitstechnik/nebelsysteme/`, `/sicherheitstechnik/rauchmelder/`, `/einbau-tresore/`, `/einbau-tresore/sicherheitstueren/`, `/einbau-tresore/sicherheitsfenster/`, `/einbau-tresore/moebeltresore/`, `/einbau-tresore/wertschutzschraenke/`, `/einbau-tresore/datensicherungsschraenke/`, `/einbau-tresore/waffenschraenke/`.
3. Abschnitt `## /ratgeber/` mit je 3–6 Stichpunkten (Themen, Kundenfragen, zu prüfende Fakten) für diese 19 Artikel: ausgesperrt-was-tun, tuer-zugefallen-oder-abgeschlossen, schluesseldienst-abzocke-erkennen, schluesseldienst-kosten, schluessel-verloren, schluessel-im-auto, schliesszylinder-wechseln, einbruchschutz-wohnung, einbruchschutz-haus, haustuer-sicherheitscheck, nach-einbruch-was-tun, schadensbilder (Schäden durch Feuerwehr, Selbstversuch, Einbruch), rc-widerstandsklassen, foerderung-einbruchschutz, rauchmelderpflicht, tresor-kaufen-widerstandsgrade, waffenschrank-vorschriften, elektronische-schliessanlagen, alarmanlage-planen. Quelle je Artikel nennen (R-News-Slug, A-Blog-Slug, R-Seite) oder „neu“.

## Schnellprüfung und Selbstprüfung
- 21 Zielabschnitte + Ratgeber mit 19 Artikeln vorhanden (zählen!); Stichprobe: 3 Themenzeilen per grep gegen die Quelle geprüft (kein Satzteil > 5 Wörter übernommen); grep im eigenen Bericht nach bekannten Marken (Jablotron, UR FOG, GEZE, SimonsVoss, ABUS, BKS, EVVA, ekey, Yale, Wosta) = 0 Treffer.
- Schreibrechte eingehalten, offene Fragen gelistet.
