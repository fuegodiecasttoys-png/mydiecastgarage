/**
 * Removes dark matte pixels in the outer band of public/logo.png (common export
 * artifact). Interior is left intact. Run: node scripts/knockout-logo-matte.cjs
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "..", "public", "logo.png");
const EDGE = 40;
const LUM_MAX = 72; // Y (luma); below this in the edge band → knock out

async function main() {
  const buf = fs.readFileSync(INPUT);
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  if (info.channels !== 4) throw new Error("Expected RGBA");

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d = Math.min(x, y, w - 1 - x, h - 1 - y);
      if (d > EDGE) continue;

      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const Y = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      if (Y > LUM_MAX) continue;

      // Stronger removal at image edge; softer toward interior of band
      const edgeT = 1 - d / EDGE;
      const lumT = Math.min(1, Y / LUM_MAX);
      const knock = edgeT * (1 - lumT * 0.35);
      const a = data[i + 3];
      data[i + 3] = Math.max(0, Math.round(a * (1 - knock)));
    }
  }

  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(INPUT + ".tmp");

  fs.renameSync(INPUT + ".tmp", INPUT);
  console.log("Updated", INPUT, w, "x", h);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
