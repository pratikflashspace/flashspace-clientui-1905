/**
 * Per-page SEO metadata.
 *
 * Every route should produce its own title, description and canonical.
 * Before this module the entire site shared one title ("FlashSpace") and one
 * 616-character description, and all 46 city pages shared a single title
 * saying "in India".
 */

export const SITE_ORIGIN = "https://www.flashspace.ai";
export const SITE_NAME = "FlashSpace";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

export interface SeoMetadata {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  /** Set true on thin, duplicate or placeholder pages. */
  noindex?: boolean;
}

export const absoluteUrl = (path: string): string =>
  `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;

/** Google truncates around 155-160 characters. */
const MAX_DESCRIPTION = 160;

export const clampDescription = (text: string): string => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= MAX_DESCRIPTION) return clean;
  const cut = clean.slice(0, MAX_DESCRIPTION);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

export const virtualOfficeCityMeta = (
  city: string,
  slug: string
): SeoMetadata => ({
  title: `Virtual Office in ${city} for GST Registration — From ₹800/mo | ${SITE_NAME}`,
  description: clampDescription(
    `Get a premium virtual office address in ${city} for GST and company registration. NOC, rent agreement and utility bill included. Live in 24 hours from ₹800/month.`
  ),
  canonical: absoluteUrl(`/services/virtual-office/${slug}`),
  ogImage: DEFAULT_OG_IMAGE,
});

export const coworkingCityMeta = (city: string, slug: string): SeoMetadata => ({
  title: `Coworking Space in ${city} — Hot Desks & Private Cabins | ${SITE_NAME}`,
  description: clampDescription(
    `Flexible coworking spaces in ${city}. Hot desks, dedicated desks, private cabins and meeting rooms on daily, monthly or annual terms. Book a visit today.`
  ),
  canonical: absoluteUrl(`/services/coworking-space/${slug}`),
  ogImage: DEFAULT_OG_IMAGE,
});

export const virtualOfficeIndexMeta = (): SeoMetadata => ({
  title: `Virtual Office for GST Registration in India — From ₹800/mo | ${SITE_NAME}`,
  description: clampDescription(
    "Premium virtual office addresses across 23 cities in India for GST and company registration. NOC, rent agreement and utility bill included. From ₹800/month."
  ),
  canonical: absoluteUrl("/services/virtual-office"),
  ogImage: DEFAULT_OG_IMAGE,
});

export const coworkingIndexMeta = (): SeoMetadata => ({
  title: `Coworking Space in India — Book Hot Desks & Private Cabins | ${SITE_NAME}`,
  description: clampDescription(
    "Flexible coworking spaces across 23 cities in India. Hot desks, dedicated desks, private cabins and meeting rooms on daily, monthly or annual terms."
  ),
  canonical: absoluteUrl("/services/coworking-space"),
  ogImage: DEFAULT_OG_IMAGE,
});
