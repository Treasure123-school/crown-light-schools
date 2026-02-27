// API Configuration
// In development, use relative paths (same origin)
// In production (Render), use the backend URL from environment variable

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Helper function to build full API URL
export function getApiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // If API_BASE_URL is empty (development), return relative path
  if (!API_BASE_URL) {
    return normalizedPath;
  }
  // In production, combine base URL with path
  // Ensure no double slashes
  return `${API_BASE_URL}${normalizedPath}`;
}
