// Fokus-Probe: welche Regel setzt den Umriss des fokussierten Elements (CDP, nur lesen), plus Ausschnitt-Bild.
import { starteBrowser, blockiereExtern, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';
const BASIS = 'http://127.0.0.1:4251';
const ZIELE = [
  { pfad: '/', wahl: 'a[href="/notoeffnung/"]', name: 'start-fuss-notoeffnung', geraet: { width: 390, height: 844, opts: { isMobile: true, hasTouch: true } } },
  { pfad: '/preise/', wahl: 'input[name="position"][value="tuer-zugefallen"]', name: 'preise-radio', geraet: { width: 390, height: 844, opts: { isMobile: true, hasTouch: true } } },
  { pfad: '/suche/', wahl: 'a.suche-link', name: 'suche-link', geraet: { width: 390, height: 844, opts: { isMobile: true, hasTouch: true } } },
];
const probe = async () => {
  const browser = await starteBrowser();
  const ergebnisse = [];
  try {
    for (const z of ZIELE) {
      const kontext = await browser.newContext({ viewport: { width: z.geraet.width, height: z.geraet.height }, deviceScaleFactor: 1, colorScheme: 'light', ...z.geraet.opts });
      await blockiereExtern(kontext, ['127.0.0.1']);
      const seite = await kontext.newPage();
      await seite.goto(new URL(z.pfad, BASIS).href, { waitUntil: 'load' });
      let gefunden = false;
      for (let i = 0; i < 400 && !gefunden; i++) {
        await seite.keyboard.press('Tab');
        gefunden = await seite.evaluate((sel) => document.activeElement?.matches(sel) ?? false, z.wahl);
      }
      const info = await seite.evaluate(() => {
        const el = document.activeElement; const cs = getComputedStyle(el);
        return { tag: el.tagName, text: (el.innerText || el.value || el.name || '').slice(0, 40), fokusSichtbar: el.matches(':focus-visible'), outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, outlineColor: cs.outlineColor, outlineOffset: cs.outlineOffset, rect: el.getBoundingClientRect().toJSON() };
      });
      const cdp = await kontext.newCDPSession(seite);
      await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
      const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: ':focus' });
      const { matchedCSSRules } = await cdp.send('CSS.getMatchedStylesForNode', { nodeId });
      const regeln = (matchedCSSRules || []).filter((m) => m.rule.style.cssProperties.some((p) => p.name.startsWith('outline'))).map((m) => ({
        selektor: m.rule.selectorList.text, quelle: m.rule.origin, schicht: m.rule.layers?.map((l) => l.text).join('>') ?? null,
        eigenschaften: m.rule.style.cssProperties.filter((p) => p.name.startsWith('outline')).map((p) => `${p.name}: ${p.value}`),
      }));
      const bild = `${z.name}.png`;
      await seite.screenshot({ path: `/home/user/schluesseldienst/.cache/e5-abschluss/pruefer-z07-z09/${bild}`, clip: { x: 0, y: Math.max(0, info.rect.y - 60), width: 390, height: Math.min(260, 844) }, animations: 'disabled' });
      ergebnisse.push({ pfad: z.pfad, gefunden, info, regeln, bild });
      await kontext.close();
    }
  } finally { await browser.close(); }
  console.log(JSON.stringify(ergebnisse, null, 1));
};
mitMessSperre('pruefer-fokus-probe', probe).then(() => process.exit(0), (e) => { console.error(e.stack); process.exit(2); });
