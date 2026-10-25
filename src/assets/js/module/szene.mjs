// M-17 Szene: Der Schritt, der die Viewport-Mitte kreuzt, setzt data-zustand der klebenden Figur.
// Läuft nur mit IntersectionObserver; das CSS zeigt die Bühne erst bei data-szene="laeuft" (sonst Einzelbilder).
export function szene(wurzel) {
  const svg = wurzel.querySelector('.szene-figur svg');
  const schritte = [...wurzel.querySelectorAll('.szene-schritt[data-schritt]')];
  if (!svg || !schritte.length || !('IntersectionObserver' in window)) return;
  const setzen = (schritt) => {
    svg.setAttribute('data-zustand', schritt.getAttribute('data-schritt'));
    for (const s of schritte) s.toggleAttribute('data-aktiv', s === schritt);
  };
  setzen(schritte[0]);
  wurzel.setAttribute('data-szene', 'laeuft');
  const beobachter = new IntersectionObserver((eintraege) => {
    for (const e of eintraege) if (e.isIntersecting) setzen(e.target);
  }, { rootMargin: '-50% 0px -50% 0px' });
  for (const s of schritte) beobachter.observe(s);
}
