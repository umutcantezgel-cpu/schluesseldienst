// Erreichbarkeitsstatus (M-04, ohne Animation): berechnet aus den konfigurierten Zeiten (Europe/Berlin).
// data-zeiten: kompakte Form „08:00-18:00|…|“ (zeitenAlsText, Mo→So) · data-nacht: "true"|"false"|""
import { zustandBerechnen, zeitenAusText } from '../logik/erreichbarkeit.mjs';

export function erreichbarkeit(el) {
  const roh = el.getAttribute('data-zeiten');
  if (!roh) return;
  const zeiten = zeitenAusText(roh);
  if (!zeiten) return;
  const nacht = el.getAttribute('data-nacht') === 'true';
  const aktualisieren = () => {
    const z = zustandBerechnen(zeiten, nacht, new Date());
    el.textContent = z.text;
    el.closest('.rufknopf')?.setAttribute('data-zustand', z.zustand);
  };
  aktualisieren();
  setInterval(aktualisieren, 60_000);
}
