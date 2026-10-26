// Kopf-Skript (klassisch, steht nach den Stil-Links, vor dem Modul): Ein klassisches Skript wartet, bis die Stylesheets
// davor geladen sind, und hält so den Parser an, bevor er <body> einfügt. Chromium wertet den Seitenwechsel-Opt-in
// (@view-transition, M-15) beim Einfügen von <body> aus; lagen die Stylesheets da noch nicht vor, verwarf es den
// Übergang je nach Ladefolge, und die abgelehnten Promises erschienen als Fehler in der Konsole (D-E5-03).
// Zusätzlich fängt es ab, wenn der Browser einen Übergang überspringt (etwa bei einer neuen Navigation mitten im
// Übergang) – das ist kein Fehler der Seite. pagereveal muss vor der ersten Darstellung registriert sein, deshalb hier
// und nicht im Modul.
{ // Block statt globaler Namen (klassisches Skript)
  const still = (e) => {
    const vt = e.viewTransition;
    if (vt) for (const p of [vt.ready, vt.finished, vt.updateCallbackDone]) p.catch(() => {});
  };
  addEventListener('pageswap', still);
  addEventListener('pagereveal', still);
}
