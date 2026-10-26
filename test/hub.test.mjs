// Hub-Seiten, Abschnitt „… in Zahlen“ (K-08): Gebietsart der Überschrift, ein Ort bzw. gleiche Entfernung, PLZ-Angabe.
// Dazu Lagekarte (Ortsseite) und Gebietslage (Hub) an echten Daten, A–Z-Sprungziele und die Umgebung der Ortsseite.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gebietsart, kennzahlenAbschnitt, seiten as hubSeiten, vorbereiten as hubVorbereiten } from '../src/vorlagen/seiten/hub.mjs';
import { seiten as ortSeiten } from '../src/vorlagen/seiten/ort.mjs';
import betrieb from '../src/konfig/betrieb.mjs';
import preise from '../src/konfig/preise.mjs';
import { iconsLaden } from '../src/vorlagen/teile/icons.mjs';
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

// Texte einer Karte; zweizeilige Namen (tspan) mit ihren Zeilen, inhalt ist die längste Zeile
const TEXT = /<text class="([^"]+)"([^>]*?) x="(-?\d+)" y="(-?\d+)"(?: text-anchor="(\w+)")?>(.*?)<\/text>/g;
const texteVon = (s) => [...s.matchAll(TEXT)].map(([, klasse, zusatz, x, y, anker = 'start', roh]) => {
  const zeilen = roh.includes('<tspan') ? [...roh.matchAll(/<tspan[^>]*>([^<]*)<\/tspan>/g)].map((m) => m[1]) : [roh.replace(/<[^>]+>.*$/, '')];
  return { klasse, rang2: zusatz.includes('data-rang="2"'), x: +x, y: +y, anker, zeilen, inhalt: zeilen.reduce((a, z) => (z.length > a.length ? z : a)) };
});
function zerlegen(svg) {
  const s = String(svg);
  const [, , b, h] = zahlen(/viewBox="([^"]+)"/.exec(s)[1]);
  const texte = texteVon(s);
  const punkte = [...(/<path class="lk-nachbarn" d="([^"]+)"/.exec(s)?.[1] || '').matchAll(/M(-?\d+) (-?\d+)/g)].map(([, x, y]) => [+x, +y]);
  const ort = /class="lk-ort" cx="(-?\d+)" cy="(-?\d+)"/.exec(s) || /class="lk-sitz" cx="(-?\d+)" cy="(-?\d+)"/.exec(s);
  return { s, b, h, texte, punkte, ort: [+ort[1], +ort[2]] };
}
// Kiste wie die Vorlage: Schrift läuft breit (Faktor großzügig), Grundlinie y; zweizeilig eine Zeile (1,1 em) tiefer
const kiste = (t, groesse, faktor) => {
  const w = t.inhalt.length * groesse * faktor; const x1 = t.anker === 'start' ? t.x : t.anker === 'end' ? t.x - w : t.x - w / 2;
  return { x1, y1: t.y - groesse * 0.72, x2: x1 + w, y2: t.y + groesse * 0.2 + ((t.zeilen?.length || 1) - 1) * groesse * 1.1 };
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
    // Keine stummen Punkte: jeder Punkt trägt einen Namen
    assert.equal(k.punkte.length, k.texte.filter((t) => t.klasse === 'lk-name').length, `${o.slug}: Punkt ohne Namen`);
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

test('Lagekarte: Weilburg samt Name hält Abstand zur Blattkante; die nächsten Nachbarn tragen Namen', () => {
  for (const o of ORTE.filter((_, i) => i % 11 === 0).concat(ORTE.filter((x) => ['loehnberg', 'aschaffenburg', 'arnstein'].includes(x.slug)))) {
    if (o.slug === 'weilburg') continue;
    const nachbarn = (o.nachbarn || []).map((id) => NACH_ID.get(id)).filter(Boolean);
    const k = zerlegen(lagekarte({ ort: o, sitz: SITZ, nachbarn, umgebung: ORTE, praefix: 't' }));
    const q = kiste(k.texte.find((t) => t.klasse === 'lk-sitz-text'), 16, 0.6);
    // --sp-l (32) mit Toleranz für Namen, die seitlich ausweichen mussten
    assert.ok(Math.min(q.x1, q.y1, k.b - q.x2, k.h - q.y2) >= 24, `${o.slug}: „Weilburg“ an der Blattkante`);
  }
  const loe = ORTE.find((x) => x.slug === 'loehnberg');
  const namen = zerlegen(lagekarte({ ort: loe, sitz: SITZ, nachbarn: loe.nachbarn.map((id) => NACH_ID.get(id)), umgebung: ORTE, praefix: 't' }))
    .texte.filter((t) => t.klasse === 'lk-name').map((t) => t.inhalt);
  assert.ok(namen.includes('Selters'), `Löhnberg: nächster Nachbar Selters ohne Namen (${namen.join(', ')})`);
});

const karte = (slug) => {
  const o = ORTE.find((x) => x.slug === slug);
  return zerlegen(lagekarte({ ort: o, sitz: SITZ, nachbarn: (o.nachbarn || []).map((id) => NACH_ID.get(id)).filter(Boolean), umgebung: ORTE, praefix: 't' }));
};

test('Lagekarte: Ortsname mit Abstand zur Kante; lange Namen zweizeilig und ganz im Blatt', () => {
  // Bremen stand oben an der Blattkante
  const t = karte('bremen').texte.find((x) => x.klasse === 'lk-ort-text');
  assert.ok(Math.min(t.y - 18 * 0.72, kiste(t, 18, 0.6).x1, 360 - kiste(t, 18, 0.6).x2) >= 10, `Bremen: Name an der Kante (${t.x},${t.y})`);
  for (const [slug, zeilen] of [['herschbach-oberwesterwald', ['Herschbach', '(Oberwesterwald)']], ['hirschberg-an-der-bergstrasse', ['Hirschberg', 'an der Bergstraße']]]) {
    assert.deepEqual(karte(slug).texte.find((x) => x.klasse === 'lk-ort-text').zeilen, zeilen, `${slug}: nicht zweizeilig`);
  }
  // Die überlangen Namen, die bisher die Blattkante erreichten (Brandenburg an der Havel stand bei „… an der H“ ab)
  for (const slug of ['herschbach-oberwesterwald', 'hirschberg-an-der-bergstrasse', 'bad-marienberg-langenbach-bei-marienberg', 'bad-marienberg-westerwald',
    'brandenburg-an-der-havel', 'erlenbach-bei-marktheidenfeld', 'heppenheim-an-der-bergstrasse']) {
    const k = kiste(karte(slug).texte.find((x) => x.klasse === 'lk-ort-text'), 18, 0.6);
    assert.ok(k.x1 >= 0 && k.y1 >= 0 && k.x2 <= 360 && k.y2 <= 225, `${slug}: Name ragt aus dem Blatt (${k.x1.toFixed(0)}–${k.x2.toFixed(0)}, ${k.y1.toFixed(0)}–${k.y2.toFixed(0)})`);
  }
});

test('Lagekarte: Namen verteilt (kein Bündel), drei oder vier Namen; passt der Bogen ins Blatt, liegt er ganz darin', () => {
  let namen = 0; let karten = 0;
  for (const o of ORTE.filter((_, i) => i % 13 === 0).concat(ORTE.filter((x) => ['loehnberg', 'taunusstein-wehen', 'blieskastel-boeckweiler', 'bremen'].includes(x.slug)))) {
    const k = karte(o.slug);
    for (let i = 0; i < k.punkte.length; i++) {
      for (let j = i + 1; j < k.punkte.length; j++) {
        assert.ok(Math.hypot(k.punkte[i][0] - k.punkte[j][0], k.punkte[i][1] - k.punkte[j][1]) >= 40, `${o.slug}: benannte Punkte ${k.punkte[i]} und ${k.punkte[j]} gebündelt`);
      }
    }
    namen += k.punkte.length; karten++;
    const bogen = /<circle class="lk-bogen" cx="(-?\d+)" cy="(-?\d+)" r="(\d+)"/.exec(k.s);
    if (bogen) {
      const [cx, cy, rr] = [+bogen[1], +bogen[2], +bogen[3]];
      if (2 * rr <= 225 - 24) assert.ok(cx - rr >= 10 && cy - rr >= 10 && cx + rr <= 350 && cy + rr <= 215, `${o.slug}: Bogen angeschnitten, obwohl er passt (${cx},${cy} r ${rr})`);
    }
  }
  assert.ok(namen / karten >= 3, `nur ${(namen / karten).toFixed(2)} Namen je Karte`);
  // Böckweiler (Saarland) nannte Köln und Bonn abseits der Peilung: zuerst Orte am Weg
  assert.ok(!karte('blieskastel-boeckweiler').texte.some((t) => t.inhalt === 'Köln'), 'Böckweiler nennt Köln');
});

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

// Gezeichnete Ringpunkte (je Grad): ganzer Kreis oder Bögen mit Lücken, die Bögen im Uhrzeigersinn (Flag 1)
function ringPunkte(s, [cx, cy]) {
  const kreis = (rr, von, bis) => Array.from({ length: Math.ceil(bis - von) + 1 }, (_, i) => Math.min(von + i, bis))
    .map((g) => [cx + rr * Math.cos((g * Math.PI) / 180), cy + rr * Math.sin((g * Math.PI) / 180)]);
  const winkel = (x, y) => (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
  return [...s.matchAll(/<(?:circle|path) class="gk-ring" (?:cx="-?\d+" cy="-?\d+" r="(\d+)"|d="([^"]+)")/g)].flatMap(([, rr, d]) => (rr ? kreis(+rr, 0, 359)
    : [...d.matchAll(/M(-?\d+) (-?\d+)A(\d+) \d+ 0 [01] 1 (-?\d+) (-?\d+)/g)].flatMap(([, x0, y0, r0, x1, y1]) => {
      const a = winkel(+x0, +y0); let b = winkel(+x1, +y1);
      while (b < a) b += 360;
      return kreis(+r0, a + 1, b - 1);
    })));
}

// Hubs wie hub.mjs: je Land und je Kreis (Stadtstaaten nur als Land)
const HUBS = new Map();
for (const o of ORTE) {
  for (const k of [o.landSlug, o.kreisSlug && o.kreisSlug !== o.landSlug ? `${o.landSlug}/${o.kreisSlug}` : null].filter(Boolean)) {
    if (!HUBS.has(k)) HUBS.set(k, []);
    HUBS.get(k).push(o);
  }
}
const lage = (hub) => String(gebietslage({ orte: HUBS.get(hub), sitz: SITZ, titel: 'Test' }).svg);

test('Gebietslage: Namen und Ringbeschriftungen liegen weder auf Rasterpunkten noch auf Ringen; Führungslinien 0°/45°/90°', () => {
  const gebiete = ['hessen', 'nordrhein-westfalen', 'hessen/limburg-weilburg', 'hessen/lahn-dill-kreis', 'rheinland-pfalz/westerwaldkreis', 'hessen/wetteraukreis',
    'hessen/rheingau-taunus-kreis', 'hessen/marburg-biedenkopf', 'hessen/hochtaunuskreis', 'rheinland-pfalz', 'bayern/aschaffenburg'];
  // Mobile und breite Schriftgröße (gebiet.css): Namen 18/15, Ringe 18/16, Weilburg 24/18 Einheiten
  const LAGEN = [['schmal', { 'gk-name': 18, 'gk-ring-text': 18, 'gk-sitz-name': 24 }], ['breit', { 'gk-name': 15, 'gk-ring-text': 16, 'gk-sitz-name': 18 }]];
  for (const name of gebiete) {
    const s = lage(name);
    const punkte = [...s.matchAll(/<path class="gk-raster ([^"]*)" d="([^"]+)"/g)]
      .flatMap(([, klasse, d]) => [...d.matchAll(/M(-?\d+) (-?\d+)/g)].map(([, x, y]) => ({ x: +x, y: +y, nurBreit: klasse.includes('gl-nur-breit'), nurSchmal: klasse.includes('gl-nur-schmal') })));
    const sitz = /class="gk-sitz-punkt" cx="(-?\d+)" cy="(-?\d+)"/.exec(s);
    const ring = sitz ? ringPunkte(s, [+sitz[1], +sitz[2]]) : [];
    const texte = texteVon(s).filter((t) => t.klasse.startsWith('gk-'));
    assert.ok(texte.some((t) => t.klasse === 'gk-name'), `${name}: kein Ortsname`);
    for (const t of texte) {
      for (const [lage, groesse] of LAGEN) {
        if (lage === 'schmal' && t.rang2) continue; // Nebennamen entfallen mobil
        const k = kiste(t, groesse[t.klasse], t.klasse === 'gk-sitz-name' ? 0.58 : 0.55);
        const darunter = punkte.filter((q) => (lage === 'breit' ? !q.nurSchmal : !q.nurBreit) && q.x > k.x1 && q.x < k.x2 && q.y > k.y1 && q.y < k.y2);
        assert.equal(darunter.length, 0, `${name}: „${t.inhalt}“ (${lage}) auf ${darunter.length} Rasterpunkten`);
        // Kreuzt ein Name einen Ring (Weilburg, ein Hauptname ohne andere Stelle), setzt der Ring dort aus
        const auf = ring.filter(([x, y]) => x > k.x1 + 1 && x < k.x2 - 1 && y > k.y1 + 1 && y < k.y2 - 1);
        assert.equal(auf.length, 0, `${name}: Ring durch „${t.inhalt}“ (${lage})`);
      }
    }
    // Führungslinien (K-008): Stücke nur 0°, 45° oder 90°, höchstens ein Knick, das letzte waagerecht oder senkrecht
    // und am Namen; keine kreuzt Schrift oder liegt auf einem Rasterpunkt (die Punkte darunter sind ausgespart)
    for (const [, zusatz, d] of s.matchAll(/class="gl-fuehrung"([^>]*)d="([^"]+)"/g)) {
      // Linien der Nebennamen stehen nur breit; die Punkte, die nur schmal stehen, liegen unter ihnen
      const sichtbar = punkte.filter((q) => !(zusatz.includes('data-rang="2"') && q.nurSchmal));
      assert.match(d, /^M-?\d+ -?\d+(L-?\d+ -?\d+){1,2}$/, `${name}: Führungslinie ${d} mit mehr als einem Knick`);
      const pkt = zahlen(d.replace(/[ML]/g, ' '));
      const stuecke = Array.from({ length: pkt.length / 2 - 1 }, (_, i) => pkt.slice(i * 2, i * 2 + 4));
      const [ex1, ey1, ex, ey] = stuecke.at(-1);
      assert.ok(ex1 === ex || ey1 === ey, `${name}: Führungslinie ${d} endet schräg`);
      assert.ok(texte.some((t) => t.klasse === 'gk-name' && (() => {
        const k = kiste(t, 15, 0.55);
        return Math.hypot(Math.max(k.x1 - ex, 0, ex - k.x2), Math.max(k.y1 - ey, 0, ey - k.y2)) <= 8;
      })()), `${name}: Führungslinie ${d} endet ohne Namen`);
      for (const [x1, y1, x2, y2] of stuecke) {
        const [dx, dy] = [Math.abs(x2 - x1), Math.abs(y2 - y1)];
        assert.ok(dx === 0 || dy === 0 || Math.abs(dx - dy) <= 1, `${name}: Führungslinie ${d} schräg, aber nicht 45°`);
        for (let i = 0; i <= 10; i++) {
          const [x, y] = [x1 + ((x2 - x1) * i) / 10, y1 + ((y2 - y1) * i) / 10];
          for (const t of texte) {
            const k = kiste(t, 15, 0.55);
            assert.ok(!(x > k.x1 + 2 && x < k.x2 - 2 && y > k.y1 + 2 && y < k.y2 - 2), `${name}: Führungslinie durch „${t.inhalt}“`);
          }
          for (const q of sichtbar) assert.ok(Math.hypot(q.x - x, q.y - y) >= 3, `${name}: Führungslinie ${d} über dem Rasterpunkt ${q.x},${q.y}`);
        }
      }
    }
  }
});

test('Gebietslage: die größten Orte tragen Namen, auch im dichten Raster; kein Hub ohne Namen', () => {
  const namen = (hub) => texteVon(lage(hub)).filter((t) => t.klasse === 'gk-name').map((t) => t.zeilen.join(' '));
  // Stadt-Hubs mit einem Ort benennen ihn (Kempten stand nur als Punkt da)
  for (const [hub, ort] of [['bayern/kempten', 'Kempten (Allgäu)'], ['brandenburg/brandenburg-an-der-havel', 'Brandenburg an der Havel'], ['rheinland-pfalz/ludwigshafen-am-rhein', 'Ludwigshafen am Rhein']]) {
    assert.ok(namen(hub).includes(ort), `${hub}: ${ort} ohne Namen (${namen(hub).join(', ')})`);
  }
  assert.ok(namen('hessen').some((n) => ['Frankfurt am Main', 'Darmstadt', 'Wiesbaden'].includes(n)), `Hessen ohne Großstadt: ${namen('hessen').join(', ')}`);
  assert.ok(namen('nordrhein-westfalen').includes('Köln'), `NRW ohne Köln: ${namen('nordrhein-westfalen').join(', ')}`);
  for (const [hub, ort] of [['hessen/giessen', 'Gießen'], ['hessen/limburg-weilburg', 'Limburg an der Lahn']]) assert.ok(namen(hub).includes(ort), `${hub}: Kreisstadt ${ort} fehlt`);
  // Über alle Hubs nicht weniger Namen als vor der Umstellung auf Führungslinien (714)
  let summe = 0;
  for (const hub of HUBS.keys()) {
    const n = namen(hub).length;
    assert.ok(n > 0, `${hub}: kein Name`);
    summe += n;
  }
  assert.ok(summe >= 714, `nur ${summe} Namen über alle Hubs`);
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

// Seiten aus den Vorlagen (wie preise.test.mjs): A–Z-Sprungziele und die Umgebung der Ortsseite
const ALLE = JSON.parse(readFileSync(new URL('../src/daten/orte.json', import.meta.url), 'utf8'));
const kontext = () => ({ basisUrl: 'http://127.0.0.1:4173', konfig: { betrieb, preise, zonen }, daten: { orte: ALLE }, assets: { daten: {} }, icons: new Set(), icon: () => '', wurzel: new URL('..', import.meta.url).pathname });

test('A–Z: Jeder Link der Buchstabenleiste springt zum Kopf seiner Gruppe, nicht zur Gruppe (Spaltenumbruch)', async () => {
  await iconsLaden(new URL('..', import.meta.url).pathname);
  const k = kontext();
  const seite = hubSeiten(k).find((s) => s.pfad === '/einsatzgebiet/hessen/limburg-weilburg/');
  const h = String(seite.inhalt(k));
  const ziele = [...h.matchAll(/<li><a href="#(buchstabe-[a-z])">/g)].map((m) => m[1]);
  assert.ok(ziele.length >= 8, `nur ${ziele.length} Buchstaben`);
  for (const id of ziele) assert.match(h, new RegExp(`<div class="az-kopf" id="${id}">`), `#${id} ist kein .az-kopf`);
  assert.doesNotMatch(h, /<section class="az-gruppe" id=/);
});

test('Ortsseite: „Orte in der Nähe“ hat mindestens sechs Einträge, keiner steht links schon; lange linke Liste 8/4', async () => {
  await iconsLaden(new URL('..', import.meta.url).pathname);
  const k = kontext();
  hubVorbereiten(k);
  const orte = await ortSeiten(k);
  const umgebung = (pfad) => {
    const h = String(orte.find((s) => s.pfad === pfad).inhalt(k));
    const teil = /<div class="ort-umgebung([^"]*)">([\s\S]*?)<\/div><\/div>\s*<\/section>/.exec(h);
    const nah = /<ul class="ort-liste ort-liste-km">(.*?)<\/ul>/.exec(teil[2])[1];
    const links = /<ul class="ort-liste(?: ort-liste-kurz)?">(.*?)<\/ul>/.exec(teil[2])?.[1] || '';
    const hrefs = (s) => [...s.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    return { art: teil[1], nah: hrefs(nah), links: hrefs(links) };
  };
  for (const pfad of ['/schluesseldienst-weilburg/', '/schluesseldienst-loehnberg/', '/schluesseldienst-asslar-berghausen/', '/schluesseldienst-almelo/', '/schluesseldienst-bremen/']) {
    const u = umgebung(pfad);
    assert.ok(u.nah.length >= 6, `${pfad}: nur ${u.nah.length} Orte in der Nähe`);
    assert.ok(!u.nah.some((x) => u.links.includes(x) || x === pfad), `${pfad}: Ort doppelt`);
  }
  assert.equal(umgebung('/schluesseldienst-weilburg/').art, ' ort-umgebung-links');
  assert.equal(umgebung('/schluesseldienst-loehnberg/').art, ' ort-umgebung-kurz');
});
