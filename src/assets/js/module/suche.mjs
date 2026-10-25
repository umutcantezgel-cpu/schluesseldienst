// Seitensuche (V11 /suche/): Seitenindex und Ortsindex laden beim ersten Fokus bzw. bei vorhandener Anfrage (?q=),
// Ergebnisse als zwei Linklisten, Anzahl in einer Statuszeile (aria-live). Kein <form> (CSP form-action mailto:),
// die Anfrage steht per history.replaceState in der Adresse. Nur DOM-sichere APIs.
import { seitenIndex, seitenSuchen } from '../logik/suche.mjs';
import { indexAufbauen, suchen, plzDekodieren } from '../logik/ortsindex.mjs';

const WARTEN = 150;

function knoten(tag, klasse, inhalt) {
  const e = document.createElement(tag);
  if (klasse) e.className = klasse;
  if (inhalt !== undefined) e.textContent = inhalt;
  return e;
}

export function suche(el) {
  const eingabe = el.querySelector('.suche-eingabe');
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

  const zeigen = async () => {
    const q = eingabe.value.trim();
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
    const seiten = seitenSuchen(d.seiten, q);
    const orte = suchen(d.orte, d.plz, q, 8);
    seitenListe.replaceChildren(...seiten.map((s) => {
      const li = knoten('li', 'suche-treffer');
      const a = knoten('a', 'suche-link');
      a.href = s.pfad;
      a.append(knoten('span', 'suche-titel', s.titel), knoten('span', 'suche-bereich', s.bereich));
      li.append(a, knoten('p', 'suche-text', s.text));
      return li;
    }));
    orteListe.replaceChildren(...orte.treffer.filter((o) => o.slug).map((o) => {
      const li = knoten('li', 'suche-treffer');
      const a = knoten('a', 'suche-link');
      a.href = `/schluesseldienst-${o.slug}/`;
      a.append(knoten('span', 'suche-titel', o.name), knoten('span', 'suche-bereich', `${o.zusatz} · ${o.km} km`));
      li.append(a);
      return li;
    }));
    el.querySelector('[data-rolle="seiten-block"]').hidden = !seiten.length;
    el.querySelector('[data-rolle="orte-block"]').hidden = !orte.treffer.length;
    ergebnis.hidden = !(seiten.length || orte.treffer.length);
    status.textContent = seiten.length || orte.treffer.length
      ? `${seiten.length} ${seiten.length === 1 ? 'Seite' : 'Seiten'}, ${orte.gesamt} ${orte.gesamt === 1 ? 'Ort' : 'Orte'}`
      : el.getAttribute('data-leer');
  };

  let zeitgeber = 0;
  eingabe.addEventListener('focus', laden, { once: true });
  eingabe.addEventListener('input', () => { clearTimeout(zeitgeber); zeitgeber = setTimeout(zeigen, WARTEN); });
  const start = new URL(window.location.href).searchParams.get('q');
  if (start) { eingabe.value = start.slice(0, 80); zeigen(); }
}
