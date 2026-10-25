# E0-vorher-kennzahlen

Stand 2026-10-25. Nur informativ. Baseline für Z-08 ist die erste eigene Messung in E2.

Methode: Lighthouse mobil, je Paar Median aus 3 Läufen, Spanne in Klammern. Zählwerte aus dem Ladevorgang mobil, eine Erfassung je Paar. Keine Bilder, Textzitate oder Telefonnummern in diesem Bericht.

## Kennzahlen

| Paar | Perf | A11y | BP | SEO | LCP ms | CLS | TBT ms | Bytes¹ | Cookies | Skripte | h1 | Fremd-Anfragen (Hosts) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V01-R | 55 (12) | 100 (0) | 100 (23) | 91 (0) | 8505 (1989) | 0,179 (0,000) | 217 (223) | 1 773 kB | 2 | 21 | ja | 19 (6) |
| V01-A | 68 (10) | 95 (0) | 77 (0) | 100 (0) | 4961 (1806) | 0,000 (0,000) | 385 (176) | 654 kB | 12 | 12 | ja | 34 (11) |
| V03-A | 64 (6) | 95 (0) | 77 (0) | 100 (0) | 5084 (1462) | 0,000 (0,000) | 439 (165) | 654 kB | 12 | 12 | ja | 34 (11) |
| V04-A | 74 (11) | 95 (0) | 77 (0) | 100 (0) | 4723 (1398) | 0,000 (0,000) | 368 (106) | 574 kB | 12 | 11 | ja | 34 (11) |
| V07-R | 59 (18) | 100 (0) | 96 (19) | 92 (0) | 8706 (681) | 0,006 (0,203) | 172 (231) | 1 334 kB | 2 | 35 | ja | 13 (7) |
| V07-A | 69 (15) | 95 (0) | 77 (0) | 100 (0) | 5060 (1645) | 0,000 (0,000) | 421 (279) | 658 kB | 12 | 11 | ja | 34 (11) |

¹ Näherung aus Playwright (Antwortkörper und Header, Cache aktiv, ungedrosselt). Die Lighthouse-Kennzahl total-byte-weight ist im Ausgabeformat von lighthouse.mjs nicht enthalten. Die Werte sind daher nicht mit Lighthouse vergleichbar.

## Fremd-Hosts

- V01-R (6): cdnjs.cloudflare.com, cloud.ccm19.de, code.jquery.com, static.cloudflareinsights.com, www.googletagmanager.com, www.youtube.com
- V01-A (11): app.eu.usercentrics.eu, c.bing.com, c.clarity.ms, config.eu.usercentrics.eu, consent-api.service.consent.eu1.usercentrics.eu, q.clarity.ms, scripts.clarity.ms, uc.e-recht24.de, uct.eu.usercentrics.eu, www.clarity.ms, www.ratedo.de
- V03-A (11): wie V01-A
- V04-A (11): wie V01-A, mit i.clarity.ms statt q.clarity.ms
- V07-R (7): cdnjs.cloudflare.com, cloud.ccm19.de, code.jquery.com, maps.google.com, maps.googleapis.com, static.cloudflareinsights.com, www.googletagmanager.com
- V07-A (11): wie V01-A, mit g.clarity.ms statt q.clarity.ms

Fremd = registrierbare Domain ungleich der Seite (letzte zwei Labels).

## Prüfung

- Lighthouse: 6 Aufrufe mit je 3 Läufen, alle ohne Fehler im ersten Versuch.
- Erfassung: 18 Seitenaufrufe, alle HTTP 200, mindestens 5 s Abstand. Die Adresse V07-R galt im Primärpfad, eine Ausweichadresse war nicht nötig.
- Ein erster Lauf zeigte im Kopf von V01-R einen lesbaren Firmennamen (CSS-Hintergrundbild `div.logo`). Die Logo-Regel wurde auf Klasse und id erweitert, danach wurde das ganze Paket neu erfasst. Die Zählwerte stammen aus diesem zweiten Lauf.
- Stichprobe nach der Korrektur, zwei Bilder: V01-R mobil 01 zeigt keinen Schriftzug mehr. V07-R desktop 01 zeigt weder Firmenname noch Telefonnummer.
- Restrisiko: Das Foto einer Person im Hero-Bereich (V01-R, V01-A) bleibt sichtbar.

## Bildbelege

`/home/user/schluesseldienst/.cache/vorher/bilder/`: 97 JPEG (`<Paar>__<Gerät>__<nn>.jpg`) und `index.json`. Lighthouse-Rohdaten: `/home/user/schluesseldienst/.cache/vorher/lighthouse-<Paar>.json`. Beides liegt unter `.cache/` (gitignored) und ist nicht committet.
