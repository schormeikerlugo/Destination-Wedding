// Optimiza el retrato de Kathrin desde Favorites a src/assets/about/kathrin.jpg
// max 1600px ancho, mozjpeg q86, progressive (alineado con el pipeline del About)
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(
  "/home/lenovics/portafolio Dev/Destination Wedding"
);
const SRC = path.join(ROOT, "referencia/imagenes/Favorites/1778019769502.jpg");
const OUT_DIR = path.join(ROOT, "src/assets/about");
const OUT = path.join(OUT_DIR, "kathrin.jpg");

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

const meta = await sharp(SRC).metadata();
await sharp(SRC)
  .rotate()
  .resize({
    width: 1600,
    height: 1600,
    fit: "inside",
    withoutEnlargement: true,
  })
  .jpeg({ quality: 86, mozjpeg: true, progressive: true })
  .toFile(OUT);

console.log(JSON.stringify({ in: "1778019769502.jpg", out: "kathrin.jpg", inW: meta.width, inH: meta.height }, null, 2));
