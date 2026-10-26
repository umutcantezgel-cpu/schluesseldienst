// Eigener statischer Server nur für die Kalibrierungs-Fixtures (127.0.0.1:4297), Ende über SIGTERM.
import { statikServer } from '/home/user/schluesseldienst/_werkstatt/werkzeuge/lib.mjs';
await statikServer('/home/user/schluesseldienst/_werkstatt/werkzeuge/fixture', 4297);
console.log('fixture-server 127.0.0.1:4297 läuft');
