# Prüfwerkzeuge des Werkstatt-Laufs

Messwerkzeuge für Leistung, HTML-Validität, Bildrate und Eingabelatenz. Sie prüfen die Website, sie sind keine Abhängigkeit der Website. Alle Werkzeuge sind ES-Module für Node 22, laufen aus dem Repo-Wurzelverzeichnis und nutzen den installierten Chromium (`CHROME_PATH` überschreibt den Pfad). Gemeinsame Helfer stehen in `lib.mjs`.

## Einrichtung nach einer neu aufgesetzten Umgebung

```sh
mkdir -p /home/user/werkzeuge-cache && cp _werkstatt/werkzeuge/{package.json,package-lock.json,.npmrc} /home/user/werkzeuge-cache/ && cd /home/user/werkzeuge-cache && npm ci --ignore-scripts && npm audit signatures
```

Die Abhängigkeiten liegen außerhalb des Repos (Standard `/home/user/werkzeuge-cache`, überschreibbar mit `WERKZEUG_MODULE`). Die Werkzeuge installieren nichts selbst. Für vnu muss `java` im PATH sein.

## Werkzeuge

| Werkzeug | Zweck |
|---|---|
| `lighthouse.mjs` | Lighthouse-Median je Pfad aus N Läufen (Standard 3), Spanne je Kennzahl, Schwellen |
| `vnu.mjs` | HTML-Validität mit vnu; Fehler führen zu Exit 1, Warnungen nicht |
| `bildrate.mjs` | Bildrate bei CPU-Drosselung (Standard 4×) während Laden, Scrollen oder Klick |
| `inp.mjs` | Eingabelatenz (INP-Näherung) über die Event Timing API |
| `bild.mjs` | Bildschirmfoto einer Seite als JPEG (E0-PRUEF-01) |
| `bildsatz.mjs` | Bildsatz je Pfad, Gerät und Schema mit index.json (E0-PRUEF-01) |
| `ueberlauf.mjs` | Dokumentüberlauf bei fünf Breiten, erzwungenen Farben und 200 % Zoom (E0-PRUEF-01) |
| `axe.mjs` | axe-core je Pfad für WCAG 2.0/2.1/2.2 A und AA (E0-PRUEF-01) |
| `smoke.mjs` | Smoke-Prüfung je Pfad bei 390×844 und 1440×900 (E0-PRUEF-01) |
| `linkgraph.mjs` | Linkgraph: eingehende Links, Klicktiefe, Links auf fehlende Ziele (E3-PRUEF-10) |
| `aehnlichkeit.mjs` | Textähnlichkeit der Ortsseiten: Wort-5-Gramme, Jaccard, Zufalls- und Nachbarpaare (E3-PRUEF-10) |
| `ortsstichprobe.mjs` | Geschichtete Stichprobe von Ortsseiten gegen `src/daten/orte.json` (E3-PRUEF-10) |

Die Argumente der E0-PRUEF-01-Werkzeuge stehen in den Skripten selbst (`parseArgs`). Die vier Werkzeuge dieses Pakets haben folgende Aufrufe; alle schreiben ihre Ergebnisse als JSON nach `--aus`.

```sh
# Lighthouse: Median aus 3 Läufen, Schwellen (Exit 1 bei Verfehlung)
node _werkstatt/werkzeuge/lighthouse.mjs --basis http://127.0.0.1:4291 --pfade /,/x/ --aus .cache/lh.json --min-perf 95 --max-lcp 2500 --max-cls 0.1

# vnu: Ordner mit gleichmäßiger Stichprobe, oder Liste/Glob
node _werkstatt/werkzeuge/vnu.mjs --ordner .cache/ausgabe --stichprobe 50 --aus .cache/vnu.json
node _werkstatt/werkzeuge/vnu.mjs --dateien "fixture/index.html,fixture/*.html" --aus .cache/vnu.json

# Bildrate: Auslöser laden | scroll | 'klick:<selektor>' (Selektor in Anführungszeichen)
node _werkstatt/werkzeuge/bildrate.mjs --url http://127.0.0.1:4291/ --ausloeser 'klick:[data-zaehler]' --aus .cache/bildrate.json

# INP: Aktionsdatei als JSON-Liste aus {typ: klick|taste|tippen, selektor?, text?}
node _werkstatt/werkzeuge/inp.mjs --url http://127.0.0.1:4291/ --aktionen .cache/aktionen.json --aus .cache/inp.json --max 200
```

Exit-Codes aller Werkzeuge: 0 ok, 1 Schwelle überschritten bzw. vnu-Fehler, 2 Werkzeugfehler (Ergebnis unvollständig).

## Hinweise

- **Messungen nie parallel.** Alle Browser-Werkzeuge (bild, bildsatz, axe, smoke, moment, lighthouse, inp, bildrate) setzen die Sperrdatei `.cache/mess.lock` selbst über `mitMessSperre` und warten, solange eine andere Messung läuft (höchstens 10 min). Builds während einer Messung vermeiden.
- **Median statt Einzelmessung:** Lighthouse-Einzelläufe können abweichen (im Nachweis Best-Practices 96 im Einzellauf, 100 im Medianlauf). Für Schwellen immer den Median verwenden.
- **Bildrate ohne GPU:** Headless ohne GPU ist die Messung eine Ersatzmessung (UMGEBUNGSAUSNAHME, in der Ausgabe ausgewiesen). Die GPU-Bildrate steht in `_werkstatt/MENSCHEN.md`.
- **INP:** Die Schwelle `--max` gilt für den Maximalwert; p98 wird nur ausgegeben. Event Timing meldet Ereignisse erst ab 16 ms; Aktionen ohne Meldung werden als solche ausgewiesen.
- **Stichprobe** (`vnu --stichprobe N`): gleichmäßig verteilte Auswahl aus der sortierten Dateiliste, damit Läufe wiederholbar sind.
- **Bekannte Abweichung in lib.mjs:** `starteBrowser()` greift auf den Named-Export `chromium` von `playwright-core` zu. Das Paket ist CommonJS, der Export liegt nur unter `default`. Deshalb nutzen Browser-Werkzeuge eine lokale Starthilfe mit demselben Aufruf. `lib.mjs` ist nicht geändert; die Korrektur liegt beim Orchestrator.
- Schreibt nichts in die Website. Nachweise und Aktionsdateien liegen unter `.cache/` (vom Repo ausgeschlossen).

```sh
# Linkgraph, Ähnlichkeit, Ortsstichprobe (ohne Browser, feste Saat)
node _werkstatt/werkzeuge/linkgraph.mjs --dist .cache/dist --aus .cache/linkgraph.json
node _werkstatt/werkzeuge/aehnlichkeit.mjs --dist .cache/dist --paare 2000 --saat 7 --aus .cache/aehnlichkeit.json
node _werkstatt/werkzeuge/ortsstichprobe.mjs --dist .cache/dist --daten src/daten/orte.json --saat 7 --aus .cache/ortsstichprobe.json
```
