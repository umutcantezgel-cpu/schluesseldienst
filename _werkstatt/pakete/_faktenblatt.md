## Faktenblatt-Format (verbindlich für E4-KUND-03…05)
Datei `src/inhalte/fakten/<id>.mjs` (id exakt wie in `FAKTENBLAETTER`, `src/konfig/themenpaesse.mjs`):
```js
// Faktenblatt <id>: <Thema>. Stand <JJJJ-MM-TT>. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Herausgeber – Titel des Dokuments', url: 'https://…', art: 'primaer' | 'sekundaer', abgerufen: 'JJJJ-MM-TT' },
];

export default {
  id: '<id>', thema: '<Thema>', stand: 'JJJJ-MM-TT',
  frage: '<Prüffrage aus FAKTENBLAETTER, wortgleich>',
  fakten: {
    // je Aussage ein Fakt; text = ein vollständiger, eigener deutscher Satz (keine Zitate > 10 Wörter)
    '<kurzname>': fakt({ id: '<id>.<kurzname>', text: '…', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: ['Was nicht belegbar war oder widersprüchlich ist – ehrlich, mit Grund'],
};
```
- Primärquelle zuerst (Gesetz im Wortlaut bei gesetze-im-internet.de bzw. Landesrecht-Portal, Behörde, Normungsinstitut). Bezahlnormen: amtliche oder institutionelle Zusammenfassungen (Normungsinstitut-Kurzbeschreibung, Polizeiliche Kriminalprävention, Versichererverband) als `sekundaer` kennzeichnen.
- Jeder Fakt: genau eine prüfbare Aussage, mit Quelle; Zahlen, Klassen und Paragrafen exakt wie in der Quelle. Nichts runden, nichts ergänzen. Was du nicht belegen kannst, gehört nach `offen`, nicht in `fakten`.
- Keine Firmen- oder Produktnamen, keine Wettbewerberseiten als Quelle.
- Prüfen: `node --input-type=module -e "import('/home/user/schluesseldienst/src/inhalte/fakten/<id>.mjs').then(m=>console.log(Object.keys(m.default.fakten).length))"` läuft fehlerfrei für jede Datei.
