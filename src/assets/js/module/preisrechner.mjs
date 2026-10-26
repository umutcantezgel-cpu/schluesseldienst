// Preisrechner (V04, K-009): drei Fragen, ein Endbetrag. Das Ergebnis steht wie eine Rechnung da: Posten (Leistung im
// Zeitfenster, Anfahrt), Summenstrich, Gesamtpreis im <output aria-live>. Nur textContent und createElement.
// data-preise: { vollstaendig, positionen, anfahrt, nurAbsprache, offen, titel: { positionen, fenster, zonen }, texte }
// data-band (optional): Tagesband für die Vorauswahl „jetzt“.
// Solange die Preisliste fehlt (Status „offen“), steht die Rechnung trotzdem da: Posten der Auswahl, fehlende Beträge
// als Platzhalter (nur Vorschau; das Release verweigert Platzhalter), darunter der Satz statt einer Summe.
// Eine Gruppe (role=group) statt <form>: Es gibt nichts abzusenden (Sicherheitsregel S12).
import { rechnen, jetzt, euro } from '../logik/preise.mjs';

// Posten wie in der Formel im Kopf: Titel, darunter die Angabe, die ihn bestimmt (Zeitfenster, Zone). Das Leerzeichen
// vor der Blockzeile verschwindet im Satz, trennt aber für Screenreader die beiden Teile.
function posten(titel, zusatz, wert) {
  const zeile = document.createElement('div');
  const dt = document.createElement('dt');
  const dd = document.createElement('dd');
  dt.textContent = titel;
  if (zusatz) {
    const z = document.createElement('span');
    z.className = 'rechner-posten-zusatz';
    z.textContent = zusatz;
    dt.append(' ', z);
  }
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
  let vorher = {};
  const zeigen = (neu) => {
    const wahl = { position: wert('position'), fenster: wert('fenster'), zone: wert('zone') };
    const r = rechnen(daten, wahl);
    const t = daten.titel;
    const leistung = t.positionen[wahl.position] && t.fenster[wahl.fenster];
    const zone = t.zonen[wahl.zone];
    if (r.status === 'betrag') {
      liste?.replaceChildren(
        posten(t.positionen[wahl.position], t.fenster[wahl.fenster], euro(r.preis)),
        posten('Anfahrt', zone, r.anfahrt > 0 ? euro(r.anfahrt) : 'enthalten'),
      );
      summe.textContent = euro(r.cent);
    } else if (r.status === 'offen' && daten.offen && leistung && zone) {
      const o = daten.offen;
      liste?.replaceChildren(
        posten(t.positionen[wahl.position], t.fenster[wahl.fenster], offenerWert(o[`${wahl.position}/${wahl.fenster}`], daten.positionen[wahl.position]?.[wahl.fenster])),
        posten('Anfahrt', zone, offenerWert(o[`anfahrt/${wahl.zone}`], daten.anfahrt[wahl.zone])),
      );
      summe.textContent = daten.texte.offen;
    } else {
      liste?.replaceChildren();
      summe.textContent = r.status === 'absprache' ? daten.texte.absprache : daten.texte.offen;
    }
    el.setAttribute('data-status', r.status);
    // M-12 nur an dem, was sich geändert hat: Wer die Zone wechselt, sieht die Anfahrt aufblenden, nicht die Leistung.
    // Teile nach Rolle (die Zahl der Posten wechselt mit dem Status). Wechsel a/b startet die Animation neu.
    const teile = { leistung: liste?.children[0], anfahrt: liste?.children[1], summe };
    const jetztTexte = Object.fromEntries(Object.entries(teile).map(([rolle, t]) => [rolle, t?.textContent]));
    if (neu && ergebnis) {
      for (const [rolle, t] of Object.entries(teile)) t?.toggleAttribute('data-neu', jetztTexte[rolle] !== vorher[rolle]);
      ergebnis.setAttribute('data-takt', (takt = takt === 'a' ? 'b' : 'a'));
    }
    vorher = jetztTexte;
  };
  el.addEventListener('change', () => zeigen(true));
  zeigen(false);
}
