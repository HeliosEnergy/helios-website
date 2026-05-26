// Central place for public URLs/domains used by the marketing site.
// Keep console/api on heliosenergy.io until those services are rebranded/migrated.

const env = import.meta.env as Record<string, string | undefined>;
const DEFAULT_LEGACY_ORIGINS = ["https://helioscloud.org"];

export const PRIMARY_ORIGIN = env.VITE_PRIMARY_ORIGIN || "https://helios.co";
export const LEGACY_ORIGIN = env.VITE_LEGACY_ORIGIN || "https://heliosenergy.io";
export const LEGACY_ORIGINS = (env.VITE_LEGACY_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const PRIMARY_HOSTNAME = new URL(PRIMARY_ORIGIN).hostname;
export const LEGACY_HOSTNAME = new URL(LEGACY_ORIGIN).hostname;
export const LEGACY_HOSTNAMES = Array.from(
  new Set([
    LEGACY_HOSTNAME,
    ...DEFAULT_LEGACY_ORIGINS.map((origin) => new URL(origin).hostname),
    ...LEGACY_ORIGINS.map((origin) => new URL(origin).hostname),
  ]),
).map((hostname) => hostname.toLowerCase());

// This route should remain available on the legacy domain only.
export const BRAND_TRANSITION_PATH = "/helios";

export const DOCS_URL = env.VITE_DOCS_URL || `${PRIMARY_ORIGIN}/docs`;

// Console entry points are centralized here so CTAs stay consistent.
export const CONSOLE_URL = "https://console.helios.co/";
export const CONSOLE_SIGNUP_URL = "https://console.helios.co/login?tab=signup";
export const API_BASE_URL = "https://api.heliosenergy.io/v1";

export const LEGAL_EMAIL = env.VITE_LEGAL_EMAIL || "legal@heliosenergy.io";
