// Kontakt-Composer (V10, K-009): Anliegen → Felder → mailto:. „Notfall jetzt“ zeigt das Ruf-Panel statt der
// E-Mail-Felder. Fehlerübersicht mit Fokus, Feldfehler über aria-invalid/aria-describedby; der Knopf ist nie
// deaktiviert. Ohne JS sendet das Formular nativ (method=get, nur subject und body). Ohne Empfänger (Platzhalter in der
// Vorschau) ist der Composer eine Gruppe ohne <form>: Absenden über den Knopf, statt des Mail-Programms erscheint der
// Grund. Der Briefkopf der Vorlage zeigt Empfänger und Betreff so, wie die E-Mail sie trägt; der Betreff folgt Anliegen
// und Ort. Nur DOM-sichere APIs.
import { mailtoUrl, pruefen, zeile } from '../logik/mailto.mjs';

export function composer(form) {
  const an = form.getAttribute('data-an');
  const uebersicht = form.querySelector('[data-rolle="fehler"]');
  const liste = uebersicht?.querySelector('ul');
  const notfall = form.querySelector('[data-rolle="notfall"]');
  const mailteil = form.querySelector('[data-rolle="mail"]');
  const hinweis = form.querySelector('[data-rolle="gekuerzt"]');
  const ohneAdresse = form.querySelector('[data-rolle="ohne-adresse"]');
  // Zusatzfelder ohne name-Attribut: nur mit JS sinnvoll, deshalb erst jetzt sichtbar
  for (const el of form.querySelectorAll('[data-nur-js]')) el.hidden = false;

  const anliegen = () => form.querySelector('input[name="anliegen"]:checked');
  const ortFeld = form.querySelector('#k-ort');
  const betreffZeile = form.querySelector('[data-rolle="betreff"]');
  // Derselbe Betreff für Briefkopf und E-Mail: Anliegen, dahinter der Ort, sobald einer eingetragen ist
  const betreff = () => {
    const ort = zeile(ortFeld?.value ?? '');
    return `${anliegen()?.getAttribute('data-betreff') || 'Anfrage'}${ort ? ` – ${ort}` : ''}`;
  };
  const kopfZeigen = () => { if (betreffZeile) betreffZeile.textContent = betreff(); };
  const umschalten = () => {
    const a = anliegen();
    const istNotfall = a?.value === 'notfall';
    if (notfall) notfall.hidden = !istNotfall;
    if (mailteil) mailteil.hidden = istNotfall;
  };
  // data-wechsel erst nach einer Wahl: Nur dann blendet der neue Teil ein (CSS), beim Laden steht alles sofort
  form.addEventListener('change', (e) => { if (e.target.name === 'anliegen') { form.setAttribute('data-wechsel', ''); umschalten(); kopfZeigen(); } });
  if (ortFeld) ortFeld.addEventListener('input', kopfZeigen);
  umschalten();
  kopfZeigen();

  const feldZeigen = (id, text) => {
    const feld = form.querySelector(`#${id}`);
    const meldung = form.querySelector(`#${id}-fehler`);
    if (!feld || !meldung) return;
    if (text) {
      feld.setAttribute('aria-invalid', 'true');
      meldung.textContent = text;
      meldung.hidden = false;
    } else {
      feld.removeAttribute('aria-invalid');
      meldung.textContent = '';
      meldung.hidden = true;
    }
  };

  const absenden = (e) => {
    e.preventDefault();
    if (ohneAdresse) ohneAdresse.hidden = true;
    const a = anliegen();
    if (a?.value === 'notfall') { notfall?.querySelector('a, [tabindex]')?.focus(); return; }
    const regeln = JSON.parse(form.getAttribute('data-regeln') || '[]');
    const werte = Object.fromEntries(regeln.map((r) => [r.id, form.querySelector(`#${r.id}`)?.value ?? '']));
    const fehler = pruefen(werte, regeln);
    for (const r of regeln) feldZeigen(r.id, fehler.find((f) => f.id === r.id)?.text);
    if (fehler.length) {
      liste.replaceChildren(...fehler.map((f) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${f.id}`;
        link.textContent = f.text;
        li.append(link);
        return li;
      }));
      uebersicht.hidden = false;
      uebersicht.focus();
      return;
    }
    uebersicht.hidden = true;
    const felder = [...form.querySelectorAll('[data-feld]')].map((el) => ({ titel: el.getAttribute('data-feld'), wert: el.value }));
    let ergebnis;
    try {
      ergebnis = mailtoUrl({ an, betreff: betreff(), felder, nachricht: form.querySelector('#k-nachricht')?.value });
    } catch {
      // Empfänger noch nicht konfiguriert (Vorschau): nichts öffnen, aber den Grund nennen
      if (ohneAdresse) { ohneAdresse.hidden = false; ohneAdresse.focus(); }
      return;
    }
    if (hinweis) hinweis.hidden = !ergebnis.gekuerzt;
    // Schema als Literal: Navigation nur zu mailto: (Sicherheitsregel S20); mailtoUrl liefert immer „mailto:…“
    window.location.href = `mailto:${ergebnis.url.slice('mailto:'.length)}`;
  };
  if (form instanceof HTMLFormElement) form.addEventListener('submit', absenden);
  else form.querySelector('[data-rolle="absenden"]')?.addEventListener('click', absenden);
}
