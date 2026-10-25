// V11 Sitemap: vollständige HTML-Sitemap nach Bereichen (Themenpass /sitemap/). Abschnittsfolge:
// Kopf · Start und Hauptseiten · Leistungen (Gruppen mit ihren Leistungen) · Ratgeber (nur gebaute Artikel) ·
// Einsatzgebiet (alle Länder mit ihren Kreisen, Orte stehen in den Verzeichnissen) · Rechtliches.
// Hauptseiten und Rechtliches aus ROUTEN (ohne indexierbar: false und ohne bedingung); Namen der Kreise wie in hub.mjs.
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import inhalt from '../../inhalte/sitemap.mjs';
import { GRUPPEN } from '../../konfig/leistungen.mjs';
import { ROUTEN, route } from '../../konfig/routen.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';
import { artikelLaden } from './artikel.mjs';
import { kreisName } from './hub.mjs';

const ZEICHEN = new Intl.Collator('de');
// Wie in hub.mjs: Kreise nach dem Namenskern sortieren („Limburg-Weilburg“ unter L, nicht unter „Landkreis“)
const ART = /^(Landkreis|Kreis|Stadtkreis|Städteregion|Region|Kreisfreie Stadt)\s+(.+)$/;
const kern = (titel) => { const m = ART.exec(titel); return m ? m[2] : titel; };

// Länder mit ihren Kreisen. Stadtstaaten (Kreis = Land) haben im Einsatzgebiet keine eigene Kreisseite.
function laenderBaum(orte) {
  const laender = new Map();
  for (const o of orte) {
    if (!o.slug) continue;
    if (!laender.has(o.landSlug)) laender.set(o.landSlug, { titel: o.land, landSlug: o.landSlug, kreise: new Map() });
    const l = laender.get(o.landSlug);
    if (o.kreisSlug && o.kreisSlug !== o.landSlug && !l.kreise.has(o.kreisSlug)) l.kreise.set(o.kreisSlug, { titel: o.kreis, kreisSlug: o.kreisSlug });
  }
  return [...laender.values()]
    .sort((a, b) => (a.titel === 'Niederlande') - (b.titel === 'Niederlande') || ZEICHEN.compare(a.titel, b.titel))
    .map((l) => ({ ...l, kreise: [...l.kreise.values()].sort((a, b) => ZEICHEN.compare(kern(a.titel), kern(b.titel))) }));
}

// Hauptseiten: alle Seiten des Hauptbereichs aus dem Routenregister, ohne Rechtliches, Suche, 404 und bedingte Routen
const HAUPT = ROUTEN.filter((r) => ['seiten', 'hubs'].includes(r.sitemap) && r.ansicht !== 'V12' && !r.bedingung && r.indexierbar !== false);
const RECHT = ROUTEN.filter((r) => r.sitemap === 'seiten' && r.ansicht === 'V12' && r.indexierbar !== false);

const liste = (eintraege, klasse = 'verz-links') => html`<ul class="${klasse}">${eintraege.map((e) => html`<li><a href="${e.pfad}">${e.titel}</a></li>`)}</ul>`;

function bereich(id, klasse, titel, einleitung, teil) {
  return html`<section class="${klasse}" aria-labelledby="${id}"><div class="raster">
${abschnittKopf({ id, titel, einleitung })}
${teil}
</div></section>`;
}

function leistungenTeil() {
  return html`${liste([{ pfad: '/leistungen/', titel: route('/leistungen/').titel }])}
<div class="verz-gruppen">${GRUPPEN.map((g) => html`<div class="verz-gruppe-liste"><h3><a href="${g.pfad}">${g.titel}</a></h3>${liste(g.leistungen.map((l) => ({ pfad: l.pfad, titel: l.titel })), 'verz-links')}</div>`)}</div>`;
}

function ratgeberTeil(artikel) {
  return liste([{ pfad: '/ratgeber/', titel: route('/ratgeber/').titel }, ...artikel.map((a) => ({ pfad: a.pfad, titel: a.inhalt.h1 }))], 'verz-links verz-spalten');
}

function gebietTeil(laender) {
  return html`<div class="verz-laender">${laender.map((l) => html`<div class="verz-land">
<h3><a href="/einsatzgebiet/${l.landSlug}/">${l.titel}</a></h3>
${l.kreise.length ? html`<ul class="verz-links verz-spalten">${l.kreise.map((kr) => html`<li><a href="/einsatzgebiet/${l.landSlug}/${kr.kreisSlug}/">${kreisName(kr.titel)}</a></li>`)}</ul>` : ''}
</div>`)}</div>`;
}

export async function seiten(k) {
  const artikel = await artikelLaden(k.wurzel);
  const laender = laenderBaum(k.daten.orte || []);
  const stufen = [{ titel: 'Sitemap', pfad: '/sitemap/' }];
  const url = `${k.basisUrl}/sitemap/`;
  const b = inhalt.bereiche;
  const e = inhalt.einleitungen;
  return [{
    pfad: '/sitemap/', titel: inhalt.titel, beschreibung: inhalt.beschreibung, typ: 'arbeit', ansicht: 'V11', sitemap: 'seiten',
    koerperKlasse: 'seite-sitemap', stile: ['verzeichnis'], brotkrumen: stufen,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#seite`, name: inhalt.titel, url, inLanguage: 'de', about: { '@id': `${k.basisUrl}/#betrieb` } },
      brotkrumenLd(k.basisUrl, stufen),
    ],
    inhalt: () => html`<section class="verz-kopf" aria-labelledby="sitemap-h1"><div class="raster">
<span class="scherlinie scherlinie-leit kopf-linie" aria-hidden="true"></span>
<p class="gruppe-kicker">${inhalt.kicker}</p>
<h1 id="sitemap-h1">${inhalt.h1}</h1>
<p class="gruppe-einleitung">${text(inhalt.einleitung)}</p>
</div></section>
${bereich('bereich-haupt-titel', 'sektion-dicht band', b.haupt, null, liste(HAUPT.map((r) => ({ pfad: r.pfad, titel: r.titel }))))}
${bereich('bereich-leistungen-titel', 'sektion-dicht', b.leistungen, e.leistungen, leistungenTeil())}
${bereich('bereich-ratgeber-titel', 'sektion-dicht band', b.ratgeber, null, ratgeberTeil(artikel))}
${bereich('bereich-einsatzgebiet-titel', 'sektion', b.einsatzgebiet, e.einsatzgebiet, gebietTeil(laender))}
${bereich('bereich-rechtliches-titel', 'sektion-dicht band', b.rechtliches, null, liste(RECHT.map((r) => ({ pfad: r.pfad, titel: r.titel }))))}`,
  }];
}
