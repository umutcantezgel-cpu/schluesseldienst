# E5 Endprüfung · Anlauf 1 (2026-10-25)

Frische Opus-Prüfer, Workflow `e5-endpruefung`, Stand Commit `c6ed8e2` (Messbuild `.cache/opus-e5/dist`, Vorschau 4201 unkomprimiert, 4204 gzip). Bilder der Sichtabnahme: `.cache/e5-review/bilder` (außerhalb des Repos, Regel aus AUFTRAG Abschnitt 8).

## Ergebnis
- **Z-04 nicht erfüllt:** Keine Hauptansicht erreicht den Ansichtswert 8; tiefste Kategorien 6 (V02 Komposition, V04 Details, V07 Grafik, V08 Grafik, V09 Komposition, V11 Komposition/Grafik/Details).
- **Blindvergleich:** In allen 12 Paaren zieht der Prüfer den neuen Stand vor (Schlüssel erst nach dem Urteil abgeglichen).
- **Nachprüfung:** Messwerte im Budget; ein Blocker (Fokus mobil vollständig unter der Rufleiste, WCAG 2.4.11), dazu kleine Befunde.
- Folge: zweiter und letzter Anlauf (L3: höchstens zwei Anläufe je Tor). Befunde als Pakete, siehe unten.

## Sichtabnahme (Rubrik Abschnitt 9, Ansichtswert = Mittel der sechs Kategorien)

| Ansicht | Pfad | Typo | Komp. | Farbe/Bild | Bewegung | Grafik | Details | Wert |
|---|---|---|---|---|---|---|---|---|
| V01 Startseite | `/` | 8 | 7 | 9 | 7 | 8 | 7 | 7,67 |
| V02 Leistungsgruppe | `/einbruchschutz/` | 8 | 6 | 8 | 7 | 8 | 7 | 7,33 |
| V03 Leistungsdetail | `/notoeffnung/tueroeffnung/` | 8 | 8 | 8 | 8 | 7 | 7 | 7,67 |
| V04 Preise | `/preise/` | 8 | 7 | 8 | 7 | 8 | 6 | 7,33 |
| V05 Einsatzgebiet | `/einsatzgebiet/` | 7 | 7 | 8 | 7 | 8 | 7 | 7,33 |
| V06 Orts-Hub Landkreis Limburg-Weilburg | `/einsatzgebiet/hessen/limburg-weilburg/` | 8 | 7 | 7 | 8 | 7 | 7 | 7,33 |
| V07 Ortsseite | `/schluesseldienst-loehnberg/` | 8 | 7 | 8 | 8 | 6 | 7 | 7,33 |
| V08 Ratgeber | `/ratgeber/rauchmelderpflicht/` | 7 | 7 | 8 | 8 | 6 | 7 | 7,17 |
| V09 Über uns | `/ueber-uns/` | 7 | 6 | 7 | 7 | 7 | 7 | 6,83 |
| V10 Kontakt | `/kontakt/` | 7 | 8 | 8 | 7 | 8 | 7 | 7,50 |
| V11 Suche | `/suche/` | 7 | 6 | 7 | 7 | 6 | 6 | 6,50 |
| V12 Recht (Impressum) | `/impressum/` | 8 | 7 | 8 | 8 | 7 | 7 | 7,50 |
| V12 404 | `/gibt-es-nicht/` | 7 | 7 | 8 | 8 | 7 | 7 | 7,33 |
| Querschnitt V10–V12 (Bewegung, Leitelement) | `/kontakt/, /suche/, /impressum/, /gibt-es-nicht/` | 7 | 7 | 8 | 7 | 7 | 7 | 7,17 |

Die Begründungen und alle Befunde mit Beleg und Vorschlag stehen im Workflow-Ergebnis; die Befunde mit Schwere hoch und mittel sind unten als Pakete übernommen.

## Blindvergleich (Z-04)
Vorbereitung: `_werkstatt/werkzeuge/blindpaar.mjs` (Saat 2026, 3 Ausschnitte je Gerät, Namen, Nummern und Wortmarken maskiert). Der Prüfer sah nur „A“ und „B“; der Schlüssel lag getrennt und wurde erst nach dem Urteil zugeordnet.

| Bogen | Paar | Gerät | Neu war | Bevorzugt | Deutlichkeit | Ergebnis |
|---|---|---|---|---|---|---|
| paar-01-mobil | V01-R | mobil | A | A | sehr klar | neu vorgezogen |
| paar-02-desktop | V01-R | desktop | A | A | sehr klar | neu vorgezogen |
| paar-03-mobil | V01-A | mobil | B | B | sehr klar | neu vorgezogen |
| paar-04-desktop | V01-A | desktop | B | B | sehr klar | neu vorgezogen |
| paar-05-mobil | V03-A | mobil | A | A | sehr klar | neu vorgezogen |
| paar-06-desktop | V03-A | desktop | A | A | sehr klar | neu vorgezogen |
| paar-07-mobil | V04-A | mobil | B | B | sehr klar | neu vorgezogen |
| paar-08-desktop | V04-A | desktop | A | A | klar | neu vorgezogen |
| paar-09-mobil | V07-R | mobil | A | A | sehr klar | neu vorgezogen |
| paar-10-desktop | V07-R | desktop | A | A | sehr klar | neu vorgezogen |
| paar-11-mobil | V07-A | mobil | B | B | sehr klar | neu vorgezogen |
| paar-12-desktop | V07-A | desktop | A | A | sehr klar | neu vorgezogen |

**12 von 12 Paaren:** neuer Stand vorgezogen. Häufigste Gründe der Prüfer: klare Hierarchie, eigenständige Grafik, ruhige Farben, Handlung jederzeit erreichbar; bei den Wettbewerbern verdeckende Einwilligungsbanner, schwacher Kontrast, Siegel und Bewertungen als Verkaufsdruck.

## Nachprüfung (Haiku-Prüfer mit den Werkzeugen)
- ✓ **Vorbedingung: Vorschau 4201/4204 entspricht dem aktuellen Stand (HEAD c6ed8e2, Arbeitsbaum sauber)** – Die Vorschau (bau/vorschau.mjs --aus .cache/opus-e5/dist) unterscheidet sich vom frischen Messbuild nur durch den Port in kanonischen URLs, og:url und og:image (4201 statt 4173). assets/ ist identisch, index.html ist bis auf den Host identisch. Die Messungen gelten also für den aktuellen Stand.
- ✓ **1 smoke.mjs, 13 Pfade × mobil/desktop, mit Modulprüfung (--skript module-skript.mjs: jedes [data-modul] trägt data-modul-aktiv, Bündel geladen)** – 26 Messungen. Fremde Anfragen 0, CSP-Verstöße 0 (Konsole und Ereignis), JS-Seitenfehler 0. Auf allen 13 Seiten tragen alle [data-modul] data-modul-aktiv (4 bis 8 Module je Seite, inaktiv 0). Jede Seite lädt genau ein app.<hash>.js, das sie selbst referenziert; 7 verschiedene Bündel. Beispiele: / → app.144faf48dd.js (aufklapper, menue, abspielen, ortssuche, erreichbarkeit); /preise/ → app.b923e342a3.js (mit preisrechner); /suche/ → app.3cf4d381e7.js (suche); /einbruchschutz/ → app.ef6c317a06.js (szene); Hubs, Ort, Ratgeber, Kontakt und Impressum → app.fa26ae74ea.js. Kontraststile auf jeder Seite als kontrast.eb697313dd.css mit media="(forced-colors: active)". Eine Ansichts-Stildatei je Seite (z. B. start-register-gebiet, register-gruppe). Exit 1 nur wegen /gibt-es-nicht/: Status 404 und die zugehörige Chromium-Zeile „Failed to load resource … 404“, also der absichtliche 404 wie in B15. Sonst 0 Befunde.
- ✓ **2a axe.mjs hell und dunkel, 13 Pfade** – Hell: 13 Seiten, critical 0, serious 0, moderate 0, minor 0. Dunkel: ebenso 0/0/0/0. Status 12× 200, 1× 404.
- ✓ **2b ueberlauf.mjs (320/390/768/1440/1920 px, jeweils mit erzwungenen Farben, 200 % Zoom)** – 143 Messungen (13 × 11), 0 mit Dokumentüberlauf, Exit 0.
- ✓ **3a lighthouse.mjs mobil, 3 Läufe, Median, 4201 unkomprimiert, 12 Pfade mit 200** – Median Perf/A11y/BP/SEO/LCP/CLS (Spanne Perf, LCP): / 97/100/100/100/2258/0 (0, 9) · /einbruchschutz/ 98/100/100/100/2257/0 (0, 2) · /notoeffnung/tueroeffnung/ 99/…/2106/0 (0, 5) · /preise/ 97/…/2408/0 (0, 4) · /einsatzgebiet/ 98/…/2107/0 (0, 18) · /einsatzgebiet/hessen/limburg-weilburg/ 99/…/1957/0 (0, 6) · /schluesseldienst-loehnberg/ 99/…/2111/0 (0, 166) · /ratgeber/rauchmelderpflicht/ 99/…/1806/0 · /ueber-uns/ 99/…/2109/0 · /kontakt/ 99/…/1807/0 · /suche/ 99/100/100/66/1805/0 · /impressum/ 99 (Einzelläufe 100/99/98)/…/1804/0. A11y und BP überall 100. SEO 100 außer /suche/ mit 66 (seo/is-crawlable, noindex, D-SEO-03, nicht als Verstoß gezählt). Perf ≥ 95, LCP ≤ 2.500 ms und CLS ≤ 0,1 auf allen 12 Pfaden erfüllt. Gegenüber Prüfstufe C: / 96→97 und LCP 2416→2258, /einbruchschutz/ 96→98 und 2408→2257, /preise/ 96→97 bei unverändertem LCP (2404→2408). Exit 1 des Werkzeugs nur wegen /suche/ SEO.
- ✓ **3b Lighthouse /gibt-es-nicht/ (404) auf 4201, 3 Läufe** – lighthouse.mjs bricht bei 404 weiterhin ab (W1 offen). Gemessen habe ich mit einem eigenen Skript (gleiche Kategorien, mobil, ignoreStatusCode: true). Median: Perf 99, A11y 100, BP 96, SEO 58, LCP 1.807 ms, CLS 0, Spannen 0. Mängel: best-practices/errors-in-console (die 404-Meldung des Hauptdokuments), seo/is-crawlable, seo/http-status-code. SEO fällt unter D-SEO-03. BP 96 deckt D-SEO-03 dem Wortlaut nach nicht ab (siehe Befund).
- ✓ **3c Startseite auf 4204 (gzip), lighthouse.mjs, 3 Läufe** – Perf 100 (Spanne 1), A11y/BP/SEO 100, LCP 1.656 ms, FCP 1.356 ms, 101.601 B. CLS-Median 0,016: Einzelläufe 0,016 / 0 / 0,016. Schwelle ≤ 0,1 erfüllt, Werkzeug Exit 0. Ursache laut Diagnoselauf: Verschiebung von section.sektion.band („Was jetzt hilft“) mit Ursache atkinson-mono-latin-wght.woff2 (spät geladen, nicht vorgeladen). Unkomprimiert auf 4201 ist CLS in allen 3 Läufen 0.
- ✓ **4 Tastatur mobil 390×844 /einsatzgebiet/hessen/limburg-weilburg/: Tabulatorschritte bis zum ersten Element der Rufleiste, Fokus sichtbar** – Erstes Element der Rufleiste (a.rufleiste-menue „Menü“) nach 4 Schritten: Sprunglink, Wortmarke, Suche, Menü. Vorher 177 bis zum Anruf. Der Anruf selbst ist in der Vorschau nicht fokussierbar: span.rufknopf data-zustand="platzhalter", 0 a[href^=tel:] (bekannt, B1/U-6). Er steht im DOM direkt nach „Menü“, mit echter Nummer wäre er also Schritt 5 (abgeleitet aus rufleiste.mjs, nicht gemessen). Fokusring: alle 209 Fokusziele matchen :focus-visible mit outline solid 3px rgb(168,74,34), Offset 3px, ohne Ring 0. Aber: 38 von 208 Zielen liegen beim Fokussieren vollständig unter der festen Rufleiste (siehe Befund).
- ✓ **5 Erzwungene Farben /kontakt/ und /leistungen/ (Playwright forcedColors active gegen none; Vergleich aller berechneten Stile mit und ohne kontrast.css per sheet.disabled)** – kontrast.eb697313dd.css ist auf beiden Seiten mit media="(forced-colors: active)" eingebunden. Mit forcedColors 'active' wirkt sie: /kontakt/ 79, /leistungen/ 167 Elemente ändern sich, wenn man die Datei abschaltet. Kontrollwerte mit Datei: .kontakt-weg outline solid 1px CanvasText und Rahmen oben Highlight. Gedrückter Filterknopf [aria-pressed=true] („01 Notöffnung“, nach Klick): border solid 2px Highlight, Hintergrund Canvas. Ohne Datei: 1px. Nicht gedrückte Knöpfe: 1px CanvasText. Platzhalter-Rufknopf: gestrichelt. .fuss: Kante 1px CanvasText. aria-current im Hauptmenü: unterstrichen 2px. Mit forcedColors 'none' ändern sich 0 von 459 (/kontakt/) bzw. 0 von 512 (/leistungen/) Elementen. Die Ebenenreihenfolge in app.css endet mit hilfen (@layer token, basis, layout, komponenten, bewegung, hilfen), die Ansichtsstile liegen in @layer komponenten.
- ✓ **6a npm test** – 300 Tests, 299 bestanden, 0 fehlgeschlagen, 1 todo, Exit 0 (C: 292 Tests).
- ✓ **6b node bau/bauen.mjs --messen --pruefen --aus=/home/user/schluesseldienst/.cache/e5-review/nachpruefung/dist** – Exit 0, 5.556 Seiten, CSS 48.050 B, JS 7 Bündel bis 21.879 B. Alle 11 Prüfer 0 Fehler (budgets, ehrlichkeit, emoji, fakten, icons, jsonld, links, plagiat, seo, sicherheit, token). SEO 72 Warnungen (wie C, D-SEO-04). Platzhalter 65 in der Ausgabe, 58 in der Konfiguration, ungeprüfte Fakten 92 (unverändert). Den Build habe ich unter mitMessSperre laufen lassen, damit keine Messung gestört wird.

### Befunde der Nachprüfung
- [blocker] Fokus mobil vollständig unter der festen Rufleiste verdeckt (WCAG 2.2 AA 2.4.11 „Focus Not Obscured (Minimum)“). Beim Tabben scrollt der Browser das Ziel nur bis an den unteren Rand des Viewports, die Rufleiste (768–844 px, 75,9 px hoch) liegt darüber. scroll-padding-bottom ist auto. Diese Änderung hat das nicht verursacht (die Leiste war schon vorher fest unten), aber weder axe noch die bisherigen Prüfstufen erfassen es. · Vorschlag: Unterhalb von 64em html { scroll-padding-block-end: calc(<Höhe der Rufleiste> + var(--sp-s)); } setzen. Die Höhe am besten als Token, das auch die Rufleiste nutzt, ggf. mit env(safe-area-inset-bottom). Danach verdeckt.mjs erneut ausführen (Ziel: 0 ganz verdeckt) und den Abschnitt Z-07 im Bericht ergänzen.
- [klein] CLS auf der Startseite unter gzip (4204) in 2 von 3 Läufen 0,016. Das ist derselbe Wert, den D-JS-01 als behoben beschreibt, hier aber durch die Mono-Schrift ausgelöst. Schwelle ≤ 0,1 eingehalten. · Vorschlag: „AHM Ersatz“ wie „AHN Ersatz“ je Stärkebereich mit gemessenem size-adjust aufteilen, oder auf V01 die Mono-Schrift vorladen bzw. für Mono font-display: optional nutzen. Danach 4204 mit 3 Läufen erneut messen (Ziel CLS 0).
- [klein] Sieben verwaiste Ansichts-Stildateien in der Ausgabe. Seit den zusammengelegten Ansichts-Stilen (D-JS-01, „a+b“) schreibt der Bau die Einzeldateien weiter, keine Seite und keine andere Datei verweist darauf. · Vorschlag: In bau/lib/assets.mjs nur Stildateien ausgeben, die eine Seite referenziert. Oder ein Prüfer meldet unreferenzierte Dateien unter assets/ als Warnung oder Fehler.
- [klein] Lighthouse auf /gibt-es-nicht/: Best Practices 96 wegen errors-in-console, also der eigenen 404-Meldung des Hauptdokuments. D-SEO-03 nimmt die 404-Seite nur für SEO aus. lighthouse.mjs bricht bei 404 weiterhin ab (W1 offen). · Vorschlag: D-SEO-03 (oder eine eigene Entscheidung) um BP < 100 auf der 404-Seite ergänzen, weil die Konsolenmeldung zum korrekten Status 404 gehört. In lighthouse.mjs eine Option --404-erlaubt mit ignoreStatusCode: true ergänzen (W1).
- [klein] Anruf in der Vorschau weiterhin nicht per Tastatur erreichbar. Der Rufknopf ist im Platzhalterzustand ein span, kein Link. Bekannt (B1/U-6). Die neue DOM-Lage lässt sich deshalb nur bis „Menü“ messen. · Vorschlag: Für die Abnahme H1 einmal mit Testnummer (Diagnosekopie wie .cache/e5/diagnose2) messen. Erwartet: Anruf mobil in Schritt 5.

## Anlauf 2 · Umsetzung der Befunde
### Gemeinsame Befunde (Orchestrator, D-E5-01)
- Blocker Fokus unter der Rufleiste: `scroll-padding` (mobil unten, ab 64em oben). Nachmessung mit `verdeckt.mjs` (390 × 844): Hub Limburg-Weilburg 38 → 0 ganz verdeckt, Start 19 → 0, Kontakt 15 → 0 (1 teilweise), Preise 15 → 0.
- M-15 Leitelement: Kopflinie `.scherlinie-leit` auf allen 17 Seitenvorlagen, genau eine je Seite.
- M-13/M-14 am Zeitstrahl des Abschnittskopfs; M-18 Namen erscheinen mit ihren Punkten.
- Überschriften: keine automatische Trennung, `&shy;` aus der Wortliste (`src/inhalte/trennstellen.mjs`).
- Fuß mit Kante; Länderliste mobil zweispaltig; Weiterlesen-Karten gleich hoch, M-02/M-03, vier Karten 2 × 2; Klassenkollision `.fehler-wege` entfernt; Auswahlkarten ein Fokusring, M-02/M-03; Rufknopf-Übergang; nicht verfügbare Knöpfe gestrichelt; Illustrationsflächen flach; nur referenzierte Ansichts-Stile im Build.
- Mono-Ersatzschrift: verworfen mit Messung (pixelgleich in allen Stärken, 16 Ladevorgänge ohne Verschiebung).
### Ansichtspakete
Je Ansichtsgruppe ein Paket mit eigenen Dateien (siehe STATUS); Ergebnis und zweite Sichtabnahme folgen unten.
