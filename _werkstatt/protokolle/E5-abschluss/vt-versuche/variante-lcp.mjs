// Diagnose LCP /preise/ und / (nur .cache): V-B ohne Druck-/Kontraststile, V-F nur Druckstile, V-G ohne Kopf-Skript,
// Modul mit blocking="render". Grundlage: .cache/e5-final2/dist (Endstand mit Kopf-Skript, Sonderstile nach den Skripten).
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
const QUELLE = '/home/user/schluesseldienst/.cache/e5-final2/dist';
const SEITEN = ['index.html', 'preise/index.html'];
async function variante(name, aendere) {
  const aus = `/home/user/schluesseldienst/.cache/vt-exp/${name}/dist`;
  await rm(join(aus, '..'), { recursive: true, force: true });
  await mkdir(join(aus, '..'), { recursive: true });
  execFileSync('cp', ['-al', QUELLE, aus]);
  for (const s of SEITEN) {
    const p = join(aus, s); const html = await readFile(p, 'utf8'); const neu = aendere(html);
    if (neu === html) throw new Error(`${name}: unverändert ${s}`);
    await rm(p); await writeFile(p, neu);
  }
  console.log(name);
}
await variante('VB', (h) => h.replace(/<link rel="stylesheet" href="\/assets\/(druck|kontrast)\.[^>]+>\n/g, ''));
await variante('VF', (h) => h.replace(/<link rel="stylesheet" href="\/assets\/kontrast\.[^>]+>\n/g, ''));
await variante('VG', (h) => h.replace(/<script src="\/assets\/kopf\.[^>]+><\/script>\n/, '').replace('<script type="module"', '<script type="module" blocking="render"'));
await variante('VH', (h) => h.replace(/<script src="\/assets\/kopf\.[^>]+><\/script>\n/, ''));
