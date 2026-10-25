// Tagesband (V04): setzt die Marke „jetzt“ per transform-Attribut auf die gültige Zeile und markiert das
// Zeitfenster in Legende und Preistabelle (data-jetzt). Feiertage kennt die Logik nicht; die Seite sagt das.
import { jetzt } from '../logik/preise.mjs';

export function tagesband(el) {
  let daten;
  try { daten = JSON.parse(el.getAttribute('data-band') || ''); } catch { return; }
  const marken = [...el.querySelectorAll('[data-rolle="marke"]')];
  const aktualisieren = () => {
    const j = jetzt(daten.band, new Date());
    for (const marke of marken) {
      const breite = Number(marke.closest('svg')?.getAttribute('data-breite')) || 0;
      marke.setAttribute('transform', `translate(${Math.round(j.anteil * breite)} ${daten.zeilen[j.art]})`);
      marke.setAttribute('data-sichtbar', '');
    }
    for (const z of document.querySelectorAll('[data-jetzt]')) z.removeAttribute('data-jetzt');
    if (!j.fenster) return;
    for (const z of el.querySelectorAll(`.tb-zeile[data-art="${j.art}"] [data-fenster="${j.fenster}"], .tb-eintrag[data-fenster="${j.fenster}"]`)) z.setAttribute('data-jetzt', '');
    for (const z of document.querySelectorAll(`.preis-tabelle [data-fenster="${j.fenster}"]`)) z.setAttribute('data-jetzt', '');
  };
  aktualisieren();
  setInterval(aktualisieren, 60_000);
}
