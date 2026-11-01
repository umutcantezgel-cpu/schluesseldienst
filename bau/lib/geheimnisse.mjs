// Geheimnis-Muster (Schlüssel, Token, Tracking-Kennungen): eine Quelle für den Sicherheitsprüfer (S09) und die
// Prüfung der Betriebswerte. Ein Treffer nennt nur die Regel, nie den gefundenen Wert.
export const GEHEIM = [
  ['google-api-schluessel', /AIza[0-9A-Za-z_-]{35}/],
  ['site-verification', /google-site-verification/i],
  ['analytics-kennung', /\b(G-[A-Z0-9]{6,}|UA-\d{4,}-\d+|GTM-[A-Z0-9]{4,})\b/],
  ['aws-schluessel', /AKIA[0-9A-Z]{16}/],
  ['privater-schluessel', /-----BEGIN [A-Z ]*PRIVATE KEY/],
  ['github-token', /gh[pousr]_[A-Za-z0-9]{30,}/],
  ['jwt', /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\./],
];

/** Regeln, deren Muster im Text vorkommen (leer = nichts gefunden). */
export const geheimnisTreffer = (text) => GEHEIM.filter(([, re]) => re.test(text)).map(([regel]) => regel);
