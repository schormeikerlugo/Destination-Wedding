// Selecciona 6 jpg aleatorias de referencia/imagenes/Favorites,
// las optimiza con sharp (max 2000px, mozjpeg q82) y las copia a src/assets/galeria/
// como 19-package-europe.jpg ... 24-package-oceania.jpg
import { readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(
  "/home/lenovics/portafolio Dev/Destination Wedding"
);
const SRC = path.join(ROOT, "referencia/imagenes/Favorites");
const OUT = path.join(ROOT, "src/assets/galeria");

const REGIONS = [
  { id: "europe", n: 19 },
  { id: "north-america", n: 20 },
  { id: "south-america", n: 21 },
  { id: "asia", n: 22 },
  { id: "africa", n: 23 },
  { id: "oceania", n: 24 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const all = (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f));
if (all.length < REGIONS.length) {
  throw new Error(`Solo hay ${all.length} jpg disponibles`);
}
const pick = shuffle(all).slice(0, REGIONS.length);

if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

const results = [];
for (let i = 0; i < REGIONS.length; i++) {
  const region = REGIONS[i];
  const source = path.join(SRC, pick[i]);
  const outName = `${String(region.n).padStart(2, "0")}-package-${region.id}.jpg`;
  const outPath = path.join(OUT, outName);

  const meta = await sharp(source).metadata();
  await sharp(source)
    .rotate()
    .resize({
      width: 2000,
      height: 2000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(outPath);

  results.push({
    region: region.id,
    source: pick[i],
    out: outName,
    inW: meta.width,
    inH: meta.height,
  });
}

console.log(JSON.stringify(results, null, 2));
