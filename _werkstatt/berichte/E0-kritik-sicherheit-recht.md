> **Vermerk:** Dieser Bericht entstand in der Planungsphase. Wo er vom genehmigten Plan (`_werkstatt/PLAN-GENEHMIGT.md`) abweicht, ist er **überholt durch PLAN**. Liste der überholten Punkte: `_werkstatt/ENTSCHEIDUNGEN.md` → „Überholte Panel-Punkte“.

- **[KRITISCH] · Repo / Urheberrecht / DSGVO** · Problem: Plan Z.107 sagt „Das Repo bleibt privat“. Das stimmt nicht: `gh api repos/umutcantezgel-cpu/schluesseldienst` liefert `"private":false,"visibility":"public"`. Öffentlich liegen damit schon alle Scrapes (§§ 16, 19a, 87b UrhG), Name, Mobilnummer und Foto-URL des Richter-Inhabers (`…_team.html.md`, Art. 6 DSGVO) und zwei fremde `AIza`-Schlüssel. Die stündlichen Pushes kämen dazu: `_werkstatt` mit dem Satz „Brückenseiten-Risiko akzeptiert“ (bei einer Abmahnung ein Beleg für Vorsatz), Vorher-Screenshots und Themeninventare. · Korrektur: Vor E0 eine einzige Freigabe einholen: Repo auf privat stellen oder ein neues privates Repo anlegen. E0-Schritt 0 prüft `private==true` über REST; sonst nur lokal committen. Die Rohdaten aus dem Git-Baum nehmen und in `.gitignore` aufnehmen. Ob die History bereinigt wird (filter-repo und Force-Push), entscheidet der Mensch (MENSCHEN.md). Vorher-Bilder nur nach `.cache/`; BERICHT nur mit Kennzahlen.

- **[KRITISCH] · UWG §§ 5, 5a (Blickfang)** · Problem: Titel und H1 lauten „Schlüsseldienst (für) {Ort}“ (Z.132, Panel1) auch für Zone C, D und NL. Der ehrliche Zonensatz steht erst im Text, aber Titel und Snippet müssen schon für sich wahr sein. Akzeptiert ist nur das Google-Risiko, nicht das Abmahnrisiko (§ 8 UWG). Wahrscheinlichster Abmahner ist Richter, denn seine Ortsliste wird gespiegelt. · Korrektur: Für Zone C, D und NL Sitz und Entfernung in Titel, H1 und Meta („… aus Weilburg, ≈ {d} km“). Leistungen nur zeigen, wenn der Mensch `zonen.X.leistungenBestaetigt` gesetzt hat; ohne diese Bestätigung kein Release. Der Ehrlichkeits-Prüfer prüft zusätzlich `<title>`, H1, Meta und `areaServed`.

- **[WICHTIG] · NL / USt / PAngV** · Problem: Leistungen an Gebäuden in NL sind dort umsatzsteuerpflichtig (§ 3a Abs. 3 Nr. 1 UStG). „inkl. 19 % MwSt.“ wäre also falsch. · Korrektur: Schalter `staaten.NL=false`, bis MENSCHEN entschieden hat. Auf NL-Seiten nie Preise zeigen.

- **[WICHTIG] · § 87b UrhG (Datenbankrecht)** · Problem: Die Ortsmenge übernimmt die Wettbewerberlisten (5.308 und 532) komplett (Z.13, Z.47). Das ist die Entnahme eines wesentlichen Teils einer Datenbank. · Korrektur: Die Ortsmenge nach einem eigenen Kriterium aus GeoNames festlegen (Kreise oder Radius). Die Listen dienen nur dem Abdeckungsvergleich. Das Restrisiko in ENTSCHEIDUNGEN und MENSCHEN festhalten.

- **[WICHTIG] · Release braucht die Rohdaten** · Problem: S09 („Tokens zur Prüfzeit aus den Scrapes“) und der Plagiatsprüfer laufen bei `--release`, also auf dem Hoster (Z.38). Dort fehlen die Scrapes, oder sie müssten mit ausgeliefert werden. · Korrektur: Einmal `bau/pruefen/fingerabdruck.json` erzeugen, nur mit FNV- bzw. SHA-256-Hashes der Schindeln und Tokens. Danach kommen die Rohdaten aus dem Repo.

- **[WICHTIG] · Panels widersprechen CSP und Permissions-Policy** · Problem: Z.89 verbietet `clipboard-write` und `geolocation`. Trotzdem stehen in den Panels:
  - M-23 und „Nummer kopieren“;
  - „In der Nähe“ per Geolocation (Panel1);
  - die Kartennadel als CSS-Variable, was `style=` braucht und an S04 scheitert;
  - ein gehashtes Inline-Snippet (Panel3), obwohl Z.83 das verbietet;
  - ein Composer mit „Erfolg/Netzwerkfehler“, Einwilligungs-Häkchen und Honeypot;
  - abweichende Zonenradien (Plan 20/50/100, Panel2 15/30/60, Panel3 25/50/100) und abweichende URL-Muster (`/schluesseldienst/<slug>/`, `/slotenmaker/`).
  
  Korrektur: In KERN die Regel „Plan schlägt Panel“ und eine Liste „verboten → Ersatz“ aufnehmen:
  - kein Kopierknopf;
  - „In der Nähe“ nur per PLZ;
  - Kartennadel über SVG-`cx/cy`;
  - Composer ohne Erfolgsmeldung, mit sichtbarer Adresse als Ausweichweg;
  - keine Einwilligung (Rechtsgrundlage Art. 6 Abs. 1 lit. b), kein Honeypot;
  - Längengrenze auf die kodierte mailto-URL (≤ ~1.900 Zeichen), Hinweis „keine Codes oder Alarmdaten per E-Mail“.

- **[WICHTIG] · Open Redirect / Cache-Poisoning** · Problem: Die Slash-Normalisierung im Vorschau-Server, in `.htaccess` und in nginx nutzt den rohen Pfad. `//evil.example` oder `/\evil.example` wird so zu `Location: //evil.example/`. `_redirects` wird ohne Zielprüfung erzeugt. · Korrektur: Weiterleitungsziele nur absolut mit fest eingetragenem Host bauen (nie `%{HTTP_HOST}` oder `$host`). Pfade gegen `^/[a-z0-9/-]*$` prüfen und nur weiterleiten, wenn das Ziel existiert. Gleiches gilt für Quellen und Ziele der 301-Liste. Tests mit `//`, `/\` und `%2F%2F`. nginx `default_server` gibt 444 zurück.

- **[WICHTIG] · Hoster-Konfiguration** · Problem:
  - Alle Konfigurationen liegen im selben `dist/`. Auf Netlify oder Cloudflare wäre `.htaccess` dann öffentlich abrufbar.
  - Die MIME-Liste ist unvollständig (`.webmanifest`, `.avif`, charset für `security.txt`). `nosniff` mit richtigem MIME-Typ ist das, was verhindert, dass `/daten/*.json` als Skript geladen werden kann.
  - Hoster schleusen Code ein: Cloudflare Rocket Loader, Web Analytics und E-Mail-Verschleierung, Netlify Snippet Injection. Das bricht CSP und SRI und erzeugt Drittanbieter-Requests.
  
  Korrektur: `--ziel=apache|nginx|netlify|cloudflare` schreibt nur die passende Datei. nginx sperrt Dotfiles mit `location ~ /\.(?!well-known)`. Dazu `werkzeuge/live-check.mjs` (Header, MIME, 404-Status, Redirects, `/cdn-cgi/`) und eine Hoster-Checkliste in MENSCHEN.

- **[WICHTIG] · Datenschutz** · Problem: „Keine Drittanbieter“ (Z.21) übersieht den Hoster: IP-Logs, Auftragsverarbeitungsvertrag nach Art. 28, Drittland nach Art. 44 ff. Dazu kommen E-Mail-Anbieter und Telefon. Die PLZ-Shards (`/daten/plz/NN`) verraten im Log die Region des Nutzers. · Korrektur: MENSCHEN: EU-Hoster, AVV, IP-Kürzung und Logs ≤ 14 Tage. Der Datenschutz-Entwurf behandelt Hosting-Logs, Kontakt per E-Mail und Telefon und § 25 TDDDG.

- **[WICHTIG] · Impressum (§ 5 DDG)** · Problem: In MENSCHEN (Z.244) fehlen Rechtsform und Vertretungsberechtigte, Register, USt-IdNr. bzw. W-IdNr., bei einem Handwerksbetrieb Kammer und Berufsbezeichnung (Nr. 5), die Angabe nach § 18 Abs. 2 MStV für den Ratgeber und die Erklärung nach § 36 VSBG. Ein OS-Plattform-Link gehört nicht mehr hinein (Plattform seit 20.07.2025 abgeschaltet). Panel3 legt die mobilen Fußlinks in `<details>`. · Korrektur: Diese Felder sind Pflicht für den Release. Impressum und Datenschutz bleiben immer sichtbar, auch auf der 404-Seite.

- **[WICHTIG] · PAngV / BGB** · Problem: Gefordert sind Gesamtpreise inkl. USt und Anfahrt. „Nach Absprache“ in Zone C/D reicht dafür nicht. Kleinunternehmer dürfen „inkl. MwSt.“ nicht zeigen. Zuschläge je Zahlart sind verboten (§ 270a BGB). Planbare Aufträge per Telefon oder E-Mail sind Fernabsatz und brauchen eine Widerrufsbelehrung; die Ausnahme gilt nur für dringende Reparaturen (§ 312g Abs. 2 Nr. 11). · Korrektur: Das Schema für `preise.mjs` bekommt `ustModus` und `anfahrtJeKm`; ein Test schließt Zahlart-Zuschläge aus. Der Rechner zeigt immer den Gesamtpreis. `valueAddedTaxIncluded` folgt aus `ustModus`. `/widerruf/` kommt in die Seitenliste (Z.128).

- **[WICHTIG] · Marken und Werbeaussagen** · Problem: Die Quellen nennen Jablotron (JA-100/63/151), UR FOG, GEZE, ID-3 und K10 (Z.115). „Markenneutral“ wird aber nicht geprüft. · Korrektur: Eine Sperrliste im Ehrlichkeits-Prüfer gilt für Text, Titel, Slug, Alt-Text und JSON-LD (dazu SimonsVoss, ABUS, BKS, EVVA usw. sowie „polizeilich empfohlen“, „VdS“, „Errichter“). Freigaben nur über `konfig/marken.mjs` mit belegter Partnerschaft.

- **[WICHTIG] · Faktenhaftung** · Problem: Der Release scheitert nur an Platzhaltern (Z.262). VERIFIZIEREN-Fakten (WaffG, Rauchmelderpflicht auf ~6.000 Seiten, KfW) könnten ungeprüft live gehen. S06 erlaubt externe Links nur zu GeoNames und Creative Commons, Quellenangaben sind also unmöglich. · Korrektur: `VERIFIZIEREN` sperrt den Release. Eine Allowlist `konfig/quellen.mjs` (nur https, `rel="noopener noreferrer"`). Die menschliche redaktionelle Verantwortung in MENSCHEN festhalten (KI-VO Art. 50 Abs. 4, gilt seit 02.08.2026).

- **[WICHTIG] · Browserabdeckung** · Problem: Installiert ist nur `/opt/pw-browsers/chromium-1243`. Trusted Types und das externe `<use>`-Sprite (Z.177) sind damit nur in Chromium geprüft. Das Sprite hat kein SRI, und die CSP-Direktive dafür ist je Engine unsicher; im Zweifel greift `default-src 'none'`. · Korrektur: Nur die benutzten `<symbol>` inline in die Seite. Smoke-Test zusätzlich in Firefox und WebKit; geht das nicht, als UMGEBUNGSAUSNAHME eintragen.

- **[WICHTIG] · Domain und Mail (MENSCHEN)** · Problem: In MENSCHEN fehlen DMARC `p=reject` mit SPF und DKIM (Schutz gegen gefälschte Notdienst-Mails), CAA, DNSSEC, Registrar-Lock, 2FA für Registrar, Hoster und GitHub, ein überwachtes Postfach für `security.txt`, eine optionale PGP-Signatur durch einen Menschen und eine Erinnerung vor `Expires`. · Korrektur: Diese Punkte in MENSCHEN aufnehmen.

- **[NICE] · CSP-Feinheiten** · Problem und Korrektur:
  - `upgrade-insecure-requests` bringt bei rein relativen URLs, HSTS und S19 nichts und kann im http-Vorschau-Server Ressourcen auf https umbiegen → streichen.
  - `Disallow: /daten/` verhindert, dass Crawler das `X-Robots-Tag` überhaupt sehen → nur noindex verwenden.
  - Font-Preload mit `crossorigin`, ohne `integrity`.

- **[NICE] · Lizenzen** · Problem und Korrektur:
  - GeoNames (CC BY 4.0): Urheber, Lizenzlink und den Hinweis „verändert“ angeben; die Lizenz der PLZ-Dateien je Land im readme prüfen.
  - OFL: `OFL.txt` mit ausliefern (in die S14-Allowlist), die `name`-Tabelle nicht entfernen, modifizierte Schriften nicht umbenennen, ohne den reservierten Schriftnamen zu prüfen.

- **[NICE] · BFSG** · Problem: Ohne elektronischen Vertragsschluss und als Kleinstunternehmen (§ 3 Abs. 3) gilt das BFSG voraussichtlich nicht. · Korrektur: `/barrierefreiheit/` als freiwillige Erklärung ohne „WCAG-konform“. Bei Online-Buchung neu prüfen.

- **[NICE] · Lieferkette** · Problem und Korrektur: Die Werkzeuge mit `env -i` starten (ohne Token) und nur ins lokale Netz lassen. `npm audit signatures` ausführen und nur Versionen nehmen, die mindestens 14 Tage alt sind. Die ZIPs nur per `unzip -p` lesen.

### Critical Files for Implementation
- /root/.claude/plans/nutze-das-was-vorhanden-bright-sphinx.md
- /home/user/schluesseldienst/src/konfig/sicherheit.mjs (neu)
- /home/user/schluesseldienst/bau/pruefen/sicherheit.mjs (neu)
- /home/user/schluesseldienst/bau/vorschau.mjs (neu)
- /home/user/schluesseldienst/src/konfig/betrieb.mjs (neu; Impressum-, USt- und Zonenfreigabe-Felder)