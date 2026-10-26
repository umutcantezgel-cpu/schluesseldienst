// Auswahl der Ortsseiten-Stichprobe: je Zone gleichmäßig über die nach id sortierte Liste verteilt.
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
const orte = JSON.parse(readFileSync('/home/user/schluesseldienst/src/daten/orte.json', 'utf8'));
const DIST = '/home/user/schluesseldienst/.cache/e5-abschluss/dist';
const zahl = { A: 5, B: 5, C: 4, D: 3, NL: 3 };
const zonen = {};
for (const o of orte) (zonen[o.zone] ||= []).push(o);
const zaehl = Object.fromEntries(Object.entries(zonen).map(([z, l]) => [z, l.length]));
const gewaehlt = [];
for (const [zone, n] of Object.entries(zahl)) {
  const liste = [...zonen[zone]].sort((a, b) => a.id.localeCompare(b.id));
  const schritt = liste.length / n;
  for (let i = 0; i < n; i++) {
    const o = liste[Math.floor(i * schritt + schritt / 2)];
    gewaehlt.push({ zone, id: o.id, name: o.name, slug: o.slug, typ: o.typ, staat: o.staat, land: o.land, pfad: `/schluesseldienst-${o.slug}/`, existiert: existsSync(`${DIST}/schluesseldienst-${o.slug}/index.html`) });
  }
}
console.log('Zonen-Zaehlung:', JSON.stringify(zaehl));
console.log(JSON.stringify(gewaehlt, null, 1));
writeFileSync('/home/user/schluesseldienst/.cache/e5-abschluss/pruefer-z07-z09/stichprobe-orte.json', JSON.stringify(gewaehlt, null, 2) + '\n');
