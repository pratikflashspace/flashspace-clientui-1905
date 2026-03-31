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

  // Split by comma
  const parts = address.split(",");

  // Skip segments that start with these generic terms (optionally preceded by numbers)
  // This helps skip "3rd Floor", "Plot No 12", "Office 715", "Phase 2" 
  // but KEEPS "Industrial Area Phase II", "Dwarka Sector 12", etc.
  const skipPattern = /^([0-9]*\s*(floor|level|plot|off|unit|cabin|shop|room|flat|apartment|h\.no|no\.|block|pocket|phase|st|nd|rd|th))\b/i;
  const numericPattern = /^[0-9\-\s\+/]+$/; // Segments that are just numbers or plus-codes

  const filtered = parts.map(p => p.trim()).filter(p => {
    const clean = p.toLowerCase();
    
    // Skip if segment matches detailed prefix (floor, plot, etc.) at the start
    if (skipPattern.test(clean)) return false;

    // Skip if it is just a number or a plus code
    if (numericPattern.test(clean)) return false;

    // Skip if it contains a plus code plus something else (usually at start)
    if (p.includes("+")) return false;

    // Skip if too short (e.g. "C-4")
    if (p.replace(/[^a-zA-Z]/g, "").length < 3) return false;

    return true;
  });

  // Return the first valid segment, or the first segment of the original address if nothing filtered remains
  return filtered[0] || parts[0].trim();
};
