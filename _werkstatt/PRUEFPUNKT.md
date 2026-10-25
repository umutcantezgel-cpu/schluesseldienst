# PRÜFPUNKT
- Letzter grüner Commit: siehe `git log` (Paketblätter Kür und E5)
- Etappe: E4 Bau fertig; laufend E4-PRUEF-13 (Prüfstufe B E4) und E4-DOK-01 (README, docs) · Kür: K-01 (Druck), K-03 (Schadensbilder) laufen; K-04 fertig
- Nächster exakter Schritt: Rückgaben prüfen und committen → K-03 einbinden (`artikel.mjs` FIGUREN + `schadensbilder.mjs` figur) → K-05, K-06, K-07, K-08 starten (Paketblätter liegen in `_werkstatt/pakete/`) → K-02 entfällt zugunsten der Endprüfung (Befunde der Sichtabnahme 2 sind umgesetzt) → E5-PRUEF-14 (erst wenn alle Kür-Pakete eingearbeitet sind) → E5-DOK-02 → E5-REVIEW (frischer Opus-Agent, Ansichtswerte ≥ 8, Blindvergleich) → CLAUDE.md-Block entfernen
- Zweite Vorschau für eigene Tests: `node bau/bauen.mjs --messen --aus=.cache/opus-dist && node bau/vorschau.mjs --aus .cache/opus-dist --port 4180`
- Fixture-Prüfungen (nicht im Repo): Scratchpad `probe/`, Skripte `rechner-test.mjs`, `composer-test.mjs`, `suche-test.mjs`, `m19*.mjs`
- Tests: `npm test`
