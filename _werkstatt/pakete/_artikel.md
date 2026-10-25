## Ratgeber-Artikel (V08) – gemeinsame Regeln für E4-BAU-13…18
- Muster (lesen, nicht ändern): Vorlage `src/vorlagen/seiten/artikel.mjs`, Inhaltsmodul `src/inhalte/ratgeber/schluesseldienst-abzocke-erkennen.mjs`. Jede deiner Dateien hat genau diese Form (`export default { … }`) und heißt `src/inhalte/ratgeber/<id>.mjs` (id aus dem Paketblatt).
- Themenpass: `PAESSE['/ratgeber/<id>/']` in `src/konfig/themenpaesse.mjs`. Er legt fest: Hauptsuchbegriff, Absicht, Kern (dein Blickwinkel), Pflichtabschnitte, Fragen, Faktenblätter, Verwandtes, Vorsicht (unbedingt einhalten).
- Felder (alle Pflicht, außer markiert):
  - `titel` ≤ 60 Zeichen, enthält den Hauptsuchbegriff; `beschreibung` 70–155 Zeichen; `h1`; `kurztitel` ≤ 28 Zeichen (Brotkrumen).
  - `kategorie`: genau der Wert aus dem Paketblatt (`notfall`, `vorbeugen`, `technik` oder `recht`).
  - `kurz`: 2–3 Sätze, beantwortet die Suchabsicht direkt.
  - `stand: '2026-10-25'`.
  - `figur` (optional, Vorschlag im Paketblatt): einer der Schlüssel `falle-riegel`, `tuer-schichten`, `fenster-schichten`, `grundriss`, `stufen`, `rechnung`, `objekte`, `zylinder`. Mit `figurText`: ein Satz, was die Figur zeigt.
  - `wichtig`: genau 3 Sätze, je mit einem **fetten** Kernbegriff.
  - `abschnitte`: jeder Pflichtabschnitt des Passes, Titel wortgleich, in dieser Reihenfolge, je `{ titel, absaetze[] }`; optional `liste[]` (Aufzählung), `schritte[]` (Reihenfolge zählt), `hinweis: { art: 'info' | 'warnung', text }`. 1–3 Absätze je Abschnitt.
  - `faq`: genau die Fragen des Passes, wortgleich, je eine Antwort in 1–3 Sätzen.
  - `weiter`: genau 3 Einträge `{ pfad, titel, text }` aus `verwandt` des Passes (ohne Selbstverweis).
- Umfang: 700–1.200 Wörter sichtbarer Text je Artikel. Lieber knapp und konkret als lang.
- Zahlen, Normen, Paragrafen, Prozente, Jahre, Dauern und Beträge NUR über Fakten aus den Faktenblättern des Passes. So:
  ```js
  import rc from '../fakten/norm-rc-klassen.mjs';
  // … im Absatz eine Liste statt eines Strings:
  absaetze: [['Für Türen gilt: ', rc.fakten['tueren-empfehlung'], ' Darunter liegen die Grundsicherungsklassen.']],
  ```
  - Der Fakt steht als ganzer Satz im Text; du tippst seinen Wortlaut nie selbst ab und änderst Faktenblätter nie.
  - Fehlt ein Faktenblatt oder der passende Fakt, schreibst du ohne die Zahl („eine Widerstandsklasse, die die Polizei empfiehlt“) und meldest es unter OFFENE FRAGEN.
  - Fakten funktionieren auch in `liste`, `schritte`, `hinweis.text` und `faq[].antwort`.
- Sprache:
  - Sie-Anrede, ruhig, konkret, ohne Werbeton. Sätze ≤ 20 Wörter.
  - Keine Superlative, Marken, Zertifikate, „polizeilich empfohlen“ (außer als Fakt), keine Zusagen des Betriebs außerhalb der Konfiguration. Der Betrieb kommt höchstens in einem Satz und im Hinweis vor.
  - Rechtsfragen: Rechtslage nur als Fakt; ansonsten auf die zuständige Stelle verweisen (Verbraucherzentrale, Behörde, Versicherung). Kein Rechtsrat.
  - Gedankenstriche mit Leerzeichen davor und danach; die Vorlage schützt sie.
- Links: Mini-Syntax `[Text](/pfad/)`, nur Routen aus `src/konfig/routen.mjs` (auch noch nicht gebaute Ratgeber-Artikel sind erlaubt). Externe Links gibt es im Fließtext nicht; Quellen erscheinen automatisch aus den Faktenblättern.
- Nichts von den Wettbewerbern übernehmen; ihre Blog- und News-Seiten im Repo NICHT öffnen. Der Plagiatsprüfer läuft im Build.
- Prüfen:
  - `node bau/bauen.mjs --messen --pruefen --nur=/ratgeber/ --aus=.cache/<KENNUNG>/dist` → alle Prüfer grün (Info-Hinweise zu Platzhaltern und geplanten Links sind in Ordnung).
  - Vorschau `node bau/vorschau.mjs --aus .cache/<KENNUNG>/dist --port <PORT> --still &` (PID merken).
  - Bildsatz `node _werkstatt/werkzeuge/bildsatz.mjs --basis http://127.0.0.1:<PORT> --pfade <pfad1>,<pfad2>,<pfad3> --schemata light --aus .cache/<KENNUNG>/bilder`.
  - Je Artikel Desktop 01–02 und Mobil 01–02 ansehen und nachschärfen (Lesefluss, Längen, Hinweise, Figur).
  - Zum Schluss deinen Vorschau-Prozess per PID beenden.
