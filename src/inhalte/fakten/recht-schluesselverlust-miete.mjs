// Faktenblatt recht-schluesselverlust-miete: Schlüsselverlust in Mietwohnungen. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Bundesgerichtshof – Pressemitteilung Nr. 42/2014 vom 5. März 2014 zu Urteil VIII ZR 205/13 (Schadensersatz bei Verlust eines Schlüssels einer Schließanlage)', url: 'https://www.bundesgerichtshof.de/SharedDocs/Pressemitteilungen/DE/2014/2014042.html', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'recht-schluesselverlust-miete',
  thema: 'Schlüsselverlust in Mietwohnungen',
  stand: '2026-10-25',
  frage: 'Wer trägt die Kosten, wenn ein Schlüssel einer Schließanlage verloren geht, und wann muss die Anlage getauscht werden?',
  fakten: {
    'bgh-schadensersatz': fakt({ id: 'recht-schluesselverlust-miete.bgh-schadensersatz', text: 'Nach dem BGH-Urteil VIII ZR 205/13 vom 5. März 2014 kann ein Mieter schadensersatzpflichtig sein, der einen zur Schließanlage gehörenden Wohnungsschlüssel verliert oder nicht zurückgibt.', quelle: 'q1', status: 'verifizieren' }),
    'bgh-austausch': fakt({ id: 'recht-schluesselverlust-miete.bgh-austausch', text: 'Zum Schadensersatz können nach dem BGH die Kosten für den Austausch der gesamten Schließanlage gehören, wenn der Austausch aus Sicherheitsgründen wegen einer Missbrauchsgefahr erforderlich ist.', quelle: 'q1', status: 'verifizieren' }),
    'bgh-schadenseintritt': fakt({ id: 'recht-schluesselverlust-miete.bgh-schadenseintritt', text: 'Nach dem BGH entsteht der Vermögensschaden erst mit dem tatsächlichen Austausch der Schließanlage; die bloße Notwendigkeit reicht dafür nicht aus.', quelle: 'q1', status: 'verifizieren' }),
    'bgh-ergebnis': fakt({ id: 'recht-schluesselverlust-miete.bgh-ergebnis', text: 'Im entschiedenen Fall war die Schließanlage nicht ausgetauscht; deshalb sprach der BGH keinen Schadensersatz für Austauschkosten zu.', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Wann eine Schließanlage nach Schlüsselverlust getauscht werden muss (Pflicht, Frist, Schwelle der Missbrauchsgefahr): nicht belegt. Die Pressemitteilung sagt nur, dass ein Austausch aus Sicherheitsgründen erforderlich sein kann.',
    'Nur die Pressemitteilung des BGH wurde gelesen. Der Volltext des Urteils VIII ZR 205/13 war unter den getesteten Adressen nicht abrufbar (HTTP 404); Gründe, Leitsätze und Randnummern sind nicht geprüft.',
    'Neuere BGH-Rechtsprechung zum Schlüsselverlust und zur Schließanlage: nicht gesucht.',
    'Ob der Mieter bei Verlust die Kosten für einen Schlüsseldienst tragen muss: nicht belegt.',
    'Mieterbund als Zweitquelle (laut Prüfvorgabe): nicht abgerufen.',
    'Die Entscheidung betrifft einen Wohnungsmietvertrag mit einer Wohnungseigentümergemeinschaft als Schlüsselgeber; ob das auf andere Konstellationen übertragbar ist, ist nicht geprüft.',
  ],
};
