// X9: klassisches Skript nach den Stil-Links (parserblockierend: der Parser wartet auf die Stylesheets, bevor er <body>
//     einfügt; Chromium wertet den Opt-in beim Einfügen von <body> aus). Inhalt: die Klasse .js früh setzen.
// X10: das Modul-Skript mit blocking="render" (Erstdarstellung wartet, bis das Modul gelaufen ist).
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const QUELLE = '/home/user/schluesseldienst/.cache/e5-abschluss/dist';
const SEITEN = ['index.html', 'einbruchschutz/index.html', 'notoeffnung/tueroeffnung/index.html', 'preise/index.html',
  'einsatzgebiet/index.html', 'einsatzgebiet/hessen/limburg-weilburg/index.html', 'schluesseldienst-loehnberg/index.html',
  'ratgeber/rauchmelderpflicht/index.html', 'ueber-uns/index.html', 'kontakt/index.html', 'suche/index.html',
  'impressum/index.html', '404.html'];
const sri = (t) => `sha384-${createHash('sha384').update(t).digest('base64')}`;
const hash10 = (t) => createHash('sha256').update(t).digest('hex').slice(0, 10);

async function variante(name, aendere, vorbereiten) {
  const aus = `/home/user/schluesseldienst/.cache/vt-exp/${name}/dist`;
  await rm(join(aus, '..'), { recursive: true, force: true });
  await mkdir(join(aus, '..'), { recursive: true });
  execFileSync('cp', ['-al', QUELLE, aus]);
  const extra = vorbereiten ? await vorbereiten(aus) : null;
  for (const s of SEITEN) {
    const p = join(aus, s);
    const html = await readFile(p, 'utf8');
    const neu = aendere(html, extra);
    if (neu === html) throw new Error(`${name}: nichts geändert in ${s}`);
    await rm(p); await writeFile(p, neu);
  }
  console.log(`${name}: ${SEITEN.length} Seiten`);
}

await variante('X9', (html, js) => html.replace('<script type="module"', `<script src="/assets/${js.name}" integrity="${js.sri}"></script>\n<script type="module"`), async (aus) => {
  const text = "document.documentElement.classList.add('js');\n";
  const name = `frueh.${hash10(text)}.js`;
  await writeFile(join(aus, 'assets', name), text);
  return { name, sri: sri(text) };
});
await variante('X10', (html) => html.replace('<script type="module"', '<script type="module" blocking="render"'));
