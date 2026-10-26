// Dokumentgerüst jeder Seite: Kopfbereich mit Sicherheits-Meta, SEO, Assets mit SRI, JSON-LD;
// Körper mit Sprunglink, Kopf, Hauptinhalt, Fuß, Rufleiste und Icon-Symbolen.
import { html, roh, jsonBlock } from '../../bau/lib/html.mjs';
import { cspText } from '../konfig/sicherheit.mjs';
import { istPlatzhalter } from '../../bau/lib/platzhalter.mjs';
import { symbole } from './teile/icons.mjs';
import { kopf } from './teile/kopf.mjs';
import { fuss } from './teile/fuss.mjs';
import { rufleiste } from './teile/rufleiste.mjs';
import { brotkrumen } from './teile/brotkrumen.mjs';

function titelMitMarke(sk) {
  const { seite, konfig } = sk;
  const name = konfig.betrieb.name;
  if (seite.titelOhneMarke || istPlatzhalter(name)) return seite.titel;
  const mit = `${seite.titel} | ${name}`;
  return mit.length <= konfig.seo.titelMax ? mit : seite.titel;
}

// Ansichts-Stile der Seite (seite.stile): unbekannte Namen brechen den Build ab
function stile(seite, assets) {
  // mehrere Ansichts-Stile: die zusammengesetzte Datei „a+b“, wenn der Build sie angelegt hat
  const kombi = (seite.stile || []).length > 1 ? assets.ansichten?.[seite.stile.join('+')] : null;
  if (kombi) return [kombi];
  return (seite.stile || []).map((name) => {
    const a = assets.ansichten?.[name];
    if (!a) throw new Error(`Seite ${seite.pfad}: unbekannter Ansichts-Stil ${name}`);
    return a;
  });
}

export function layout(sk) {
  const { seite, konfig, assets, basisUrl, modus } = sk;
  const kanonisch = basisUrl + seite.pfad;
  const robots = modus === 'vorschau' || seite.indexierbar === false ? 'noindex, follow' : 'index, follow';
  const og = assets.pfad(seite.ogBild || konfig.seo.ogBild, { optional: true });
  const inhalt = seite.inhalt(sk);
  const krumen = seite.brotkrumen?.length ? brotkrumen(sk, seite.brotkrumen) : '';
  const ld = (seite.jsonld || []).filter(Boolean);
  const titel = titelMitMarke(sk);
  return html`<!doctype html>
<html lang="de" dir="ltr">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${cspText({ meta: true })}">
<meta name="referrer" content="no-referrer">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titel}</title>
<meta name="description" content="${seite.beschreibung}">
<link rel="canonical" href="${kanonisch}">
<meta name="robots" content="${robots}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="${konfig.seo.themeColor.hell}">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="${konfig.seo.themeColor.dunkel}">
<meta property="og:type" content="${seite.ogTyp || 'website'}">
<meta property="og:locale" content="${konfig.seo.locale}">
<meta property="og:title" content="${seite.titel}">
<meta property="og:description" content="${seite.beschreibung}">
<meta property="og:url" content="${kanonisch}">
${og ? html`<meta property="og:image" content="${basisUrl + og}">
<meta name="twitter:card" content="summary_large_image">` : ''}
${assets.schriftVorladen ? html`<link rel="preload" href="${assets.schriftVorladen}" as="font" type="font/woff2" crossorigin>` : ''}
<link rel="stylesheet" href="${assets.css.pfad}" integrity="${assets.css.sri}">
${stile(seite, assets).map((a) => html`<link rel="stylesheet" href="${a.pfad}" integrity="${a.sri}">
`)}${(assets.sonderstile ?? []).map((a) => html`<link rel="stylesheet" href="${a.pfad}" integrity="${a.sri}" media="${a.media}">
`)}<script type="module" blocking="render" src="${assets.js.pfad}" integrity="${assets.js.sri}"></script>
<link rel="icon" href="${assets.favicon}" type="image/svg+xml">
<link rel="manifest" href="/site.webmanifest">
${ld.map((o) => html`<script type="application/ld+json">${jsonBlock(o)}</script>
`)}</head>
<body class="${seite.koerperKlasse || ''}" data-ansicht="${seite.ansicht || ''}">
<a class="sprunglink" href="#inhalt">Zum Inhalt springen</a>
${kopf(sk)}
${rufleiste(sk)}
<main id="inhalt" tabindex="-1">
${krumen}${inhalt}
</main>
${fuss(sk)}
${symbole(sk)}
</body>
</html>
`;
}
