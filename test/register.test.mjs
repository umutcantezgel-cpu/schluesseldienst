// Register: Routen, Themenpässe, Faktenblätter und Quellenabdeckung passen zueinander.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ROUTEN, RATGEBER, MUSTER, istGeplant, kette, route } from '../src/konfig/routen.mjs';
import { PAESSE, MUSTER_PAESSE, FAKTENBLAETTER } from '../src/konfig/themenpaesse.mjs';
import { ALLE_LEISTUNGEN, GRUPPEN } from '../src/konfig/leistungen.mjs';
import { HAUPT, FUSS } from '../src/konfig/navigation.mjs';
import start from '../src/inhalte/start.mjs';

const orte = JSON.parse(readFileSync(new URL('../src/daten/orte.json', import.meta.url), 'utf8'));
const slugs = new Set(orte.map((o) => o.slug).filter(Boolean));
const abdeckung = JSON.parse(readFileSync(new URL('../src/daten/quellen-abdeckung.json', import.meta.url), 'utf8'));
const istZiel = (p) => istGeplant(p, { slugs });

test('Routen: eindeutig, gültige Pfade, Eltern existieren', () => {
  const pfade = ROUTEN.map((r) => r.pfad);
  assert.equal(new Set(pfade).size, pfade.length);
  for (const r of ROUTEN) {
    assert.match(r.pfad, /^\/([a-z0-9-]+\/)*$|^\/404\.html$/, r.pfad);
    if (r.eltern) assert.ok(route(r.eltern), `Eltern fehlen: ${r.pfad} → ${r.eltern}`);
    assert.match(r.ansicht, /^V(0[1-9]|1[0-2])$/);
  }
  for (const l of ALLE_LEISTUNGEN) assert.ok(route(l.pfad), l.pfad);
  for (const g of GRUPPEN) assert.ok(route(g.pfad), g.pfad);
  assert.equal(RATGEBER.length, 19);
  assert.deepEqual(kette('/notoeffnung/tueroeffnung/'), ['/notoeffnung/', '/notoeffnung/tueroeffnung/']);
  assert.deepEqual(kette('/'), []);
});

test('Navigation zeigt nur registrierte Routen', () => {
  const links = [...HAUPT.flatMap((h) => [h.pfad, ...(h.untermenue || []).flatMap((u) => [u.pfad, ...u.kinder.map((k) => k.pfad)])]), ...Object.values(FUSS).flat().map((f) => f.pfad)];
  for (const p of links) assert.ok(route(p), p);
});

test('Muster-Routen: geplant nur mit passenden Daten', () => {
  assert.equal(MUSTER.length, 3);
  assert.ok(slugs.has('weilburg'), 'Weilburg braucht den Slug „weilburg“');
  assert.equal(istZiel('/schluesseldienst-weilburg/'), true);
  assert.equal(istZiel('/schluesseldienst-gibt-es-nicht-xyz/'), false);
  assert.equal(istZiel('/einsatzgebiet/hessen/'), true);
  assert.equal(istZiel('/tippfehler/'), false);
  assert.equal(istZiel('/notoeffnung/tueroeffnung'), false);
});

test('Themenpässe: jede Inhaltsroute hat einen Pass, jeder Pass eine Route', () => {
  for (const r of ROUTEN) if (r.pfad !== '/404.html') assert.ok(PAESSE[r.pfad], `Pass fehlt: ${r.pfad}`);
  for (const p of Object.keys(PAESSE)) assert.ok(route(p), `Pass ohne Route: ${p}`);
});

test('Themenpässe: Suchbegriffe eindeutig und klein geschrieben', () => {
  const gesehen = new Map();
  const alle = [...Object.entries(PAESSE), ...Object.entries(MUSTER_PAESSE)];
  for (const [pfad, pass] of alle) {
    for (const k of [pass.keyword, ...pass.neben].filter(Boolean)) {
      assert.equal(k, k.toLowerCase(), `${pfad}: ${k}`);
      assert.ok(!gesehen.has(k), `Suchbegriff doppelt: „${k}“ (${gesehen.get(k)} und ${pfad})`);
      gesehen.set(k, pfad);
    }
  }
});

test('Themenpässe: FAQ-Fragen seitenweit eindeutig (inkl. Startseite)', () => {
  const gesehen = new Map(start.faq.fragen.map((f) => [f.frage, '/']));
  for (const [pfad, pass] of Object.entries(PAESSE)) {
    for (const f of pass.fragen) {
      assert.match(f, /\?$/, `${pfad}: Frage ohne Fragezeichen: ${f}`);
      assert.ok(!gesehen.has(f), `Frage doppelt: „${f}“ (${gesehen.get(f)} und ${pfad})`);
      gesehen.set(f, pfad);
    }
  }
});

test('Themenpässe: Faktenblätter vorhanden und genutzt', () => {
  const genutzt = new Set();
  for (const [pfad, pass] of [...Object.entries(PAESSE), ...Object.entries(MUSTER_PAESSE)]) {
    for (const id of pass.fakten) {
      assert.ok(FAKTENBLAETTER[id], `${pfad}: Faktenblatt fehlt: ${id}`);
      genutzt.add(id);
    }
  }
  for (const [id, b] of Object.entries(FAKTENBLAETTER)) {
    assert.ok(genutzt.has(id), `Faktenblatt ungenutzt: ${id}`);
    assert.match(id, /^[a-z0-9-]+$/);
    assert.match(b.paket, /^E4-KUND-0[345]$/);
    assert.ok(b.frage.endsWith('?') && b.quelle, id);
  }
});

test('Themenpässe: Verweise zeigen auf geplante Seiten, Inhaltsseiten haben ≥ 3 Kontextlinks', () => {
  for (const [pfad, pass] of Object.entries(PAESSE)) {
    for (const v of pass.verwandt) {
      assert.ok(istZiel(v), `${pfad}: verwandt unbekannt: ${v}`);
      assert.notEqual(v, pfad, `${pfad}: verlinkt sich selbst`);
    }
    for (const a of pass.abgrenzung) if (a.pfad) assert.ok(istZiel(a.pfad), `${pfad}: Abgrenzung unbekannt: ${a.pfad}`);
    if (pass.keyword) assert.ok(pass.verwandt.length >= 3, `${pfad}: nur ${pass.verwandt.length} Kontextlinks`);
  }
});

test('Quellenabdeckung: jede Kern-URL hat Ziel oder Grund', () => {
  assert.equal(abdeckung.R.length, 48);
  assert.equal(abdeckung.A.length, 18);
  const ziele = new Set();
  for (const e of [...abdeckung.R, ...abdeckung.A]) {
    if (e.ziel === null) assert.ok(e.grund && e.grund.length > 10, `${e.quelle}: Grund fehlt`);
    else { assert.ok(route(e.ziel), `${e.quelle}: Ziel unbekannt: ${e.ziel}`); ziele.add(e.ziel); }
  }
  for (const m of Object.values(abdeckung.muster)) assert.ok(MUSTER.some((x) => x.name === m), m);
  assert.ok(ziele.size >= 40, `nur ${ziele.size} verschiedene Ziele`);
});
