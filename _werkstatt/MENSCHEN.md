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
  - Barrierefreiheit: Platzhalter `recht.barrierefreiheit.geltung` – gilt das Barrierefreiheitsstärkungsgesetz für den Betrieb? Wenn ja, auch den Satz „Diese Seite ist eine freiwillige Erklärung.“ anpassen.
  - Nach der Freigabe je Seite `freigabe: null` setzen (der Hinweis entfällt).
- **[RELEASE]** Alle mit `VERIFIZIEREN` markierten Fakten (Rauchmelderpflicht je Bundesland, KfW-Förderstatus 2026, § 35a EStG, WaffG/AWaffV, DIN/EN-Normen, Polizei-Beratungsstellen) gegen die Primärquelle prüfen und freigeben. Redaktionelle Verantwortung für KI-erstellte Texte (KI-VO Art. 50 Abs. 4).
- Restrisiko Datenbankrecht (§ 87b UrhG): Ortsauswahl folgt den Ortslisten der Wettbewerber, Ortsfakten stammen aus GeoNames. Bitte einschätzen lassen.
- Restrisiko UWG § 5 bei Ortsseiten außerhalb des tatsächlichen Einsatzgebiets – Gegenmaßnahmen siehe ENTSCHEIDUNGEN D-004.
- Marken: Produktmarken (z. B. aus den Wettbewerberseiten) werden nicht genannt, außer ihr habt eine belegte Partnerschaft (`src/konfig/marken.mjs`).
- Leitidee nutzt den Weilburger Schiffstunnel als Bild (stilisiert) – Fakt bitte bestätigen.

## 4. Repository
- Das Repo ist öffentlich (deine Entscheidung). Darin liegen seit dem ersten Commit die Wettbewerber-Scrapes (urheberrechtlich geschützte Texte, Personendaten wie Name/Foto-Link des Richter-Inhabers, zwei fremde Google-API-Schlüssel). Optional: Repo privat stellen und/oder Historie bereinigen (filter-repo + Force-Push) – nur durch dich.

- Zusammenführen in `main` und ein mögliches Zurückrollen entscheidest und veranlasst du; die Schritte stehen in `docs/ZUSAMMENFUEHREN.md` (Pull Request, Revert mit oder ohne `-m 1`, Umgang mit `_werkstatt/`). Der Lauf hat nichts zusammengeführt und nichts veröffentlicht.
## 5. Hosting, Domain, Betrieb
- Hoster wählen: EU-Standort, Auftragsverarbeitungsvertrag (Art. 28 DSGVO), IP-Kürzung, Logs ≤ 14 Tage, eigene HTTP-Header möglich (Apache/nginx/Netlify/Cloudflare Pages). Hoster-Zusätze aus: Cloudflare Rocket Loader, E-Mail-Verschleierung, Web Analytics; Netlify Snippet Injection.
- Domain: www oder ohne; HSTS-Preload erst nach stabiler HTTPS-Konfiguration; DNSSEC, CAA-Eintrag, Registrar-Lock; 2FA bei Registrar, Hoster, GitHub. Die Basis-URL trägst du in `src/konfig/betrieb.mjs` als `basisUrl` ein (Form `https://host` ohne Pfad; heute Platzhalter `https://Ihre-Domain.de`); ohne sie bricht der Release-Bau ab. · Beleg: `bau/bauen.mjs`; `_werkstatt/berichte/E5-abschluss-pruefung.md`, Abschnitt 1 (Z-02, Negativtest).
- E-Mail: SPF, DKIM, DMARC `p=reject` (Schutz vor gefälschten Notdienst-Mails); überwachtes Postfach für `/.well-known/security.txt`; Erinnerung vor deren Ablaufdatum.
- KI-Crawler sperren ja/nein (robots.txt) · Annahme: nicht gesperrt.
- Nach dem Deploy einmal `node _werkstatt/werkzeuge/live-check.mjs https://deine-domain` ausführen (prüft Header, MIME, 404, Weiterleitungen).

## 6. Tests, die die Cloud nicht kann (UMGEBUNGSAUSNAHMEN)
- Echte Geräte (iPhone/Android), Firefox und Safari (nur Chromium ist installiert), GPU-Bildrate, Wirkung in der Google Search Console, Live-Header beim Hoster.
- Geschmacksabnahme der Gestaltung durch dich.
- Konfigurationslücken (U-6 laut ABNAHME: Name, Telefon, Preise, Rechtsdaten und ungeprüfte Fakten; dazu gehören die Punkte aus §1 bis §3, etwa E-Mail und Zonen-Bestätigung). Bis dahin zeigt die Vorschau Platzhalter. Der Release-Bau verweigert jede offene Konfigurationslücke und jeden ungeprüften Fakt: Ohne Basis-URL bricht er sofort ab (Negativtest A), mit eingetragener Basis-URL weist er am Endstand 57 Platzhalter in der Konfiguration und 92 ungeprüfte Fakten ab (Negativtest B, `_werkstatt/berichte/E5-abschluss-pruefung.md` §5).
- Nach dem Eintragen von Telefonnummer, E-Mail und Preisliste auf einem echten Telefon prüfen: H1 (Anruf mit einem Tipp), H4 (Impressum vollständig), H5 (Mail-Programm öffnet sich) und der Gesamtbetrag im Preisrechner. In der Vorschau war H1 nur mit einer Testnummer in einer lokalen Kopie belegt, der Gesamtbetrag (F05) nur per Unit-Test; H4 und H5 sind nur als Tastaturpfad mit Platzhalterinhalt geprüft. · Beleg: `_werkstatt/berichte/E5-abschluss-pruefung.md`, Abschnitt 1 (Z-02 F05, Z-07 H1, H4, H5).

## 7. Texte und Fakten zur Freigabe (gesammelt aus den Paketen)
- **Ablauf-Formulierungen ohne konfigurierte Zusage**: „Den Preis besprechen wir nach der Besichtigung.“ (Gruppen Einbruchschutz, Einbau & Tresore), „Den Ersatzteilpreis nennen wir Ihnen vorher.“ (Garagenöffnung), „vorab besprochen“ (Notöffnung). Bitte bestätigen oder streichen; die harten Zusagen (Gesamtpreis vor Arbeitsbeginn, Rechnung mit Positionen, Kartenzahlung) laufen über `src/konfig/betrieb.mjs → zusagen` und sind bis zur Bestätigung markierte Platzhalter.
- **Fachangaben ohne Faktenblatt** (allgemein formuliert, fachliche Durchsicht nötig): Torarten und Notentriegelung, Notschlüssel bei Keyless-Fahrzeugen, Ursachen bei Tresoren, Sicherungskarte („Nachschlüssel nur mit Karte“), Begriffe Zentralschloss-/Hauptschlüsselanlage, Mietrecht bei Zusatzschlössern.
- **Faktenblätter Normen (E4-KUND-03, 12 Blätter, 76 Fakten, alle „verifizieren“)**: Normtexte sind kostenpflichtig; alle Quellen sind Sekundärquellen. Offene Kernfragen: Zählung der RC-Klassen (RC 1 N/RC 2 N), Prüfwerte RC 2–6, Notentriegelung (welche Norm), Gegenstand EN 1047-1/EN 15659, Status EN 15685. Bericht: `_werkstatt/berichte/E4-KUND-03.md`. Ein Zugang zu den Normtexten (z. B. über die Kammer) würde die Blätter zu Primärquellen machen.
- **Weilburger Schiffstunnel** (Seite `/schluesseldienst-weilburg/`, Leitidee): als „verifizieren“ markiert, bis das Faktenblatt `weilburg-tunnel` geprüft ist.
- **Zonen und Leistungen**: Jede Ortsseite zeigt „[Leistungen in Zone X bestätigen]“, bis `src/konfig/zonen.mjs → leistungenBestaetigt` je Zone gesetzt ist (true/false). Für die Niederlanden gilt Zone D.

- **Preise (V04, `/preise/`)**: Neu in `src/konfig/preise.mjs` → `tagesband`: die Uhrzeiten der vier Zeitfenster je Tagesart (Mo–Fr, Sa/So/Feiertag), lückenlos 00:00–24:00. Daraus entstehen Tagesband, Uhrzeiten in der Preistabelle und die Vorauswahl „jetzt“ im Rechner; die Platzhalter `preise.zeit-*` werden dann nicht mehr gebraucht. Neu in `src/konfig/betrieb.mjs → zusagen.erfolglos`: Was kostet ein Einsatz, wenn die Öffnung nicht gelingt? (ja → „Gelingt die Öffnung nicht, zahlen Sie nur, was vorher vereinbart war.“). Ablaufsatz ohne Zusage, bitte bestätigen: „Bevor wir anders vorgehen als besprochen, sprechen wir mit Ihnen.“ Feiertage gelten auf der Seite wie das Wochenende; der Rechner erkennt Feiertage nicht (Hinweis steht beim Tagesband).
- **Hub-Seiten (V06)**: Titel „Schlüsseldienst {Kreis}: Orte A–Z“ ohne Präposition (vermeidet falschen Dativ), kreisfreie Städte als „Name (kreisfreie Stadt)“. 129 Ortsteile ohne eigene Gemeindeseite stehen als Einzeleinträge mit „Ortsteil von X“. Eutergrund und Stegskopf haben in den Daten keinen Kreis und stehen unter „Weitere Orte“.
- **Weilburg-Seite**: Leitidee jetzt „… wie der Weilburger Schiffstunnel die Lahnschleife abkürzt …“ (ohne „unter dem Schlossberg“; Stadt und Denkmalverzeichnis nennen den Mühlberg, Faktenblatt `weilburg-tunnel`). Superlative („ältester, längster“) aus der Stadtangabe werden bewusst nicht verwendet (K-010).
- **Lizenz des Repositorys**: Das Repo ist öffentlich, hat aber keine LICENSE-Datei – damit gilt „alle Rechte vorbehalten“. Bitte entscheiden, ob und unter welcher Lizenz Code und Texte stehen sollen (Texte und Gestaltung sind eigene Werke des Betriebs; Ortsdaten stehen unter CC BY 4.0 von GeoNames, die Schrift unter der SIL OFL).
