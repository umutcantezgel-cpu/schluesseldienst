// Kontrolle zu ueberlauf (zoom200, /preise/): liegt table#preisliste in einem Scrollbehälter? Nur lesen.
import { starteBrowser, blockiereExtern, mitMessSperre, schreibeJson } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';
await mitMessSperre('n4-tabelle', async () => {
  const browser = await starteBrowser();
  try {
    const kontext = await browser.newContext({ viewport: { width: 640, height: 900 }, deviceScaleFactor: 1, bypassCSP: true });
    await blockiereExtern(kontext);
    const seite = await kontext.newPage();
    const antwort = await seite.goto('http://127.0.0.1:4251/preise/', { waitUntil: 'load' });
    const m = await seite.evaluate(() => {
      const t = document.querySelector('table#preisliste');
      if (!t) return { gefunden: false };
      const r = t.getBoundingClientRect();
      const kette = [];
      let behaelter = null;
      for (let n = t.parentElement; n && n !== document.documentElement; n = n.parentElement) {
        const cs = getComputedStyle(n);
        const ox = cs.overflowX;
        kette.push({ el: n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (typeof n.className === 'string' && n.className ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : ''), overflowX: ox, scrollBreite: n.scrollWidth, klientBreite: n.clientWidth });
        if (!behaelter && ['auto', 'scroll', 'hidden', 'clip'].includes(ox) && n.scrollWidth > n.clientWidth) behaelter = kette[kette.length - 1];
      }
      return {
        gefunden: true, tabelle_links: Math.round(r.left), tabelle_rechts: Math.round(r.right), tabelle_breite: Math.round(r.width),
        dokument_scrollBreite: document.documentElement.scrollWidth, dokument_klientBreite: document.documentElement.clientWidth,
        naechster_scrollbehaelter: behaelter, vorfahren: kette.slice(0, 6),
      };
    });
    const daten = { werkzeug: 'n4-tabellenkontrolle', pfad: '/preise/', breite: 640, status: antwort ? antwort.status() : null, ...m };
    await schreibeJson('/home/user/schluesseldienst/.cache/e5-final/n4-bewegung/tabelle-kontrolle.json', daten);
    process.stdout.write(JSON.stringify(daten, null, 2) + '\n');
    await kontext.close();
  } finally { await browser.close(); }
}).catch((e) => { process.stderr.write('Fehler: ' + e.message + '\n'); process.exitCode = 2; });
