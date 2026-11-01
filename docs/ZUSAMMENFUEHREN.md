# Zusammenführen und Zurückrollen

Diese Anleitung beschreibt, wie der Arbeitsbranch `claude/bold-noether-fk2n4f` in den Hauptzweig `main` kommt und wie Sie die Änderung wieder zurücknehmen. Sie beschreibt nur. Ausgeführt wird nichts davon, bis Sie es selbst tun.

## 1. Vor dem Zusammenführen prüfen

1. **Tests:** `npm test` (startet `node --test "test/*.test.mjs"`) ohne Fehler.
2. **Messbuild mit allen Prüfern:** `npm run pruefen` (entspricht `node bau/bauen.mjs --messen --pruefen`). Er dauert etwa 40 Sekunden und endet mit Exit-Code 1, sobald ein Prüfer einen Fehler meldet.
3. **Entscheidung zu `_werkstatt/`:** entfernen oder bewusst behalten (Abschnitt 4).
4. **Release:** Das Zusammenführen ersetzt keinen Release. Der Standardbau (`npm run bauen`) erzeugt eine Vorschau mit `noindex`. Ein Release braucht Abschnitt 6.

## 2. Pull Request öffnen

Öffnen Sie im Repository einen Pull Request mit Basis `main` und Vergleich `claude/bold-noether-fk2n4f`. Prüfen Sie die Ergebnisse aus Abschnitt 1, bevor Sie den Merge ausführen.

Wählen Sie die Merge-Art bewusst, weil sie das Zurückrollen bestimmt:

- **Merge-Commit:** ergibt einen Commit mit zwei Eltern; zurückrollen mit `-m 1` (Abschnitt 3).
- **Squash-Merge:** fasst alle Commits in einen; zurückrollen ohne `-m 1`.

## 3. Zurückrollen

Ein Revert nimmt die Änderungen zurück, ohne die Historie umzuschreiben. So gehen Sie vor:

1. Den Hash des Merge-Commits auf `main` heraussuchen, etwa auf der Seite des Pull Requests unter „Merge“ oder mit `git log --merges --oneline main`.
2. Auf einem neuen Branch von `main` den Revert ausführen:

   ```sh
   git revert -m 1 <merge>
   ```

   `<merge>` ist der Hash aus Schritt 1. Nach einem Squash-Merge gibt es keinen Merge-Commit; dann nehmen Sie den einen Squash-Commit ohne `-m 1` zurück.
3. Den Revert als Pull Request nach `main` bringen, die Prüfungen aus Abschnitt 1 wiederholen und erst dann mergen.

Ein Revert löscht nichts aus der Historie. Die Änderungen bleiben im Verlauf sichtbar.

## 4. Was mit `_werkstatt/` geschieht

`_werkstatt/` ist das Arbeitsgedächtnis aus der Entstehung der Website: Planung und Freigaben, Prüfberichte, Bildvorlagen und Prüfwerkzeuge. Die Website wird nicht daraus gebaut, und die README beschreibt den Ordner als Arbeitsunterlagen, die nicht ausgeliefert werden. Entscheiden Sie vor dem Zusammenführen bewusst, ob der Ordner entfernt oder behalten wird.

Diese Inhalte sind schon nach `docs/` übernommen:

- `BETRIEB.md`: was vor dem ersten Release einzutragen ist
- `OFFENE-PUNKTE.md`: alle offenen Punkte mit Zuständigkeit
- `HOSTER-CHECKLISTE.md`: Anforderungen an Hoster, Domain und E-Mail
- `ENTSCHEIDUNGEN.md`: die Entscheidungen in lesbarer Form
- `ORTE-ABGLEICH.md`: wie die Ortsdaten entstehen

Nur in `_werkstatt/` liegen die Fragen an den Betrieb (`MENSCHEN.md`), die Prüfberichte (`berichte/`), die Planungsdokumente, die Bildvorlagen und die Prüfwerkzeuge in `werkzeuge/`. Zum Bauen braucht der Build die Prüfwerkzeuge nicht.

**Wenn Sie `_werkstatt/` entfernen,** erledigen Sie vorher diese Punkte:

- **Ortspipeline:** Die Stufen 30 und 90 schreiben ihre Berichte nach `_werkstatt/berichte/` und legen den Ordner bei Bedarf neu an. `npm run orte` läuft also auch ohne `_werkstatt/`; der Ordner entsteht dann mit diesen zwei Berichten wieder.
- **Verweise:** README.md, `docs/BETRIEB.md`, `docs/HOSTER-CHECKLISTE.md` und `docs/OFFENE-PUNKTE.md` verweisen auf `_werkstatt/`. Diese Verweise sind danach tot und sollten auf die Dateien in `docs/` zeigen. Ein Kommentar in `src/konfig/themenpaesse.mjs` nennt ebenfalls einen Pfad; er hat keine Wirkung.
- **Werkzeuge:** Die Befehle für die OG-Bilder (`docs/BETRIEB.md`, Abschnitt 9) und für die Live-Prüfung (`docs/HOSTER-CHECKLISTE.md`) brauchen `_werkstatt/werkzeuge/`. Behalten Sie den Ordner dafür oder verschieben Sie ihn und passen die Befehle an.

**Wenn Sie `_werkstatt/` behalten,** bleibt der Ordner im Repository, und die README weist ihn als Arbeitsunterlagen aus.

Entfernen löscht die Dateien aus dem aktuellen Stand, nicht aus dem Verlauf.

## 5. Rohdaten der Wettbewerber im Repository-Verlauf

Die Exporte beider Wettbewerber liegen seit dem ersten Commit `ad81157` („Initial commit: Website-Exporte …“) im Verlauf. Dort stehen urheberrechtlich geschützte Texte, Personendaten (Name und Foto-Link des Inhabers der einen Seite) und zwei fremde Google-API-Schlüssel. Das Repository ist öffentlich.

Die Empfehlung aus `_werkstatt/MENSCHEN.md` (§4): Das Repository privat stellen und/oder die Historie bereinigen. Das entscheidet der Betrieb. Beachten Sie dabei:

- Eine Bereinigung ändert den Commit `ad81157`. Danach brechen `npm test` (der Plagiatstest liest ihn), `npm run orte` und `pipeline/fingerabdruck.mjs`. Stellen Sie diese vorher um (`docs/OFFENE-PUNKTE.md`, Nr. 35). Der Build selbst liest die gespeicherten Hashes in `bau/pruefen/fingerabdruck.json` und ist davon nicht betroffen.
- Eine Bereinigung entfernt die Daten nicht aus Kopien, die schon abgerufen wurden.

## 6. Release (nicht Teil des Zusammenführens)

Ein Release baut die Website mit ihrer endgültigen Adresse; indexierbare Seiten tragen dann kein `noindex` (`src/vorlagen/layout.mjs`). Er verweigert die Ausgabe, solange Angaben fehlen.

1. **Voraussetzungen:** Alle Punkte mit „Blockiert Release: ja“ in `docs/OFFENE-PUNKTE.md` und alle mit [RELEASE] markierten Punkte in `_werkstatt/MENSCHEN.md` sind erledigt. Die Liste der noch offenen Platzhalter liefert der Befehl unter „So erkennen Sie den Stand“ in `docs/BETRIEB.md`.
2. **Adresse:** In Supabase ist `betrieb.basis-url` (`https://` plus Domain, ohne Pfad) bestätigt, und der Pull Request der Übernahme ist zusammengeführt; der Wert steht dann in `src/daten/betriebswerte.json`.
3. **Befehl:**

   ```sh
   npm run release -- --ziel=apache
   ```

   Statt `apache` sind `nginx`, `netlify` oder `cloudflare` möglich. Ohne `--ziel` bricht der Lauf ab. Ohne Git-Checkout verlangt der Lauf zusätzlich `--datum=JJJJ-MM-TT`.
4. **Verweigerung:** Verweigert der Lauf die Ausgabe, landet sie in `dist.verweigert/`. Ein hochladbarer `dist/` bleibt dann nicht zurück.
5. **Deploy:** danach nach `docs/HOSTER-CHECKLISTE.md` vorgehen.

## 7. Betriebswerte-Zentrale (Branch `claude/superbase-complete-config-ek55c6`)

Dieser Branch bringt die Übernahme der Betriebswerte aus Supabase (D-DATEN-01): `bau/lib/betriebswerte.mjs`, den Schnappschuss `src/daten/betriebswerte.json` (leer), `pipeline/betriebswerte/` mit dem SQL für Supabase und den Workflow `.github/workflows/betriebswerte.yml`.

1. **Vorher prüfen:** wie Abschnitt 1. Mit leerem Schnappschuss unterscheidet sich die Ausgabe vom bisherigen Stand nur im JavaScript: Das Modul `erreichbarkeit` liest die Zeiten jetzt in kompakter Form statt als JSON; es steckt in allen neun Bündeln (je rund 250 B gzip mehr), deshalb tragen alle Seiten einen neuen Verweis auf ihr Bündel. HTML, CSS und Daten sind sonst byte-gleich.
2. **Zusammenführen:** per „Squash and merge“, durch den Inhaber selbst: GitHub schickt Fehlermails zu den Zeitplänen an die Person, die sie zuletzt geändert hat.
3. **Danach:** Der Zeitplan läuft ab dem Zusammenführen zweimal täglich. Bis die Einrichtung aus `docs/BETRIEB.md` („Betriebswerte in Supabase“) erledigt ist, endet jeder Lauf grün mit der Warnung „noch nicht eingerichtet“.
4. **Anhalten ohne Zurückrollen:** Actions → „Betriebswerte“ → „Disable workflow“. Der Bau nutzt weiter den letzten Schnappschuss.
5. **Zurückrollen:** den Squash-Commit ohne `-m 1` zurücknehmen (Abschnitt 3). Die Werte in Supabase bleiben erhalten; ein schon übernommener Schnappschuss verschwindet mit dem Revert nur, wenn er im selben Commit steht. Die Platzhalter in `src/konfig/*.mjs` stehen dann wieder allein.

## 8. Zum Abschluss

Zum Abschluss der Entstehung ist der Abschnitt „Werkstatt-Lauf (nur für den Orchestrator)“ aus `CLAUDE.md` entfernt. Die Datei bestand nur aus diesem Abschnitt und ist deshalb gelöscht. Der Abschnitt steuerte nur die Arbeit des Werkstatt-Laufs.
