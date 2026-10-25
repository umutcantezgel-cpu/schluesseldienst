// Hub-Seiten, Abschnitt „… in Zahlen“ (K-08): Gebietsart der Überschrift, ein Ort bzw. gleiche Entfernung, PLZ-Angabe.
// Dazu Lagekarte (Ortsseite) und Gebietslage (Hub) an echten Daten.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gebietsart, kennzahlenAbschnitt } from '../src/vorlagen/seiten/hub.mjs';
import { lagekarte, gebietslage } from '../src/vorlagen/teile/lagekarte.mjs';
import zonen from '../src/konfig/zonen.mjs';

const ort = (name, km, typ = 'gemeinde', plz = []) => ({ name, slug: name.toLowerCase().replace(/\W+/g, '-'), km, typ, zone: 'D', staat: 'DE', plz });
const text = (h) => String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');

test('Gebietsart: Kreis, kreisfreie Stadt (auch ohne Zusatz), Region, Provinz', () => {
  assert.equal(gebietsart('Landkreis Limburg-Weilburg', false), 'Kreis');
  assert.equal(gebietsart('Westerwaldkreis', false), 'Kreis');
  assert.equal(gebietsart('Rotenburg (Wümme)', false), 'Kreis');
  assert.equal(gebietsart('Kreisfreie Stadt Wiesbaden', false), 'Stadt');
  assert.equal(gebietsart('Stadtkreis Heidelberg', false), 'Stadt');
  assert.equal(gebietsart('Landeshauptstadt Magdeburg', false), 'Stadt');
  assert.equal(gebietsart('Frankfurt am Main', false), 'Stadt');
  assert.equal(gebietsart('Region Hannover', false), 'Region');
  assert.equal(gebietsart('Städteregion Aachen', false), 'Region');
  assert.equal(gebietsart('Regionalverband Saarbrücken', false), 'Region');
  assert.equal(gebietsart('Gelderland', true), 'Provinz');
});

test('Überschrift folgt der Gebietsart', () => {
  const orte = [ort('A', 10), ort('B', 20)];
  assert.match(text(kennzahlenAbschnitt(zonen, orte, 'DE', 'Kreis')), /Der Kreis in Zahlen/);
  assert.match(text(kennzahlenAbschnitt(zonen, orte, 'DE', 'Stadt')), /Die Stadt in Zahlen/);
  assert.match(text(kennzahlenAbschnitt(zonen, orte, 'NL', 'Provinz')), /Die Provinz in Zahlen/);
});

test('ein Ort bzw. gleiche Entfernung: eine Zeile statt zweimal desselben Orts', () => {
  const einer = text(kennzahlenAbschnitt(zonen, [ort('Kempten (Allgäu)', 341)], 'DE', 'Stadt'));
  assert.match(einer, /Einziger Ort: Kempten \(Allgäu\), 341 km/);
  assert.doesNotMatch(einer, /Entferntester/);
  const zwei = text(kennzahlenAbschnitt(zonen, [ort('Düsseldorf', 133), ort('Pempelfort', 133, 'ortsteil')], 'DE', 'Stadt'));
  assert.match(zwei, /Beide Orte: 133 km/);
  const drei = text(kennzahlenAbschnitt(zonen, [ort('A', 5), ort('B', 9), ort('C', 30)], 'DE', 'Kreis'));
  assert.match(drei, /Nächster: A, 5 km/);
  assert.match(drei, /Entferntester: C, 30 km/);
});

test('Null-Werte entfallen; PLZ ausgeschrieben; NL mit vierstelligen PLZ', () => {
  const nurOrtsteile = text(kennzahlenAbschnitt(zonen, [ort('X', 3, 'ortsteil', ['35781']), ort('Y', 4, 'ortsteil', ['65627'])], 'DE', 'Stadt'));
  assert.match(nurOrtsteile, /2 Ortsteile/);
  assert.doesNotMatch(nurOrtsteile, /\d Gemeinde/);
  assert.match(nurOrtsteile, /kleinste 35781, größte 65627/);
  const nl = { ...ort('Z', 300, 'gemeinde', ['7601', '7611']), staat: 'NL', zone: 'NL' };
  assert.match(text(kennzahlenAbschnitt(zonen, [nl], 'NL', 'Provinz')), /Postleitzahlen.*kleinste 7601, größte 7611/s);
});

// Lagekarte (Ortsseite) und Gebietslage (Hub) an echten Daten: nichts überdeckt Marken, Linie oder Schrift

const ORTE = JSON.parse(readFileSync(new URL('../src/daten/orte.json', import.meta.url), 'utf8')).filter((o) => o.slug);
const NACH_ID = new Map(ORTE.map((o) => [o.id, o]));
const SITZ = ORTE.find((o) => o.slug === 'weilburg');
const zahlen = (s) => s.split(/[^\d.-]+/).filter(Boolean).map(Number);

function zerlegen(svg) {
  const s = String(svg);
  const [, , b, h] = zahlen(/viewBox="([^"]+)"/.exec(s)[1]);
  const texte = [...s.matchAll(/<text class="([^"]+)" x="(-?\d+)" y="(-?\d+)"(?: text-anchor="(\w+)")?>([^<]*)<\/text>/g)]
    .map(([, klasse, x, y, anker = 'start', inhalt]) => ({ klasse, x: +x, y: +y, anker, inhalt }));
  const punkte = [...(/<path class="lk-nachbarn" d="([^"]+)"/.exec(s)?.[1] || '').matchAll(/M(-?\d+) (-?\d+)/g)].map(([, x, y]) => [+x, +y]);
  const ort = /class="lk-ort" cx="(-?\d+)" cy="(-?\d+)"/.exec(s) || /class="lk-sitz" cx="(-?\d+)" cy="(-?\d+)"/.exec(s);
  return { s, b, h, texte, punkte, ort: [+ort[1], +ort[2]] };
}
// Kiste wie die Vorlage: Schrift läuft breit (Faktor großzügig), Grundlinie y
const kiste = (t, groesse, faktor) => {
  const w = t.inhalt.length * groesse * faktor; const x1 = t.anker === 'start' ? t.x : t.anker === 'end' ? t.x - w : t.x - w / 2;
  return { x1, y1: t.y - groesse * 0.72, x2: x1 + w, y2: t.y + groesse * 0.2 };
};
const GROESSE = { 'lk-ort-text': [18, 0.6], 'lk-sitz-text': [16, 0.58], 'lk-km': [16, 0.58], 'lk-name': [15, 0.55], 'lk-mass-text': [15, 0.55] };

test('Lagekarte: Punkte meiden Ort, Weilburg, Linie und Beschriftungen; Schrift bleibt im Bild', () => {
  const stichprobe = ORTE.filter((_, i) => i % 23 === 0).concat(ORTE.filter((o) => ['loehnberg', 'weilburg', 'bremen', 'almelo'].includes(o.slug)));
  for (const o of stichprobe) {
    const nachbarn = (o.nachbarn || []).map((id) => NACH_ID.get(id)).filter(Boolean);
    const k = zerlegen(lagekarte({ ort: o, sitz: SITZ, nachbarn, umgebung: ORTE, praefix: 't' }));
    const kisten = k.texte.map((t) => kiste(t, ...GROESSE[t.klasse]));
    for (const [x, y] of k.punkte) {
      assert.ok(Math.hypot(x - k.ort[0], y - k.ort[1]) >= 15, `${o.slug}: Punkt ${x},${y} auf der Ortsmarke`);
      for (const q of kisten) assert.ok(!(x > q.x1 + 2 && x < q.x2 - 2 && y > q.y1 + 2 && y < q.y2 - 2), `${o.slug}: Punkt ${x},${y} unter Schrift`);
    }
    for (const t of k.texte) assert.ok(t.x >= 0 && t.x <= k.b && t.y > 0 && t.y <= k.h, `${o.slug}: ${t.inhalt} außerhalb`);
    if (o.km > 0) {
      assert.match(k.s, new RegExp(`class="lk-km"[^>]*>${o.km} km<`), `${o.slug}: Entfernung fehlt`);
      // Bogen läuft durch den Ort: Radius = Linienlänge
      const linie = /<path class="lk-linie" d="M0 0H(\d+)"/.exec(k.s);
      const bogen = /class="lk-bogen"[^>]* r="(\d+)"/.exec(k.s);
      if (bogen) assert.equal(bogen[1], linie[1], `${o.slug}: Bogen nicht durch den Ort`);
      assert.match(k.s, /<clipPath id="t-zug"><rect class="lk-zug"/, 'M-19 zieht die Maske, nicht die Linie');
    }
  }
});

test('Gebietslage: nahes Gebiet mit Ring und Zone A, fernes Gebiet mit Peilung statt Ringen', () => {
  const kreis = ORTE.filter((o) => o.kreisSlug === 'limburg-weilburg');
  const nah = gebietslage({ orte: kreis, sitz: SITZ, titel: 'Test' });
  assert.deepEqual(nah.zonen, ['A']);
  assert.ok(nah.ringe.includes(20));
  assert.equal(nah.fern, false);
  assert.match(String(nah.svg), /class="gk-sitz-punkt"/);
  const nl = ORTE.filter((o) => o.staat === 'NL');
  const fern = gebietslage({ orte: nl, sitz: SITZ, titel: 'Test' });
  assert.equal(fern.fern, true);
  assert.deepEqual(fern.ringe, []);
  assert.match(String(fern.svg), /class="lk-linie"/);
  assert.match(String(fern.svg), /Weilburg<tspan class="lk-km" x="\d+" dy="26">\d+–\d+ km<\/tspan>/);
  // ein einzelner Ort wird nicht unendlich vergrößert
  const einer = gebietslage({ orte: [nl[0]], sitz: SITZ, titel: 'Test' });
  assert.doesNotMatch(String(einer.svg), /NaN|Infinity/);
});
