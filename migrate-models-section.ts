import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || "05vcm5dh",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-01-01",
});

async function migrateModelsSection() {
  try {
    console.log("🔄 Starting Models Section migration...");

    // Find the modelsSection document
    const modelsSection = await client.fetch(
      '*[_type == "modelsSection"][0]'
    );

    if (!modelsSection) {
      console.error("❌ Models Section document not found");
      return;
    }

    console.log("📝 Updating Models Section...");

    // Update with new copy
    const updated = await client
      .patch(modelsSection._id)
      .set({
        heading: "All Models.\nOne Platform.",
        description: "The fastest AI cloud.",
      })
      .commit();

    console.log("✅ Models Section updated successfully");
    console.log("📄 Updated document:", updated);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateModelsSection();
