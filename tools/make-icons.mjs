// Draws the app icon (the Swedish flag: a yellow Nordic cross on blue) as PNG and SVG files.
// Usage: node tools/make-icons.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync, crc32 } from 'node:zlib';

const BLUE = [0, 106, 167]; // #006AA7
const YELLOW = [254, 204, 2]; // #FECC02
// The cross, edge to edge; the upright sits left of centre, as on the flag.
const UPRIGHT = [0.3, 0.5];
const BAR = [0.4, 0.6];

const between = (v, [a, b]) => v >= a && v < b;
const isYellow = (x, y) => between(x, UPRIGHT) || between(y, BAR);

function png(size) {
  const ss = 4; // supersampling for smooth edges
  const rows = [];
  for (let py = 0; py < size; py++) {
    const row = Buffer.alloc(1 + size * 3);
    for (let px = 0; px < size; px++) {
      let hits = 0;
      for (let sy = 0; sy < ss; sy++)
        for (let sx = 0; sx < ss; sx++) if (isYellow((px + (sx + 0.5) / ss) / size, (py + (sy + 0.5) / ss) / size)) hits++;
      const t = hits / (ss * ss);
      for (let c = 0; c < 3; c++) row[1 + px * 3 + c] = Math.round(BLUE[c] * (1 - t) + YELLOW[c] * t);
    }
    rows.push(row);
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolor RGB
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const dir = new URL('../icons/', import.meta.url);
mkdirSync(dir, { recursive: true });
for (const size of [180, 192, 512]) writeFileSync(new URL(`icon-${size}.png`, dir), png(size));

const p = (v) => (v * 100).toFixed(0);
const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
  `<clipPath id="r"><rect width="100" height="100" rx="22"/></clipPath><g clip-path="url(#r)">` +
  `<rect width="100" height="100" fill="#006AA7"/>` +
  `<rect x="${p(UPRIGHT[0])}" width="${p(UPRIGHT[1] - UPRIGHT[0])}" height="100" fill="#FECC02"/>` +
  `<rect y="${p(BAR[0])}" width="100" height="${p(BAR[1] - BAR[0])}" fill="#FECC02"/></g></svg>\n`;
writeFileSync(new URL('icon.svg', dir), svg);
console.log('Icons written to icons/');
