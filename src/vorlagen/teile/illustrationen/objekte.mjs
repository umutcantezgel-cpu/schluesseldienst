// I-06…I-09 Notöffnungs-Objekte (dekorativ): Tür, Auto, Garage und Tresor als Strichzeichnungen auf einer
// gemeinsamen Grundlinie – die vier Fälle der Gruppe Notöffnung. Raster 8, Strich 2, nur 0°/45°/90° und Kreisbögen.
import { roh } from '../../../../bau/lib/html.mjs';

export function notoeffnungObjekte(klasse = '') {
  return roh(`<svg class="ill ill-objekte ${klasse}" viewBox="0 8 576 184" aria-hidden="true" focusable="false">
<g class="ill-objekt ill-objekt-tuer">
<path class="ill-flaeche" d="M24 176V24H104V176"/>
<path class="ill-blatt" d="M36 176V36H92V176"/>
<circle class="ill-dunkel" cx="82" cy="108" r="3"/>
<path d="M82 100H70"/>
</g>
<g class="ill-objekt ill-objekt-auto">
<path class="ill-blatt" d="M136 160V128H160L184 104H256L280 128H312V160Z"/>
<path class="ill-fenster" d="M190 112H216V128H174Z M224 112H250L266 128H224Z"/>
<circle class="ill-flaeche" cx="184" cy="160" r="16"/><circle class="ill-dunkel" cx="184" cy="160" r="4"/>
<circle class="ill-flaeche" cx="272" cy="160" r="16"/><circle class="ill-dunkel" cx="272" cy="160" r="4"/>
</g>
<g class="ill-objekt ill-objekt-garage">
<path class="ill-flaeche" d="M344 176V96L400 40L456 96V176"/>
<path class="ill-blatt" d="M368 176V112H432V176"/>
<path class="ill-fein" d="M368 128H432M368 144H432M368 160H432"/>
</g>
<g class="ill-objekt ill-objekt-tresor">
<rect class="ill-blatt" x="480" y="96" width="72" height="72" rx="4"/>
<path d="M488 168V176M544 168V176M488 104V160"/>
<circle cx="516" cy="132" r="12"/><path d="M516 120V126"/>
<path d="M540 124V140"/>
</g>
<path class="ill-boden" d="M8 176H568"/>
</svg>`);
}
