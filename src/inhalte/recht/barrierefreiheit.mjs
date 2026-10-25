// Barrierefreiheit (V12) – ENTWURF: freiwillige Erklärung. Die Rechtslage steht nur über den Fakt aus
// dem Faktenblatt recht-bfsg (Stichtag). Ob der Betrieb unter das Gesetz fällt, ist nicht belegt: Die Antwort
// ist ein Platzhalter (recht.barrierefreiheit.geltung) und sperrt den Release bis zur rechtlichen Prüfung.
// Prozentwerte werden nicht genannt.
import { platzhalter } from '../../../bau/lib/platzhalter.mjs';
import recht from '../fakten/recht-bfsg.mjs';

const f = recht.fakten;
const geltung = platzhalter('recht.barrierefreiheit.geltung', 'nicht geprüft, wird nach der rechtlichen Prüfung ergänzt');

export default {
  id: 'barrierefreiheit',
  pfad: '/barrierefreiheit/',
  titel: 'Barrierefreiheit',
  h1: 'Barrierefreiheit',
  kicker: 'Betrieb und Recht',
  kurz: 'Ziel und Stand der Barrierefreiheit dieser Website.',
  beschreibung: 'Ziel und Stand der Barrierefreiheit dieser Website, bekannte Grenzen und der Weg, wie Sie uns Hinweise geben.',
  stand: '2026-10-25',
  freigabe: platzhalter('recht.barrierefreiheit.freigabe', 'Barrierefreiheit: Entwurf – rechtliche Prüfung und Freigabe nötig'),
  einleitung: 'Diese Erklärung beschreibt, wie zugänglich diese Website sein soll, womit wir sie prüfen und wo die Grenzen liegen.',
  weiterTitel: 'Weitere Rechtsseiten',
  abschnitte: [
    {
      id: 'ziel',
      titel: 'Unser Ziel',
      bloecke: [{ absatz: 'Unser Ziel ist die Stufe AA der Web Content Accessibility Guidelines (WCAG) 2.2.' }],
    },
    {
      id: 'pruefstand',
      titel: 'Prüfstand',
      bloecke: [{ absatz: 'Der Prüfstand ist eine automatisierte Prüfung mit axe-core und Lighthouse.' }],
    },
    {
      id: 'grenzen',
      titel: 'Bekannte Grenzen',
      bloecke: [{
        liste: [
          'Automatisierte Prüfungen erkennen nicht alle Barrieren. Manche Probleme zeigen sich erst beim Benutzen.',
          'Eine Prüfung auf echten Geräten steht noch aus.',
        ],
      }],
    },
    {
      id: 'rechtslage',
      titel: 'Rechtlicher Rahmen',
      bloecke: [
        { absatz: ['Zur Rechtslage: ', f.stichtag] },
        { absatz: ['Ob das Gesetz für unsere Leistungen gilt: ', geltung] },
        { absatz: 'Diese Seite ist eine freiwillige Erklärung.' },
      ],
    },
    {
      id: 'hinweise',
      titel: 'Hinweise an uns',
      bloecke: [{ absatz: 'Wenn Ihnen auf dieser Website etwas die Nutzung erschwert, schreiben Sie uns über die [Kontaktseite](/kontakt/). Nennen Sie bitte die Seite und beschreiben Sie, was nicht funktioniert.' }],
    },
  ],
};
