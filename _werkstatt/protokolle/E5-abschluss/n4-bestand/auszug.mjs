import { readFileSync } from 'node:fs';
const d = JSON.parse(readFileSync(process.argv[2], 'utf8'));
let fremd = 0, unter = 0, kf = 0, kw = 0, csp = 0, skript = 0, titelOk = 0, h1ok = 0, b = 0;
const details = [];
for (const e of d.ergebnisse) {
  fremd += e.fremdeAnfragen.length; unter += e.unterressourcen.length;
  kf += e.konsole.fehler.length; kw += e.konsole.warnungen.length;
  csp += e.csp.konsole.length + e.csp.ereignis.length;
  if (e.befunde.length) details.push(`${e.pfad} ${e.viewport} status=${e.status} befunde=${JSON.stringify(e.befunde)} konsole=${JSON.stringify(e.konsole.fehler)} unter=${JSON.stringify(e.unterressourcen)}`);
  if (e.h1Anzahl === 1) h1ok++; if (e.titel) titelOk++;
  b += e.befunde.length;
}
console.log(JSON.stringify({ basis: d.basis, seiten: d.ergebnisse.length, befundeGesamt: d.befundeGesamt, fremdeAnfragen: fremd, unterressourcen: unter, konsoleFehler: kf, konsoleWarnungen: kw, cspVerstoesse: csp, h1genau1: h1ok, titelGesetzt: titelOk }, null, 1));
console.log(details.join('\n'));
