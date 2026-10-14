import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve(process.cwd(), "prerendered");
const DIST = path.resolve(process.cwd(), "dist");

if (!fs.existsSync(SRC)) {
  console.log("copy-prerendered: no prerendered/ dir, skipping");
  process.exit(0);
}
let n = 0;
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const s = path.join(dir, entry.name);
    const rel = path.relative(SRC, s);
    const d = path.join(DIST, rel);
    if (entry.isDirectory()) { fs.mkdirSync(d, { recursive: true }); walk(s); }
    else {
      fs.mkdirSync(path.dirname(d), { recursive: true });
      fs.copyFileSync(s, d);
      n++;
    }
  }
};
walk(SRC);
console.log(`copy-prerendered: ${n} files copied into dist/`);
