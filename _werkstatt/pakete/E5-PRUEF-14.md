# E5-PRUEF-14 · Rolle Prüfer · Modell Haiku · Stufe 1 · Kern-Version 1
Schreibrechte (exakt): _werkstatt/berichte/E5-pruefstufe-c.md (neu), _werkstatt/bilder/E5/** (neu), _werkstatt/werkzeuge/aktionen/e5-*.json (neu)
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/e5/**
Umfang: Prüfstufe C (Endprüfung des Bestands) für ABNAHME Z-02, Z-03, Z-05…Z-09

## Rollenbriefing Prüfer
Du prüfst vollständig und berichtest nüchtern. Häufige Fehler: Stichprobe nicht zufällig; Funktionsliste „überflogen“; Ergebnisse früherer Stufen übernehmen statt neu messen.

## Aufgabe in einem Satz
Führe Prüfstufe C nach `_werkstatt/AUFTRAG.md` (Abschnitt Prüfstufen) und `_werkstatt/ABNAHME.md` aus: alles aus Prüfstufe B für alle zwölf Hauptansichten, dazu Funktionsliste F01–F20, Release-Negativtest, Hauptaufgaben nur mit Tastatur, Bewegungsregister, SVG-Prüfung und eine Zufallsstichprobe.

## Schritte
1. Bestand: `npm test`; `node bau/bauen.mjs --messen --pruefen --port=4201 --aus=.cache/e5/dist`; Release-Negativtest `node bau/bauen.mjs --release --aus=.cache/e5/release` → muss scheitern; nenne die Fehlerursachen (Platzhalter, ungeprüfte Fakten) mit Anzahl.
2. Vorschau Port 4201 (setsid, PID notieren).
3. Hauptansichten (je ein Pfad): V01 `/`, V02 `/einbruchschutz/`, V03 `/notoeffnung/tueroeffnung/`, V04 `/preise/`, V05 `/einsatzgebiet/`, V06 `/einsatzgebiet/hessen/limburg-weilburg/`, V07 `/schluesseldienst-loehnberg/`, V08 `/ratgeber/rauchmelderpflicht/`, V09 `/ueber-uns/`, V10 `/kontakt/`, V11 `/suche/`, V12 `/impressum/` und `/gibt-es-nicht/`.
4. Zufallsstichprobe (feste Saat 25, dokumentiert): 10 % der übrigen Nicht-Ortsseiten (mind. 5) und 20 Ortsseiten (je Zone A, B, C, D, NL vier).
5. Für Hauptansichten + Stichprobe: `smoke.mjs`, `axe.mjs` hell und dunkel, `ueberlauf.mjs` (320–1920 px, forced-colors, 200 % Zoom), `vnu.mjs` (Fehler).
6. Lighthouse mobil, 3 Läufe, Median + Spanne, für alle Hauptansichten; Vergleich mit der E2-Baseline (V01) und den E3/E4-Werten.
7. INP für die Interaktionen der Hauptaufgaben (vorhandene Aktionsdateien `v01-inp.json`, `e3-*.json`, `e4-*.json` wiederverwenden).
8. Funktionsliste F01–F20 aus `_werkstatt/LAGEBILD.md`: jede Funktion einmal durchspielen (Playwright), Ergebnis ok/abweichend mit Beleg.
9. Hauptaufgaben aus `_werkstatt/KERN.md` K-002 nur mit Tastatur, mobil (390×844) und Desktop: Weg, Anzahl Tab-Schritte, Fokus sichtbar (ja/nein) – Protokoll.
10. Bewegung: jede Animation im Register K-007 ist im CSS zu finden und umgekehrt (Liste); große Momente M-16, M-17, M-18, M-20, M-21 mit `bildrate.mjs` (Drossel 4×, 3 Läufe); reduzierte Bewegung: 0 laufende Animationen nach 200 ms, alle Inhalte sichtbar.
11. SVG: Icon-Geometrie (Prüfer `icons`), keine doppelten IDs je Seite (Skript über die Hauptansichten), jede inhaltstragende SVG mit `role="img"` und Titel, dekorative mit `aria-hidden`.
12. Bildsatz `_werkstatt/bilder/E5/` für alle Hauptansichten hell/dunkel, dann kürzen wie E3 (< 15 MB).
13. Bericht `_werkstatt/berichte/E5-pruefstufe-c.md`: je Kriterium Z-02, Z-03, Z-05…Z-09 eine Zeile mit Ergebnis (erfüllt/nicht erfüllt/UMGEBUNGSAUSNAHME) und Beleg; danach alle Befunde mit Datei/Selektor; „Nicht geprüft“. Keine Deutung.
- Vorschau am Ende per PID beenden.

## Hinweise aus Prüfstufe B (E4-PRUEF-13)
- Schritt 6: `/suche/` und `/404.html` sind bewusst `noindex` (ENTSCHEIDUNGEN D-SEO-03) – SEO-Wert mit Begründung berichten, nicht als Verstoß zählen.
- Schritt 8: Bei `/kontakt/` auch das Erscheinen der Fehlerübersicht nach „Absenden“ mit leeren Pflichtfeldern prüfen (sichtbar, Fokus darauf, Links zu den Feldern, `aria-invalid` an den Feldern) – INP allein misst das nicht.
- Schritt 10: Linien mit Höhe 0 (z. B. die Scherlinien-Hälften, horizontale Pfade) gelten als sichtbar, wenn Breite > 0 und Deckkraft 1; Sichtbarkeit nicht allein an der Höhe des Begrenzungsrahmens messen.
- Schritt 12: `bildsatz.mjs` kappt bei 12 Ausschnitten je Seite; gekappte Seiten im Bericht nennen.
