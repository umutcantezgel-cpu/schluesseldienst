# E3-PRUEF-09 · Rolle Prüfer · Modell Haiku · Stufe 2 · Kern-Version 1
Schreibrechte (exakt): test/ortsindex.test.mjs, test/redirect.test.mjs
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E3-PRUEF-09/**
Umfang: 2 Testdateien (node:test, keine Abhängigkeiten)
Abweichung vom PLAN: Preis- und Mailto-Tests schreiben E4-OPUS-01/02 zusammen mit ihrer Logik (die Module existieren noch nicht).

## Rollenbriefing Prüfer
Du schreibst Tests, die echte Fehler finden. Häufige Fehler: nur den Erfolgsfall testen; Tests an die aktuelle Ausgabe anpassen statt an die Anforderung; Fehler im Code „reparieren“, statt sie zu melden.

## Aufgabe in einem Satz
Sichere die Ortssuche-Logik und die Weiterleitungs- und Pfadregeln mit Tests ab, die bei Regressionen und bei Open-Redirect-Mustern rot werden.

## Zu testende Module (lesen, nicht ändern)
- `src/assets/js/logik/ortsindex.mjs` (`slugAbleiten`, `indexAufbauen`, `plzDekodieren`, `suchen`, `RICHTUNGEN`) und `src/assets/js/logik/normalisieren.mjs`.
- Daten: `src/daten/orte.json` und `src/daten/plz.json` (Format: Datenindex `bau/lib/datenindex.mjs` baut daraus die Client-Indizes – nutze `datenIndizes` oder die Formatbeschreibung im Kopf von `datenindex.mjs`, um realistische Eingaben zu erzeugen; ohne `dist/` lauffähig).
- `bau/lib/hosting.mjs` (`pruefeWeiterleitungen`, `htaccess`, `nginx`, `headersDatei`) und `bau/vorschau.mjs` (`pfadPruefen`; Import darf keinen Server starten – prüfe das, sonst OFFENE FRAGE).

## Anforderungen an `test/ortsindex.test.mjs`
- Suche nach Namen: „weilb“ → erster Treffer Weilburg; „bad hom“ → Bad Homburg vor der Höhe; Umlaute/ß: „gießen“, „giessen“, „GIESSEN“ liefern denselben ersten Treffer; Wortanfang im Inneren („homburg“ findet Bad Homburg).
- PLZ: „35781“ → Weilburg in Zone A; unvollständige PLZ („357“) liefert Treffer oder einen definierten Leerzustand (Verhalten lesen, Anforderung aus KERN-Komponente Ortssuche: „Name, Wortanfang oder PLZ“).
- Grenzen: leere Anfrage, nur Leerzeichen, 200 Zeichen, Sonderzeichen `<script>`, `../`, Emoji → kein Absturz, keine Treffer oder sinnvolle Treffer; `max` begrenzt die Trefferzahl.
- `slugAbleiten` stimmt für eine Stichprobe von 50 Orten aus `orte.json` mit dem gespeicherten `slug` überein (feste Auswahl, nicht zufällig).
- `plzDekodieren` liefert für jeden Eintrag gültige PLZ (5 Ziffern DE, 4 Ziffern + optional Buchstaben NL – Format im Code lesen) und eine bekannte Zone.

## Anforderungen an `test/redirect.test.mjs`
- `pruefeWeiterleitungen`: wirft bei Ziel/Quelle mit `//`, `/\`, `%2F%2F`, `%5C`, Schema (`https:`, `javascript:`), Großbuchstaben oder Leerzeichen, bei Ziel ohne existierende Route und bei Ketten/Schleifen (falls im Code vorgesehen – sonst als fehlende Regel unter OFFENE FRAGEN melden, Test mit `todo` markieren).
- `htaccess`/`nginx`: Ausgabe enthält den festen Host (nie `%{HTTP_HOST}` oder `$host` in Weiterleitungszielen), Sicherheits-Header, Dotfile-Sperre (nginx), `default_server` mit 444 (nginx).
- `pfadPruefen`: lehnt `//`, `\`, `%2f`, `%5c`, `%00`, `..` (auch kodiert) ab; akzeptiert `/`, `/notoeffnung/`, `/daten/orte.abc123.json`.
- Header-Gleichheit: `headersDatei()`, `htaccess()`, `nginx()` und `kopfzeilen()` aus `src/konfig/sicherheit.mjs` enthalten dieselbe CSP-Zeichenkette.

## Schnellprüfung und Selbstprüfung
- `node --test test/ortsindex.test.mjs test/redirect.test.mjs` grün; `npm test` gesamt grün.
- Mutationsprobe: in einer Kopie unter `.cache/E3-PRUEF-09/` eine Regel absichtlich brechen (z. B. `%2F` erlauben) und zeigen, dass ein Test rot wird (Kopie per Import-Pfad testen, Original unverändert).
- Schreibrechte eingehalten; nichts committet.
