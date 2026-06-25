/**
 * Extracts a concise 'Main Area' from a full address string.
 * It filters out floors, plot numbers, office identifiers, and plus codes
 * to focus on landmarks, street names, or district areas.
 * 
 * @param address Full address string (e.g. "3rd Floor, Plot 12, Dwarka, Delhi")
 * @returns Shortened address (e.g. "Dwarka")
 */
export const getShortAddress = (address: string): string => {
  if (!address) return "";

  const parts = address.split(",");
  const skipWords = ["floor", "level", "plot", "off", "unit", "cabin", "shop", "room", "flat", "apartment", "h.no", "no.", "block", "pocket", "phase", "st", "nd", "rd", "th", "india"];

  const filtered = parts.map(p => p.trim()).filter(p => {
    const clean = p.toLowerCase();
    
    // Check if it starts with any skip words (ignoring leading numbers/spaces)
    let textOnly = clean.replace(/^[0-9\-\s\+/]+/, "").trim();
    
    for (const word of skipWords) {
      if (textOnly.startsWith(word)) {
        return false;
      }
    }

    // Skip if it is just a number or a plus code
    if (/^[0-9\-\s\+/]+$/.test(clean)) return false;

    // Skip if it contains a plus code plus something else
    if (p.includes("+")) return false;

    // Skip if too short
    if (p.replace(/[^a-zA-Z]/g, "").length < 3) return false;

    return true;
  });

  return filtered[0] || parts[0].trim();
};
