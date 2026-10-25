// Leistungsregister (V01, nicht uniform): großes Feld für die erste Gruppe mit Illustration,
// drei Registereinträge mit Unterleistungen. Je Eintrag ein gestreckter Link (keine verschachtelten Links).
import { html } from '../../../bau/lib/html.mjs';
import { GRUPPEN } from '../../konfig/leistungen.mjs';
import { icon } from './icons.mjs';

export function leistungsRegister(sk, { gross = null } = {}) {
  const [erste, ...rest] = GRUPPEN;
  return html`<div class="register">
<article class="register-gross">
<div class="register-gross-text">
<p class="register-nr" aria-hidden="true">${erste.nr}</p>
<h3><a class="gestreckt" href="${erste.pfad}">${erste.titel}</a></h3>
<p>${erste.kurz}</p>
<ul class="register-liste">${erste.leistungen.map((l) => html`<li>${icon(sk, l.icon, { klasse: 'i-text' })}<span>${l.titel}</span></li>`)}</ul>
</div>
${gross ? html`<div class="register-figur">${gross}</div>` : ''}
</article>
${rest.map((g) => html`<article class="register-eintrag">
<p class="register-nr" aria-hidden="true">${g.nr}</p>
<div>
<h3><a class="gestreckt" href="${g.pfad}">${g.titel}</a></h3>
<p>${g.kurz}</p>
<p class="register-unter">${g.leistungen.map((l) => l.titel).join(' · ')}</p>
</div>
${icon(sk, g.icon, { klasse: 'register-icon' })}
</article>`)}
</div>`;
}
