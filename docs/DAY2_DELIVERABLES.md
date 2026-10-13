# Day-2 Deliverables — FlashSpace SEO Sprint

## 1. Locality Page Data Pack (37 pages ready, real inventory only)

Full data at /tmp/locality_pages_plan.json — each entry: city, locality, slug, spaces (with FSxx codes,
names, addresses). URL structure assumes Saloni's migration (`/virtual-office/<city>/<locality>`).

**Priority order (Saloni's plan Week 3-5 targets, Delhi NCR first):**
1. Delhi: Laxmi Nagar, Connaught Place, Okhla (2 spaces), Saket, Green Park, Rohini, Asaf Ali Road
2. Noida: Sector 62, Sector 58, Sector 142, Sector 16, Sector 68, Sector 90, Sector 3 (2 spaces)
3. Gurgaon: Golf Course Road (Work Lounge), Sector 44, Palm Court
4. Kolkata: Salt Lake (2), Park Street (2), Camac Street, Victoria Memorial, Rashbehari, Louden St
5. Hyderabad: Gachibowli (3 — keyword-richest: "virtual office gachibowli"), Kondapur, Hitex, Shaikpet, Raidurg
6. Bangalore: Hebbal (2), Koramangala, Indiranagar
7. Tier-3: Zirakpur (4), Patia, Rasulgarh, Gomti Nagar, Navrangpura, Goregaon, Vashi, Mohali

**Keyword template per locality page:**
- Title: `Virtual Office in [Locality], [City] — GST-Ready Address from ₹[price] | FlashSpace`
- H1: `Virtual Office in [Locality], [City]`
- Answer block: "A virtual office in [Locality] costs ₹X-Y/year for GST registration. [N] verified
  spaces available on FlashSpace: [space names]. Documents (NOC, rent agreement, utility bill)
  included; GST physical verification supported on-site."
- Unique per page: landmark references, nearest metro, GST state + ward context, the space's own
  address and photos, local expert name.

## 2. GEO Answer-Block Spec (for Saloni's city/locality page templates)

Every money page gets ONE answer block at the very top (before any other content):

```
┌─────────────────────────────────────────────────────────┐
│ [Starting price] ₹11,000/yr GST-ready                   │
│ [What's included] NOC + rent agreement + utility bill,  │
│   mail handling, on-site GST verification support       │
│ [Turnaround] Address allocated in 24h, documents same   │
│   day, GST approval typically 3-7 working days          │
│ [GST/MCA accepted] Yes — commercial address, staffed    │
│   premises                                              │
│ [CTA] Get Best Price →                                  │
└─────────────────────────────────────────────────────────┘
```

**Rules (from claude-seo seo-geo skill + Google's AI optimization guide):**
1. ~130-170 words max, fully self-contained (AI can quote it without context)
2. Specific numbers with dates ("As of October 2026") — AI cites specifics, not adjectives
3. One question per H2, phrased exactly as users ask ("Does the GST department accept virtual
   offices in Noida?")
4. Front-load: the answer block must appear in the first 30% of the page HTML
5. The same block doubles as the meta-description source + rich-result candidate
6. Never claim what can't be verified (the fake "4.5 (120)" ratings being replaced makes this point)

## 3. GA4 AI-Referral Channel Setup (doc for Saloni)

GA4 Admin → Data streams → select web → Configure benchmark definitions? No — simplest path:

**In GA4:** Admin → Data settings → Data streams → your stream → "Define channel groups"
(or Admin → Channel groups in newer UI):
- Create "Organic AI Search" channel group, custom definition:
  - Session source matches regex: `chatgpt\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|deepseek\.com`
  - Session medium = `referral`
- Save. AI traffic now reports as its own line in Reports → Traffic acquisition.

**UTM conventions (use on every non-Google link):**
- GBP links: `?utm_source=gbp&utm_medium=local&utm_campaign=[city]`
- Partner links: `?utm_source=[partner-name]&utm_medium=referral&utm_campaign=partner`
- WhatsApp campaigns: `?utm_source=whatsapp&utm_medium=social&utm_campaign=[campaign]`
- LinkedIn posts: `?utm_source=linkedin&utm_medium=social&utm_campaign=[topic]`

## 4. Notes / handoffs
- Locality URL slugs assume the URL migration is approved — if Pratik delays the migration,
  locality pages can live at `/services/virtual-office/<city>/<locality>` meanwhile (sitemap picks
  them up either way via generate-sitemap.mjs once added to the route list).
- The Mumbai "Sector 3" extraction is wrong (that's Noida text in the name "We Grow Coworks Vashi")
  — actual locality: Vashi. Fix before page creation: `/virtual-office/mumbai/vashi`.
- Zirakpur has 4 spaces = strongest Tier-3 locality page.
