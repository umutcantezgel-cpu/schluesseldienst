# PRÜFPUNKT
- Letzter grüner Commit: siehe `git log` (E3 W2 Detailseiten, V06 Hubs, V08-Vorlagen)
- Etappe: E3 (W2 fertig, E3-PRUEF-10/11 offen) · E4 parallel (Ratgeber, Faktenblätter)
- Nächster exakter Schritt: E4-OPUS-01 V04 `/preise/` (Vorlage `src/vorlagen/seiten/preise.mjs`, Tagesband, Rechner-Logik `src/assets/js/logik/preisrechner.mjs` + Modul + Tests) → E4-OPUS-02 Mailto + V10 Kontakt
- Laufende Pakete: E4-KUND-04 (Recht-Faktenblätter), E4-KUND-05 (Statistik/Notruf/Tunnel/Lizenzen), E4-BAU-13 (Zylinder/Haustür-Check/RC), E4-BAU-14 (Tresor/zugefallen/Schadensbilder)
- Wartend: E4-BAU-15 (braucht KUND-05), E4-BAU-16 (KUND-04/05), E4-BAU-17 (KUND-04), E4-BAU-18 (KUND-04/05); Paketblätter liegen in `_werkstatt/pakete/`
- Zweite Vorschau für eigene Tests: `node bau/bauen.mjs --messen --aus=.cache/opus-dist && node bau/vorschau.mjs --aus .cache/opus-dist --port 4180`
- Entscheidungen: Hub-Titel ohne Präposition („Schlüsseldienst Westerwaldkreis: Orte A–Z“); kreisfreie Städte als „Name (kreisfreie Stadt)“; Ortsseiten-Titel > 60 nur Warnung (72 Fälle); Möbeltresor-Verankerung als Empfehlung, nicht als Zusage
- Werkzeuge nach Neustart: siehe `_werkstatt/werkzeuge/README.md` (npm ci in /home/user/werkzeuge-cache)
- Tests: `npm test` (nicht `node --test test/`)
