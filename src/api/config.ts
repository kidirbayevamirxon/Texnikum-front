const rawBaseUrl = import.meta.env.VITE_BASE_URL || "";
export const API_BASE_URL = rawBaseUrl
  ? (rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`)
  : "/";
export const UPLOADS_BASE_URL = API_BASE_URL === "/" ? "/uploads/" : `${API_BASE_URL}uploads/`;

export { getImageUrl } from "../utils/imageUrl";
