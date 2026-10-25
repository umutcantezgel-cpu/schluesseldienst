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

const MODULE = { menue, aufklapper, erreichbarkeit, ortssuche, abspielen, szene, tagesband, preisrechner, composer, suche };

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

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', starten, { once: true });
else starten();
