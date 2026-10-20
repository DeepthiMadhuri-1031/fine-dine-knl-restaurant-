/**
 * Central API configuration for FINE DINE KNL RESTAURANT
 * 
 * In separate deployments (e.g. Frontend on Vercel, Backend on Render),
 * VITE_API_BASE_URL or VITE_API_URL specifies the deployed backend URL
 * (e.g. https://fine-dine-knl-api.onrender.com).
 * 
 * In unified deployment or local development with Vite proxy,
 * API_BASE defaults to empty string so requests remain relative (/api/...).
 */
const rawUrl = 
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  (import.meta.env.VITE_API_URL as string | undefined) || 
  '';

export const API_BASE = rawUrl.replace(/\/+$/, '');

export function apiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
}
