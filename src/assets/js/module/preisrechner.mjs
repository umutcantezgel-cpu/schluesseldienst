// Preisrechner (V04, K-009): drei Fragen, ein Endbetrag. Das Ergebnis steht wie eine Rechnung da: Posten (Leistung im
// Zeitfenster, Anfahrt), Summenstrich, Gesamtpreis im <output aria-live>. Nur textContent und createElement.
// data-preise: { vollstaendig, positionen, anfahrt, nurAbsprache, offen, titel: { positionen, fenster, zonen }, texte }
// data-band (optional): Tagesband für die Vorauswahl „jetzt“.
// Solange die Preisliste fehlt (Status „offen“), steht die Rechnung trotzdem da: Posten der Auswahl, fehlende Beträge
// als Platzhalter (nur Vorschau; das Release verweigert Platzhalter), darunter der Satz statt einer Summe.
// Eine Gruppe (role=group) statt <form>: Es gibt nichts abzusenden (Sicherheitsregel S12).
import { rechnen, jetzt, euro } from '../logik/preise.mjs';

function posten(titel, wert) {
  const zeile = document.createElement('div');
  const dt = document.createElement('dt');
  const dd = document.createElement('dd');
  dt.textContent = titel;
  dd.append(wert);
  zeile.append(dt, dd);
  return zeile;
}

function platzhalter(beschriftung) {
  const s = document.createElement('span');
  s.className = 'platzhalter';
  s.textContent = beschriftung;
  return s;
}

// Wert eines Postens im offenen Zustand: Platzhalter, sonst wie in der Preisliste (null = nach Absprache, 0 = enthalten)
const offenerWert = (beschriftung, cent) => {
  if (beschriftung) return platzhalter(beschriftung);
  if (cent === null || cent === undefined) return 'nach Absprache';
  return cent > 0 ? euro(cent) : 'enthalten';
};

export function preisrechner(el) {
  let daten;
  try { daten = JSON.parse(el.getAttribute('data-preise') || ''); } catch { return; }
  let band = null;
  try { band = JSON.parse(el.getAttribute('data-band') || 'null'); } catch { band = null; }
  const ergebnis = el.querySelector('.rechner-ergebnis');
  const summe = el.querySelector('.rechner-summe');
  const liste = el.querySelector('.rechner-posten');
  const wert = (name) => el.querySelector(`input[name="${name}"]:checked`)?.value;
  if (band) {
    const j = jetzt(band, new Date());
    const feld = j.fenster && el.querySelector(`input[name="fenster"][value="${j.fenster}"]`);
    if (feld) {
      feld.checked = true;
      feld.closest('.wahl-option')?.setAttribute('data-jetzt', '');
    }
  }
  let takt = '';
  const zeigen = (neu) => {
    const wahl = { position: wert('position'), fenster: wert('fenster'), zone: wert('zone') };
    const r = rechnen(daten, wahl);
    const t = daten.titel;
    const leistung = t.positionen[wahl.position] && t.fenster[wahl.fenster] ? `${t.positionen[wahl.position]}, ${t.fenster[wahl.fenster]}` : '';
    if (r.status === 'betrag') {
      liste?.replaceChildren(
        posten(leistung, euro(r.preis)),
        posten(`Anfahrt ${t.zonen[wahl.zone]}`, r.anfahrt > 0 ? euro(r.anfahrt) : 'enthalten'),
      );
      summe.textContent = euro(r.cent);
    } else if (r.status === 'offen' && daten.offen && leistung && t.zonen[wahl.zone]) {
      const o = daten.offen;
      liste?.replaceChildren(
        posten(leistung, offenerWert(o[`${wahl.position}/${wahl.fenster}`], daten.positionen[wahl.position]?.[wahl.fenster])),
        posten(`Anfahrt ${t.zonen[wahl.zone]}`, offenerWert(o[`anfahrt/${wahl.zone}`], daten.anfahrt[wahl.zone])),
      );
      summe.textContent = daten.texte.offen;
    } else {
      liste?.replaceChildren();
      summe.textContent = r.status === 'absprache' ? daten.texte.absprache : daten.texte.offen;
    }
    el.setAttribute('data-status', r.status);
    // M-12: Jede neue Auswahl blendet das Ergebnis kurz von .6 auf 1 (Wechsel a/b startet die Animation neu)
    if (neu && ergebnis) ergebnis.setAttribute('data-takt', (takt = takt === 'a' ? 'b' : 'a'));
  };
  el.addEventListener('change', () => zeigen(true));
  zeigen(false);
}
