// ueberlauf.mjs: prüft je Pfad Dokumentüberlauf (scrollWidth > clientWidth) bei fünf Breiten, mit erzwungenen Farben und bei 200 % Zoom.
import { parseArgs } from 'node:util';
import { starteBrowser, blockiereExtern, schreibeJson, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const BREITEN = [320, 390, 768, 1440, 1920];
// 200 % Zoom auf 1280 px entspricht 640 CSS-px Layoutbreite. Pinch-Zoom (setPageScaleFactor) ändert die Layoutbreite nicht und wird nicht genutzt.
const VARIANTEN = [
  ...BREITEN.map((breite) => ({ name: String(breite), breite, erzwungen: false })),
  ...BREITEN.map((breite) => ({ name: `${breite}-erzwungen`, breite, erzwungen: true })),
  { name: 'zoom200', breite: 640, erzwungen: false },
];

// Läuft im Browser: Dokumentbreite und die 10 am weitesten über den Viewport ragenden Elemente.
const messe = () => {
  const wurzel = document.documentElement;
  const vw = wurzel.clientWidth;
  const selektor = (el) => {
    const teile = [];
    for (let n = el; n && n.nodeType === 1 && n !== wurzel && teile.length < 5; n = n.parentElement) {
      let s = n.tagName.toLowerCase();
      if (n.id) { teile.unshift(`${s}#${CSS.escape(n.id)}`); break; }
      const gleiche = n.parentElement ? [...n.parentElement.children].filter((c) => c.tagName === n.tagName) : [n];
      if (gleiche.length > 1) s += `:nth-of-type(${gleiche.indexOf(n) + 1})`;
      teile.unshift(s);
    }
    return teile.join(' > ');
  };
  const ueber = [...document.body.querySelectorAll('*')]
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.width > 0 && r.right > vw)
    .sort((x, y) => y.r.right - x.r.right);
  return {
    scrollBreite: wurzel.scrollWidth,
    klientBreite: vw,
    anzahlElemente: ueber.length,
    elemente: ueber.slice(0, 10).map(({ el, r }) => ({ selektor: selektor(el), rechts: Math.round(r.right), breite: Math.round(r.width) })),
  };
};

async function main() {
  const { values: a } = parseArgs({
    options: { basis: { type: 'string' }, pfade: { type: 'string' }, aus: { type: 'string' } },
    strict: true,
  });
  if (!a.basis || !a.pfade || !a.aus) throw new Error('--basis, --pfade und --aus sind Pflicht');
  const basis = new URL(a.basis);
  const erlaubt = [basis.hostname, '127.0.0.1', 'localhost'];
  const pfade = a.pfade.split(',').map((p) => p.trim()).filter(Boolean);
  if (!pfade.length) throw new Error('--pfade leer');

  const ergebnisse = [];
  const browser = await starteBrowser();
  try {
    for (const pfad of pfade) {
      const url = new URL(pfad, basis);
      for (const v of VARIANTEN) {
        // bypassCSP: Inline-Styles würde die CSP still verwerfen und Überbreite verdecken; CSP-Verstöße meldet smoke.
        const kontext = await browser.newContext({
          viewport: { width: v.breite, height: 900 }, deviceScaleFactor: 1, bypassCSP: true,
          forcedColors: v.erzwungen ? 'active' : 'none', colorScheme: 'dark',
        });
        await blockiereExtern(kontext, erlaubt);
        const seite = await kontext.newPage();
        const status = (await seite.goto(url.href, { waitUntil: 'load' }))?.status() ?? null;
        const m = await seite.evaluate(messe);
        ergebnisse.push({
          pfad, variante: v.name, breite: v.breite, erzwungeneFarben: v.erzwungen, status, ...m,
          ueberlauf: m.scrollBreite > m.klientBreite,
        });
        await kontext.close();
      }
    }
  } finally {
    await browser.close();
  }
  const befunde = ergebnisse.filter((e) => e.ueberlauf).length;
  await schreibeJson(a.aus, {
    werkzeug: 'ueberlauf-dunkel', basis: basis.href, zeitpunkt: new Date().toISOString(),
    varianten: VARIANTEN.map((v) => v.name), befunde, ergebnisse,
  });
  console.log(`ueberlauf-dunkel: ${ergebnisse.length} Messungen, ${befunde} mit Dokumentüberlauf → ${a.aus}`);
  return befunde ? 1 : 0;
}

mitMessSperre('ueberlauf', main).then(
  (code) => process.exit(code),
  (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); },
);
