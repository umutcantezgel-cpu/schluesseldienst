// Link-Prüfer: interne Ziele existieren, Anker existieren, Schreibweise (Schrägstrich, kein index.html),
// Linkgraph (Erreichbarkeit ab Startseite, Klicktiefe, eingehende Links).
export const name = 'links';

export async function pruefe(ctx) {
  const befunde = [];
  const b = (regel, schwere, datei, meldung) => befunde.push({ regel: `links/${regel}`, schwere, datei, meldung });
  const dateien = new Set(ctx.dateien);
  const seitenPfade = new Set(ctx.seiten.map((s) => s.pfad));
  const kanten = new Map();
  const eingehend = new Map();
  const ids = new Map();
  const geplantFehlt = new Set();
  for (const s of ctx.seiten) ids.set(s.pfad, new Set([...s.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));

  for (const s of ctx.seiten) {
    const ziele = new Set();
    for (const m of s.html.matchAll(/<(a|link|script|img|source|use)\b[^>]*\s(href|src)="([^"]+)"/g)) {
      const [, tag, , url] = m;
      if (/^(https?:|mailto:|tel:)/.test(url)) continue;
      if (url.startsWith('#')) {
        if (tag === 'use' || url === '#') { if (url !== '#' && !ids.get(s.pfad).has(url.slice(1))) b('anker', 'fehler', s.datei, `Anker fehlt: ${url}`); continue; }
        if (!ids.get(s.pfad).has(url.slice(1))) b('anker', 'fehler', s.datei, `Anker fehlt: ${url}`);
        continue;
      }
      const [pfad, anker] = url.split('#');
      if (!pfad.startsWith('/')) { b('relativ', 'fehler', s.datei, `Relativer Link: ${url}`); continue; }
      if (/index\.html$/.test(pfad)) b('index-html', 'fehler', s.datei, `Link mit index.html: ${url}`);
      const istSeite = pfad.endsWith('/');
      const ziel = istSeite ? pfad + 'index.html' : pfad;
      if (!dateien.has(ziel)) {
        // Außerhalb des Release: Ziele aus dem Routenregister sind geplant (Sammelhinweis), alles andere ein Fehler.
        if (ctx.modus !== 'release' && istSeite && ctx.geplant?.(pfad)) geplantFehlt.add(pfad);
        else b('ziel-fehlt', 'fehler', s.datei, `Ziel fehlt: ${url}`);
        continue;
      }
      if (!istSeite && tag === 'a' && !/\.[a-z0-9]+$/.test(pfad)) b('schraegstrich', 'fehler', s.datei, `Seitenlink ohne Schrägstrich: ${url}`);
      if (anker && istSeite && seitenPfade.has(pfad) && !ids.get(pfad)?.has(anker)) b('anker', 'fehler', s.datei, `Anker fehlt im Ziel: ${url}`);
      if (tag === 'a' && istSeite && pfad !== s.pfad) ziele.add(pfad);
    }
    kanten.set(s.pfad, ziele);
    for (const z of ziele) eingehend.set(z, (eingehend.get(z) || 0) + 1);
  }

  // Linkgraph ab Startseite (nur wenn vorhanden)
  if (seitenPfade.has('/')) {
    const tiefe = new Map([['/', 0]]);
    const schlange = ['/'];
    while (schlange.length) {
      const p = schlange.shift();
      for (const z of kanten.get(p) || []) if (!tiefe.has(z)) { tiefe.set(z, tiefe.get(p) + 1); schlange.push(z); }
    }
    for (const s of ctx.seiten) {
      if (!s.indexierbar) continue;
      if (!tiefe.has(s.pfad)) b('waise', 'fehler', s.datei, 'Von der Startseite nicht erreichbar');
      else if (tiefe.get(s.pfad) > 4) b('klicktiefe', 'warnung', s.datei, `Klicktiefe ${tiefe.get(s.pfad)} (> 4)`);
      if ((eingehend.get(s.pfad) || 0) < 3 && s.pfad !== '/') b('eingehend', 'warnung', s.datei, `${eingehend.get(s.pfad) || 0} eingehende Links (< 3)`);
    }
    const tiefen = [...tiefe.values()];
    befunde.push({ regel: 'links/graph', schwere: 'info', meldung: `erreichbar ${tiefe.size}/${ctx.seiten.length}, max. Tiefe ${Math.max(...tiefen)}` });
  }
  if (geplantFehlt.size) befunde.push({ regel: 'links/geplant', schwere: 'info', meldung: `${geplantFehlt.size} verlinkte Ziele noch nicht gebaut (Routenregister): ${[...geplantFehlt].sort().join(', ')}` });
  return befunde;
}
