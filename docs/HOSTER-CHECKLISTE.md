# Hoster-Checkliste

Dieses Dokument beschreibt, was der Hoster leisten muss, was bei Domain und E-Mail einzurichten ist und wie ein Deploy abläuft. Die Begründungen stehen in `_werkstatt/MENSCHEN.md` (§5). Die Header-Werte, Cache-Regeln und MIME-Typen stehen in `src/konfig/sicherheit.mjs`; daraus erzeugt der Build die Hoster-Dateien.

Voraussetzung ist, dass [BETRIEB.md](BETRIEB.md) vollständig ist und der Release mit Exit-Code 0 durchläuft.

## 1. Anforderungen an den Hoster

- [ ] Serverstandort in der EU.
- [ ] Auftragsverarbeitungsvertrag nach Art. 28 DSGVO.
- [ ] IP-Adressen in Zugriffsprotokollen kürzen; Logs höchstens 14 Tage aufbewahren.
- [ ] Keine Cookies setzen. Die Datenschutzerklärung sagt: „Diese Website setzt keine Cookies.“ Das gilt auch für Cookies, die der Hoster setzt.
- [ ] Die Antwort-Header aus `kopfzeilen()` ausliefern: unter anderem `Content-Security-Policy` mit Trusted Types, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` und `Permissions-Policy`. Der Build liefert die Header über `_headers` (Netlify, Cloudflare), `.htaccess` (Apache) oder das nginx-Snippet mit. Der Hoster darf sie nicht überschreiben.
- [ ] Keine Skripte durch den Hoster einschleusen lassen. Abschalten: Cloudflare „Rocket Loader“, „E-Mail-Verschleierung“ und „Web Analytics“; bei Netlify „Snippet Injection“.
- [ ] MIME-Typen wie in der Tabelle `MIME`: HTML, CSS, JavaScript, JSON, SVG, WOFF2, `.txt` für `security.txt`, `.webmanifest`.
- [ ] Cache-Regeln wie in `CACHE`: `/assets/*` ein Jahr und unveränderlich; `/daten/*` ein Jahr mit `X-Robots-Tag: noindex`; `robots.txt` und Sitemaps eine Stunde; alles übrige `no-cache`.
- [ ] Unbekannte Adressen liefern den Status 404 mit der Seite `/404.html`. Die Apache-Datei setzt das per `ErrorDocument`, die nginx-Datei per `error_page`.
- [ ] Umleitung von http auf https mit 301. Die Apache- und nginx-Dateien enthalten sie.
- [ ] Weiterleitungen: Die Regeln aus `src/daten/weiterleitungen.json` stehen bereits in der erzeugten Datei (`.htaccess`, nginx-Snippet, `_redirects`). Der Hoster muss sie nur auswerten.

## 2. Domain und DNS

- [ ] Schreibweise festlegen, mit oder ohne `www`. `betrieb.basisUrl` muss genau diesen Host nennen. Die andere Schreibweise per Weiterleitung auf die gewählte führen.
- [ ] HSTS: Der Header steht mit `max-age=63072000; includeSubDomains`, ohne `preload`. Den HSTS-Preload erst beantragen, wenn die HTTPS-Konfiguration stabil ist (MENSCHEN §5).
- [ ] DNSSEC aktivieren.
- [ ] CAA-Eintrag setzen, der nur den Zertifikatsaussteller des Hosters erlaubt.
- [ ] Registrar-Sperre (Domain-Lock) aktivieren.
- [ ] Zwei-Faktor-Anmeldung bei Registrar, Hoster und GitHub.
- [ ] E-Mail-Authentifizierung: SPF, DKIM und DMARC mit `p=reject`. So lassen sich gefälschte Notdienst-Mails abweisen.
- [ ] Ein überwachtes Postfach für `security.txt` einrichten. Die Datei nennt `betrieb.email` als Kontakt und ein Ablaufdatum (`Expires`), das 365 Tage nach dem Build-Datum liegt. Setzen Sie eine Erinnerung vor dem Ablauf; ein neuer Release mit neuem `--datum` erneuert die Datei.

## 3. Ablauf eines Deploys

1. **Vorbereitung.** `docs/BETRIEB.md` ist vollständig. `npm test` und `npm run pruefen` melden keine Fehler.
2. **Release bauen.** `npm run release -- --ziel=<apache|nginx|netlify|cloudflare>` schreibt die Ausgabe nach `dist/`. Hochgeladen wird nur bei Exit-Code 0. Bei Exit-Code 1 oder 2 wird nichts hochgeladen, auch wenn `dist/` geschrieben wurde.
3. **Hochladen.** Den gesamten Inhalt von `dist/` übertragen, mit `.htaccess` (Apache) bzw. `_headers` und `_redirects` (Netlify, Cloudflare). Bei nginx gehört das Snippet aus `release/nginx/` in die Serverkonfiguration; der Build legt es nicht in `dist/` ab.
4. **Live-Prüfung.** Nach dem Deploy:

   ```sh
   node _werkstatt/werkzeuge/live-check.mjs --basis https://<domain> --dist dist --aus .cache/live-check.json
   ```

   Das Werkzeug liest nur. Es prüft Header, Status, Cache, MIME-Typen, 404-Seite, Weiterleitungen und die Umleitung auf https. Exit-Code 0 bedeutet: keine Fehler. Exit-Code 1 bedeutet mindestens einen Fehler; die Einzelheiten stehen in der JSON-Datei. Exit-Code 2 bedeutet einen Fehler im Werkzeug, das Ergebnis ist dann unvollständig.
5. **Nur live prüfbar.** Die Header beim Hoster lassen sich nur nach dem Deploy prüfen. Bei einer http-Adresse, etwa einem lokalen Vorschau-Server, überspringt das Werkzeug die HSTS-Prüfung und die Umleitung auf https; das ist erwartet.

Nach dem Deploy halten Sie das Datum des Builds und das Ergebnis der Live-Prüfung fest.
