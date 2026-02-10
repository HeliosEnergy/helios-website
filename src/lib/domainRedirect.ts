import {
  BRAND_TRANSITION_PATH,
  LEGACY_HOSTNAME,
  LEGACY_ORIGIN,
  PRIMARY_HOSTNAME,
  PRIMARY_ORIGIN,
} from "@/lib/site";

const isLocalHost = (hostname: string) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "::1" ||
  hostname.endsWith(".localhost");

const matchesHost = (hostname: string, expected: string) =>
  hostname === expected || hostname === `www.${expected}`;

const isBrandTransitionPath = (pathname: string) =>
  pathname === BRAND_TRANSITION_PATH || pathname.startsWith(`${BRAND_TRANSITION_PATH}/`);

// Client-side safety net. The real/ideal setup is an edge 301/308 redirect in Cloudflare/Vercel.
export const maybeRedirectForDomainMigration = (loc: Location) => {
  const hostname = loc.hostname.toLowerCase();
  if (isLocalHost(hostname)) return;

  const isLegacy = matchesHost(hostname, LEGACY_HOSTNAME.toLowerCase());
  const isPrimary = matchesHost(hostname, PRIMARY_HOSTNAME.toLowerCase());
  const isBrandTransition = isBrandTransitionPath(loc.pathname);

  // Legacy domain should only serve the brand transition page at `/` and `/helios`.
  // Everything else should go to the primary domain (preserve path/query/hash).
  if (isLegacy && loc.pathname !== "/" && !isBrandTransition) {
    const target = `${PRIMARY_ORIGIN}${loc.pathname}${loc.search}${loc.hash}`;
    loc.replace(target);
    return;
  }

  // The brand transition page should not be served on the primary domain.
  if (isPrimary && isBrandTransition) {
    const target = `${PRIMARY_ORIGIN}/${loc.search}${loc.hash}`;
    loc.replace(target);
  }
};
