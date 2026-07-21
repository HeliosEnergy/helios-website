import mapData from "./us-map-data.json";

/* Status is intentionally a single state for now. Until power is energized
   and GPUs are racked, every site reads the same: the power is reserved and
   ready. Live / Energizing tiers will come back once sites are actually online. */
export type SiteStatus = "reserved";

export interface Site {
  id: keyof typeof mapData.sites;
  name: string;
  metro: string;
  abbr: string;
  /** Total reserved capacity for the state, in MW (from the powered-sites schedule). */
  mw: number;
  /** Number of individual sites rolled into this state marker. */
  siteCount: number;
  /** Albers 975x610 coordinates from us-map-data.json */
  x: number;
  y: number;
  status: SiteStatus;
}

export interface SiteCapacitySnapshot {
  publishedAt?: string;
  sourceModifiedTime?: string;
  totalMw?: number;
  computeMw?: number;
  energyMw?: number;
  siteCount?: number;
  sites?: Array<{
    id: string;
    stateAbbr?: string;
    totalMw: number;
    computeMw?: number;
    energyMw?: number;
    siteCount: number;
  }>;
}

const at = (id: keyof typeof mapData.sites) => ({
  x: mapData.sites[id][0],
  y: mapData.sites[id][1],
});

export const STATUS_META: Record<SiteStatus, { label: string; dot: string }> = {
  reserved: { label: "Reserved", dot: "bg-primary" },
};

/** What "Reserved" means — surfaced as the map legend. */
export const STATUS_LEGEND =
  "Reserved capacity — allocated in the development pipeline; not necessarily energized.";

/* State markers roll up the individual sites in the powered-sites schedule.
   MW is total reserved capacity per state; sorted high-to-low so the ledger
   reads as a capacity ranking. */
export const COLO_SITES: Site[] = [
  { id: "utah", name: "Utah", metro: "Salt Lake City metro", abbr: "UT", mw: 971, siteCount: 12, ...at("utah"), status: "reserved" },
  { id: "texas", name: "Texas", metro: "Dallas–Fort Worth", abbr: "TX", mw: 906, siteCount: 5, ...at("texas"), status: "reserved" },
  { id: "colorado", name: "Colorado", metro: "Denver metro", abbr: "CO", mw: 25, siteCount: 2, ...at("colorado"), status: "reserved" },
  { id: "california", name: "California", metro: "Anaheim metro", abbr: "CA", mw: 23, siteCount: 2, ...at("california"), status: "reserved" },
  { id: "kentucky", name: "Kentucky", metro: "London", abbr: "KY", mw: 20, siteCount: 1, ...at("kentucky"), status: "reserved" },
  { id: "idaho", name: "Idaho", metro: "Boise metro", abbr: "ID", mw: 10, siteCount: 1, ...at("idaho"), status: "reserved" },
  { id: "newJersey", name: "New Jersey", metro: "Northern New Jersey", abbr: "NJ", mw: 6, siteCount: 1, ...at("newJersey"), status: "reserved" },
];

const SITE_IDS = new Set(COLO_SITES.map((site) => site.id));

export const mergeCapacitySnapshot = (snapshot?: SiteCapacitySnapshot | null): Site[] => {
  if (!snapshot?.sites?.length) return COLO_SITES;

  const liveById = new Map(
    snapshot.sites
      .filter((site) => SITE_IDS.has(site.id) && Number.isFinite(site.totalMw) && Number.isFinite(site.siteCount))
      .map((site) => [site.id, site]),
  );

  if (liveById.size === 0) return COLO_SITES;

  return [...liveById.values()].map((live) => {
    const site = COLO_SITES.find((candidate) => candidate.id === live.id);
    if (!site) return null;
    return {
      ...site,
      mw: live.totalMw,
      siteCount: live.siteCount,
    };
  }).filter((site): site is Site => Boolean(site)).sort((a, b) => b.mw - a.mw);
};
