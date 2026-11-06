import { UPLOADS_BASE_URL } from "../api/config";

/**
 * Normalizes any photo path or array of photo paths into a full, valid image URL.
 * Handles:
 * - Full URLs: https://... or http://...
 * - Absolute paths: /uploads/...
 * - Relative paths: news/photo.jpg, teachers/photo.jpg, deficiency/photo.jpg
 * - Arrays: takes the first non-empty photo string
 * - Empty/null/undefined: returns null
 */
export const getImageUrl = (
  photo: string | string[] | null | undefined
): string | null => {
  if (!photo) return null;
  const p = Array.isArray(photo) ? photo[0] : photo;
  if (!p || typeof p !== "string") return null;

  const trimmed = p.trim();
  if (!trimmed) return null;

  // Already a full or browser-managed URL
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  // Starts with /uploads/
  if (trimmed.startsWith("/uploads/")) {
    return trimmed;
  }

  // Starts with uploads/ (without leading slash)
  if (trimmed.startsWith("uploads/")) {
    return `/${trimmed}`;
  }

  // Relative path like "news/xyz.jpg"
  const cleanPath = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  const base = UPLOADS_BASE_URL.endsWith("/")
    ? UPLOADS_BASE_URL
    : `${UPLOADS_BASE_URL}/`;

  return `${base}${cleanPath}`;
};
