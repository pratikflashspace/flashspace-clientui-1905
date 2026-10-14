#!/usr/bin/env node
/**
 * prerender-local.mjs — LOCAL prerender for flashspace.ai
 * Renders routes from the LIVE site (where API access works) into prerendered/<route>/index.html.
 * Commit the output; the Render build copies prerendered/* into dist/ so crawlers get full HTML.
 * Run: node scripts/prerender-local.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://www.flashspace.ai";
const OUT = path.resolve(process.cwd(), "prerendered");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const CITY_SLUGS = [
  "ahmedabad", "bangalore", "bhubaneswar", "chandigarh", "chennai", "chhattisgarh",
  "delhi", "gurgaon", "himachal-pradesh", "hyderabad", "jaipur", "jammu-and-kashmir",
  "jharkhand", "jodhpur", "kochi", "kolkata", "lucknow", "madhya-pradesh",
  "mumbai", "mysuru", "noida", "patna", "pune", "punjab", "uttarakhand",
];
let BLOG_SLUGS = [];
try { BLOG_SLUGS = JSON.parse(fs.readFileSync(new URL("./prerender-blogs.json", import.meta.url), "utf-8")); } catch {}

const routes = [
  "/", "/services/virtual-office", "/services/coworking-space",
  "/services/business-setup", "/blogs", "/partner", "/career",
  "/privacy", "/terms", "/refund-policy",
  ...CITY_SLUGS.map((c) => `/services/virtual-office/${c}`),
  ...BLOG_SLUGS.slice(0, 12).map((s) => `/blogs/${s}`),
];

const EXECUTABLE = "/opt/data/.local/bin/chromium";

const browser = await puppeteer.launch({
  headless: "new",
  executablePath: fs.existsSync(EXECUTABLE) ? EXECUTABLE : undefined,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

let ok = 0, failed = 0;
for (const route of routes) {
  try {
    await page.goto(BASE + route, { waitUntil: "networkidle0", timeout: 60000 });
    await page.waitForFunction(
      () => (document.body.innerText || "").length > 2500,
      { timeout: 20000 }
    ).catch(() => {});
    await wait(2000);
    const html = await page.evaluate(() => {
      const d = document.documentElement.cloneNode(true);
      d.querySelectorAll("script[src*='googletagmanager'], script[src*='facebook'], script[src*='connect.facebook']").forEach((s) => s.remove());
      return "<!doctype html>\n" + d.outerHTML;
    });
    const dir = path.join(OUT, route);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
    ok++;
    console.log(`rendered ${route} (${Math.round(html.length / 1024)}KB)`);
  } catch (e) {
    failed++;
    console.error(`FAILED ${route}: ${e.message}`);
  }
}
await browser.close();
console.log(`\nDone: ${ok} ok, ${failed} failed of ${routes.length}. Output: prerendered/`);
