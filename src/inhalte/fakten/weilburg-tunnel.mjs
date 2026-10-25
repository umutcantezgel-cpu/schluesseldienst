// Faktenblatt weilburg-tunnel: Weilburger Schiffstunnel. Stand 2026-10-25. Alle Fakten „verifizieren“, bis der Mensch prüft (MENSCHEN.md §3).
import { fakt } from '../../../bau/lib/fakten.mjs';

export const quellen = [
  { id: 'q1', titel: 'Stadt Weilburg – Seite „Schiffstunnel“ (Sehenswerte Bauwerke, ohne Stand-Datum)', url: 'https://www.weilburg.de/kultur-tourismus/sehenswuerdigkeiten-ausflugsziele/sehenswerte-bauwerke/schiffstunnel/', art: 'primaer', abgerufen: '2026-10-25' },
  { id: 'q2', titel: 'Denkmalverzeichnis des Landes Hessen (DenkXweb) – Objekt 52395 „Schifffahrtstunnel (Weilburg)“ (ohne Stand-Datum)', url: 'https://denkxweb.denkmalpflege-hessen.de/52395/', art: 'primaer', abgerufen: '2026-10-25' },
];

export default {
  id: 'weilburg-tunnel',
  thema: 'Weilburger Schiffstunnel',
  stand: '2026-10-25',
  frage: 'Was ist belegt zu Lage, Bauzeit, Länge und Besonderheit des Schiffstunnels an der Lahn in Weilburg?',
  fakten: {
    'abkuerzung': fakt({ id: 'weilburg-tunnel.abkuerzung', text: 'Der Weilburger Schiffstunnel kürzt die Lahnschleife ab.', quelle: 'q1', status: 'verifizieren' }),
    'lahnbogen': fakt({ id: 'weilburg-tunnel.lahnbogen', text: 'Nach Angaben der Stadt Weilburg vermeidet der Tunnel einen rund zwei Kilometer langen Lahnbogen mit zwei Wehren.', quelle: 'q1', status: 'verifizieren' }),
    'lage': fakt({ id: 'weilburg-tunnel.lage', text: 'Der Tunnel unterquert den Mühlberg, auf dem die Stadt Weilburg liegt, von Norden nach Süden.', quelle: 'q1', status: 'verifizieren' }),
    'laenge': fakt({ id: 'weilburg-tunnel.laenge', text: 'Der Schiffstunnel hat eine Länge von 195 Metern.', quelle: 'q2', status: 'verifizieren' }),
    'bauzeit': fakt({ id: 'weilburg-tunnel.bauzeit', text: 'Der Tunnel wurde von 1844 bis 1847 errichtet.', quelle: 'q1', status: 'verifizieren' }),
    'eroeffnung': fakt({ id: 'weilburg-tunnel.eroeffnung', text: 'Der Tunnel wurde am 18. September 1847 eröffnet.', quelle: 'q1', status: 'verifizieren' }),
    'denkmal': fakt({ id: 'weilburg-tunnel.denkmal', text: 'Der Schifffahrtstunnel Weilburg ist als Kulturdenkmal nach § 2 Abs. 1 des Hessischen Denkmalschutzgesetzes im Denkmalverzeichnis des Landes Hessen eingetragen.', quelle: 'q2', status: 'verifizieren' }),
    'besonderheit': fakt({ id: 'weilburg-tunnel.besonderheit', text: 'Nach Angaben der Stadt Weilburg ist der Tunnel der älteste und zugleich längste heute noch befahrbare Schiffstunnel Deutschlands.', quelle: 'q1', status: 'verifizieren' }),
  },
  offen: [
    'Korrektur nötig, nicht in diesem Paket geändert: Der Seitentext in src/inhalte/orte/weilburg.mjs sagt „die Lahnschleife unter dem Schlossberg“. Die Stadt Weilburg und das Denkmalverzeichnis nennen den Mühlberg. Die Aussage mit Schlossberg ist nicht belegt. Der Fakt abkuerzung ist deshalb ohne diese Ortsangabe angelegt. Der Seitentext muss vom Hauptagenten angepasst werden.',
    'Der Baubeginn ist nicht belegt; genannt werden nur die Jahre 1844 bis 1847. Die Regierung soll dem Projekt laut Stadt am 18. Juli 1843 zugestimmt haben; das ist nicht als Fakt aufgenommen.',
    'Lage: Flur 6 und 8 nennt das Denkmalverzeichnis; die Gemarkung ist laut Eintrag nicht eindeutig ausgewiesen. Die Denkmalnummer ist nicht angegeben. Nicht übernommen.',
    'Die Besonderheit „ältester und längster befahrbarer Schiffstunnel Deutschlands“ ist eine Superlativaussage der Stadt. Auf den Seiten gilt nach KERN K-010 kein Superlativ. Der Fakt ist nur mit Quellenangabe aufgenommen; die Verwendung im Text entscheidet der Mensch.',
    'Die Wasserstraßenverwaltung des Bundes war als Quelle nicht zu finden. Angaben aus KuLaDig, Wanderportalen und einem Reiseportal stimmen überein (195 Meter, 1844 bis 1847), sind aber keine Behörden- oder Stadtquellen und wurden nicht als Quelle genutzt.',
    'Beide Quellen nennen kein Stand-Datum. Der Abruf ist vom 2026-10-25.',
  ],
};
