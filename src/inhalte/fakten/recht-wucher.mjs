// Faktenblatt recht-wucher: Überhöhte Preise. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Bundesministerium der Justiz – Strafgesetzbuch (StGB), § 291 Wucher (gesetze-im-internet.de)', url: 'https://www.gesetze-im-internet.de/stgb/__291.html', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'Bundesministerium der Justiz – Bürgerliches Gesetzbuch (BGB), § 138 Sittenwidriges Rechtsgeschäft; Wucher (gesetze-im-internet.de)', url: 'https://www.gesetze-im-internet.de/bgb/__138.html', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q3', titel: 'Bundesgerichtshof, Urteil vom 11. Februar 2026 – VIII ZR 37/24 (Rn. 44 und Leitsatz b)', url: 'https://www.bundesgerichtshof.de/SharedDocs/Entscheidungen/DE/Zivilsenate/VIII_ZS/2024/VIII_ZR__37-24.pdf?__blob=publicationFile&v=1', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q4', titel: 'Verbraucherzentrale – Schlüsseldienste: So schützen Sie sich vor überzogen hohen Rechnungen (Stand der Seite 21.01.2026)', url: 'https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/abzocke/schluesseldienste-so-schuetzen-sie-sich-vor-ueberzogen-hohen-rechnungen-6687', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'recht-wucher',
  thema: 'Überhöhte Preise',
  stand: '2026-10-25',
  frage: 'Ab wann gilt ein Preis rechtlich als wucherisch, und was raten Verbraucherzentralen bei überhöhten Schlüsseldienst-Rechnungen?',
  fakten: {
    'stgb291-grundtatbestand': fakt({ id: 'recht-wucher.stgb291-grundtatbestand', text: 'Nach § 291 Abs. 1 StGB wird Wucher mit Freiheitsstrafe bis zu drei Jahren oder mit Geldstrafe bestraft.', quelle: 'q1', status: 'verifizieren' }),
    'stgb291-schwer': fakt({ id: 'recht-wucher.stgb291-schwer', text: 'Für besonders schwere Fälle sieht § 291 Abs. 2 StGB eine Freiheitsstrafe von sechs Monaten bis zu zehn Jahren vor.', quelle: 'q1', status: 'verifizieren' }),
    'stgb291-ausnutzung': fakt({ id: 'recht-wucher.stgb291-ausnutzung', text: 'Wucher nach § 291 Abs. 1 StGB setzt voraus, dass eine Notlage, fehlende Erfahrung, eingeschränkte Urteilskraft oder deutliche Willensschwäche einer anderen Person ausgenutzt wird.', quelle: 'q1', status: 'verifizieren' }),
    'bgb138-missverhaeltnis': fakt({ id: 'recht-wucher.bgb138-missverhaeltnis', text: 'Nach § 138 Abs. 2 BGB ist ein Rechtsgeschäft nichtig, wenn ein auffälliges Missverhältnis zwischen Leistung und Gegenleistung besteht und dabei die Lage, Unerfahrenheit, mangelndes Urteilsvermögen oder erhebliche Willensschwäche eines anderen ausgenutzt wird.', quelle: 'q2', status: 'verifizieren' }),
    'bgh-regelvermutung': fakt({ id: 'recht-wucher.bgh-regelvermutung', text: 'Der BGH nimmt im Zusammenhang mit § 138 Abs. 1 BGB regelmäßig ein auffälliges, grobes Missverhältnis an, wenn der Wert der Leistung annähernd doppelt so hoch ist wie der Wert der Gegenleistung.', quelle: 'q3', status: 'verifizieren' }),
    'bgh-geschuldet': fakt({ id: 'recht-wucher.bgh-geschuldet', text: 'Für das Missverhältnis kommt es nach dem BGH auf die vertraglich geschuldeten Leistungen an, nicht auf die später tatsächlich erbrachten.', quelle: 'q3', status: 'verifizieren' }),
    'vz-festpreis': fakt({ id: 'recht-wucher.vz-festpreis', text: 'Die Verbraucherzentrale rät, vorab einen Festpreis zu vereinbaren, der Anfahrtskosten und Zuschläge bereits enthält.', quelle: 'q4', status: 'verifizieren' }),
    'vz-barzahlung': fakt({ id: 'recht-wucher.vz-barzahlung', text: 'Nach Angaben der Verbraucherzentrale ist eine Barzahlung nur zulässig, wenn sie vor Arbeitsbeginn vereinbart wurde.', quelle: 'q4', status: 'verifizieren' }),
    'vz-notruf': fakt({ id: 'recht-wucher.vz-notruf', text: 'Bei Druck durch den Monteur empfiehlt die Verbraucherzentrale, den Notruf 110 zu wählen.', quelle: 'q4', status: 'verifizieren' }),
  },
  offen: [
    'Eine gesetzliche Preisgrenze, ab der ein Schlüsseldienst-Preis wucherisch ist, gibt es nicht. Die Schwelle „annähernd doppelt“ ist eine Regelvermutung des BGH aus einem Kaufvertragsstreit (VIII ZR 37/24) und nicht aus dem Notdienst-Bereich; sie ist keine Strafbarkeitsschwelle nach § 291 StGB.',
    'BGH, 1. Strafsenat, Urteil vom 16. Januar 2020 – 1 StR 113/19 (von der Verbraucherzentrale als Wucher durch Schlüssel-Notdienst genannt): nur der Listeneintrag mit Datum und Aktenzeichen wurde bestätigt; der Urteilsinhalt konnte nicht gelesen werden (HTTP 503). Nicht als Fakt übernommen.',
    'Richtwerte für eine Türöffnung (ein Verbraucherzentrale-Hinweis nennt 150 Euro werktags; eine Landesbroschüre 50 bis 100 Euro bzw. 70 bis 250 Euro am Wochenende): nicht geprüft und zum Teil älter; nicht übernommen.',
    'Ob der BGH zusätzlich eine verwerfliche Gesinnung verlangt, und wie die Schwelle bei Notdiensten konkret bewertet wird: nur als Umkehrschluss aus Rn. 44 gelesen; keine Rechtsprechung zu Schlüsseldiensten geprüft.',
    'Der Wortlaut von § 291 StGB und § 138 BGB wurde nur als Zusammenfassung der amtlichen Seiten gelesen. Die Seiten nennen kein Stand-Datum.',
    'Die Verbraucherzentrale-Seite gilt als sekundäre Quelle; eine Stellungnahme der Landesverbraucherzentrale Hessen wurde nicht gesucht.',
  ],
};
