// Häufige Fragen (K-009): <details>/<summary>, ohne JS nutzbar, beim Drucken offen.
// Antworten nutzen die Mini-Syntax; für JSON-LD wird sie zu reinem Text.
import { html } from '../../../bau/lib/html.mjs';
import { text } from '../../../bau/lib/inhalt.mjs';
import { icon } from './icons.mjs';

const reinText = (s) => String(s).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');

export function faq(sk, fragen) {
  return html`<div class="faq">
${fragen.map((f) => html`<details class="faq-eintrag">
<summary class="faq-frage"><span>${f.frage}</span>${icon(sk, 'chevron', { klasse: 'faq-chevron' })}</summary>
<div class="faq-antwort"><p>${text(f.antwort)}</p></div>
</details>`)}
</div>`;
}

export function faqLd(basisUrl, pfad, fragen) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage', '@id': `${basisUrl}${pfad}#faq`,
    mainEntity: fragen.map((f) => ({ '@type': 'Question', name: f.frage, acceptedAnswer: { '@type': 'Answer', text: reinText(f.antwort) } })),
  };
}
