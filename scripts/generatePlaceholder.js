import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(__dirname, '..', 'public', 'placeholder-music.png');

const w = 320;
const h = 180;
const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="#FAF6EF" rx="8"/>
  <rect x="8" y="8" width="${w - 16}" height="${h - 16}" fill="none" stroke="#C9A84C" stroke-width="2" rx="6" stroke-dasharray="8,4"/>
  <text x="${w / 2}" y="${h / 2 + 8}" text-anchor="middle" font-size="48" fill="#C9A84C" font-family="serif">&#x266B;</text>
</svg>`;

sharp(Buffer.from(svg)).png().toFile(out).then(() => console.log('Created placeholder-music.png'));
