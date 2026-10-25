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

// Lagekarte (Ortsseite) und Gebietslage (Hub) an echten Daten: nichts überdeckt Marken, Linie, Bogen, Ringe,
// Rasterpunkte oder Schrift

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

// Schneidet die Linie eines Kreises (Bogen, Zonenring) die Kiste? Ganz innen oder ganz außen ist frei.
const kreuzt = (k, [cx, cy, rr]) => {
  const nah = Math.hypot(Math.max(k.x1 - cx, 0, cx - k.x2), Math.max(k.y1 - cy, 0, cy - k.y2));
  const fern = Math.max(...[[k.x1, k.y1], [k.x2, k.y1], [k.x1, k.y2], [k.x2, k.y2]].map(([x, y]) => Math.hypot(x - cx, y - cy)));
  return nah < rr && fern > rr;
};

test('Lagekarte: der Bogen um Weilburg läuft durch keine Beschriftung (außer am Ort) und nicht durch den Maßstab', () => {
  const stichprobe = ORTE.filter((_, i) => i % 7 === 0).concat(ORTE.filter((o) => ['bremen', 'almelo', 'frankfurt-am-main', 'loehnberg'].includes(o.slug)));
  let mitMassstab = 0;
  for (const o of stichprobe) {
    const nachbarn = (o.nachbarn || []).map((id) => NACH_ID.get(id)).filter(Boolean);
    const k = zerlegen(lagekarte({ ort: o, sitz: SITZ, nachbarn, umgebung: ORTE, praefix: 't' }));
    const bogen = /<circle class="lk-bogen" cx="(-?\d+)" cy="(-?\d+)" r="(\d+)"/.exec(k.s);
    if (!bogen) continue;
    const ring = [+bogen[1], +bogen[2], +bogen[3]];
    for (const t of k.texte.filter((x) => x.klasse !== 'lk-ort-text')) {
      assert.ok(!kreuzt(kiste(t, ...GROESSE[t.klasse]), ring), `${o.slug}: Bogen durch „${t.inhalt}“`);
    }
    const mass = /<path class="lk-mass" d="M(\d+) (\d+)h(\d+)/.exec(k.s);
    if (mass) {
      mitMassstab++;
      assert.ok(!kreuzt({ x1: +mass[1], x2: +mass[1] + +mass[3], y1: +mass[2] - 3, y2: +mass[2] + 3 }, ring), `${o.slug}: Bogen durch den Maßstab`);
    }
  }
  // Der Maßstab weicht dem Bogen aus, entfällt aber nur selten mangels Platz
  assert.ok(mitMassstab / stichprobe.length > 0.9, `Maßstab nur auf ${mitMassstab} von ${stichprobe.length} Karten`);
});

test('Gebietslage: Namen und Ringbeschriftungen liegen weder auf Rasterpunkten noch auf Ringen', () => {
  const gebiete = { hessen: (o) => o.landSlug === 'hessen', 'limburg-weilburg': (o) => o.kreisSlug === 'limburg-weilburg', 'lahn-dill-kreis': (o) => o.kreisSlug === 'lahn-dill-kreis', westerwaldkreis: (o) => o.kreisSlug === 'westerwaldkreis' };
  // Mobile und breite Schriftgröße (gebiet.css): Namen 18/15, Ringe 18/16, Weilburg 24/18 Einheiten
  const LAGEN = [['schmal', { 'gk-name': 18, 'gk-ring-text': 18, 'gk-sitz-name': 24 }], ['breit', { 'gk-name': 15, 'gk-ring-text': 16, 'gk-sitz-name': 18 }]];
  for (const [name, filter] of Object.entries(gebiete)) {
    const s = String(gebietslage({ orte: ORTE.filter(filter), sitz: SITZ, titel: 'Test' }).svg);
    const punkte = [...s.matchAll(/<path class="gk-raster ([^"]*)" d="([^"]+)"/g)]
      .flatMap(([, klasse, d]) => [...d.matchAll(/M(-?\d+) (-?\d+)/g)].map(([, x, y]) => ({ x: +x, y: +y, nurBreit: klasse.includes('gl-nur-breit') })));
    const ringe = [...s.matchAll(/class="gk-ring" cx="(-?\d+)" cy="(-?\d+)" r="(\d+)"/g)].map((m) => [+m[1], +m[2], +m[3]]);
    const texte = [...s.matchAll(/<text class="(gk-[\w-]+)"([^>]*?) x="(-?\d+)" y="(-?\d+)"(?: text-anchor="(\w+)")?>([^<]*)</g)]
      .map(([, klasse, zusatz, x, y, anker = 'start', inhalt]) => ({ klasse, rang2: zusatz.includes('data-rang="2"'), x: +x, y: +y, anker, inhalt }));
    assert.ok(texte.some((t) => t.klasse === 'gk-name'), `${name}: kein Ortsname`);
    for (const t of texte) {
      for (const [lage, groesse] of LAGEN) {
        if (lage === 'schmal' && t.rang2) continue; // Nebennamen entfallen mobil
        const k = kiste(t, groesse[t.klasse], t.klasse === 'gk-sitz-name' ? 0.58 : 0.55);
        const darunter = punkte.filter((q) => (lage === 'breit' || !q.nurBreit) && q.x > k.x1 && q.x < k.x2 && q.y > k.y1 && q.y < k.y2);
        assert.equal(darunter.length, 0, `${name}: „${t.inhalt}“ (${lage}) auf ${darunter.length} Rasterpunkten`);
        // Weilburg darf einen kleinen Ring kreuzen, dann unterbricht ihn eine Platte in Blattfarbe
        if (t.klasse === 'gk-sitz-name') continue;
        for (const rg of ringe) assert.ok(!kreuzt(k, rg), `${name}: Ring durch „${t.inhalt}“ (${lage})`);
      }
    }
    const sitzText = texte.find((t) => t.klasse === 'gk-sitz-name');
    if (ringe.some((rg) => kreuzt(kiste(sitzText, 24, 0.58), rg))) assert.match(s, /<rect class="gl-platte gl-nur-schmal"/, `${name}: Ring durch „Weilburg“ ohne Platte`);
    // Führungslinien kreuzen keine Schrift
    for (const [, x1, y1, x2, y2] of s.matchAll(/class="gl-fuehrung"[^>]*d="M(-?\d+) (-?\d+)L(-?\d+) (-?\d+)"/g)) {
      for (const t of texte) {
        const k = kiste(t, 15, 0.55);
        for (let i = 0; i <= 10; i++) {
          const [x, y] = [+x1 + ((x2 - x1) * i) / 10, +y1 + ((y2 - y1) * i) / 10];
          assert.ok(!(x > k.x1 + 2 && x < k.x2 - 2 && y > k.y1 + 2 && y < k.y2 - 2), `${name}: Führungslinie durch „${t.inhalt}“`);
        }
      }
    }
  }
});

test('Gebietslage fern: Weilburg steht an der Kante, an der die Peilung das Blatt verlässt; Maßstab statt Ringen', () => {
  for (const kreis of ['roth', 'berlin', 'vorpommern-greifswald']) {
    const orte = ORTE.filter((o) => o.kreisSlug === kreis);
    const r = gebietslage({ orte, sitz: SITZ, titel: 'Test' });
    const s = String(r.svg);
    assert.equal(r.fern, true, kreis);
    const [, ax, ay, ex, ey] = /class="lk-linie" d="M(-?\d+) (-?\d+)L(-?\d+) (-?\d+)"/.exec(s).map(Number);
    // Austrittspunkt an der Blattkante (360 × 240)
    const t = Math.min(...[[ex - ax, 0, 360], [ey - ay, 0, 240]].flatMap(([d, lo, hi], i) => {
      const a = i ? ay : ax;
      return d > 0 ? [(hi - a) / d] : d < 0 ? [(lo - a) / d] : [];
    }));
    const [kx, ky] = [ax + (ex - ax) * t, ay + (ey - ay) * t];
    const [, x, y, anker = 'start'] = /<text class="gk-sitz-name" x="(-?\d+)" y="(-?\d+)"(?: text-anchor="(\w+)")?>/.exec(s);
    const b = 8 * 18 * 0.58; const x1 = anker === 'start' ? +x : +x - b;
    const abstand = Math.hypot(Math.max(x1 - kx, 0, kx - (x1 + b)), Math.max(+y - 18 - ky, 0, ky - (+y + 30)));
    assert.ok(abstand < 140, `${kreis}: „Weilburg“ ${Math.round(abstand)} Einheiten vom Austrittspunkt`);
    assert.match(s, /class="lk-mass-text"[^>]*>[\d,]+ km</, `${kreis}: kein Maßstab`);
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
