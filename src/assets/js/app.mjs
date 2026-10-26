// Einstieg: initialisiert alle Module über [data-modul="…"]. Nur DOM-sichere APIs (keine HTML-Strings).
import { menue } from './module/menue.mjs';
import { aufklapper } from './module/aufklapper.mjs';
import { erreichbarkeit } from './module/erreichbarkeit.mjs';
import { ortssuche } from './module/ortssuche.mjs';
import { abspielen } from './module/abspielen.mjs';
import { szene } from './module/szene.mjs';
import { tagesband } from './module/tagesband.mjs';
import { preisrechner } from './module/preisrechner.mjs';
import { composer } from './module/composer.mjs';
import { suche } from './module/suche.mjs';
import { gruppenfilter } from './module/gruppenfilter.mjs';
import { inhalt } from './module/inhalt.mjs';

const MODULE = { menue, aufklapper, erreichbarkeit, ortssuche, abspielen, szene, tagesband, preisrechner, composer, suche, gruppenfilter, inhalt };

function starten() {
  document.documentElement.classList.add('js');
  for (const el of document.querySelectorAll('[data-modul]')) {
    const name = el.getAttribute('data-modul');
    const modul = MODULE[name];
    if (!modul || el.hasAttribute('data-modul-aktiv')) continue;
    el.setAttribute('data-modul-aktiv', '');
    try { modul(el); } catch (fehler) { console.warn(`Modul ${name}:`, fehler); }
  }
}

// M-15: Überspringt der Browser einen Seitenwechsel-Übergang (etwa wenn die Navigation per Skript während eines
// laufenden Übergangs startet), lehnt er dessen Promises ab. Das ist kein Fehler der Seite und gehört nicht in die Konsole.
function uebergangStill(e) {
  const vt = e.viewTransition;
  if (vt) for (const p of [vt.ready, vt.finished, vt.updateCallbackDone]) p?.catch(() => {});
}
addEventListener('pageswap', uebergangStill);
addEventListener('pagereveal', uebergangStill);

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', starten, { once: true });
else starten();
