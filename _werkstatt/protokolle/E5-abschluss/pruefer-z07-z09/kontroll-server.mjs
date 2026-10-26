// Kontrollserver nur für den Werkzeug-Test (Fixture aus _werkstatt/werkzeuge/fixture), Port 4299, nur 127.0.0.1.
import { statikServer } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';
await statikServer('/home/user/schluesseldienst/_werkstatt/werkzeuge/fixture', 4299, {});
console.log('kontroll-server auf 4299');
setInterval(() => {}, 1 << 30);
