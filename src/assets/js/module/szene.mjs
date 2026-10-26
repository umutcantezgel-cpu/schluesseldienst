// M-17 Szene: Der Schritt, der die Viewport-Mitte kreuzt, setzt data-zustand der klebenden Figur und markiert
// sich und seinen Eintrag in der Stückliste der Bühne (data-aktiv).
// Läuft nur mit IntersectionObserver; das CSS zeigt die Bühne erst bei data-szene="laeuft" (sonst Einzelbilder).
export function szene(wurzel) {
  const svg = wurzel.querySelector('.szene-figur svg');
  const schritte = [...wurzel.querySelectorAll('.szene-schritt[data-schritt]')];
  const marken = [...wurzel.querySelectorAll('.szene-liste [data-schritt]')];
  if (!svg || !schritte.length || !('IntersectionObserver' in window)) return;
  const setzen = (schritt) => {
    const n = schritt.getAttribute('data-schritt');
    svg.setAttribute('data-zustand', n);
    for (const s of [...schritte, ...marken]) s.toggleAttribute('data-aktiv', s.getAttribute('data-schritt') === n);
  };
  setzen(schritte[0]);
  wurzel.setAttribute('data-szene', 'laeuft');
  const beobachter = new IntersectionObserver((eintraege) => {
    for (const e of eintraege) if (e.isIntersecting) setzen(e.target);
  }, { rootMargin: '-50% 0px -50% 0px' });
  for (const s of schritte) beobachter.observe(s);
}
