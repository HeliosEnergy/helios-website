import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('Reserve capacity opens the request form with Clusters selected', () => {
  const source = readFileSync(new URL('./HeroSection.tsx', import.meta.url), 'utf8');

  assert.match(
    source,
    /<ArrowCTA to="\/contact\?service=clusters" tone="dark" accent="primary">\s*Reserve capacity/,
  );
});
