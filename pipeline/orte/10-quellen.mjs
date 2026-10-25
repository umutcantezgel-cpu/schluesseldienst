// Stufe 2: liest die Ortslisten beider Wettbewerber (Commit ad81157) in einen Quellen-Datensatz.
// Ausgabe: .cache/orte/quellen.json (1 Datensatz je Zeile) und .cache/orte/quellen-bericht.json.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gitShow, unzipEintrag, schreibeZeilenJson, schreibeObjektJson, zusicherung } from './lib.mjs';

const WURZEL = fileURLToPath(new URL('../../', import.meta.url));
const ORTE = join(WURZEL, '.cache', 'orte');

export const RICHTER_STANDORTE = 'Richter Schlüsseldienst/01a12b76-b326-7756-a303-8fa6e684874c/www.richter-sicherheitstechnik.de_standorte.html.json';
export const RICHTER_SITEMAP = 'Richter Schlüsseldienst/01a12b76-b326-7756-a303-8fa6e684874c/www.richter-sicherheitstechnik.de_share_sitemap.xml.json';
export const ADAM_ZIP = 'Schlüsseldienst Adam/dff09287-3472-45a0-bec3-2e544301d508.zip';
export const ADAM_EINTRAG = '01a12b8b-2e50-769a-a430-39951ec66771/www.schluesseldienst-adam.de_sitemap.xml.json';

const ENTITAETEN = { amp: '&', quot: '"', '#39': "'", lt: '<', gt: '>' };

/** Dekodiert &amp; &quot; &#39; &lt; &gt; sowie numerische Entitäten (dezimal und hexadezimal) in einem Durchgang. */
export function dekodiere(text) {
  return String(text).replace(/&(amp|quot|#39|lt|gt|#x[0-9a-fA-F]+|#\d+);/g, (z, name) => {
    if (name in ENTITAETEN) return ENTITAETEN[name];
    const cp = name[1] === 'x' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    return cp <= 0x10ffff ? String.fromCodePoint(cp) : z;
  });
}

/** Sichtbarer Text eines HTML-Schnipsels: Tags entfernen, dekodieren, Leerraum zusammenziehen. */
const textVon = (html) => dekodiere(String(html).replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

const LAND_KOPF = /^(?:Schlüsseldienst|Slotenmaker)\s*[-–—]\s*(.+)$/;
const LAND_NAMEN = { Nederland: 'Niederlande' };
const ORT_PRAEFIX = /^(?:Schlüsseldienst|Slotenmaker|Sleutelservice)\s+/;
const STANDORT_TOKEN = /<div class="toggler[^"]*"[^>]*>([\s\S]*?)<\/div>|<a\s([^>]*)>([\s\S]*?)<\/a>/g;
const RICHTER_ORT_HREF = /^https:\/\/www\.richter-sicherheitstechnik\.de\/((?:schluesseldienst|slotenmaker)-[^/?#]+)\.html$/;

/**
 * R Standorte: Akkordeon-Überschriften setzen das Land, danach folgende Orts-Links bilden die Datensätze.
 * Liefert { quelle, slug, text, land, url } in Dokumentreihenfolge.
 */
export function liesStandorte(html) {
  const liste = [];
  let land = null;
  for (const m of String(html).matchAll(STANDORT_TOKEN)) {
    if (m[1] !== undefined) {
      const kopf = LAND_KOPF.exec(textVon(m[1]));
      if (kopf) land = LAND_NAMEN[kopf[1]] ?? kopf[1];
      continue;
    }
    if (land === null) continue;
    const href = /\bhref="([^"]*)"/.exec(m[2]);
    if (!href) continue;
    const url = dekodiere(href[1]);
    const treffer = RICHTER_ORT_HREF.exec(url);
    if (!treffer) continue;
    const text = textVon(m[3]).replace(ORT_PRAEFIX, '');
    liste.push({ quelle: 'R', slug: treffer[1], text, land, url });
  }
  return liste;
}

/** Alle eindeutigen Richter-URLs aus einem Sitemap-Feld (Zeilen oder aneinandergereiht). */
export function liesSitemapR(feld) {
  const urls = [...String(feld).matchAll(/https?:\/\/www\.richter-sicherheitstechnik\.de\/[^\s"'<>()]*?(?=https?:\/\/|\s|$|["'<>()])/g)]
    .map((m) => m[0]);
  return [...new Set(urls)];
}

const ADAM_TOKEN = /<!--([\s\S]*?)-->|<loc>\s*([^<]*?)\s*<\/loc>/g;
const ADAM_AUSSCHLUSS = new Set([
  '', 'tueroeffnung', 'autooeffnung', 'garageoeffnung', 'tresoroeffnung', 'tuer-fenstereinbau',
  'preise', 'einsatzgebiete', 'in-der-naehe', 'impressum', 'datenschutz', 'blog',
]);

/**
 * A Sitemap: <loc>-Einträge mit Gruppenkommentar davor als region (Kommentar ohne „=“ und Leerraum).
 * Liefert { quelle, slug, text, region, url }; Nicht-Orte fallen weg.
 */
export function liesSitemapA(html) {
  const liste = [];
  let region = null;
  for (const m of String(html).matchAll(ADAM_TOKEN)) {
    if (m[1] !== undefined) {
      region = textVon(m[1].replace(/=/g, '')) || null;
      continue;
    }
    const url = dekodiere(m[2]);
    const pfad = /^https:\/\/www\.schluesseldienst-adam\.de\/(.*)$/.exec(url);
    if (!pfad) continue;
    const slug = pfad[1].replace(/\/$/, '');
    if (ADAM_AUSSCHLUSS.has(slug) || slug.startsWith('blog/')) continue;
    liste.push({ quelle: 'A', slug, text: slug, region, url });
  }
  return liste;
}

/** Feld mit <loc>-Einträgen bevorzugen, sonst das Markdown-Feld. */
export const sitemapFeld = (json) => (json.html && json.html.includes('<loc>') ? json.html : json.markdown);

const vergleiche = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

function zaehle(liste, feld) {
  const karte = {};
  for (const e of liste) {
    const k = e[feld] ?? '(keine)';
    karte[k] = (karte[k] ?? 0) + 1;
  }
  return Object.fromEntries(Object.keys(karte).sort(vergleiche).map((k) => [k, karte[k]]));
}

export async function hauptlauf() {
  // R Standorte
  const standorteJson = JSON.parse((await gitShow(RICHTER_STANDORTE)).toString('utf8'));
  const standorte = liesStandorte(standorteJson.html);
  zusicherung(standorte.length === 5308, `R Standorte: ${standorte.length} Datensätze statt 5.308`);
  const slugsStandorte = new Set(standorte.map((e) => e.slug));
  zusicherung(slugsStandorte.size === standorte.length, 'R Standorte: doppelte Slugs');
  console.log(`R Standorte: ${standorte.length} Datensätze (5.308 erwartet)`);
  console.log(`  je Land: ${JSON.stringify(zaehle(standorte, 'land'))}`);

  // R Sitemap
  const sitemapJson = JSON.parse((await gitShow(RICHTER_SITEMAP)).toString('utf8'));
  const urlsR = liesSitemapR(sitemapFeld(sitemapJson));
  zusicherung(urlsR.length === 5357, `R Sitemap: ${urlsR.length} URLs statt 5.357`);
  const orteR = urlsR
    .map((u) => /\/((?:schluesseldienst|slotenmaker)-[^/]+)\.html$/.exec(u)?.[1])
    .filter((s) => s !== undefined);
  const sitemapSlugs = new Set(orteR);
  const fehltInStandorte = orteR.filter((s) => !slugsStandorte.has(s));
  const nurInStandorte = [...slugsStandorte].filter((s) => !sitemapSlugs.has(s));
  console.log(`R Sitemap: ${urlsR.length} URLs (5.357 erwartet), davon Orts-URLs ${orteR.length}`);
  console.log(`  Orts-URLs ohne Standorte-Eintrag: ${fehltInStandorte.length}${fehltInStandorte.length ? ' → ' + fehltInStandorte.join(', ') : ''}`);
  console.log(`  Standorte ohne Sitemap-URL: ${nurInStandorte.length}${nurInStandorte.length ? ' → ' + nurInStandorte.join(', ') : ''}`);

  // A Sitemap (ZIP wird aus dem Commit in den Cache geschrieben, weil unzip eine Datei braucht)
  const zipBytes = await gitShow(ADAM_ZIP);
  const zipPfad = join(ORTE, 'roh', 'adam-export.zip');
  await mkdir(join(ORTE, 'roh'), { recursive: true });
  await writeFile(zipPfad, zipBytes);
  const adamJson = JSON.parse((await unzipEintrag(zipPfad, ADAM_EINTRAG)).toString('utf8'));
  const adam = liesSitemapA(sitemapFeld(adamJson));
  zusicherung(adam.length === 532, `A Sitemap: ${adam.length} Orts-URLs statt 532`);
  const ohneRegion = adam.filter((e) => e.region === null).length;
  console.log(`A Sitemap: ${adam.length} Orts-URLs (532 erwartet), ohne region: ${ohneRegion}`);
  console.log(`  je Region: ${JSON.stringify(zaehle(adam, 'region'))}`);

  // Ausgabe
  const alle = [...standorte, ...adam].sort((a, b) => vergleiche(a.quelle, b.quelle) || vergleiche(a.slug, b.slug));
  await schreibeZeilenJson(join(ORTE, 'quellen.json'), alle);
  const bericht = {
    adam_sitemap: { je_region: zaehle(adam, 'region'), orte: adam.length, region_fehlt: ohneRegion },
    ausgabe: { datensaetze: alle.length },
    richter_sitemap: {
      fehlt_in_standorte: fehltInStandorte,
      nur_in_standorte: nurInStandorte,
      orts_urls: orteR.length,
      urls: urlsR.length,
    },
    richter_standorte: { datensaetze: standorte.length, je_land: zaehle(standorte, 'land') },
  };
  await schreibeObjektJson(join(ORTE, 'quellen-bericht.json'), bericht);
  console.log(`Geschrieben: ${join(ORTE, 'quellen.json')} (${alle.length} Datensätze)`);
  console.log(`Bericht: ${join(ORTE, 'quellen-bericht.json')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  hauptlauf().catch((f) => {
    console.error(`Fehler: ${f.message}`);
    process.exitCode = 1;
  });
}
