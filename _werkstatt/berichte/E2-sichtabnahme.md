# E2 · Sichtabnahme V01 (Startseite)

Prüfer E2-REVIEW, KERN v1. Grundlage: 24 Ausschnitte, 10 Momentbilder, Bild mit reduzierter Bewegung; Ursachen im Quelltext geprüft.

## 1. Werte

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Atkinson 780 und Mono-Ziffern tragen; schwache Umbrüche und der sechszeilige Preis-Absatz stören die Hierarchie. |
| Komposition | 6 | Gute Layoutwechsel, doch der Hero liegt neben dem Raster (mobil ohne rechten Rand), das Register lässt 520 px Leere, der Ablauf schwimmt. |
| Farbe und Bild | 7 | Papier, Lahn und Kupfer ruhig und dunkel gleichwertig; im Dunkelmodus fallen dunkles Band und Papier-2 zusammen. |
| Bewegung | 8 | M-16 erzählt Ursache und Wirkung in 1.380 ms, registertreu, reduziert statisch; mobil sehr klein, Linie endet unverbunden. |
| Grafik | 7 | Zylinderschnitt sachlich richtig (Stiftlängen = Einschnitte); Karte und Quittung bleiben generisch. |
| Details | 6 | Platzhalter brechen und werden getrennt, Rahmen doppeln sich, Kanten stehen versetzt. |
| **Ansichtswert** | **6,8** | (7+6+7+8+7+6)/6 |

## 2. Was trägt
- M-16: Die Kupferlinie erscheint erst, wenn alle Stifte sitzen (`moment/desktop-1440x900/moment-04.jpg` → `moment-05.jpg`).
- „Was jetzt hilft“: dicht, nützlich, ein Icon-Stil (`start__desktop__light__02.jpg`).
- Dunkler Hero: Kupfer heller, kein Leuchten (`start__desktop__dark__01.jpg`).
- Fuß endet in der Scherlinie mit Punkt „Weilburg an der Lahn“ (`start__desktop__light__09.jpg`).
- Mobile Preistabelle als Blöcke, Werte rechtsbündig (`start__mobil__light__04.jpg`).

## 3. Befunde

1. **Hero-Raster versetzt, mobil übergelaufen.** `start__mobil__light__01.jpg`, rechter Rand: Kicker endet bei 385 px, Suchfeld bei 387 von 390 px. `start__tablet__light__01.jpg`: Hero bei 47 px, Folgeabschnitt bei 27 px. Desktop: 120 statt 144 px. Ursache: `column-gap` der `.hero` wirkt auch an den Randspuren (`hero.css`). Vorschlag: `.hero { column-gap: 0 }`, Abstand Text–Figur über `padding-inline-start: var(--sp-xl)` an `.hero-figur` ab 64em. Wirkung: Komposition +1.

2. **Leere im Leistungsregister.** `start__desktop__light__04.jpg`, links unter der Notöffnungs-Karte (≈ 645 × 520 px). Ursache: `.register-gross { align-self: start }`. Vorschlag: `align-self: stretch`, I-02 Zylinder-Front oder I-06 Tür am Kartenfuß (`register.css`, `teile/register.mjs`). Wirkung: Komposition +1, Grafik.

3. **Platzhalteroptik.** `start__desktop__light__03.jpg`, Tabelle: fast jede Zelle bricht „[Preis / folgt]“. `start__mobil__light__07.jpg`, Schritt 4: „bestä-tigen“ im Platzhalter. `start__desktop__light__01.jpg` (Kopf und Hero) und `start__mobil__light__01.jpg` (Rufleiste): gestrichelter Rahmen im gestrichelten Rahmen. Vorschlag:
   - `basis.css`: `.platzhalter { hyphens: manual; overflow-wrap: normal }`;
   - `preis.css`: `.preis .platzhalter { white-space: nowrap }`, Zellen mit `padding-inline: var(--sp-xs)`;
   - `rufknopf.css`: im Zustand `platzhalter` nur die äußere Markierung mit Schraffur, innen kein Rahmen (K-006).

   Wirkung: Details +1.

4. **Ablauf schwimmt.** `start__desktop__light__05.jpg`: Die Texte der vier Schritte beginnen bei 419, 389, 404 und 374 px. Ursache: gestreckte Grid-Zeilen in `.ablauf-schritt`. Vorschlag: `align-content: start` (`ablauf.css`). Mobil fehlt die Verbindungslinie (`start__mobil__light__07.jpg`): senkrecht ergänzen. Wirkung: Komposition, Details.

5. **Rhythmus im Dunkelmodus gebrochen.** `start__desktop__dark__05.jpg` und `__07.jpg`: `.band-dunkel` nutzt dunkel `--c-papier-2`, dieselbe Fläche wie `.band` (Einsatzgebiet, `layout.css`). Beide sind 7/5-Teilungen: Regel ≥ 2 von 3 verletzt. Papier zu Papier-2 im Dunkeln: 1,08:1. Vorschlag: eigener Bandton in `token.css` (Orchestrator, K-005), Haarlinien `--c-linie` oben/unten. Wirkung: Farbe +1, Komposition.

6. **Zwei Kupferlinien statt einer.** `start__desktop__light__01.jpg`: Kopflinie (y 427) und Scherlinie (y 480) stehen unverbunden. Das Gehäuse wird am Bildrand abgeschnitten (P1: keine Linien ins Nichts). Mobil liegen beide Linien 90 px übereinander (`start__mobil__light__01.jpg`). Vorschlag: Scherlinie auf die Höhe der Kopflinie setzen, Figur an `breit-end` enden lassen, unter 64em `.hero-linie` ausblenden (`hero.css`). Wirkung: Komposition; M-16 bekommt ein Ziel.

7. **Umbrüche.**
   - H1 „…, auf / der sie aufgeht.“ (Desktop und mobil 01), Tablet „die / Linie“.
   - „– und was Sie“ am Zeilenanfang (`start__desktop__light__02.jpg`).
   - „· Wertschutzschränke“ und „· Türschlösser“ am Zeilenanfang (`start__desktop__light__04.jpg`, `start__mobil__light__06.jpg`).

   Vorschlag: H1 als Zeilen „Tür zu? / Wir finden die Linie, / auf der sie aufgeht.“ (`inhalte/start.mjs`); geschütztes Leerzeichen vor „–“ zentral in `bau/lib/inhalt.mjs`; `teile/register.mjs` Z. 24 mit `'\u00A0· '` verbinden. Wirkung: Typografie +1.

8. **Preis ohne Hierarchie.** `start__desktop__light__03.jpg`, links: sechs Zeilen `.preis-gross` (fs-2, 600) konkurrieren mit der H2. Hinweisbox 480 px, Tabelle 644 px. Mobil steht die Tabellenüberschrift ohne Innenabstand (`start__mobil__light__04.jpg`). Vorschlag:
   - Aussage auf fs-1 und Gewicht 400;
   - die drei Faktoren als Liste nach den Tabellenachsen (Türzustand, Uhrzeit, Zone);
   - `.preis-auszug .hinweis { max-inline-size: none }`;
   - Innenabstand der Tabellenüberschrift in der Container-Query (`preis.css`).

   Wirkung: Typografie, Komposition.

9. **Karte und Quittung generisch.** `start__desktop__light__06.jpg`, rechts: „Frankfurt am Main“, „Weilburg“ und „20 km“ liegen auf Punkten; Punktwolke statt Raster, keine Legende. `start__desktop__light__07.jpg`, rechts: Quittung aus Balken ohne Aussage. Vorschlag:
   - `gebietskarte.mjs`: Punkte auf das 6er-Raster (I-10), Beschriftung mit Papier-2-Halo (`paint-order: stroke`, Breite als Token), Legende;
   - `rechnung.mjs`: Positionen in Mono beschriften (Anfahrt, Arbeitszeit, Zuschlag, MwSt., Gesamt), ohne Zahlen; Figur oben bündig (`checkliste.css`);
   - Zylinder: Schaft endet an der Reide, Loch sichtbar, Kernstifte schraffiert (`zylinder.mjs`, `zylinder.css`).

   Wirkung: Grafik +1.

10. **Kleinteile.**
    - `start__desktop__light__01.jpg`: „Ablauf noch einmal ansehen“ steht 21 px rechts der Bildunterschrift (`.hero-abspielen` ausgleichen).
    - `start__desktop__light__08.jpg`: 208 px Leere vor dem Fuß, weil Sektionsabstand und `.fuss { margin-block-start }` sich addieren (`layout.css`).
    - `start__desktop__light__02.jpg`: Listen beginnen versetzt; Subgrid in `triage.css`.

    Wirkung: Details.

## 4. Pakete

| Paket | Ziel | Dateien |
|---|---|---|
| E3-V01-KOMP | Hero, Register und Ablauf liegen auf den Rasterlinien; eine Kupferlinie führt. | `hero.css`, `register.css`, `ablauf.css`, `layout.css`, `teile/register.mjs` |
| E3-V01-DET | Platzhalter sauber markiert, keine Versätze. | `basis.css`, `preis.css`, `rufknopf.css`, `hero.css`, `triage.css` |
| E3-V01-TYPO | Keine schwachen Umbrüche, klare Preis-Hierarchie. | `inhalte/start.mjs`, `bau/lib/inhalt.mjs`, `teile/register.mjs`, `preis.css` |
| E3-V01-FARBE | Dunkles Band in beiden Themen eigenständig. | `token.css` (+ KERN K-005), `layout.css`, `teile/gebietskarte.mjs` |
| E3-V01-GRAFIK | Karte als Raster, Quittung mit Aussage, Zylinder stimmig. | `teile/gebietskarte.mjs`, `gebiet.css`, `illustrationen/rechnung.mjs`, `checkliste.css`, `illustrationen/zylinder.mjs`, `zylinder.css` |

## 5. Urteil

**Tor nicht bestanden:** Ansichtswert 6,8 < 8; Komposition und Details liegen unter 7.
