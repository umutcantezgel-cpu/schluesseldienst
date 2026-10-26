// galerie.mjs: statische Galerie der Bildsätze. Schreibt _werkstatt/bilder/galerie.html und galerie.css.
// Aufruf: node _werkstatt/werkzeuge/galerie.mjs [--wurzel _werkstatt/bilder]
// Bildsatz: Ordner mit index.json (von bildsatz.mjs). Je Ansicht und Gerät eine Zeile in Hell (light),
//   darunter Dunkel (dark) als zweite Zeile, falls vorhanden. Gelistet werden nur die in index.json genannten
//   Dateien; fehlt eine davon, bricht das Werkzeug ab.
// Bildreihe: Ordner ohne index.json mit .jpg/.png direkt darin; der Dateiname dient als Unterschrift.
// Unterordner werden rekursiv gelesen (E2/v01 ist ein Bildsatz, E2/bewegung und E2/moment/* sind Bildreihen).
//   Dateien im Wurzelordner und versteckte Ordner werden übergangen.
// Reihenfolge: E2, E3, E4, E5, E5-abschluss, danach alle übrigen alphabetisch; je Ordner zuerst Bildsätze.
// Die Seite ist rein statisch: kein Skript, keine Inline-Styles, keine fremden Ressourcen (CSP-tauglich).
// Exit: 0 ok · 2 Werkzeugfehler (dann ist nichts geschrieben)
import { parseArgs } from 'node:util';
import { promises as fsp } from 'node:fs';
import { join, resolve, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORDNUNG = ['E2', 'E3', 'E4', 'E5', 'E5-abschluss'];
const GERAET_ORDNUNG = ['mobil', 'tablet', 'desktop'];
const SCHEMA_ORDNUNG = ['light', 'dark'];
const BILDENDUNGEN = ['.jpg', '.png'];
const STANDARD_WURZEL = fileURLToPath(new URL('../bilder/', import.meta.url));
const CSP = "default-src 'none'; img-src 'self'; style-src 'self'; base-uri 'none'; form-action 'none'";

const EINLEITUNG = [
  'Die Bildsätze der Etappen: je Ordner die Ausschnitte der Seiten, je Ansicht und Gerät eine Zeile in Hell (light), darunter Dunkel (dark), falls vorhanden. Der Stand jedes Ordners steht im Abschnitt und stammt aus dem Zeitpunkt seiner index.json.',
  'Die Vorher-Bilder der Wettbewerber liegen bewusst nicht im Repository, sondern unter .cache/vorher/bilder. Grund: Das Repository ist öffentlich; fremde Inhalte gehören nicht hinein.',
];

const CSS = `/* galerie.css: erzeugt von _werkstatt/werkzeuge/galerie.mjs. Systemschrift, Hell/Dunkel über prefers-color-scheme. */
:root { color-scheme: light dark; --hintergrund: #ffffff; --text: #1d1d22; --gedaempft: #5a5a64; --rand: #d4d4da; --flaeche: #f5f5f8; }
@media (prefers-color-scheme: dark) {
  :root { --hintergrund: #111114; --text: #ececf0; --gedaempft: #a6a6b0; --rand: #3a3a42; --flaeche: #1b1b21; }
}
html { background: var(--hintergrund); }
body { margin: 0 auto; padding: 1rem; max-width: 90rem; background: var(--hintergrund); color: var(--text); font: 1rem/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
h1 { font-size: 1.6rem; margin: .5rem 0; }
h3 { font-size: 1rem; margin: 1.25rem 0 .25rem; overflow-wrap: anywhere; }
.einleitung, .gesamt { color: var(--gedaempft); margin: .25rem 0; max-width: 60rem; }
details { margin: .75rem 0; padding: .5rem .75rem; border: 1px solid var(--rand); border-radius: .5rem; background: var(--flaeche); }
summary { cursor: pointer; overflow-wrap: anywhere; }
summary h2 { display: inline; margin: 0; font-size: 1rem; font-weight: 600; }
summary h2 span { font-weight: 400; color: var(--gedaempft); }
.stand, .hinweis { color: var(--gedaempft); font-size: .9rem; margin: .5rem 0 .25rem; }
.zeilenkopf { font-weight: 600; margin: .75rem 0 .25rem; }
.zeile { display: grid; grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr)); gap: .75rem; align-items: start; margin-bottom: .5rem; }
figure { margin: 0; min-width: 0; }
img { display: block; max-width: 100%; height: auto; border: 1px solid var(--rand); border-radius: .25rem; }
figcaption { margin-top: .25rem; font-size: .75rem; color: var(--gedaempft); overflow-wrap: anywhere; }
`;

/** Vergleich nach Codepunkten, damit die Reihenfolge überall gleich ist. */
const vergleiche = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** Sortiert nach einer festen Liste; unbekannte Werte stehen hinter den bekannten und dann alphabetisch. */
const rang = (liste, wert) => { const i = liste.indexOf(wert); return i >= 0 ? i : liste.length; };
const sortiert = (eintraege, liste) => [...eintraege].sort(([x], [y]) => rang(liste, x) - rang(liste, y) || vergleiche(x, y));

/** Escaped Text für HTML-Inhalt und Attributwerte. */
const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Relativer Pfad für src: jedes Segment URL-kodiert, die Schrägstriche bleiben. */
const urlPfad = (rel) => rel.split('/').map(encodeURIComponent).join('/');

const bilderText = (n) => `${n} ${n === 1 ? 'Bild' : 'Bilder'}`;

/** Stand aus dem Zeitpunkt der index.json, in Berliner Zeit. */
function standText(zeitpunkt) {
  const d = new Date(zeitpunkt);
  if (!zeitpunkt || Number.isNaN(d.getTime())) return null;
  const teil = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' }).format(d);
  return `${teil} Uhr (Berliner Zeit)`;
}

/** Hinweise aus einer gekürzten index.json: Freitext (gekuerzt) und Zahlen (kuerzung). */
function hinweise(index) {
  const liste = [];
  if (typeof index.gekuerzt === 'string' && index.gekuerzt.trim()) liste.push(index.gekuerzt.trim());
  const k = index.kuerzung;
  if (k && Number.isFinite(k.vorher) && Number.isFinite(k.nachher)) {
    const mb = Number.isFinite(k.bytesNachher)
      ? `, ${(k.bytesNachher / 1e6).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB`
      : '';
    liste.push(`Gekürzt: ${k.nachher} von ${k.vorher} Bildern${mb}.`);
  }
  return liste;
}

/** Liest die index.json eines Ordners und prüft, dass jede darin genannte Datei vorhanden ist. */
async function bildsatz(rel, abs) {
  let index;
  try { index = JSON.parse(await fsp.readFile(join(abs, 'index.json'), 'utf8')); }
  catch (e) { throw new Error(`${rel}/index.json ist nicht lesbar (${e.message})`); }
  if (!Array.isArray(index.bilder)) throw new Error(`${rel}/index.json: Feld bilder fehlt`);

  const bilder = index.bilder.map((b, i) => {
    const datei = b?.datei;
    if (typeof datei !== 'string' || basename(datei) !== datei || !BILDENDUNGEN.includes(extname(datei).toLowerCase())) {
      throw new Error(`${rel}/index.json, Eintrag ${i + 1}: datei „${datei}“ ist kein Dateiname mit .jpg oder .png`);
    }
    if (typeof b.pfad !== 'string' || typeof b.geraet !== 'string' || typeof b.schema !== 'string' || !Number.isInteger(b.nr)) {
      throw new Error(`${rel}/index.json, Eintrag ${i + 1} (${datei}): pfad, geraet, schema oder nr fehlt`);
    }
    return {
      datei, relDatei: `${rel}/${datei}`, pfad: b.pfad, geraet: b.geraet, schema: b.schema, nr: b.nr,
      breite: Number.isInteger(b.breite) ? b.breite : null, hoehe: Number.isInteger(b.hoehe) ? b.hoehe : null,
    };
  });

  const fehlend = [];
  await Promise.all(bilder.map(async (b) => { try { await fsp.access(join(abs, b.datei)); } catch { fehlend.push(b.datei); } }));
  if (fehlend.length) {
    throw new Error(`${rel}: ${fehlend.length} in index.json genannte Datei(en) fehlen, z. B. ${fehlend.sort(vergleiche).slice(0, 3).join(', ')}`);
  }
  return { typ: 'bildsatz', rel, oben: rel.split('/')[0], bilder, stand: standText(index.zeitpunkt), hinweise: hinweise(index) };
}

/** Sammelt alle Abschnitte: Ordner mit index.json als Bildsatz, Ordner mit direkten Bildern als Bildreihe. */
async function sammle(wurzel) {
  const abschnitte = [];
  async function gehe(rel) {
    const abs = rel ? join(wurzel, rel) : wurzel;
    const eintraege = await fsp.readdir(abs, { withFileTypes: true });
    const dateien = eintraege.filter((e) => e.isFile()).map((e) => e.name).sort(vergleiche);
    if (rel) {
      if (dateien.includes('index.json')) {
        abschnitte.push(await bildsatz(rel, abs));
      } else {
        const bilder = dateien.filter((n) => BILDENDUNGEN.includes(extname(n).toLowerCase()));
        if (bilder.length) {
          abschnitte.push({ typ: 'reihe', rel, oben: rel.split('/')[0], bilder: bilder.map((datei) => ({ datei, relDatei: `${rel}/${datei}`, unterschrift: datei })) });
        }
      }
    }
    const unterordner = eintraege.filter((e) => e.isDirectory() && !e.name.startsWith('.')).map((e) => e.name).sort(vergleiche);
    for (const u of unterordner) await gehe(rel ? `${rel}/${u}` : u);
  }
  await gehe('');
  return abschnitte;
}

/** HTML eines Bildes; width/height nur, wenn aus der index.json bekannt. */
function figur(relDatei, unterschrift, breite = null, hoehe = null) {
  const maße = breite && hoehe ? ` width="${breite}" height="${hoehe}"` : '';
  return `<figure><img src="${esc(urlPfad(relDatei))}"${maße} loading="lazy" decoding="async" alt="${esc(unterschrift)}"><figcaption>${esc(unterschrift)}</figcaption></figure>`;
}

/** Bildunterschrift eines Ausschnitts: Ansicht, Gerät, Schema, Nr. */
const unterschriftBildsatz = (b) => `${b.pfad} · ${b.geraet} · ${b.schema} · Nr. ${String(b.nr).padStart(2, '0')}`;

/** Gruppiert die Bilder eines Bildsatzes nach Ansicht, Gerät und Schema; je Gruppe eine Zeile. */
function renderAnsichten(bilder) {
  const ansichten = new Map();
  for (const b of bilder) {
    const geraete = ansichten.get(b.pfad) ?? new Map();
    ansichten.set(b.pfad, geraete);
    const schemata = geraete.get(b.geraet) ?? new Map();
    geraete.set(b.geraet, schemata);
    schemata.set(b.schema, [...(schemata.get(b.schema) ?? []), b]);
  }
  const teile = [];
  for (const [pfad, geraete] of ansichten) {
    teile.push(`<section class="ansicht">`, `<h3>${esc(pfad)}</h3>`);
    for (const [geraet, schemata] of sortiert(geraete, GERAET_ORDNUNG)) {
      teile.push(`<div class="geraet"><p class="zeilenkopf">${esc(geraet)}</p>`);
      for (const [schema, liste] of sortiert(schemata, SCHEMA_ORDNUNG)) {
        const figuren = [...liste].sort((x, y) => x.nr - y.nr).map((b) => figur(b.relDatei, unterschriftBildsatz(b), b.breite, b.hoehe));
        teile.push(`<div class="zeile${schema === 'dark' ? ' dunkel' : ''}">${figuren.join('')}</div>`);
      }
      teile.push('</div>');
    }
    teile.push('</section>');
  }
  return teile.join('\n');
}

/** Ein <details>-Abschnitt je Ordner. */
function renderAbschnitt(a) {
  const kopf = `<summary><h2>${esc(a.rel)} <span>${bilderText(a.bilder.length)}</span></h2></summary>`;
  if (a.typ === 'reihe') {
    const zeile = `<div class="zeile">${a.bilder.map((b) => figur(b.relDatei, b.unterschrift)).join('')}</div>`;
    return `<details>\n${kopf}\n<p class="stand">Ohne index.json: einfache Bildreihe, Dateiname als Unterschrift.</p>\n${zeile}\n</details>`;
  }
  const stand = a.stand ? `<p class="stand">Stand: ${esc(a.stand)}</p>` : '';
  const hinweis = a.hinweise.map((h) => `<p class="hinweis">${esc(h)}</p>`).join('');
  return `<details>\n${kopf}\n${stand}${hinweis}\n${renderAnsichten(a.bilder)}\n</details>`;
}

/** Vollständige HTML-Seite: ohne Skript, ohne Inline-Styles, nur galerie.css als Stylesheet. */
function seite(abschnitte) {
  const gesamt = abschnitte.reduce((summe, a) => summe + a.bilder.length, 0);
  return [
    '<!doctype html>',
    '<html lang="de">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<meta http-equiv="Content-Security-Policy" content="${CSP}">`,
    '<title>Galerie der Bildsätze</title>',
    '<link rel="stylesheet" href="galerie.css">',
    '</head>',
    '<body>',
    '<header>',
    '<h1>Galerie der Bildsätze</h1>',
    ...EINLEITUNG.map((p) => `<p class="einleitung">${esc(p)}</p>`),
    `<p class="gesamt">${abschnitte.length} Abschnitte, ${bilderText(gesamt)}.</p>`,
    '</header>',
    '<main>',
    ...abschnitte.map(renderAbschnitt),
    '</main>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

async function main() {
  const { values: opt } = parseArgs({
    options: { wurzel: { type: 'string', default: STANDARD_WURZEL } },
    strict: true,
  });
  const wurzel = resolve(opt.wurzel);

  // Erst alles einlesen und prüfen; geschrieben wird nur, wenn kein Fehler auftrat.
  const abschnitte = (await sammle(wurzel)).sort((x, y) => rang(ORDNUNG, x.oben) - rang(ORDNUNG, y.oben)
    || vergleiche(x.oben, y.oben)
    || (x.typ === y.typ ? 0 : x.typ === 'bildsatz' ? -1 : 1)
    || vergleiche(x.rel, y.rel));

  const html = seite(abschnitte);
  await fsp.writeFile(join(wurzel, 'galerie.html'), html);
  await fsp.writeFile(join(wurzel, 'galerie.css'), CSS);

  const gesamt = abschnitte.reduce((summe, a) => summe + a.bilder.length, 0);
  console.log(`galerie: ${abschnitte.length} Abschnitte, ${bilderText(gesamt)} → ${join(wurzel, 'galerie.html')}`);
  for (const a of abschnitte) console.log(`  ${a.rel}: ${bilderText(a.bilder.length)} (${a.typ === 'bildsatz' ? 'index.json' : 'Bildreihe'})`);
  process.exitCode = 0;
}

main().catch((e) => {
  console.error(`galerie: Werkzeugfehler: ${e.message}`);
  process.exitCode = 2;
});
