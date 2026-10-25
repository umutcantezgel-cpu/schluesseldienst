# E4-KUND-05 · Rolle Kundschafter · Modell Haiku · Stufe 1 · Kern-Version 1
Schreibrechte (exakt): src/inhalte/fakten/{statistik-einbruch,foerderung,norm-alarm,norm-nebel,notrufnummern,weilburg-tunnel,lizenz-geonames,lizenz-schrift}.mjs, _werkstatt/berichte/E4-KUND-05.md
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E4-KUND-05/**
Umfang: 8 Faktenblätter (Statistik, Förderung, Normen Alarm/Nebel, Notruf, Weilburg, Lizenzen) + Kurzbericht ≤ 600 Wörter

## Rollenbriefing Kundschafter
Du recherchierst Belege und berichtest, was belegt ist und was nicht. Häufige Fehler: Werbeseiten als Quelle; Zahlen aus dem Gedächtnis; alte Berichtsjahre als aktuell ausgeben; Widersprüche glätten statt melden; Sekundärquellen als primär ausgeben.

## Aufgabe in einem Satz
Belege für die acht Faktenblätter die Prüffragen aus `FAKTENBLAETTER` (`src/konfig/themenpaesse.mjs`) mit Quellen und lege je Blatt eine Datei im Faktenblatt-Format an.

## Regeln
`_werkstatt/pakete/_faktenblatt.md` vollständig lesen und einhalten. Web nur lesend (WebSearch/WebFetch), keine Formulare, keine Anmeldung, keine Downloads außer öffentlich verlinkten PDFs zum Lesen.
- `statistik-einbruch`: Berichtsjahr ausdrücklich im Fakt nennen; Bundeszahl aus der PKS des Bundeskriminalamts, Hessen aus der PKS des Landeskriminalamts Hessen. Zahlen exakt, nicht gerundet.
- `foerderung`: Stand des Abrufs nennen. Für jedes Programm, ob es Anträge annimmt; ausgelaufene Programme ausdrücklich als ausgelaufen belegen (mit Datum, wenn die Quelle es nennt).
- `norm-alarm`, `norm-nebel`: Normen sind kostenpflichtig – nur amtliche oder institutionelle Kurzbeschreibungen (Normungsinstitut, Kommission, Polizeiliche Kriminalprävention) als `sekundaer`. Keine Herstellerangaben, keine Produktnamen.
- `notrufnummern`: nur Behördenquellen.
- `weilburg-tunnel`: Die Seite /schluesseldienst-weilburg/ verwendet bereits den Fakt mit der id `weilburg-tunnel.abkuerzung` (Aussage: Der Weilburger Schiffstunnel kürzt die Lahnschleife unter dem Schlossberg ab). Lege genau diesen Schlüssel `abkuerzung` an, wenn die Aussage belegbar ist; sonst nach `offen` mit Grund. Weitere Fakten (Lage, Bauzeit, Länge) nur aus Behörde oder Stadt.
- `lizenz-geonames`, `lizenz-schrift`: Lizenztexte selbst als Primärquelle.

## Bericht `_werkstatt/berichte/E4-KUND-05.md`
Tabelle je Blatt: Anzahl Fakten · Quellen (primär/sekundär) · offene Punkte. Danach die wichtigsten Unsicherheiten (Berichtsjahr, Programmstatus, Normausgaben).
