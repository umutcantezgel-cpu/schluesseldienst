const knopf = document.querySelector('[data-zaehler]');
const ausgabe = document.querySelector('output');
let n = 0;
knopf?.addEventListener('click', () => { n += 1; ausgabe.textContent = String(n); });
