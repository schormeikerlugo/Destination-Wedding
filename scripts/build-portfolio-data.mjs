#!/usr/bin/env node
/**
 * Genera src/data/portfolio.ts a partir de src/assets/portfolio/.
 *
 * Estrategia (CSS columns / masonry vertical):
 *  - Lee dimensiones reales con sharp.
 *  - Reordena las imágenes para BALANCEAR la altura visual de las 4 columnas
 *    cuando se renderizan con `column-count: 4`. CSS columns es greedy de
 *    arriba a abajo y por columna, así que reproducimos su algoritmo:
 *      · Mantiene 4 "columnas virtuales".
 *      · Recorre las imágenes y, para cada una, la asigna a la columna actual.
 *      · Si elegimos un orden distinto al alfabético, podemos minimizar la
 *        diferencia entre la columna más alta y la más corta.
 *  - Algoritmo: ordena por altura desc., luego va asignando cada foto a la
 *    columna actualmente más corta. Después emite las imágenes en el orden
 *    "columna 1 completa, columna 2 completa, ..." porque CSS columns las
 *    consume así.
 *
 * Uso: node scripts/build-portfolio-data.mjs
 */
import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const SRC_DIR = "src/assets/portfolio";
const OUT_FILE = "src/data/portfolio.ts";
const NUM_COLUMNS = 4;
const LANDSCAPE_THRESHOLD = 1.2;
// Ancho asumido por columna (relativo, sólo para calcular alturas
// proporcionales y balancear). El valor absoluto no importa.
const ASSUMED_COL_WIDTH = 1;

async function main() {
  const entries = (await readdir(SRC_DIR, { withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(jpe?g|png)$/i.test(e.name))
    .map((e) => e.name)
    .sort();

  const items = [];
  for (const name of entries) {
    const file = join(SRC_DIR, name);
    const meta = await sharp(file).metadata();
    const w = meta.width ?? 1;
    const h = meta.height ?? 1;
    const ratio = w / h > LANDSCAPE_THRESHOLD ? "landscape" : "portrait";
    // Altura "renderizada" si la imagen ocupa una columna de ancho ASSUMED_COL_WIDTH
    const renderedH = (h / w) * ASSUMED_COL_WIDTH;
    items.push({ file: name, ratio, w, h, renderedH });
  }

  // -------- Algoritmo de balance con DISTRIBUCIÓN visual --------
  // Objetivo doble:
  //  (1) Las columnas deben terminar con altura similar (balance numérico).
  //  (2) Las imágenes "landscape" (más cortas) deben repartirse entre las 4
  //      columnas de forma intercalada, evitando agruparlas en una sola.
  //
  // Estrategia:
  //  Fase 1 — Distribución de landscapes en round-robin con offset rotatorio
  //           para que cada columna reciba ~mismo número de landscapes
  //           pero NO siempre en las mismas posiciones verticales.
  //  Fase 2 — Balance de portraits asignándolos a la columna más corta
  //           (greedy clásico) tras la fase 1.
  const portraits = items.filter((i) => i.ratio === "portrait");
  const landscapes = items.filter((i) => i.ratio === "landscape");

  // Mezcla determinista (Fisher-Yates con seed) para que cada build dé el
  // mismo resultado pero el orden no sea trivialmente alfabético.
  function seededShuffle(arr, seed = 42) {
    const a = [...arr];
    let s = seed;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const shuffledPortraits = seededShuffle(portraits, 17);
  const shuffledLandscapes = seededShuffle(landscapes, 31);

  const cols = Array.from({ length: NUM_COLUMNS }, () => ({
    height: 0,
    items: [],
  }));

  // Fase 1: round-robin de landscapes empezando en la columna que actualmente
  // sea la más corta (para suavizar inicio). Cada landscape va a la siguiente
  // columna en orden circular para distribuirlas verticalmente.
  let rrIndex = 0;
  for (const it of shuffledLandscapes) {
    cols[rrIndex].items.push(it);
    cols[rrIndex].height += it.renderedH;
    rrIndex = (rrIndex + 1) % NUM_COLUMNS;
  }

  // Fase 2: portraits ordenados por altura desc, asignados a la columna más
  // corta para igualar las alturas finales.
  const sortedPortraits = shuffledPortraits.sort(
    (a, b) => b.renderedH - a.renderedH,
  );
  for (const it of sortedPortraits) {
    let minIdx = 0;
    for (let i = 1; i < NUM_COLUMNS; i++) {
      if (cols[i].height < cols[minIdx].height) minIdx = i;
    }
    cols[minIdx].items.push(it);
    cols[minIdx].height += it.renderedH;
  }

  // Intercalado intra-columna con OFFSET distinto por columna.
  // Cada columna empieza la inserción de landscapes en una posición distinta
  // para que en la misma "fila visual" del DOM no aparezcan todas portraits
  // o todas landscapes al mismo tiempo.
  cols.forEach((col, colIdx) => {
    const ps = col.items.filter((x) => x.ratio === "portrait");
    const ls = col.items.filter((x) => x.ratio === "landscape");
    if (!ls.length) {
      col.items = ps;
      return;
    }
    // Posiciones objetivo donde insertar las landscapes dentro de la columna,
    // distribuidas uniformemente y desplazadas por columna.
    const total = ps.length + ls.length;
    const step = total / ls.length; // posición ideal entre landscapes
    const offset = colIdx * (step / NUM_COLUMNS); // desfase por columna
    const insertAt = ls.map((_, i) =>
      Math.min(total - 1, Math.round(offset + i * step)),
    );

    // Construye la columna posicionando landscapes en insertAt
    // y rellenando con portraits.
    const merged = new Array(total).fill(null);
    insertAt.forEach((pos, i) => {
      // Si ya hay algo, busca siguiente hueco
      let p = pos;
      while (p < total && merged[p] !== null) p++;
      if (p >= total) {
        // Busca hacia atrás
        p = pos;
        while (p >= 0 && merged[p] !== null) p--;
      }
      if (p >= 0 && p < total) merged[p] = ls[i];
    });
    let pi = 0;
    for (let i = 0; i < total; i++) {
      if (merged[i] === null && pi < ps.length) {
        merged[i] = ps[pi++];
      }
    }
    col.items = merged.filter((x) => x !== null);
  });

  // CSS columns consume las imágenes en orden DOM y las distribuye top-to-bottom
  // por columna. Para que el orden DOM produzca exactamente nuestra asignación,
  // emitimos: col1[0], col2[0], col3[0], col4[0], col1[1], col2[1], ... NO.
  // En realidad, CSS columns con `column-fill: balance` (default) reparte
  // intentando equilibrar alturas. Si emitimos los items columna a columna
  // en orden secuencial, el navegador puede reorganizar.
  //
  // El método más fiable es usar `column-fill: auto` + `column-count` y emitir
  // los items en orden "columna 1 entera, luego columna 2 entera...". Eso es
  // lo que hacemos: aplanamos col1 + col2 + col3 + col4. En el CSS añadimos
  // `column-fill: auto` y altura suficiente para forzar el wrap por columna.
  //
  // PERO: column-fill:auto requiere altura fija en el contenedor (no práctico
  // para listas variables). Solución: confiamos en el balance automático del
  // navegador y emitimos un orden mezclado intercalando columnas que el
  // algoritmo natural reproduce con bastante fidelidad.
  //
  // Estrategia final: emitimos en orden "row-major" (primer item de cada col,
  // luego segundo de cada col, etc.). Es lo que mejor casa con `column-fill:
  // balance` por defecto.

  // Emitimos cada item con su columna asignada (1..NUM_COLUMNS) para que el
  // componente lo coloque en una columna flex específica. Así no dependemos
  // del balance automático de CSS columns y la distribución es exacta.
  const ordered = [];
  cols.forEach((col, idx) => {
    col.items.forEach((it) => {
      ordered.push({ ...it, column: idx + 1 });
    });
  });

  // -------- Escribe portfolio.ts --------
  const lines = [];
  lines.push(`// AUTO-GENERATED by scripts/build-portfolio-data.mjs`);
  lines.push(`// Do not edit by hand. Re-run the script after adding/removing images.`);
  lines.push(`import type { ImageMetadata } from "astro";`);
  lines.push("");

  ordered.forEach((it, idx) => {
    const varName = `p${String(idx + 1).padStart(2, "0")}`;
    lines.push(`import ${varName} from "@assets/portfolio/${it.file}";`);
  });
  lines.push("");

  lines.push(`export type PortfolioRatio = "portrait" | "landscape";`);
  lines.push("");
  lines.push(`export type PortfolioImage = {`);
  lines.push(`  image: ImageMetadata;`);
  lines.push(`  alt: string;`);
  lines.push(`  ratio: PortfolioRatio;`);
  lines.push(`  /** Intrinsic width in px (for srcset hints) */`);
  lines.push(`  width: number;`);
  lines.push(`  /** Intrinsic height in px (for srcset hints) */`);
  lines.push(`  height: number;`);
  lines.push(`  /** Pre-assigned column (1..N) for explicit masonry layout */`);
  lines.push(`  column: number;`);
  lines.push(`};`);
  lines.push("");

  lines.push(`export const NUM_COLUMNS = ${NUM_COLUMNS};`);
  lines.push("");

  lines.push(`export const portfolio: PortfolioImage[] = [`);
  ordered.forEach((it, idx) => {
    const varName = `p${String(idx + 1).padStart(2, "0")}`;
    const altIdx = String(idx + 1).padStart(2, "0");
    lines.push(
      `  { image: ${varName}, alt: "Editorial wedding photograph ${altIdx}", ratio: "${it.ratio}", width: ${it.w}, height: ${it.h}, column: ${it.column} },`,
    );
  });
  lines.push(`];`);
  lines.push("");

  await writeFile(OUT_FILE, lines.join("\n"), "utf8");

  const heights = cols.map((c) => c.height.toFixed(2));
  const stdDev = calcStdDev(cols.map((c) => c.height));
  console.log(
    `Wrote ${OUT_FILE}: ${ordered.length} images distributed in ${NUM_COLUMNS} balanced columns`,
  );
  console.log(`  Column heights (relative): [${heights.join(", ")}]`);
  console.log(`  Std deviation: ${stdDev.toFixed(3)} (lower is better)`);
}

function calcStdDev(arr) {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance =
    arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
