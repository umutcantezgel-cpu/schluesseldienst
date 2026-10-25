// Brotkrumen: nav > ol, letzte Stufe ohne Link mit aria-current. Mobil zeigt CSS nur „← Elternseite“.
import { html } from '../../../bau/lib/html.mjs';

export function brotkrumen(sk, stufen) {
  const alle = [{ titel: 'Start', pfad: '/' }, ...stufen];
  const eltern = alle.at(-2);
  return html`<nav class="brotkrumen" aria-label="Brotkrumen">
<a class="brotkrumen-zurueck" href="${eltern.pfad}">${eltern.titel}</a>
<ol>${alle.map((s, i) => i === alle.length - 1
    ? html`<li><span aria-current="page">${s.titel}</span></li>`
    : html`<li><a href="${s.pfad}">${s.titel}</a></li>`)}</ol>
</nav>
`;
}

/** JSON-LD BreadcrumbList zu denselben Stufen. */
export function brotkrumenLd(basisUrl, stufen) {
  const alle = [{ titel: 'Start', pfad: '/' }, ...stufen];
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: alle.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.titel, item: basisUrl + s.pfad })),
  };
}
