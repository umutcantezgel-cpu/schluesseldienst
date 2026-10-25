# PRÜFPUNKT
- Letzter grüner Commit: siehe `git log` (Anlauf 2: gemeinsame Befunde)
- Etappe: E5 · Endprüfung Anlauf 1 fertig (Bericht `_werkstatt/berichte/E5-endpruefung.md`, Z-04 offen) · Anlauf 2 (letzter) läuft
- Laufend: drei Workflows `e5-anlauf2-pakete` (Skript `workflows/scripts/e5-anlauf2-pakete-wf_63cb8354-ea9.js`, Args je zwei Pakete: start-gebiet+ratgeber-betrieb, gruppe-leistung+hub-ort, preise+kontakt-suche-recht). Jedes Paket ändert nur seine Dateien; Builds unter `.cache/a2-<paket>/`.
- Befunde der Sichtabnahme Anlauf 1: Scratchpad `sicht-befunde.txt` (Kopie der Workflow-Ausgabe); Bilder `.cache/e5-review/bilder`, Blindschlüssel `.cache/e5-review/blind-schluessel.json`
- Vorschau: 4201/4204 (alter Stand Anlauf 1), 4210 (Stand nach gemeinsamen Befunden, `.cache/opus-a2/dist`)
- Nächster exakter Schritt: Paketergebnisse lesen → offene Wünsche an gemeinsame Dateien selbst umsetzen → Gesamtbau + Tests → committen/pushen → zweite Sichtabnahme mit frischen Prüfern (Bilder neu, Blindvergleich neu mit neuer Saat) → Bericht ergänzen → bei Erfolg Z-04 abhaken, sonst AUSNAHME A-2 mit Denkprotokoll → E5-DOK-02 → Abschlussprüfer → CLAUDE.md-Block entfernen
- Tests: `npm test`
