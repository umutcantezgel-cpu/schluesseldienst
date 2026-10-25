# MENSCHEN – was nur du klären kannst

Jeder Punkt: Frage · Beleg · meine Standardannahme (gilt bis zu deiner Antwort). Ohne die mit **[RELEASE]** markierten Punkte baut die Seite nur als Vorschau (noindex), nie als Release.

## 1. Betrieb und Impressum
- **[RELEASE]** Firmenname, Rechtsform, Inhaber/Vertretungsberechtigte, Anschrift in Weilburg, Telefon (Notruf), E-Mail · Beleg: `src/konfig/betrieb.mjs` · Annahme: sichtbare Platzhalter.
- **[RELEASE]** Registereintrag (falls vorhanden), USt-IdNr. bzw. Wirtschafts-IdNr., Handwerkskammer und Berufsbezeichnung (Staat der Verleihung), Verantwortlicher nach § 18 Abs. 2 MStV (für den Ratgeber), Erklärung nach § 36 VSBG (Streitbeilegung). Kein OS-Plattform-Link mehr (Plattform seit 20.07.2025 abgeschaltet).
- **[RELEASE]** Erreichbarkeit: Zeiten, Nachtdienst ja/nein, Wochenende/Feiertage · Annahme: Platzhalter; die Rufleiste zeigt dann nur die Nummer.
- **[RELEASE]** Preisliste (Gesamtpreise inkl. USt und Anfahrt je Zone, Zuschläge Abend/Nacht/Wochenende/Feiertag), `ustModus` (Regelbesteuerung oder Kleinunternehmer – dann kein „inkl. MwSt.“), Zahlarten (ohne Zahlart-Zuschläge, § 270a BGB) · Annahme: Preisrechner zeigt „Berechnung erst mit Preisliste möglich“.
- Eigene Fotos (Team, Fahrzeug, Arbeiten) und Bewertungsprofil-Link – bis dahin keine Fotos und keine Bewertungsangaben.
- Gründungsjahr, Qualifikationen, Mitgliedschaften – nur mit Nachweis; sonst erscheinen sie nicht.

## 2. Einsatzgebiet und Ortsseiten
- **[RELEASE]** Zonenradien bestätigen: A Kern (Landkreis Limburg-Weilburg + ≤ 20 km), B Umland (≤ 50 km), C Region (≤ 100 km), D überregional (> 100 km), NL.
- **[RELEASE]** Welche Leistungen ihr je Zone wirklich anbietet (`zonen.X.leistungenBestaetigt`) – v. a. ob ihr in Zone C/D/NL Notöffnungen fahrt oder ein Partnernetz habt · Annahme: Zone C/D/NL nur „nach Absprache“, Seiten nennen Sitz und Entfernung.
- Indexierung Zone C/D/NL (Standard: alles indexiert, wie entschieden). Beobachtung in der Search Console: bleibt „Gecrawlt – nicht indexiert“ nach 8 Wochen > 60 % für eine Zone, Zone auf `indexierung: false` stellen.
- NL-Seiten: Sprache (Annahme Deutsch) und Umsatzsteuer (Leistungen an Grundstücken in NL sind dort steuerpflichtig) · Annahme: NL-Seiten ohne Preise.
- Unklare Orte aus dem Abgleich (Liste folgt in `src/daten/orte-unklar.json`) – werden bis zur Klärung nicht veröffentlicht.

## 3. Recht und Fakten (fachliche Prüfung)
- **[RELEASE]** Impressum, Datenschutzerklärung (Hosting-Logs, E-Mail/Telefon, § 25 TDDDG), Widerrufsbelehrung, Barrierefreiheitserklärung – alles Entwürfe, bitte rechtlich prüfen lassen.
- **[RELEASE]** Alle mit `VERIFIZIEREN` markierten Fakten (Rauchmelderpflicht je Bundesland, KfW-Förderstatus 2026, § 35a EStG, WaffG/AWaffV, DIN/EN-Normen, Polizei-Beratungsstellen) gegen die Primärquelle prüfen und freigeben. Redaktionelle Verantwortung für KI-erstellte Texte (KI-VO Art. 50 Abs. 4).
- Restrisiko Datenbankrecht (§ 87b UrhG): Ortsauswahl folgt den Ortslisten der Wettbewerber, Ortsfakten stammen aus GeoNames. Bitte einschätzen lassen.
- Restrisiko UWG § 5 bei Ortsseiten außerhalb des tatsächlichen Einsatzgebiets – Gegenmaßnahmen siehe ENTSCHEIDUNGEN D-004.
- Marken: Produktmarken (z. B. aus den Wettbewerberseiten) werden nicht genannt, außer ihr habt eine belegte Partnerschaft (`src/konfig/marken.mjs`).
- Leitidee nutzt den Weilburger Schiffstunnel als Bild (stilisiert) – Fakt bitte bestätigen.

## 4. Repository
- Das Repo ist öffentlich (deine Entscheidung). Darin liegen seit dem ersten Commit die Wettbewerber-Scrapes (urheberrechtlich geschützte Texte, Personendaten wie Name/Foto-Link des Richter-Inhabers, zwei fremde Google-API-Schlüssel). Optional: Repo privat stellen und/oder Historie bereinigen (filter-repo + Force-Push) – nur durch dich.

## 5. Hosting, Domain, Betrieb
- Hoster wählen: EU-Standort, Auftragsverarbeitungsvertrag (Art. 28 DSGVO), IP-Kürzung, Logs ≤ 14 Tage, eigene HTTP-Header möglich (Apache/nginx/Netlify/Cloudflare Pages). Hoster-Zusätze aus: Cloudflare Rocket Loader, E-Mail-Verschleierung, Web Analytics; Netlify Snippet Injection.
- Domain: www oder ohne; HSTS-Preload erst nach stabiler HTTPS-Konfiguration; DNSSEC, CAA-Eintrag, Registrar-Lock; 2FA bei Registrar, Hoster, GitHub.
- E-Mail: SPF, DKIM, DMARC `p=reject` (Schutz vor gefälschten Notdienst-Mails); überwachtes Postfach für `/.well-known/security.txt`; Erinnerung vor deren Ablaufdatum.
- KI-Crawler sperren ja/nein (robots.txt) · Annahme: nicht gesperrt.
- Nach dem Deploy einmal `node werkzeuge/live-check.mjs https://deine-domain` ausführen (prüft Header, MIME, 404, Weiterleitungen).

## 6. Tests, die die Cloud nicht kann (UMGEBUNGSAUSNAHMEN)
- Echte Geräte (iPhone/Android), Firefox und Safari (nur Chromium ist installiert), GPU-Bildrate, Wirkung in der Google Search Console, Live-Header beim Hoster.
- Geschmacksabnahme der Gestaltung durch dich.
