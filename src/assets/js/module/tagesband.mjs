// Tagesband (V04): setzt die Marke „jetzt“ auf Zeile, Lage (x in Prozent, per Attribut) und Uhrzeit und markiert das
// gültige Zeitfenster in Legende und Preistabelle (data-jetzt). Ohne Uhrzeiten (band null) bleibt es bei Zeile und Uhrzeit.
// Feiertage kennt die Logik nicht; die Seite sagt das. Der Takt folgt der Minutengrenze, damit die Uhrzeit nicht nachläuft.
import { jetzt } from '../logik/preise.mjs';

const ABSTAND = 8; // Abstand der Beschriftung zur Linie (px, wie dx in der Vorlage)
const zweistellig = (n) => String(n).padStart(2, '0');

export function tagesband(el) {
  let daten;
  try { daten = JSON.parse(el.getAttribute('data-band') || ''); } catch { return; }
  const marken = [...el.querySelectorAll('[data-rolle="marke"]')];
  // Nur eigene Markierungen zurücksetzen: Die Vorauswahl des Preisrechners trägt dasselbe Attribut.
  const markiert = () => [...el.querySelectorAll('[data-jetzt]'), ...document.querySelectorAll('.preis-tabelle [data-jetzt]')];
  const aktualisieren = () => {
    const j = jetzt(daten.band, new Date());
    const x = `${(j.anteil * 100).toFixed(2)}%`;
    const minuten = Math.round(j.anteil * 24 * 60);
    for (const marke of marken) {
      marke.setAttribute('transform', `translate(0 ${daten.zeilen[j.art] ?? 0})`);
      for (const linie of marke.querySelectorAll('line')) { linie.setAttribute('x1', x); linie.setAttribute('x2', x); }
      marke.querySelector('circle')?.setAttribute('cx', x);
      const zeit = marke.querySelector('.tb-jetzt-zeit');
      if (zeit) zeit.textContent = `${zweistellig(Math.floor(minuten / 60) % 24)}:${zweistellig(minuten % 60)}`;
      marke.setAttribute('data-sichtbar', '');
      // Beschriftung rechts der Linie; links, wenn sie sonst über den Rand des Bands liefe (gemessen, erst nach dem Einblenden)
      const text = marke.querySelector('text');
      if (text) {
        text.setAttribute('x', x);
        const breite = marke.ownerSVGElement?.getBoundingClientRect().width || 0;
        const links = j.anteil * breite + ABSTAND + text.getComputedTextLength() > breite;
        text.setAttribute('dx', String(links ? -ABSTAND : ABSTAND));
        text.setAttribute('text-anchor', links ? 'end' : 'start');
      }
    }
    for (const z of markiert()) z.removeAttribute('data-jetzt');
    if (!j.fenster) return;
    for (const z of el.querySelectorAll(`.tb-zeile[data-art="${j.art}"] [data-fenster="${j.fenster}"], .tb-eintrag[data-fenster="${j.fenster}"]`)) z.setAttribute('data-jetzt', '');
    for (const z of document.querySelectorAll(`.preis-tabelle [data-fenster="${j.fenster}"]`)) z.setAttribute('data-jetzt', '');
  };
  const takt = () => {
    aktualisieren();
    setTimeout(takt, 60_000 - (Date.now() % 60_000) + 50);
  };
  takt();
  window.addEventListener('resize', aktualisieren, { passive: true });
}
