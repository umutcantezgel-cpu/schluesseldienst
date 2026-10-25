// Faktenblatt recht-waffen: Aufbewahrung von Waffen. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Bundesministerium der Justiz – Waffengesetz (WaffG), § 36 Aufbewahrung von Waffen oder Munition (gesetze-im-internet.de)', url: 'https://www.gesetze-im-internet.de/waffg_2002/__36.html', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'recht-waffen',
  thema: 'Aufbewahrung von Waffen',
  stand: '2026-10-25',
  frage: 'Welche Behältnisse verlangt das Waffenrecht für welche Waffen und Munition, und wer prüft die Aufbewahrung?',
  fakten: {
    'pflicht-vorkehrungen': fakt({ id: 'recht-waffen.pflicht-vorkehrungen', text: 'Wer Waffen oder Munition besitzt, muss nach § 36 Abs. 1 WaffG die erforderlichen Vorkehrungen treffen, damit sie nicht abhandenkommen oder von Unbefugten an sich genommen werden.', quelle: 'q1', status: 'verifizieren' }),
    'nachweis-behoerde': fakt({ id: 'recht-waffen.nachweis-behoerde', text: 'Wer erlaubnispflichtige Schusswaffen, Munition oder verbotene Waffen besitzt oder ihren Erwerb beantragt, muss der zuständigen Behörde nach § 36 Abs. 3 WaffG die Aufbewahrungsmaßnahmen nachweisen, die getroffen oder vorgesehen sind.', quelle: 'q1', status: 'verifizieren' }),
    'kontrolle-behoerde': fakt({ id: 'recht-waffen.kontrolle-behoerde', text: 'Die zuständige Behörde kann nach § 36 Abs. 3 WaffG die Räume betreten, in denen die Waffen oder Munition aufbewahrt werden, und die Aufbewahrung kontrollieren.', quelle: 'q1', status: 'verifizieren' }),
    'hoeherer-standard': fakt({ id: 'recht-waffen.hoeherer-standard', text: 'Ist im Einzelfall ein höherer Sicherheitsstandard erforderlich, kann die Behörde nach § 36 Abs. 6 WaffG die notwendigen Ergänzungen mit einer angemessenen Frist anordnen.', quelle: 'q1', status: 'verifizieren' }),
    'verordnung': fakt({ id: 'recht-waffen.verordnung', text: 'Das Bundesministerium des Innern kann nach § 36 Abs. 5 WaffG mit Zustimmung des Bundesrates Anforderungen an Aufbewahrung und Sicherung festlegen, die sich nach Art, Anzahl und Ort der Waffen richten.', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Behältnisse für einzelne Waffen- und Munitionsarten (Widerstandsgrad, Norm DIN EN 1143-1, Mengenstufen, Zertifizierung, Sonderregel für nicht dauernd bewohnte Gebäude): nicht belegt. Die Verordnung AWaffV § 13 konnte nicht abgerufen werden (HTTP 503). Suchtreffer nannten Widerstandsgrade 0 und I; das ist nicht am Verordnungstext geprüft.',
    'Der Abruf von § 36 WaffG erfolgte als Zusammenfassung der amtlichen Seite. Die Seite nennt kein Stand-Datum; der Text verweist nach der Zusammenfassung auf Änderungen bis 2017. Die Aktualität der Fassung ist nicht bestätigt.',
    'Wortlaut der Absätze 1 und 3 bis 6 nur sinngemäß gelesen; die exakte Formulierung steht noch aus.',
    'Übergangsregel für ältere Behältnisse (§ 36 Abs. 4 WaffG): nicht als Fakt übernommen, weil nur als Zusammenfassung gelesen.',
    'Zuständige Waffenbehörde und ihre Kontrollpraxis vor Ort: nicht belegt.',
  ],
};
