// Gezielte Abtastung der Vorschlagsliste (M-08) auf /einsatzgebiet/: 40 Proben im 25-ms-Takt ab vor dem Tippen.
// Nur lesen und messen. Ausgabe unter .cache/e5-abschluss/n2-bewegung/probe-m08.json.
import { starteBrowser, blockiereExtern, mitMessSperre, schreibeJson } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const BASIS = 'http://127.0.0.1:4251';
const AUS = '/home/user/schluesseldienst/.cache/e5-abschluss/n2-bewegung/probe-m08.json';

await mitMessSperre('n2-bewegung-probe-m08', async () => {
  const browser = await starteBrowser();
  const daten = { werkzeug: 'n2-probe-m08', zeitpunkt: new Date().toISOString(), laeufe: [] };
  try {
    for (const reduziert of [false, true]) {
      const k = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: reduziert ? 'reduce' : 'no-preference' });
      await blockiereExtern(k);
      const seite = await k.newPage();
      try {
        await seite.goto(BASIS + '/einsatzgebiet/', { waitUntil: 'load' });
        await seite.waitForTimeout(5500);
        await seite.evaluate(() => {
          const liste = document.getElementById('gebiet-ort-liste');
          const t0 = performance.now();
          window.__probe = { ereignisse: [] };
          window.__probe.pruefe = (name) => {
            const cs = getComputedStyle(liste);
            window.__probe.ereignisse.push({
              probe: name, t_ms: Math.round(performance.now() - t0), hidden: liste.hasAttribute('hidden'), display: cs.display,
              animationName: cs.animationName, opacity: cs.opacity, transform: cs.transform, li_anzahl: liste.querySelectorAll('li').length,
              animationen: liste.getAnimations().map((a) => ({ art: a.constructor.name, name: a.animationName || null, eigenschaft: a.transitionProperty || null, dauer: a.effect.getTiming().duration, zeit_ms: Math.round(a.currentTime || 0) })),
            });
          };
          window.__probe.lauf = new Promise((res) => {
            let n = 0;
            const tick = () => { window.__probe.pruefe('takt' + n); n++; if (n < 40) setTimeout(tick, 25); else res(); };
            tick();
          });
        });
        await seite.fill('#gebiet-ort-eingabe', 'Löhnberg');
        await seite.evaluate(() => window.__probe.lauf);
        const ereignisse = await seite.evaluate(() => window.__probe.ereignisse);
        daten.laeufe.push({ modus: reduziert ? 'reduce' : 'no-preference', proben: ereignisse });
      } finally {
        await k.close();
      }
    }
  } finally {
    await browser.close();
  }
  await schreibeJson(AUS, daten);
  for (const l of daten.laeufe) {
    process.stdout.write(`== ${l.modus}\n`);
    let zuletzt = '';
    for (const p of l.proben) {
      const sig = `${p.hidden}|${p.display}|${p.animationName}|${p.animationen.map((a) => a.name || a.eigenschaft).join(',')}|${p.li_anzahl}`;
      if (sig !== zuletzt) process.stdout.write(`  t=${p.t_ms} ${p.probe} hidden=${p.hidden} display=${p.display} animName=${p.animationName} anims=${JSON.stringify(p.animationen.map((a) => [a.art, a.name || a.eigenschaft, a.dauer, a.zeit_ms]))} li=${p.li_anzahl} op=${p.opacity} t=${p.transform}\n`);
      zuletzt = sig;
    }
  }
}).then(() => process.stdout.write('ENDE probe-m08\n')).catch((e) => { process.stderr.write(`probe-m08: Fehler: ${e.message}\n`); process.exitCode = 2; });
