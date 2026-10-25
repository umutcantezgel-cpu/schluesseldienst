# E4-KUND-04 · Rolle Kundschafter · Modell Haiku · Stufe 1 · Kern-Version 1
Schreibrechte (exakt): src/inhalte/fakten/{recht-rauchmelder,recht-waffen,recht-video,recht-widerruf-notfall,recht-rechnung,recht-wucher,recht-preisangabe,recht-35a,recht-schluesselverlust-miete,versicherung-schluessel,recht-impressum,recht-datenschutz,recht-bfsg}.mjs, _werkstatt/berichte/E4-KUND-04.md
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E4-KUND-04/**
Umfang: 13 Faktenblätter (Recht, Steuern, Versicherung) + Kurzbericht ≤ 700 Wörter

## Rollenbriefing Kundschafter
Du recherchierst Belege und berichtest, was belegt ist und was nicht. Häufige Fehler: Werbeseiten oder Kanzlei-Blogs als Quelle; Zahlen und Paragrafen aus dem Gedächtnis; Widersprüche glätten statt melden; Sekundärquellen als primär ausgeben; Rechtsrat formulieren statt Rechtslage belegen.

## Aufgabe in einem Satz
Belege für die dreizehn Recht-Faktenblätter die Prüffragen aus `FAKTENBLAETTER` (`src/konfig/themenpaesse.mjs`) mit Quellen und lege je Blatt eine Datei im Faktenblatt-Format an.

## Regeln
`_werkstatt/pakete/_faktenblatt.md` vollständig lesen und einhalten. Web nur lesend (WebSearch/WebFetch), keine Formulare, keine Anmeldung. Prüffrage und Quellenart je Blatt stehen in `FAKTENBLAETTER`.
- Gesetze nur aus amtlichen Portalen (gesetze-im-internet.de, Landesrecht-Portale wie rv.hessenrecht.hessen.de, eur-lex.europa.eu). Paragrafen und Absätze exakt wie im Wortlaut zum Abrufdatum.
- Rechtsprechung nur mit Gericht, Datum und Aktenzeichen, möglichst aus der amtlichen Entscheidungsdatenbank (bundesgerichtshof.de, juris-frei nur amtlich). Fehlt das, gehört die Aussage nach `offen`.
- Verbraucherhinweise (Verbraucherzentrale, Polizeiliche Kriminalprävention, Datenschutzaufsicht, Bundeszentralamt/BMF) sind `sekundaer`.
- `recht-rauchmelder`: Hessen ausführlich; für die übrigen 15 Länder je ein Fakt mit Landesbauordnung und Paragraf, soweit belegbar. Was du für ein Land nicht findest, steht in `offen`.
- `recht-35a`: Anteil, Höchstbetrag und Zahlungsvoraussetzung exakt aus dem EStG und dem BMF-Schreiben; Stand nennen.
- Keine Bewertung, kein Rat („Sie sollten …“). Fakten sind neutrale Aussagen über die Rechtslage.

## Bericht `_werkstatt/berichte/E4-KUND-04.md`
Tabelle je Blatt: Anzahl Fakten · Quellen (primär/sekundär) · offene Punkte. Danach die wichtigsten Unsicherheiten (z. B. geänderte Gesetze, Übergangsfristen, Länder ohne Beleg). Hinweis an den Menschen: Alle Blätter brauchen juristische Durchsicht (MENSCHEN.md §3).
