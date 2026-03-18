const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api$/, "").replace(/\/$/, "");
  }
  
  // In development, if no env is set, default to localhost:5000
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  
  // In production, use the current origin
  return window.location.origin;
};

const BASE_URL = getBaseUrl();

/**
 * Checks if a URL is a known placeholder, invalid string, or empty.
 */
export const isInvalidImageUrl = (url?: string): boolean => {
  if (!url) return true;
  const val = String(url).trim().toLowerCase();
  return (
    val === "" ||
    val === "null" ||
    val === "undefined" ||
    val === "image.jpg" ||
    val === "placeholder.png" ||
    val === "img1.jpg" ||
    val === "url1.jpg" ||
    val === "url" ||
    val.includes("shorturl.at") ||
    val.includes("tinyurl.com")
  );
};

/**
 * Safely formats an image URL.
 */
export const getSafeImageUrl = (url?: string, fallback: string = "/hero-illustrated.jpg"): string => {
  if (!url || isInvalidImageUrl(url)) return fallback;
  
  const trimmedUrl = url.trim();

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
