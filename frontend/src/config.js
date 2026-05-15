/**
 * Local dev: direct to Express on :5000.
 * Vercel (or any host): set VITE_API_BASE_URL in the Vercel project to your deployed API origin, e.g.
 *   https://your-api.railway.app/api
 * If unset on production, same-origin /api is used (only works if you also host the API there).
 */
function resolveApiBase() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv && String(fromEnv).trim()) {
    return String(fromEnv).trim().replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const h = window.location.hostname;
    if (h === 'localhost' || h === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }
  return '/api';
}

export const API_BASE_URL = resolveApiBase();
