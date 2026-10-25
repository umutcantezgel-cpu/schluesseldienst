// Ortssuche/Ortsprüfung (K-009): ARIA-1.2-Combobox, Name, Wortanfang oder PLZ.
// Ohne JS bleibt das Feld verborgen und der Link „Alle Orte A–Z“ sichtbar (gleicher Platz, kein Springen).
// Die Indizes (/daten/orte.*.json, /daten/plz.*.json) lädt das Modul erst beim Fokus, mit SRI.
import { html, attr } from '../../../bau/lib/html.mjs';
import { icon } from './icons.mjs';

export function ortspruefung(sk, { id = 'ort', modus = 'pruefen', titel, hinweis, ersatz = { pfad: '/einsatzgebiet/', text: 'Alle Orte und Zonen ansehen' } }) {
  const d = sk.assets.daten;
  const bereit = d.orte && d.plz;
  const z = sk.konfig.zonen;
  const zonen = JSON.stringify(Object.fromEntries([...z.stufen.map((s) => [s.id, s.kurz]), ['NL', z.nl.kurz]]));
  return html`<div class="ortspruefung"${attr('data-modul', bereit ? 'ortssuche' : null)} data-modus="${modus}" data-zonen="${zonen}"${bereit ? html` data-orte="${d.orte.pfad}" data-orte-sri="${d.orte.sri}" data-plz="${d.plz.pfad}" data-plz-sri="${d.plz.sri}"` : ''}>
<label class="ortspruefung-titel" for="${id}-eingabe">${titel}</label>
<p class="ortspruefung-hinweis" id="${id}-hinweis">${hinweis}</p>
<div class="ortspruefung-feld">
<div class="ortspruefung-eingabe-huelle" hidden>
${icon(sk, 'suche', { klasse: 'ortspruefung-icon' })}
<input class="ortspruefung-eingabe" id="${id}-eingabe" type="text" inputmode="search" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-liste" aria-describedby="${id}-hinweis" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" placeholder="z. B. Löhnberg oder 35781">
<ul class="ortspruefung-liste" id="${id}-liste" role="listbox" aria-label="Vorschläge" hidden></ul>
</div>
<a class="ortspruefung-ersatz" href="${ersatz.pfad}">${icon(sk, 'standort')}<span>${ersatz.text}</span></a>
</div>
<p class="ortspruefung-status unsichtbar" role="status" aria-live="polite"></p>
<div class="ortspruefung-ergebnis" hidden></div>
</div>`;
}
