# E0-PRUEF-03 · Rolle Prüfer · Modell Haiku · Stufe 1 · Kern-Version 1
Schreibrechte (exakt): _werkstatt/werkzeuge/vorher.mjs, _werkstatt/berichte/E0-vorher-kennzahlen.md
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/vorher/**
Umfang: 1 Skript + 1 Bericht (≤ 600 Wörter)

## Rollenbriefing Prüfer
Du richtest Prüfwerkzeuge ein, führst Prüfungen aus und berichtest knapp mit Belegpfaden. Häufige Fehler: Einzelmessung statt Median; deuten statt berichten; über die Stufe hinaus prüfen.

## Aufgabe in einem Satz
Nimm von sechs öffentlichen Seiten der beiden Wettbewerber einen maskierten Vorher-Bildsatz und Lighthouse-Kennzahlen (Median aus 3) auf – Bilder bleiben außerhalb des Repos, im Repo nur Kennzahlen.

## Muster
- Werkzeuge in `_werkstatt/werkzeuge/` (lesen, nicht ändern): `lib.mjs` (starteBrowser, mitMessSperre, GERAETE, schreibeJson), `bildsatz.mjs` (Ausschnitt-Logik als Vorbild), `lighthouse.mjs` (für die Messung direkt aufrufen: `node _werkstatt/werkzeuge/lighthouse.mjs --basis <origin> --pfade <pfad> --laeufe 3 --aus <json>`).

## Seiten (nur lesend, höflich: zwischen Seitenaufrufen ≥ 5 s Pause)
| Paar | URL |
|---|---|
| V01-R | https://www.richter-sicherheitstechnik.de/ |
| V01-A | https://www.schluesseldienst-adam.de/ |
| V03-A | https://www.schluesseldienst-adam.de/tueroeffnung |
| V04-A | https://www.schluesseldienst-adam.de/preise |
| V07-R | https://www.richter-sicherheitstechnik.de/schluesseldienst-weilburg.html (falls 404: …/schluesseldienst-ahausen-weilburg.html) |
| V07-A | https://www.schluesseldienst-adam.de/weilburg |

## Schritte
1. `vorher.mjs --aus <ordner>`: je Seite und je Gerät (GERAETE aus lib, nur Hellmodus) Seite laden (Timeout 30 s, `waitUntil: 'load'` + 2 s), Cookie-/Consent-Banner NICHT anklicken (Zustand wie für Erstbesucher), dann **maskieren**: per `page.evaluate` alle Textknoten ersetzen, die einen der Begriffe enthalten (Groß/klein egal): „Richter“, „Adam“, „Sicherheitstechnik“ in Firmennamen-Kontext, Ziffernfolgen mit ≥ 6 Ziffern (Telefonnummern), E-Mail-Adressen → ersetze die Fundstelle durch „███“. Zusätzlich alle `<img>`, deren `alt` oder `src` „logo“ enthält, mit `visibility:hidden` versehen (`bypassCSP: true` erlaubt Inline-Stil bei fremden Seiten). Dann Ausschnitte je Bildschirmhöhe (max. 6 je Seite und Gerät), JPEG Q70, Dateinamen `<paar>__<geraet>__<nn>.jpg`, plus `index.json`. Ausgabeordner `.cache/vorher/bilder/`.
2. Lighthouse mobil, 3 Läufe, Median je Seite: `lighthouse.mjs` je Origin separat aufrufen (Ausgabe `.cache/vorher/lighthouse-<paar>.json`). Bei Fehlern (Bot-Schutz, Zeitüberschreitung) einmal wiederholen, sonst als „nicht messbar“ vermerken.
3. Zusätzlich je Seite zählen (aus der geladenen Seite, Gerät mobil): Anzahl Anfragen an fremde Hosts (Liste der Hosts, nur Hostnamen), Cookies nach dem Laden (Anzahl), Gesamt-Übertragungsgröße (aus Lighthouse `total-byte-weight`), Anzahl `<script>`-Elemente, ob ein `<h1>` existiert, Länge des `<title>`.
4. Bericht `_werkstatt/berichte/E0-vorher-kennzahlen.md`: Tabelle je Paar mit Perf, A11y, BP, SEO, LCP, CLS, TBT (Median und Spanne), Bytes, Fremd-Hosts (Anzahl + Hostnamen), Cookies, Skripte, h1 ja/nein. **Keine Bilder, keine Textzitate, keine Telefonnummern** im Bericht. Hinweis: „nur informativ, Baseline für Z-08 ist die erste eigene Messung in E2“. Bildpfade (außerhalb des Repos) nennen.

## Schnellprüfung und Selbstprüfung
- `node --check vorher.mjs`; 6 Paare × 3 Geräte erfasst (oder Grund); Stichprobe: 2 Bilder öffnen (Read-Werkzeug) und prüfen, dass keine Telefonnummer/kein Firmenname lesbar ist – Ergebnis nennen.
- Schreibrechte eingehalten; nichts committet.
