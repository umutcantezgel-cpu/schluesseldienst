// Gruppenfilter (V11 /leistungen/, M-05): Die Sprungleiste wird zu Umschaltknöpfen „Alle“ und vier Gruppen (aria-pressed).
// Ausgeblendete Gruppen erhalten [hidden]; die Statuszeile zählt aus dem DOM. Der Zustand steht per history.replaceState
// in der Adresse (#notoeffnung); ein vorhandener Anker wird beim Laden übernommen. Ohne JavaScript bleiben es Sprunglinks.
// Nur DOM-sichere APIs (keine HTML-Strings). Einblenden nach einem Wechsel: data-zustand="neu" (bewegung.css).

export function gruppenfilter(leiste) {
  const liste = leiste.querySelector('ul');
  const links = [...leiste.querySelectorAll('a[data-gruppe]')];
  const abschnitte = [...document.querySelectorAll('.verz-gruppe[data-gruppe]')];
  if (!liste || !links.length || !abschnitte.length) return;

  const anzahl = (n) => `${n} ${n === 1 ? 'Leistung' : 'Leistungen'}`;
  const gesamt = abschnitte.reduce((n, s) => n + s.querySelectorAll('.verz-eintrag').length, 0);
  const status = document.createElement('p');
  status.className = 'verz-status';
  status.setAttribute('role', 'status');
  leiste.after(status);

  const knoepfe = [];
  const umschalter = (schluessel, el) => {
    el.type = 'button';
    el.addEventListener('click', () => setzen(schluessel, { animieren: true, adresse: true }));
    knoepfe.push({ schluessel, el });
    return el;
  };

  // „Alle“ entsteht hier; jeder Sprunglink wird zum Knopf mit seinem Inhalt (Nummer und Titel bleiben erhalten)
  const alleEintrag = document.createElement('li');
  const alle = document.createElement('button');
  alle.textContent = 'Alle';
  alleEintrag.append(umschalter('', alle));
  liste.prepend(alleEintrag);
  for (const a of links) {
    const el = document.createElement('button');
    el.replaceChildren(...a.childNodes);
    a.replaceWith(umschalter(a.dataset.gruppe, el));
  }

  let aktuell = null;
  const setzen = (schluessel, { animieren = false, adresse = false } = {}) => {
    aktuell = schluessel;
    for (const s of abschnitte) {
      const zeigen = !schluessel || s.dataset.gruppe === schluessel;
      const einblenden = zeigen && animieren && s.hidden;
      s.hidden = !zeigen;
      if (einblenden) s.setAttribute('data-zustand', 'neu');
      else s.removeAttribute('data-zustand');
    }
    for (const k of knoepfe) k.el.setAttribute('aria-pressed', String(k.schluessel === schluessel));
    const gewaehlt = abschnitte.find((s) => s.dataset.gruppe === schluessel);
    status.textContent = gewaehlt
      ? `${gewaehlt.querySelector('h2')?.textContent ?? ''}: ${anzahl(gewaehlt.querySelectorAll('.verz-eintrag').length)}`
      : `Alle ${anzahl(gesamt)}`;
    if (adresse) history.replaceState(null, '', `${location.pathname}${location.search}${schluessel ? `#${schluessel}` : ''}`);
  };

  // Gruppenschlüssel aus der Adresse („#notoeffnung“ oder der Sprunganker „#gruppe-notoeffnung“); sonst null
  const ausAdresse = () => {
    const k = location.hash.slice(1).replace(/^gruppe-/, '');
    return abschnitte.some((s) => s.dataset.gruppe === k) ? k : null;
  };
  const vorgabe = ausAdresse();
  setzen(vorgabe ?? '', { adresse: vorgabe !== null });
  window.addEventListener('hashchange', () => {
    const k = ausAdresse();
    if (k !== null && k !== aktuell) setzen(k, { animieren: true, adresse: true });
  });
}
