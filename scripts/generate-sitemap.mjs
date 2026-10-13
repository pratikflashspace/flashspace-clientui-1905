#!/usr/bin/env node
/**
 * generate-sitemap.mjs — DB-driven sitemap for flashspace.ai
 * Pulls cities from /api/property/available-cities and blogs from /api/blogs,
 * writes public/sitemap.xml. Run: node scripts/generate-sitemap.mjs
 */
import fs from "node:fs";
import path from "node:path";

const BASE = "https://www.flashspace.ai";
const today = new Date().toISOString().slice(0, 10);

async function getJSON(url) {
  const res = await fetch(url, { headers: { "User-Agent": "sitemap-gen" } });
  if (!res.ok) throw new Error(url + " -> " + res.status);
  return res.json();
}

const cities = (await getJSON(BASE + "/api/property/available-cities")).data || [];
let blogs = [];
try {
  const d = await getJSON(BASE + "/api/blogs");
  blogs = (d.data || []).filter(b => b.slug && b.status !== "draft").map(b => b.slug);
} catch { /* blog endpoint optional */ }

const slugify = (c) => c.toLowerCase().replace(/\s+/g, "-");
const urls = [
  { loc: BASE + "/", p: "1.0", f: "weekly" },
  { loc: BASE + "/services/virtual-office", p: "0.9", f: "weekly" },
  { loc: BASE + "/services/coworking-space", p: "0.9", f: "weekly" },
  { loc: BASE + "/services/business-setup", p: "0.8", f: "weekly" },
  { loc: BASE + "/blogs", p: "0.6", f: "weekly" },
  { loc: BASE + "/partner", p: "0.7", f: "monthly" },
  { loc: BASE + "/career", p: "0.5", f: "monthly" },
  { loc: BASE + "/privacy", p: "0.3", f: "yearly" },
  { loc: BASE + "/terms", p: "0.3", f: "yearly" },
  { loc: BASE + "/refund-policy", p: "0.3", f: "yearly" },
];
for (const c of cities) {
  urls.push({ loc: `${BASE}/services/virtual-office/${slugify(c)}`, p: "0.9", f: "weekly" });
  urls.push({ loc: `${BASE}/services/coworking-space/${slugify(c)}`, p: "0.8", f: "weekly" });
}
for (const s of blogs) urls.push({ loc: `${BASE}/blogs/${s}`, p: "0.7", f: "monthly" });

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.f}</changefreq><priority>${u.p}</priority></url>`),
  "</urlset>",
].join("\n");

fs.writeFileSync(path.resolve(process.cwd(), "public/sitemap.xml"), xml + "\n");
console.log(`sitemap.xml written: ${urls.length} URLs (${cities.length} cities, ${blogs.length} blogs)`);
