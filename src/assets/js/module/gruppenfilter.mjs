// Gruppenfilter (V11 /leistungen/, M-05): Die Sprungleiste wird zu Umschaltknöpfen für die vier Gruppen und „Alle“
// (aria-pressed); ausgeblendete Gruppen erhalten [hidden]. Alle Einträge stehen schon im HTML als Sprunglinks, das Modul
// ersetzt sie durch gleich große Knöpfe – beim Start verrutscht nichts. Beim Laden wird nicht gefiltert: Ein Anker
// (#gruppe-…) springt wie ohne JavaScript zur Gruppe, alle Gruppen bleiben sichtbar (keine Layoutverschiebung, Tiefenlinks
// bleiben gültig). Ein Wechsel schreibt den Anker der Gruppe per history.replaceState in die Adresse und holt die Gruppe
// in den Blick, wenn sie weit unten beginnt; ein zweiter Klick auf die gedrückte Gruppe zeigt wieder alle. Die Statuszeile
// ist nur für Screenreader (role=status) und wird erst beim ersten Wechsel befüllt (keine Ansage beim Laden).
// Im Druck sind alle Gruppen da (wie ohne JavaScript). Einblenden nach einem Wechsel: data-zustand="neu" (bewegung.css).
// Nur DOM-sichere APIs (keine HTML-Strings).

export function gruppenfilter(leiste) {
  const links = [...leiste.querySelectorAll('a[data-gruppe]')];
  const abschnitte = [...document.querySelectorAll('.verz-gruppe[data-gruppe]')];
  if (!links.length || !abschnitte.length) return;
  // Mit Knöpfen ist die Leiste ein Filter, keine Navigation mehr
  if (leiste.dataset.filterTitel) leiste.setAttribute('aria-label', leiste.dataset.filterTitel);

  const anzahl = (n) => `${n} ${n === 1 ? 'Leistung' : 'Leistungen'}`;
  const eintraege = (s) => s.querySelectorAll('.verz-eintrag').length;
  const gesamt = abschnitte.reduce((n, s) => n + eintraege(s), 0);
  const status = document.createElement('p');
  status.className = 'unsichtbar';
  status.setAttribute('role', 'status');
  leiste.after(status);

  const abschnitt = (schluessel) => abschnitte.find((s) => s.dataset.gruppe === schluessel);
  const reduziert = matchMedia('(prefers-reduced-motion: reduce)');
  let aktuell = '';

  const setzen = (schluessel) => {
    aktuell = schluessel;
    for (const s of abschnitte) {
      const zeigen = !schluessel || s.dataset.gruppe === schluessel;
      if (zeigen && s.hidden) s.setAttribute('data-zustand', 'neu');
      else s.removeAttribute('data-zustand');
      s.hidden = !zeigen;
    }
    for (const k of knoepfe) k.el.setAttribute('aria-pressed', String(k.schluessel === schluessel));
    const gewaehlt = abschnitt(schluessel);
    status.textContent = gewaehlt ? `${gewaehlt.querySelector('h2')?.textContent ?? ''}: ${anzahl(eintraege(gewaehlt))}` : `Alle ${anzahl(gesamt)}`;
  };

  const waehlen = (schluessel) => {
    setzen(schluessel);
    const gewaehlt = abschnitt(schluessel);
    history.replaceState(null, '', `${location.pathname}${location.search}${gewaehlt ? `#${gewaehlt.id}` : ''}`);
    // Beginnt die Liste weit unten (mobil oft hinter der Rufleiste), rückt sie in den Blick; der Fokus bleibt am Knopf
    const ziel = gewaehlt ?? abschnitte[0];
    if (ziel.getBoundingClientRect().top > innerHeight * 0.6) ziel.scrollIntoView({ block: 'start', behavior: reduziert.matches ? 'instant' : 'smooth' });
  };

  // Jeder Sprunglink (auch „Alle“ mit leerem data-gruppe) wird zum Knopf mit seinem Inhalt
  const knoepfe = links.map((a) => {
    const schluessel = a.dataset.gruppe;
    const el = document.createElement('button');
    el.type = 'button';
    el.replaceChildren(...a.childNodes);
    el.setAttribute('aria-pressed', String(schluessel === ''));
    el.addEventListener('click', () => waehlen(schluessel && schluessel === aktuell ? '' : schluessel));
    a.replaceWith(el);
    return { schluessel, el };
  });

  // Wechsel über die Adresse (Link auf #gruppe-… innerhalb der Seite): filtern und die Gruppe in den Blick holen
  window.addEventListener('hashchange', () => {
    const gewaehlt = abschnitte.find((s) => `#${s.id}` === location.hash);
    if (gewaehlt && gewaehlt.dataset.gruppe !== aktuell) {
      setzen(gewaehlt.dataset.gruppe);
      gewaehlt.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  });
  // Druck: alle Gruppen, wie ohne JavaScript (die Basisregel [hidden] lässt sich per CSS nicht aufheben)
  window.addEventListener('beforeprint', () => { for (const s of abschnitte) s.hidden = false; });
  window.addEventListener('afterprint', () => setzen(aktuell));
}
