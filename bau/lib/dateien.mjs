// Begleitdateien: Sitemaps, robots.txt, security.txt, Webmanifest.
const xmlEsc = (s) => String(s).replace(/[&<>"']/g, (z) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[z]);

/** gruppen: Map name → [{loc, lastmod}] */
export function sitemaps(basis, gruppen) {
  const dateien = {};
  const index = [];
  for (const [name, urls] of [...gruppen.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (!urls.length) continue;
    const pfad = `/sitemaps/${name}.xml`;
    dateien[pfad] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      + urls.map((u) => `<url><loc>${xmlEsc(basis + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n') + '\n</urlset>\n';
    const neueste = urls.map((u) => u.lastmod).filter(Boolean).sort().at(-1);
    index.push(`<sitemap><loc>${xmlEsc(basis + pfad)}</loc>${neueste ? `<lastmod>${neueste}</lastmod>` : ''}</sitemap>`);
  }
  dateien['/sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + index.join('\n') + '\n</sitemapindex>\n';
  return dateien;
}

export function robots(basis, indexierbar) {
  if (!indexierbar) return 'User-agent: *\nDisallow: /\n';
  return `User-agent: *\nAllow: /\n\nSitemap: ${basis}/sitemap.xml\n`;
}

export function securityTxt(basis, kontakt, datum) {
  const ablauf = new Date(Date.parse(datum) + 365 * 864e5).toISOString().replace(/\.\d{3}Z$/, '.000Z');
  return `Contact: mailto:${kontakt}\nExpires: ${ablauf}\nPreferred-Languages: de, en\nCanonical: ${basis}/.well-known/security.txt\n`;
}

export function manifest({ name, kurz, farbe, hintergrund, icon }) {
  return JSON.stringify({ name, short_name: kurz, lang: 'de', start_url: '/', display: 'browser', theme_color: farbe, background_color: hintergrund, icons: icon ? [{ src: icon, sizes: 'any', type: 'image/svg+xml' }] : [] }, null, 2) + '\n';
}
