// Versuchsvarianten für den Seitenwechsel-Fehler (nur .cache, nie das Repo): Kopie des Messbuilds als harte Links,
// geändert werden nur app.css bzw. der Kopf der Seiten, die die Probe besucht (Hauptansichten, 404, Löhnberg).
// X2: @view-transition auf oberster Ebene (außerhalb @layer/@media), reduziert per navigation: none
// X4: kleines klassisches Skript als erstes Kopfelement, das pagereveal/pageswap-Promises abfängt
// X6: ohne @view-transition (Kontrolle)
import { readFile, writeFile, rm, mkdir, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const QUELLE = '/home/user/schluesseldienst/.cache/e5-abschluss/dist';
const ZIEL = '/home/user/schluesseldienst/.cache/vt-exp';
const SEITEN = ['index.html', 'einbruchschutz/index.html', 'notoeffnung/tueroeffnung/index.html', 'preise/index.html',
  'einsatzgebiet/index.html', 'einsatzgebiet/hessen/limburg-weilburg/index.html', 'schluesseldienst-loehnberg/index.html',
  'ratgeber/rauchmelderpflicht/index.html', 'ueber-uns/index.html', 'kontakt/index.html', 'suche/index.html',
  'impressum/index.html', '404.html'];
const OPT_IN = '@view-transition { navigation: auto; }\n';
const sri = (t) => `sha384-${createHash('sha384').update(t).digest('base64')}`;
const hash10 = (t) => createHash('sha256').update(t).digest('hex').slice(0, 10);

// Schreibt eine Datei neu (bricht den harten Link, damit die Quelle unberührt bleibt).
async function ersetze(pfad, text) { await rm(pfad, { force: true }); await writeFile(pfad, text); }

async function kopie(name) {
  const aus = join(ZIEL, name, 'dist');
  await rm(join(ZIEL, name), { recursive: true, force: true });
  await mkdir(join(ZIEL, name), { recursive: true });
  execFileSync('cp', ['-al', QUELLE, aus]);
  return aus;
}

async function cssVariante(name, aendere) {
  const aus = await kopie(name);
  const alt = (await readdir(join(aus, 'assets'))).find((f) => /^app\.[0-9a-f]{10}\.css$/.test(f));
  const text = await readFile(join(aus, 'assets', alt), 'utf8');
  if (!text.includes(OPT_IN)) throw new Error('Opt-in nicht gefunden');
  const neu = aendere(text);
  const neuName = `app.${hash10(neu)}.css`;
  await writeFile(join(aus, 'assets', neuName), neu);
  for (const s of SEITEN) {
    const p = join(aus, s);
    const html = await readFile(p, 'utf8');
    const ersetzt = html.replace(`/assets/${alt}" integrity="${sri(text)}"`, `/assets/${neuName}" integrity="${sri(neu)}"`);
    if (ersetzt === html) throw new Error(`Verweis auf ${alt} nicht gefunden in ${s}`);
    await ersetze(p, ersetzt);
  }
  console.log(`${name}: ${alt} → ${neuName}, ${SEITEN.length} Seiten`);
}

// X2: Opt-in aus der Einbettung lösen und an den Anfang stellen; reduzierte Bewegung schaltet ihn ab.
await cssVariante('X2', (t) => `@view-transition { navigation: auto; }\n@media (prefers-reduced-motion: reduce) { @view-transition { navigation: none; } }\n${t.replace(OPT_IN, '')}`);
// X6: Kontrolle ohne Opt-in.
await cssVariante('X6', (t) => t.replace(OPT_IN, ''));

// X4: frühes klassisches Skript im Kopf.
{
  const aus = await kopie('X4');
  const js = `addEventListener('pagereveal', (e) => { const v = e.viewTransition; if (v) for (const p of [v.ready, v.finished, v.updateCallbackDone]) p.catch(() => {}); });\naddEventListener('pageswap', (e) => { const v = e.viewTransition; if (v) for (const p of [v.ready, v.finished, v.updateCallbackDone]) p.catch(() => {}); });\n`;
  const name = `vt-frueh.${hash10(js)}.js`;
  await writeFile(join(aus, 'assets', name), js);
  for (const s of SEITEN) {
    const p = join(aus, s);
    const html = await readFile(p, 'utf8');
    const i = html.indexOf('<link rel="stylesheet"');
    if (i < 0) throw new Error(`kein Stil-Link in ${s}`);
    await ersetze(p, `${html.slice(0, i)}<script src="/assets/${name}" integrity="${sri(js)}"></script>\n${html.slice(i)}`);
  }
  console.log(`X4: ${name} vor den Stilen in ${SEITEN.length} Seiten`);
}
