// I-03 Tür-Schichten (M-17 Einbruchschutz): Ansicht einer Wohnungstür in der Wand; Schicht für Schicht kommen
// Zylinder, Schutzbeschlag, Mehrfachverriegelung, Bandseite und Querriegel hinzu. Dekorativ (Text trägt die Aussage).
import { roh } from '../../../../bau/lib/html.mjs';
import { illRahmen, teil } from './_svg.mjs';

const zylinderProfil = (x, y) => `<circle class="ill-dunkel" cx="${x}" cy="${y}" r="6"/><path class="ill-dunkel" d="M${x - 4} ${y + 2}H${x + 4}V${y + 16}H${x - 4}Z"/>`;

export function tuerSchichten({ praefix = 'ts', zustand = null, klasse = '' } = {}) {
  const sf = `url(#${praefix}-schraffur)`;
  const inhalt = `<g class="ill-grund">
<path class="ill-wand" fill="${sf}" d="M24 24H64V376H24Z M256 24H296V376H256Z"/>
<path class="ill-flaeche" d="M64 376V24H256V376H240V40H80V376Z"/>
<path class="ill-blatt" d="M84 376V44H236V376"/>
<path d="M16 376H304"/>
</g>
${teil(1, `<path class="ill-gestrichelt" d="M196 192H228V272H196Z"/>${zylinderProfil(212, 240)}`)}
${teil(2, `<rect class="ill-blatt" x="198" y="192" width="28" height="84" rx="8"/><path d="M212 216H172"/><circle class="ill-blatt" cx="212" cy="216" r="6"/><circle cx="212" cy="244" r="11"/>${zylinderProfil(212, 240)}`)}
${teil(3, `<rect class="ill-flaeche" x="240" y="96" width="8" height="256" rx="2"/><path class="ill-bolzen" d="M228 108H252V116H228Z M228 228H252V236H228Z M228 332H252V340H228Z"/>`)}
${teil(4, `<rect class="ill-flaeche" x="76" y="88" width="12" height="32" rx="2"/><rect class="ill-flaeche" x="76" y="200" width="12" height="32" rx="2"/><rect class="ill-flaeche" x="76" y="312" width="12" height="32" rx="2"/><path class="ill-bolzen" d="M68 156H96V164H68Z M68 268H96V276H68Z"/>`)}
${teil(5, `<rect class="ill-flaeche" x="68" y="292" width="184" height="12" rx="2"/><rect class="ill-blatt" x="140" y="280" width="40" height="36" rx="4"/><circle class="ill-dunkel" cx="160" cy="298" r="4"/>`)}`;
  return roh(illRahmen({ klasse: `ill-tuer ${klasse}`, viewBox: '8 16 304 368', praefix, zustand, inhalt }));
}
