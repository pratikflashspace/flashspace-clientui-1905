/**
 * FlashSpace prerender script (build-time static HTML generation).
 * Runs AFTER `vite build` on Render. Serves dist/ with vite preview,
 * renders key routes with bundled Chromium, writes static HTML per route
 * so crawlers (Googlebot, GPTBot, PerplexityBot...) get full content
 * without JavaScript.
 *
 * Usage: node scripts/prerender.mjs
 */
import { spawn } from "node:child_process";
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve(process.cwd(), "dist");
const PORT = 4173;
const BASE = `http://127.0.0.1:${PORT}`;

// ---- route list (kept in sync with live data) ----
const CITY_SLUGS = [
  "ahmedabad", "bangalore", "bhubaneswar", "chandigarh", "chennai", "chhattisgarh",
  "delhi", "gurgaon", "himachal-pradesh", "hyderabad", "jaipur", "jammu-and-kashmir",
  "jharkhand", "jodhpur", "kochi", "kolkata", "lucknow", "madhya-pradesh",
  "mumbai", "mysuru", "noida", "patna", "pune", "punjab", "uttarakhand",
];

const BLOG_SLUGS = JSON.parse(fs.readFileSync(new URL("./prerender-blogs.json", import.meta.url), "utf-8"));

const routes = [
  "/",
  "/services/virtual-office",
  "/services/coworking-space",
  "/services/business-setup",
  "/blogs",
  "/partner",
  "/career",
  "/privacy",
  "/terms",
  "/refund-policy",
  ...CITY_SLUGS.map((c) => `/services/virtual-office/${c}`),
  ...CITY_SLUGS.map((c) => `/services/coworking-space/${c}`),
  ...BLOG_SLUGS.map((s) => `/blogs/${s}`),
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await wait(1000);
  }
  return false;
}

async function main() {
  if (!fs.existsSync(DIST)) {
    console.error("dist/ not found — run `vite build` first.");
    process.exit(1);
  }

  // Serve the built output
  const preview = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
    cwd: process.cwd(),
    stdio: "ignore",
    detached: true,
  });
  try {
    if (!(await waitForServer(`${BASE}/`))) throw new Error("preview server did not start");

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--font-render-hinting=none"],
    });
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(true);
    await page.setViewport({ width: 1280, height: 800 });
    // Let fetches (Google Fonts etc.) go through
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const u = req.url();
      if (u.startsWith(BASE) || u.startsWith("https://www.flashspace.ai") || u.startsWith("data:") || u.startsWith("blob:")) {
        req.continue();
      } else {
        // allow external assets (fonts, analytics) but drop nothing critical
        req.continue();
      }
    });

    let ok = 0;
    let failed = 0;
    for (const route of routes) {
      try {
        const url = BASE + route;
        await page.goto(url, { waitUntil: "networkidle0", timeout: 45000 });
        // Give SPA time to render content + meta effects
        await wait(2500);
        // Grab AFTER the app swapped meta/title
        const html = await page.evaluate(() => {
          const d = document.documentElement.cloneNode(true);
          // strip runtime-injected trackers from the static file
          d.querySelectorAll("script[src*='googletagmanager'], script[src*='facebook'], script[src*='connect.facebook']").forEach((s) => s.remove());
          return "<!doctype html>\n" + d.outerHTML;
        });

        // Route path -> dist file
        const rel = route === "/" ? "" : route;
        const dir = path.join(DIST, rel);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), html);
        ok++;
        console.log(`prerendered: ${route}`);
      } catch (e) {
        failed++;
        console.error(`FAILED: ${route}: ${e.message}`);
      }
    }

    await browser.close();
    console.log(`\nPrerender complete: ${ok} ok, ${failed} failed of ${routes.length}`);
  } finally {
    try { process.kill(-preview.pid); } catch {}
    try { preview.kill(); } catch {}
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
