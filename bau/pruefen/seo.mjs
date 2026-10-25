// SEO-Prüfer: Titel/Beschreibung (Länge, Eindeutigkeit), genau eine H1, Überschriftenfolge,
// Canonical, Robots je Modus, Bilder mit alt, Sitemap = indexierbare Seiten.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const name = 'seo';

const dekodiere = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

export async function pruefe(ctx) {
  const befunde = [];
  const b = (regel, schwere, datei, meldung) => befunde.push({ regel: `seo/${regel}`, schwere, datei, meldung });
  const { titelMax, beschreibungMin, beschreibungMax } = ctx.konfig.seo;
  const titel = new Map();
  const beschreibungen = new Map();
  for (const s of ctx.seiten) {
    const h = s.html;
    const d = s.datei;
    const t = dekodiere((h.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
    const desc = dekodiere((h.match(/<meta name="description" content="([^"]*)">/) || [])[1] || '');
    if (!t) b('titel-fehlt', 'fehler', d, 'Kein <title>');
    if (!desc) b('beschreibung-fehlt', 'fehler', d, 'Keine Meta-Beschreibung');
    if (s.indexierbar) {
      // Ortsseiten: eigene Regel, nur Warnung – auch im Release (PLAN-GENEHMIGT, Slugs; ENTSCHEIDUNGEN D-SEO-04)
      if (t.length > titelMax) b(s.typ === 'ort' ? 'titel-laenge-ort' : 'titel-laenge', 'warnung', d, `Titel ${t.length} Zeichen (> ${titelMax}): ${t}`);
      if (desc && (desc.length < beschreibungMin || desc.length > beschreibungMax)) b('beschreibung-laenge', 'warnung', d, `Beschreibung ${desc.length} Zeichen (${beschreibungMin}–${beschreibungMax})`);
      if (titel.has(t)) b('titel-doppelt', 'fehler', d, `Titel doppelt mit ${titel.get(t)}: ${t}`); else titel.set(t, d);
      if (beschreibungen.has(desc)) b('beschreibung-doppelt', ctx.modus === 'release' ? 'fehler' : 'warnung', d, `Beschreibung doppelt mit ${beschreibungen.get(desc)}`); else beschreibungen.set(desc, d);
    }
    const main = (h.match(/<main\b[\s\S]*<\/main>/) || [''])[0];
    const h1 = (h.match(/<h1\b/g) || []).length;
    if (h1 !== 1) b('h1-anzahl', 'fehler', d, `${h1} H1-Überschriften`);
    let vorher = 1;
    for (const m of main.matchAll(/<h([1-6])\b/g)) {
      const stufe = Number(m[1]);
      if (stufe > vorher + 1) b('ueberschrift-sprung', 'fehler', d, `Sprung von h${vorher} auf h${stufe}`);
      vorher = stufe;
    }
    const kanon = (h.match(/<link rel="canonical" href="([^"]+)">/) || [])[1];
    if (!kanon) b('canonical-fehlt', 'fehler', d, 'Kein Canonical');
    else if (s.pfad !== '/404.html' && kanon !== ctx.basisUrl + s.pfad) b('canonical-falsch', 'fehler', d, `Canonical ${kanon} ≠ ${ctx.basisUrl + s.pfad}`);
    const robots = (h.match(/<meta name="robots" content="([^"]+)">/) || [])[1] || '';
    if (ctx.modus !== 'vorschau' && s.indexierbar && /noindex/.test(robots)) b('robots', 'fehler', d, 'Indexierbare Seite mit noindex');
    if (!s.indexierbar && !/noindex/.test(robots)) b('robots', 'fehler', d, 'Nicht indexierbare Seite ohne noindex');
    for (const img of h.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(img[0])) b('bild-alt', 'fehler', d, img[0].slice(0, 80));
    if (!/<html lang="de"/.test(h)) b('sprache', 'fehler', d, 'lang="de" fehlt');
  }
  // Sitemap = indexierbare Seiten
  if (ctx.modus !== 'vorschau' && ctx.dateien.includes('/sitemap.xml')) {
    const inSitemap = new Set();
    for (const datei of ctx.dateien.filter((x) => /^\/sitemaps\/.+\.xml$/.test(x))) {
      const xml = await readFile(join(ctx.dist, datei), 'utf8');
      for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) inSitemap.add(dekodiere(m[1]).slice(ctx.basisUrl.length));
    }
    for (const s of ctx.seiten) {
      if (s.indexierbar && !inSitemap.has(s.pfad)) b('sitemap-fehlt', 'fehler', s.datei, 'Indexierbare Seite fehlt in der Sitemap');
      if (!s.indexierbar && inSitemap.has(s.pfad)) b('sitemap-noindex', 'fehler', s.datei, 'Nicht indexierbare Seite in der Sitemap');
    }
  }
  return befunde;
}
