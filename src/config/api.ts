/**
 * Central API configuration for FINE DINE KNL RESTAURANT
 * 
 * In unified deployment (single Render Web Service), API_BASE is empty string,
 * making all requests relative to the current origin (e.g. /api/menu/status).
 * 
 * In separate static site deployment, VITE_API_URL can be set in Render environment
 * variables (e.g. https://fine-dine-knl-api.onrender.com) to route all requests
 * to the backend web service.
 */
const rawUrl = (import.meta.env.VITE_API_URL as string | undefined) || '';
export const API_BASE = rawUrl.replace(/\/+$/, '');

export function apiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
}
