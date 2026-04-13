/**
 * Utility to mask sensitive names (like space names) in strings.
 */

export const maskSpaceName = (text: string, metadata?: any, workspaceCodeMap?: Record<string, string>): string => {
  if (!text) return text;

  // Try to find a space ID/Code in metadata
  const findCode = (obj: any): string | null => {
    if (!obj || typeof obj !== 'object') return null;
    
    // Check common keys
    const targets = ['spaceId', 'workspaceId', 'spaceCode', 'workspaceCode', 'resolvedCode', 'space', 'workspace'];
    for (const key of targets) {
      const val = obj[key];
      if (val && (typeof val === 'string' || typeof val === 'object')) {
        const strVal = typeof val === 'object' ? (val.spaceId || val._id || val.id || val.name) : val;
        if (typeof strVal !== 'string') continue;

        // If it's a code (like FSD01), return it
        if (/\b[A-Z]{2,}\d{1,}\b/.test(strVal)) return strVal;
        // If it's a CID (like 65d...), try to resolve from map
        if (workspaceCodeMap && workspaceCodeMap[strVal]) return workspaceCodeMap[strVal];
      }
    }
    
    // Search one level deeper for common objects
    if (obj.booking && typeof obj.booking === 'object') return findCode(obj.booking);
    if (obj.workspace && typeof obj.workspace === 'object') return findCode(obj.workspace);
    return null;
  };

  const spaceCode = findCode(metadata);
  const replacement = spaceCode ? spaceCode : 'the workspace';

  // 1. Specific case for Stirring Minds (and potentially other known names)
  let masked = text.replace(/Stirring Minds/gi, replacement);

  // 2. Regex to catch "for [Space Name] [verb]" pattern
  // This captures the name between "for" and common action verbs/states
  const forPattern = /(.*) for (.*?) (has been|is now|was|will be|is)/gi;
  if (forPattern.test(masked)) {
    masked = masked.replace(forPattern, (match, p1, p2, p3) => {
      return `${p1} for ${replacement} ${p3}`;
    });
  }

  return masked;
};

