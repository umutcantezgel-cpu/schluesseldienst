// Routenregister: jede geplante Seite der Website mit Ansicht, Eltern (Brotkrumen), Sitemap-Gruppe und
// verantwortlichem Paket. Der Build unterscheidet damit „noch nicht gebaut“ (geplant) von Tippfehlern
// (unbekannt); im Release muss jede Route gebaut sein, außer sie ist an eine Bedingung geknüpft.
// Muster-Routen (Ortsseiten, Hubs) stehen in MUSTER und werden gegen die Daten geprüft.
import { GRUPPEN } from './leistungen.mjs';

// Ratgeber-Artikel in der Reihenfolge der Übersicht (Themenpässe in themenpaesse.mjs).
export const RATGEBER = [
  'ausgesperrt-was-tun', 'tuer-zugefallen-oder-abgeschlossen', 'schluesseldienst-abzocke-erkennen', 'schluesseldienst-kosten',
  'schluessel-verloren', 'schluessel-im-auto', 'schliesszylinder-wechseln', 'einbruchschutz-wohnung', 'einbruchschutz-haus',
  'haustuer-sicherheitscheck', 'nach-einbruch-was-tun', 'schadensbilder', 'rc-widerstandsklassen', 'foerderung-einbruchschutz',
  'rauchmelderpflicht', 'tresor-kaufen-widerstandsgrade', 'waffenschrank-vorschriften', 'elektronische-schliessanlagen',
  'alarmanlage-planen',
];

const r = (pfad, ansicht, titel, eltern, sitemap, paket, extra = {}) => ({ pfad, ansicht, titel, eltern, sitemap, paket, ...extra });

export const ROUTEN = [
  r('/', 'V01', 'Startseite', null, 'seiten', 'E2-OPUS-06'),
  ...GRUPPEN.flatMap((g, gi) => [
    r(g.pfad, 'V02', g.titel, '/', 'leistungen', gi === 0 ? 'E3-OPUS-02' : `E3-BAU-0${gi}`),
    ...g.leistungen.map((l) => r(l.pfad, 'V03', l.titel, g.pfad, 'leistungen', l.id === 'tueroeffnung' ? 'E3-OPUS-03' : 'E3-BAU-04…11')),
  ]),
  r('/leistungen/', 'V11', 'Alle Leistungen', '/', 'leistungen', 'E4-BAU-21'),
  r('/preise/', 'V04', 'Preise', '/', 'seiten', 'E4-OPUS-01'),
  r('/einsatzgebiet/', 'V05', 'Einsatzgebiet', '/', 'hubs', 'E4-OPUS-03'),
  r('/ratgeber/', 'V08', 'Ratgeber', '/', 'ratgeber', 'E4-OPUS-04'),
  ...RATGEBER.map((id) => r(`/ratgeber/${id}/`, 'V08', null, '/ratgeber/', 'ratgeber', id === 'schluesseldienst-abzocke-erkennen' ? 'E4-OPUS-04' : 'E4-BAU-13…18')),
  r('/ueber-uns/', 'V09', 'Über uns', '/', 'seiten', 'E4-BAU-19'),
  r('/karriere/', 'V09', 'Karriere', '/ueber-uns/', 'seiten', 'E4-BAU-19', { bedingung: 'stellen' }),
  r('/kontakt/', 'V10', 'Kontakt', '/', 'seiten', 'E4-OPUS-02'),
  r('/suche/', 'V11', 'Suche', '/', null, 'E4-BAU-21', { indexierbar: false }),
  r('/sitemap/', 'V11', 'Sitemap', '/', 'seiten', 'E4-BAU-21'),
  r('/impressum/', 'V12', 'Impressum', '/', 'seiten', 'E4-BAU-20'),
  r('/datenschutz/', 'V12', 'Datenschutz', '/', 'seiten', 'E4-BAU-20'),
  r('/widerruf/', 'V12', 'Widerruf', '/', 'seiten', 'E4-BAU-20'),
  r('/barrierefreiheit/', 'V12', 'Barrierefreiheit', '/', 'seiten', 'E4-BAU-20'),
  r('/quellen-lizenzen/', 'V12', 'Quellen & Lizenzen', '/', 'seiten', 'E4-BAU-20'),
  r('/404.html', 'V12', 'Seite nicht gefunden', null, null, 'E4-BAU-21', { indexierbar: false }),
];

// Muster-Routen: gelten als geplant, wenn die Daten den Slug kennen.
export const MUSTER = [
  { name: 'ortsseite', re: /^\/schluesseldienst-([a-z0-9-]+)\/$/, ansicht: 'V07', paket: 'E3-OPUS-04', eltern: 'kreis-hub' },
  { name: 'land-hub', re: /^\/einsatzgebiet\/([a-z0-9-]+)\/$/, ansicht: 'V06', paket: 'E3-BAU-12', eltern: '/einsatzgebiet/' },
  { name: 'kreis-hub', re: /^\/einsatzgebiet\/([a-z0-9-]+)\/([a-z0-9-]+)\/$/, ansicht: 'V06', paket: 'E3-BAU-12', eltern: 'land-hub' },
];

const NACH_PFAD = new Map(ROUTEN.map((x) => [x.pfad, x]));
export const route = (pfad) => NACH_PFAD.get(pfad) || null;

/**
 * Ist der Pfad eine geplante Route? Feste Routen direkt, Muster-Routen nur mit passendem Datensatz.
 * slugs: Set der Ortsslugs; hubs: Set der Hub-Pfade (aus den Daten abgeleitet, optional).
 */
export function istGeplant(pfad, { slugs = null, hubs = null } = {}) {
  if (NACH_PFAD.has(pfad)) return true;
  const [ort, land, kreis] = MUSTER;
  const o = pfad.match(ort.re);
  if (o) return slugs ? slugs.has(o[1]) : true;
  if (land.re.test(pfad) || kreis.re.test(pfad)) return hubs ? hubs.has(pfad) : true;
  return false;
}

/** Brotkrumen-Kette fester Routen (ohne Startseite), z. B. ['/notoeffnung/', '/notoeffnung/tueroeffnung/']. */
export function kette(pfad) {
  const aus = [];
  for (let x = route(pfad); x && x.pfad !== '/'; x = x.eltern ? route(x.eltern) : null) aus.unshift(x.pfad);
  return aus;
}
