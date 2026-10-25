// Ortssuche/Ortsprüfung als ARIA-1.2-Combobox. Lädt die Indizes beim ersten Fokus (fetch mit integrity).
// DOM nur über createElement/textContent/replaceChildren (Trusted Types erzwingen das).
import { indexAufbauen, suchen, plzDekodieren } from '../logik/ortsindex.mjs';

const VERZOEGERUNG = 120;

function element(tag, klasse, textInhalt) {
  const e = document.createElement(tag);
  if (klasse) e.className = klasse;
  if (textInhalt !== undefined) e.textContent = textInhalt;
  return e;
}

export function ortssuche(wurzel) {
  const huelle = wurzel.querySelector('.ortspruefung-eingabe-huelle');
  const eingabe = wurzel.querySelector('.ortspruefung-eingabe');
  const liste = wurzel.querySelector('.ortspruefung-liste');
  const status = wurzel.querySelector('.ortspruefung-status');
  const ergebnis = wurzel.querySelector('.ortspruefung-ergebnis');
  const ersatz = wurzel.querySelector('.ortspruefung-ersatz');
  if (!huelle || !eingabe || !liste) return;
  const modus = wurzel.getAttribute('data-modus') || 'navigieren';
  let zonen = {};
  try { zonen = JSON.parse(wurzel.getAttribute('data-zonen') || '{}'); } catch { /* leer */ }
  huelle.hidden = false;
  if (ersatz) ersatz.classList.add('ortspruefung-ersatz-klein');

  let index = null;
  let plzIndex = null;
  let laden = null;
  let aktiv = -1;
  let treffer = [];
  let zeitgeber = 0;

  const ladeDaten = () => {
    if (laden) return laden;
    const ladeAnzeige = setTimeout(() => wurzel.setAttribute('data-zustand', 'laedt'), 300);
    laden = Promise.all([
      fetch(wurzel.getAttribute('data-orte'), { integrity: wurzel.getAttribute('data-orte-sri'), credentials: 'omit' }).then((r) => r.json()),
      fetch(wurzel.getAttribute('data-plz'), { integrity: wurzel.getAttribute('data-plz-sri'), credentials: 'omit' }).then((r) => r.json()),
    ]).then(([orte, plz]) => {
      index = indexAufbauen(orte);
      plzIndex = plzDekodieren(plz.p);
      wurzel.removeAttribute('data-zustand');
    }).catch(() => {
      wurzel.setAttribute('data-zustand', 'fehler');
      status.textContent = 'Die Ortsliste konnte nicht geladen werden. Bitte nutzen Sie die Übersicht aller Orte.';
    }).finally(() => clearTimeout(ladeAnzeige));
    return laden;
  };

  const schliessen = () => {
    liste.hidden = true;
    eingabe.setAttribute('aria-expanded', 'false');
    eingabe.removeAttribute('aria-activedescendant');
    aktiv = -1;
  };

  const markieren = (i) => {
    aktiv = i;
    for (const [j, li] of [...liste.children].entries()) li.setAttribute('aria-selected', String(j === i));
    if (i >= 0 && liste.children[i]) {
      eingabe.setAttribute('aria-activedescendant', liste.children[i].id);
      liste.children[i].scrollIntoView({ block: 'nearest' });
    } else eingabe.removeAttribute('aria-activedescendant');
  };

  const zeigen = (t) => {
    const id = eingabe.id;
    const zeilen = t.map((e, i) => {
      const li = element('li', 'ortspruefung-option');
      li.id = `${id}-option-${i}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      li.append(element('span', 'ortspruefung-option-name', e.name), element('span', 'ortspruefung-option-zusatz', `${e.zusatz} · ${e.km} km`));
      li.addEventListener('mousedown', (ereignis) => ereignis.preventDefault());
      li.addEventListener('click', () => waehlen(i));
      return li;
    });
    liste.replaceChildren(...zeilen);
    liste.hidden = zeilen.length === 0;
    eingabe.setAttribute('aria-expanded', String(zeilen.length > 0));
    markieren(-1);
  };

  const ergebnisZeigen = (e) => {
    if (!ergebnis) return;
    const kopf = element('p', 'ortspruefung-ergebnis-kopf');
    kopf.append(element('strong', '', e.name), document.createTextNode(` (${e.zusatz})`));
    const fakten = element('p', 'ortspruefung-ergebnis-fakten',
      e.km === 0 ? 'Hier sitzt unser Betrieb.' : `Rund ${e.km} km${e.richtung ? ' ' + e.richtung : ''} von Weilburg (Luftlinie).`);
    const zone = element('p', `ortspruefung-ergebnis-zone zone-${String(e.zone).toLowerCase()}`, zonen[e.zone] || e.zone);
    const teile = [kopf, fakten, zone];
    if (e.slug) {
      const a = element('a', 'knopf knopf-sekundaer', `Zur Seite für ${e.name}`);
      a.href = `/schluesseldienst-${e.slug}/`;
      teile.push(element('p', 'ortspruefung-ergebnis-link'));
      teile.at(-1).append(a);
    }
    ergebnis.replaceChildren(...teile);
    ergebnis.hidden = false;
    ergebnis.setAttribute('data-zustand', 'neu');
    requestAnimationFrame(() => ergebnis.removeAttribute('data-zustand'));
  };

  const waehlen = (i) => {
    const e = treffer[i];
    if (!e) return;
    eingabe.value = e.name;
    schliessen();
    if (modus === 'navigieren' && e.slug) { window.location.assign(`/schluesseldienst-${e.slug}/`); return; }
    ergebnisZeigen(e);
    status.textContent = `${e.name}: ${zonen[e.zone] || ''}`;
  };

  const aktualisieren = async () => {
    await ladeDaten();
    if (!index) return;
    const r = suchen(index, plzIndex, eingabe.value);
    treffer = r.treffer;
    zeigen(treffer);
    const q = eingabe.value.trim();
    if (!q) status.textContent = '';
    else if (!r.gesamt) status.textContent = 'Kein Ort gefunden. Prüfen Sie die Schreibweise oder nutzen Sie die Übersicht aller Orte.';
    else status.textContent = r.gesamt > treffer.length ? `${treffer.length} von ${r.gesamt} Treffern` : `${r.gesamt} ${r.gesamt === 1 ? 'Treffer' : 'Treffer'}`;
    wurzel.setAttribute('data-treffer', r.gesamt ? 'ja' : q ? 'nein' : '');
  };

  eingabe.addEventListener('focus', ladeDaten, { once: true });
  eingabe.addEventListener('input', () => { clearTimeout(zeitgeber); zeitgeber = setTimeout(aktualisieren, VERZOEGERUNG); });
  eingabe.addEventListener('keydown', (ereignis) => {
    const n = treffer.length;
    if (ereignis.key === 'ArrowDown') {
      ereignis.preventDefault();
      if (liste.hidden && n) { liste.hidden = false; eingabe.setAttribute('aria-expanded', 'true'); }
      if (!ereignis.altKey && n) markieren((aktiv + 1) % n);
    } else if (ereignis.key === 'ArrowUp') {
      ereignis.preventDefault();
      if (n) markieren(aktiv <= 0 ? n - 1 : aktiv - 1);
    } else if (ereignis.key === 'Enter') {
      if (aktiv >= 0) { ereignis.preventDefault(); waehlen(aktiv); } else if (n === 1) { ereignis.preventDefault(); waehlen(0); }
    } else if (ereignis.key === 'Escape') {
      if (!liste.hidden) schliessen(); else eingabe.value = '';
    }
  });
  eingabe.addEventListener('blur', () => setTimeout(schliessen, 0));
}
