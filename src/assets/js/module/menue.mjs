// Menü-Blatt (M-06): öffnet den <dialog> von unten; ohne JS bleibt der Link zur Fußnavigation.
// Die Leistungsseiten je Gruppe übernimmt das Blatt beim ersten Öffnen aus der Desktop-Navigation (#untermenue-leistungen,
// auf jeder Seite im HTML): als Offenlegung mit aria-expanded (K-006), ohne zusätzliches HTML je Seite (Budget der
// Ortsseiten, D-NAV-01).
function blattGruppenEinhaengen(blatt) {
  const pfad = location.pathname;
  const chevron = document.querySelector('.hauptnav-aufklapper svg');
  let nr = 0;
  for (const titel of document.querySelectorAll('#untermenue-leistungen .hauptnav-gruppe-titel')) {
    const quelle = titel.nextElementSibling;
    const ziel = [...blatt.querySelectorAll('nav li > a')].find((a) => a.getAttribute('href') === titel.getAttribute('href'));
    if (!ziel || !quelle || quelle.tagName !== 'UL') continue;
    nr += 1;
    const liste = quelle.cloneNode(true);
    liste.id = `menue-gruppe-${nr}`;
    const knopf = document.createElement('button');
    knopf.type = 'button';
    knopf.className = 'menue-blatt-aufklapper';
    knopf.setAttribute('aria-controls', liste.id);
    const name = document.createElement('span');
    name.className = 'unsichtbar';
    name.textContent = `Leistungen: ${ziel.textContent}`;
    knopf.append(name);
    if (chevron) knopf.append(chevron.cloneNode(true));
    const setzen = (offen) => { knopf.setAttribute('aria-expanded', String(offen)); liste.hidden = !offen; };
    setzen(pfad.startsWith(titel.getAttribute('href')));
    knopf.addEventListener('click', () => setzen(knopf.getAttribute('aria-expanded') !== 'true'));
    ziel.parentElement.classList.add('menue-blatt-gruppe');
    ziel.after(knopf, liste);
  }
  for (const a of blatt.querySelectorAll('nav a')) if (a.getAttribute('href') === pfad) a.setAttribute('aria-current', 'page');
}

export function menue(ausloeser) {
  const blatt = document.getElementById(ausloeser.getAttribute('aria-controls'));
  if (!blatt || typeof blatt.showModal !== 'function') return;
  ausloeser.setAttribute('aria-haspopup', 'dialog');
  ausloeser.setAttribute('aria-expanded', 'false');
  let eingehaengt = false;
  ausloeser.addEventListener('click', (ereignis) => {
    ereignis.preventDefault();
    if (!eingehaengt) { blattGruppenEinhaengen(blatt); eingehaengt = true; }
    blatt.showModal();
    ausloeser.setAttribute('aria-expanded', 'true');
  });
  blatt.addEventListener('close', () => { ausloeser.setAttribute('aria-expanded', 'false'); ausloeser.focus(); });
  // Ein Klick auf das Blatt selbst trifft auch dessen Innenabstand; schließen nur außerhalb des Rechtecks (Hintergrund).
  // Links (auch die übernommenen) schließen das Blatt, ebenso der Schließen-Knopf.
  blatt.addEventListener('click', (ereignis) => {
    if (ereignis.target === blatt) {
      const r = blatt.getBoundingClientRect();
      const { clientX: x, clientY: y } = ereignis;
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) blatt.close();
      return;
    }
    if (ereignis.target.closest('a, [data-menue-zu]')) blatt.close();
  });
}
