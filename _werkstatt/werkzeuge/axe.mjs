// axe.mjs: axe-core mit WCAG 2.0/2.1/2.2 A und AA je Pfad; Exit 1 bei serious oder critical.
import { parseArgs } from 'node:util';
import { starteBrowser, pfadVon, blockiereExtern, schreibeJson, mitMessSperre } from './lib.mjs';

const REGELN = { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } };
const IMPACT = ['unbekannt', 'minor', 'moderate', 'serious', 'critical'];

async function main() {
  const { values: a } = parseArgs({
    options: {
      basis: { type: 'string' }, pfade: { type: 'string' }, aus: { type: 'string' },
      schema: { type: 'string', default: 'light' },
    },
    strict: true,
  });
  if (!a.basis || !a.pfade || !a.aus) throw new Error('--basis, --pfade und --aus sind Pflicht');
  if (!['light', 'dark'].includes(a.schema)) throw new Error('--schema light|dark');
  const basis = new URL(a.basis);
  const erlaubt = [basis.hostname, '127.0.0.1', 'localhost'];
  const pfade = a.pfade.split(',').map((p) => p.trim()).filter(Boolean);
  if (!pfade.length) throw new Error('--pfade leer');

  const ergebnisse = [];
  const browser = await starteBrowser();
  try {
    for (const pfad of pfade) {
      const url = new URL(pfad, basis);
      // bypassCSP: Trusted Types würden die axe-Injektion sonst blockieren.
      const kontext = await browser.newContext({
        bypassCSP: true, colorScheme: a.schema, viewport: { width: 1440, height: 900 },
      });
      await blockiereExtern(kontext, erlaubt);
      const seite = await kontext.newPage();
      const status = (await seite.goto(url.href, { waitUntil: 'load' }))?.status() ?? null;
      await seite.addScriptTag({ path: pfadVon('axe-core') });
      const verstoesse = await seite.evaluate(async (regeln) => {
        const r = await window.axe.run(document, regeln);
        return r.violations.map((v) => ({
          id: v.id, impact: v.impact ?? 'unbekannt', help: v.help, hilfeUrl: v.helpUrl,
          knoten: v.nodes.length, ziele: v.nodes.slice(0, 5).map((n) => String(n.target)),
        }));
      }, REGELN);
      const anzahlJeImpact = Object.fromEntries(IMPACT.map((i) => [i, 0]));
      for (const v of verstoesse) anzahlJeImpact[v.impact] = (anzahlJeImpact[v.impact] ?? 0) + 1;
      const ernstUndKritisch = verstoesse.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      ergebnisse.push({ pfad, status, anzahlJeImpact, ernstUndKritisch });
      console.log(`axe ${pfad}: minor ${anzahlJeImpact.minor} · moderate ${anzahlJeImpact.moderate} · serious ${anzahlJeImpact.serious} · critical ${anzahlJeImpact.critical}`);
      await kontext.close();
    }
  } finally {
    await browser.close();
  }
  const befunde = ergebnisse.reduce((s, e) => s + e.ernstUndKritisch.length, 0);
  await schreibeJson(a.aus, {
    werkzeug: 'axe', basis: basis.href, schema: a.schema, regeln: REGELN.runOnly.values,
    zeitpunkt: new Date().toISOString(), befunde, ergebnisse,
  });
  console.log(`→ ${a.aus} (Regeln serious/critical: ${befunde})`);
  return befunde ? 1 : 0;
}

mitMessSperre('axe', main).then(
  (code) => process.exit(code),
  (e) => { console.error(`Werkzeugfehler: ${e.message}`); process.exit(2); },
);
