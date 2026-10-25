> **Vermerk:** Dieser Bericht entstand in der Planungsphase. Wo er vom genehmigten Plan (`_werkstatt/PLAN-GENEHMIGT.md`) abweicht, ist er **überholt durch PLAN**. Liste der überholten Punkte: `_werkstatt/ENTSCHEIDUNGEN.md` → „Überholte Panel-Punkte“.

# Technical design: architecture, place-data pipeline, security and tests

## 0. Verified findings in the repo (they drive the design)
- **Accordion panels on the Richter Standorte page** (`…standorte.html.json`, 1.33 MB html): 5,308 links. Per panel: HE 1,222, NRW 1,402, NI 745, BW 577, RP 535, BY 233, SL 188, BB 102, HB 91, TH 56, MV 51, ST 50, BE 5, SH 1, NL 50. There is no Hamburg or Sachsen panel.
- **Link texts:** 2,554 use the form "Ortsteil, Gemeinde". Bremen uses both orders ("Altstadt, Bremen" and "Bremen, Arsten"). The Berlin panel contains "Berlin Hennigsdorf" and "Berlin Oranienburg", which are in Brandenburg. "Mariaparochie" is labelled "Sleutelservice".
- **Slug vs. text:** in 16 cases the slug does not match the text: `absteinach`→Abtsteinach, `-1788`/`-2081`/`-1` suffixes, "(Hessen)", "(Niederrhein)", `aura-isinngrund`. 193 base names are ambiguous ("Hausen" ×7).
- **Adam sitemap** (html field of the JSON): 532 location URLs in 24 comment groups (23 regions plus SONDERSLUGS). Only 182 match a Richter slug naively. `mainz-kastel` and `wiesbaden-kastel` are the same place.
- **Secrets in the scrapes:** 2 distinct Google API keys (`AIza…`, about 63k occurrences in Richter html), plus a `google-site-verification` token and the string `G-WEILBURG` in the Adam JSON.
- **Machine:** 4 cores, 15 GB RAM, Node 22.22, Java present (so vnu.jar works), Playwright 1.63 global, `unzip` present.

## 1. Repository layout
```
/home/user/schluesseldienst/
  Richter Schlüsseldienst/, Schlüsseldienst Adam/   raw input, read-only; only pipeline/ reads it
  package.json        private, no dependencies, "engines":{"node":">=22.12 <23"}, scripts only
  .node-version       22
  src/konfig/         betrieb.mjs preise.mjs zonen.mjs leistungen.mjs navigation.mjs sicherheit.mjs seo.mjs
  src/daten/          orte.json (generated, COMMITTED) orte-unklar.json slug-register.json weiterleitungen.json lastmod.json GEONAMES-LIZENZ.txt
  src/inhalte/        structured content modules (no HTML); ortstexte/ = honest text building blocks
  src/vorlagen/       layout.mjs, teile/*.mjs, seiten/*.mjs   (template-literal functions)
  src/assets/         css/ js/module/ js/logik/ (pure, testable) schriften/ icons/
  bau/                bauen.mjs vorschau.mjs lib/*.mjs pruefen/*.mjs
  pipeline/orte/      00-laden … 90-pruefen.mjs, regeln.json, zuordnung-manuell.json, quellen.lock.json
  hosting/            nginx/sicherheit-header.conf, nginx/site.conf (generated, committed)
  test/               *.test.mjs + fixtures/
  _werkstatt/         KERN/PLAN/ABNAHME/ENTSCHEIDUNGEN/MENSCHEN.md, berichte/, werkzeuge/ (own package.json + lockfile)
  .cache/ dist/ release/                                  gitignored
```

**Do not commit `dist/`.**
- **Size:** a town page is about 18 KB raw (head 2.5, header/nav 3, main 8, JSON-LD 1.5, footer 2.5), about 5 KB gzipped. 6,000 pages come to about 108 MB raw, about 30 MB as git objects.
- **Churn:** every template change rewrites all 6,000 files. About 30 rebuild commits over the run would add roughly 0.5–1 GB to the repo, and the diffs would be unreadable.
- **Building on the host instead:** the build has zero dependencies and takes ≤ 30 s, so any host can run `node bau/bauen.mjs --release`.
- **Hosts with FTP only:** `node bau/paket.mjs` writes `release/site-<commit>.tar.gz` (about 25 MB), which is not committed.
- **What is committed:**
  - `src/daten/orte.json`: about 6,000 × 330 B ≈ 2 MB, one record per line so diffs stay small.
  - `src/daten/lastmod.json`: about 400 KB.
- **File count:** about 6,450 files, which fits the Cloudflare Pages limit of 20,000. Pre-compressed `.br`/`.gz` copies are therefore only an option for Apache/nginx, behind `--vorkomprimieren`.

## 2. Generator (zero npm dependencies, `node:` built-ins only)
**`bau/lib/html.mjs`: mandatory escaping**
```js
export class Roh { constructor(s){ this.s = String(s); } }
export const html = (str, ...w) => new Roh(str.reduce((a, s, i) => a + wert(w[i - 1]) + s));
// wert(): null/false→'' | Roh→as is | Array→join | string/number→escape(&<>"') | Platzhalter→marked | sonst throw TypeError
```
Supporting rules:
- `attrUrl()` allows only `/…`, `#…`, `https:`, `tel:+49…` and `mailto:`. Anything else throws.
- `jsonLd(obj)` uses a stable key order with `JSON.stringify`, then escapes `<`→`\u003c`, `>`, `&`, U+2028 and U+2029.
- `roh()` is only allowed in `bau/lib/` and `src/vorlagen/teile/icons.mjs`; a source linter enforces this.
- Content modules use a mini syntax: `[Text](/pfad/)`, `**fett**`. It is escaped first and then transformed. Link targets are checked against the route table, so a broken link fails the build.

**Build steps (`bauen.mjs`)**
1. Load the configuration and collect placeholders.
2. Validate `orte.json` against a hand-written schema.
3. Build the route table and check uniqueness and reserved slugs.
4. Assets:
   - CSS: concatenate in a fixed order, strip comments.
   - JS: `lib/flatten.mjs` resolves only relative `import {…}` and `export function|const`, orders them topologically, and wraps everything in one module scope. Name collisions are an error.
   - Fingerprints: `name.<sha256:10>.ext`, SRI `sha384`.
5. Data shards and their manifest.
6. Render pages: towns run in a `worker_threads` pool (`availableParallelism()-1` = 3), everything else on the main thread.
7. `writeIfChanged`: compare against `.cache/bau-manifest.json`, prune orphaned files.
8. Write sitemaps (index plus one per Bundesland), `robots.txt`, `.well-known/security.txt`, `_headers`, `_redirects`, `.htaccess`, `hosting/nginx/*`, `404.html` and `site.webmanifest`.
9. With `--pruefen` or `--release`, run all checks in `bau/pruefen/`.

**Flags:** `--release`, `--stichprobe=N` (fixed sample: Weilburg, the 50 nearest, every k-th place), `--nur=<pfad>`, `--jobs=N`, `--datum=YYYY-MM-DD`, `--basis-url=`.

**Time target (ANNAHME):** full build ≤ 20 s, `--stichprobe=200` ≤ 3 s.

**Determinism**
- No `Date.now()` or `Math.random()` in `bau/` or `src/`; the source linter enforces this.
- The date defaults to the HEAD commit date (`git log -1 --format=%cI`).
- Text variants are chosen by `fnv1a(id+blockId) % n`.
- Sorting uses `Intl.Collator('de')`; keys are sorted; line endings are LF.
- `lastmod` comes from `src/daten/lastmod.json` (content hash plus date), which is updated only in release mode.
- A test builds twice and requires identical tree hashes.

**Release mode**
- `platzhalter('Telefon')` produces the sentinel `⟦PLATZHALTER:Telefon⟧`.
- Preview builds render a visibly marked placeholder, add `noindex` (meta and `X-Robots-Tag`) to every page, and write a `robots.txt` with `Disallow: /`.
- `--release` fails with exit code 1 and lists the config paths if any of these holds:
  - a placeholder remains in the config tree or in the output (`⟦PLATZHALTER`);
  - `basisUrl` is not `https://` or is a placeholder;
  - the security.txt `Expires` would be less than 30 days away;
  - any check is red.

**Dev server (`bau/vorschau.mjs`)**
- `node:http` on 127.0.0.1:4173, maps `/x/` → `/x/index.html`.
- Uses exactly the headers from `src/konfig/sicherheit.mjs`.
- Path traversal guard: `resolve()` and `startsWith(dist)`.
- No live-reload script.
- The preinstalled `serve` and `http-server` are not used because they cannot apply our headers.

**URLs**
- Town: `/schluesseldienst/<slug>/`.
- Hubs: `/einsatzgebiet/`, `/einsatzgebiet/<land>/`, `/einsatzgebiet/<land>/<kreis>/`.
- NL towns: `/slotenmaker/<slug>/` with `lang="nl"` (ANNAHME; the language decision goes to MENSCHEN.md).
- Click depth to a town is ≤ 4 (home, area, Land, Kreis, town). Neighbour links come on top of that.

## 3. Place-data pipeline (`pipeline/orte/`, run with `node pipeline/orte/alle.mjs`)
**00-laden**
- GeoNames `dump/DE.zip`, `zip/DE.zip`, `dump/NL.zip`, `zip/NL.zip` (ANNAHME: the NL files are reachable) go to `.cache/geonames/`.
- SHA-256 is recorded on first download (TOFU) in `quellen.lock.json`; later downloads are compared against it.
- Unpacking uses `execFile('unzip')` without a shell.

**10-quellen**
- Richter Standorte: regex over the anchor tags; the Bundesland comes from the preceding `role="tab"` heading.
- Richter sitemap: `<loc>` entries.
- Adam: `<loc>` entries plus the last `<!-- === GRUPPE === -->` comment before each.
- Minimal entity decoder.
- Assertions: 5,308 / 5,357 / 532 records, otherwise abort.

**20-index**
- Keep feature class P (PPL, PPLA–PPLA4, PPLC, PPLX) and A.ADM3/ADM4.
- ANNAHME, verified with 5 samples during the run: admin1 = Land, admin3 = Kreis, admin4 = Gemeinde (AGS).
- Merge an ADM4 and a PPL with the same key within 5 km into one entity: id `gn:<PPL-id>`, AGS taken from the ADM4.

**Normalisation (`src/assets/js/logik/normalisieren.mjs`, also used by the client)**
```
key(s): NFC → toLocaleLowerCase('de') → ä→ae ö→oe ü→ue ß/ẞ→ss → NFD, strip \p{M} (ë→e, é→e)
        → abbreviations: ^st\.?\s→sankt, \bi\.\s?→im, \ba\.\s?d\.\s?→an der, \bv\.\s?d\.\s?h\.→vor der hoehe, \bb\.\s?→bei
        → [^a-z0-9]+→'-' → trim '-'
kern(s): before key, remove "(…)", ", …", " (am|an der|im|in|bei|ob der|vor der) …", "/…"
```
Only forward transliteration is used. Adam slugs are never transliterated back (that would break Soest, Uelzen, Kues).

**30-abgleich (matching)**

Parsing per record into `{name, gemeindeHint, landHint, regionHint}`:
- "A, B" → name A, municipality B.
- If the Land is in {Bremen, Berlin, Hamburg} and A equals the city → swap.
- A "Berlin X" / "Berlin-X" prefix is removed if X resolves outside Berlin; the correction is logged.
- Slug suffix `-\d+$` is removed.
- "(Hessen)" becomes a Land hint; "(Baden|Taunus|Niederrhein)" become region hints.
- Adam slug `a-b`: try the full slug, then (name a, municipality b), (name b as a Stadtteil of a), and (a with region b). The best score wins.
- Adam regions: `regeln.json` maps each group to Kreis keys. "GROSSSTÄDTE UMKREIS" and "SONDERSLUGS" have none.
- Hard filter for Adam: ≤ 120 km from Hochheim (50.010, 8.353).

Scoring:

| Criterion | Points |
|---|---|
| `key` hit | 10 |
| `kern` hit only | 6 |
| alternatename hit | 4 |
| Municipality consistent (admin4 key equal, or ≤ 12 km from the resolved municipality) | +4 (−10 if inconsistent) |
| Land match | +3 (soft, because of the Berlin errors) |
| Region match | +3 |
| PPLA*/PPLC | +2 |
| PPL/ADM4 | +1 |
| Population | +min(2, log10(pop+1)/3) |

- Accept if the best score is ≥ 12 and leads the runner-up by ≥ 3. Otherwise the record goes to `orte-unklar.json` with its top 3 candidates, and a summary goes to MENSCHEN.md.
- Unresolved places are not published.
- `zuordnung-manuell.json` maps a source key to a geonameid or `"verwerfen"`.
- Deduplication is by id, keeping the union of sources (R/A/U). Examples: Adam `hoechst` (Odenwald group) and Richter "Höchst im Odenwald" become one place, while `frankfurt-hoechst` stays separate; Mainz-Kastel and Wiesbaden-Kastel merge.

**40-umkreis**
- `umkreisKm` (ANNAHME 30) around Weilburg; coordinates come from GeoNames, not hardcoded.
- Adds every DE P or ADM4 feature not yet included.
- Excluded: PPLH, PPLQ, PPLW.
- Names matching `/(mühle|hof|forsthaus|hütte)$/` with population 0 go to the review list instead.

**50-anreichern**
- PLZ: postal entries whose place key matches the name or municipality within 10 km; otherwise the nearest postal centroid within 4 km.
- Kreis, Land, lat/lon rounded to 4 decimals.
- Distance: haversine with R = 6371.0088 km.
- Bearing in 8 sectors ("nordöstlich").
- `zone` from `zonen.mjs` (ANNAHME A ≤ 15, B ≤ 30, C ≤ 60, D > 60 km; boundaries use `<=`).
- `nachbarn`: k = 8 using a 0.25° grid index, ties broken by id.
- `ortsteile[]` for each municipality.
- Population is not displayed.

**60-slugs**
- Base slug: `key(name)` for a municipality, `key(name-gemeinde)` for an Ortsteil.
- On collision, all colliding entries get `-<kreiskurz>` (Kreis key without `landkreis-`/`kreis-`), then `-<minPLZ>`.
- Reserved: `einsatzgebiet leistungen preise ratgeber kontakt …`
- `slug-register.json` is append-only per id. If a slug changes, the old one goes into `weiterleitungen.json`, from which 301s are generated.

**90-pruefen**
- Ids and slugs unique; coordinates inside the DE/NL bounding box.
- Every source record ends up matched, merged or unclear (none dropped).
- Report written to `_werkstatt/berichte/orte-abgleich.md`.

**Record format**

`{"id":"gn:…","slug":"ahausen-weilburg","name":"Ahausen","gemeinde":"Weilburg","kreis":"Landkreis Limburg-Weilburg","land":"Hessen","staat":"DE","plz":["35781"],"lat":50.47,"lon":8.29,"km":3,"richtung":"südöstlich","zone":"A","typ":"ortsteil","quellen":["R","U"],"nachbarn":[…]}`

## 4. Security
**CSP (header)**
```
default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self';
manifest-src 'self'; form-action mailto:; frame-ancestors 'none'; base-uri 'none'; object-src 'none';
frame-src 'none'; worker-src 'none'; media-src 'none'; upgrade-insecure-requests;
require-trusted-types-for 'script'; trusted-types 'none'
```

**Meta CSP fallback**
- The same policy without `frame-ancestors`. Otherwise the browser logs a console error, which costs Lighthouse Best Practices points.
- It comes directly after `<meta charset>`.
- It is always emitted; the browser enforces the intersection with the header.
- Limits of the meta version: no `frame-ancestors` or reporting, and no HSTS, XFO, XCTO, COOP/COEP/CORP or Permissions-Policy. Only `<meta name="referrer" content="no-referrer">` is possible in addition.

**JSON-LD and data blocks**
- `application/ld+json` and `application/json` data blocks are not executed, so CSP and Trusted Types do not apply to them.
- Read only with `JSON.parse(el.textContent)`.

**Further rules**
- No `style=` attributes and no `<style>` elements; icons are inline SVG cleaned with svgo (no `style`).
- SRI on `script type=module` and the stylesheet.
- Data shards use `fetch(url, {integrity})`.
- No dynamic `import()`, no import map.

**Headers**

| Header | Value |
|---|---|
| Strict-Transport-Security | `max-age=63072000; includeSubDomains` (`; preload` only after sign-off in MENSCHEN.md) |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| Referrer-Policy | `no-referrer` |
| Cross-Origin-Opener-Policy | `same-origin` |
| Cross-Origin-Embedder-Policy | `require-corp` |
| Cross-Origin-Resource-Policy | `same-origin` |
| Origin-Agent-Cluster | `?1` |
| X-Permitted-Cross-Domain-Policies | `none` |
| X-DNS-Prefetch-Control | `off` |
| Permissions-Policy | `accelerometer=(), autoplay=(), browsing-topics=(), camera=(), clipboard-read=(), clipboard-write=(), compute-pressure=(), display-capture=(), encrypted-media=(), fullscreen=(), gamepad=(), geolocation=(), gyroscope=(), hid=(), identity-credentials-get=(), idle-detection=(), local-fonts=(), magnetometer=(), microphone=(), midi=(), otp-credentials=(), payment=(), picture-in-picture=(), publickey-credentials-create=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), storage-access=(), sync-xhr=(), usb=(), web-share=(), window-management=(), xr-spatial-tracking=()`. The smoke test fails on "Unrecognized feature" and the list is pruned against the installed Chromium. |
| Cache-Control | HTML `no-cache`; `/assets/*`, `/daten/*`: `public, max-age=31536000, immutable`; robots/sitemaps `public, max-age=3600` |
| X-Robots-Tag | `noindex` on `/daten/*` (in preview builds: whole site) |

**Host configs, all generated from `src/konfig/sicherheit.mjs`**
- **`dist/_headers` (Netlify / Cloudflare Pages):** CSP and the other headers only under `/*`; Cache-Control only for `/assets/*` and `/daten/*`. Both hosts join headers from several matching rules with commas, so no Cache-Control under `/*`.
- **`dist/.htaccess` (Apache):**
  - `Options -Indexes -MultiViews`, `DirectoryIndex index.html`, `ErrorDocument 404 /404.html`.
  - `Header always set …`, `Header unset X-Powered-By`.
  - HTTPS and canonical-host 301 via mod_rewrite.
  - `<FilesMatch "^_(headers|redirects)$">Require all denied</FilesMatch>`.
  - `AddType text/javascript .js`, `AddType font/woff2 .woff2`, `AddCharset utf-8 .html .css .js .json .xml .txt`.
- **`hosting/nginx/sicherheit-header.conf`:** `add_header … always;`, included in every `location`, because `add_header` is not inherited into blocks that define their own. Plus `server_tokens off`, `error_page 404 /404.html`, `try_files $uri $uri/index.html =404`.

**No third-party requests at all**
- Fonts: @fontsource woff2 (latin + latin-ext), self-hosted, with `OFL.txt`.
- No Maps, YouTube or analytics; no cookies or storage, so no cookie banner is needed.
- GeoNames attribution as a plain link with `rel="noopener noreferrer"`.

**security.txt:** `Contact: mailto:<config>`, `Expires: <build date + 365 d>`, `Preferred-Languages: de, en`, `Canonical: https://<domain>/.well-known/security.txt`.

**robots.txt:** `Allow: /`, `Disallow: /daten/`, `Sitemap: …`.

**Contact without a backend**
- Without JS: `<form action="mailto:<config>" method="get">` with fields named `subject` and `body`. Per the HTML spec ("mail with headers") the browser builds `?subject=…&body=…` with `%20`.
- With JS: name, phone, callback preference and message are composed into the body.
- Plain `tel:` and `mailto:` links are always visible as well.

**Supply chain**
- `bau/`, `src/` and `pipeline/` may import only `node:` modules and relative files; a test enforces this.
- `_werkstatt/werkzeuge/` has exact pins, a lockfile and `.npmrc` (`ignore-scripts=true`, `save-exact=true`), installed with `npm ci --ignore-scripts`. Contents: axe-core, lighthouse, svgo, vnu-jar, @fontsource/*.
- Font checksums are recorded in `src/assets/schriften/PRUEFSUMMEN.txt`.

**Security linter (`bau/pruefen/sicherheit.mjs`, any violation means exit 1)**
- S01 `<script>` only with `src`, or as a data block. Data blocks must not contain `</` or `<!--`.
- S02 SRI is present and matches the file hash.
- S03 no `on*=` attributes.
- S04 no `style=` and no `<style>`; no `url(data:` in CSS.
- S05 no `javascript:`, `data:` or `vbscript:` in href, src, action, formaction, srcset or xlink:href.
- S06 resource URLs only same-origin. External `<a>` only from the allowlist (geonames.org, creativecommons.org) and with `rel="noopener noreferrer"`.
- S07 no iframe, object, embed, frame, base or `meta refresh`.
- S08 the meta CSP is identical to the config and is the first resource-relevant element.
- S09 secret patterns in every dist file: `AIza[0-9A-Za-z_-]{35}`, `google-site-verification`, `\bG-[A-Z0-9]{6,}\b`, `UA-\d+-\d+`, `GTM-[A-Z0-9]+`, `AKIA[0-9A-Z]{16}`, `-----BEGIN [A-Z ]*PRIVATE KEY`, `gh[pousr]_[A-Za-z0-9]{30,}`, JWT `eyJ…\.…\.`. Additionally, the competitor tokens and phone numbers are extracted from the scrapes at check time and matched exactly, plus "richter-sicherheitstechnik", "schluesseldienst-adam", "Richter Sicherheitstechnik" and "Schlüsseldienst Adam". The literal values are never stored anywhere else.
- S10 placeholders (release: error; preview: warning).
- S11 `lang`, charset first; viewport without `maximum-scale` or `user-scalable=no`.
- S12 forms only with `action^="mailto:"` and `method=get`; `autocomplete` set.
- S13 no HTML comments.
- S14 file allowlist: no `.map`, `.md`, `.mjs` sources, `orte.json`, or anything from `_werkstatt`, Richter or Adam paths; no dotfiles except `.htaccess` and `.well-known/`.
- S15 shard JSON parses and has the expected schema.
- S16 `_headers`, `.htaccess` and nginx config have the same CSP and headers.
- S17 no `target=_blank` without `noopener`.
- S18 `tel:` matches `^\+49\d+$`; `mailto:` equals the config address.
- S19 no `http://` except in XML namespaces.
- S20 JS assets: no `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function`, `import(` or string `setTimeout`. `location.assign` only in the mailto module; `fetch(` only to `/daten/`.
- S21 release: no `noindex` on pages meant to be indexed.

## 5. Client JS
One flattened `app.<hash>.js` (`type=module`, SRI). Features are initialised via `[data-modul]`, and the DOM is only touched with `createElement` and `textContent`.

| Module | Function | Budget (gz) |
|---|---|---|
| kern | registry, `$`, debounce | 1 KB |
| ortssuche | ARIA 1.2 combobox, results are `<a>` links, ≤ 8 hits, 120 ms debounce. Index manifest (`daten/orte/manifest.<hash>.json`, about 3 KB, its SRI known to app.js) prefetched on focus. Shards by first letter of `key` (27 shards; largest about 30 KB raw / 8 KB gz; record `[name, zusatz, slug]`). Hit order: prefix, then word start, then PLZ. Second key variant without the umlaut e ("munchen"). Without JS, a link to `/einsatzgebiet/` is shown. | 3 KB |
| plz-check | 5 digits → `daten/plz/<2 digits>.<hash>.json` (about 95 shards, 1–3 KB each) → `[km, zone, slug]` → honest zone text from the config | 1.5 KB |
| preisrechner | data block `#preisdaten` from `preise.mjs`; integer cents; surcharges rounded half-up; shows "Preise folgen" while placeholders remain | 2.5 KB |
| mailto | `baueMailto()`: `encodeURIComponent`, CR/LF stripped from the subject, `%0D%0A` in the body, body capped at 1,800 chars, recipient only from config | 1.5 KB |
| navigation | `popover` / `popovertarget`; no JS needed | 0 |
| FAQ / accordion | `<details name="…">` (exclusive groups); no JS needed | 0 |

**Totals:** JS ≤ 12 KB gz, CSS ≤ 10 KB gz, town page HTML ≤ 25 KB raw, preloaded fonts ≤ 2 files and ≤ 60 KB.

## 6. Tests
**`node --test test/`**
- `html.test.mjs`: escaping, `Roh`, objects throw, URL scheme allowlist, `jsonLd` with `</script>` and U+2028.
- `slug.test.mjs`: "Höchst im Odenwald"→`hoechst-im-odenwald`, "Aura i.Sinngrund"→`aura-im-sinngrund`, "Ober Ramstadt" and "Ober-Ramstadt" give the same key, "Mariënburg", "ẞ", collision qualification, reserved slugs, register stability.
- `abgleich.test.mjs`, using a small hand-written gazetteer fixture: Bremen swap, Hennigsdorf → Brandenburg, Adam `hoechst` in the Odenwald group, "Hausen" → unclear, `-1788` suffix, ADM4/PPL merge, Kastel merge.
- `geo.test.mjs`: Weilburg–Wetzlar ≈ 19 km (±1.5), bearing, distance 0, zone boundaries.
- `preise.test.mjs`, `mailto.test.mjs` (header injection, `&`, `#`, `?`), `ortsindex.test.mjs` (client and build share one key function).
- `platzhalter.test.mjs`, `csp.test.mjs` (header parity), `flatten.test.mjs`, `quelltext.test.mjs` (imports, `roh(`, `Date.now`).
- `determinismus.test.mjs` (sample built twice).

**Checks over dist (`bau/pruefen/`)**
- `links`: all href/src/#ids resolve; BFS from home reaches every page, towns at depth ≤ 4; canonical points to itself; sitemap equals the set of indexable pages.
- `html`: vnu.jar via Java; all non-town pages plus a 300-town sample, full run on release.
- `jsonld`: parse, @context, allowed types (Locksmith with one `@id`, Service, BreadcrumbList, WebSite, WebPage, Offer); positions and URLs exist. `aggregateRating` / `review` are forbidden.
- `ehrlichkeit`: forbids minute claims, "Sterne", "★", "zertifiziert", "seit \d{4}", "Jahre Erfahrung", and "vor Ort in" on zone C/D pages, unless a config fact backs it.
- `plagiat`: 7-word shingles (FNV-32) from all competitor markdown against all `src/inhalte` variants and the rendered core pages. Any hit fails, except phrases on the allowlist `src/konfig/plagiat-erlaubt.txt`.
- `budgets`.

**`_werkstatt/werkzeuge/`**
- `smoke.mjs` (Playwright against `vorschau`, about 20 URLs):
  - aborts every non-localhost request, which must stay at 0;
  - 0 console errors or CSP violations;
  - search for "weilb" finds Weilburg; PLZ 35781 gives zone A; price calculator; mailto href captured; 375 px nav; reduced-motion.
- `axe.mjs`: separate context with `bypassCSP: true`, because the injection would trip Trusted Types.
- `lighthouse.mjs`: Chromium from `chromium.executablePath()`, mobile, 3-run median. Targets: Perf ≥ 95, A11y/BP/SEO = 100, LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms.
- `vorher.mjs`: competitor baseline, ≤ 6 URLs, 5 s spacing, results only to `_werkstatt/berichte/vorher/`.

## 7. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Doorway / scaled-content penalty | Facts only from data, neighbour and municipality links, Kreis hubs; config switch `indexierung.maxKm` (noindex,follow) as an emergency lever; submit sitemaps per Land in waves (MENSCHEN.md) |
| Wrong matches lead to wrong facts | Score threshold and margin, unclear places not published, check 100 random places in ABNAHME |
| Competitor text or brands leak | Pipeline copies only names; plagiarism check, S09 |
| Hosting unknown, headers missing | Four config forms plus meta fallback; MENSCHEN.md: pick a host that supports headers |
| Permissions-Policy or meta-CSP console errors | Smoke test checks the console; list pruned |
| Determinism across Node/ICU versions | Pin `.node-version` 22, fixed `de-DE` options, determinism test |
| File limits (Cloudflare 20k) | No pre-compression by default |
| Slug changes after launch | Register plus 301 generation |
| Placeholders reach production | `--release` fails, previews are noindex |
| clipboard-write is denied | No copy button, deliberately |
| NL pages (language, law) | ANNAHME Dutch; decision in MENSCHEN.md |

### Critical Files for Implementation
- /home/user/schluesseldienst/bau/lib/html.mjs
- /home/user/schluesseldienst/bau/bauen.mjs
- /home/user/schluesseldienst/pipeline/orte/30-abgleich.mjs
- /home/user/schluesseldienst/src/konfig/sicherheit.mjs
- /home/user/schluesseldienst/bau/pruefen/sicherheit.mjs