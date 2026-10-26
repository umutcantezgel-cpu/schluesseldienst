// Menü-Blatt-Probe (nur lesen, Ersatzkopie 4298): Anruf im Blatt nach Tastaturfokus, Lage und Bildschirmfoto.
import { starteBrowser, blockiereExtern, mitMessSperre } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';
const probe = async () => {
  const browser = await starteBrowser();
  const out = {};
  try {
    const kontext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, colorScheme: 'light', isMobile: true, hasTouch: true });
    await blockiereExtern(kontext, ['127.0.0.1']);
    const seite = await kontext.newPage();
    await seite.goto('http://127.0.0.1:4298/schluesseldienst-loehnberg/', { waitUntil: 'load' });
    for (let i = 0; i < 100; i++) { await seite.keyboard.press('Tab'); if (await seite.evaluate(() => document.activeElement?.classList.contains('rufleiste-menue'))) break; }
    await seite.keyboard.press('Enter');
    await seite.waitForSelector('dialog.menue-blatt[open]');
    out.vorDerTastatur = await seite.evaluate(() => { const d = document.querySelector('dialog.menue-blatt'); return { scrollHoehe: d.scrollHeight, sichtbareHoehe: d.clientHeight, scrollTop: d.scrollTop, innerHeight, dialogRect: d.getBoundingClientRect().toJSON() }; });
    for (let i = 0; i < 80; i++) { await seite.keyboard.press('Tab'); const ok = await seite.evaluate(() => document.activeElement?.closest('dialog.menue-blatt') && document.activeElement.getAttribute('href')?.startsWith('tel:')); if (ok) { out.anrufSchritte = i + 1; break; } }
    out.nachDerTastatur = await seite.evaluate(() => { const a = document.activeElement; const d = document.querySelector('dialog.menue-blatt'); const r = a.getBoundingClientRect(); return { fokusRect: r.toJSON(), unterKante: r.bottom - innerHeight, scrollTop: d.scrollTop, scrollHoehe: d.scrollHeight, sichtbareHoehe: d.clientHeight, dialogRect: d.getBoundingClientRect().toJSON(), ueberlaufDesDialogs: getComputedStyle(d).overflow, bodyScrollY: window.scrollY }; });
    await seite.screenshot({ path: '/home/user/schluesseldienst/.cache/e5-abschluss/pruefer-z07-z09/blatt-anruf-ersatz.png', animations: 'disabled' });
    await kontext.close();
  } finally { await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
};
mitMessSperre('pruefer-blatt-probe', probe).then(() => process.exit(0), (e) => { console.error(e.stack); process.exit(2); });
