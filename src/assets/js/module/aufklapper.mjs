// Offenlegungs-Navigation (M-05): Knopf mit aria-expanded steuert ein Panel; Esc und Klick außerhalb schließen.
export function aufklapper(knopf) {
  const panel = document.getElementById(knopf.getAttribute('aria-controls'));
  if (!panel) return;
  knopf.hidden = false;
  panel.setAttribute('data-zustand', 'zu');
  const setzen = (offen) => {
    knopf.setAttribute('aria-expanded', String(offen));
    panel.setAttribute('data-zustand', offen ? 'offen' : 'zu');
  };
  knopf.addEventListener('click', () => setzen(knopf.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && knopf.getAttribute('aria-expanded') === 'true') { setzen(false); knopf.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (knopf.getAttribute('aria-expanded') === 'true' && !panel.contains(e.target) && !knopf.contains(e.target)) setzen(false);
  });
  panel.addEventListener('focusout', (e) => {
    if (e.relatedTarget && !panel.contains(e.relatedTarget) && e.relatedTarget !== knopf) setzen(false);
  });
}
