# E4-DOK-01 · Rolle Dokumentar · Modell Haiku · Stufe 1 · Kern-Version 1
Schreibrechte (exakt): README.md (neu), docs/BETRIEB.md, docs/OFFENE-PUNKTE.md, docs/HOSTER-CHECKLISTE.md (alle neu)
Ausgaben (gitignored, frei): /home/user/schluesseldienst/.cache/E4-DOK-01/**
Umfang: Projekt-README und drei Betriebsdokumente für Menschen, die die Website übernehmen

## Rollenbriefing Dokumentar
Du beschreibst, was es gibt, so dass ein Mensch ohne Vorwissen damit arbeiten kann. Häufige Fehler: Befehle, die nicht funktionieren; Behauptungen über Funktionen, die es nicht gibt; Werbesprache; Doppelungen statt Verweisen.

## Aufgabe in einem Satz
Schreibe ein README und drei Dokumente in `docs/`, jedes Kommando vorher selbst ausgeführt, jede Aussage am Code oder an `_werkstatt/` belegt.

## Inhalte
- `README.md` (≤ 1.200 Wörter): Zweck in drei Sätzen · Voraussetzungen (Node 22, keine Abhängigkeiten) · Schnellstart (`npm run bauen`, `npm run vorschau`, `npm test`, `npm run pruefen`, `npm run release` und was „Release scheitert an Platzhaltern“ bedeutet) · Build-Modi (`--vorschau`, `--messen`, `--release`, `--ziel=apache|nginx|netlify|cloudflare`, `--aus`, `--nur`, `--stichprobe`) · Verzeichnisaufbau (kurz je Ordner: `bau/`, `src/konfig`, `src/daten`, `src/inhalte`, `src/vorlagen`, `src/assets`, `pipeline/`, `test/`, `_werkstatt/`) · die 11 Prüfer in einer Tabelle (Name, was er prüft, eine Zeile) · Sicherheit in fünf Punkten (CSP mit Trusted Types, keine Drittanbieter/Cookies, Kopfzeilen aus `src/konfig/sicherheit.mjs`, Weiterleitungen nur geprüft, mailto statt Formular-Backend) · Verweis auf `docs/`.
- `docs/BETRIEB.md`: Was der Mensch vor dem ersten Release eintragen muss – geordnet nach Datei (`src/konfig/betrieb.mjs`, `preise.mjs` inkl. `tagesband`, `zonen.mjs` inkl. `leistungenBestaetigt`, `seo.mjs` `basisUrl`), wie man Faktenblätter freigibt (`status: 'geprueft'`), Rechtsseiten-Freigabe (Platzhalter `recht.*.freigabe`), Orte nachpflegen (`npm run orte`, `pipeline/orte/zuordnung-manuell.json`), neue Ratgeber-Artikel anlegen (Muster `src/inhalte/ratgeber/schluesseldienst-abzocke-erkennen.mjs`), OG-Bilder neu erzeugen (`_werkstatt/werkzeuge/og.mjs`). Quelle: `_werkstatt/MENSCHEN.md`, ohne sie zu kopieren – zusammenfassen und verlinken.
- `docs/OFFENE-PUNKTE.md`: Tabelle aller offenen Punkte aus `_werkstatt/MENSCHEN.md` §1–§7, `_werkstatt/PLAN.md` (Abschnitt offene Punkte) und den Berichten `_werkstatt/berichte/E4-KUND-0*.md` – je Punkt: Bereich, Was fehlt, Wer entscheidet (Betrieb, Jurist, Fachmann, Hoster), Blockiert Release ja/nein.
- `docs/HOSTER-CHECKLISTE.md`: aus `_werkstatt/MENSCHEN.md` §5 und `src/konfig/sicherheit.mjs`: Anforderungen an den Hoster (EU, AVV, Log-Kürzung, eigene Kopfzeilen, keine Skript-Einschleusung), Domain/DNS (HSTS-Preload erst nach Freigabe, CAA, DNSSEC, DMARC/SPF/DKIM, Registrar-Sperre, 2FA), Ablauf eines Deploys (`npm run release -- --ziel=…`, Upload von `dist/`, danach `node _werkstatt/werkzeuge/live-check.mjs --basis https://… --dist dist --aus …`), Postfach für `security.txt` mit Erinnerung vor `Expires`.
## Regeln
- Deutsch, Sie-Anrede, sachlich; keine Superlative, kein Werbeton. Keine Firmendaten erfinden; Platzhalter als solche benennen.
- Jeder Befehl im Text wurde von dir ausgeführt (außer `--release`, das hier absichtlich scheitert – dann das Scheitern beschreiben).
- Nichts behaupten, was nicht im Code steht; im Zweifel nachsehen (`grep`) oder weglassen.
- Keine Inhalte von Wettbewerbern; die Wettbewerberordner im Repo nicht öffnen.
## Prüfen
- `npm test` grün; `node bau/bauen.mjs --messen --pruefen` grün (Doku liegt außerhalb von `src/` und darf den Build nicht ändern).
- Bericht nach `_werkstatt/pakete/_gemeinsam.md` mit Wortzahlen je Datei und den ausgeführten Befehlen.
