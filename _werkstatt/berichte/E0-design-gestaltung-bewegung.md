> **Vermerk:** Dieser Bericht entstand in der Planungsphase. Wo er vom genehmigten Plan (`_werkstatt/PLAN-GENEHMIGT.md`) abweicht, ist er **überholt durch PLAN**. Liste der überholten Punkte: `_werkstatt/ENTSCHEIDUNGEN.md` → „Überholte Panel-Punkte“.

# Design system "Scherlinie" (Leitidee + visual design, UX, motion and SVG)

Nothing in the repo is code; it holds competitor scrapes only. Richter uses yellow, the "Karos" chequer and a Revolution slider. Adam uses #FFC229, #0495B9 and Roboto Condensed. None of these appear below. I checked the font facts against the registry: `@fontsource-variable/atkinson-hyperlegible-next@5.3.0` and `@fontsource-variable/atkinson-hyperlegible-mono@5.3.0` (both OFL-1.1). I read their metrics from the woff2 files. Every contrast ratio below was calculated, not estimated.

## 1. Leitidee and principles

**Leitidee:** *"Wie der Weilburger Schiffstunnel den Lahnbogen auf gerader Linie durchquert, suchen wir in jedem Schloss die eine Linie, auf der es ohne Gewalt aufgeht – ruhig im Ton, präzise im Handwerk, offen im Preis."*

- **The line** is the shear line of the pin-tumbler cylinder and the tunnel through the loop. It is the only ornament and also the continuous lead element.
- **Ruhig** gives a slate and Lahn-green palette, no alarm red, and a dark theme as good as the light one.
- **Präzise** gives the 24-grid icons, tabular figures and small radii.
- **Offen** puts prices before the service pitch and shows placeholders openly.
- **Swap test:** Adam (Hochheim, Rhein-Main) and Richter (nationwide, yellow) cannot claim the Lahn loop or the tunnel.
- **Signet:** an open arc (the loop, which is also a key bow) with a straight line through its neck that runs on as a key shaft with two bit notches. It does not depend on the brand name.
- ANNAHME: the tunnel cuts through the neck of the Lahn loop around the old town. Check this before it appears in copy. The graphic is always labelled "stilisiert".

| # | Principle | Do | Don't |
|---|---|---|---|
| P1 | **Eine Linie führt** | A 2px copper line links heading, figure, call to action and the next page. | No second accent colour, no gradients, no lines that lead nowhere. |
| P2 | **Ruhe ist die Dienstleistung** | One focal point per screen height, plain verbs, plenty of space. | No pulsing dots, countdowns, "nur heute", exclamation marks or red call buttons. |
| P3 | **Offen vor überzeugend** | Show time windows, surcharges and zones first. Unknowns are visibly marked. Facts name their source. | No bare "ab" hooks, no invented numbers, reviews or badges, no count-ups. |
| P4 | **Präzision im Detail** | Grid-true icons, `tnum`, 4px radii, a text measure of 32em. | No blobs, glass, glows, mixed icon styles or centred body text. |
| P5 | **Daumen zuerst, Nacht mitgedacht** | Call is one tap at the bottom. Targets are ≥48px. Availability status is honest. | No call hidden in a hamburger menu, no bars that hide on scroll, no tiny phone icon. |
| P6 | **Erzählen beim Planen, arbeiten bei Eile** | Motion and scenes appear only in narrative views. Working views stay static and dense. | No animated tables, forms or legal text. Content is never delayed. |
| P7 | **Ort mit Maß** | Weilburg appears in the signet, the footer and "Über uns". Distances are measured from Weilburg. | Never "Ihr Schlüsseldienst vor Ort in X", no skyline clip art, no fake addresses. |

## 2. Tokens (`token.css`, `@layer token`)

**Naming scheme:** `--{category}-{role}[-{step}]`. Categories are `c` (colour), `fs`, `lh`, `fw`, `sp`, `r`, `sh`, `dur`, `ease`, `z`.

**Theming:** every colour is written as `light-dark(L, D)`. The root has `color-scheme: light dark`, and `[data-theme=hell|dunkel]` overrides it. Dark bands inside light pages set `color-scheme: dark` locally, so every token flips automatically. This matters because light copper on ink is only 2.89:1.

### Colours

| Token | Light | Dark | Use | Contrast L / D |
|---|---|---|---|---|
| `--c-papier` | #F4F2ED | #0E161B | Page background | – |
| `--c-papier-2` | #EAE6DE | #131E24 | Bands | – |
| `--c-flaeche` | #FFFFFF | #18252C | Inputs, sheets, Rufleiste | – |
| `--c-tinte` | #13202A | #EDEAE3 | Text | 14.81 / 15.21 (on Fläche 16.57 / 13.05) |
| `--c-tinte-2` | #3E4B55 | #BCC4C8 | Secondary text | 8.01 / 10.33 |
| `--c-tinte-3` | #5A6670 | #97A1A7 | Meta | 5.26 / 6.94; on Papier-2 4.73 / 6.43 |
| `--c-linie` | #D3CEC4 | #26343C | Decorative hairlines (no contrast duty) | – |
| `--c-linie-ui` | #76828B | #6E7C85 | Control borders | Papier 3.52 / 4.25, Fläche 3.94 / 3.65, Papier-2 3.16 |
| `--c-lahn` | #1C5A4F | #7BCDB6 | Primary and call button background | – |
| `--c-auf-lahn` | #FFFFFF | #0E161B | Text on Lahn | 8.00 / 9.79 |
| `--c-lahn-text` | #1C5A4F | #86D3BE | Links | 7.15 / 10.51 |
| `--c-lahn-hell` | #DCEBE5 | #17322D | Info tint | Tinte on it 13.46 / 11.42 |
| `--c-kupfer` (= `--c-fokus`) | #A84A22 | #E8956B | Scherlinie, focus ring, accent text | Papier 5.12 / 7.78, Papier-2 4.60 / 7.22 |
| `--c-kupfer-hell` | #F6E3D8 | #3A2419 | Placeholder background | Kupfer on it 4.61 / 6.18 |

Status colours (text on its tinted background):

| Status | Text L / D | Background L / D | Contrast L / D |
|---|---|---|---|
| fehler | #B42318 / #FF8A80 | #FDECEA / #3B1714 | 5.75 / 6.98 |
| warnung | #8A5300 / #F2C26B | #FDF1DC / #33270F | 5.66 / 8.84 |
| erfolg | #1E6B3A / #7FD3A0 | #E3F1E7 / #12291B | 5.59 / 8.63 |

The focus ring is 3px copper at a 3px offset, so it always sits on Papier. Copper against Lahn is only 1.40:1, so the ring must never sit directly on Lahn. In forced-colors mode the ring uses `outline: Highlight`.

### Fonts (OFL, self-hosted, 3 files, about 71 KB)

- **Atkinson Hyperlegible Next Variable**
  - `latin-wght-normal` (34.0 KB, preloaded, `swap`).
  - `latin-ext-wght-normal` (19.1 KB, loaded only through `unicode-range`).
  - Why: the font was built for low vision. It clearly separates 0/O and I/l/1, which matters for phone numbers, PLZ and prices read under stress at night. It has `tnum` and `frac` (I checked the GSUB table).
- **Atkinson Hyperlegible Mono Variable**, `latin-wght-normal` (17.8 KB, `swap`, not preloaded).
  - Used only for technical labels (RC2, PLZ input, standard codes).
  - It shares the exact vertical metrics of Next, so mixing the two inline never shifts the line.
- **No italics.** Set `font-synthesis: none`; emphasis is shown with weight.
- **Measured metrics** (upm 1000): ascent 984, descent −316, gap 0, x-height 496, cap height 668.
- **Fallback widths**, measured on a German reference sentence:
  - Next is 95.18em against Liberation Sans (Arial metrics) at 96.22em.
  - Mono is 133.35em against Liberation Mono at 126.62em.

```css
@font-face{font-family:"AHN Ersatz";src:local("Arial"),local("ArialMT"),local("Liberation Sans"),local("Arimo");
  size-adjust:98.9%;ascent-override:99.5%;descent-override:32%;line-gap-override:0%}
@font-face{font-family:"AHM Ersatz";src:local("Courier New"),local("Liberation Mono"),local("Cousine");
  size-adjust:105.3%;ascent-override:93.4%;descent-override:30%;line-gap-override:0%}
--ff-text:"Atkinson Hyperlegible Next Variable","AHN Ersatz",system-ui,sans-serif;
--ff-mono:"Atkinson Hyperlegible Mono Variable","AHM Ersatz",ui-monospace,monospace;
```

**Never set the text measure in `ch`.** In this font the digit "0" is 0.648em wide while the average letter is 0.451em, so 65ch would give about 93 characters. Use `--mass: 32em`, which gives about 71 characters.

### Type scale

Fluid from 320px to 1280px viewport. The rem part keeps zoom working.

| Token | px (320 → 1280) | Value |
|---|---|---|
| `--fs--1` | 14 → 15 | `clamp(.875rem,.8542rem + .1042vw,.9375rem)` |
| `--fs-0` (body) | 17 → 19 | `clamp(1.0625rem,1.0208rem + .2083vw,1.1875rem)` |
| `--fs-1` | 19.5 → 23 | `clamp(1.2188rem,1.1458rem + .3646vw,1.4375rem)` |
| `--fs-2` | 22.5 → 29 | `clamp(1.4063rem,1.2708rem + .6771vw,1.8125rem)` |
| `--fs-3` | 26 → 37 | `clamp(1.625rem,1.3958rem + 1.1458vw,2.3125rem)` |
| `--fs-4` | 30 → 47 | `clamp(1.875rem,1.5208rem + 1.7708vw,2.9375rem)` |
| `--fs-5` (hero only) | 35 → 60 | `clamp(2.1875rem,1.6667rem + 2.6042vw,3.75rem)` |

- **Line heights:** `--lh-text: 1.6`, `--lh-dicht: 1.45` (tables, lists), `--lh-titel: 1.15`, `--lh-display: 1.05`.
- **Weights:** `--fw-text: 400`, `--fw-ui: 600`, `--fw-titel: 700`, `--fw-display: 780`.
- **Tracking:** display −0.015em; small-caps labels +0.06em.
- **Hyphenation:** `lang="de"` on the page and `hyphens:auto` on text and headings. Add `hyphenate-limit-chars: 10 4 4`, because "Einbruchschadenbeseitigung" at 35px is about 455px and would overflow a 288px column.
- **Wrapping:** headings use `text-wrap:balance`, paragraphs use `pretty`.
- **Dutch town names:** wrapped in `<span lang="nl">`.

### Spacing, radii, shadows, layers

- **Spacing** (4px base): `--sp-3xs` .25rem, `2xs` .5rem, `xs` .75rem, `s` 1rem, `m` 1.5rem, `l` 2rem, `xl` 3rem, `2xl` 4rem, `3xl` 6rem.
- **Fluid spacing:** `--sp-f-s: clamp(1rem,.8rem+1vw,1.5rem)`, `--sp-f-m: clamp(1.5rem,1rem+2.5vw,3rem)`, `--sp-sektion: clamp(3rem,2rem+5vw,7.5rem)`.
- **Radii:** `--r-0: 0`, `--r-s: 2px` (badges), `--r-m: 4px` (controls, cards), `--r-l: 8px` (popovers), `--r-xl: 16px` (top corners of the bottom sheet), `--r-rund: 999px` (status dots only).
- **Shadows (light):**
  - `--sh-1: 0 1px 0 rgb(19 32 42/.08)`
  - `--sh-2: 0 2px 6px rgb(19 32 42/.10), 0 1px 2px rgb(19 32 42/.08)` (popovers)
  - `--sh-3: 0 12px 32px rgb(19 32 42/.18)` (dialogs)
- **Shadows (dark):** a ring `0 0 0 1px var(--c-linie-ui)` plus `rgb(0 0 0/.5)`.
- **Z-index:** `--z-szene` 10, `--z-kopf` 100, `--z-rufleiste` 200, `--z-popover` 300, `--z-toast` 500, `--z-skip` 600. Dialogs use the top layer.

### Motion tokens

- **Durations:**
  - `--dur-feedback: 140ms` and `--dur-feedback-aus: 100ms`
  - `--dur-zustand: 280ms` and `--dur-zustand-aus: 200ms`
  - `--dur-auftritt: 640ms` and `--dur-auftritt-lang: 880ms`
  - `--dur-moment-max: 1400ms`
  - `--stagger: 60ms` (at most 8 items, so at most 420ms)
- **Easings:**
  - `--ease-standard: cubic-bezier(.2,0,0,1)`
  - `--ease-ein: cubic-bezier(.16,1,.3,1)`
  - `--ease-aus: cubic-bezier(.3,0,.8,.15)`
  - `--ease-linie: cubic-bezier(.65,0,.35,1)`
  - `--ease-einrasten: linear(0,.36 12%,.78 26%,1.04 40%,1.07 48%,1.02 60%,.995 74%,1)`, with fallback `cubic-bezier(.34,1.3,.64,1)`. This is the pin "click into place" and is the only overshoot in the system.
- **Breakpoints** (em, literal values in media queries; components use container queries):
  - 30em (480px), 48em (768px), 64em (1024px, desktop nav), 80em (1280px).
  - Plus `(pointer:coarse)` (list rows 44px instead of 32px) and `(hover:hover)` (hover effects).

## 3. Layout and composition

**Page grid** with named lines:

```
[voll] minmax(var(--rand),1fr) [breit] minmax(0,6rem) [inhalt] min(100% - 2*var(--rand),72rem) [/inhalt] … [/breit] … [/voll]
```

- `--rand: clamp(1rem,.5rem+2.5vw,2.5rem)`.
- From 64em, the content area uses a 12-column subgrid with gap `clamp(1rem,.5rem+1.5vw,2rem)`.
- Standard splits:
  - 7/5: hero.
  - 5/7: scene (steps and sticky figure).
  - 3/9: A–Z lists.
  - 8/4: article with aside.
- Running text is always ≤ `--mass`.

**Mobile is composed separately, not a stacked desktop:**
- The hero H1 sits top-left. A cropped 3-pin cylinder band (≤120px tall) sits under the H1. Its line runs off to the right edge. The Ortsprüfung field follows within the first screen.
- Price tables become one definition block per service.
- Scenes use a sticky mini figure (≤32svh) only when `(min-height:640px)`. Otherwise each step gets its own small static figure.
- Footer link groups become `<details>`.

**Rufleiste** (mobile below 64em; persistent; never hides):
- Layout: `position:fixed; bottom:0`, background `--c-flaeche`, top border `--c-linie-ui`, padding `env(safe-area-inset-bottom)`. The body gets matching bottom padding.
- Content: `[≡ Menü 64×56]` and `[☎ Anrufen · 06471 …]`. The call takes the remaining width at 56px tall, shows the number in `tnum`, and has a status line at `--fs--1` above the number.
- States are computed from the config hours with `Intl.DateTimeFormat` in Europe/Berlin:
  - **besetzt:** "Erreichbar laut Zeiten Mo–Fr 7–18".
  - **nacht:** moon icon, "Nachtnotdienst · Zuschlag laut Preisliste" (links to the price list). Only shown if the config allows night service.
  - **außerhalb:** a secondary button "Rückruf anfordern", and the number still shown as text.
  - **ohne-JS:** static number and hours.
  - **platzhalter:** hatched, "[Telefon fehlt]"; the strict build fails.
- No pulsing dot (the motion register records this as deliberate).
- `view-transition-name: rufleiste` keeps the bar still across navigations.

**Header:**
- Mobile: 56px, not sticky, wordmark and search only.
- Desktop: sticky, 72px. Wordmark; then disclosure navigation (buttons with `aria-expanded`, no ARIA `menu` role): Leistungen ▾ (4 columns), Preise, Einsatzgebiet, Ratgeber, Über uns; then a search button; then the call button with number and status.
- The bottom hairline fades in with `animation-timeline: scroll()`, so no JS is needed.

**Menü** opens a `<dialog>` bottom sheet. Without JS it is a plain link to `#seitennavigation` in the footer.

**Wordmark slot:** signet plus `{firma.name}` in Next 780. A container query steps the size down when the name exceeds 22 characters.

**Footer:** four zones.
1. Contact details from config: Weilburg address, hours, night availability.
2. Leistungen.
3. Einsatzgebiet (Bundesländer and A–Z).
4. Company and legal: Impressum, Datenschutz, Barrierefreiheit, "Quellen & Lizenzen" (GeoNames CC BY 4.0, OFL fonts).

At the bottom, the Scherlinie ends in a dot labelled "Weilburg an der Lahn". Next to it sit a theme switch (System/Hell/Dunkel radiogroup), an optional "Bewegung reduzieren" switch, and "Stand {build date}".

## 4. Components and states

Every interactive element has these base states:
- **Rest.**
- **Hover:** a `::before` overlay at opacity .10. This keeps hover on opacity only.
- **Focus-visible:** the copper ring.
- **Active:** `scale(.98)` plus overlay .18.
- **Disabled:** `aria-disabled` with the reason in text, so it stays focusable.
- **Loading:** `aria-busy`, a fixed `min-inline-size` (no layout shift), label "Wird gesendet …".
- **Error and success** as listed per component.

Hit areas are ≥44px; ≥48px on `pointer:coarse`.

| Component | Key structure | Extra states |
|---|---|---|
| **Schaltfläche** | Variants primär (Lahn), sekundär (1.5px `--c-linie-ui`), still. Sizes 48px and 40px (with an enlarged hit area). | – |
| **Rufknopf** | `<a href="tel:+49…">` with icon, label and number. On desktop also "Nummer kopieren". | Rufleiste states; kopiert (`aria-live`); platzhalter. |
| **Preistabelle** | `<table>` with caption; columns from config time windows; `th scope=row`; `tnum`. Below 34em container width each row becomes a `dl` block. | Column badge "jetzt gültig" (JS). Platzhalter cell: copper dashed box, hatch, "Preis folgt", `data-platzhalter="preis.x"` (strict build refuses). VAT note. Print styles. |
| **Preisrechner** | Fieldsets: Leistung (radio list), Zeitpunkt (jetzt or date+time, mapped to a time window), Ort (combobox, mapped to zone), Extras. The result is an `<output>` with a breakdown and `aria-live=polite`. | No count-up; the number briefly fades from 0.6 to 1. Disclaimer "Festpreis am Telefon vor Beginn". If any price is a placeholder: empty state "Berechnung erst mit Preisliste möglich". Without JS: static table. |
| **FAQ** | `<details>/<summary>`, summary ≥48px, chevron rotates. Not an exclusive accordion. | All open when printing. |
| **Ortssuche** | ARIA 1.2 combobox: `role=combobox`, `aria-autocomplete=list`, `aria-expanded`, `aria-controls`, `aria-activedescendant`; options `role=option`. Keys: ↓↑, Enter, Esc, Alt+↓. Accepts a name or PLZ. Data: prefix shards (`/daten/orte/{2 chars}.json`, `/daten/plz/{2 digits}.json`) loaded after 2 characters. Matching ignores diacritics (ü=ue, ß=ss, "St."=Sankt). Each option shows name, Kreis/Land, PLZ and km from Weilburg. | leer, zu kurz, lädt (spinner only after 300ms), Treffer (max 8, live count "8 von 23"), keine Treffer (empty state with A–Z link), Fehler (falls back to A–Z), gewählt. Two modes: *navigieren* or *prüfen* (hero/PLZ check: result panel with zone A ≤25 km, B ≤50, C ≤100, D >100 km Luftlinie, honest zone text, Anfahrt placeholder, link). Without JS the field stays `hidden` and an "Alle Orte A–Z" link is always shown. |
| **Brotkrumen** | `nav` > `ol`, separators drawn in CSS, `aria-current=page`. Mobile shows only "← Elternseite". | – |
| **Karten** (deliberately not uniform) | Register entry (number, title, sub-list), large teaser with illustration, dense place tile, notice. One stretched link per card, never nested links. | Hover: illustration moves 4px and the line runs to full width. Focus ring via `:focus-within`. |
| **Hinweis** | Variants info, warnung, fehler, erfolg, platzhalter. 4px left bar, tinted background, icon, title. | `role=status` for dynamic info/success, `role=alert` for dynamic errors, no role when static. Never auto-dismissed. |
| **Kontakt-Composer** | 1) Anliegen. "Notfall jetzt" swaps the form for a call panel: "Formulare lesen wir nicht sofort". 2) Fields depend on the Anliegen (Ort combobox, door/cylinder type, preferred date). 3) Kontaktweg, consent, honeypot. One column, labels above, "(Pflicht)" written out, `autocomplete` tokens, debounced character counter. Validation runs on blur after the first edit and on submit: an error summary gets focus and links to fields; `aria-invalid` and `aria-describedby`. Submit is never disabled. | sendet, Erfolg, Netzwerkfehler. On network error, offer "Als E-Mail öffnen" (prefilled `mailto:`). ANNAHME: the form endpoint is unknown because hosting is unknown. |
| **A–Z-Verzeichnis** | Sticky letter bar (empty letters are plain text, not links). Sticky letter headings. CSS columns of 16em. Entries with the same name get their Kreis appended. Optional filter field (hides entries, live count). | Rows 44px on coarse pointers, 32px on fine pointers. |
| **Leerzustände** | Suche ohne Treffer: suggestions plus Ortssuche. Bewertungen: not rendered unless real data exists in config. Team and Stellen: honest text. | – |
| **404** | "Dieser Schlüssel passt nicht." Misaligned pins, broken line. Ortssuche, Suche, top links; Rufleiste stays. | – |
| **Platzhalter** | Visible in preview builds only. Copper hatch at 35% plus the `data-platzhalter` key. | – |

**Placeholder rule:** brand name, phone, email, address, legal data and prices all come from one config file. A config value that is still a placeholder is shown with the platzhalter style, and the strict build refuses a release while any remain.

**Town page blocks:**
1. Kopf: H1 plus a facts line (Kreis, Land, PLZ, "{n} km Luftlinie von Weilburg").
2. Zone block, varying by zone A–D, with text from config. No arrival-time claims.
3. Compact service list.
4. Price excerpt with the zone's Anfahrt row.
5. Place facts from GeoNames, plus the 6 nearest places as links.
6. Mini-map: a shared raster SVG `<use>` plus the pin position as CSS variables. No Google Maps.
7. Local FAQ.
8. Source: GeoNames CC BY 4.0.

## 5. SVG form system ("Linie & Bogen")

**Icons:**
- 24×24 grid, live area 2–22. Keyline shapes: circle Ø20, square 18, landscape 20×16, portrait 16×20.
- Stroke 1.5 with round caps and joins. Corner radius 2 (1 below 8 units).
- Angles only 0°, 45° and 90°, plus arcs with integer radii. Minimum gap between strokes is 2. Fill only for 1-unit dots (keyholes, status).
- Monochrome `currentColor`, served as a sprite (`<use href="/i.svg#…">`, optimised with svgo).
- Sizes 20 (inline), 24 (UI), 32/48 (services). Decorative icons get `aria-hidden="true"`; standalone ones get `role=img` plus a `<title>`.

**Icon list (45):**
- Services: tür, tür-offen, auto, garage, tresor, schlüssel, schlüssel-abgebrochen, zylinder, einsteckschloss, kastenschloss, schließanlage, schutzbeschlag, schließblech, querriegel, pilzkopf, bandsicherung, fenster, fenstersicherung, türschließer, sicherheitstür, einbruchschaden, alarmzentrale, kamera, nebel, rauchmelder, bewegungsmelder, sirene, wertschrank, datenschrank, waffenschrank.
- UI: telefon, telefon-nacht, rückruf, uhr, mond, sonne, menü, schließen, pfeil-rechts, chevron, suche, standort, entfernung, euro, rechnung, zahlung-karte, bar, info, warnung, haken, fehler, laden, extern, mail, kopieren, drucken.

**Illustrations:**
- 8-unit grid, stroke 2, lines in `--c-tinte`, planes in `--c-papier-2` (flat, no gradients).
- Cut surfaces use a 45° hatch (spacing 4, from the technical-drawing convention).
- Copper is used only for the Scherlinie and the active state.
- Inline SVG, so the theme applies.
- Animatable parts are separate `<g>` groups with IDs.

| ID | Illustration |
|---|---|
| I-01 | Zylinder-Schnitt (5 pin stacks: key pins, driver pins, springs, plug, housing, key, Scherlinie) |
| I-02 | Zylinder-Front |
| I-03 | Tür-Schichten (exploded: cylinder, Schutzbeschlag, Schließblech, Querriegel, Band) |
| I-04 | Grundriss with sensor zones |
| I-05 | Widerstandsstufen (wall and door cross-section) |
| I-06–09 | Line drawings: Tür, Auto, Garage, Tresor |
| I-10 | Rasterkarte (see below) |
| I-11 | Lahnbogen and tunnel (stylised) |
| I-12 | 404 key |

**Rasterkarte (I-10):**
- Built from GeoNames points projected equirectangularly around Weilburg (`x = Δlon·cos φ0`). Points are snapped to a 6-unit grid and deduplicated.
- Three `<path>` layers: Hessen (admin1 05) darker, rest of Germany, Netherlands.
- Rings at 25/50/100 km are true circles in this projection.
- No border data is needed; the optional outline comes from GeoNames `shapes_simplified_low`.

**Patterns:**
- Scherlinie divider.
- Schnittschraffur at 12% (figure backgrounds and placeholders).
- Messraster (1px dots, 8px spacing, 10%) behind scenes and maps.
- Bartprofil: a stepped edge like key cuts, 12px high, used at most once per page.
- Explicitly not used: chequer patterns, gradients, glow.

## 6. Motion system

**Implementation:**
- `@layer bewegung` in CSS; `bewegung.js` (hero via WAAPI, reduced-motion listener), `szene.js` (scene state), `karte.js`.
- Target ≤12 KB gzipped for all motion code; the hard budget is 60 KB.
- No libraries and no scroll listeners. Scroll-linked effects use `animation-timeline: view()/scroll()` inside `@supports`, with an IntersectionObserver fallback only for the scenes.
- Initial hidden states exist only inside `@supports (animation-timeline:view()) and (prefers-reduced-motion:no-preference)`.
- The hero's start state comes from a hashed inline head snippet that sets `html[data-bewegung=an]` (it fits a strict CSP with a sha256 hash). A 2s watchdog removes the attribute if the animation never starts. The markup itself holds the final state, so content always shows without JS.
- Only `transform` and `opacity` are animated. Lines are drawn with `scaleX`. Curves are revealed with a mask rectangle that is translated.
- **Lead element:** the Scherlinie carries `view-transition-name: scherlinie`. `@view-transition{navigation:auto}` sits inside a no-preference media query, so the line morphs from page to page in Chrome and Safari 18.2+; other browsers simply navigate.

| ID | Purpose | Trigger | Duration / easing | Reduced motion |
|---|---|---|---|---|
| M-01 | Fokus | `:focus-visible` | 0 (not animated) | same |
| M-02 | Feedback | hover overlay | opacity, feedback / standard | same (opacity) |
| M-03 | Feedback | `:active` | scale .98, feedback | overlay only |
| M-04 | Orientierung | Rufleiste status | none; deliberately no pulse | – |
| M-05 | Zustand | nav panel | opacity + Y −8px, zustand in / zustand-aus out | opacity, feedback |
| M-06 | Zustand | bottom sheet (`@starting-style`) | Y 100%→0, 320ms ein / 200ms aus; backdrop opacity | opacity 120ms |
| M-07 | Zustand | FAQ open | content opacity + Y −4px, zustand; chevron rotation | instant |
| M-08 | Feedback | combobox listbox | opacity + Y −4px, feedback | instant |
| M-09 | Feedback | field error / summary | opacity, feedback; no shake | instant |
| M-10 | Feedback | loading spinner (only infinite animation, only while loading) | rotate, 900ms linear | static icon + text |
| M-11 | Feedback | success | opacity + scale .96→1, zustand | instant |
| M-12 | Feedback | calculator / PLZ result | opacity .6→1, feedback (no count-up) | instant |
| M-13 | Hierarchie | section entrance (narrative views only, headings and figures, not body text) | Y 24px + opacity, view() entry 0–30%, ease-ein | none |
| M-14 | Orientierung | section kicker line | scaleX .2→1, view() entry | static at 1 |
| M-15 | Beziehung | page change (view transition) | root out 160 / in 240; scherlinie group 400 standard; rufleiste and kopf static | none |
| M-16 | **Big moment, Startseite: "Scherlinie"** | load | key X −40%→0 420 ein; 5 pin stacks to the shear line 360 einrasten, stagger 70; line scaleX 480 linie from 900ms; total ≤1.4s. H1, Ortsprüfung and call are never animated (LCP is the H1 text). Button "Ablauf ansehen" replays it. | final state, static |
| M-17 | **Big moment, Leistungsgruppe: scene** | scroll (each step at viewport centre) | figure `[data-schritt=n]`, parts 360 standard | no sticky; small static multiples |
| M-18 | **Big moment, Einsatzgebiet: "Ringe um Weilburg"** | view() | raster group scale 1.0→2.4 (Germany to Lahn), rings scale .6→1 + opacity, stagger 120 | static Hessen view |
| M-19 | Beziehung | town chosen on map | line rotated to bearing, scaleX 0→1 480 linie; km label fades in | instant |
| M-20 | **Big moment, Über uns: "Der gerade Weg"** | view() | tunnel line scaleX across the loop | static |
| M-21 | Charakter | 404 | pins jiggle 3× (Y ±3px, 600 total), line halves part X ±4px | static broken state |
| M-22 | Zustand | theme switch | `startViewTransition` crossfade, zustand | instant |
| M-23 | Feedback | copy number | "Kopiert" label opacity, feedback | instant |

**Group scenes for M-17** (one engine, four figures):
- Notöffnung: "Stift für Stift". The four steps (Anruf → Preis → Öffnen → Rechnung) set the pins one at a time.
- Mechanischer Einbruchschutz: the layers of I-03 move apart.
- Elektronische Sicherheit: zones in the floor plan, step by step (Tür → Flur → Wohnraum → Sirene).
- Einbau & Tresore: the resistance levels in I-05.

Nothing autoplays longer than 5s, so no pause control is needed. INP stays safe because there are no layout reads during animation.

## 7. The 12 Hauptansichten

**V01 Startseite is the reference view.** It exercises every token, header, footer, Rufleiste, M-16, price table, combobox, FAQ and notice. Opus builds it.

Narrative views are V01, V02, V05 and V09. All others are working views. Each line below is one focal point per screen height.

**V01 Startseite**
1. Hero (7/5): H1, one line on price openness, Ortsprüfung. Cylinder I-01 on the right bleeds off the page edge; the line runs under the H1. No pair of buttons, no abstract background.
2. "Was jetzt hilft" (Papier-2): a dense 3-row triage (zugefallen / Schlüssel abgebrochen / nach Einbruch), each with steps and a call link.
3. "Preis vor Arbeit": a large statement plus the price excerpt with time windows, and a link to the calculator.
4. Leistungen as a numbered register 01–04. One large panel with an illustration and three list entries with sub-services; not a uniform card grid.
5. Ablauf: 4 steps along the line, stagger 4.
6. Einsatzgebiet teaser: Rasterkarte crop and the Nahbereich list.
7. "Seriös erkennen": dark band with a 5-point checklist (original text).
8. FAQ.
9. Footer.

**V02 Leistungsgruppe** (×4)
1. Head with illustration (the line arrives by view transition).
2. Service register in 2 columns.
3. Scene M-17.
4. Price excerpt (or "nach Aufmaß", explained honestly).
5. Decision aid on a dark band: "Zugefallen oder abgeschlossen?", "Wo anfangen?", "Funk oder Kabel?" or "Welche Stufe?".
6. FAQ.
7. Next group.

**V03 Leistungsdetail** (about 30)
1. Head with small illustration and a dl "Wann sinnvoll / Was wir brauchen / Preisbasis".
2. Article at 32em with a sticky aside (Rufknopf and price) at 8/4.
3. Ablauf component.
4. Standards and variants table (facts verified).
5. FAQ.
6. 3 related links.

**V04 Preise**
1. Three price principles (written, not as tiles).
2. 24h time-window bar with a "jetzt" dot.
3. Full table.
4. Anfahrt zones A–D.
5. Calculator.
6. Payment methods.
7. Notes; print layout.

**V05 Einsatzgebiet**
1. M-18 map with Ortssuche (M-19).
2. Zones explained.
3. Zone A list (Weilburg Ortsteile by distance).
4. Index of 16 Bundesländer plus Netherlands with counts.

**V06 Ortsverzeichnis** (per Land, or per Kreis for large Länder): H1 with count, filter, A–Z bar, columns.

**V07 Ortsseite** (about 6,000): blocks 1–8 from section 4. Static, no motion beyond feedback.

**V08 Ratgeber** (index and article): merges the blog, news and "Achtung Abzocker" topics. Index is a list with a metadata column. Article at 32em with table of contents, checklist component and reused figures.

**V09 Über uns**
1. M-20 Lahnbogen.
2. "Warum Weilburg" (honest radius).
3. "Wie wir arbeiten".
4. Team and Stellen only from real config data (otherwise empty state).
5. Contact teaser.

**V10 Kontakt & Rückruf**
1. Emergency call panel.
2. Composer.
3. Contact details and hours.
4. Weilburg raster crop.

**V11 Suche:** lazy-loaded static index, results list, empty state. Without JS: HTML sitemap and A–Z.

**V12 System & Recht:** Impressum, Datenschutz, Barrierefreiheit, Quellen & Lizenzen, HTML sitemap, 404 (M-21).

**Rhythm rule:** neighbouring sections must differ in at least two of these: background (Papier / Papier-2 / dark band), layout (split / register / full-bleed figure / table) and density.

**ANNAHME (open points):**
- A1: the tunnel and loop facts need checking before use in copy.
- A2: the fallback metrics are measured against Arial and Liberation; Android's Roboto will not match exactly. Verify with a Playwright layout-shift (CLS) test.
- A3: availability hours, night service and zone texts come from config.
- A4: the form endpoint is unknown.
- A5: there are no own photos; image slots stay unused and take only real photos with fixed width and height.
- A6: browsers without `light-dark()` get the light theme.
- A7: the GeoNames gazetteer is dense enough for the raster map.
- A8: brand name ≤28 characters; anything longer gets the smaller wordmark step.

### Critical Files for Implementation
None of these exist yet; all are new files.
- /home/user/schluesseldienst/_werkstatt/KERN.md
- /home/user/schluesseldienst/quelle/css/token.css
- /home/user/schluesseldienst/quelle/css/bewegung.css
- /home/user/schluesseldienst/quelle/js/bewegung.js
- /home/user/schluesseldienst/quelle/daten/firma.json