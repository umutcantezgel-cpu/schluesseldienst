// Reine Logik (testbar): Erreichbarkeitszustand zu einem Zeitpunkt in Europe/Berlin.
const TAGE = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa'];

export function berlinZeit(datum) {
  const teile = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(datum);
  const wert = (t) => teile.find((p) => p.type === t)?.value;
  const tagKurz = wert('weekday').slice(0, 2).toLowerCase();
  return { tag: tagKurz, minuten: Number(wert('hour')) * 60 + Number(wert('minute')) };
}

const minuten = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

export function zustandBerechnen(zeiten, nachtdienst, datum) {
  const { tag, minuten: jetzt } = berlinZeit(datum);
  const fenster = zeiten[tag] || [];
  const offen = fenster.some(([von, bis]) => jetzt >= minuten(von) && jetzt < minuten(bis));
  if (offen) return { zustand: 'erreichbar', text: 'Jetzt erreichbar' };
  if (nachtdienst) return { zustand: 'nacht', text: 'Nachtdienst · Zuschlag laut Preisliste' };
  return { zustand: 'ausserhalb', text: 'Außerhalb der Zeiten · Anfrage per E-Mail' };
}

export const WOCHENTAGE = TAGE;

// data-zeiten, Form siehe zeitenAlsText in src/vorlagen/teile/rufknopf.mjs (D-DATEN-01)
export const FOLGE = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'];
const ZEITRAUM = /^(\d\d:\d\d)-(\d\d:\d\d)$/;

/** Zeiten aus data-zeiten; null bei falscher Form. */
export function zeitenAusText(text) {
  const felder = String(text).split('|');
  if (felder.length !== FOLGE.length) return null;
  const zeiten = {};
  for (let i = 0; i < FOLGE.length; i++) {
    const liste = felder[i] ? felder[i].split(',').map((z) => z.match(ZEITRAUM)) : [];
    if (liste.some((m) => !m)) return null;
    zeiten[FOLGE[i]] = liste.map((m) => [m[1], m[2]]);
  }
  return zeiten;
}
