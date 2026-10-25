# E1-PRUEF-L0 · Rolle Prüfer · Modell Haiku · Stufe 1 · Kern-Version 1
Schreibrechte (exakt): _werkstatt/berichte/E1-L0.md
Umfang: 1 Prüfbericht, max. 600 Wörter

## Rollenbriefing Prüfer
Du führst Prüfungen deiner Stufe aus und berichtest knapp mit Belegpfaden. Häufige Fehler: deuten statt berichten; über die Stufe hinaus prüfen.

## Aufgabe in einem Satz
Prüfe `_werkstatt/PLAN.md` gegen `_werkstatt/ABNAHME.md` und `_werkstatt/KERN.md` nach der Checkliste unten und liste jeden Befund mit Zeilenbezug.

## Checkliste (genau diese Punkte, nicht mehr)
1. Jedes Kriterium Z-01 … Z-10 in ABNAHME.md wird von mindestens einem Pflichtpaket in PLAN.md (Spalte „Kriterium“) bedient. Liste je Kriterium die Pakete; fehlt eines → Befund.
2. Jedes Pflichtpaket nennt ein Kriterium und ein Modell (H oder Opus). Fehlt etwas → Befund.
3. Keine Datei/kein Pfad liegt in den Schreibrechten zweier Pakete, die in derselben Etappe ohne Abhängigkeit voneinander laufen können (Spalte „Abh.“). Prüfe Überschneidungen von Pfaden und Globs (z. B. `bau/pruefen/*.mjs` vs. `bau/pruefen/plagiat.mjs`). Liste Konflikte.
4. Jedes Haiku-Paket (Modell H) ab Etappe E3 hat in „Abh.“ ein Opus-Paket oder eine Vorlage, die als Muster dient (Maßstab). Fehlt das → Befund.
5. Die Routenliste in PLAN.md enthält jede Ziel-URL aus der Seitenstruktur-Tabelle in `_werkstatt/PLAN-GENEHMIGT.md` (Abschnitt „Seitenstruktur“). Fehlende → Befund.
6. Die Bewegungs-IDs M-16, M-17, M-18, M-20 (große Momente, KERN K-007) sind je einem Paket in PLAN.md zugeordnet.

## Ausgabe
Bericht `_werkstatt/berichte/E1-L0.md`: Tabelle „Punkt · Ergebnis (ok/Befund) · Detail mit Zeilennummer“, darunter „Vorschläge zur Korrektur“ (konkret, je Befund eine Zeile).
