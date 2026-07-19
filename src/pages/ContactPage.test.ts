import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./ContactPage.tsx", import.meta.url), "utf8");

test("colocation asks for cooling and minimum facility tier", () => {
  assert.match(source, /Cooling requirement/);
  assert.match(source, /Air cooled/);
  assert.match(source, /Liquid cooled/);
  assert.match(source, /Minimum facility tier/);
  assert.match(source, /Tier I/);
  assert.match(source, /Tier II/);
  assert.match(source, /Tier III/);
});

test("colocation payload includes cooling and facility tier", () => {
  assert.match(source, /coolingRequirement:/);
  assert.match(source, /minimumFacilityTier:/);
});

test("colocation submission requires both selections", () => {
  assert.match(source, /colocationRequirementsComplete/);
  assert.match(source, /Select a cooling requirement and minimum facility tier/);
});
