/**
 * FlashSpace prerender script (build-time static HTML generation).
 * Runs AFTER `vite build` on Render. Serves dist/ with vite preview,
 * renders key routes with bundled Chromium, proxies /api to production,
 * writes static HTML per route so crawlers get full content without JS.
 */
import { spawn } from "node:child_process";
let puppeteer;
try { puppeteer = (await import("puppeteer")).default; }
catch (e) { console.error("puppeteer unavailable - skipping prerender:", e.message); process.exit(0); }
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve(process.cwd(), "dist");
const PORT = 4173;
const BASE = `http://127.0.0.1:${PORT}`;
const PROD = "https://www.flashspace.ai";

const CITY_SLUGS = [
  "ahmedabad", "bangalore", "bhubaneswar", "chandigarh", "chennai", "chhattisgarh",
  "delhi", "gurgaon", "himachal-pradesh", "hyderabad", "jaipur", "jammu-and-kashmir",
  "jharkhand", "jodhpur", "kochi", "kolkata", "lucknow", "madhya-pradesh",
  "mumbai", "mysuru", "noida", "patna", "pune", "punjab", "uttarakhand",
];
const BLOG_SLUGS = JSON.parse(fs.readFileSync(new URL("./prerender-blogs.json", import.meta.url), "utf-8"));

const routes = [
  "/", "/services/virtual-office", "/services/coworking-space",
  "/services/business-setup", "/blogs", "/partner", "/career",
  "/privacy", "/terms", "/refund-policy",
  ...CITY_SLUGS.map((c) => `/services/virtual-office/${c}`),
  ...BLOG_SLUGS.slice(0, 12).map((s) => `/blogs/${s}`),
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try { const res = await fetch(url); if (res.ok) return true; } catch {}
    await wait(1000);
  }
  return false;
}

async function main() {
  if (!fs.existsSync(DIST)) { console.error("dist/ not found"); process.exit(1); }

  const preview = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
    cwd: process.cwd(), stdio: "ignore", detached: true,
  });
  try {
    if (!(await waitForServer(`${BASE}/`))) throw new Error("preview server did not start");

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    // Rewrite API calls to the origin (bypasses Cloudflare bot checks on www from datacenter IPs)
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const u = req.url();
      if (u.startsWith("https://www.flashspace.ai/api/")) {
        req.continue({ url: u.replace("https://www.flashspace.ai/api/", "https://api.flashspace.co/api/") });
      } else {
        req.continue();
      }
    });



    let ok = 0, failed = 0;
    for (const route of routes) {
      try {
        await page.goto(BASE + route, { waitUntil: "networkidle0", timeout: 60000 });
        // Wait until the SPA shows real content (city listing, blog text, or search box)
        await page.waitForFunction(
          () => {
            const t = document.body.innerText || "";
            const hasContent = t.length > 2500;
            return hasContent;
          },
          { timeout: 12000 }
        ).catch(() => {});
        await wait(3000);
        const html = await page.evaluate(() => {
          const d = document.documentElement.cloneNode(true);
          d.querySelectorAll("script[src*='googletagmanager'], script[src*='facebook'], script[src*='connect.facebook']").forEach((s) => s.remove());
          return "<!doctype html>\n" + d.outerHTML;
        });
        const dir = path.join(DIST, route);
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

main().catch((e) => {
  console.error("PRERENDER FAILED (non-blocking):", e && e.message ? e.message : e);
  // Never fail the deploy because of prerender - static shell still works
  process.exit(0);
});
