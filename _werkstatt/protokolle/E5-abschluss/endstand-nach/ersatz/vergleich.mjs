import { readFileSync } from 'node:fs';
const D = '/home/user/schluesseldienst/.cache/endstand-nach/ersatz/';
const lade = (f) => JSON.parse(readFileSync(D + f, 'utf8'));
for (const g of ['mobil', 'desktop']) {
  const neu = lade(`tastatur-${g}-ersatz.json`), alt = lade(`alt-frueher-tastatur-${g}-ersatz.json`);
  const seiten = (z) => z.ergebnis.h1.map((x) => `${x.pfad}|${x.tabSchritteBisAnruf}|${x.anrufFokusSichtbar}|tel${x.telLinks}`);
  const rel = (z) => ({ fokusStopps: z.fokusStopps, ohne: z.fokusStoppsOhneSichtbarenFokus, ringQuellen: z.ringQuellen, h2: z.ergebnis.h2?.tabSchritte, h2akt: z.ergebnis.h2?.aktivierungen, h3: [z.ergebnis.h3?.tabSchritteBisFeld, z.ergebnis.h3?.feldFokusSichtbar, z.ergebnis.h3?.vorschlaege], h4: [z.ergebnis.h4?.aktivierungen, z.ergebnis.h4?.impressumTabSchritte, z.ergebnis.h4?.impressumFokusSichtbar, z.ergebnis.h4?.impressum?.platzhalter], h5: z.ergebnis.h5 && [z.ergebnis.h5.tabSchritte, z.ergebnis.h5.absendenFokusSichtbar, z.ergebnis.h5.nachAbsenden?.fokus], menue: z.ergebnis.menueBlatt });
  const a = rel(alt), n = rel(neu);
  const unterschiede = Object.keys(n).filter((k) => JSON.stringify(a[k]) !== JSON.stringify(n[k]));
  console.log(`== ${g} (neu) ==`);
  console.log(JSON.stringify({ basis: neu.basis, breite: neu.breite, hoehe: neu.hoehe, ...n }));
  console.log(`H1 neu (Seite|Tab bis Anruf|Fokus sichtbar|tel-Links):\n  ` + seiten(neu).join('\n  '));
  console.log(`Anzahl Seiten mit erreichbarem Anruf: ${neu.ergebnis.h1.filter((x) => x.tabSchritteBisAnruf).length} von ${neu.ergebnis.h1.length}; Fokus sichtbar dort: ${neu.ergebnis.h1.filter((x) => x.anrufFokusSichtbar).length}`);
  console.log(`== Vergleich mit frueher (Unterschiede in Kennzahlen): ${unterschiede.length ? unterschiede.join(', ') : 'keine'}`);
  if (unterschiede.length) for (const k of unterschiede) console.log(`  ${k} alt=${JSON.stringify(a[k])} neu=${JSON.stringify(n[k])}`);
  const hA = seiten(alt).join(';'), hN = seiten(neu).join(';');
  console.log(`H1 identisch zu frueher: ${hA === hN}`);
  console.log(`Protokollschritte alt=${alt.protokoll.length} neu=${neu.protokoll.length}`);
}
