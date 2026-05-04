#!/usr/bin/env node
/**
 * Optimiza imágenes JPG/PNG de src/assets/ in-place.
 * - Crea backup en <dir>/_originals/ antes de sobrescribir.
 * - Redimensiona al lado más largo MAX_DIMENSION manteniendo aspecto.
 * - Reencode JPG con calidad QUALITY (mozjpeg) y PNG a JPG cuando convenga.
 * - Solo procesa archivos > MIN_SIZE_BYTES.
 *
 * Uso:
 *   node scripts/optimize-images.mjs              # procesa carpetas por defecto
 *   node scripts/optimize-images.mjs <dir1> ...   # procesa dirs específicos
 *   DRY_RUN=1 node scripts/optimize-images.mjs    # no escribe nada
 */
import { readdir, mkdir, copyFile, stat, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, basename, dirname } from "node:path";
import sharp from "sharp";

const MAX_DIMENSION = 2400;        // px lado más largo
const QUALITY = 82;                // calidad jpeg/webp
const MIN_SIZE_BYTES = 400 * 1024; // 400KB - no toca lo pequeño
const TARGET_MAX_BYTES = 5 * 1024 * 1024 * 0.7; // ~3.5MB margen vs límite 5MB
const DRY_RUN = process.env.DRY_RUN === "1";

const DEFAULT_DIRS = [
  "src/assets/galeria",
  "src/assets/about",
  "src/assets/hero",
];

const EXTS = new Set([".jpg", ".jpeg", ".png"]);

const fmt = (b) => `${(b / 1024 / 1024).toFixed(2)}MB`;

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith("_originals")) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (EXTS.has(extname(e.name).toLowerCase())) {
      yield full;
    }
  }
}

async function backup(file) {
  const dir = dirname(file);
  const backupDir = join(dir, "_originals");
  if (!existsSync(backupDir)) {
    await mkdir(backupDir, { recursive: true });
  }
  const dest = join(backupDir, basename(file));
  if (!existsSync(dest)) {
    await copyFile(file, dest);
  }
  return dest;
}

async function optimizeOne(file) {
  const before = (await stat(file)).size;
  if (before < MIN_SIZE_BYTES) {
    return { file, skipped: "small", before };
  }

  const ext = extname(file).toLowerCase();
  const isPng = ext === ".png";

  // Probar calidades decrecientes hasta caber bajo TARGET_MAX_BYTES.
  const qualitySteps = [QUALITY, 78, 72, 66, 60];
  let bestBuffer = null;
  let bestQuality = QUALITY;

  for (const q of qualitySteps) {
    const pipeline = sharp(file, { failOn: "none" })
      .rotate() // respeta EXIF
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      });

    const buf = isPng
      ? await pipeline.jpeg({ quality: q, mozjpeg: true, progressive: true }).toBuffer()
      : await pipeline.jpeg({ quality: q, mozjpeg: true, progressive: true }).toBuffer();

    bestBuffer = buf;
    bestQuality = q;
    if (buf.byteLength <= TARGET_MAX_BYTES) break;
  }

  const after = bestBuffer.byteLength;
  if (after >= before) {
    return { file, skipped: "no-gain", before, after };
  }

  if (DRY_RUN) {
    return { file, dryRun: true, before, after, q: bestQuality, isPng };
  }

  await backup(file);

  // Si era PNG, sustituimos por .jpg y borramos el png original.
  if (isPng) {
    const newFile = file.replace(/\.png$/i, ".jpg");
    await sharp(bestBuffer).toFile(newFile);
    if (newFile !== file) {
      // Eliminar el png original (ya respaldado)
      await rename(file, file + ".to-delete");
      const { unlink } = await import("node:fs/promises");
      await unlink(file + ".to-delete");
    }
    return { file, written: newFile, before, after, q: bestQuality, converted: "png->jpg" };
  } else {
    await sharp(bestBuffer).toFile(file);
    return { file, written: file, before, after, q: bestQuality };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dirs = args.length ? args : DEFAULT_DIRS;

  console.log(`Optimizando (max ${MAX_DIMENSION}px, q=${QUALITY}, target<${fmt(TARGET_MAX_BYTES)})${DRY_RUN ? " [DRY RUN]" : ""}`);

  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;

  for (const dir of dirs) {
    if (!existsSync(dir)) {
      console.log(`  · ${dir} no existe, salto`);
      continue;
    }
    console.log(`\n→ ${dir}`);
    for await (const file of walk(dir)) {
      try {
        const r = await optimizeOne(file);
        if (r.skipped) {
          console.log(`  skip ${basename(file)} (${r.skipped}, ${fmt(r.before)})`);
          continue;
        }
        totalBefore += r.before;
        totalAfter += r.after;
        processed++;
        const tag = r.converted ? ` [${r.converted}]` : "";
        console.log(`  ok   ${basename(file)}${tag}: ${fmt(r.before)} → ${fmt(r.after)} (q=${r.q})`);
      } catch (err) {
        console.error(`  err  ${file}: ${err.message}`);
      }
    }
  }

  console.log(`\nProcesadas: ${processed}`);
  if (processed > 0) {
    console.log(`Total: ${fmt(totalBefore)} → ${fmt(totalAfter)} (ahorro ${fmt(totalBefore - totalAfter)}, ${(100 - (totalAfter / totalBefore) * 100).toFixed(1)}%)`);
  }
  if (!DRY_RUN) {
    console.log(`Originales en <carpeta>/_originals/ (añade a .gitignore si no quieres versionarlos).`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
