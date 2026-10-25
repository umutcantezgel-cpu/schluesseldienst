> **Vermerk:** Dieser Bericht entstand in der Planungsphase. Wo er vom genehmigten Plan (`_werkstatt/PLAN-GENEHMIGT.md`) abweicht, ist er **überholt durch PLAN**. Liste der überholten Punkte: `_werkstatt/ENTSCHEIDUNGEN.md` → „Überholte Panel-Punkte“.

## Prüfbericht: Machbarkeit, Reihenfolge, Risiko

**Geprüfte Fakten:**
- **Laufzeit:** Node 22.22 und OpenJDK 21 sind vorhanden, also läuft vnu. Bei jedem Java-Aufruf steht „Picked up JAVA_TOOL_OPTIONS“ auf stderr.
- **Browser:** Installiert ist nur Chromium 153 (rev 1243, `/opt/pw-browsers`), passend zum globalen Playwright 1.63.0. Firefox und WebKit fehlen.
- **Maschine:** 4 Kerne, 15 GB RAM, 30 GB freier Speicher.
- **GeoNames:** `dump/DE.zip` (7,5 MB), `zip/DE.zip` (384 KB) und NL sind erreichbar. Last-Modified ist heute, die Dateien werden also täglich neu erzeugt.
- **Pakete:** lighthouse 13.5.0 verlangt Node ≥ 22.19. Das neueste `playwright-core` ist 1.64.1. vnu-jar 26.10.12 enthält das Jar selbst (32 MB); sein postinstall lädt nur eine Java-Laufzeit.
- **Wettbewerber:** Beide Live-Seiten sind erreichbar.
- **Richter-Daten:** Der Zusatz „, Gießen“ steht oft für den Kreis (Laubach, Lollar, Pohlheim). Teils ist er falsch (Villmar, Mücke, Steffenberg).

### KRITISCH
1. **Reihenfolge der Prüfer** · Die Prüfer für Plagiat, Ehrlichkeit, Links, JSON-LD und vnu entstehen erst in W4 (L231). Haiku schreibt Inhalte aber schon ab W1. Verstöße fallen so erst am Ende auf und erzwingen Nacharbeit in großem Umfang.
   → Alle `bau/pruefen/*` in E2 direkt nach dem Generator-Kern bauen. Jedes Paket gilt erst mit grünem `--pruefen` als fertig. W4 enthält dann nur noch Sitemaps und OG-Bilder.
2. **Plagiat-Hash** · FNV-32 (Panel 2 §6) bei 0,2–2 Mio. Wettbewerber-Schindeln gegen ~3 Mio. eigene ergibt erwartbar mehr als 100 Falschtreffer. Der Build bliebe dauerhaft rot (HALT). Dazu treffen unsere alphabetischen Ortslisten (A–Z, Nachbarorte) die alphabetische Richter-Liste, ebenso Impressum-Pflichtformeln.
   → 64-bit-Hash plus exakter Stringvergleich bei Treffern.
   → Nur Fließtext prüfen (p und li aus `src/inhalte`), keine Orts- oder Navigationslisten.
   → Abbruch erst ab ≥ 10 gleichen Wörtern in Folge; 7–9 Wörter nur berichten.
   → Den Korpus einmal nach `.cache` vorberechnen, nur aus `.md`-Dateien.
3. **Abgleich-Punkte** (L55) · Zwei Effekte treiben die Unklar-Quote hoch:
   - Die −10-Strafe bei „Gemeinde inkonsistent > 12 km“ verwirft die Kreis-Hinweise aus Punkt „Richter-Daten“.
   - Nicht verschmolzene ADM4- und PPL-Einträge desselben Orts haben Abstand 0 und landen massenhaft in „unklar“.

   Schätzung mit den Plan-Regeln: 10–15 % unklar (550–850 Orte). Nach der Korrektur 3–6 % (~170–350). Das sind dann Stadtviertel (Potsdam „Industriegelände“, „Waldstadt I“; Bremen 65, Stuttgart 36, Köln 23), echte Namensdoppel und 5–10 NL-Weiler.
   → Den Hinweis als Gemeinde oder Kreis werten: +4, wenn admin4 oder admin3 gleich ist oder der Ort ≤ 25 km entfernt liegt. Nur −4, und erst ab > 40 km.
   → Als Zweitbester zählt nur ein anderes admin4-Cluster oder ein Ort > 5 km entfernt.
   → Opus labelt 150 geschichtete Gold-Datensätze. Die Schwelle wird auf Präzision ≥ 99 % kalibriert, der Recall in ABNAHME.md berichtet.
   → Kein HALT bei hoher Quote: Unklare Orte werden nicht veröffentlicht, die Zahl steht in ABNAHME.md.
4. **Quellen-Lock** (L52) · Der TOFU-Prüfsummenvergleich wird wegen der täglichen Neuerzeugung bei jedem erneuten Download rot. Nach einem Container-Reset folgt ein HALT.
   → Der Lock pinnt den gecachten Schnappschuss. Fehlt der Cache, `--neu-einlesen` mit Diff-Bericht. Das Slug-Register schützt die URLs; `orte.json` bleibt die committete Wahrheit.
   → `dump/DE.zip` und `zip/DE.zip` enthalten nach GeoNames-Konvention beide `DE.txt` (per HEAD nicht prüfbar). Daher getrennte Ordner oder `unzip -p`.

### WICHTIG
5. **E2-Reihenfolge** (L219–226) · Die Pipeline zuerst blockiert das Designtor. Die Werkzeuge aus E0.5 haben noch keine prüfbare Seite.
   → Neue Reihenfolge:
     1. E2a: Generator-Kern, Escaping, Vorschau, Sicherheits-Linter, Hoster-Konfigurationen.
     2. E2b: Technik-Spike auf einer Stub-Seite mit voller CSP, Trusted Types, COEP, Schrift, View Transition und Sprite-`<use>`. Lighthouse, axe, vnu und Smoke werden kalibriert; je ein bewusst fehlerhaftes Fixture muss rot werden.
     3. E2c: Datenvertrag (`orte.json` und Shards) samt Fixture mit 60 Orten.
     4. V01 durch Opus, parallel dazu Pipeline 00/10/20 durch Haiku (mit Zusicherungen), danach 30-Abgleich durch Opus.
   → Kritischer Pfad: `orte.json` → V07/V06/Shards/Linkgraph → Z-08 auf Ortsseiten.
6. **Parallelität und Dateihoheit** · Folgende gemeinsame Dateien kollidieren: Routentabelle, `navigation.mjs`, `komponenten.css`, Sprite und die V02-Vorlage für 4 Pakete in W1. Außerdem schreiben die Slots gleichzeitig nach `dist/`, nutzen Port 4173 und den git-Index.
   → Opus legt vor jeder Welle Registries per Verzeichnis-Scan an (`seiten/*.mjs`, `css/komponenten/*.css`, `icons/*.svg`).
   → Die Vorlage je Ansicht entsteht vor dem Inhalts-Fan-out.
   → Je Slot eigene Ausgabe und eigener Port (`--aus=.cache/slot-N`, Port 4173+N). Nur Opus committet.
   → Lighthouse- und Z-05-Messungen laufen exklusiv (Sperrdatei), nie parallel zu Builds.
7. **Szenen** · Die M-17-Engine und I-01/03/04/05 fehlen in E2, V02 in W1 braucht sie aber. Die Icons entstehen in derselben Welle.
   → Engine und Szenen-Illustrationen baut Opus vor W1.
   → Die Icon-Namensliste gilt als Vertrag. Haiku-Icons laufen durch einen Geometrie-Linter (Strich 1,5, Raster 0,5, nur 0/45/90°).
8. **Haiku-Texte** · Haiku erfindet erfahrungsgemäß Norm-Nummern, §§ und Zahlen. Der Ehrlichkeitsprüfer erkennt nur Muster.
   → Opus liefert je Themenpass ein Faktenblatt. Ein Prüfer zieht jede Zahl, Norm, jeden § und jede Prozentangabe aus dem Text und verlangt einen Treffer im Faktenblatt.
9. **Messbarkeit Z-08** · Mit noindex, `Disallow: /` und Platzhalter-Canonical ist SEO 100 (L266) unerreichbar. Für INP gibt es kein Messwerkzeug.
   → Messbuild `--messen`: indexierbar, `basisUrl=http://127.0.0.1:417x`, nie deploybar.
   → Für INP ein Playwright-Interaktionsskript (Combobox, Menü, FAQ, Rechner) mit Event-Timing bei 4-facher Drosselung.
10. **Z-05** · Die Messmethode ist nicht festgelegt. Der Container hat keine GPU, und Playwright-headless nutzt die headless-shell.
    → `channel:'chromium'`, CDP `setCPUThrottlingRate(4)`, rAF-Intervalle plus Long Animation Frames während M-16 und Wheel-Scroll. Kalibrier-Fixture mit absichtlichem Ruckeln. Echte Geräte als UMGEBUNGSAUSNAHME.
    - Risiko: Transform-Animationen auf SVG-Kindern (Stifte in M-16, Raster in M-18) laufen in Chromium vermutlich auf dem Main-Thread. Im Spike prüfen.
    - Falls ja: bewegte Teile als HTML-Hüllen mit eigenen kleinen SVGs. Die Rasterkarte als ein einziger `<path>`, skaliert 0,42→1 statt 1→2,4.
11. **Hero und LCP** · Die reine CSS-Lösung ist machbar:
    - Der Endzustand ist die Basisregel. Der Startzustand steht nur in `@keyframes` unter `prefers-reduced-motion: no-preference` mit `fill-mode: backwards`.
    - Die Illustration ist Inline-SVG (kein `<img>`), also kein LCP-Kandidat. Für SVG-Teile `transform-box: fill-box` setzen.
    - Pin-Position und Peilung (V07-Karte, M-19) nicht per CSS-Variable setzen, denn `style=` ist verboten. Stattdessen das `transform`-Attribut am äußeren `<g>`.
12. **Ortssuche** (L174) · Shards nach Erstbuchstabe finden keine Wortanfänge („homburg“ → Bad Homburg liegt im Shard B). Ortsteile sind über den Gemeindenamen nicht auffindbar.
    → Jeden Datensatz unter jedem Wortanfang einsortieren (~1,4-faches Volumen; größter Shard ~45 KB roh / ~11 KB gz). Alternativ ein Gesamtindex (~70 KB gz), geladen bei Fokus.
    → PLZ-Shards aus allen DE-PLZ bauen, nicht nur aus unseren Orten.
    → INP ist unkritisch: ≤ 8 Optionen, `replaceChildren()`. Kein `innerHTML=''`, das wirft unter Trusted Types.
13. **Linkgraph** (L149) · Die kNN-Nachbarschaft ist gerichtet. Rand-, NL- und Einzelorte haben nur 0–1 eingehende Links, die Regel „≥ 3 eingehend“ macht den Build rot.
    → In 50-anreichern die Nachbarschaft symmetrisieren (bis 10 Links). Prüfung schon in W2.
14. **Titel** (L146) · Bei Namensdoppeln wie „Neustadt“ kürzt die Fallback-Kette den Unterscheider weg, dann bricht der Build an Dubletten ab.
    → Den Kreis-Unterscheider nie kürzen. Über 60 Zeichen bei Ortsseiten nur als Warnung.
15. **Werkzeug-Fallen**
    - `playwright-core` exakt auf 1.63.0 pinnen; 1.64.1 erwartet einen anderen Chromium, der nicht installiert ist.
    - Lighthouse braucht `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` und `--no-sandbox` (läuft als root).
    - vnu mit `--format json` auswerten, stderr ignorieren.
    - Im Spike prüfen: `upgrade-insecure-requests` auf `http://127.0.0.1` und externes Sprite-`<use>`. Falls eines bricht: Vorschau-Variante ohne UIR bzw. Sprite inline.
16. **Widersprüche in den Panels** · Die Panels kommen nach `_werkstatt/berichte` (L209), widersprechen dem Plan aber:
    - `/schluesseldienst/<slug>/` und `/slotenmaker/` (Panel 2)
    - Zonen 15/30/60 (Panel 2) bzw. 25/50/100 (Panel 3)
    - gehashtes Inline-Snippet, Theme-Schalter, „Nummer kopieren“ (clipboard ist verboten)
    - Geolocation (Panel 1), Composer-Zustand „Netzwerkfehler“

    → Vermerk „überholt durch PLAN“ plus Liste in ENTSCHEIDUNGEN.md, bevor Haiku die Berichte liest.
17. **Designtor Z-04** · Ohne Begrenzung droht eine Endlosschleife.
    → Höchstens 3 Runden. Danach den besten Stand mit Begründung in BERICHT.md festhalten und weitermachen.

### NICE
- Der `worker_threads`-Pool ist unnötig; 6.000 Seiten dauern etwa 3–5 s auf einem Thread (Schätzung). Falls doch: Worker importieren die Konfiguration selbst, denn `Roh`/`Platzhalter`-Instanzen verlieren beim `postMessage` ihren Prototyp.
- „Stand {Datum}“ im Footer ändert bei jedem Commit alle Ortsseiten. Auf Ortsseiten weglassen oder aus dem lastmod-Hash ausnehmen.
- Hubs nur für Länder mit Orten (kein Hamburg, kein Sachsen). Stadtstaaten ohne Kreisebene. NL nur mit PC4-Postleitzahlen.
- Umkreis: PPLX-Einträge und Siedlungen ohne admin4 in die Prüfliste statt auf eine Seite.
- Safari und Firefox (View Transitions, `animation-timeline`) als UMGEBUNGSAUSNAHME.
- Node-`fetch` funktionierte im Test; `NODE_USE_ENV_PROXY=1` trotzdem setzen.

### Critical Files for Implementation
- /root/.claude/plans/nutze-das-was-vorhanden-bright-sphinx.md
- /home/user/schluesseldienst/pipeline/orte/30-abgleich.mjs
- /home/user/schluesseldienst/bau/pruefen/plagiat.mjs
- /home/user/schluesseldienst/bau/bauen.mjs
- /home/user/schluesseldienst/_werkstatt/werkzeuge/package.json