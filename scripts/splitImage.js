import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');
const src = path.join(publicDir, 'last-supper.png');

async function split() {
  const meta = await sharp(src).metadata();
  const w = meta.width;
  const h = meta.height;
  const pieceW = Math.floor(w / 4);

  for (let i = 0; i < 4; i++) {
    const left = i * pieceW;
    const extractWidth = i === 3 ? w - left : pieceW;
    await sharp(src)
      .extract({ left, top: 0, width: extractWidth, height: h })
      .toFile(path.join(publicDir, `last-supper-${i + 1}.png`));
    console.log(`Created last-supper-${i + 1}.png (${extractWidth}x${h})`);
  }
  console.log('Done');
}

split().catch(console.error);
