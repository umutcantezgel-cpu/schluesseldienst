# PRÜFPUNKT
- Letzter grüner Commit: siehe `git log` (E2-OPUS-07 Register + E2-PRUEF-08)
- Etappe: E2 (Kern & Referenz) – Prüfstufe B V01 bestanden (nach A11y-Korrektur), Sichtabnahme läuft
- Nächster exakter Schritt: E2-REVIEW auswerten (`_werkstatt/berichte/E2-sichtabnahme.md`) → Kategorien < 8 einarbeiten (höchstens 2 Anläufe) → Etappentor → E3-OPUS-01 Szenen-Engine M-17 + I-03/04/05 → E3-OPUS-02 V02 `/notoeffnung/`
- Laufende Pakete: E2-REVIEW (frischer Opus-Agent)
- Offene Pakete: E3 laut PLAN.md (W1: E3-OPUS-01/02, E3-BAU-01…03, E3-GRAF-01…03, E3-PRUEF-09)
- Entscheidungen aus Rückfragen der Pakete: Vorher-Bilder bleiben in `.cache/vorher/` (gitignored, nie committet, Personenfoto bleibt dort unmaskiert, weil die Bilder das Repo nicht verlassen); Mess-Sperre setzen jetzt alle Browser-Werkzeuge selbst; Sichtbarkeit der Scherlinie wird über die Bildbox geprüft, nicht über `isVisible()`.
- Werkzeuge nach Neustart: siehe `_werkstatt/werkzeuge/README.md` (npm ci in /home/user/werkzeuge-cache)
- Vorschau: `node bau/bauen.mjs && node bau/vorschau.mjs` → http://127.0.0.1:4173
