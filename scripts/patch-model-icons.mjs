/**
 * Migration: Patch model icon filenames
 *
 * Updates the iconFilename field for all models in the modelLibrary
 * so they reference the correct files in /public/model-lib/.
 *
 * Also corrects Whisper Faster provider from SYSTRAN → OpenAI.
 *
 * Usage:
 *   node scripts/patch-model-icons.mjs
 *
 * Requires SANITY_WRITE_TOKEN in .env
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config();

const client = createClient({
  projectId: '05vcm5dh',
  dataset: 'production',
  apiVersion: '2024-12-19',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const patches = [
  {
    id: 'model-bark',
    fields: { iconFilename: 'suno.png' },
  },
  {
    id: 'model-flux',
    fields: { iconFilename: 'flux.png' },
  },
  {
    id: 'model-qwen3-vl',
    fields: { iconFilename: 'qwen.png' },
  },
  {
    id: 'model-whisper-faster',
    fields: { iconFilename: 'openai.png', provider: 'OpenAI' },
  },
  {
    id: 'model-whisper-large',
    fields: { iconFilename: 'openai.png' },
  },
];

async function run() {
  console.log('Starting icon filename migration...\n');

  for (const patch of patches) {
    try {
      const result = await client
        .patch(patch.id)
        .set(patch.fields)
        .commit();
      console.log(`  ✓ ${result._id} → ${JSON.stringify(patch.fields)}`);
    } catch (err) {
      console.error(`  ✗ ${patch.id} failed:`, err.message);
    }
  }

  console.log('\nMigration complete.');
}

run();
