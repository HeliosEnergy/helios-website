import mapData from "./us-map-data.json";

export type SiteStatus = "live" | "energizing" | "reserving";

export interface Site {
  id: keyof typeof mapData.sites;
  name: string;
  metro: string;
  abbr: string;
  /** Albers 975x610 coordinates from us-map-data.json */
  x: number;
  y: number;
  status: SiteStatus;
  statusLabel: string;
  capacity: string;
  cooling: string;
  power: string;
}

const at = (id: keyof typeof mapData.sites) => ({
  x: mapData.sites[id][0],
  y: mapData.sites[id][1],
});

export const STATUS_META: Record<SiteStatus, { label: string; dot: string }> = {
  live: { label: "Live", dot: "bg-eco" },
  energizing: { label: "Energizing", dot: "bg-primary" },
  reserving: { label: "Reserving", dot: "bg-white/40" },
};

export const DC_SITES: Site[] = [
  {
    id: "utah",
    name: "Utah",
    metro: "Salt Lake City metro",
    abbr: "UT",
    ...at("utah"),
    status: "live",
    statusLabel: "Live",
    capacity: "40 MW",
    cooling: "Direct-to-chip, water-free",
    power: "Solar + storage PPA",
  },
  {
    id: "northCarolina",
    name: "North Carolina",
    metro: "Charlotte metro",
    abbr: "NC",
    ...at("northCarolina"),
    status: "energizing",
    statusLabel: "Energizing Q3 2026",
    capacity: "32 MW",
    cooling: "Direct-to-chip, water-free",
    power: "Nuclear-backed grid",
  },
  {
    id: "florida",
    name: "Florida",
    metro: "Jacksonville metro",
    abbr: "FL",
    ...at("florida"),
    status: "live",
    statusLabel: "Live",
    capacity: "24 MW",
    cooling: "Direct-to-chip, water-free",
    power: "Solar + grid mix",
  },
];

export const COLO_SITES: Site[] = [
  ...DC_SITES,
  {
    id: "kentucky",
    name: "Kentucky",
    metro: "Louisville metro",
    abbr: "KY",
    ...at("kentucky"),
    status: "reserving",
    statusLabel: "Reserving · live Q4 2026",
    capacity: "18 MW",
    cooling: "Direct-to-chip, water-free",
    power: "Hydro + grid mix",
  },
  {
    id: "texas",
    name: "Texas",
    metro: "Dallas–Fort Worth",
    abbr: "TX",
    ...at("texas"),
    status: "reserving",
    statusLabel: "Reserving · live Q1 2027",
    capacity: "60 MW",
    cooling: "Direct-to-chip, water-free",
    power: "Wind + solar PPA",
  },
];
