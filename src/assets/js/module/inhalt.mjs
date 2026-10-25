// Inhaltsverzeichnis im Ratgeber-Artikel (V08): Der Eintrag des Abschnitts, in dem man gerade liest, trägt
// aria-current – ohne Animation (Arbeitsansicht). Beobachtet wird das obere Drittel des Fensters; liegen dort zwei
// Abschnitte, gilt der spätere. Die Lücke zwischen zwei Abschnitten ist kleiner als dieses Band, also ist es nur
// vor dem ersten und nach dem letzten Abschnitt leer – dann ist kein Eintrag aktiv.
export function inhalt(nav) {
  const paare = [];
  for (const a of nav.querySelectorAll('a[href^="#"]')) {
    const ziel = document.getElementById(a.getAttribute('href').slice(1));
    const teil = ziel && ziel.closest('section');
    if (teil) paare.push({ a, teil });
  }
  if (!paare.length || !('IntersectionObserver' in window)) return;
  const imBand = new Set();
  let aktiv = null;
  const beobachter = new IntersectionObserver((eintraege) => {
    for (const e of eintraege) {
      if (e.isIntersecting) imBand.add(e.target);
      else imBand.delete(e.target);
    }
    const treffer = paare.filter((p) => imBand.has(p.teil)).pop();
    const a = treffer ? treffer.a : null;
    if (a === aktiv) return;
    if (aktiv) aktiv.removeAttribute('aria-current');
    if (a) a.setAttribute('aria-current', 'true');
    aktiv = a;
  }, { rootMargin: '0px 0px -66% 0px' });
  for (const p of paare) beobachter.observe(p.teil);
}
