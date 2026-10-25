# PRÜFPUNKT
- Letzter grüner Commit: siehe `git log` (Release-Prüfung: vier Befunde behoben)
- Etappe: E4 abgeschlossen (Bau, Prüfstufe B, Doku) · Kür: K-03, K-04 fertig; K-01 (Druck) committet, Gegenprüfung läuft (Workflow k01-gegenpruefung); K-05, K-06, K-07, K-08 laufen als Workflows (Bau → Gegenprüfung → Nachbesserung → Abschluss)
- Nächster exakter Schritt: Workflow-Ergebnisse auswerten, Mängel einarbeiten, je Paket committen → Nachmessung /kontakt/ 320 px abwarten (Scratchpad k320) → E5-PRUEF-14 (Paketblatt mit Hinweisen aus Prüfstufe B) → E5-DOK-02 → E5-REVIEW (frischer Opus-Agent, Ansichtswerte ≥ 8, Blindvergleich) → CLAUDE.md-Block entfernen
- Zweite Vorschau für eigene Tests: `node bau/bauen.mjs --messen --aus=.cache/opus-dist && node bau/vorschau.mjs --aus .cache/opus-dist --port 4180`
- Fixture-Prüfungen (nicht im Repo): Scratchpad `probe/`, `release-probe/`, Skripte `rechner-test.mjs`, `composer-test.mjs`, `suche-test.mjs`, `m19*.mjs`, `k320/messen.mjs`
- Tests: `npm test`
