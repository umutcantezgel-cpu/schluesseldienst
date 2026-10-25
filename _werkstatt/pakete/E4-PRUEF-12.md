# E4-PRUEF-12 · Rolle Prüfer · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): _werkstatt/werkzeuge/live-check.mjs (neu), _werkstatt/werkzeuge/README.md (nur eine Zeile in der Werkzeug-Tabelle und ein Aufruf-Beispiel ergänzen)
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E4-PRUEF-12/**
Umfang: Werkzeug für die Prüfung nach einem Deploy, erprobt gegen die lokale Vorschau

## Rollenbriefing Prüfer
Du prüfst und berichtest; du änderst die Website nicht. Häufige Fehler: Erwartungswerte abschreiben statt aus der Quelle lesen; nur Erfolgsfälle prüfen; Netzwerkfehler als „bestanden“ werten.

## Aufgabe in einem Satz
Schreibe `live-check.mjs`, das eine ausgelieferte Website (Basis-URL) gegen die Soll-Werte aus `src/konfig/sicherheit.mjs` und den Build prüft – Kopfzeilen, MIME-Typen, Cache, 404, Weiterleitungen – und weise mit der lokalen Vorschau nach, dass es Fehler findet und Erfolg meldet.

## Prüfungen (Soll-Werte immer per `import` aus `src/konfig/sicherheit.mjs` bzw. aus dem Ausgabeordner, nie abgeschrieben)
1. Kopfzeilen auf `/`, einer Leistungsseite, einer Ortsseite, `/404`-Fall und einem Asset: exakt `kopfzeilen()` (CSP, HSTS, nosniff, X-Frame-Options, Referrer-Policy, COOP, COEP, CORP, Permissions-Policy, Origin-Agent-Cluster). Abweichung = Fehler; zusätzliche Kopfzeilen, die Server- oder Versionsangaben verraten (`Server` mit Version, `X-Powered-By`), = Warnung.
2. MIME: je Endung aus `MIME` eine Datei des Ausgabeordners anfragen und `Content-Type` vergleichen (`.html`, `.css`, `.js`, `.json`, `.svg`, `.woff2`, `.png`, `.webmanifest`, `.xml`, `.txt`).
3. Cache: HTML `no-cache`; Fingerabdruck-Assets `max-age=31536000, immutable` laut `CACHE`; `/daten/*` mit `X-Robots-Tag: noindex`.
4. 404: zufälliger Pfad → Status 404, Inhalt ist die eigene Fehlerseite (Titel aus `dist/404.html`).
5. Weiterleitungen: für jede Weiterleitung des Builds (Datei `_redirects` im Ausgabeordner, falls vorhanden) Status 301 und `Location` exakt wie konfiguriert; außerdem `//example.com`, `/\example.com` und `/%2F%2Fexample.com` dürfen NIE auf einen fremden Host weiterleiten (offene Weiterleitung = Fehler).
6. HTTPS (nur wenn die Basis https:// ist): `http://` derselben Domain leitet mit 301 auf `https://` um.
## Aufruf und Ausgabe
`node _werkstatt/werkzeuge/live-check.mjs --basis <url> --dist <ausgabeordner> --aus <json>` · nur `node:`-Module und `fetch` (Node 22), `redirect: 'manual'`, Zeitlimit je Anfrage 10 s, höchstens 4 Anfragen parallel. Exit 1 bei Fehlern. JSON mit Prüfung · Ziel · Soll · Ist · Ergebnis.
## Nachweis
- Gegen die lokale Vorschau: `node bau/bauen.mjs --messen --aus=.cache/E4-PRUEF-12/dist` und `node bau/vorschau.mjs --aus .cache/E4-PRUEF-12/dist --port 4203 --still &` → live-check grün (oder jede Abweichung erklärt, z. B. was der Vorschau-Server bewusst nicht kann – dann nur melden, nichts ändern).
- Negativnachweis: ein winziger eigener Testserver im Ausgabeordner `.cache/E4-PRUEF-12/` (node:http), der eine Kopfzeile weglässt und eine offene Weiterleitung hat → live-check meldet beides als Fehler. Der Testserver bleibt außerhalb des Repos.
- Vorschau- und Testserver per PID beenden.
- Bericht nach `_werkstatt/pakete/_gemeinsam.md`.
