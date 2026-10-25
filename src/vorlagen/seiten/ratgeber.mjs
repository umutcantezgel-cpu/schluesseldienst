// V08 Ratgeber-Übersicht: Artikel nach Lage geordnet (Notfall, Vorbeugen, Technik, Recht und Kosten).
// Nur gebaute Artikel erscheinen; jede Kategorie hat einen Anker für die Rücksprünge aus den Artikeln.
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import { abschnittKopf } from '../teile/abschnitt.mjs';
import { brotkrumenLd } from '../teile/brotkrumen.mjs';
import { artikelLaden, KATEGORIEN } from './artikel.mjs';

const INHALT = {
  titel: 'Ratgeber: Schloss, Schlüssel, Einbruchschutz, Tresor',
  beschreibung: 'Antworten aus der Werkstatt: was bei ausgesperrter Tür hilft, wie Sie Haus und Wohnung sichern, Technik und Kosten verständlich erklärt.',
  h1: 'Ratgeber',
  einleitung: 'Antworten, die wir am Telefon oft geben – in Ruhe aufgeschrieben. Sortiert nach der Lage, in der Sie gerade sind.',
};

export async function seiten(k) {
  const artikel = await artikelLaden(k.wurzel);
  const stufen = [{ titel: 'Ratgeber', pfad: '/ratgeber/' }];
  const url = `${k.basisUrl}/ratgeber/`;
  return [{
    pfad: '/ratgeber/', titel: INHALT.titel, beschreibung: INHALT.beschreibung, typ: 'arbeit', ansicht: 'V08', sitemap: 'ratgeber',
    koerperKlasse: 'seite-ratgeber', stile: ['ratgeber'], ogBild: '/assets/og/ratgeber.png', brotkrumen: stufen,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${url}#seite`, name: INHALT.titel, url,
        mainEntity: { '@type': 'ItemList', itemListElement: artikel.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${k.basisUrl}${a.pfad}`, name: a.inhalt.h1 })) } },
      brotkrumenLd(k.basisUrl, stufen),
    ],
    inhalt: (sk) => html`<section class="ratgeber-kopf" aria-labelledby="ratgeber-titel"><div class="raster">
<h1 id="ratgeber-titel">${INHALT.h1}</h1>
<p class="gruppe-einleitung">${text(INHALT.einleitung)}</p>
${artikel.length ? html`<nav class="ratgeber-sprung" aria-label="Kategorien"><ul>${Object.entries(KATEGORIEN).filter(([id]) => artikel.some((a) => a.inhalt.kategorie === id)).map(([id, kat]) => html`<li><a href="#${id}">${kat.titel}</a></li>`)}</ul></nav>` : ''}
</div></section>
${Object.entries(KATEGORIEN).map(([id, kat], i) => {
    const liste = artikel.filter((a) => a.inhalt.kategorie === id);
    if (!liste.length) return '';
    return html`<section class="sektion sektion-dicht${i % 2 ? '' : ' band'}" aria-labelledby="${id}">
<div class="raster">
${abschnittKopf({ id, titel: kat.titel, einleitung: kat.kurz })}
<ul class="ratgeber-liste">${liste.map((a) => html`<li><a href="${a.pfad}"><span class="ratgeber-titel">${a.inhalt.h1}</span><span class="ratgeber-kurz">${a.inhalt.beschreibung}</span></a></li>`)}</ul>
</div>
</section>`;
  })}`,
  }];
}
