import { readFileSync } from 'node:fs';
for (const f of process.argv.slice(2)) {
  const d = JSON.parse(readFileSync(f, 'utf8'));
  const gruppen = d.laeufe ?? d.ketten;
  const alle = gruppen.flatMap((g) => g.ereignisse);
  const erwartet404 = alle.filter((e) => e.art === 'console.error' && /status of 404/.test(e.text)).length;
  const nicht = alle.filter((e) => !(e.art === 'console.error' && /status of 404/.test(e.text) && e.ort.endsWith('/gibt-es-nicht/')));
  console.log(JSON.stringify({ datei: f.split('/').pop(), teil: d.teil, geraet: d.geraet, wechsel: d.wechsel, erfolgreich: d.erfolgreich, zaehlend: d.zaehlend, viewTransitionMeldungen: d.viewTransitionMeldungen, pageerror: d.pageerror, pagerevealMitVt: d.diagnose.pagerevealMitVt, pagerevealMitVtModulSchonGelaufen: d.diagnose.pagerevealMitVtModulSchonGelaufen, pageswapMitVt: d.diagnose.pageswapMitVt, unhandledrejection: d.diagnose.unhandledrejection.length, console404Erwartet: erwartet404, console_error_gesamt: alle.filter(e=>e.art==='console.error').length, nichtErwarteteConsoleErrors: nicht.length, fehlgeschlagene_wege: d.ketten ? d.ketten.flatMap(k=>k.wege).filter(w=>!w.erfolg).length : d.laeufe.filter(l=>!l.erfolg).length }));
}
