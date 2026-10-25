// JSON-LD-Prüfer: jeder <script type="application/ld+json"> einer gerenderten Seite muss gültiges JSON mit
// ehrlichem Inhalt sein. Keine Bewertungen, nur erlaubte Typen, Brotkrumen lückenlos und auf gerenderte Seiten,
// Preise als Zahl in EUR, FAQ-Fragen mit Antwort, im Release keine Platzhaltertexte.
export const name = 'jsonld';

const TYPEN = new Set([
  'Locksmith', 'WebSite', 'WebPage', 'AboutPage', 'ContactPage', 'CollectionPage', 'ItemList', 'ListItem',
  'BreadcrumbList', 'Service', 'Offer', 'UnitPriceSpecification', 'PriceSpecification', 'OfferCatalog',
  'FAQPage', 'Question', 'Answer', 'Article', 'Person', 'Place', 'GeoCoordinates', 'PostalAddress',
  'AdministrativeArea', 'City', 'Country', 'JobPosting', 'OpeningHoursSpecification', 'ImageObject',
]);
const BEWERTUNG_TYPEN = new Set(['AggregateRating', 'Review']);
const BEWERTUNG_SCHLUESSEL = new Set(['aggregaterating', 'review']);
const LOCKSMITH_PFADE = new Set(['/', '/ueber-uns/', '/kontakt/']);
const SKRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
const ATTRIBUT = /\s([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
const PLATZHALTER = /\[[^\[\]\n]*\]/;

function attribut(attrText, schluessel) {
  for (const m of attrText.matchAll(ATTRIBUT)) {
    if (m[1].toLowerCase() === schluessel) return m[2] ?? m[3] ?? m[4];
  }
  return undefined;
}

/** Inhalte aller JSON-LD-Skripte einer Seite (in Reihenfolge). */
function ldBloecke(html) {
  const ergebnis = [];
  for (const m of String(html ?? '').matchAll(SKRIPT)) {
    if (attribut(m[1], 'type')?.trim().toLowerCase() === 'application/ld+json') ergebnis.push(m[2]);
  }
  return ergebnis;
}

/** Besucht jeden Wert des JSON-Baums: Objekte (ohne @context-Inhalt) und Zeichenketten. */
function durchlaufe(wert, besucher) {
  if (typeof wert === 'string') besucher.zeichenkette(wert);
  else if (Array.isArray(wert)) for (const v of wert) durchlaufe(v, besucher);
  else if (wert && typeof wert === 'object') {
    besucher.objekt(wert);
    for (const [k, v] of Object.entries(wert)) if (k !== '@context') durchlaufe(v, besucher);
  }
}

function typenVon(o) {
  if (o['@type'] === undefined) return [];
  return Array.isArray(o['@type']) ? o['@type'] : [o['@type']];
}

export async function pruefe(ctx) {
  const befunde = [];
  const routen = new Set((ctx.seiten ?? []).map((s) => s.pfad));
  let basis = null;
  try { basis = new URL(ctx.basisUrl); } catch { basis = null; }
  const release = ctx.modus === 'release';
  const geplantFehlt = new Set();

  for (const seite of ctx.seiten ?? []) {
    const datei = seite.datei ?? seite.pfad;
    const melde = (regel, meldung, schwere = 'fehler') => befunde.push({ regel, schwere, datei, meldung });

    const zielOk = (ziel) => {
      if (typeof ziel !== 'string' || !basis) return false;
      let url;
      try { url = new URL(ziel); } catch { return false; }
      if (url.origin !== basis.origin) return false;
      if (routen.has(url.pathname)) return true;
      // Außerhalb des Release: geplante Routen (Routenregister/Muster) sind erlaubt, als Sammelhinweis.
      if (!release && ctx.geplant?.(url.pathname)) { geplantFehlt.add(url.pathname); return true; }
      return false;
    };

    const pruefeBrotkrumen = (o) => {
      const liste = o.itemListElement;
      if (!Array.isArray(liste) || liste.length === 0) {
        melde('jsonld/brotkrumen', 'BreadcrumbList ohne itemListElement');
        return;
      }
      liste.forEach((el, i) => {
        const soll = i + 1;
        if (!el || typeof el !== 'object' || Number(el.position) !== soll) {
          melde('jsonld/brotkrumen', `position ${JSON.stringify(el?.position) ?? '(fehlt)'} an Stelle ${soll}; lückenlos 1…${liste.length} verlangt`);
        }
        const ziel = typeof el?.item === 'string' ? el.item : el?.item?.['@id'];
        if (!zielOk(ziel)) {
          melde('jsonld/brotkrumen', `item ${JSON.stringify(ziel) ?? '(fehlt)'} ist keine absolute Adresse auf ${basis?.origin ?? '(basisUrl fehlt)'} mit gerenderter Seite`);
        }
      });
    };

    const pruefePreis = (o) => {
      const p = o.price;
      const zahl = (typeof p === 'number' && Number.isFinite(p)) || (typeof p === 'string' && /^\d+(\.\d+)?$/.test(p));
      if (!zahl) melde('jsonld/angebot', `price ist keine Zahl: ${JSON.stringify(p) ?? '(fehlt)'}`);
      if (o.priceCurrency !== 'EUR') melde('jsonld/angebot', `priceCurrency ist ${JSON.stringify(o.priceCurrency) ?? '(fehlt)'}, erwartet "EUR"`);
    };

    const pruefeFrage = (o) => {
      if (typeof o.name !== 'string' || o.name.trim() === '') melde('jsonld/faq', 'Question ohne name');
      const antwort = o.acceptedAnswer;
      if (!antwort || typeof antwort !== 'object' || typeof antwort.text !== 'string' || antwort.text.trim() === '') {
        melde('jsonld/faq', `Frage "${o.name ?? ''}": acceptedAnswer.text fehlt oder ist leer`);
      }
    };

    for (const block of ldBloecke(seite.html)) {
      let daten;
      try {
        daten = JSON.parse(block);
      } catch (e) {
        melde('jsonld/syntax', `JSON nicht lesbar: ${e.message}`);
        continue;
      }

      for (const wurzel of Array.isArray(daten) ? daten : [daten]) {
        if (!wurzel || typeof wurzel !== 'object' || Array.isArray(wurzel)) {
          melde('jsonld/syntax', 'Knoten ist kein Objekt');
          continue;
        }
        if (wurzel['@context'] !== 'https://schema.org') {
          melde('jsonld/kontext', `@context ist ${JSON.stringify(wurzel['@context']) ?? 'leer'}, erwartet "https://schema.org"`);
        }
      }

      durchlaufe(daten, {
        objekt(o) {
          for (const k of Object.keys(o)) {
            if (BEWERTUNG_SCHLUESSEL.has(k.toLowerCase())) melde('jsonld/bewertung', `Eigenschaft "${k}" ist verboten – keine Bewertungen`);
          }
          for (const t of typenVon(o)) {
            if (typeof t !== 'string') {
              melde('jsonld/typ', `@type ist kein Text: ${JSON.stringify(t)}`);
              continue;
            }
            if (BEWERTUNG_TYPEN.has(t)) {
              melde('jsonld/bewertung', `@type "${t}" ist verboten – keine Bewertungen`);
              continue;
            }
            if (!TYPEN.has(t)) {
              melde('jsonld/typ', `@type "${t}" ist nicht erlaubt`);
              continue;
            }
            if (t === 'Locksmith' && !LOCKSMITH_PFADE.has(seite.pfad)) {
              melde('jsonld/betrieb-je-ort', `Locksmith nur auf /, /ueber-uns/, /kontakt/ – hier ${seite.pfad}`);
            }
            if (t === 'BreadcrumbList') pruefeBrotkrumen(o);
            if (t === 'Offer' || t === 'UnitPriceSpecification') pruefePreis(o);
            if (t === 'Question') pruefeFrage(o);
          }
        },
        zeichenkette(text) {
          if (PLATZHALTER.test(text)) {
            melde('jsonld/platzhalter', `Platzhaltertext im Wert: "${text.slice(0, 60)}"`, release ? 'fehler' : 'info');
          }
        },
      });
    }
  }
  if (geplantFehlt.size) befunde.push({ regel: 'jsonld/geplant', schwere: 'info', meldung: `${geplantFehlt.size} Brotkrumen-Ziele noch nicht gebaut (Routenregister)` });
  return befunde;
}
