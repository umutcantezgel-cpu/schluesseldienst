# KERN · Version 1 (2026-10-25) – Quelle der Wahrheit
Änderungen nur durch den Orchestrator, mit Versionsnummer und Grund (Verlauf am Ende). Jedes Paket nennt die Kern-Version, gegen die es gebaut wurde.

## Das Projekt in fünf Sätzen
1. Aus den Exporten zweier Schlüsseldienst-Websites (Richter, Adam) entsteht eine eigene, rein statische Website für einen neuen Schlüsseldienst mit Sitz in Weilburg an der Lahn; der Firmenname steht noch nicht fest.
2. Die Seite deckt alle Themen beider Vorbilder ab – Notöffnungen, mechanischer Einbruchschutz, elektronische Sicherheitstechnik, Einbau und Tresore, Preise, Einsatzgebiet mit 5.252 Ortsseiten (aus rund 5.800 Quellorten; 314 ungeklärte Orte bleiben unveröffentlicht), Ratgeber, Kontakt und Recht –, aber mit eigenen Texten und ohne Kopien.
3. Ein eigener Generator in Node 22 ohne Abhängigkeiten erzeugt reines HTML, CSS und Vanilla-JavaScript; es gibt kein Backend, keine Drittanbieter und keine Cookies.
4. Sicherheit hat Vorrang: strikte Content-Security-Policy mit Trusted Types, Sicherheits-Header für jeden Hoster und ein Sicherheits-Linter über die gesamte Ausgabe.
5. Die Gestaltung „Scherlinie“ ist ruhig, präzise und offen im Preis, mit einer Kupferlinie als Leitelement, schnell und zugänglich nach WCAG 2.2 AA.

## K-001 Leitidee
> Wie der Weilburger Schiffstunnel den Lahnbogen auf gerader Linie durchquert, suchen wir in jedem Schloss die eine Linie, auf der es ohne Gewalt aufgeht – ruhig im Ton, präzise im Handwerk, offen im Preis.

- Die **Scherlinie** (Trennfuge zwischen Kern und Gehäuse eines Stiftzylinders: liegen alle Stifte darauf, dreht der Kern) ist zugleich Bild für die gerade Linie durch den Lahnbogen. Sie ist das einzige Ornament und das durchgehende Leitelement.
- Austauschprobe: Weder ein Rhein-Main-Betrieb noch ein bundesweites Netz kann Lahnbogen und Tunnel für sich beanspruchen; Gelb, Karos, Laufbänder und Sterne gehören den anderen.
- Signet (markenneutral, unabhängig vom Namen): offener Bogen (Lahnbogen = Schlüsselreide) mit einer geraden Linie durch den Hals, die als Schlüsselschaft mit zwei Bartkerben weiterläuft. Wortmarke = `{betrieb.name}` aus der Konfiguration.
- ANNAHME: Der Tunnel durchquert den Hals der Lahnschleife um die Altstadt. Die Grafik ist immer als „stilisiert“ bezeichnet; der Fakt steht in MENSCHEN.md.

## K-002 Marke, Zielgruppe, Hauptaufgaben (ANNAHME, abgeleitet)
- Marke: inhabergeführter Handwerksbetrieb in Weilburg, Name offen. Ton: ruhig, sachlich, freundlich, Sie-Anrede.
- Zielgruppe Notlage: ausgesperrt, Schlüssel abgebrochen/verloren, nach Einbruch; mobil, Stress, oft nachts, eine Hand frei.
- Zielgruppe Planung: Mieter, Eigentümer, Hausverwaltungen, kleine Betriebe (Einbruchschutz, Schließanlagen, Alarm/Video, Sicherheitstüren/-fenster, Tresore).
- Hauptaufgaben: H1 anrufen (≤ 1 Tipp von jeder Seite) · H2 Preis vor dem Anruf verstehen (≤ 2 Klicks) · H3 prüfen, ob der eigene Ort bedient wird (≤ 2 Eingaben) · H4 seriösen Betrieb erkennen · H5 Beratung/Termin per E-Mail anfragen · H6 sich informieren (Ratgeber).

## K-003 Gestaltungsprinzipien
| # | Prinzip | Tun | Lassen |
|---|---|---|---|
| P1 | **Eine Linie führt** | Die 2-px-Kupferlinie verbindet Überschrift, Figur, Handlung und nächste Seite. | Keine zweite Akzentfarbe, keine Verläufe, keine Linien ins Nichts. |
| P2 | **Ruhe ist die Dienstleistung** | Ein Blickfang je Bildschirmhöhe, klare Verben, Weißraum. | Kein Pulsieren, keine Countdowns, kein „nur heute“, keine Ausrufezeichen, keine roten Notrufknöpfe. |
| P3 | **Offen vor überzeugend** | Zeitfenster, Zuschläge, Zonen zuerst; Unbekanntes sichtbar markiert; Fakten mit Quelle. | Keine „ab“-Köder, keine erfundenen Zahlen, Bewertungen, Siegel; keine hochzählenden Kennzahlen. |
| P4 | **Präzision im Detail** | Rastertreue Icons, Tabellenziffern, Radien 2–4 px, Textmaß 32em. | Keine Kleckse, kein Glas, kein Leuchten, keine gemischten Icon-Stile, kein zentrierter Fließtext. |
| P5 | **Daumen zuerst, Nacht mitgedacht** | Anruf mit einem Tipp unten, Ziele ≥ 48 px auf Touch, ehrlicher Erreichbarkeitsstatus, Dunkelmodus gleichwertig. | Kein Anruf im Hamburger-Menü, keine Leisten, die beim Scrollen verschwinden, kein winziges Telefon-Icon. |
| P6 | **Erzählen beim Planen, arbeiten bei Eile** | Bewegung und Szenen nur in Erzählansichten; Arbeitsansichten statisch und dicht. | Keine animierten Tabellen, Formulare, Rechtstexte; nie Inhalt verzögern. |
| P7 | **Ort mit Maß** | Weilburg im Signet, im Fuß, auf „Über uns“; Entfernungen ab Weilburg. | Nie „Ihr Schlüsseldienst vor Ort in X“ außerhalb Weilburgs, keine Skyline-Cliparts, keine Scheinadressen. |
GESCHMACK: keine Vorgabe (Standard). Bewusste Abgrenzung: kein Gelb, kein Türkis, keine Karos, kein Slider.

## K-004 Stack und Konventionen
- Node 22 (`.node-version`), Generator nur mit `node:`-Modulen; keine npm-Abhängigkeiten im Projekt. Prüfwerkzeuge nur in `_werkstatt/werkzeuge` (Module unter `/home/user/werkzeuge-cache`).
- Ordner: `src/konfig/` (gemeinsam, nur Orchestrator) · `src/daten/` (generiert/gepflegt) · `src/inhalte/` (Texte als JS-Module) · `src/vorlagen/` (Template-Funktionen) · `src/assets/` (css, js, schriften, icons) · `bau/` (Generator, Vorschau, Prüfer) · `pipeline/orte/` · `test/` (node:test).
- Sprache im Code: deutsche Bezeichner (`seite`, `ort`, `preis`), ES-Module (`.mjs`), 2 Leerzeichen, einfache Anführungszeichen, Semikolon, LF.
- HTML nur über `html`-Template-Tag aus `bau/lib/html.mjs` (escaped jeden Wert); `roh()` nur in `bau/lib/` und im Icon-Modul. Keine `style=`-Attribute, keine Inline-Skripte, keine `on*`-Handler, keine HTML-Kommentare in der Ausgabe.
- CSS: `@layer token, basis, layout, komponenten, bewegung, hilfen;` Werte nur über Tokens (`var(--…)`); erlaubte Literale: `0`, `1px` (Haarlinien), `100%`, `auto`, `none`, Prozent in Keyframes, `1fr`, `em`-Breakpoints in Media-Queries. Klassen in Kleinbuchstaben mit Bindestrich, Komponenten-Präfix (`.ruf-…`, `.preis-…`), Zustände über Attribute (`[aria-expanded]`, `[data-zustand]`).
- JS: ein gebündeltes Modul je Modulsatz (`app.<hash>.js`, `type=module`, SRI, D-JS-01) und ein kleines klassisches Kopf-Skript (`kopf.<hash>.js`, SRI) nach den Stil-Links, damit der Seitenwechsel-Opt-in beim Einfügen von `<body>` feststeht (D-E5-03); Module initialisieren sich über `[data-modul="…"]`; DOM nur mit `createElement`/`textContent`/`replaceChildren`/`setAttribute`; `fetch` nur nach `/daten/` mit `integrity`. Kein `innerHTML`, `eval`, `new Function`, `import()`.
- Inhalte: JS-Module mit strukturierten Feldern; Mini-Syntax im Fließtext: `[Text](/pfad/)` (Pfad muss in der Routentabelle existieren), `**fett**`. Platzhalter nur über `platzhalter('schluessel')`, ungeprüfte Fakten über `verifizieren('text', 'quelle-id')`.
- URLs: Kleinbuchstaben ASCII, Bindestriche, immer mit Schrägstrich am Ende, keine Dateiendung.

## K-005 Designsystem (Tokens, `src/assets/css/token.css`)
Namensschema `--{kategorie}-{rolle}[-{stufe}]`. Farben als `light-dark(hell, dunkel)`, `:root{color-scheme: light dark}`; dunkle Bänder setzen lokal `color-scheme: dark`. Kein Theme-Schalter (nur Systemeinstellung).

### Farben
| Token | Hell | Dunkel | Einsatz | Kontrast H / D |
|---|---|---|---|---|
| `--c-papier` | #F4F2ED | #0E161B | Seitenfläche | – |
| `--c-papier-2` | #EAE6DE | #131E24 | Bänder | – |
| `--c-flaeche` | #FFFFFF | #18252C | Felder, Blätter, Rufleiste | – |
| `--c-tinte` | #13202A | #EDEAE3 | Text | 14,81 / 15,21 |
| `--c-tinte-2` | #3E4B55 | #BCC4C8 | Nebentext | 8,01 / 10,33 |
| `--c-tinte-3` | #5A6670 | #97A1A7 | Meta | 5,26 / 6,94 (auf Papier-2: 4,73 / 6,43) |
| `--c-linie` | #D3CEC4 | #26343C | Haarlinien (dekorativ) | – |
| `--c-linie-ui` | #76828B | #6E7C85 | Rahmen von Bedienelementen | ≥ 3:1 |
| `--c-lahn` | #1C5A4F | #7BCDB6 | Primärfläche, Anrufknopf | – |
| `--c-auf-lahn` | #FFFFFF | #0E161B | Text auf Lahn | 8,00 / 9,79 |
| `--c-lahn-text` | #1C5A4F | #86D3BE | Links | 7,15 / 10,51 |
| `--c-lahn-hell` | #DCEBE5 | #17322D | Info-Tönung | Tinte darauf 13,46 / 11,42 |
| `--c-kupfer` (= `--c-fokus`) | #A84A22 | #E8956B | Scherlinie, Fokus, Akzenttext | 5,12 / 7,78 |
| `--c-kupfer-hell` | #F6E3D8 | #3A2419 | Platzhalter-Fläche | Kupfer darauf 4,61 / 6,18 |
| `--c-fehler` / `--c-fehler-hell` | #B42318 / #FDECEA | #FF8A80 / #3B1714 | Fehler | 5,75 / 6,98 |
| `--c-warnung` / `--c-warnung-hell` | #8A5300 / #FDF1DC | #F2C26B / #33270F | Warnung | 5,66 / 8,84 |
| `--c-erfolg` / `--c-erfolg-hell` | #1E6B3A / #E3F1E7 | #7FD3A0 / #12291B | Erfolg | 5,59 / 8,63 |
- Fokusring: `outline: 3px solid var(--c-fokus); outline-offset: 3px` – liegt immer auf Papier, nie direkt auf Lahn (Kupfer/Lahn nur 1,40:1). `forced-colors`: `outline-color: Highlight`.

### Schrift
- Atkinson Hyperlegible Next Variable (OFL) – `latin-wght-normal` (vorgeladen, `swap`), `latin-ext-wght-normal` (über `unicode-range`); Atkinson Hyperlegible Mono Variable (OFL) `latin-wght-normal` nur für technische Kennungen (RC2, PLZ-Feld, Normbezeichnungen). Lokal, mit `OFL.txt`.
- Ersatzschriften mit Metrik-Anpassung (gegen Layoutverschiebung):
  - `"AHN Ersatz"`: `local("Arial"), local("ArialMT"), local("Liberation Sans"), local("Arimo")`; `size-adjust: 98.9%; ascent-override: 99.5%; descent-override: 32%; line-gap-override: 0%`.
  - `"AHM Ersatz"`: `local("Courier New"), local("Liberation Mono"), local("Cousine")`; `size-adjust: 105.3%; ascent-override: 93.4%; descent-override: 30%; line-gap-override: 0%`.
- `--ff-text: "Atkinson Hyperlegible Next Variable", "AHN Ersatz", system-ui, sans-serif` · `--ff-mono: "Atkinson Hyperlegible Mono Variable", "AHM Ersatz", ui-monospace, monospace`. Keine Kursive (`font-synthesis: none`), Betonung über Gewicht.

### Skalen
- Schriftgrößen (320 → 1280 px): `--fs--1` clamp(.875rem,.8542rem + .1042vw,.9375rem) · `--fs-0` clamp(1.0625rem,1.0208rem + .2083vw,1.1875rem) · `--fs-1` clamp(1.2188rem,1.1458rem + .3646vw,1.4375rem) · `--fs-2` clamp(1.4063rem,1.2708rem + .6771vw,1.8125rem) · `--fs-3` clamp(1.625rem,1.3958rem + 1.1458vw,2.3125rem) · `--fs-4` clamp(1.875rem,1.5208rem + 1.7708vw,2.9375rem) · `--fs-5` clamp(2.1875rem,1.6667rem + 2.6042vw,3.75rem) (nur Hero).
- Zeilenhöhen: `--lh-text` 1.6 · `--lh-dicht` 1.45 · `--lh-titel` 1.15 · `--lh-display` 1.05. Gewichte: `--fw-text` 400 · `--fw-ui` 600 · `--fw-titel` 700 · `--fw-display` 780. Laufweite: `--ls-display` -0.015em · `--ls-label` 0.06em.
- Textmaß: `--mass` 32em (≈ 71 Zeichen; nie `ch`, weil die Ziffer 0 breiter ist als der Buchstabendurchschnitt).
- Abstände (4-px-Basis): `--sp-3xs` .25rem · `--sp-2xs` .5rem · `--sp-xs` .75rem · `--sp-s` 1rem · `--sp-m` 1.5rem · `--sp-l` 2rem · `--sp-xl` 3rem · `--sp-2xl` 4rem · `--sp-3xl` 6rem; fließend `--sp-f-s` clamp(1rem,.8rem + 1vw,1.5rem) · `--sp-f-m` clamp(1.5rem,1rem + 2.5vw,3rem) · `--sp-sektion` clamp(3rem,2rem + 5vw,7.5rem); Rand `--rand` clamp(1rem,.5rem + 2.5vw,2.5rem); Rasterlücke `--luecke` clamp(1rem,.5rem + 1.5vw,2rem).
- Radien: `--r-0` 0 · `--r-s` 2px · `--r-m` 4px · `--r-l` 8px · `--r-xl` 16px (oben am Menü-Blatt) · `--r-rund` 999px (Statuspunkte und Filter-/Sprung-Pillen, z. B. Sprungleiste /leistungen/, Ratgeber).
- Linien: `--linie-haar` 1px · `--linie-ui` 1.5px · `--linie-scher` 2px · `--linie-fokus` 3px.
- Schatten hell: `--sh-1` 0 1px 0 rgb(19 32 42/.08) · `--sh-2` 0 2px 6px rgb(19 32 42/.10), 0 1px 2px rgb(19 32 42/.08) · `--sh-3` 0 12px 32px rgb(19 32 42/.18); dunkel: Ring `0 0 0 1px var(--c-linie-ui)` plus `rgb(0 0 0/.5)`.
- Ebenen: `--z-szene` 10 · `--z-kopf` 100 · `--z-rufleiste` 200 · `--z-popover` 300 · `--z-hinweis` 500 · `--z-skip` 600; Dialoge in der Top-Layer.
- Bewegung: Dauern `--dur-feedback` 150ms · `--dur-feedback-aus` 120ms · `--dur-zustand` 300ms · `--dur-zustand-aus` 240ms · `--dur-auftritt` 640ms · `--dur-auftritt-lang` 880ms · `--dur-moment-max` 1400ms · `--stagger` 60ms (≤ 8 Elemente). Kurven `--ease-standard` cubic-bezier(.2,0,0,1) · `--ease-ein` cubic-bezier(.16,1,.3,1) · `--ease-aus` cubic-bezier(.3,0,.8,.15) · `--ease-linie` cubic-bezier(.65,0,.35,1) · `--ease-einrasten` linear(0,.36 12%,.78 26%,1.04 40%,1.07 48%,1.02 60%,.995 74%,1) (Ersatz cubic-bezier(.34,1.3,.64,1); einzige Überschwing-Kurve).
- Breakpoints (Literal in Media-Queries, em): 30em · 48em · 64em (Desktop-Navigation) · 80em; dazu `(pointer: coarse)` und `(hover: hover)`; Komponenten nutzen Container-Queries; Höhe: `(min-height: 40em)` nur für Szenen (klebende Figur ab 640 px Höhe).

## K-006 Typografie und Komposition
- Seitenraster mit benannten Linien: `[voll-start] minmax(var(--rand),1fr) [breit-start] minmax(0,6rem) [inhalt-start] min(100% - 2*var(--rand), 72rem) [inhalt-ende] minmax(0,6rem) [breit-ende] minmax(var(--rand),1fr) [voll-ende]`; ab 64em 12-Spalten-Subgrid im Inhalt. Standardteilungen 7/5 (Hero), 5/7 (Szene), 3/9 (A–Z), 8/4 (Artikel mit Randspalte). Fließtext nie breiter als `--mass`.
- Silbentrennung: `lang="de"`, `hyphens: auto`, `hyphenate-limit-chars: 10 4 4`; Überschriften `text-wrap: balance`, Absätze `text-wrap: pretty`; lange Komposita in Überschriften mit `&shy;` aus einer Wortliste (`src/inhalte/trennstellen.mjs`, gesetzt vom Bau nur in h1–h4; Überschriften selbst `hyphens: manual`); Telefonnummern nie trennen (`white-space: nowrap`).
- Mobil eigene Komposition: H1 oben links, Zylinder-Band ≤ 120 px darunter, Ortsprüfung im ersten Bildschirm; Preistabellen als `dl`-Blöcke; Szenen mit kleiner fester Figur nur bei `min-height: 640px`, sonst statische Einzelbilder je Schritt; Fußlinkgruppen bleiben sichtbar (Impressum/Datenschutz nie eingeklappt).
- Rhythmusregel: Benachbarte Abschnitte unterscheiden sich in ≥ 2 von 3 Merkmalen: Fläche (Papier / Papier-2 / dunkles Band) · Layout (Teilung / Register / Figur vollbreit / Tabelle) · Dichte.
- **Rufleiste** (mobil < 64em, fest unten, nie versteckt): Fläche `--c-flaeche`, obere Linie `--c-linie-ui`, `padding-bottom: env(safe-area-inset-bottom)`, Körper bekommt passenden Abstand unten. Inhalt: [Menü] + [Anrufen · Nummer] (Rest der Breite, 56 px hoch, Tabellenziffern, Statuszeile darüber). Zustände aus Konfigurationszeiten (Europe/Berlin): erreichbar · nacht (nur wenn Nachtdienst konfiguriert, mit Hinweis „Zuschlag laut Preisliste“) · außerhalb (Nummer weiter sichtbar + „Per E-Mail anfragen“) · ohne JS (statische Nummer und Zeiten) · platzhalter (Schraffur, „[Telefon fehlt]“). Kein Pulsieren.
- Kopf: mobil 56 px, nicht klebend, Wortmarke + Suche; Desktop klebend 72 px, Wortmarke · Offenlegungs-Navigation (Buttons mit `aria-expanded`, keine ARIA-`menu`-Rolle) · Suche · Rufknopf mit Nummer und Status. Menü mobil = `<dialog>` als Blatt von unten; ohne JS Sprung zur Fußnavigation `#seitennavigation`.
- Fuß: Kontakt (aus Konfiguration) · Leistungen · Einsatzgebiet (Länder) · Betrieb & Recht (Impressum, Datenschutz, Widerruf, Barrierefreiheit, Quellen & Lizenzen, Sitemap). Ganz unten endet die Scherlinie in einem Punkt „Weilburg an der Lahn“.

## K-007 Bewegungssystem und Register
Technik: nur `transform`/`opacity`; CSS `@layer bewegung`; Startzustände nur in `@keyframes` unter `@media (prefers-reduced-motion: no-preference)` mit `animation-fill-mode: backwards` – die Basisregel ist der Endzustand, Inhalte sind ohne Animation sichtbar. Scroll-gebunden über `animation-timeline: view()/scroll()` in `@supports`, Fallback IntersectionObserver nur für Szenen. Linien zeichnen über `scaleX` (gestrichelte Linien über die `scaleX` ihrer Maske), Kurven über verschobene Masken. Der Deckkraft-Keyframe `erscheinen` dient allen reinen Einblendungen (M-05 reduce, M-09, M-18, M-19, M-20). SVG-Teile mit `transform-box: fill-box`. Leitelement: `.scherlinie` mit `view-transition-name: scherlinie`; `@view-transition { navigation: auto; }` nur unter `no-preference`. Budget Bewegungscode ≤ 12 KB gz (hart 60 KB).

| ID | Zweck | Auslöser | Dauer / Kurve | Reduzierte Bewegung |
|---|---|---|---|---|
| M-01 | Rückmeldung | `:focus-visible` | sofort (nicht animiert) | gleich |
| M-02 | Rückmeldung | Hover-Überlagerung (`::before` Deckkraft .10) | feedback / standard | gleich (nur Deckkraft) |
| M-03 | Rückmeldung | `:active` (Knopf, Rufknopf, Wahl, Karten- und Listenlinks) | scale .98, sofort ohne Übergang: der Druck folgt dem Finger (Abschluss-Nachprüfung) | nur Überlagerung |
| M-04 | Orientierung | Rufleisten-Status | keine Animation (bewusst, P2) | – |
| M-05 | Zustand | Navigations-Panel (Aufklapper-Pfeil dreht mit); Gruppenfilter /leistungen/ (nach einem Wechsel eingeblendete Gruppen) | Deckkraft + Y −8px, zustand / zustand-aus | Deckkraft, feedback |
| M-06 | Zustand | Menü-Blatt (`@starting-style`; Ausgang über `display`/`overlay` mit `allow-discrete`) | Y 100%→0, zustand (300ms) ein / 240ms aus; Hintergrund Deckkraft | Deckkraft 150ms ein / 120ms aus |
| M-07 | Zustand | FAQ öffnen; Anliegen-Wahl im Composer (Notfall- und Mail-Zweig, nur nach einer Wahl, nie beim Laden) | Inhalt Deckkraft + Y −4px, zustand; Chevron dreht | sofort (auch der Chevron) |
| M-08 | Rückmeldung | Combobox-Liste | Deckkraft + Y −4px, feedback | sofort |
| M-09 | Rückmeldung | Feldfehler / Fehlerübersicht; Composer-Hinweis „ohne Adresse“ | Deckkraft, feedback; kein Schütteln | sofort |
| M-10 | Rückmeldung | Ladeanzeige (einzige Endlos-Animation, nur während Laden, erst nach 300ms) | Drehung 900ms linear | statisches Icon + Text |
| M-11 | – | entfällt: keine Erfolgsmeldung (PLAN Kontakt; der Composer öffnet nur das Mailprogramm) | – | – |
| M-12 | Rückmeldung | Ergebnis Rechner/PLZ-Prüfung; Trefferliste der Suche; Betreff im Composer nach der Anliegen-Wahl | Deckkraft .6→1, feedback; nie hochzählen | sofort |
| M-13 | Hierarchie | Abschnittsauftritt (V01; die übrigen Erzählansichten tragen ihre großen Momente M-17, M-18, M-20; Überschriften und Figuren, nie Fließtext) | Y 24px + Deckkraft; H2 am Zeitstrahl des Abschnittskopfs entry 10–80 %, Figuren view() entry 0–30 %, ein | keiner |
| M-14 | Orientierung | Linie am Abschnittskopf; Linie des Ablaufs (V01); Linie am angesprungenen A–Z-Kopf (`:target`, V06); Kupferstrich der Ratgeber-Inhaltsschiene am aktuellen Abschnitt (`aria-current`, V08) | scaleX .2→1, Zeitstrahl des Abschnittskopfs entry 0–60 % (Ablauf: view(); `:target`: einmal beim Sprung; Inhaltsschiene: Übergang zustand, linie, Ausgang zustand-aus) | statisch bei 1 (Inhaltsschiene springt) |
| M-15 | Zusammenhang | Seitenwechsel (View Transition); gemeinsames Element ist die Kopflinie `.scherlinie-leit` (genau eine je Seite); der Opt-in steht beim Einfügen von `<body>` fest, dafür wartet das Kopf-Skript auf die Stylesheets (D-E5-03) | Wurzel aus 160 / ein 240; Gruppe `scherlinie` 400 standard; Rufleiste und Kopf stehen | keiner |
| M-16 | **Großer Moment Start: „Scherlinie“** | Laden | Schlüssel X −40%→0 420 ein; 5 Stiftpaare auf die Scherlinie 360 einrasten, Staffel 70, Federn stauchen mit (scaleY); Linie scaleX 480 linie ab 900ms; gesamt ≤ 1.400ms. H1, Ortsprüfung, Anruf nie animiert. Knopf „Ablauf noch einmal ansehen“ startet neu. | Endzustand statisch |
| M-17 | **Großer Moment Leistungsgruppe: Szene** | Scrollen (Schritt in Viewport-Mitte) | Figur `[data-schritt=n]`, Teile 360 standard; mit ihr zieht die Kupferlinie des Schritts und sein Eintrag in der Stückliste (scale, gleiche Dauer); Notöffnung „Stift für Stift“, Einbruchschutz „Tür-Schichten“, Sicherheitstechnik „Grundriss-Zonen“, Einbau & Tresore „Widerstandsstufen“ | nicht klebend; kleine statische Einzelbilder |
| M-18 | **Großer Moment Einsatzgebiet: „Ringe um Weilburg“** | view() | Rasterkarte scale .42→1 + Deckkraft, Ringe scale .6→1 + Deckkraft (der Kupferring am Sitz mit ihnen), Staffel über gestaffelte view()-Bereiche; Namen blenden mit ihren Punkten ein; auf V05 am Zeitstrahl der ganzen Karte: Kupferpunkt Weilburg rastet ein (scale 0→1, einrasten), dann zieht die Kupfer-Messlinie vom Sitz zum äußeren Ring (scaleY), die Ringmaße erscheinen, sobald die Linie sie erreicht | statisches Endbild |
| M-19 | Zusammenhang | Ortsseite geladen (Lagekarte, K-04) | Linie auf Peilung gedreht (SVG-`transform`-Attribut); gezogen wird ihre Maske (`.lk-zug` im clipPath) scaleX 0→1 480 linie, damit das Strichmuster nicht staucht; km-Beschriftung blendet ein | sofort |
| M-20 | **Großer Moment Über uns: „Der gerade Weg“** | Laden (Figur im Seitenkopf, wie M-16), gesamt ≤ 1.400 ms | Fluss im Bogen (Auftritt 640), dann Tunnel-Linie scaleX über den Bogen (480, linie); Tor und Beschriftung „Schiffstunnel“ blenden ein (150) | statisch |
| M-21 | Charakter | 404 | Stifte wackeln 3× (Y ±3 px am Bildschirm, gesamt 600 ms; jeder zweite Stift gegenläufig; der Weg in SVG-Einheiten wird durch den Figurmaßstab geteilt, Rückfall ohne Containermaß auf feste Einheiten), Linienhälften X ±4 px | statischer gebrochener Zustand mit sichtbarer Lücke |
Nichts läuft automatisch länger als 5 s → kein Pause-Knopf nötig. Nichts blinkt.

## K-008 SVG-Formsystem „Linie & Bogen“
- Icons: Raster 24×24, aktive Fläche 2–22; Formgrundlagen Kreis Ø20, Quadrat 18, quer 20×16, hoch 16×20; Strich 1.5, `stroke-linecap/linejoin: round`; Eckradius 2 (unter 8 Einheiten: 1); nur 0°/45°/90° plus Bögen mit ganzzahligen Radien; Mindestabstand 2; Füllung nur für 1-Einheiten-Punkte; einfarbig `currentColor`; Größen 20 (im Text) / 24 (UI) / 32 und 48 (Leistungen). Einbindung als inline `<symbol>` je Seite (nur benutzte), `<use href="#i-name">`. Dekorativ `aria-hidden="true" focusable="false"`; alleinstehend `role="img"` + `<title>`.
- Icon-Vertrag (Namen): tuer, tuer-offen, auto, garage, tresor, schluessel, schluessel-abgebrochen, zylinder, einsteckschloss, kastenschloss, schliessanlage, schutzbeschlag, schliessblech, querriegel, pilzkopf, bandsicherung, fenster, fenstersicherung, tuerschliesser, sicherheitstuer, einbruchschaden, alarmzentrale, kamera, nebel, rauchmelder, bewegungsmelder, sirene, wertschrank, datenschrank, waffenschrank, telefon, telefon-nacht, rueckruf, uhr, mond, sonne, menue, schliessen, pfeil-rechts, chevron, suche, standort, entfernung, euro, rechnung, zahlung-karte, bar, info, warnung, haken, fehler, laden, extern, mail, drucken, ratgeber.
- Illustrationen: Raster 8, Strich 2, Linien `--c-tinte`, Flächen `--c-papier-2` (flach), Schnittflächen 45°-Schraffur (Abstand 4), Kupfer nur für Scherlinie und aktiven Zustand; inline SVG; animierbare Teile als eigene `<g>` mit eindeutigen IDs je Seite. I-01 Zylinder-Schnitt · I-02 Zylinder-Front · I-03 Tür-Schichten · I-04 Grundriss mit Melderzonen · I-05 Widerstandsstufen · I-06 Tür · I-07 Auto · I-08 Garage · I-09 Tresor · I-10 Rasterkarte (GeoNames-Punkte, äquirektangulär um Weilburg, 6er-Raster, ein Pfad je Ebene und Schriftstufe, Ringe 20/50/100 km; Punkte unter der Schrift ausgespart, Ringmaße in Mono an einer Kupfer-Messlinie) · I-11 Lahnbogen und Tunnel (stilisiert) · I-12 404-Schlüssel · I-13 Schadensbilder (drei Szenen).
- Muster: Scherlinien-Trenner · Schnittschraffur 12 % · Messraster (1-px-Punkte, Abstand 8, 10 %) · Bartprofil (gestufte Kante, 12 px, höchstens einmal je Seite). Ausdrücklich nicht: Karos, Verläufe, Leuchten.
- Positionen (Kartennadel, Peilung) nur über SVG-Attribute (`cx`, `cy`, `transform`), nie über `style`.

## K-009 Komponenten, Zustände, Ansichtsarten
- Basiszustände jedes Bedienelements: Ruhe · Hover (Überlagerung .10) · Fokus (Kupferring) · gedrückt (scale .98 + .18) · deaktiviert (`aria-disabled` + Grund im Text, bleibt fokussierbar) · lädt (`aria-busy`, feste Mindestbreite) · Fehler · Erfolg. Trefferflächen ≥ 44 px, auf `pointer: coarse` ≥ 48 px.
- Komponenten: Schaltfläche (primär Lahn / sekundär Rahmen 1.5px / still) · Rufknopf (`<a href="tel:+49…">`, Icon + Beschriftung + Nummer; Zustände der Rufleiste) · Preistabelle (`<table>` mit `caption`, Zeitfenster-Spalten, `th scope`, Tabellenziffern; unter 34em Containerbreite `dl`-Blöcke; Spaltenmarke „jetzt gültig“ per JS; Platzhalterzelle) · Preisrechner (Fieldsets Leistung / Zeitpunkt / Ort / Extras; Ergebnis `<output aria-live="polite">` mit Aufschlüsselung und Gesamtpreis; leerer Zustand „Berechnung erst mit Preisliste möglich“; ohne JS statische Tabelle) · FAQ (`<details>/<summary>`, Zusammenfassung ≥ 48 px, beim Drucken offen) · Ortssuche (ARIA-1.2-Combobox: `role=combobox`, `aria-autocomplete=list`, `aria-expanded`, `aria-controls`, `aria-activedescendant`; Optionen `role=option` als Links; Tasten ↓↑ Enter Esc Alt+↓; Name, Wortanfang oder PLZ; Zustände leer / zu kurz / lädt / Treffer (≤ 8, „8 von 23“) / keine Treffer / Fehler / gewählt; Modi navigieren und prüfen (Zonen-Ergebnis); ohne JS Feld verborgen, Link „Alle Orte A–Z“) · Brotkrumen (`nav > ol`, `aria-current="page"`, mobil nur „← Elternseite“) · Karten (bewusst nicht uniform: Registereintrag, großer Teaser mit Illustration, dichte Ortskachel, Hinweis; ein gestreckter Link je Karte) · Hinweis (info / warnung / fehler / erfolg / platzhalter / verifizieren; 4-px-Randbalken) · Kontakt-Composer (Anliegen → Felder → `mailto:`; „Notfall jetzt“ zeigt das Ruf-Panel; Fehlerübersicht mit Fokus; Absenden nie deaktiviert) · A–Z-Verzeichnis (Buchstabenleiste ab 64em klebend unter dem Kopf, darunter statisch und umbrochen mit Zielen ≥ 48 px und „A–Z“-Rücksprung je Gruppe; leere Buchstaben als Text, CSS-Spalten 16em, Namensdoppel mit Kreis) · Leerzustände · 404 („Dieser Schlüssel passt nicht.“) · Platzhalter-/VERIFIZIEREN-Stil (nur Vorschau-Builds sichtbar markiert; Release verweigert).
- Ansichtsarten: Erzählansichten V01, V02, V05, V09 (dürfen inszenieren, je ein großer Moment) · Arbeitsansichten V03, V04, V06, V07, V08, V10, V11, V12 (nur Rückmeldung und Zustandswechsel).

## K-010 Ton und Mikrotexte
- Sie-Anrede; „wir“ = der Betrieb. Aktiv, Sätze ≤ 20 Wörter, konkrete Schritte. Knöpfe sagen, was passiert („Jetzt anrufen“, „E-Mail vorbereiten“, „Ort prüfen“).
- Verboten ohne Beleg in der Konfiguration: Minutenangaben zur Anfahrt, „24/7“/„rund um die Uhr“, „Festpreis“ (nur wenn Preise final), „garantiert schadensfrei“, „seit X Jahren“, „Meisterbetrieb“, „zertifiziert“, „Nr. 1“, „bester“, „günstigster“, „kostenlos“, jede Bewertungs- oder Sterneangabe, jede Vor-Ort-/Niederlassungs-Behauptung außerhalb Weilburgs, Marken-/Produktnamen (außer `marken.mjs`), „polizeilich empfohlen“, „VdS“.
- Floskeln vermeiden: „kompetent und zuverlässig“, „Ihr Partner in Sachen“, „Keine Panik“, „Handschlagqualität“, „nahtlos“, „innovativ“, „ganzheitlich“, „Entdecken Sie …“, Slogans der Wettbewerber.
- Rechtschreibung: Duden, neue Rechtschreibung; Gedankenstrich „ – “; „…“-Anführungszeichen; geschütztes Leerzeichen vor € und km; „1.234,50 €“; „18–22 Uhr“; Telefonnummern im Format der Konfiguration.
- Geschlechtergerecht durch neutrale Wörter („Fachkraft“, „Team“), keine Sonderzeichen (ANNAHME).
- Ortsseiten: kein Spinning, keine Zufallsvarianten; Varianz nur aus Daten und Zone. Zone C/D/NL: Titel/H1/Meta nennen Sitz und Entfernung.

## K-011 Budgets
- LCP ≤ 2,5 s · CLS ≤ 0,1 · INP ≤ 200 ms (4× Drosselung) · Lighthouse mobil Perf ≥ 95, A11y/BP/SEO 100 (im Messbuild).
- Bewegungscode ≤ 12 KB gz (hart 60 KB) · JS je Seite (Bündel der genutzten Module, D-JS-01) ≤ 16 KB gz · CSS ≤ 14 KB gz je Seite (gemeinsames Bündel `app.css` aus `komponenten/` plus die Ansichts-Stile der Seite aus `ansichten/<name>/`, Angabe `stile: […]` im Seitenobjekt; Prüfer `budgets/css-seite`, `budgets/stil-fehlt`; Druck- und Kontrastregeln im gemeinsamen Bündel zählen dort nicht als gemeinsame Stile) · Sonderstile als eigene Dateien, nicht renderblockierend und nicht in der Summe je Seite: Druck `druck.*.css` mit `media="print"` ≤ 3 KB gz (`budgets/css-druck`), erzwungene Farben `kontrast.*.css` mit `media="(forced-colors: active)"` ≤ 3 KB gz (`budgets/css-sonder`) · Schriften vorgeladen ≤ 1 Datei, gesamt ≤ 75 KB · Ortsseiten-HTML ≤ 30 KB roh · Orts-Index ≤ 80 KB gz, PLZ-Index ≤ 50 KB gz (laden erst bei Fokus).
- Große Momente: ≤ 5 % verworfene Bilder bei 4× Drosselung (Ersatzmessung headless, UMGEBUNGSAUSNAHME für echte Geräte).
- Build: ganzer Lauf ≤ 60 s, Stichprobe ≤ 5 s (ohne `--vorkomprimieren`; dieser Release-Schritt kostet kalt zusätzlich ≈ 1–1,5 min, warm ≈ 5 s – ENTSCHEIDUNGEN D-K05-01).

## K-012 Glossar
- **Scherlinie**: Trennfuge zwischen Kern und Gehäuse eines Zylinders; Leitelement der Gestaltung.
- **Zone A/B/C/D/NL**: Entfernungs- und Leistungsstufen ab Weilburg (Konfiguration `zonen.mjs`).
- **Platzhalter**: fehlender Konfigurationswert, sichtbar markiert, sperrt den Release.
- **VERIFIZIEREN**: ungeprüfter Fakt mit Quellenangabe, sperrt den Release.
- **Vorschau-/Mess-/Release-Build**: siehe Plan, Abschnitt Architektur.
- **Themenpass**: Steckbrief je Inhaltsseite (Hauptsuchbegriff, Absicht, Pflichtabschnitte, Abgrenzung, FAQ, Faktenblatt).
- **Hub**: Übersichtsseite je Land oder Kreis.

## Markierte Annahmen
- A1 Tunnel-Fakt (K-001) · A2 Ersatzschrift-Metriken gegen Arial/Liberation gemessen, Android-Roboto weicht ab (CLS-Test) · A3 Zeiten, Nachtdienst, Zonentexte aus Konfiguration · A4 kein Formular-Endpunkt (nur `mailto:`) · A5 keine eigenen Fotos → keine Fotoplätze · A6 Browser ohne `light-dark()` erhalten das helle Thema · A7 GeoNames-Punkte reichen für die Rasterkarte · A8 Firmenname ≤ 28 Zeichen, länger → kleinere Wortmarkenstufe · A9 Marke/Zielgruppe abgeleitet (K-002).

## Verlauf
- v1 (2026-10-25): Erstfassung aus genehmigtem Plan, Design-Panel und Kritik-Panel.
