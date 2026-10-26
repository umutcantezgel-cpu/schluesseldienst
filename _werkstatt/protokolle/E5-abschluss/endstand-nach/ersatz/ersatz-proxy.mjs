// Ersatzmessung (nur in meinem Ordner, nichts wird veröffentlicht): Proxy auf 127.0.0.1:4298 vor der Vorschau 4251.
// Ersetzt in HTML-Antworten den Anrufknopf-Platzhalter (span ohne Nummer, U-6) durch einen tel:-Link mit Testnummer,
// damit die Tastaturwege zum Anruf gemessen werden können. Alle anderen Antworten bleiben unverändert.
import http from 'node:http';
const ZIEL = 'http://127.0.0.1:4251';
const TEST_NUMMER = '+49 6471 000000';
const TEST_TEL = 'tel:+496471000000';
const MUSTER = /<span class="rufknopf (rufknopf-[a-z]+)" data-zustand="platzhalter">([\s\S]*?)\[Telefonnummer\]<\/span><\/span><\/span><\/span>/g;
let ersetzt = 0;
const server = http.createServer((anfrage, antwort) => {
  const opts = { host: '127.0.0.1', port: 4251, path: anfrage.url, method: anfrage.method, headers: { ...anfrage.headers, host: '127.0.0.1:4251', 'accept-encoding': 'identity' } };
  const up = http.request(opts, (res) => {
    const typ = res.headers['content-type'] || '';
    if (!typ.startsWith('text/html')) { antwort.writeHead(res.statusCode, res.headers); return res.pipe(antwort); }
    const teile = [];
    res.on('data', (d) => teile.push(d));
    res.on('end', () => {
      let text = Buffer.concat(teile).toString('utf8');
      text = text.replace(MUSTER, (_, klasse, innen) => { ersetzt++; return `<a class="rufknopf ${klasse}" href="${TEST_TEL}">${innen}${TEST_NUMMER}</span></span></span></a>`; });
      const kopf = { ...res.headers }; delete kopf['content-length']; delete kopf['content-encoding']; delete kopf['transfer-encoding'];
      antwort.writeHead(res.statusCode, kopf);
      antwort.end(text);
    });
  });
  up.on('error', () => { antwort.writeHead(502); antwort.end('502'); });
  anfrage.pipe(up);
});
server.listen(4298, '127.0.0.1', () => console.log('ersatz-proxy auf 4298 -> 4251'));
setInterval(() => console.log(`ersetzt bisher: ${ersetzt}`), 60000).unref();
