# PRÜFPUNKT
- Letzter grüner Commit: siehe `git log` (E4-OPUS-02 Kontakt, E4-BAU-16)
- Etappe: E4 (W3) · E3 abgeschlossen (Prüfstufe B bestanden, Bericht `_werkstatt/berichte/E3-pruefstufe-b.md`)
- Nächster exakter Schritt: Rückgaben E4-BAU-18 (Ratgeber Förderung/Waffen/Alarm), E4-BAU-19 (Über uns/Karriere), E4-BAU-20 (Rechtsseiten), E4-BAU-21 (Leistungen/Sitemap) prüfen und committen → E4-OPUS-05 (Lahnbogen-Illustration + M-20 auf /ueber-uns/, Figurplatz `data-figur="lahnbogen"`) → Suche `/suche/` und 404 mit M-21 (Opus) → E4-GRAF-04 OG-Bilder → E4-PRUEF-12 live-check → E4-DOK-01 → E4-PRUEF-13
- Laufende Pakete: E4-BAU-18, E4-BAU-19, E4-BAU-20, E4-BAU-21 (alle Haiku)
- Bekannt: Gesamtbuild bricht ab, solange E4-BAU-21 sein CSS-Bündel `verzeichnis` noch nicht angelegt hat (unfertiger Arbeitsbaum, nicht committet). Eigene Prüfungen dann mit `--nur=`.
- Fixture-Prüfungen (nicht im Repo): Scratchpad `probe/` mit Beispielpreisen/E-Mail; Skripte `rechner-test.mjs`, `composer-test.mjs`
- Zweite Vorschau für eigene Tests: `node bau/bauen.mjs --messen --aus=.cache/opus-dist && node bau/vorschau.mjs --aus .cache/opus-dist --port 4180`
- Entscheidungen: CSS je Ansicht (D-CSS-01); Rechner als Gruppe ohne <form> (S12); Composer als <form method=get action=mailto:>; Quellenlisten nur aus verwendeten Fakten
- Tests: `npm test`
