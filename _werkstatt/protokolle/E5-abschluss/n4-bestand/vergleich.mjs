import { readFileSync } from 'node:fs';
const neu = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const alt = JSON.parse(readFileSync(process.argv[3], 'utf8'));
console.log('Schluessel neu:', Object.keys(neu).join(','), '| alt:', Object.keys(alt).join(','));
const ne = neu.ergebnisse, ae = alt.ergebnisse;
console.log('Anzahl neu', ne.length, 'alt', ae.length);
const keys = Object.keys(ne[0] ?? {});
console.log('Felder:', keys.join(','));
for (let i = 0; i < Math.max(ne.length, ae.length); i++) {
  const a = ae[i] ?? {}, n = ne[i] ?? {};
  const id = n.id ?? n.nr ?? n.funktion ?? a.id ?? i;
  const ausgabe = (o) => JSON.stringify(o, (k, v) => (['zeitpunkt','ms','dauer','dauerMs'].includes(k) ? undefined : v));
  if (ausgabe(a) !== ausgabe(n)) console.log('ABWEICHUNG', id, '\n  alt:', ausgabe(a).slice(0, 600), '\n  neu:', ausgabe(n).slice(0, 600));
}
console.log('Vergleich fertig');
