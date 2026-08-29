/**
 * Canonical city lists and slug helpers for the city landing pages.
 *
 * These lists are the source of truth for which /services/{service}/{city}
 * routes serve real content. Anything not in them should 404 rather than
 * render the generic fallback.
 */

export const VIRTUAL_OFFICE_CITIES = [
  "Ahmedabad",
  "Bangalore",
  "Chandigarh",
  "Chennai",
  "Chhattisgarh",
  "Delhi",
  "Gurgaon",
  "Himachal Pradesh",
  "Hyderabad",
  "Jaipur",
  "Jammu and Kashmir",
  "Jharkhand",
  "Jodhpur",
  "Kochi",
  "Kolkata",
  "Madhya Pradesh",
  "Mumbai",
  "Mysuru",
  "Noida",
  "Patna",
  "Pune",
  "Punjab",
  "Uttarakhand",
] as const;

export const COWORKING_CITIES = [
  "Ahmedabad",
  "Bangalore",
  "Chandigarh",
  "Chennai",
  "Chhattisgarh",
  "Delhi",
  "Gurgaon",
  "Himachal Pradesh",
  "Hyderabad",
  "Jaipur",
  "Jammu and Kashmir",
  "Jharkhand",
  "Jodhpur",
  "Kochi",
  "Kolkata",
  "Madhya Pradesh",
  "Mumbai",
  "Mysuru",
  "Noida",
  "Patna",
  "Pune",
  "Punjab",
  "Uttarakhand",
] as const;

/** "Himachal Pradesh" -> "himachal-pradesh" */
export const cityToSlug = (city: string): string =>
  city.trim().toLowerCase().replace(/\s+/g, "-");

/**
 * Resolve a URL slug back to its canonical city name.
 *
 * Previously this was `slug.charAt(0).toUpperCase() + slug.slice(1)`, which
 * turned "himachal-pradesh" into "Himachal-pradesh" — matching no city, so
 * every multi-word city silently rendered the generic fallback page. Only the
 * %20-encoded form worked. Matching against the canonical list fixes that and
 * lets unknown slugs be detected instead of silently falling back.
 *
 * Returns null when the slug is not a real city.
 */
export const slugToCity = (
  slug: string | undefined,
  service: "virtual-office" | "coworking" = "virtual-office"
): string | null => {
  if (!slug) return null;
  const list =
    service === "coworking" ? COWORKING_CITIES : VIRTUAL_OFFICE_CITIES;
  const normalized = decodeURIComponent(slug).trim().toLowerCase().replace(/[\s_]+/g, "-");
  return list.find((c) => cityToSlug(c) === normalized) ?? null;
};

export const isValidCitySlug = (
  slug: string | undefined,
  service: "virtual-office" | "coworking" = "virtual-office"
): boolean => slugToCity(slug, service) !== null;
