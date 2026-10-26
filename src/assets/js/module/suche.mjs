// Seitensuche (V11 /suche/): Seitenindex und Ortsindex laden beim ersten Fokus bzw. bei vorhandener Anfrage (?q=),
// Ergebnisse als zwei Register (Bereich bzw. Entfernung links, Titel und Text rechts, Suchwort markiert), Anzahl in
// einer Statuszeile (aria-live). Das Register „Hauptthemen“ aus der Vorlage steht nur, solange keine Treffer stehen. Kein <form> (CSP form-action mailto:), die Anfrage steht per history.replaceState in
// der Adresse. Eigener Leeren-Knopf statt des browsereigenen Kreuzes (Icon-System). Ortstreffer tragen unter der
// Entfernung einen Maßstab mit den Zonenringen (data-ringe). Nur DOM-sichere APIs.
import { seitenIndex, seitenSuchen, hervorheben, statusText, massLage, prozent } from '../logik/suche.mjs';
import { indexAufbauen, suchen, plzDekodieren } from '../logik/ortsindex.mjs';

const WARTEN = 150;
const MAX_SEITEN = 20;

function knoten(tag, klasse, inhalt) {
  const e = document.createElement(tag);
  if (klasse) e.className = klasse;
  if (inhalt !== undefined) e.textContent = inhalt;
  return e;
}

// „E-Mail“ bricht sonst nach „E-“ um (harter Bindestrich): Wort samt Kompositum in .kein-umbruch, wie in der Vorlage
const KEIN_UMBRUCH = /(E-Mail(?:-\p{L}+)?)/u;
const textKnoten = (s) => s.split(KEIN_UMBRUCH).map((t, i) => (i % 2 ? knoten('span', 'kein-umbruch', t) : document.createTextNode(t)));

// Text mit <mark> um die Wörter, die die Anfrage treffen
function markiert(tag, klasse, text, anfrage) {
  const e = knoten(tag, klasse);
  for (const t of hervorheben(text, anfrage)) {
    if (!t.treffer) { e.append(...textKnoten(t.text)); continue; }
    const m = knoten('mark');
    m.append(...textKnoten(t.text));
    e.append(m);
  }
  return e;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
function svgKnoten(tag, attribute) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attribute)) e.setAttribute(k, v);
  return e;
}

// Maßstab ab Weilburg unter der Entfernung eines Ortes, gelesen wie die Legende in der Randspalte: Achse bis ein
// Fünftel über den äußersten Zonenring (logik/suche.mjs), dahinter gestrichelt; die Ringe als Striche, die Entfernung
// als Kupferlinie. Reicht ein Ort über das Achsende hinaus, endet die Linie offen (ohne runde Kappe).
// Ohne viewBox, x in Prozent (wie das Tagesband): Strichstärken bleiben auf jeder Breite gleich. Dekorativ, die Zahl
// davor trägt die Aussage.
function massstab(km, ringe) {
  const x = (w) => prozent(massLage(w, ringe).anteil);
  const aussen = x(Math.max(...ringe));
  const svg = svgKnoten('svg', { class: 'suche-mass', 'aria-hidden': 'true', focusable: 'false' });
  svg.append(
    svgKnoten('line', { class: 'suche-mass-achse', x1: '0', x2: aussen, y1: '50%', y2: '50%' }),
    svgKnoten('line', { class: 'suche-mass-achse suche-mass-weiter', x1: aussen, x2: '100%', y1: '50%', y2: '50%' }),
  );
  for (const r of ringe) svg.append(svgKnoten('line', { class: 'suche-mass-ring', x1: x(r), x2: x(r), y1: '0', y2: '100%' }));
  svg.append(svgKnoten('line', { class: `suche-mass-wert${massLage(km, ringe).offen ? ' suche-mass-offen' : ''}`, x1: '0', x2: x(km), y1: '50%', y2: '50%' }));
  return svg;
}

// Ein Registereintrag: Marke links, Titel als Link (über die ganze Zeile gestreckt) und Text rechts
function treffer({ marke, markeKlasse = '', titel, pfad, text, mass = null }, anfrage) {
  const li = knoten('li', 'suche-treffer');
  const a = markiert('a', 'suche-link', titel, anfrage);
  a.href = pfad;
  const inhalt = knoten('div', 'suche-inhalt');
  inhalt.append(a);
  if (text) inhalt.append(markiert('p', 'suche-text', text, anfrage));
  const bereich = knoten('span', `suche-bereich${markeKlasse}`, marke);
  if (mass) bereich.append(mass);
  li.append(bereich, inhalt);
  return li;
}

// Leerzustand und Ladefehler nennen die Sitemap als Ausweg: Das Wort wird zum Link, der Text bleibt wörtlich
const AUSWEG = 'Sitemap';
function meldung(status, text, ziel) {
  const i = ziel ? text.indexOf(AUSWEG) : -1;
  if (i < 0) { status.textContent = text; return; }
  const a = knoten('a', '', AUSWEG);
  a.href = ziel;
  status.replaceChildren(text.slice(0, i), a, text.slice(i + AUSWEG.length));
}

export function suche(el) {
  const eingabe = el.querySelector('.suche-eingabe');
  const leeren = el.querySelector('.suche-leeren');
  const status = el.querySelector('.suche-status');
  const seitenListe = el.querySelector('[data-rolle="seiten"]');
  const orteListe = el.querySelector('[data-rolle="orte"]');
  const ergebnis = el.querySelector('.suche-ergebnis');
  const ohneJs = el.querySelector('.suche-ohne-js');
  const themen = el.querySelector('[data-rolle="themen"]');
  // Hauptthemen genau dann, wenn keine Treffer stehen (leer, zu kurz, keine Treffer, Ladefehler)
  const themenZeigen = () => { if (themen) themen.hidden = !ergebnis.hidden; };
  const sitemap = el.getAttribute('data-sitemap');
  const ringe = (el.getAttribute('data-ringe') || '').split(',').map(Number).filter((r) => r > 0);
  if (!eingabe || !status || !seitenListe || !orteListe) return;
  el.querySelector('.suche-feld').hidden = false;
  if (ohneJs) ohneJs.hidden = true;

  let daten = null;
  const holen = (attr) => fetch(el.getAttribute(`data-${attr}`), { integrity: el.getAttribute(`data-${attr}-sri`), credentials: 'omit' }).then((r) => r.json());
  const laden = () => {
    if (daten) return daten;
    daten = Promise.all([holen('seiten'), holen('orte'), holen('plz')])
      .then(([s, o, p]) => ({ seiten: seitenIndex(s), orte: indexAufbauen(o), plz: plzDekodieren(p.p) }))
      .catch(() => { meldung(status, el.getAttribute('data-fehler'), sitemap); daten = null; return null; });
    return daten;
  };

  let stand = 'a';
  // still: erste Anzeige einer Anfrage aus der Adresse – keine Rückmeldung, weil niemand etwas getan hat (P6)
  const zeigen = async ({ still = false } = {}) => {
    const q = eingabe.value.trim();
    if (leeren) leeren.hidden = !eingabe.value;
    const adresse = new URL(window.location.href);
    if (q) adresse.searchParams.set('q', q); else adresse.searchParams.delete('q');
    history.replaceState(null, '', `${adresse.pathname}${adresse.search}`);
    if (q.length < 2) {
      ergebnis.hidden = true;
      themenZeigen();
      status.textContent = q ? el.getAttribute('data-kurz') : '';
      return;
    }
    const d = await laden();
    if (eingabe.value.trim() !== q) return;
    if (!d) { ergebnis.hidden = true; themenZeigen(); return; }
    const alleSeiten = seitenSuchen(d.seiten, q, Infinity);
    const seiten = alleSeiten.slice(0, MAX_SEITEN);
    const ergebnisOrte = suchen(d.orte, d.plz, q, 8);
    const orte = ergebnisOrte.treffer.filter((o) => o.slug);
    seitenListe.replaceChildren(...seiten.map((s) => treffer({ marke: s.bereich, titel: s.titel, pfad: s.pfad, text: s.text }, q)));
    orteListe.replaceChildren(...orte.map((o) => treffer({ marke: `${o.km}\u00A0km`, markeKlasse: ' suche-km', titel: o.name, pfad: `/schluesseldienst-${o.slug}/`, text: o.zusatz, mass: ringe.length ? massstab(o.km, ringe) : null }, q)));
    el.querySelector('[data-rolle="seiten-block"]').hidden = !seiten.length;
    el.querySelector('[data-rolle="orte-block"]').hidden = !orte.length;
    ergebnis.hidden = !(seiten.length || orte.length);
    themenZeigen();
    // M-12-Rückmeldung: Die neue Liste blendet kurz von .6 auf; der Wechsel des Attributs startet die Animation neu
    if (!still) {
      stand = stand === 'a' ? 'b' : 'a';
      ergebnis.setAttribute('data-stand', stand);
    }
    meldung(status, statusText({ seiten: seiten.length, seitenGesamt: alleSeiten.length, orte: orte.length, orteGesamt: Math.max(orte.length, ergebnisOrte.gesamt) })
      || el.getAttribute('data-leer'), sitemap);
  };

  let zeitgeber = 0;
  eingabe.addEventListener('focus', laden, { once: true });
  eingabe.addEventListener('input', () => { clearTimeout(zeitgeber); zeitgeber = setTimeout(() => zeigen(), WARTEN); });
  // Enter und Esc (type=search) zeigen sofort, ohne die Wartezeit
  eingabe.addEventListener('search', () => { clearTimeout(zeitgeber); zeigen(); });
  leeren?.addEventListener('click', () => {
    eingabe.value = '';
    zeigen();
    eingabe.focus();
  });
  const start = new URL(window.location.href).searchParams.get('q');
  // Mit Anfrage in der Adresse warten die Hauptthemen verborgen auf das Ergebnis, statt kurz aufzublitzen
  if (start) { eingabe.value = start.slice(0, 80); if (themen) themen.hidden = true; zeigen({ still: true }); }
}
