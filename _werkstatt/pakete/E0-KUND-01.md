# E0-KUND-01 · Rolle Kundschafter · Modell Haiku · Stufe 1 · Kern-Version 0 (vor KERN)
Schreibrechte (exakt): _werkstatt/berichte/E0-themen-a.md
Umfang: 1 Bericht, max. 1.500 Wörter

## Rollenbriefing Kundschafter
Du erfasst einen Bereich vollständig mit Fundstellen. Häufige Fehler: zusammenfassen statt auflisten; Vermutung als Befund; Teile übersehen, die nicht über die Navigation erreichbar sind.

## Aufgabe in einem Satz
Erstelle für die Zielseiten Start, Notöffnung (+5 Unterseiten), Preise, Einsatzgebiet, Ortsseite, Kontakt, Über uns und Recht eine Themenmatrix: welche Themen, Fragen und Suchabsichten die Quellseiten beider Wettbewerber abdecken – in EIGENEN Worten, ohne Zitate.

## Quellen (nur lesen)
- Richter Markdown: `/home/user/schluesseldienst/Richter Schlüsseldienst/01a12b76-b326-7756-a303-8fa6e684874c 2/` – Dateien `www.richter-sicherheitstechnik.de_.md` (Start), `_notoeffnungen.html.md`, `_einbruchschaden-beseitigung.html.md`, `_standorte.html.md` (949 KB – NUR `head -c 6000` und `grep`!), `_suche.html.md`, `_kontakt.html.md`, `_ueber-uns.html.md`, `_team.html.md`, `_stellenangebote.html.md`, `_achtung-abzocker.html.md`, `_impressum.html.md`, `_datenschutzerklaerung.html.md`, und zwei Ortsseiten als Beispiel (`_schluesseldienst-abstatt.html.md`, `_schluesseldienst-albersbach-rimbach.html.md`).
- Adam (ZIP, NICHT entpacken – nur `unzip -p`): `/home/user/schluesseldienst/Schlüsseldienst Adam/dba3265a-e101-45c5-a4b2-34f91dac4d75.zip`, Einträge `01a12b8b-2e50-769a-a430-39951ec66771/www.schluesseldienst-adam.de_<seite>.md` für `` (Start), `tueroeffnung`, `autooeffnung`, `garageoeffnung`, `tresoroeffnung`, `preise`, `wiesbaden-medenbach`.

## Grenzen (zusätzlich)
- KEINE Sätze oder Satzteile über 5 Wörter aus den Quellen übernehmen. Keine Namen von Personen, keine Telefonnummern, keine Preise der Wettbewerber, keine Bewertungszahlen, keine Markennamen. Diese Matrix wird öffentlich im Repo liegen.
- Fakten-Behauptungen der Wettbewerber (Statistiken, Normen, Gesetze) nur als „Thema: …, Fakt muss geprüft werden“ notieren, ohne Zahl.

## Schritte
1. Je Zielseite einen Abschnitt `## <Ziel-URL>` mit: (a) Quellseiten (R/A + Dateiname), (b) 5–15 Themen als Stichpunkte in eigenen Worten, (c) alle Kundenfragen, die die Quellen beantworten (eigene Formulierung, je Quelle und dann zusammengeführt, Dubletten markiert), (d) Suchabsicht in 1 Satz, (e) Lücken: was beide NICHT beantworten, aber ein Kunde in dieser Lage fragen würde (max. 5).
2. Zielseiten: `/`, `/notoeffnung/`, `/notoeffnung/tueroeffnung/`, `/notoeffnung/autooeffnung/`, `/notoeffnung/garagenoeffnung/`, `/notoeffnung/tresoroeffnung/`, `/notoeffnung/einbruchschaden/`, `/preise/` (nur Preis-STRUKTUR: welche Positionen, Zuschlagsarten, Zahlarten-Arten, Bedingungen – keine Beträge), `/einsatzgebiet/`, Ortsseite (Bausteine der beiden Ortsschablonen, als Strukturliste), `/kontakt/` (Formularfelder, Kontaktwege), `/ueber-uns/` (welche Arten von Angaben – keine Inhalte), `/impressum/` + `/datenschutz/` (nur welche Pflichtabschnitte vorkommen).
3. Am Ende: Tabelle „Module, die auf vielen Seiten wiederkehren“ (z. B. Ablauf in Schritten, PLZ-Prüfung, Preistabelle, FAQ, Vertrauensleiste) mit Seiten, auf denen sie vorkommen.

## Schnellprüfung und Selbstprüfung
- Alle 14 Zielabschnitte vorhanden; Stichprobe: 3 zufällige Themenzeilen gegen die Quelle per grep geprüft, dass kein Satzteil > 5 Wörter übernommen wurde (Ergebnis nennen).
- Schreibrechte eingehalten, offene Fragen gelistet.
