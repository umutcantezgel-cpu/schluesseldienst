// Fokus nie ganz verdeckt (WCAG 2.4.11), Nachprüfung Anlauf 2.
// Vorlage: .cache/e5-review/nachpruefung/verdeckt.mjs (Basis 4201, nur vorwärts, nur Rufleiste).
// Aufruf: node verdeckt.mjs --viewport mobil|desktop --richtung vorwaerts|rueckwaerts --pfade /a/,/b/ --aus <json> [--basis http://127.0.0.1:4241]
// Je Tabulatorschritt (Tab bzw. Umschalt+Tab) zwei Messungen am fokussierten Element:
//  R) Anteil der Zielfläche unter .rufleiste (Vorlagenmetrik; nur wenn die Rufleiste vorhanden ist; ganz ab 0,999).
//  P) Punktprobe: 7×7 Punkte im sichtbaren Teil des Ziels. Ein Punkt gilt als verdeckt, wenn das oberste Element
//     an dieser Stelle weder das Ziel noch ein Vor- oder Nachfahre des Ziels ist. Das erfasst klebenden Kopf,
//     klebende A–Z-Leiste und Rufleiste gleichermaßen. Ganz verdeckt: alle 49 Punkte verdeckt.
// Ziele innerhalb der Rufleiste zählen getrennt (wie in der Vorlage nicht als Fokusziel der Seite).
import { parseArgs } from 'node:util';
import { starteBrowser, blockiereExtern, schreibeJson, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';

const VIEWPORTS = { mobil: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } };
const MAX_SCHRITTE = 1000;

// Läuft im Browser: misst das aktuell fokussierte Element.
function messeFokus() {
  const el = document.activeElement;
  if (!el || el === document.body || el === document.documentElement) return null;
  const beschreibe = (n) => {
    if (!n || n.nodeType !== 1) return null;
    const klasse = typeof n.className === 'string' ? n.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.') : '';
    return n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (klasse ? '.' + klasse : '');
  };
  const gesehen = (window.__gesehen ||= new Set());
  const neu = !gesehen.has(el);
  gesehen.add(el);
  const leiste = document.querySelector('.rufleiste');
  const inLeiste = !!el.closest('.rufleiste');
  const a = el.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  let anteilLeiste = null;
  if (leiste && a.width * a.height > 0) {
    const b = leiste.getBoundingClientRect();
    const ov = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)) * Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    anteilLeiste = ov / (a.width * a.height);
  }
  const x0 = Math.max(a.left, 0), x1 = Math.min(a.right, vw), y0 = Math.max(a.top, 0), y1 = Math.min(a.bottom, vh);
  const sichtbar = x1 > x0 && y1 > y0;
  let punkte = 0, verdeckt = 0;
  const deckend = {};
  if (sichtbar) {
    const n = 7;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const x = x0 + ((x1 - x0) * (i + 0.5)) / n;
        const y = y0 + ((y1 - y0) * (j + 0.5)) / n;
        const top = document.elementFromPoint(x, y);
        punkte++;
        if (!top || el.contains(top) || top.contains(el)) continue;
        verdeckt++;
        const k = beschreibe(top);
        deckend[k] = (deckend[k] || 0) + 1;
      }
    }
  }
  const text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('alt') || '').trim().replace(/\s+/g, ' ').slice(0, 40);
  return {
    text, tag: beschreibe(el), neu, inLeiste, anteilLeiste, sichtbar, punkte, verdeckt, deckend,
    rect: [Math.round(a.left), Math.round(a.top), Math.round(a.right), Math.round(a.bottom)],
  };
}

// Läuft im Browser: Zustand der klebenden Elemente und der Scroll-Abstände.
function zustand() {
  const cs = getComputedStyle(document.documentElement);
  const r = document.querySelector('.rufleiste');
  const klebend = [...document.querySelectorAll('body *')]
    .filter((e) => ['fixed', 'sticky'].includes(getComputedStyle(e).position) && getComputedStyle(e).display !== 'none')
    .slice(0, 20)
    .map((e) => {
      const b = e.getBoundingClientRect();
      const k = e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
      return { el: k, position: getComputedStyle(e).position, oben: Math.round(b.top), unten: Math.round(b.bottom), hoehe: Math.round(b.height) };
    });
  return {
    scrollPaddingTop: cs.scrollPaddingTop, scrollPaddingBottom: cs.scrollPaddingBottom,
    rufleiste: r ? { oben: Math.round(r.getBoundingClientRect().top), unten: Math.round(r.getBoundingClientRect().bottom), hoehe: Math.round(r.getBoundingClientRect().height) } : null,
    klebend,
  };
}

async function main() {
  const { values: a } = parseArgs({
    strict: true,
    options: {
      basis: { type: 'string', default: 'http://127.0.0.1:4251' },
      viewport: { type: 'string', default: 'mobil' },
      richtung: { type: 'string', default: 'vorwaerts' },
      pfade: { type: 'string' }, aus: { type: 'string' },
    },
  });
  if (!a.pfade || !a.aus) throw new Error('--pfade und --aus sind Pflicht');
  if (!VIEWPORTS[a.viewport]) throw new Error('--viewport mobil|desktop');
  if (!['vorwaerts', 'rueckwaerts'].includes(a.richtung)) throw new Error('--richtung vorwaerts|rueckwaerts');
  const basis = new URL(a.basis);
  const pfade = a.pfade.split(',').map((p) => p.trim()).filter(Boolean);
  const taste = a.richtung === 'rueckwaerts' ? 'Shift+Tab' : 'Tab';

  const erg = [];
  await mitMessSperre(`nachpruefung-verdeckt-${a.viewport}-${a.richtung}`, async () => {
    const browser = await starteBrowser();
    try {
      for (const pfad of pfade) {
        const kontext = await browser.newContext({ viewport: VIEWPORTS[a.viewport], deviceScaleFactor: 1 });
        const extern = await blockiereExtern(kontext, [basis.hostname, '127.0.0.1', 'localhost']);
        const seite = await kontext.newPage();
        const status = (await seite.goto(new URL(pfad, basis).href, { waitUntil: 'load' }))?.status() ?? null;
        await seite.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        const vorher = await seite.evaluate(zustand);
        const schritte = [];
        for (let i = 0; i < MAX_SCHRITTE; i++) {
          await seite.keyboard.press(taste);
          const r = await seite.evaluate(messeFokus);
          if (r === null) { if (i > 3) break; else continue; }
          schritte.push(r);
        }
        const verschieden = schritte.filter((z) => z.neu && !z.inLeiste);
        const inLeiste = schritte.filter((z) => z.neu && z.inLeiste);
        const ganzRufleiste = verschieden.filter((z) => z.anteilLeiste !== null && z.anteilLeiste >= 0.999);
        const teilRufleiste = verschieden.filter((z) => z.anteilLeiste !== null && z.anteilLeiste > 0 && z.anteilLeiste < 0.999);
        const ganzPunkt = verschieden.filter((z) => z.punkte > 0 && z.verdeckt === z.punkte);
        const teilPunkt = verschieden.filter((z) => z.verdeckt > 0 && z.verdeckt < z.punkte);
        const ausserhalb = verschieden.filter((z) => !z.sichtbar);
        const verdeckendeElemente = {};
        for (const z of [...ganzPunkt, ...teilPunkt]) for (const [k, n] of Object.entries(z.deckend)) verdeckendeElemente[k] = (verdeckendeElemente[k] || 0) + n;
        const eintrag = {
          pfad, viewport: a.viewport, breite: VIEWPORTS[a.viewport].width, richtung: a.richtung, status, externeBlockiert: extern.length,
          zustandVorher: vorher, schritte: schritte.length, fokuszieleAusser: verschieden.length, fokuszieleInLeiste: inLeiste.length,
          ganzVerdecktRufleiste: ganzRufleiste.length, teilweiseRufleiste: teilRufleiste.length,
          ganzVerdecktPunktprobe: ganzPunkt.length, teilweisePunktprobe: teilPunkt.length, ausserhalbSicht: ausserhalb.length,
          verdeckendeElemente,
          beispiele: ganzPunkt.slice(0, 8).map((z) => ({ tag: z.tag, text: z.text, rect: z.rect, deckend: z.deckend })),
          beispieleTeilweise: teilPunkt.slice(0, 8).map((z) => ({ tag: z.tag, text: z.text, rect: z.rect, anteil: Number((z.verdeckt / z.punkte).toFixed(2)), deckend: z.deckend })),
        };
        erg.push(eintrag);
        console.log(`${a.viewport} ${a.richtung} ${pfad}: Schritte ${eintrag.schritte}, Ziele ${eintrag.fokuszieleAusser} (+${eintrag.fokuszieleInLeiste} in Rufleiste), ganz verdeckt Rufleiste ${eintrag.ganzVerdecktRufleiste}, ganz verdeckt Punktprobe ${eintrag.ganzVerdecktPunktprobe}, teilweise Punktprobe ${eintrag.teilweisePunktprobe}, außerhalb ${eintrag.ausserhalbSicht}`);
        await kontext.close();
      }
    } finally {
      await browser.close();
    }
    const gesamt = erg.reduce((s, e) => s + e.ganzVerdecktPunktprobe + e.ganzVerdecktRufleiste, 0);
    await schreibeJson(a.aus, { werkzeug: 'verdeckt', basis: basis.href, zeitpunkt: new Date().toISOString(), viewport: a.viewport, richtung: a.richtung, ganzVerdeckt: gesamt, ergebnisse: erg });
    console.log(`→ ${a.aus} (ganz verdeckt gesamt: ${gesamt})`);
    process.exitCode = gesamt ? 1 : 0;
  });
}

main().catch((e) => { console.error(`verdeckt: Werkzeugfehler: ${e.message}`); process.exitCode = 2; });
