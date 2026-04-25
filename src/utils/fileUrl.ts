import { API_CONFIG } from "@/config/api.config";

export const getApiOrigin = (): string =>
  API_CONFIG.BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");

export const getUploadedFileUrl = (url?: string): string => {
  if (!url) return "";

  const trimmed = url.trim().replace(/\\/g, "/");
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  let filePath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (filePath.startsWith("/api/uploads/")) {
    filePath = filePath.replace(/^\/api\/uploads\//, "/uploads/");
  }

  return `${getApiOrigin()}${filePath}`;
};
