import { useEffect } from "react";
import type { SeoMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/seo/metadata";

const setMeta = (
  selector: string,
  attr: "name" | "property",
  key: string,
  content: string
) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/**
 * Applies per-page SEO metadata: title, description, canonical, robots and
 * Open Graph / Twitter tags.
 *
 * Note this runs client-side. Google's renderer will pick it up on the second
 * crawl wave, but non-JS crawlers (GPTBot, ClaudeBot, PerplexityBot, Bingbot)
 * will not — they only ever see index.html. Server-side rendering or build-time
 * prerendering is tracked separately and is what makes this visible to them.
 */
export const useSeo = (meta: SeoMetadata) => {
  const { title, description, canonical, ogImage, ogType, noindex } = meta;

  useEffect(() => {
    document.title = title;

    setMeta('meta[name="description"]', "name", "description", description);
    setCanonical(canonical);
    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noindex ? "noindex, follow" : "index, follow"
    );

    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description
    );
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    setMeta(
      'meta[property="og:type"]',
      "property",
      "og:type",
      ogType ?? "website"
    );
    setMeta(
      'meta[property="og:site_name"]',
      "property",
      "og:site_name",
      SITE_NAME
    );
    setMeta('meta[property="og:locale"]', "property", "og:locale", "en_IN");

    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description
    );

    if (ogImage) {
      setMeta('meta[property="og:image"]', "property", "og:image", ogImage);
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);
    }
  }, [title, description, canonical, ogImage, ogType, noindex]);
};

export default useSeo;
