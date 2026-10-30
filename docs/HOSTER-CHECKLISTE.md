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

- [ ] Schreibweise festlegen, mit oder ohne `www`. Die Adresse der Website (`betrieb.basis-url` in Supabase, siehe [BETRIEB.md](BETRIEB.md), Abschnitt „Betriebswerte in Supabase“) muss genau diesen Host nennen. Die andere Schreibweise per Weiterleitung auf die gewählte führen.
- [ ] HSTS: Der Header steht mit `max-age=63072000; includeSubDomains`, ohne `preload`. Den HSTS-Preload erst beantragen, wenn die HTTPS-Konfiguration stabil ist (MENSCHEN §5).
- [ ] DNSSEC aktivieren.
- [ ] CAA-Eintrag setzen, der nur den Zertifikatsaussteller des Hosters erlaubt.
- [ ] Registrar-Sperre (Domain-Lock) aktivieren.
- [ ] Zwei-Faktor-Anmeldung bei Registrar, Hoster, GitHub und Supabase. Wer Supabase oder GitHub übernimmt, kann die Notrufnummer ändern; der Pull Request der Übernahme hebt solche Änderungen deshalb hervor.
- [ ] E-Mail-Authentifizierung: SPF, DKIM und DMARC mit `p=reject`. So lassen sich gefälschte Notdienst-Mails abweisen.
- [ ] Ein überwachtes Postfach für `security.txt` einrichten. Die Datei nennt `betrieb.email` als Kontakt und ein Ablaufdatum (`Expires`), das 365 Tage nach dem Build-Datum liegt. Setzen Sie eine Erinnerung vor dem Ablauf; ein neuer Release mit neuem `--datum` erneuert die Datei.

## 3. Ablauf eines Deploys

1. **Vorbereitung.** `docs/BETRIEB.md` ist vollständig: Der Pull Request der letzten Übernahme aus Supabase ist zusammengeführt, und `npm run betriebswerte -- --liste` meldet „0 offen“. `npm test` und `npm run pruefen` melden keine Fehler. Der Release liest `src/daten/betriebswerte.json` aus dem Commit und verweigert eine lokal geänderte Datei.
2. **Release bauen.** `npm run release -- --ziel=<apache|nginx|netlify|cloudflare>` schreibt die Ausgabe nach `dist/`. Für Apache und nginx ohne eigene Kompression zusätzlich `--vorkomprimieren` (legt `.br`/`.gz` an, beim ersten Lauf etwa 1 bis 1,5 Minuten zusätzlich; Apache braucht dafür mod_rewrite, mod_headers, mod_mime und mod_setenvif – alle Standard –, nginx `gzip_static`, Brotli nur mit dem Zusatzmodul ngx_brotli). Hochgeladen wird nur bei Exit-Code 0. Bei Exit-Code 1 verschiebt der Build die Ausgabe nach `dist.verweigert/`, bei Exit-Code 2 entsteht keine Ausgabe – in beiden Fällen wird nichts hochgeladen.
3. **Hochladen.** Den gesamten Inhalt von `dist/` übertragen, mit `.htaccess` (Apache) bzw. `_headers` und `_redirects` (Netlify, Cloudflare). Bei nginx gehört das Snippet aus `release/nginx/` in die Serverkonfiguration; der Build legt es nicht in `dist/` ab.
4. **Live-Prüfung.** Nach dem Deploy:

   ```sh
   node _werkstatt/werkzeuge/live-check.mjs --basis https://<domain> --dist dist --aus .cache/live-check.json
   ```

   Das Werkzeug liest nur. Es prüft Header, Status, Cache, MIME-Typen, 404-Seite, Weiterleitungen und die Umleitung auf https. Exit-Code 0 bedeutet: keine Fehler. Exit-Code 1 bedeutet mindestens einen Fehler; die Einzelheiten stehen in der JSON-Datei. Exit-Code 2 bedeutet einen Fehler im Werkzeug, das Ergebnis ist dann unvollständig.
5. **Nur live prüfbar.** Die Header beim Hoster lassen sich nur nach dem Deploy prüfen. Bei einer http-Adresse, etwa einem lokalen Vorschau-Server, überspringt das Werkzeug die HSTS-Prüfung und die Umleitung auf https; das ist erwartet.

Nach dem Deploy halten Sie das Datum des Builds und das Ergebnis der Live-Prüfung fest.

## 4. Test-Deploy der Vorschau (Netlify, Vercel)

Solange der Release an Platzhaltern scheitert, kann die Vorschau auf einer Test-Domain laufen. Sie ist nicht indexierbar: meta robots `noindex`, `robots.txt` mit `Disallow: /` und der Header `X-Robots-Tag: noindex`. Platzhalter und Rechtstext-Entwürfe sind sichtbar; die Test-Domain deshalb nicht bewerben oder verlinken.

- [ ] **Netlify:** Repository importieren; `netlify.toml` setzt Bau-Befehl (`--ziel=netlify --basis=$URL`), Ausgabe `dist/` und Node 22. Unter Site configuration „Snippet injection“ leer lassen und den „Netlify Drawer“ für Deploy Previews abschalten. `netlify.toml` nimmt die Wettbewerber-Rohdaten vom Geheimnis-Scan aus (`SECRETS_SCAN_OMIT_PATHS`): Sie enthalten einen fremden, öffentlichen Google-Schlüssel, der den Deploy sonst abbricht; ausgeliefert werden sie nie.
- [ ] **Vercel:** Repository importieren, Framework „Other“; `vercel.json` setzt Bau-Befehl (`--ziel=vercel`, Adresse aus `VERCEL_PROJECT_PRODUCTION_URL`), Ausgabe `dist/`, Header, `trailingSlash` und Weiterleitungen mit 301. Die Vercel Toolbar abschalten. Ohne `.git` im Vercel-Bau nutzt die Vorschau das Ersatzdatum 2026-01-01 (Hinweis im Bau-Log).
- [ ] Nach dem ersten Deploy die Live-Prüfung aus Abschnitt 3 gegen die Test-Adresse laufen lassen. Erwartete Abweichungen: HTML mit dem Cache-Standard des Hosters statt `no-cache`; bei Vercel leitet http mit 308 statt 301 auf https; bei Vercel antwortet die 404-Stichprobe des Werkzeugs (Pfad ohne „/“ am Ende) mit 308 auf den Pfad mit „/“ und ohne Sicherheits-Header, weil `trailingSlash` vor den Headern greift – der Pfad mit „/“ liefert dann 404 mit allen Headern; die Hoster können eigene HSTS-Header ergänzen.
- [ ] **Vor dem Release auf einer echten Domain:** `X-Robots-Tag: noindex` steht in der Netlify-Vorschau nur im Bau, in `vercel.json` dauerhaft. Für Netlify genügt der Release-Bau (`npm run release -- --ziel=netlify`, Bau-Befehl in `netlify.toml` anpassen). Für Vercel gibt es noch keine Release-Fassung von `vercel.json` (ohne noindex, Bau mit `--release`, Datum ohne `.git` über `--datum`); siehe `docs/OFFENE-PUNKTE.md` Nr. 49.

