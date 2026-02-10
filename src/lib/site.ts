// Central place for public URLs/domains used by the marketing site.
// Keep console/api on heliosenergy.io until those services are rebranded/migrated.

const env = import.meta.env as Record<string, string | undefined>;

export const PRIMARY_ORIGIN = env.VITE_PRIMARY_ORIGIN || "https://helios.co";
export const LEGACY_ORIGIN = env.VITE_LEGACY_ORIGIN || "https://heliosenergy.io";

export const PRIMARY_HOSTNAME = new URL(PRIMARY_ORIGIN).hostname;
export const LEGACY_HOSTNAME = new URL(LEGACY_ORIGIN).hostname;

// This route should remain available on the legacy domain only.
export const BRAND_TRANSITION_PATH = "/helios";

export const DOCS_URL = env.VITE_DOCS_URL || `${PRIMARY_ORIGIN}/docs`;

// These are intentionally kept on the legacy domain for now.
export const CONSOLE_URL = "https://console.heliosenergy.io/";
export const CONSOLE_SIGNUP_URL = "https://console.heliosenergy.io/login?tab=signup";
export const API_BASE_URL = "https://api.heliosenergy.io/v1";

export const LEGAL_EMAIL = env.VITE_LEGAL_EMAIL || "legal@heliosenergy.io";

