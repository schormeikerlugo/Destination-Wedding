// Optimiza _DSC1306.jpg y _DSC4673.jpg desde Favorites a src/assets/hero/
// max 2400px ancho, mozjpeg q86, progressive (alineado con el pipeline del Hero)
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(
  "/home/lenovics/portafolio Dev/Destination Wedding"
);
const SRC = path.join(ROOT, "referencia/imagenes/Favorites");
const OUT = path.join(ROOT, "src/assets/hero");

const TARGETS = [
  { in: "_DSC1306.jpg", out: "dsc1306.jpg" },
  { in: "_DSC4673.jpg", out: "dsc4673.jpg" },
  { in: "DSC_6020-2.jpg", out: "dsc6020.jpg" },
];

if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

const results = [];
for (const t of TARGETS) {
  const source = path.join(SRC, t.in);
  const dest = path.join(OUT, t.out);
  const meta = await sharp(source).metadata();
  await sharp(source)
    .rotate()
    .resize({
      width: 2400,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 86, mozjpeg: true, progressive: true })
    .toFile(dest);
  results.push({ in: t.in, out: t.out, inW: meta.width, inH: meta.height });
}

console.log(JSON.stringify(results, null, 2));
