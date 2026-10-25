// Faktenblatt recht-video: Videoüberwachung privat. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Datenschutzkonferenz (DSK) – Orientierungshilfe Videoüberwachung durch nicht-öffentliche Stellen, Stand 17. Juli 2020', url: 'https://datenschutzkonferenz-online.de/media/oh/20200903_oh_vü_dsk.pdf', art: 'sekundaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'recht-video',
  thema: 'Videoüberwachung privat',
  stand: '2026-10-25',
  frage: 'Wann ist eine Kamera am eigenen Haus zulässig, was gilt für öffentliche Flächen und Nachbargrundstücke, welche Hinweispflichten bestehen?',
  fakten: {
    'haushalt': fakt({ id: 'recht-video.haushalt', text: 'Ein Kamerasystem am Einfamilienhaus, das auch den öffentlichen Raum erfasst, fällt nach der Orientierungshilfe nicht unter die Haushaltsausnahme.', quelle: 'q1', status: 'verifizieren' }),
    'rechtsgrundlage': fakt({ id: 'recht-video.rechtsgrundlage', text: 'Die Orientierungshilfe prüft die Rechtmäßigkeit privater Videoüberwachung nach Art. 6 Abs. 1 DS-GVO, insbesondere nach Buchstabe f über eine Interessenabwägung.', quelle: 'q1', status: 'verifizieren' }),
    'grundstuecksgrenze': fakt({ id: 'recht-video.grundstuecksgrenze', text: 'Nach der Orientierungshilfe endet das Beobachtungsrecht eines Privaten an der eigenen Grundstücksgrenze.', quelle: 'q1', status: 'verifizieren' }),
    'oeffentlicher-raum': fakt({ id: 'recht-video.oeffentlicher-raum', text: 'Die Orientierungshilfe nennt Straßen, Gehwege und Parkplätze als öffentlich zugängliche Räume, die Private regelmäßig nicht per Video überwachen dürfen, auch nicht bei einem konkreten Überwachungsinteresse.', quelle: 'q1', status: 'verifizieren' }),
    'nachbargrundstueck': fakt({ id: 'recht-video.nachbargrundstueck', text: 'Erstreckt sich eine Videoüberwachung auf das Nachbargrundstück, können nach der Orientierungshilfe zivilrechtliche Unterlassungs- und Abwehransprüche geltend gemacht werden.', quelle: 'q1', status: 'verifizieren' }),
    'attrappe': fakt({ id: 'recht-video.attrappe', text: 'Kamera-Attrappen verarbeiten nach der Orientierungshilfe keine personenbezogenen Daten; wer eine Attrappe einsetzt, muss dennoch mit zivilrechtlichen Abwehransprüchen rechnen.', quelle: 'q1', status: 'verifizieren' }),
    'hinweis-art13': fakt({ id: 'recht-video.hinweis-art13', text: 'Nach der Orientierungshilfe muss bei Videoüberwachung auf dem vorgelagerten Hinweisschild nach Art. 13 Abs. 1 und 2 DS-GVO informiert werden.', quelle: 'q1', status: 'verifizieren' }),
    'hinweis-zeitpunkt': fakt({ id: 'recht-video.hinweis-zeitpunkt', text: 'Der Hinweis auf videoüberwachte Bereiche muss nach der Orientierungshilfe vor dem Betreten dieser Bereiche erfolgen.', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Der Wortlaut des Bundesdatenschutzgesetzes (§ 4 BDSG zur Videoüberwachung öffentlich zugänglicher Räume) und sein aktueller Status wurden nicht geprüft; die Abruf-Adresse lieferte HTTP 503.',
    'Der Wortlaut der DS-GVO (Art. 2 Abs. 2 Buchst. c, Art. 6 Abs. 1 Buchst. f, Art. 13) wurde nicht am Amtsblatt geprüft; EUR-Lex lieferte nur Stichpunkte. Die Aussagen stützen sich auf die Zitate der DSK-Orientierungshilfe.',
    'Die Orientierungshilfe ist mit Stand 17. Juli 2020 datiert. Ob es eine neuere Fassung gibt, wurde nicht abschließend geprüft; die DSK-Startseite zeigt nur eine Orientierungshilfe zu Fitnessstudios.',
    'Speicherdauer, Interessenabwägung im Einzelfall, Tür- und Klingelkameras, Dashcams und Drohnen: nur am Inhaltsverzeichnis gesehen, nicht geprüft.',
    'Inhalt und Form des vorgelagerten Hinweisschildes und des vollständigen Informationsblatts (Anlagen 1 und 2): nicht übernommen.',
    'Rechtsprechung (z. B. BGH zu Attrappen und zur Überwachung von Nachbargrundstücken): nur als Fußnote der Orientierungshilfe gesehen, nicht am Urteil geprüft.',
  ],
};
