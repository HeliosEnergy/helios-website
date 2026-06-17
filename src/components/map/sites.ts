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
  /** Albers 975x610 coordinates from us-map-data.json */
  x: number;
  y: number;
  status: SiteStatus;
}

const at = (id: keyof typeof mapData.sites) => ({
  x: mapData.sites[id][0],
  y: mapData.sites[id][1],
});

export const STATUS_META: Record<SiteStatus, { label: string; dot: string }> = {
  reserved: { label: "Reserved", dot: "bg-primary" },
};

/** What "Reserved" means — surfaced as the map legend. */
export const STATUS_LEGEND = "Reserved — power is ready, ready for GPUs.";

export const COLO_SITES: Site[] = [
  { id: "utah", name: "Utah", metro: "Salt Lake City metro", abbr: "UT", ...at("utah"), status: "reserved" },
  { id: "northCarolina", name: "North Carolina", metro: "Charlotte metro", abbr: "NC", ...at("northCarolina"), status: "reserved" },
  { id: "florida", name: "Florida", metro: "Jacksonville metro", abbr: "FL", ...at("florida"), status: "reserved" },
  { id: "kentucky", name: "Kentucky", metro: "Louisville metro", abbr: "KY", ...at("kentucky"), status: "reserved" },
  { id: "texas", name: "Texas", metro: "Dallas–Fort Worth", abbr: "TX", ...at("texas"), status: "reserved" },
];
