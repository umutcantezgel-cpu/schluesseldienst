// VM (nur .cache): Kopf-Skript bleibt, Druck- und Kontraststile als EINE Datei (media="print, (forced-colors: active)",
// Inhalte in @media print bzw. @media (forced-colors: active) eingeschlossen). Grundlage .cache/e5-final2/dist.
import { readFile, writeFile, rm, mkdir, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const QUELLE = '/home/user/schluesseldienst/.cache/e5-final2/dist';
const AUS = '/home/user/schluesseldienst/.cache/vt-exp/VM/dist';
const sri = (t) => `sha384-${createHash('sha384').update(t).digest('base64')}`;
await rm(join(AUS, '..'), { recursive: true, force: true }); await mkdir(join(AUS, '..'), { recursive: true });
execFileSync('cp', ['-al', QUELLE, AUS]);
const assets = await readdir(join(AUS, 'assets'));
const druck = assets.find((f) => /^druck\.[0-9a-f]{10}\.css$/.test(f)); const kontrast = assets.find((f) => /^kontrast\.[0-9a-f]{10}\.css$/.test(f));
const text = `@media print {\n${await readFile(join(AUS, 'assets', druck), 'utf8')}\n}\n@media (forced-colors: active) {\n${await readFile(join(AUS, 'assets', kontrast), 'utf8')}\n}\n`;
const name = `sonder.${createHash('sha256').update(text).digest('hex').slice(0, 10)}.css`;
await writeFile(join(AUS, 'assets', name), text);
for (const s of ['index.html', 'preise/index.html']) {
  const p = join(AUS, s); let h = await readFile(p, 'utf8');
  h = h.replace(/<link rel="stylesheet" href="\/assets\/kontrast\.[^>]+>\n/, '')
       .replace(/<link rel="stylesheet" href="\/assets\/druck\.[^>]+>/, `<link rel="stylesheet" href="/assets/${name}" integrity="${sri(text)}" media="print, (forced-colors: active)">`);
  await rm(p); await writeFile(p, h);
}
console.log(name, Buffer.byteLength(text));
