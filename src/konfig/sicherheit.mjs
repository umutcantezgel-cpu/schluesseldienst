// Einzige Quelle für CSP, Sicherheits-Header, Cache-Regeln und MIME-Typen.
// Daraus entstehen _headers (Netlify/Cloudflare), .htaccess (Apache), nginx-Snippet, vercel.json (Test-Deploy) und der Vorschau-Server.

export const CSP = {
  'default-src': ["'none'"],
  'script-src': ["'self'"],
  'style-src': ["'self'"],
  'img-src': ["'self'"],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'manifest-src': ["'self'"],
  'form-action': ['mailto:'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'none'"],
  'object-src': ["'none'"],
  'require-trusted-types-for': ["'script'"],
  'trusted-types': ["'none'"],
};

/** CSP als Zeichenkette; für die Meta-Variante ohne frame-ancestors (dort nicht erlaubt). */
export function cspText({ meta = false } = {}) {
  return Object.entries(CSP)
    .filter(([k]) => !(meta && k === 'frame-ancestors'))
    .map(([k, v]) => `${k} ${v.join(' ')}`).join('; ');
}

export const PERMISSIONS = [
  'accelerometer', 'autoplay', 'browsing-topics', 'camera', 'clipboard-read', 'clipboard-write',
  'compute-pressure', 'display-capture', 'encrypted-media', 'fullscreen', 'gamepad', 'geolocation', 'gyroscope',
  'hid', 'identity-credentials-get', 'idle-detection', 'local-fonts', 'magnetometer', 'microphone', 'midi',
  'otp-credentials', 'payment', 'picture-in-picture', 'publickey-credentials-create', 'publickey-credentials-get',
  'screen-wake-lock', 'serial', 'storage-access', 'usb', 'window-management', 'xr-spatial-tracking',
];

/** Header für jede Antwort. */
export function kopfzeilen() {
  return {
    'Content-Security-Policy': cspText(),
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Origin-Agent-Cluster': '?1',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-DNS-Prefetch-Control': 'off',
    'Permissions-Policy': PERMISSIONS.map((p) => `${p}=()`).join(', '),
  };
}

/** Cache-Regeln nach Pfadmuster (erste passende gewinnt). */
export const CACHE = [
  { muster: '/assets/*', wert: 'public, max-age=31536000, immutable' },
  { muster: '/daten/*', wert: 'public, max-age=31536000, immutable', extra: { 'X-Robots-Tag': 'noindex' } },
  { muster: '/robots.txt', wert: 'public, max-age=3600' },
  { muster: '/sitemap*.xml', wert: 'public, max-age=3600' },
  { muster: '/sitemaps/*', wert: 'public, max-age=3600' },
  { muster: '/*', wert: 'no-cache' },
];

export const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8', '.ico': 'image/x-icon',
};

/** Pfade, die Weiterleitungsquellen/-ziele sein dürfen (Schutz vor offenen Weiterleitungen). */
// Nur „/“ oder Segmente aus [a-z0-9-] mit genau einem „/“ dazwischen – nie „//“ (protokollrelative Ziele).
export const SICHERER_PFAD = /^(?:\/|\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/?)$/;
