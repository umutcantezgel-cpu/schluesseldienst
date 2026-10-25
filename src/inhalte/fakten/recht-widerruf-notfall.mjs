// Faktenblatt recht-widerruf-notfall: Widerruf bei dringenden Reparaturen. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Bundesministerium der Justiz – Bürgerliches Gesetzbuch (BGB), § 312g Widerrufsrecht bei Verträgen (gesetze-im-internet.de)', url: 'https://www.gesetze-im-internet.de/bgb/__312g.html', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'recht-widerruf-notfall',
  thema: 'Widerruf bei dringenden Reparaturen',
  stand: '2026-10-25',
  frage: 'Wann entfällt das Widerrufsrecht bei bestellten dringenden Reparaturen, und was gilt für Leistungen darüber hinaus?',
  fakten: {
    'nr11-ausschluss': fakt({ id: 'recht-widerruf-notfall.nr11-ausschluss', text: 'Nach § 312g Abs. 2 Satz 1 Nr. 11 BGB besteht kein Widerrufsrecht, wenn der Verbraucher den Unternehmer ausdrücklich dazu auffordert, dringende Reparatur- oder Instandhaltungsarbeiten vorzunehmen.', quelle: 'q1', status: 'verifizieren' }),
    'nr11-zusatzleistung': fakt({ id: 'recht-widerruf-notfall.nr11-zusatzleistung', text: 'Die Ausnahme nach § 312g Abs. 2 Satz 1 Nr. 11 BGB gilt nicht für zusätzlich erbrachte Dienstleistungen, die der Verbraucher nicht ausdrücklich verlangt hat.', quelle: 'q1', status: 'verifizieren' }),
    'nr11-waren': fakt({ id: 'recht-widerruf-notfall.nr11-waren', text: 'Die Ausnahme nach § 312g Abs. 2 Satz 1 Nr. 11 BGB gilt auch nicht für Waren, die für die Instandsetzung nicht zwingend als Ersatzteile benötigt werden.', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Der Wortlaut von § 312g Abs. 2 Satz 1 Nr. 11 BGB wurde nur sinngemäß gelesen (Zusammenfassung der amtlichen Seite). Die Seite nennt kein Stand-Datum, die Fassung ist nicht bestätigt.',
    'Ob die Ausnahme auch dann gilt, wenn der Verbraucher den Unternehmer nicht ausdrücklich, sondern telefonisch oder über eine Vermittlungsplattform beauftragt: nicht geprüft.',
    'Wertersatz für bereits erbrachte Leistungen nach einem Widerruf (§§ 357, 357a BGB): nicht abgerufen.',
    'Ob eine Notöffnung oder ein Schlosstausch als „dringende Reparatur“ im Sinne der Norm gilt: nicht belegt; es wurde keine Rechtsprechung dazu abgerufen.',
    'Die übrigen Ausnahmen nach § 312g Abs. 2 BGB (andere Nummern als Nr. 11): nicht geprüft.',
  ],
};
