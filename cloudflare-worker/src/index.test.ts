import assert from "node:assert/strict";
import test from "node:test";

import { buildSlackLeadMessage, normalizeLeadEvent, verifySlackSignature } from "./index";

const encoder = new TextEncoder();

async function slackSignature(secret: string, timestamp: string, body: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(`v0:${timestamp}:${body}`));
  return `v0=${[...new Uint8Array(signed)].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

test("normalizes colocation payloads", () => {
  const event = normalizeLeadEvent({
    name: "Maya",
    email: "maya@example.ai",
    company: "Example AI",
    inquiryType: "Colocation",
    message: "Need dense racks by Q4",
    colocationDetails: { types: "B300" },
  });

  assert.equal(event.type, "lead.created");
  assert.equal(event.lead.service_key, "coloc");
  assert.equal(event.lead.details.colocation?.types, "B300");
  const slackMessage = buildSlackLeadMessage(event);
  assert.match(slackMessage.text, /Colocation/);
});

test("normalizes startup applications", () => {
  const event = normalizeLeadEvent({
    name: "Ari",
    email: "ari@example.ai",
    company: "Launch AI",
    inquiryType: "Startup Program Application",
    message: "Need credits",
    startupApplication: {
      companyName: "Launch AI",
      fundingStage: "seed",
      teamSize: "5-10",
      monthlyUsage: "500K requests",
    },
  });

  assert.equal(event.lead.service_key, "startup_program");
  assert.equal(event.lead.details.startup_application?.fundingStage, "seed");
});

test("normalizes unsupported website service labels to known service keys", () => {
  const event = normalizeLeadEvent({
    name: "Sam",
    email: "sam@example.ai",
    inquiryType: "Training",
    message: "Fine-tuning run next month",
  });

  assert.equal(event.lead.service_key, "training");
  assert.equal(event.lead.details.training?.summary, "Fine-tuning run next month");
});

test("verifies Slack signatures", async () => {
  const body = "payload=%7B%22type%22%3A%22block_actions%22%7D";
  const timestamp = "1781712000";
  const signature = await slackSignature("secret", timestamp, body);
  const request = new Request("https://worker.test/slack/actions", {
    method: "POST",
    headers: {
      "X-Slack-Request-Timestamp": timestamp,
      "X-Slack-Signature": signature,
    },
    body,
  });

  assert.equal(await verifySlackSignature(request, "secret", body, Number(timestamp)), true);
  assert.equal(await verifySlackSignature(request, "wrong", body, Number(timestamp)), false);
});
