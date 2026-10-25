// „Ablauf noch einmal ansehen“ (M-16): startet die CSS-Animation des großen Moments neu.
// Nur sichtbar, wenn keine reduzierte Bewegung eingestellt ist.
export function abspielen(knopf) {
  const ziel = document.getElementById(knopf.getAttribute('aria-controls'));
  const bewegung = window.matchMedia('(prefers-reduced-motion: no-preference)');
  if (!ziel) return;
  const sichtbar = () => { knopf.hidden = !bewegung.matches; };
  sichtbar();
  bewegung.addEventListener('change', sichtbar);
  knopf.addEventListener('click', () => {
    const name = ziel.getAttribute('data-moment');
    ziel.removeAttribute('data-moment');
    void ziel.getBoundingClientRect();
    ziel.setAttribute('data-moment', name);
  });
}
