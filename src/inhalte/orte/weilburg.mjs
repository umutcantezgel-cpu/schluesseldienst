// Sonderseite Weilburg (Sitz des Betriebs), von Hand geschrieben. Hauptsuchbegriff laut Themenpass-Muster:
// „schlüsseldienst weilburg stadtteile“ (die Startseite trägt „schlüsseldienst weilburg“).
// Der Tunnel-Fakt ist bis zur Prüfung als „verifizieren“ markiert (Faktenblatt weilburg-tunnel).
import { fakt } from '../../../bau/lib/fakten.mjs';

export default {
  titel: 'Schlüsseldienst in Weilburg und allen Stadtteilen',
  beschreibung: 'Schlüsseldienst mit Sitz in Weilburg: Türöffnung, Schlosstausch und Einbruchschutz in der Kernstadt und in allen Stadtteilen an der Lahn.',
  h1: 'Schlüsseldienst in Weilburg und seinen Stadtteilen',
  einleitung: 'Hier sitzt unser Betrieb. Von der Kernstadt bis in die Stadtteile ist unser Weg zu Ihnen kurz – ob die Tür ins Schloss gefallen ist oder Sie Ihr Haus besser sichern möchten.',
  abschnitte: [
    {
      titel: 'Viele Türen, ein Grundsatz',
      absaetze: [
        'In Weilburg treffen sehr unterschiedliche Türen aufeinander: alte Haustüren in der Altstadt, Mehrfamilienhäuser mit Schließanlage, neuere Häuser mit Mehrfachverriegelung. Für jede suchen wir zuerst den Weg, der nichts beschädigt.',
        'Ob [Türöffnung](/notoeffnung/tueroeffnung/), [Schließzylinder](/einbruchschutz/schliesszylinder/) oder [Einbruchschutz](/einbruchschutz/): Den Gesamtpreis finden Sie vorab auf der [Preisseite](/preise/).',
      ],
    },
    {
      titel: 'Der gerade Weg',
      absaetze: [
        ['Wie der ', fakt({ id: 'weilburg-tunnel.abkuerzung', text: 'Weilburger Schiffstunnel die Lahnschleife abkürzt', quelle: 'weilburg-tunnel', status: 'verifizieren' }), ', suchen wir in jedem Schloss die eine Linie, auf der es ohne Gewalt aufgeht. Ruhig im Ton, präzise im Handwerk, offen im Preis.'],
      ],
    },
  ],
};
