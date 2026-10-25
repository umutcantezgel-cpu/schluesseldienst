// V07 Ortsseite (Arbeitsansicht) für jeden veröffentlichten Ort aus src/daten/orte.json.
// Blöcke: Kopf mit Faktenzeile, Zonensatz, Handlung und Lagekarte · Leistungen der Zone · Preise (außer NL) ·
// Ortsteile bzw. Gemeinde und Nachbarorte · Orts-FAQ aus Daten · Hinweise (seriös erkennen, Landesregel, Quelle).
// Ehrliche Titel: ab Zone C nennen Titel, H1 und Meta Sitz und Entfernung. Kein Spinning: Varianz nur über Daten.
// Sonderseiten (z. B. Weilburg) ergänzen die Vorlage über src/inhalte/orte/<slug>.mjs.
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import { istPlatzhalter } from '../../../bau/lib/platzhalter.mjs';
import { GRUPPEN } from '../../konfig/leistungen.mjs';
import texte from '../../inhalte/orte/texte.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { faq } from '../teile/faq.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';
import { preistabelle, betrag } from '../teile/preisauszug.mjs';
import { rufknopf } from '../teile/rufknopf.mjs';
import { zusage } from '../teile/zusage.mjs';
import { lagekarte } from '../teile/lagekarte.mjs';
import { kreisName } from './hub.mjs';

const TITEL_MAX = 60;
const ZEICHEN = new Intl.Collator('de');
const km = (a, b) => {
  const r = Math.PI / 180; const s = Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lon - a.lon) * r) / 2) ** 2;
  return Math.round(12742 * Math.asin(Math.sqrt(s)));
};

let D = null; // vorbereitete Daten (je Build)

export function vorbereiten(k) {
  const orte = (k.daten.orte || []).filter((o) => o.slug);
  const nachId = new Map(orte.map((o) => [o.id, o]));
  // Anzeigename: Ortsteile mit Gemeinde, Namensdoppel zusätzlich mit Kreis (nie gekürzt)
  // Klammerzusätze im Gemeindenamen („Waldbrunn (Westerwald)“) werden zu „/“, damit keine Doppelklammern entstehen
  const ohneKlammer = (s) => s.replace(/\s*\(([^)]+)\)/g, '/$1');
  // Steht die Gemeinde schon im Namen („Brake (Lemgo)“), wird sie nicht noch einmal angehängt
  const hatGemeinde = (o) => o.name.includes(`(${o.gemeinde})`);
  const basis = (o) => (o.typ === 'ortsteil' && o.gemeinde && o.gemeinde !== o.name && !hatGemeinde(o) ? `${o.name} (${ohneKlammer(o.gemeinde)})` : o.name);
  const zaehler = new Map();
  for (const o of orte) zaehler.set(basis(o), (zaehler.get(basis(o)) || 0) + 1);
  const anzeige = new Map(orte.map((o) => {
    const b = basis(o);
    if (zaehler.get(b) === 1) return [o.id, b];
    return [o.id, o.typ === 'ortsteil' ? `${o.name} (${ohneKlammer(o.gemeinde)}, ${o.kreis})` : `${o.name} (${o.kreis})`];
  }));
  const sitz = orte.find((o) => o.slug === 'weilburg') || { lat: 50.4844, lon: 8.2625, name: 'Weilburg', km: 0 };
  // Kurzname nur für zu lange Titel: eindeutiger Ortsname allein, sonst Anzeige ohne „Landkreis“/„Kreis“
  const namen = new Map();
  for (const o of orte) namen.set(o.name, (namen.get(o.name) || 0) + 1);
  const kurz = new Map(orte.map((o) => [o.id, namen.get(o.name) === 1 ? o.name : anzeige.get(o.id).replace(/\b(?:Landkreis|Kreis) /g, '')]));
  D = { orte, nachId, anzeige, kurz, sitz };
  return D;
}

function zoneVon(k, o) {
  const { zonen } = k.konfig;
  if (o.staat === 'NL') return { ...zonen.stufen.find((z) => z.id === zonen.nl.wieZone), id: 'NL', titel: zonen.nl.titel, kurz: zonen.nl.kurz, nl: true };
  return zonen.stufen.find((z) => z.id === o.zone);
}

const fuellen = (vorlage, werte) => vorlage.replace(/\{(\w+)\}/g, (_, n) => (werte[n] ?? ''));

function werteVon(o, z) {
  const plz = o.plz || [];
  return {
    ort: D.anzeige.get(o.id), name: o.name, gemeinde: o.gemeinde, kreis: o.kreis, land: o.land, km: String(o.km),
    richtung: o.richtung || '', zone: z.nl ? 'D' : z.id, zonenKurz: z.kurz,
    plz: plz.join(', '), plzSatz: plz.length === 1 ? `gilt die Postleitzahl ${plz[0]}` : `gelten die Postleitzahlen ${plz.join(', ')}`,
  };
}

function titelVon(o, z, name) {
  const nl = z.nl ? ' (NL)' : '';
  const reihe = (n) => (z.id === 'A'
    ? [`Schlüsseldienst ${n}: Türöffnung, Schlösser, Sicherheit`, `Schlüsseldienst ${n}: Türöffnung und Schlösser`, `Schlüsseldienst ${n}`]
    : z.id === 'B'
      ? [`Schlüsseldienst ${n} – aus Weilburg, ${o.km} km`, `Schlüsseldienst ${n}, ${o.km} km ab Weilburg`, `Schlüsseldienst ${n} (${o.km} km)`]
      : [`Schlüsseldienst für ${n}${nl} – aus Weilburg (≈ ${o.km} km)`, `Schlüsseldienst ${n}${nl} – aus Weilburg, ${o.km} km`, `Schlüsseldienst ${n}${nl}, ${o.km} km ab Weilburg`]);
  const kurz = D.kurz.get(o.id);
  const kandidaten = [...reihe(name), ...(kurz !== name ? reihe(kurz) : [])];
  return kandidaten.find((t) => t.length <= TITEL_MAX) || kandidaten.at(-1);
}

function beschreibungVon(o, z, name) {
  const s = z.id === 'A'
    ? [`Schlüsseldienst für ${name}: Türöffnung, Schlosstausch und Einbruchschutz aus Weilburg, rund ${o.km} km entfernt.`, 'Preise offen, Ablauf klar.']
    : z.id === 'B'
      ? [`${name} liegt rund ${o.km} km von Weilburg: Türöffnung, Schlosstausch und Einbruchschutz mit Anfahrt aus dem Umland.`, 'Preise und Zone im Überblick.']
      : [`Schlüsseldienst aus Weilburg für ${name} (≈ ${o.km} km): planbare Arbeiten wie Schlosstausch und Einbruchschutz nach Absprache.`, 'Entfernung und Zone.'];
  const ganz = s.join(' ');
  return ganz.length <= 155 ? ganz : s[0].length <= 155 ? s[0] : `${s[0].slice(0, 152)}…`;
}

function zonenSatz(o, z, werte) {
  if (o.km === 0) return text(`${werte.ort} ist der Sitz unseres Betriebs.`);
  return text(fuellen(z.satz, werte));
}

function kopf(sk, o, z, werte, sonder) {
  const pfad = (x) => `/schluesseldienst-${x.slug}/`;
  const gemeinde = o.typ === 'ortsteil' ? D.nachId.get(o.gemeindeId) : null;
  const fakten = [
    o.typ === 'ortsteil'
      ? html`<li>Ortsteil von ${gemeinde ? html`<a href="${pfad(gemeinde)}">${o.gemeinde}</a>` : o.gemeinde}</li>`
      : html`<li>Gemeinde</li>`,
    o.kreis && o.kreis !== o.land ? html`<li>${o.kreis}</li>` : '',
    html`<li>${o.land}</li>`,
    o.plz?.length ? html`<li>PLZ <span data-daten="">${o.plz.join(', ')}</span></li>` : '',
    o.km > 0 ? html`<li><span data-daten="">${String(o.km)}</span>&nbsp;km ${o.richtung || ''} von Weilburg</li>` : html`<li>Sitz des Betriebs</li>`,
  ];
  const nah = z.notoeffnung === 'ja';
  const h1Text = sonder?.h1 || (z.id === 'A' || z.id === 'B' ? `Schlüsseldienst für ${werte.ort}` : `Schlüsseldienst für ${werte.ort} – aus Weilburg (≈ ${o.km} km)`);
  return html`<section class="ort-kopf" aria-labelledby="ort-titel">
<div class="raster"><div class="ort-kopf-teilung">
<div>
<span class="scherlinie scherlinie-leit kopf-linie" aria-hidden="true"></span>
<p class="ort-kicker">${texte.kicker} · Zone ${z.nl ? 'NL' : z.id} – ${z.kurz}</p>
<h1 id="ort-titel"${h1Text.length > 44 ? html` class="ort-h1-lang"` : ''}>${h1Text.split('/').map((t, i) => (i ? html`/<wbr>${t}` : t))}</h1>
<ul class="ort-fakten">${fakten}</ul>
<p class="ort-satz">${sonder?.einleitung ? text(sonder.einleitung) : zonenSatz(o, z, werte)}${z.id === 'B' ? html` ${zusage(sk, 'preisVorAuftrag', 'Den Gesamtpreis mit Anfahrt nennen wir Ihnen am Telefon, bevor wir losfahren.', 'Fragen Sie am Telefon nach dem Gesamtpreis mit Anfahrt.')}` : ''}</p>
<div class="ort-handlung">${nah ? rufknopf(sk, { variante: 'gross' }) : html`<a class="knopf knopf-primaer" href="/kontakt/">Planbare Arbeit anfragen${sk.icon('pfeil-rechts')}</a>`}<a class="knopf knopf-still" href="/preise/">Preise ansehen</a></div>
</div>
<figure class="ort-karte">${lagekarte({ ort: { ...o, name: o.name }, sitz: D.sitz, nachbarn: (o.nachbarn || []).map((id) => D.nachId.get(id)).filter(Boolean), praefix: 'ort-lk' })}</figure>
</div></div>
</section>`;
}

function leistungen(sk, o, z, werte) {
  const nah = z.notoeffnung === 'ja';
  const gruppen = nah ? GRUPPEN : GRUPPEN.filter((g) => g.id !== 'notoeffnung');
  const bestaetigt = z.leistungenBestaetigt;
  if (bestaetigt === false) return '';
  return html`<section class="sektion sektion-dicht band" aria-labelledby="ort-leistungen">
<div class="raster">
${abschnittKopf({ id: 'ort-leistungen', titel: fuellen(nah ? texte.leistungenTitel.nah : texte.leistungenTitel.fern, werte) })}
${istPlatzhalter(bestaetigt) ? html`<p class="hinweis hinweis-platzhalter">${bestaetigt}</p>` : ''}
${nah ? '' : html`<p class="ort-hinweis">${texte.leistungenHinweisFern}</p>`}
<ul class="ort-leistungen">${gruppen.map((g) => html`<li><a href="${g.pfad}">${sk.icon(g.icon, { klasse: 'ort-leistung-icon' })}<span class="ort-leistung-titel">${g.titel}</span><span class="ort-leistung-kurz">${g.kurz}</span></a></li>`)}</ul>
</div>
</section>`;
}

function preise(sk, o, z, werte) {
  if (z.nl) return '';
  const { preise: p } = sk.konfig;
  const zeigeTabelle = z.id === 'A' || z.id === 'B';
  return html`<section class="sektion sektion-dicht" aria-labelledby="ort-preise">
<div class="raster"><div class="ort-preis-teilung">
${abschnittKopf({ id: 'ort-preise', titel: fuellen(texte.preisTitel, werte), einleitung: fuellen(texte.preisText[z.id], werte) })}
${zeigeTabelle ? html`<div class="preis-auszug">${preistabelle(sk, { positionen: ['tuer-zugefallen', 'tuer-abgeschlossen'], id: 'ort-preistabelle' })}
${z.id === 'B' ? html`<p class="ort-anfahrt">${fuellen(texte.anfahrtZeile, werte)}: ${betrag(p.anfahrt.B)}</p>` : ''}</div>` : ''}
</div></div>
</section>`;
}

function umgebung(sk, o, werte) {
  const pfad = (x) => `/schluesseldienst-${x.slug}/`;
  let titel; let liste;
  if (o.typ === 'gemeinde') {
    titel = fuellen(texte.umgebungTitel.gemeinde, werte);
    liste = (o.ortsteile || []).map((id) => D.nachId.get(id)).filter(Boolean).sort((a, b) => ZEICHEN.compare(a.name, b.name));
  } else {
    titel = fuellen(texte.umgebungTitel.ortsteil, werte);
    // Gemeinde plus die nächstgelegenen Geschwister; die vollständige Liste steht auf der Gemeindeseite
    const g = D.nachId.get(o.gemeindeId);
    const geschwister = g ? (g.ortsteile || []).map((id) => D.nachId.get(id)).filter((x) => x && x.id !== o.id)
      .map((x) => ({ x, d: km(o, x) })).sort((a, b) => a.d - b.d || ZEICHEN.compare(a.x.name, b.x.name)).slice(0, 12).map((e) => e.x) : [];
    liste = g ? [g, ...geschwister.sort((a, b) => ZEICHEN.compare(a.name, b.name))] : [];
  }
  const nachbarn = (o.nachbarn || []).map((id) => D.nachId.get(id)).filter(Boolean).map((n) => ({ n, d: km(o, n) })).sort((a, b) => a.d - b.d);
  if (!liste.length && !nachbarn.length) return '';
  return html`<section class="sektion sektion-dicht" aria-label="Umgebung von ${werte.ort}">
<div class="raster"><div class="ort-umgebung">
${liste.length ? html`<div><h2 class="ort-liste-titel">${titel}</h2><ul class="ort-liste">${liste.map((x) => html`<li><a href="${pfad(x)}">${x.name}</a></li>`)}</ul></div>` : ''}
${nachbarn.length ? html`<div><h2 class="ort-liste-titel">${fuellen(texte.nachbarnTitel, werte)}</h2><ul class="ort-liste ort-liste-km">${nachbarn.map(({ n, d }) => html`<li><a href="${pfad(n)}">${D.anzeige.get(n.id)}</a> <span class="ort-km" data-daten="">${String(d)}&nbsp;km</span></li>`)}</ul></div>` : ''}
</div></div>
</section>`;
}

function fragenVon(o, werte) {
  const f = (e) => ({ frage: fuellen(e.frage, werte), antwort: fuellen(e.antwort, werte) });
  const liste = [];
  if (o.km > 0) liste.push(f(texte.faq.entfernung));
  liste.push(f(texte.faq.zone));
  if (o.plz?.length) liste.push(f(texte.faq.plz));
  return liste;
}

function hinweise(sk, o, werte) {
  return html`<section class="sektion sektion-dicht band" aria-labelledby="ort-hinweise">
<div class="raster"><div class="ort-hinweise">
<div>
<h2 class="ort-liste-titel" id="ort-hinweise">${texte.serioesTitel}</h2>
<ul class="ort-serioes">${texte.serioes.map((s) => html`<li>${sk.icon('haken', { klasse: 'ort-serioes-icon' })}<span>${s}</span></li>`)}</ul>
<p><a href="${texte.serioesLink.pfad}">${texte.serioesLink.text}</a></p>
</div>
<div class="ort-fussnoten">
${o.staat === 'DE' ? html`<p>${text(fuellen(texte.landesregel, werte))}</p>` : ''}
<p>${text(texte.quelle)}</p>
</div>
</div></div>
</section>`;
}

function stufenVon(o, name) {
  const s = [{ titel: 'Einsatzgebiet', pfad: '/einsatzgebiet/' }, { titel: o.land, pfad: `/einsatzgebiet/${o.landSlug}/` }];
  if (o.kreisSlug && o.kreisSlug !== o.landSlug) s.push({ titel: kreisName(o.kreis), pfad: `/einsatzgebiet/${o.landSlug}/${o.kreisSlug}/` });
  s.push({ titel: name, pfad: `/schluesseldienst-${o.slug}/` });
  return s;
}

function ortLd(sk, o, name, z) {
  const basis = sk.basisUrl;
  return {
    '@context': 'https://schema.org', '@type': 'Service', '@id': `${basis}/schluesseldienst-${o.slug}/#leistung`,
    name: `Schlüsseldienst für ${name}`, serviceType: 'Schlüsseldienst', provider: { '@id': `${basis}/#betrieb` },
    areaServed: {
      '@type': 'Place', name: o.name,
      address: { '@type': 'PostalAddress', addressLocality: o.name, ...(o.plz?.length ? { postalCode: o.plz[0] } : {}), addressRegion: o.land, addressCountry: o.staat },
      geo: { '@type': 'GeoCoordinates', latitude: o.lat, longitude: o.lon },
    },
    ...(z.nl || z.id === 'C' || z.id === 'D' ? { description: `Planbare Leistungen nach Absprache; Betrieb in Weilburg, rund ${o.km} km entfernt.` } : {}),
  };
}

async function sonderseite(wurzel, slug) {
  const datei = join(wurzel, 'src/inhalte/orte', `${slug}.mjs`);
  try { await access(datei); } catch { return null; }
  return (await import(pathToFileURL(datei).href)).default;
}

function sonderAbschnitte(s) {
  if (!s?.abschnitte?.length) return '';
  return html`${s.abschnitte.map((a, i) => html`<section class="sektion sektion-dicht${i % 2 ? ' band' : ''}" aria-labelledby="sonder-${String(i + 1)}">
<div class="raster"><div class="gruppe-teilung">
${abschnittKopf({ id: `sonder-${i + 1}`, titel: a.titel })}
<div class="fliesstext">${a.absaetze.map((p) => html`<p>${text(p)}</p>`)}</div>
</div></div>
</section>`)}`;
}

export async function seiten(k) {
  // Nie Waisen veröffentlichen: Ortsseiten entstehen erst, wenn die Länder-/Kreis-Hubs gebaut werden
  // (hub.mjs setzt k.hubs.aktiv). Zum Entwickeln: --stichprobe=<n> (dann sind Waisen erwartbar).
  if (!k.hubs?.aktiv && !k.stichprobe) return [];
  if (!D) vorbereiten(k);
  let orte = D.orte;
  if (k.stichprobe) {
    const schritt = Math.max(1, Math.floor(orte.length / k.stichprobe));
    orte = orte.filter((o, i) => i % schritt === 0 || o.slug === 'weilburg').slice(0, k.stichprobe + 1);
  }
  const aus = [];
  for (const o of orte) {
    const z = zoneVon(k, o);
    if (!z) continue;
    const name = D.anzeige.get(o.id);
    const werte = werteVon(o, z);
    const sonder = await sonderseite(k.wurzel, o.slug);
    const pfad = `/schluesseldienst-${o.slug}/`;
    const stufen = stufenVon(o, name);
    const fragen = fragenVon(o, werte);
    aus.push({
      pfad, titel: sonder?.titel || titelVon(o, z, name), beschreibung: sonder?.beschreibung || beschreibungVon(o, z, name),
      typ: 'ort', ansicht: 'V07', sitemap: `orte-${o.landSlug}`, indexierbar: z.indexierung !== false,
      koerperKlasse: 'seite-ort', stile: ['ort'], ogBild: z.id === 'A' || z.id === 'B' ? '/assets/og/ort-nah.png' : '/assets/og/ort-fern.png', brotkrumen: stufen,
      // Ohne FAQPage-Daten: FAQ-Ergebnisse zeigt die Suche nur noch bei wenigen Website-Arten; spart ~1 KB je Ortsseite (D-SEO-02)
      jsonld: [ortLd(k, o, name, z), brotkrumenLd(k.basisUrl, stufen)],
      inhalt: (sk) => html`${kopf(sk, o, z, werte, sonder)}
${sonderAbschnitte(sonder)}
${leistungen(sk, o, z, werte)}
${preise(sk, o, z, werte)}
${umgebung(sk, o, werte)}
<section class="sektion sektion-dicht" aria-labelledby="ort-faq"><div class="raster"><div class="faq-teilung">
${abschnittKopf({ id: 'ort-faq', titel: fuellen(texte.faqTitel, werte) })}
${faq(sk, fragen)}
</div></div></section>
${hinweise(sk, o, werte)}`,
    });
  }
  return aus;
}
