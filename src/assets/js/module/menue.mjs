// Menü-Blatt (M-06): öffnet den <dialog> von unten; ohne JS bleibt der Link zur Fußnavigation.
export function menue(ausloeser) {
  const blatt = document.getElementById(ausloeser.getAttribute('aria-controls'));
  if (!blatt || typeof blatt.showModal !== 'function') return;
  ausloeser.setAttribute('aria-haspopup', 'dialog');
  ausloeser.setAttribute('aria-expanded', 'false');
  ausloeser.addEventListener('click', (ereignis) => {
    ereignis.preventDefault();
    blatt.showModal();
    ausloeser.setAttribute('aria-expanded', 'true');
  });
  blatt.addEventListener('close', () => { ausloeser.setAttribute('aria-expanded', 'false'); ausloeser.focus(); });
  blatt.addEventListener('click', (ereignis) => { if (ereignis.target === blatt) blatt.close(); });
  for (const zu of blatt.querySelectorAll('[data-menue-zu]')) zu.addEventListener('click', () => blatt.close());
  for (const link of blatt.querySelectorAll('a')) link.addEventListener('click', () => blatt.close());
}
