import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const banner = readFileSync(new URL("./ColocationBanner.tsx", import.meta.url), "utf8");
const colocationPage = readFileSync(new URL("../../pages/ColocationPage.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../../index.css", import.meta.url), "utf8");

test("banner explains customer-owned GPU colocation", () => {
  assert.match(banner, /GPU colocation/);
  assert.match(banner, /Already own the hardware/);
  assert.match(banner, /Bring your GPU servers/);
  assert.match(banner, /air or liquid cooling/);
});

test("banner links directly to the colocation calculator", () => {
  assert.match(banner, /to="\/colocation#calculator"/);
  assert.match(banner, /Estimate colocation cost/);
  assert.match(colocationPage, /id="calculator"/);
});

test("ring animation respects reduced motion", () => {
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.colo-orbit/);
});
