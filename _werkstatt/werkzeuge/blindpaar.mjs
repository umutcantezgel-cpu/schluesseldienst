// blindpaar.mjs: Blindvergleich für die Endprüfung (Z-04). Nimmt die eigenen Hauptansichten V01/V03/V04/V07 genauso auf
// wie vorher.mjs die Wettbewerber (Hellmodus, Q70, bis zu 6 Ausschnitte je Gerät, Namen/Telefon/E-Mail/Wortmarke maskiert)
// und setzt je Paar und Gerät zwei Bögen zusammen (die ersten Ausschnitte untereinander): A und B in einer Reihenfolge, die
// aus der Saat folgt. Der Schlüssel (welcher Bogen neu ist) steht in einer getrennten Datei außerhalb des Bilderordners.
// Aufruf: node _werkstatt/werkzeuge/blindpaar.mjs --basis http://127.0.0.1:4201 --vorher .cache/vorher/bilder
//         --aus .cache/e5/blind/bilder --schluessel .cache/e5/blind/schluessel.json [--saat 25] [--ausschnitte 3]
// Exit: 0 alle Bögen erstellt · 2 Werkzeugfehler
import { parseArgs } from 'node:util';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { starteBrowser, mitMessSperre, schreibeJson } from './lib.mjs';

const PAARE = [
  { paar: 'V01-R', pfad: '/' }, { paar: 'V01-A', pfad: '/' },
  { paar: 'V03-A', pfad: '/notoeffnung/tueroeffnung/' },
  { paar: 'V04-A', pfad: '/preise/' },
  { paar: 'V07-R', pfad: '/schluesseldienst-weilburg/' }, { paar: 'V07-A', pfad: '/schluesseldienst-weilburg/' },
];
const GERAETE = [{ name: 'mobil', width: 390, height: 844 }, { name: 'desktop', width: 1440, height: 900 }];

/** Läuft im Seitenkontext: Platzhalter und Telefonnummern werden ███, Wortmarke und Signet ausgeblendet (wie vorher.mjs). */
function maskiereEigene() {
  const TELEFON = /(?<![\p{L}\d])[(+]?\d[\d\s/()-]*\d(?![\p{L}\d])/gu;
  for (const el of document.querySelectorAll('.platzhalter, [data-platzhalter]')) el.textContent = '███';
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) {
    const k = w.currentNode;
    const neu = k.nodeValue.replace(TELEFON, (m) => (m.replace(/\D/g, '').length >= 6 ? '███' : m));
    if (neu !== k.nodeValue) k.nodeValue = neu;
  }
  for (const el of document.querySelectorAll('.wortmarke, .signet')) el.style.visibility = 'hidden';
}

async function aufnehmen(browser, basis, pfad, geraet, anzahl) {
  const kontext = await browser.newContext({ viewport: { width: geraet.width, height: geraet.height }, deviceScaleFactor: 1, colorScheme: 'light', bypassCSP: true });
  try {
    const seite = await kontext.newPage();
    await seite.goto(new URL(pfad, basis).href, { waitUntil: 'load' });
    await seite.waitForTimeout(2000);
    await seite.evaluate(() => document.fonts.ready);
    const bilder = [];
    for (let k = 0; k < anzahl; k++) {
      await seite.evaluate((y) => window.scrollTo(0, y), k * geraet.height);
      await seite.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
      await seite.evaluate(maskiereEigene);
      bilder.push(await seite.screenshot({ type: 'jpeg', quality: 70, animations: 'disabled' }));
    }
    return bilder;
  } finally {
    await kontext.close();
  }
}

/** Setzt JPEG-Puffer untereinander zu einem Bogen zusammen (über eine leere Seite, ohne Bildbibliothek). */
async function bogen(browser, puffer, breite) {
  const kontext = await browser.newContext({ viewport: { width: breite, height: 100 }, deviceScaleFactor: 1 });
  try {
    const seite = await kontext.newPage();
    const bilder = puffer.map((b) => `<img alt="" style="display:block;width:${breite}px" src="data:image/jpeg;base64,${b.toString('base64')}">`).join('');
    await seite.setContent(`<!doctype html><body style="margin:0;background:#888">${bilder}</body>`, { waitUntil: 'load' });
    return await seite.screenshot({ type: 'jpeg', quality: 75, fullPage: true });
  } finally {
    await kontext.close();
  }
}

async function main() {
  const { values: a } = parseArgs({ options: {
    basis: { type: 'string' }, vorher: { type: 'string' }, aus: { type: 'string' }, schluessel: { type: 'string' },
    saat: { type: 'string', default: '25' }, ausschnitte: { type: 'string', default: '3' },
  }, strict: true });
  if (!a.basis || !a.vorher || !a.aus || !a.schluessel) throw new Error('--basis, --vorher, --aus und --schluessel sind Pflicht');
  if (resolve(a.schluessel).startsWith(resolve(a.aus))) throw new Error('Der Schlüssel darf nicht im Bilderordner liegen');
  const anzahl = Math.max(1, Math.min(6, Number(a.ausschnitte)));
  await mkdir(a.aus, { recursive: true });
  const vorherDateien = await readdir(a.vorher);
  const schluessel = { saat: a.saat, ausschnitte: anzahl, paare: [] };
  await mitMessSperre('blindpaar', async () => {
    const browser = await starteBrowser();
    try {
      const eigene = new Map();
      for (const p of PAARE) {
        for (const g of GERAETE) {
          const id = `${p.pfad}|${g.name}`;
          if (!eigene.has(id)) eigene.set(id, await aufnehmen(browser, a.basis, p.pfad, g, anzahl));
          const fremd = [];
          for (let k = 1; k <= anzahl; k++) {
            const datei = `${p.paar}__${g.name}__${String(k).padStart(2, '0')}.jpg`;
            if (vorherDateien.includes(datei)) fremd.push(await readFile(join(a.vorher, datei)));
          }
          if (!fremd.length) continue;
          // Reihenfolge aus Saat und Paar (deterministisch, aber für den Prüfer nicht ableitbar)
          const neuIstA = createHash('sha256').update(`${a.saat}|${p.paar}|${g.name}`).digest()[0] % 2 === 0;
          const neu = await bogen(browser, eigene.get(id), g.width);
          const alt = await bogen(browser, fremd, g.width);
          const name = `paar-${String(schluessel.paare.length + 1).padStart(2, '0')}-${g.name}`;
          await writeFile(join(a.aus, `${name}-A.jpg`), neuIstA ? neu : alt);
          await writeFile(join(a.aus, `${name}-B.jpg`), neuIstA ? alt : neu);
          schluessel.paare.push({ name, paar: p.paar, geraet: g.name, neu: neuIstA ? 'A' : 'B', ausschnitteFremd: fremd.length });
        }
      }
    } finally {
      await browser.close();
    }
  });
  await schreibeJson(a.schluessel, schluessel);
  console.log(`blindpaar: ${schluessel.paare.length} Paare → ${a.aus} (Schlüssel getrennt: ${a.schluessel})`);
}

main().catch((e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exitCode = 2; });
