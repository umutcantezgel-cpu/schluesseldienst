// Leistungsseite Zusatzschlösser (V03) – eigene Texte nach Themenpass /einbruchschutz/zusatzschloesser/
// (src/konfig/themenpaesse.mjs). Blickwinkel: Vergleich von Kastenzusatzschloss und Querriegel nach Tür,
// Wand und Alltag, mit den Grenzen in der Mietwohnung. Keine Zahlen, Normen oder Preise (K-010).
export default {
  titel: 'Zusatzschloss Wohnungstür: Querriegel oder Kastenschloss',
  beschreibung: 'Zusatzschloss für die Wohnungstür: Kastenzusatzschloss und Querriegel im Vergleich, mit Voraussetzungen an Tür und Mauerwerk und Hinweisen für Mieter.',
  h1: 'Zusatzschloss für die Wohnungstür',
  kurz: 'Ein Zusatzschloss gibt der Wohnungstür einen zweiten Halt im Rahmen oder im Mauerwerk. Welche Bauart passt, hängt von Tür, Wand und Alltag ab. In einer Mietwohnung sprechen Sie den Einbau vorher mit der Vermietung ab.',
  blick: [
    { titel: 'Kastenzusatzschloss', text: 'greift in den Rahmen und braucht Platz' },
    { titel: 'Querriegel', text: 'schiebt einen Riegel quer ins Mauerwerk' },
    { titel: 'Voraussetzung', text: 'Tür und Mauerwerk müssen es tragen' },
    { titel: 'Mietwohnung', text: 'vorher mit der Vermietung absprechen' },
  ],
  figurText: 'Die ganze Tür: Zylinder, Beschlag, Verriegelungen, Bandseite und Querriegel.',
  abschnitte: [
    {
      titel: 'Kastenzusatzschloss und Querriegel im Vergleich',
      absaetze: [
        'Ein Kastenzusatzschloss wird meist innen auf die Tür montiert. Sein Riegel greift in den Rahmen und verstärkt dort die Verriegelung.',
        'Ein Querriegel verläuft waagerecht von der Tür in die Wand neben dem Rahmen und greift dort ins Mauerwerk.',
      ],
      liste: [
        'Kastenzusatzschloss: braucht Platz in Tür und Rahmen.',
        'Querriegel: braucht festes Mauerwerk neben der Tür.',
        'Beide: wirken nur, wenn die Tür selbst stabil ist.',
      ],
    },
    {
      titel: 'Voraussetzungen an Tür und Mauerwerk',
      absaetze: [
        'Ein Zusatzschloss ist nur so stark wie die Stelle, an der es hält. Die Tür muss die Kräfte aufnehmen, der Rahmen muss fest in der Wand verankert sein.',
        'Wie tragfähig die Wand ist, sieht man nicht immer von außen. Ein Blick auf Rahmen und Wandaufbau zeigt meist mehr als eine Vermutung.',
        'Das Hauptschloss bleibt ein eigenes Thema, dazu [Türschlösser](/einbruchschutz/tuerschloesser/).',
      ],
    },
    {
      titel: 'Mietwohnung: Absprache mit Vermietern',
      absaetze: [
        'Ein Zusatzschloss greift meist in den Rahmen oder in die Wand. Das verändert die Wohnung, deshalb sollten Mieter den Einbau vorher besprechen.',
        'Ob gebohrt werden darf, steht im Mietvertrag oder wird im Einzelfall entschieden. Eine kurze schriftliche Bestätigung der Vermietung schafft Klarheit.',
      ],
    },
    {
      titel: 'Bedienung im Alltag',
      absaetze: [
        'Ein Riegel wirkt nur, wenn er auch vorgeschoben wird. Überlegen Sie vorher, wer die Tür täglich benutzt und wie oft der Riegel bewegt werden muss.',
        'Im Notfall sollte sich die Tür von innen schnell öffnen lassen. Ein Riegel, der nur mit Schlüssel aufgeht, ist dafür ungeeignet.',
      ],
    },
  ],
  faq: [
    { frage: 'Welches Zusatzschloss passt zu einer Altbautür?', antwort: 'Das hängt davon ab, wie die Tür gebaut ist und was im Mauerwerk hält. Eine verlässliche Empfehlung braucht den Blick auf die Tür.' },
    { frage: 'Brauche ich als Mieter eine Erlaubnis für ein Zusatzschloss?', antwort: 'Das hängt vom Mietvertrag ab und davon, ob etwas gebohrt werden muss. Fragen Sie die Vermietung vor dem Einbau. Das gilt auch für kleine Bohrungen.' },
    { frage: 'Hält ein Querriegel auch in einer Leichtbauwand?', antwort: 'Meist nicht so gut wie in festem Mauerwerk. In einer Leichtbauwand fehlt dem Riegel der feste Halt. Dann lohnt eine Prüfung der ganzen Tür mehr als ein Querriegel allein.' },
  ],
  weiter: [
    { pfad: '/einbruchschutz/tuersicherung/', titel: 'Türsicherung', text: 'Bandseite und Sperrbügel als weitere Schicht.' },
    { pfad: '/ratgeber/einbruchschutz-wohnung/', titel: 'Einbruchschutz in der Wohnung', text: 'Wohnungstür und Erdgeschossfenster im Zusammenhang sehen.' },
    { pfad: '/einbruchschutz/tuerschloesser/', titel: 'Türschloss austauschen', text: 'Das Hauptschloss und die Schließseite der Tür.' },
  ],
};
