import assert from "node:assert/strict";
import test from "node:test";
import { COLO_SITES } from "./sites";

test("capacity map matches the supplied state rollups", () => {
  const actual = Object.fromEntries(
    COLO_SITES.map(({ abbr, mw, siteCount }) => [abbr, { mw, siteCount }]),
  );

  assert.deepEqual(actual, {
    UT: { mw: 971, siteCount: 12 },
    TX: { mw: 906, siteCount: 5 },
    CO: { mw: 25, siteCount: 2 },
    CA: { mw: 23, siteCount: 2 },
    KY: { mw: 20, siteCount: 1 },
    ID: { mw: 10, siteCount: 1 },
    NJ: { mw: 6, siteCount: 1 },
  });
});

test("capacity map totals 24 sites across 7 states and 1,961 MW", () => {
  assert.equal(COLO_SITES.length, 7);
  assert.equal(COLO_SITES.reduce((sum, site) => sum + site.siteCount, 0), 24);
  assert.equal(COLO_SITES.reduce((sum, site) => sum + site.mw, 0), 1961);
});
