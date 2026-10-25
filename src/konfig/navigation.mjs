// Hauptnavigation und Fußnavigation. Gruppen kommen aus dem Leistungsregister.
import { GRUPPEN } from './leistungen.mjs';

export const HAUPT = [
  { titel: 'Leistungen', pfad: '/leistungen/', untermenue: GRUPPEN.map((g) => ({ titel: g.titel, pfad: g.pfad, kinder: g.leistungen.map((l) => ({ titel: l.titel, pfad: l.pfad })) })) },
  { titel: 'Preise', pfad: '/preise/' },
  { titel: 'Einsatzgebiet', pfad: '/einsatzgebiet/' },
  { titel: 'Ratgeber', pfad: '/ratgeber/' },
  { titel: 'Über uns', pfad: '/ueber-uns/' },
  { titel: 'Kontakt', pfad: '/kontakt/' },
];

export const FUSS = {
  leistungen: GRUPPEN.map((g) => ({ titel: g.titel, pfad: g.pfad })).concat([{ titel: 'Alle Leistungen', pfad: '/leistungen/' }, { titel: 'Preise', pfad: '/preise/' }]),
  betrieb: [
    { titel: 'Über uns', pfad: '/ueber-uns/' },
    { titel: 'Ratgeber', pfad: '/ratgeber/' },
    { titel: 'Kontakt', pfad: '/kontakt/' },
    { titel: 'Suche', pfad: '/suche/' },
    { titel: 'Sitemap', pfad: '/sitemap/' },
  ],
  recht: [
    { titel: 'Impressum', pfad: '/impressum/' },
    { titel: 'Datenschutz', pfad: '/datenschutz/' },
    { titel: 'Widerruf', pfad: '/widerruf/' },
    { titel: 'Barrierefreiheit', pfad: '/barrierefreiheit/' },
    { titel: 'Quellen & Lizenzen', pfad: '/quellen-lizenzen/' },
  ],
};
