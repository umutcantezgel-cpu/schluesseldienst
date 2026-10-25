> **Vermerk:** Dieser Bericht entstand in der Planungsphase. Wo er vom genehmigten Plan (`_werkstatt/PLAN-GENEHMIGT.md`) abweicht, ist er **überholt durch PLAN**. Liste der überholten Punkte: `_werkstatt/ENTSCHEIDUNGEN.md` → „Überholte Panel-Punkte“.

# Design: information architecture, SEO and content model (merged site, base Weilburg)

## 0. What the sources show (and how it changes the design)
- Richter's Standorte page groups its towns by state: BW 577, BY 233, BE 5, BB 102, HB 91, HE 1 222, MV 51, NI 745, NRW 1 402, RP 535, SL 188, ST 50, SH 1, TH 56, plus NL 50. There is no Hamburg and no Sachsen. Names have the form "Ortsteil, Gemeinde (Zusatz)", e.g. "Fürth (Hessen)".
- The source slugs contain errors. Example: `schluesseldienst-villmar-giessen`, but Villmar is in Landkreis Limburg-Weilburg. So the competitor lists only seed the names. All geodata comes from GeoNames.
- The two sites order the parts of a slug the other way round. Adam writes `{stadt}-{stadtteil}` (wiesbaden-medenbach), Richter writes `{ortsteil}-{gemeinde}`. The same place therefore appears twice and has to be deduplicated by its geodata key.
- Both already cover the Weilburg area. Adam has weilburg, loehnberg, merenberg, mengerskirchen, weilmuenster, runkel, villmar, limburg, braunfels, wetzlar and idstein. Richter has about 50 Ortsteile there (ahausen-weilburg, kubach-weilburg and so on).
- Richter's 7 news articles: radiospot-auf-ffh-veroeffentlicht, odenwaelder-lokalblick-berichtet… (both are their own PR, so dropped), millionen-zuschuesse-fuer-einbruchssicherung, verbraucher-beschweren-sich-ueber-preise, rauchmelder-seit-januar-in-hessen-2015-pflicht, jetzt-oeffnungstest-anfordern, in-deutschland-wird-alle-2-minuten-eingebrochen.

## 1. Merged page map

The 12 Hauptansichten: A1 Start · A2 Gruppen-/Übersicht · A3 Leistung · A4 Preise · A5 Einsatzgebiet+Suche · A6 Gebiets-Hub · A7 Ort · A8 Ratgeber-Übersicht · A9 Ratgeber-Artikel · A10 Kontakt · A11 Über uns · A12 Systemseite (Recht, 404).
Page type: **E** = Erzählansicht (explains and persuades), **W** = Arbeitsansicht (a task: call, check a price, find a place).

| Source (R = Richter, A = Adam) | Target URL | Ansicht | Merged topics |
|---|---|---|---|
| R `/`, A `/` | `/` | A1 E | the 4 service groups, Kerngebiet towns, Preise teaser, process, "seriös erkennen" box, contact |
| R notoeffnungen | `/notoeffnung/` | A2 E | apartment, house, business premises, vehicle, safe, Schließfach; proof of authorisation |
| A tueroeffnung + R "Wohnungen/Häuser/Geschäftsräume" | `/notoeffnung/tueroeffnung/` | A3 E | zugefallen vs. abgeschlossen, broken key, proof of authorisation, cylinder after opening, insurance |
| A autooeffnung + R "Autoöffnung" | `/notoeffnung/autooeffnung/` | A3 E | car/van, key locked inside, note on breakdown services |
| A garageoeffnung | `/notoeffnung/garagenoeffnung/` | A3 E | up-and-over and sectional doors, emergency release, failed door drive |
| A tresoroeffnung + R "Tresore, Schließfächer" | `/notoeffnung/tresoroeffnung/` | A3 E | forgotten code, faulty electronic lock, Schließfach, proof of ownership |
| R einbruchschaden-beseitigung | `/notoeffnung/einbruchschaden/` | A3 E | emergency securing, typical damage, documentation for insurance, retrofitting |
| R sicherungstechnik, R produkt-details | `/leistungen/` | A2 W | all 23 services with a group filter; without JS a grouped list |
| new hub; R news jetzt-oeffnungstest-anfordern | `/einbruchschutz/` | A2 E | mechanical basic protection, security check, advice |
| R schliesszylinder, id-3-ax-zylinder, k10-wendeschluesselsystem | `/einbruchschutz/schliesszylinder/` | A3 E | cylinder types, protection against drilling/pulling/picking, reversible keys, security card, measuring, replacement (no brand pages) |
| R schliessanlagen | `/einbruchschutz/schliessanlagen/` | A3 E | central/master/grand-master keys, mechanical vs. electronic |
| R einsteckschloss | `/einbruchschutz/tuerschloesser/` | A3 E | mortise lock, multi-point locking |
| R kastenzusatzschloss, querriegelschloss | `/einbruchschutz/zusatzschloesser/` | A3 E | surface-mounted additional lock, cross-bar lock, rented flats |
| R schutzbeschlag | `/einbruchschutz/schutzbeschlaege/` | A3 E | protective fitting, rosette, cylinder cover |
| R bandsicherung, schliessblech | `/einbruchschutz/tuersicherung/` | A3 E | hinge side, security strike plate, door guard, cellar door |
| R fenster-tuersicherung, pilzkopfverriegelung | `/einbruchschutz/fenstersicherung/` | A3 E | mushroom-head locking, lockable handles, terrace door |
| R tuerschliesser | `/einbruchschutz/tuerschliesser/` | A3 E | door closer types, hold-open device (fire safety as a note only), adjustment |
| new hub | `/sicherheitstechnik/` | A2 E | electronic protection combined with mechanical protection |
| R alarmanlage-ja-100, funk-aussensirene, bewegungsmelder-ja-151p-ww | `/sicherheitstechnik/alarmanlagen/` | A3 E | wireless vs. wired, detectors, sirens; brand-neutral |
| R gsm-kamera | `/sicherheitstechnik/videoueberwachung/` | A3 E | camera types, mobile/WLAN, data-protection note |
| R ur-fog-nebelsysteme | `/sicherheitstechnik/nebelsysteme/` | A3 E | how it works, where it is used |
| R rauchmelder-ja-63S-100 | `/sicherheitstechnik/rauchmelder/` | A3 E | smoke and heat detectors, networked, maintenance → links to the Pflicht article |
| A tuer-fenstereinbau | `/einbau/` | A2 E | RC classes overview |
| new (Tür part) | `/einbau/sicherheitstueren/` | A3 E | RC2/RC3 doors |
| new (Fenster part) | `/einbau/sicherheitsfenster/` | A3 E | RC2/RC2N windows, retrofit vs. replacement |
| new hub (R "Tresore" filter) | `/tresore/` | A2 E | buying, delivery/installation, resistance grades |
| R elektronik-moebel-tresore | `/tresore/moebeltresore/` | A3 E | |
| R wertschutzschraenke | `/tresore/wertschutzschraenke/` | A3 E | |
| R tresore-datensicherungsschraenke | `/tresore/datensicherungsschraenke/` | A3 E | |
| R waffenschraenke | `/tresore/waffenschraenke/` | A3 E | |
| A preise | `/preise/` | A4 W | zone prices from config, surcharges, payment methods, what the price includes |
| R standorte, R suche, A einsatzgebiete, A in-der-naehe | `/einsatzgebiet/` | A5 W | place/PLZ search, "in Ihrer Nähe" (opt-in geolocation, calculated only in the browser), zones, list of states |
| (derived) | `/einsatzgebiet/{land}/`, `/einsatzgebiet/{land}/{kreis}/` | A6 W | hubs |
| R 5 308 towns (incl. 50 NL), A 532 locations, new Weilburg-area places | `/schluesseldienst-{slug}/` | A7 W | see §3 |
| R aktuelle-news + news-leser, A blog | `/ratgeber/` | A8 E | |
| R achtung-abzocker, R news verbraucher-beschweren | `/ratgeber/schluesseldienst-abzocke-erkennen/` | A9 E | |
| other news and blog posts | see §5 | A9 E | |
| R ueber-uns + R team | `/ueber-uns/` | A11 E | |
| R kontakt | `/kontakt/` | A10 W | |
| R impressum, A impressum | `/impressum/` | A12 | |
| R datenschutzerklaerung, A datenschutz | `/datenschutz/` | A12 | |
| R galerie-kurioses | **deferred** (flag `identitaet.galerie`, own photos only) | — | |
| R stellenangebote | `/karriere/`, **built only if** `config.karriere.stellen` is not empty | A11 variant | |
| R radiospot, R odenwaelder-lokalblick, R fake English switch | dropped | — | |
| — | `/404.html` (noindex) | A12 | |

**Identity pages without real content.** No page shows filler text.
- **Über uns** is always built. It shows the business name, owner, Weilburg address and an SVG location map, all from config.
- A "Wie wir arbeiten" section only lists *promises* the human has confirmed. They are kept in `config.zusagen` (e.g. `preisVorab`, `rechnungMitPositionen`), each a boolean.
- The team, founding year, qualifications (Meister, Handwerkskammer) and photos appear only if the config field is filled. Otherwise the section is not rendered.
- The strict build requires the legal minimum: name, owner, address, phone and email.
- Reviews: never rendered unless there is `config.bewertungen.profilUrl`. Even then it is only a link, never an aggregateRating.

## 2. URL scheme and hierarchy

**Rules**
- Lowercase ASCII only (ä→ae, ö→oe, ü→ue, ß→ss). Hyphens only. No file extensions.
- Every page is a directory: `/pfad/index.html`. Every internal link ends in `/`.
- **Town pages are flat:** `/schluesseldienst-{slug}/`. This keeps the keyword at the root, keeps URLs short, and keeps them stable even if a district boundary changes.
- **Hubs are nested:** `/einsatzgebiet/{land}/{kreis}/`. The town's position in the hierarchy is shown only through breadcrumbs and BreadcrumbList.
- **Slug grammar:** a Gemeinde gets `{gemeinde}` (e.g. `weilburg`). An Ortsteil gets `{gemeinde}-{ortsteil}` (e.g. `weilburg-kubach`, `wiesbaden-medenbach`), matching the local "Weilburg-Kubach" notation.
- **Name collisions:** the place with the larger GeoNames population keeps the bare slug. The others get `-{kreis}` (e.g. `fuerth-bergstrasse`), then `-{land}` if still ambiguous.
- Kreis slugs drop the prefix ("limburg-weilburg"). If a Landkreis and a kreisfreie Stadt share a name, the Landkreis gets `-landkreis` (e.g. `kassel-landkreis`).
- **Slugs are permanent** once released. They are stored in a lock file (`orte.lock.json`); a build that changes a released slug fails.

**Canonical and indexing**
- Every page has an absolute self-canonical built from `config.site.origin`. ANNAHME: https on the apex domain; the human decides www vs. apex.
- No query-string variants.
- A noindex page never canonicalises to another page and is never listed in a sitemap.
- **Preview builds:** every page gets `meta robots noindex` and robots.txt contains `Disallow: /`. A release build is only possible in strict mode, which allows no placeholders.
- The host must redirect `/x` → `/x/` and `/x/index.html` → `/x/` with a 301. The host is unknown, so this goes into MENSCHEN.md together with the deploy configs.

**Internal linking** (maximum click depth 4: Start → Einsatzgebiet → Land → Kreis → Ort)

| From | Links to |
|---|---|
| Ort | Kreis hub (breadcrumb); the parent Gemeinde, or all its Ortsteile if it is a Gemeinde; the 6 nearest places (≤ 30 km, across Kreis borders, with km); the Weilburg page (Kern/Umland zones); services filtered by zone; `/preise/#zone-…`; 2 Ratgeber articles |
| Kreis hub | all places, grouped by Gemeinde with A–Z jump anchors; 4 neighbouring Kreis hubs; the Land hub |
| Land hub | all Kreis hubs; the 12 largest Gemeinden (by GeoNames population) |
| `/einsatzgebiet/` | all Land hubs; full list of Kern and Umland places |
| Service page | Preise; 2–4 sibling services; 1–3 Ratgeber articles; up to 10 Kerngebiet towns ("Türöffnung in Runkel …") |
| Ratgeber article | 2–4 services; related articles |
| Footer | the 4 groups, Preise, Einsatzgebiet, Ratgeber, Über uns, Kontakt, Impressum, Datenschutz. **No sitewide town list.** |

The build checks the link graph: there are no orphans, every indexable page has at least 3 inbound links, and depth is at most 4.

**Sitemaps**
- `/sitemap.xml` is an index pointing to `/sitemaps/seiten.xml`, `leistungen.xml`, `ratgeber.xml`, `einsatzgebiet.xml` (hubs) and one `orte-{land}.xml` per state.
- The largest file is NRW with about 1 400 URLs, well under the 50 000 limit.
- Only indexable URLs are listed.
- `lastmod` is the date the hash of that page's main content plus data last changed. It is stored in a lock file and is never simply the build date.

**robots.txt (release build):** `User-agent: *`, `Allow: /`, `Sitemap: https://{origin}/sitemap.xml`. CSS and JS are not blocked. Whether to block AI crawlers is a human decision (MENSCHEN.md).

## 3. Town page content model

**Data pipeline**
1. Seed: union of both competitor name lists, plus new places.
2. **New places:** GeoNames gazetteer entries with feature codes PPL, PPLA1–4 or PPLX within `config.orte.neuRadiusKm` around Weilburg. ANNAHME: 30 km. Historical and abandoned places (PPLH, PPLQ) are excluded.
3. Match every place to a GeoNames record:
   - postal file: PLZ, Bundesland, Kreis, Gemeinde code (admin4, ANNAHME: this is the AGS), coordinates;
   - gazetteer: population and feature code.
4. Deduplicate with the key (AGS, normalised Ortsteil name).
5. Places that cannot be matched go into a review list. They are **not** published with guessed data.
6. Each place stores its GeoNames ID. GeoNames is credited (CC BY 4.0) on geo pages and in the Impressum.
7. NL places use GeoNames NL. ANNAHME: that download is reachable.

**Zones** are set in config. ANNAHME for the defaults: Kern = Landkreis Limburg-Weilburg plus a 20 km radius; Umland = up to 50 km; Überregional = the rest of Germany; Ausland = NL. The human confirms them.

| Zone | Wording principle | Allowed | Forbidden | `index` default | `notoeffnung` default |
|---|---|---|---|---|---|
| Kern | "Unser Betrieb in Weilburg liegt rund {d} km {richtung} von {Ort}." | direct service, zone price | any minute figure unless `config.zonen.kern.anfahrtText` is filled by the human | true | "ja" |
| Umland | "Wir kommen aus Weilburg (rund {d} km Luftlinie). Bitte planen Sie die Anfahrt ein." | zone price, "nach Absprache" | "vor Ort", "in Ihrer Nähe", "Niederlassung", "Ihr Schlüsseldienst aus {Ort}" | true | "ja" |
| Überregional | "Unser Betrieb sitzt in Weilburg (Hessen), rund {d} km entfernt. Für eine Notöffnung ist ein Betrieb in Ihrer Nähe meist schneller – so erkennen Sie einen seriösen. Planbare Leistungen übernehmen wir nach Absprache." | planned work, advice by phone | emergency promises, local claims | true (user decision) | "nach-absprache" |
| Ausland (NL) | same as Überregional, German-language page | same | same | true (user decision; **recommended: false**) | "nach-absprache" |

The `index` and `notoeffnung` defaults are business decisions and are listed in MENSCHEN.md.

**Block order on a town page.** D = generated from data, F = fixed module, C = from config.

| # | Block | Source |
|---|---|---|
| 1 | Breadcrumb · H1 · zone sentence · phone CTA (wording depends on zone) | D + C |
| 2 | Fact box: Gemeinde/Ortsteil, Kreis, Bundesland, all PLZ, distance (straight line, rounded to km) and one of 8 compass directions from Weilburg | D |
| 3 | Services available in this zone (tiles filtered by zone) | F + C |
| 4 | Zone price with a placeholder marker, plus link to /preise/ | C |
| 5 | Static SVG locator map (Germany outline from public-domain Natural Earth, Weilburg and the place). **No Maps embed.** | D |
| 6 | State rule: the Rauchmelderpflicht for this Bundesland, the police crime-prevention advice service for this state (link) | D (`bundeslaender.json`, each entry marked VERIFIZIEREN) |
| 7 | Gemeinde: list of its Ortsteile. Ortsteil: link to its Gemeinde. | D |
| 8 | Local FAQ from real data: PLZ? distance? cost in this zone? hours in this zone? Rauchmelderpflicht in this state? | D + C |
| 9 | "Seriösen Schlüsseldienst erkennen" box → Ratgeber | F |
| 10 | Nearest places with km | D |
| 11 | GeoNames credit | F |

**Spinning is banned:** no synonym rotation and no random sentence variants. Text varies only through data and zone.
- The build measures main-content similarity per zone with 5-word shingles (Jaccard) on 200 random pairs and reports it in ABNAHME.md. The aim is to measure honestly, not to hit a fake target.
- Targets: 350–600 words of main content, of which at least 40 % comes from data.
- The Weilburg page itself (the business base) is written by hand.

**Title, meta and H1 patterns** (character counts; the build falls back step by step until the limit fits)

| Zone | Title (≤ 60) | Fallbacks |
|---|---|---|
| Kern | `Schlüsseldienst {Ort} – Türöffnung & Schließtechnik` | `… – Türöffnung` → `Schlüsseldienst {Ort}` |
| Umland | `Schlüsseldienst {Ort} – Betrieb aus Weilburg` | `Schlüsseldienst {Ort}` |
| Überregional | `Schlüsseldienst {Ort}: Schließtechnik nach Absprache` | `Schlüsseldienst {Ort}` |
| Ausland | `Schlüsseldienst {Ort} (NL) – Anbieter aus Weilburg` | `Schlüsseldienst {Ort} (NL)` |

- `{Ort}` for an Ortsteil is "{Ortsteil} ({Gemeinde})", falling back to "{Gemeinde}-{Ortsteil}" if too long.
- **H1:** `Schlüsseldienst für {Ort}`.
- **Meta (70–155 characters).** Kern example: "Türöffnung, Schlösser und Einbruchschutz für {Ort} ({PLZ}). Betrieb in Weilburg, rund {d} km entfernt. Preise vorab auf /preise/." The price clause is used only when the price is final.
- The brand name is appended as ` | {Marke}` only on core pages and only if it fits.

**Risk note** (record in ENTSCHEIDUNGEN.md):
- About 6 000 template pages fall under Google's "doorway pages" and "scaled content abuse" spam policies. The consequence can be site-wide demotion that also hits the core pages.
- Mitigations: honest zone wording, data blocks, no fake locations.
- One config flag per zone switches it to noindex, removes it from the sitemap and keeps the links.
- Monitoring (MENSCHEN.md): if "Gecrawlt – nicht indexiert" in Search Console stays above roughly 60 % for the Überregional zone after 8 weeks, switch that zone off.
- False claims about where the business is located are also a UWG § 5 risk (misleading statements).

## 4. Structured data (JSON-LD; data blocks, so CSP does not affect them)

| Page type | Types | Notes |
|---|---|---|
| Start, Über uns, Kontakt | `Locksmith` `@id …/#betrieb` (name, telephone, email, address, geo, openingHoursSpecification and sameAs only from config); areaServed = Kern/Umland Kreise as `AdministrativeArea`; `WebSite` `#website` with publisher → #betrieb; plus `AboutPage` or `ContactPage` | **No aggregateRating or review.** No SearchAction (Google removed the sitelinks search box in 2024). |
| Group and service pages | `Service` (serviceType, provider → #betrieb, areaServed) + `BreadcrumbList`; `Offer`/`UnitPriceSpecification` (EUR, valueAddedTaxIncluded) **only when the price is not a placeholder**; `FAQPage` if an FAQ is visible | Safes as `Service` ("Verkauf und Montage"), not `Product`, until there are real items and prices. FAQ rich results are now limited to government and health sites, so FAQPage gives no rich result but is harmless. |
| Preise | `WebPage` + `OfferCatalog` on #betrieb | only with real prices |
| Town page | `Service` with areaServed `Place` (name, geo, containedInPlace = Kreis) + `BreadcrumbList` + `FAQPage` | **Never a LocalBusiness per town** (that would be a false location claim). |
| Hubs, Ratgeber index | `CollectionPage` + `ItemList` + `BreadcrumbList` | |
| Ratgeber article | `Article` (headline, datePublished, dateModified, image = own, author = `Person` only from config, otherwise #betrieb) + `BreadcrumbList` | |
| Karriere (if activated) | `JobPosting` | real data only |
| 404, legal pages | none / `WebPage` | |

The build checks the JSON-LD against an internal schema subset. The Rich Results Test is a manual step (MENSCHEN.md).

## 5. Ratgeber plan
The original topics are rewritten from scratch. Every fact is marked **VERIFIZIEREN** until a human checks it against the primary source; the source URL is stored per article.

| Slug `/ratgeber/…/` | Target keyword | Covers | Internal links | Facts to verify |
|---|---|---|---|---|
| ausgesperrt-was-tun | ausgesperrt was tun | A ausgesperrt-was-tun | tueroeffnung, preise, abzocke | — |
| tuer-zugefallen-oder-abgeschlossen | tür zugefallen öffnen | A tueroeffnung-ohne-schaeden | tueroeffnung, schliesszylinder | none (technical basics) |
| schluesseldienst-abzocke-erkennen | schlüsseldienst abzocke | R achtung-abzocker, R verbraucher-beschweren | preise, kontakt | Verbraucherzentrale advice, § 291 StGB / § 138 BGB, any price ranges |
| schluesseldienst-kosten | schlüsseldienst kosten | — | preise, abzocke | market prices only with a source |
| schluessel-verloren | schlüssel verloren was tun | — | schliesszylinder, schliessanlagen | liability insurance for lost keys (in general) |
| schluessel-im-auto | schlüssel im auto eingeschlossen | — | autooeffnung | breakdown service offers |
| schliesszylinder-wechseln | schließzylinder wechseln | A schliesszylinder-austauschen | schliesszylinder, schutzbeschlaege | DIN EN 1303 / DIN 18252 classes |
| einbruchschutz-wohnung | einbruchschutz wohnung | — | zusatzschloesser, tuersicherung | tenant law: landlord's consent |
| einbruchschutz-haus | einbruchschutz haus | A einbruchschutz-hochheim, R "alle 2 Minuten" | fenstersicherung, alarmanlagen | current police crime statistics (PKS) for Germany and Hessen |
| haustuer-sicherheitscheck | haustür sicherheit prüfen | R jetzt-oeffnungstest-anfordern | einbruchschutz, tuersicherung | — |
| nach-einbruch-was-tun | nach einbruch was tun | R einbruchschaden page | einbruchschaden | insurance obligations |
| rc-widerstandsklassen | rc2 rc3 unterschied | — | sicherheitstueren, sicherheitsfenster | DIN EN 1627 |
| foerderung-einbruchschutz | förderung einbruchschutz kfw | R millionen-zuschuesse | einbruchschutz | **status of KfW 455-E and 159 in 2026**, § 35a EStG (20 %, max. 1 200 €) |
| rauchmelderpflicht-hessen | rauchmelderpflicht hessen | R rauchmelder-pflicht | rauchmelder | the HBO paragraph, who is responsible, DIN 14676; the 16-state table (this also feeds town pages) |
| tresor-kaufen-widerstandsgrade | tresor kaufen worauf achten | A tresor-kaufen-worauf-achten | tresore/* | EN 1143-1, EN 14450, EN 1047-1; insured sums depend on the insurer |
| waffenschrank-vorschriften | waffenschrank vorschriften | — | waffenschraenke | § 36 WaffG, § 13 AWaffV (**high risk**) |
| elektronische-schliessanlagen | elektronische schließanlage | A elektronische-schliessanlagen | schliessanlagen | GDPR, works council (§ 87 BetrVG) |
| alarmanlage-planen | alarmanlage haus | — | alarmanlagen, nebelsysteme | VdS classes, police installer lists |

## 6. Content production

| Writer | Pages |
|---|---|
| Opus (sets the voice) | Start; `/notoeffnung/` and `/notoeffnung/tueroeffnung/` as reference pages; all zone text blocks for town pages plus the town FAQ set; Weilburg page; Preise; Über-uns structure; the "Themenpass" brief for every service page and article; the fact sheets with VERIFIZIEREN markers; the language section in KERN.md |
| Haiku (by pattern) | the remaining 22 A2/A3 pages (packages of 3, one Themenpass each); 18 Ratgeber articles (from fact sheets); 15 Land hub intros; the Kreis hub intro template; alt texts; 404 page |
| Human (MENSCHEN.md) | Datenschutz and Impressum texts (legal), confirming promises, zone radii, prices, checking VERIFIZIEREN facts, a sample check of newly added places |

**Keeping the 30 service pages distinct.** Each page gets a Themenpass listing:
- one primary keyword (unique across the site) and 2–4 secondary keywords;
- the search intent;
- required sections;
- **Abgrenzung**: which topics belong to a sibling page and are only linked;
- 3–5 FAQs, each question unique across the site.

The build checks primary-keyword uniqueness, duplicate FAQ questions and pairwise shingle Jaccard below 0.25 on main content.

**Style rules** (section "Sprache" in KERN.md)
- Address customers as **Sie**. "Wir" means the business.
- Active voice, sentences ≤ 20 words, concrete steps.
- **Forbidden claims:** arrival-time minutes, "24/7" (unless `config.erreichbarkeit.rundUmDieUhr`), "Festpreis" (unless the prices are final and fixed), "garantiert schadensfrei", "seit X Jahren", "Meisterbetrieb/zertifiziert" (unless config plus proof), "Nr. 1/bester/günstigster", "kostenlos", any review or rating claim, and any local presence outside Weilburg.
- **Floskeln to avoid:** "kompetent und zuverlässig", "Ihr Partner in Sachen", "Keine Panik", "Handschlagqualität", and "alles was zugeht, geht auch wieder auf" (a competitor's slogan).
- **Orthography:** reformed spelling (Duden); en dash with spaces " – "; „…" quotes; non-breaking space before € and km; formats "1.234,50 €" and "18–22 Uhr".
- Gender-neutral wording ("Fachkraft", "Team") instead of gender marks. ANNAHME.
- **Hyphenation:** `lang="de"` plus `hyphens:auto` in body text. In headings, the build inserts `&shy;` from a compound-word list (e.g. Daten·sicherungs·schränke). Phone numbers are never broken.

**Length targets** (words): Start 900–1 300 · group 600–900 · service 700–1 100 · Preise 400–700 plus table · Ort 350–600 · Kreis hub 150–300 plus list · Land hub 200–400 · Ratgeber 1 000–1 800 · Kontakt about 150.

## 7. On-page technical SEO checklist (enforced by the build in strict mode)
- **Titles and meta:** every indexable page has a unique title (≤ 60 characters) and meta description (70–155). Duplicates fail the build.
- **Headings:** exactly one H1, no skipped levels.
- **Canonical and robots:** absolute self-canonical; never noindex and in the sitemap at the same time; noindex during preview.
- **Links:** internal links must end in `/`, must not contain `index.html`, and must not be nofollow. A link checker covers all 6 000+ pages.
- **Images:**
  - descriptive German alt text, or `alt=""` for decoration;
  - width and height set, AVIF/WebP;
  - the LCP image gets `fetchpriority="high"`, all others are lazy-loaded;
  - no third-party hosts.
- **OG/Twitter tags:** `og:title/description/url/type/locale=de_DE/image`. Images are 1200×630, rendered at build time with Playwright from an internal HTML template: one per page type and service, one per zone for town pages, which keeps the build small.
- **Language:** no hreflang; `<html lang="de">`. NL pages are German-language as well.
- **404:** `/404.html` (noindex) with place search and hub links. The host must return status 404 (MENSCHEN.md).
- **No pagination:** long lists use A–Z anchors instead.
- **Core Web Vitals:**
  - **Speed and layout:** no Maps or video embeds; self-hosted WOFF2 subset fonts with a metric-adjusted fallback to avoid layout shift; town page HTML ≤ 60 KB.
  - **Search index:** the place index (about 6 000 entries, roughly 60 KB gzip) loads only when the search field gets focus, with a debounced prefix search to protect INP.
- **Sampled checks:** Lighthouse and axe run on 3 pages per Ansicht and zone, not on all pages.
- **Host limits:** some static hosts cap a site at about 20 000 files. Output is about 6 400 HTML files plus assets. ANNAHME: check once the host is known.
- **Data-quality report:** unmatched places, slug collisions, places without PLZ, and similarity statistics are written to ABNAHME.md.

### Critical files for implementation
- /home/user/schluesseldienst/Richter Schlüsseldienst/01a12b76-b326-7756-a303-8fa6e684874c 2/www.richter-sicherheitstechnik.de_standorte.html.md (names of all 5 308 places, grouped by state)
- /home/user/schluesseldienst/Richter Schlüsseldienst/01a12b76-b326-7756-a303-8fa6e684874c 2/www.richter-sicherheitstechnik.de_share_sitemap.xml.md (product and news slugs)
- /home/user/schluesseldienst/Schlüsseldienst Adam/dba3265a-e101-45c5-a4b2-34f91dac4d75.zip (entry `*_sitemap.xml.md`: 532 places, blog slugs)
- /home/user/schluesseldienst/Richter Schlüsseldienst/01a12b76-b326-7756-a303-8fa6e684874c 2/www.richter-sicherheitstechnik.de_sicherungstechnik.html.md (product grid and categories)
- /home/user/schluesseldienst/_werkstatt/KERN.md (to be created: "Sprache" section, zone wording, Themenpass format)