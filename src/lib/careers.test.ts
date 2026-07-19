import assert from "node:assert/strict";
import test from "node:test";
import {
  FALLBACK_CAREER_ROLES,
  careerApplicationHref,
  generalCareerApplicationHref,
} from "./careers";

test("fallback careers include three credible roles", () => {
  assert.deepEqual(
    FALLBACK_CAREER_ROLES.map((role) => role.title),
    ["Site Reliability Engineer", "Customer Success Engineer", "Data Center Deployment Engineer"],
  );
});

test("role applications open the existing contact flow with role context", () => {
  const href = careerApplicationHref(FALLBACK_CAREER_ROLES[0]);
  assert.match(href, /^\/contact\?service=others&message=/);
  assert.match(decodeURIComponent(href), /Site Reliability Engineer/);
});

test("general applications use the existing contact flow", () => {
  assert.match(generalCareerApplicationHref, /^\/contact\?service=others&message=/);
});
