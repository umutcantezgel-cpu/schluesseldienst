// Assets: CSS bündeln, JS-Module flach zusammenführen, Schriften/Bilder kopieren,
// alles mit Inhalts-Fingerabdruck im Dateinamen und SRI (sha384).
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname, resolve, basename, extname, relative } from 'node:path';

export const hash10 = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 10);
export const sri = (buf) => 'sha384-' + createHash('sha384').update(buf).digest('base64');

const CSS_REIHENFOLGE = ['token.css', 'schriften.css', 'basis.css', 'layout.css', 'komponenten/*', 'bewegung.css', 'hilfen.css', 'druck.css'];

async function dateien(ordner) {
  try { return (await readdir(ordner, { withFileTypes: true })).filter((d) => d.isFile()).map((d) => d.name).sort(); } catch { return []; }
}

function cssVerdichten(teile, pfadKarte) {
  const text = teile.map((t) => t.text).join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/url\(\s*["']?(\/assets\/[^"')]+)["']?\s*\)/g, (m, p) => {
      if (!pfadKarte.has(p)) throw new Error(`CSS verweist auf unbekanntes Asset ${p}`);
      return `url("${pfadKarte.get(p)}")`;
    })
    .split('\n').map((z) => z.trim()).filter(Boolean).join('\n');
  return { text: text + '\n', dateien: teile.map((t) => t.name) };
}

/** Bündelt die gemeinsamen CSS-Dateien in fester Reihenfolge; ersetzt url("/assets/…") durch Fingerabdruck-Pfade. */
export async function cssBuendeln(wurzel, pfadKarte) {
  const css = join(wurzel, 'src/assets/css');
  const teile = [];
  for (const eintrag of CSS_REIHENFOLGE) {
    if (eintrag.endsWith('/*')) {
      const ordner = join(css, eintrag.slice(0, -2));
      for (const n of await dateien(ordner)) if (n.endsWith('.css')) teile.push({ name: `${eintrag.slice(0, -2)}/${n}`, text: await readFile(join(ordner, n), 'utf8') });
    } else {
      try { teile.push({ name: eintrag, text: await readFile(join(css, eintrag), 'utf8') }); } catch { /* optional */ }
    }
  }
  return cssVerdichten(teile, pfadKarte);
}

/**
 * Ansichts-Stile: je Unterordner von src/assets/css/ansichten/ ein eigenes Bündel, das nur Seiten mit
 * `stile: ['<ordner>']` laden. So bleibt das gemeinsame Bündel klein; das Budget gilt je Seite (Summe).
 */
export async function ansichtenBuendeln(wurzel, pfadKarte) {
  const basis = join(wurzel, 'src/assets/css/ansichten');
  let ordner = [];
  try { ordner = (await readdir(basis, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort(); } catch { return []; }
  const aus = [];
  for (const name of ordner) {
    if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error(`Ansichts-Stil mit ungültigem Namen: ${name}`);
    const teile = [];
    for (const n of await dateien(join(basis, name))) if (n.endsWith('.css')) teile.push({ name: `ansichten/${name}/${n}`, text: await readFile(join(basis, name, n), 'utf8') });
    if (teile.length) aus.push({ name, ...cssVerdichten(teile, pfadKarte) });
  }
  return aus;
}

const IMPORT = /^import\s*\{([^}]*)\}\s*from\s*['"](\.{1,2}\/[^'"]+)['"];?\s*$/gm;
const DEKLARATION = /^(?:export\s+)?(?:async\s+)?(?:const|let|function\*?|class)\s+([A-Za-z_$][\w$]*)/gm;

/** Führt ES-Module ab einem Einstieg flach zusammen (nur benannte relative Importe, keine Umbenennung). */
export async function jsBuendeln(einstieg) {
  const besucht = new Map();
  const reihenfolge = [];
  const namen = new Map();
  async function besuche(datei, kette = []) {
    const abs = resolve(datei);
    if (kette.includes(abs)) throw new Error(`JS-Zyklus: ${[...kette, abs].map((p) => basename(p)).join(' → ')}`);
    if (besucht.has(abs)) return;
    besucht.set(abs, true);
    const quelle = await readFile(abs, 'utf8');
    if (/\bimport\s*\(/.test(quelle)) throw new Error(`${basename(abs)}: dynamisches import() ist verboten`);
    if (/^\s*import\s+[^{\s]/m.test(quelle) || /^\s*export\s+(default|\*|\{)/m.test(quelle)) throw new Error(`${basename(abs)}: nur benannte Importe/Exporte erlaubt`);
    for (const m of quelle.matchAll(IMPORT)) {
      if (/\bas\b/.test(m[1])) throw new Error(`${basename(abs)}: Umbenennung mit „as“ ist im Bündel nicht erlaubt`);
      await besuche(join(dirname(abs), m[2]), [...kette, abs]);
    }
    const koerper = quelle.replace(IMPORT, '').replace(/^export\s+/gm, '');
    for (const m of koerper.matchAll(DEKLARATION)) {
      if (namen.has(m[1]) && namen.get(m[1]) !== abs) throw new Error(`JS-Namenskollision „${m[1]}“ in ${basename(abs)} und ${basename(namen.get(m[1]))}`);
      namen.set(m[1], abs);
    }
    reihenfolge.push({ datei: abs, koerper });
  }
  await besuche(einstieg);
  const text = reihenfolge.map((r) => `// ${relative(dirname(resolve(einstieg)), r.datei)}\n${r.koerper.trim()}\n`).join('\n');
  return { text, module: reihenfolge.map((r) => r.datei) };
}

/** Kopierziele mit Fingerabdruck: liefert [{quelle, ziel, pfad}] und Karte /assets/x → /assets/x.HASH.ext */
export async function statischeAssets(wurzel) {
  const liste = [];
  for (const ordner of ['schriften', 'og', 'bilder']) {
    const abs = join(wurzel, 'src/assets', ordner);
    for (const n of await dateien(abs)) {
      if (n === 'OFL.txt') { const buf = await readFile(join(abs, n)); liste.push({ quelle: `/assets/${ordner}/${n}`, pfad: `/assets/${ordner}/${n}`, inhalt: buf, sri: sri(buf) }); continue; }
      if (!/\.(woff2|png|jpg|webp|avif|svg)$/.test(n)) continue;
      const buf = await readFile(join(abs, n));
      const ext = extname(n);
      const zielName = `${basename(n, ext)}.${hash10(buf)}${ext}`;
      liste.push({ quelle: `/assets/${ordner}/${n}`, pfad: `/assets/${ordner}/${zielName}`, inhalt: buf, sri: sri(buf) });
    }
  }
  return liste;
}
