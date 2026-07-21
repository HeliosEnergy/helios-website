import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("homepage CTA always has complete local fallback content and a valid route", () => {
  const source = read("./CTASection.tsx");

  assert.match(source, /Plan your Helios deployment/);
  assert.match(source, /Get a deployment plan/);
  assert.match(source, /if \(!url\) return CTA_FALLBACK\.primaryCtaLink/);
  assert.doesNotMatch(source, /return ["']#["']/);
  assert.doesNotMatch(source, /Loading\.\.\./);
});

test("homepage proof claims disclose scope and status", () => {
  const hero = read("./HeroSection.tsx");
  const sections = read("./HomeRevampSections.tsx");
  const footprint = read("./map/FootprintSection.tsx");
  const sites = read("./map/sites.ts");

  assert.match(hero, /For reserved capacity/);
  assert.match(hero, /subject to final configuration and site readiness/);
  assert.match(hero, /<motion\.h1/);
  assert.match(sections, /not a service-level commitment/);
  assert.match(sections, /PUE and renewable-energy share vary by site/);
  assert.match(footprint, /not operational GPU capacity/);
  assert.match(sites, /not necessarily energized/);
});

test("offering and GPU choices remain visible without hover", () => {
  const offerings = read("./HomeRevampSections.tsx");
  const gpus = read("./GpuSovereigntySection.tsx");

  assert.match(offerings, /handleTabKeyDown/);
  assert.match(offerings, /min-h-11 min-w-32/);
  assert.match(offerings, /text-white\/70 group-hover:text-white/);
  assert.match(gpus, /<motion\.article/);
  assert.doesNotMatch(gpus, /lg:opacity-0/);
  assert.doesNotMatch(gpus, /cursor-pointer/);
});
