/**
 * Centralized deployment configuration.
 *
 * This file exposes FRONTEND URL settings and a derived `allowedOrigins` array.
 * Keep these values in environment variables (Render / Vercel / local .env).
 *
 * Local development:
 *  - Set `FRONTEND_URL` to your local frontend (e.g. http://localhost:5173)
 * Production:
 *  - Set `FRONTEND_PRODUCTION_URL` to your Vercel frontend origin
 *
 * Note: No hardcoded localhost values are present here; values come from env.
 */

const FRONTEND_URL = process.env.FRONTEND_URL || ''
const FRONTEND_PRODUCTION_URL = process.env.FRONTEND_PRODUCTION_URL || ''

// Derive allowed origins from the configured environment variables.
const allowedOrigins = [FRONTEND_URL, FRONTEND_PRODUCTION_URL].filter(Boolean)

export { FRONTEND_URL, FRONTEND_PRODUCTION_URL, allowedOrigins }

export default {
  FRONTEND_URL,
  FRONTEND_PRODUCTION_URL,
  allowedOrigins,
}
