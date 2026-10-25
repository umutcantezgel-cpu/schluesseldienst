// Preisrechner (V04, K-009): drei Fragen, ein Endbetrag mit Aufschlüsselung im <output aria-live>.
// data-preise: { vollstaendig, positionen, anfahrt, nurAbsprache, titel: { positionen, fenster, zonen }, texte }
// data-band (optional): Tagesband für die Vorauswahl „jetzt“. Nur textContent, keine HTML-Strings.
// Eine Gruppe (role=group) statt <form>: Es gibt nichts abzusenden (Sicherheitsregel S12).
import { rechnen, jetzt, euro } from '../logik/preise.mjs';

export function preisrechner(el) {
  let daten;
  try { daten = JSON.parse(el.getAttribute('data-preise') || ''); } catch { return; }
  let band = null;
  try { band = JSON.parse(el.getAttribute('data-band') || 'null'); } catch { band = null; }
  const summe = el.querySelector('.rechner-summe');
  const teile = el.querySelector('.rechner-aufschluesselung');
  const wert = (name) => el.querySelector(`input[name="${name}"]:checked`)?.value;
  if (band) {
    const j = jetzt(band, new Date());
    const feld = j.fenster && el.querySelector(`input[name="fenster"][value="${j.fenster}"]`);
    if (feld) {
      feld.checked = true;
      feld.closest('.rechner-option')?.setAttribute('data-jetzt', '');
    }
  }
  const zeigen = () => {
    const wahl = { position: wert('position'), fenster: wert('fenster'), zone: wert('zone') };
    const r = rechnen(daten, wahl);
    if (r.status === 'betrag') {
      summe.textContent = euro(r.cent);
      const t = daten.titel;
      teile.textContent = r.anfahrt > 0
        ? `${t.positionen[wahl.position]}, ${t.fenster[wahl.fenster]}: ${euro(r.preis)} · Anfahrt ${t.zonen[wahl.zone]}: ${euro(r.anfahrt)}`
        : `${t.positionen[wahl.position]}, ${t.fenster[wahl.fenster]} · Anfahrt enthalten`;
    } else {
      summe.textContent = r.status === 'absprache' ? daten.texte.absprache : daten.texte.offen;
      teile.textContent = '';
    }
    el.setAttribute('data-status', r.status);
  };
  el.addEventListener('change', zeigen);
  zeigen();
}
