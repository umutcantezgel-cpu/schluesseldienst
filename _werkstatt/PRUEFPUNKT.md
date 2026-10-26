# PRÜFPUNKT
- Letzter grüner Commit: `2a69d96` (alle sechs Ansichtspakete von Anlauf 2 abgenommen)
- Etappe: E5 · Endprüfung Anlauf 1 fertig (Bericht `_werkstatt/berichte/E5-endpruefung.md`, Z-04 offen) · Anlauf 2 (letzter): Umsetzung fertig, Prüfung läuft
- Laufend: Workflow `e5-endpruefung-2` (Skript im Scratchpad `e5-endpruefung-2.js`): Bildsatz `.cache/e5-review2/bilder`, Blindpaare `.cache/e5-review2/blind/bilder`, Schlüssel `.cache/e5-review2/blind-schluessel.json` (nie den Prüfern zeigen), Nachprüfung `.cache/e5-review2/nachpruefung/`
- Vorschau: 4241 (Messbuild `.cache/e5-review2/dist`, unkomprimiert), 4244 (gzip); PIDs `.cache/e5-review2/pid1`, `pid2`
- Nächster exakter Schritt: Ergebnis auswerten (Blindurteile mit Schlüssel abgleichen) → Bericht `E5-endpruefung.md` um Anlauf 2 ergänzen → Z-04: alle Ansichten ≥ 8 und keine Kategorie < 7 → abhaken; sonst AUSNAHME A-2 mit Denkprotokoll (zweite und letzte erlaubte) → Abschluss-Bildsatz nach `_werkstatt/bilder/E5-abschluss/` → E5-DOK-02 Teil 2 (BERICHT.md, Galerie) → ABNAHME Z-01…Z-10 mit Belegen → frischer Opus-Abschlussprüfer (prüft Belege, keine Tests) → CLAUDE.md-Block entfernen → ABSCHLUSS
- Tests: `npm test`
