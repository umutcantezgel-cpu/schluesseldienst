// I-14 Rechnung mit Positionen (dekorativ): Beleg mit Zackenkante, beschriftete Positionen in Mono
// (Anfahrt, Arbeitszeit, Zuschlag, MwSt., Gesamt) mit Führungspunkten, aber ohne Beträge – die Aussage ist
// „jede Position steht auf der Rechnung“, nicht ein Preis. Die Summenzeile trägt die Kupferlinie.
import { roh } from '../../../../bau/lib/html.mjs';

const POSITIONEN = ['Anfahrt', 'Arbeitszeit', 'Zuschlag', 'MwSt.'];
const ZEICHEN = 9.6; // Laufweite der Mono-Schrift bei 16 Einheiten (0,6 em)

export function rechnungIllustration(klasse = '') {
  const zeilen = POSITIONEN.map((t, i) => {
    const y = 104 + i * 32;
    const ende = 40 + Math.ceil(t.length * ZEICHEN) + 8;
    return `<text class="re-text" x="40" y="${y}">${t}</text><path class="re-punkte" d="M${ende} ${y - 5}H196"/><path class="re-betrag" d="M208 ${y - 5}H240"/>`;
  }).join('');
  const zacken = [];
  for (let x = 24, s = 0; x <= 256; x += 8, s ^= 1) zacken.push(`L${x} ${s ? 264 : 272}`);
  return roh(`<svg class="rechnung ${klasse}" viewBox="0 0 280 288" aria-hidden="true" focusable="false">
<path class="re-blatt" d="M24 16H256V272 ${zacken.reverse().join(' ')} L24 272Z"/>
<text class="re-text re-kopf-text" x="40" y="52">RECHNUNG</text>
<path class="re-trenner" d="M40 68H240"/>
${zeilen}
<path class="re-trenner" d="M40 216H240"/>
<text class="re-text re-summe-text" x="40" y="242">Gesamt</text>
<path class="re-summe" d="M200 237H240"/>
<path class="re-scherlinie" d="M40 254H240"/>
</svg>`);
}
