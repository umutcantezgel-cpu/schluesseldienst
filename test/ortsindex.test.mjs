// Ortssuche (Name, Wortanfang, PLZ) mit den echten Daten aus src/daten.
// Die Indizes entstehen wie im Bau (datenIndizes), damit die Tests genau das Browser-Format prüfen.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { slugAbleiten, indexAufbauen, plzDekodieren, suchen, RICHTUNGEN } from '../src/assets/js/logik/ortsindex.mjs';
import { datenIndizes } from '../bau/lib/datenindex.mjs';

const daten = {
  orte: JSON.parse(await readFile(new URL('../src/daten/orte.json', import.meta.url), 'utf8')),
  plz: JSON.parse(await readFile(new URL('../src/daten/plz.json', import.meta.url), 'utf8')),
};
const geschrieben = {};
const erg = await datenIndizes(daten, { async schreibe(pfad, buf) { geschrieben[pfad] = buf; } });
const kompakt = JSON.parse(geschrieben[erg.orte.pfad].toString('utf8'));
const plzText = JSON.parse(geschrieben[erg.plz.pfad].toString('utf8')).p;
const index = indexAufbauen(kompakt);
const karte = plzDekodieren(plzText);
const nachSlug = new Map(daten.orte.map((o) => [o.slug, o]));

const suche = (anfrage, max) => suchen(index, karte, anfrage, max);
const ersterTreffer = (anfrage) => suche(anfrage).treffer[0];

describe('Namenssuche', () => {
  test('„weilb“ findet Weilburg als ersten Treffer (Zone A)', () => {
    const t = ersterTreffer('weilb');
    assert.equal(t.name, 'Weilburg');
    assert.equal(t.zone, 'A');
  });

  test('„bad hom“ findet Bad Homburg vor der Höhe als ersten Treffer', () => {
    assert.equal(ersterTreffer('bad hom').name, 'Bad Homburg vor der Höhe');
  });

  test('Umlaut und ß: gießen, giessen, GIESSEN und Gießen liefern denselben ersten Treffer', () => {
    const ergebnisse = ['gießen', 'giessen', 'GIESSEN', 'Gießen'].map((a) => suche(a));
    for (const r of ergebnisse) {
      assert.equal(r.treffer[0].name, 'Gießen');
      assert.equal(r.gesamt, ergebnisse[0].gesamt);
    }
  });

  test('Umlaut ohne Umlaut-Schreibweise: Mücke, Muecke und mucke finden denselben Ort', () => {
    for (const a of ['Mücke', 'Muecke', 'mucke']) assert.equal(ersterTreffer(a).name, 'Mücke', a);
  });

  test('Wortanfang im Inneren: „homburg“ findet Bad Homburg, exakter Name vorn', () => {
    const r = suche('homburg');
    const bad = r.treffer.find((t) => t.name === 'Bad Homburg vor der Höhe');
    assert.ok(bad, 'Bad Homburg fehlt in den Treffern');
    assert.equal(r.treffer[0].name, 'Homburg');
    assert.equal(r.treffer[0].rang, 0);
    assert.equal(bad.rang, 2);
  });

  test('Rangfolge ist nicht fallend: exakt (0) vor Präfix (1) vor Wortanfang (2)', () => {
    for (const a of ['bad', 'ber', 'homburg', 'weil', 'gie']) {
      const rangs = suche(a, 50).treffer.map((t) => t.rang);
      assert.deepEqual([...rangs].sort((x, y) => x - y), rangs, a);
    }
  });

  test('max begrenzt die Trefferzahl; gesamt zählt alle Treffer', () => {
    const r = suche('ber', 3);
    assert.equal(r.treffer.length, 3);
    assert.ok(r.gesamt > 3);
  });

  test('Standard-Maximum ist 8 Treffer', () => {
    const r = suche('ber');
    assert.equal(r.treffer.length, 8);
    assert.ok(r.gesamt > 8);
  });
});

describe('Grenzfälle der Eingabe', () => {
  for (const leer of ['', '   ', '\t\n']) {
    test(`leere Anfrage „${leer.replace(/\s/g, '·')}“ liefert keine Treffer`, () => {
      assert.deepEqual(suche(leer), { treffer: [], gesamt: 0 });
    });
  }

  test('ein einzelnes Zeichen liefert keine Treffer (Mindestlänge 2)', () => {
    assert.equal(suche('a').gesamt, 0);
  });

  test('200 Zeichen ohne Ortsbezug: keine Ausnahme, keine Treffer', () => {
    assert.equal(suche('x'.repeat(200)).gesamt, 0);
  });

  test('200 Zeichen mit Ortsnamen-Wiederholung: keine Ausnahme', () => {
    const r = suche('Bad Homburg '.repeat(20));
    assert.ok(Array.isArray(r.treffer));
  });

  test('<script> wird als Text behandelt und liefert nur Treffer mit „script“', () => {
    const r = suche('<script>alert(1)</script>');
    for (const t of r.treffer) assert.ok(t.key.includes('script'), t.key);
  });

  test('Pfadausbruch „../“ und „../../etc/passwd“: keine Treffer, keine Ausnahme', () => {
    assert.equal(suche('../').gesamt, 0);
    assert.equal(suche('../../etc/passwd').gesamt, 0);
  });

  test('Emoji: keine Treffer ohne Ortsbezug, sinnvoller Treffer mit Ortsname', () => {
    assert.equal(suche('🔑').gesamt, 0);
    assert.equal(suche('🔑🔑🔑').gesamt, 0);
    assert.equal(ersterTreffer('Weilburg🔑').name, 'Weilburg');
  });

  test('Steuerzeichen, NUL und SQL-artige Eingabe: keine Ausnahme', () => {
    for (const a of ['\u0000weilb', '%00', "'; DROP TABLE orte;--", '\\\\server\\share']) {
      assert.ok(Array.isArray(suche(a).treffer), a);
    }
  });
});

describe('PLZ-Suche', () => {
  test('„35781“ findet Weilburg in Zone A', () => {
    const t = ersterTreffer('35781');
    assert.equal(t.name, 'Weilburg');
    assert.equal(t.zone, 'A');
    assert.equal(t.plz, '35781');
  });

  test('unvollständige PLZ „357“: nur PLZ mit diesem Präfix, aufsteigend, Gesamtzahl aus plz.json', () => {
    const r = suche('357');
    const erwartet = daten.plz.filter((p) => p.plz.startsWith('357')).length;
    assert.equal(r.gesamt, erwartet);
    assert.ok(r.treffer.length > 0);
    for (const t of r.treffer) assert.ok(t.plz.startsWith('357'), t.plz);
    const plzListe = r.treffer.map((t) => t.plz);
    assert.deepEqual([...plzListe].sort(), plzListe);
  });

  test('Präfix mit führender Null „0105“ liefert PLZ 0105x mit Null vorn', () => {
    const r = suche('0105');
    assert.ok(r.treffer.length > 0);
    for (const t of r.treffer) assert.match(t.plz, /^0105\d$/);
  });

  test('PLZ 01053 ist exakt dekodiert (führende Null bleibt erhalten)', () => {
    assert.ok(karte['01053'], 'PLZ 01053 fehlt');
    assert.equal(suche('01053').treffer[0].plz, '01053');
  });

  test('PLZ ohne Ortsbezug zeigt „PLZ …“ statt eines Ortsnamens', () => {
    const t = suche('35779').treffer[0];
    assert.equal(t.plz, '35779');
    assert.equal(t.name, 'PLZ 35779');
    assert.equal(t.slug, null);
  });

  test('Zu lange PLZ „357810“ und einzelne Ziffer „3“ liefern keine Treffer', () => {
    assert.equal(suche('357810').gesamt, 0);
    assert.equal(suche('3').gesamt, 0);
  });

  test('jeder Eintrag aus plz.json ist im Dekodat mit gleicher km und Zone enthalten', () => {
    assert.equal(Object.keys(karte).length, daten.plz.length);
    for (const p of daten.plz) {
      const k = karte[p.plz];
      assert.ok(k, p.plz);
      assert.equal(k.km, p.km, p.plz);
      assert.equal(k.zone, p.zone, p.plz);
    }
  });

  test('PLZ mit Ortsbezug zeigt auf den Ort mit gleichem Slug', () => {
    for (const p of daten.plz) {
      if (!p.slug || !nachSlug.has(p.slug)) continue;
      const z = karte[p.plz].zeile;
      assert.ok(z >= 0, p.plz);
      assert.equal(index[z].slug, p.slug, p.plz);
    }
  });
});

describe('plzDekodieren: Format', () => {
  test('alle dekodierten PLZ sind 5-stellig, Zone A–D oder NL, Zeile im Index', () => {
    for (const [code, k] of Object.entries(karte)) {
      assert.match(code, /^\d{5}$/);
      assert.ok(['A', 'B', 'C', 'D', 'NL'].includes(k.zone), `${code}: ${k.zone}`);
      assert.ok(k.zeile === -1 || (Number.isInteger(k.zeile) && k.zeile >= 0 && k.zeile < index.length), `${code}: ${k.zeile}`);
    }
  });

  test('Delta-Kodierung: „35781,0A,0;1,3B“ ergibt 35781 und 35782', () => {
    assert.deepEqual(plzDekodieren('35781,0A,0;1,3B'), {
      '35781': { km: 0, zone: 'A', zeile: 0 },
      '35782': { km: 3, zone: 'B', zeile: -1 },
    });
  });

  test('ungültige Teile werden übersprungen, gültige bleiben erhalten', () => {
    assert.deepEqual(Object.keys(plzDekodieren('xx;35781,0A,0;zz;1,3Q')), ['35781']);
  });

  test('NL-PLZ bleibt vierstellig (1431 statt 01431)', { todo: 'Padding auf 5 Stellen macht NL-PLZ zu DE-ähnlichen Codes; NL-PLZ fehlen zudem in plz.json (OFFENE FRAGE)' }, () => {
    assert.ok(plzDekodieren('1431,313NL')['1431'], 'erwartet Schlüssel „1431“');
  });
});

describe('slugAbleiten', () => {
  test('Gemeinde: Slug aus dem Namen', () => {
    assert.equal(slugAbleiten('Bad Homburg vor der Höhe', 'Bad Homburg vor der Höhe', false), 'bad-homburg-vor-der-hoehe');
  });

  test('Ortsteil: Gemeindename wird vorangestellt', () => {
    assert.equal(slugAbleiten('Dornholzhausen', 'Bad Homburg vor der Höhe', true), 'bad-homburg-dornholzhausen');
  });

  test('Ortsteil mit gleichem Namen wie die Gemeinde: keine Doppelung', () => {
    assert.equal(slugAbleiten('Bad Homburg', 'Bad Homburg', true), 'bad-homburg');
  });

  test('Stichprobe: 50 feste Orte (jeder 105. Eintrag in Dateireihenfolge) stimmen mit dem gespeicherten Slug überein', () => {
    const schritt = Math.floor(daten.orte.length / 50);
    const stichprobe = Array.from({ length: 50 }, (_, i) => daten.orte[i * schritt]);
    assert.equal(stichprobe.length, 50);
    for (const o of stichprobe) {
      assert.equal(slugAbleiten(o.name, o.gemeinde, o.typ === 'ortsteil'), o.slug, o.name);
    }
  });

  test('alle Abweichungen vom abgeleiteten Slug sind reine Anhänge (gleichnamige Orte), sonst nichts', () => {
    for (const o of daten.orte) {
      const abgeleitet = slugAbleiten(o.name, o.gemeinde, o.typ === 'ortsteil');
      if (abgeleitet !== o.slug) assert.ok(o.slug.startsWith(abgeleitet + '-'), `${o.name}: ${o.slug} ≠ ${abgeleitet}`);
    }
  });
});

describe('Browser-Index', () => {
  test('Name, Zone, km, Richtung und Slug stimmen für jeden Ort mit orte.json überein', () => {
    assert.equal(index.length, daten.orte.length);
    assert.equal(new Set(index.map((e) => e.slug)).size, index.length);
    for (const e of index) {
      const o = nachSlug.get(e.slug);
      assert.ok(o, e.slug);
      assert.equal(e.name, o.name, e.slug);
      assert.equal(e.zone, o.zone, e.slug);
      assert.equal(e.km, o.km, e.slug);
      assert.equal(e.richtung, o.richtung ?? null, e.slug);
    }
  });

  test('alle Richtungen aus orte.json stehen in RICHTUNGEN', () => {
    for (const o of daten.orte) {
      if (o.richtung !== null) assert.ok(RICHTUNGEN.includes(o.richtung), o.richtung);
    }
  });
});
