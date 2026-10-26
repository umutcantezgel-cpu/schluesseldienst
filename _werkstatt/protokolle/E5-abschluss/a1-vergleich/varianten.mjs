// A-1-Ursachenmessung (nur .cache): Endstand ohne Sonderstile bzw. ohne JS-Modul auf der Startseite.
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
const QUELLE = '/home/user/schluesseldienst/.cache/e5-final/dist';
async function variante(name, aendere) {
  const aus = `/home/user/schluesseldienst/.cache/a1-vergleich/${name}`;
  await rm(aus, { recursive: true, force: true }); await mkdir(join(aus, '..'), { recursive: true });
  execFileSync('cp', ['-al', QUELLE, aus]);
  const p = join(aus, 'index.html'); const h = await readFile(p, 'utf8'); const n = aendere(h);
  if (n === h) throw new Error(name); await rm(p); await writeFile(p, n); console.log(name);
}
await variante('ohne-sonderstile', (h) => h.replace(/<link rel="stylesheet" href="\/assets\/(druck|kontrast)\.[^>]+>\n/g, ''));
await variante('ohne-js', (h) => h.replace(/<script type="module"[^>]*><\/script>\n/, ''));
