import { mkdir, readdir, copyFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("node_modules/stockfish");
const destination = path.resolve("public/stockfish");
const wanted = new Set(["stockfish-19-lite-single.js", "stockfish-19-lite-single.wasm"]);

async function findFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await findFiles(full);
    else if (wanted.has(entry.name)) {
      await mkdir(destination, { recursive: true });
      await copyFile(full, path.join(destination, entry.name));
      wanted.delete(entry.name);
    }
  }
}

await findFiles(root);
if (wanted.size) throw new Error("Stockfish assets missing: " + [...wanted].join(", "));
console.log("Copied Stockfish lite single-threaded WASM assets to public/stockfish.");
