# PRÜFPUNKT
- Letzter grüner Commit: siehe `git log` (E2-REVIEW Anlauf 1 eingearbeitet, E3 W1)
- Etappe: E2-Tor (Sichtabnahme Anlauf 2 läuft) · E3 W1 parallel (Vorlagen ändern V01 nicht)
- Nächster exakter Schritt: Anlauf 2 auswerten (`_werkstatt/berichte/E2-sichtabnahme-2.md`); bei ≥ 8 Tor schließen, sonst Befunde einarbeiten und als UMGEBUNGS-/GESTALTUNGSRISIKO in BERICHT führen (max. 2 Anläufe) → E3-OPUS-03 V03-Vorlage + /notoeffnung/tueroeffnung/ → E3-BAU-04…11 Detailseiten
- Laufende Pakete: E2-REVIEW-2 (Opus), E3-BAU-01/02/03 (Gruppenseiten), E4-KUND-03 (Faktenblätter Normen)
- Zweite Vorschau für eigene Tests: `node bau/bauen.mjs --messen --aus=.cache/opus-dist && node bau/vorschau.mjs --aus .cache/opus-dist --port 4180`
- Entscheidungen: Vorher-Bilder bleiben in `.cache/vorher/`; Mess-Sperre in allen Browser-Werkzeugen; Preis-/Mailto-Tests schreiben E4-OPUS-01/02 mit ihrer Logik; Höhen-Breakpoint 40em nur für Szenen (KERN K-006 ergänzt); Telefon-Icon von Opus neu gezeichnet (Erkennbarkeit).
- Werkzeuge nach Neustart: siehe `_werkstatt/werkzeuge/README.md` (npm ci in /home/user/werkzeuge-cache)
- Vorschau: `node bau/bauen.mjs && node bau/vorschau.mjs` → http://127.0.0.1:4173
