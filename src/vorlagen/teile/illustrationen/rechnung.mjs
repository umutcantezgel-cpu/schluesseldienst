// I-14 Rechnung mit Positionen (dekorativ): Beleg mit Zackenkante, Positionszeilen mit Führungspunkten,
// Summenzeile in Kupfer. Unterstreicht „Rechnung mit allen Positionen verlangen“. Keine Zahlen, kein Text.
import { roh } from '../../../../bau/lib/html.mjs';

export function rechnungIllustration(klasse = '') {
  const zeilen = [56, 80, 104, 128].map((y, i) => `<path class="re-zeile" d="M40 ${y}H${[120, 104, 128, 96][i]}"/><path class="re-punkte" d="M${[128, 112, 136, 104][i]} ${y}H200"/><path class="re-betrag" d="M208 ${y}H240"/>`).join('');
  const zacken = [];
  for (let x = 24, s = 0; x <= 256; x += 8, s ^= 1) zacken.push(`L${x} ${s ? 232 : 240}`);
  return roh(`<svg class="rechnung ${klasse}" viewBox="0 0 280 256" aria-hidden="true" focusable="false">
<path class="re-blatt" d="M24 16H256V240 ${zacken.reverse().join(' ')} L24 240Z"/>
<path class="re-kopf" d="M40 32H160"/>
${zeilen}
<path class="re-trenner" d="M40 160H240"/>
<path class="re-summe" d="M40 184H120M200 184H240"/>
<path class="re-scherlinie" d="M40 200H240"/>
</svg>`);
}
