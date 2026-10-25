// Seitensuche (V11 /suche/): Seitenindex und Ortsindex laden beim ersten Fokus bzw. bei vorhandener Anfrage (?q=),
// Ergebnisse als zwei Register (Bereich bzw. Entfernung links, Titel und Text rechts, Suchwort markiert), Anzahl in
// einer Statuszeile (aria-live). Kein <form> (CSP form-action mailto:), die Anfrage steht per history.replaceState in
// der Adresse. Eigener Leeren-Knopf statt des browsereigenen Kreuzes (Icon-System). Nur DOM-sichere APIs.
import { seitenIndex, seitenSuchen, hervorheben, statusText } from '../logik/suche.mjs';
import { indexAufbauen, suchen, plzDekodieren } from '../logik/ortsindex.mjs';

const WARTEN = 150;
const MAX_SEITEN = 20;

function knoten(tag, klasse, inhalt) {
  const e = document.createElement(tag);
  if (klasse) e.className = klasse;
  if (inhalt !== undefined) e.textContent = inhalt;
  return e;
}

// Text mit <mark> um die Wörter, die die Anfrage treffen
function markiert(tag, klasse, text, anfrage) {
  const e = knoten(tag, klasse);
  e.append(...hervorheben(text, anfrage).map((t) => (t.treffer ? knoten('mark', null, t.text) : document.createTextNode(t.text))));
  return e;
}

// Ein Registereintrag: Marke links, Titel als Link (über die ganze Zeile gestreckt) und Text rechts
function treffer({ marke, titel, pfad, text }, anfrage) {
  const li = knoten('li', 'suche-treffer');
  const a = markiert('a', 'suche-link', titel, anfrage);
  a.href = pfad;
  const inhalt = knoten('div', 'suche-inhalt');
  inhalt.append(a);
  if (text) inhalt.append(markiert('p', 'suche-text', text, anfrage));
  li.append(knoten('span', 'suche-bereich', marke), inhalt);
  return li;
}

export function suche(el) {
  const eingabe = el.querySelector('.suche-eingabe');
  const leeren = el.querySelector('.suche-leeren');
  const status = el.querySelector('.suche-status');
  const seitenListe = el.querySelector('[data-rolle="seiten"]');
  const orteListe = el.querySelector('[data-rolle="orte"]');
  const ergebnis = el.querySelector('.suche-ergebnis');
  const ohneJs = el.querySelector('.suche-ohne-js');
  if (!eingabe || !status || !seitenListe || !orteListe) return;
  el.querySelector('.suche-feld').hidden = false;
  if (ohneJs) ohneJs.hidden = true;

  let daten = null;
  const holen = (attr) => fetch(el.getAttribute(`data-${attr}`), { integrity: el.getAttribute(`data-${attr}-sri`), credentials: 'omit' }).then((r) => r.json());
  const laden = () => {
    if (daten) return daten;
    daten = Promise.all([holen('seiten'), holen('orte'), holen('plz')])
      .then(([s, o, p]) => ({ seiten: seitenIndex(s), orte: indexAufbauen(o), plz: plzDekodieren(p.p) }))
      .catch(() => { status.textContent = el.getAttribute('data-fehler'); daten = null; return null; });
    return daten;
  };

  let stand = 'a';
  const zeigen = async () => {
    const q = eingabe.value.trim();
    if (leeren) leeren.hidden = !eingabe.value;
    const adresse = new URL(window.location.href);
    if (q) adresse.searchParams.set('q', q); else adresse.searchParams.delete('q');
    history.replaceState(null, '', `${adresse.pathname}${adresse.search}`);
    if (q.length < 2) {
      ergebnis.hidden = true;
      status.textContent = q ? el.getAttribute('data-kurz') : '';
      return;
    }
    const d = await laden();
    if (!d || eingabe.value.trim() !== q) return;
    const alleSeiten = seitenSuchen(d.seiten, q, Infinity);
    const seiten = alleSeiten.slice(0, MAX_SEITEN);
    const ergebnisOrte = suchen(d.orte, d.plz, q, 8);
    const orte = ergebnisOrte.treffer.filter((o) => o.slug);
    seitenListe.replaceChildren(...seiten.map((s) => treffer({ marke: s.bereich, titel: s.titel, pfad: s.pfad, text: s.text }, q)));
    orteListe.replaceChildren(...orte.map((o) => treffer({ marke: `${o.km} km`, titel: o.name, pfad: `/schluesseldienst-${o.slug}/`, text: o.zusatz }, q)));
    el.querySelector('[data-rolle="seiten-block"]').hidden = !seiten.length;
    el.querySelector('[data-rolle="orte-block"]').hidden = !orte.length;
    ergebnis.hidden = !(seiten.length || orte.length);
    // M-12-Rückmeldung: Die neue Liste blendet kurz von .6 auf; der Wechsel des Attributs startet die Animation neu
    stand = stand === 'a' ? 'b' : 'a';
    ergebnis.setAttribute('data-stand', stand);
    status.textContent = statusText({ seiten: seiten.length, seitenGesamt: alleSeiten.length, orte: orte.length, orteGesamt: Math.max(orte.length, ergebnisOrte.gesamt) })
      || el.getAttribute('data-leer');
  };

  let zeitgeber = 0;
  eingabe.addEventListener('focus', laden, { once: true });
  eingabe.addEventListener('input', () => { clearTimeout(zeitgeber); zeitgeber = setTimeout(zeigen, WARTEN); });
  // Enter und Esc (type=search) zeigen sofort, ohne die Wartezeit
  eingabe.addEventListener('search', () => { clearTimeout(zeitgeber); zeigen(); });
  leeren?.addEventListener('click', () => {
    eingabe.value = '';
    zeigen();
    eingabe.focus();
  });
  const start = new URL(window.location.href).searchParams.get('q');
  if (start) { eingabe.value = start.slice(0, 80); zeigen(); }
}
