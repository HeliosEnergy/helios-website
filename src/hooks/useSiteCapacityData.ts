import { useMemo } from "react";
import { useSanityQuery } from "@/hooks/useSanityData";
import { COLO_SITES, mergeCapacitySnapshot, type Site, type SiteCapacitySnapshot } from "@/components/map/sites";

const SITE_CAPACITY_QUERY = `*[_id == "site-capacity-current"][0] {
  _id,
  id,
  publishedAt,
  sourceModifiedTime,
  totalMw,
  computeMw,
  energyMw,
  siteCount,
  sites[] {
    id,
    stateAbbr,
    totalMw,
    computeMw,
    energyMw,
    siteCount
  }
}`;

export function useSiteCapacityData(): {
  sites: Site[];
  snapshot?: SiteCapacitySnapshot | null;
  isLoading: boolean;
  isFallback: boolean;
  error: unknown;
} {
  const query = useSanityQuery<SiteCapacitySnapshot | null>("site-capacity-current", SITE_CAPACITY_QUERY);
  const sites = useMemo(() => mergeCapacitySnapshot(query.data), [query.data]);

  return {
    sites,
    snapshot: query.data,
    isLoading: query.isLoading,
    isFallback: !query.data && !query.isLoading,
    error: query.error,
  };
}

export { COLO_SITES };
