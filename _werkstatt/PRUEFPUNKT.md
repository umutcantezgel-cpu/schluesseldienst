# PRÜFPUNKT
- Letzter grüner Commit: `e719627` (Bau mit 11 Prüfern grün); danach nur Werkstatt-Dateien
- Etappe: E5 · Abschluss-Nachprüfung 1 ausgewertet und behoben · Nachprüfung 2 abgebrochen (Teilergebnisse `.cache/e5-abschluss/n2-bestand/`, `n2-bewegung/`)
- Offen für Z-02: Konsolenfehler „Transition was aborted because of invalid state. ViewTransition opt-in disabled“ beim Seitenwechsel (Skript 6/30, Links 8/48; der Abfang in `src/assets/js/app.mjs` wirkt nicht)
- Laufend: Versuchsbauten `.cache/vt-exp/<variante>/` (X0 Diagnose, X1 früher Abnehmer per Init-Skript, X2 `@view-transition` auf oberster Ebene, X4 kleines Kopf-Skript, X6 ohne Opt-in); Entscheidungsregel im Plan (Abschnitt „Fortsetzung … 08:31 UTC“)
- Vorschau: 4251 (Messbuild `.cache/e5-abschluss/dist`, Stand `e719627`), 4254 (gzip); PIDs `.cache/e5-abschluss/pid1`, `pid2`
- Nächster exakter Schritt: Versuche auswerten → Lösung umsetzen, bauen, committen → Nachprüfung 2 zu Ende (Haiku, Ergebnisse fortlaufend in `ergebnis.md`) → Belege nach `_werkstatt/protokolle/E5-abschluss/` → Bericht Abschnitte 3/4 → ABNAHME/PLAN → E5-DOK-02 Teil 2 (Haiku) → Opus-Abschlussprüfer → CLAUDE.md-Block entfernen → ABSCHLUSS
- Tests: `npm test`
