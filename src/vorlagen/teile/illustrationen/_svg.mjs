// Gemeinsamer Rahmen der Szenen-Illustrationen (K-008): Raster 8, Strich 2 über CSS (.ill), Schraffur 45°/Abstand 4.
// Teile mit data-ab="n" erscheinen ab Schritt n, data-bei="n" färbt sie im Schritt n kupfern (nur über CSS).
// zustand = fester Schritt (Einzelbilder) – ohne zustand ist die Grundregel der Endzustand (alles sichtbar).
export function illRahmen({ klasse, viewBox, praefix, zustand, inhalt }) {
  return `<svg class="ill ${klasse}" viewBox="${viewBox}" aria-hidden="true" focusable="false"${zustand ? ` data-zustand="${zustand}"` : ''} preserveAspectRatio="xMidYMid meet">
<defs><pattern id="${praefix}-schraffur" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="ill-schraffur-linie" d="M0 0V4"/></pattern></defs>
${inhalt}
</svg>`;
}

/** Teil-Gruppe mit Schritt-Attributen. */
export const teil = (n, inhalt, klasse = '') => `<g class="ill-teil${klasse ? ' ' + klasse : ''}" data-ab="${n}" data-bei="${n}">${inhalt}</g>`;
