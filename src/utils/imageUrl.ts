const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);

// Ensure we have a clean base URL without /api suffix for uploads
const BASE_URL = API_BASE_URL.replace(/\/api$/, "").replace(/\/$/, "");

/**
 * Safely formats an image URL.
 * Handles:
 * 1. Full URLs (http/https)
 * 2. Absolute paths (/uploads/...)
 * 3. Relative paths (uploads/...)
 * 4. Invalid/Empty values (returns fallback)
 */
export const getSafeImageUrl = (url?: string, fallback: string = "/hero-illustrated.jpg"): string => {
  if (!url) return fallback;
  
  const trimmedUrl = url.trim();
  if (trimmedUrl === "" || trimmedUrl === "null" || trimmedUrl === "undefined") {
    return fallback;
  }

  // If it's already a full URL, return it
  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://") || trimmedUrl.startsWith("data:")) {
    return trimmedUrl;
  }

  // If it's a relative path starting with uploads or /uploads
  if (trimmedUrl.startsWith("/uploads") || trimmedUrl.startsWith("uploads")) {
    const cleanPath = trimmedUrl.startsWith("/") ? trimmedUrl : `/${trimmedUrl}`;
    return `${BASE_URL}${cleanPath}`;
  }

  // If it's a blob URL (for previews)
  if (trimmedUrl.startsWith("blob:")) {
    return trimmedUrl;
  }

  // If it's an absolute path from the public folder
  if (trimmedUrl.startsWith("/")) {
    return trimmedUrl;
  }

  return fallback;
};
