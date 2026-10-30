import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const deploymentEnabled = config.git?.deploymentEnabled;

assert.ok(deploymentEnabled && typeof deploymentEnabled === "object",
  "vercel.json must define git.deploymentEnabled as a branch policy");
assert.equal(deploymentEnabled["*"], false,
  "Vercel deployments must be disabled by default for every branch");

for (const branch of ["stage", "main"]) {
  assert.equal(deploymentEnabled[branch], true,
    `Vercel deployments must remain enabled for ${branch}`);
}

assert.notEqual(deploymentEnabled.feature, true,
  "The feature branch must never be enabled for Vercel deployment");
assert.equal(deploymentEnabled.feature ?? deploymentEnabled["*"], false,
  "The feature branch must inherit the disabled-by-default Vercel policy");

const enabledBranches = Object.entries(deploymentEnabled)
  .filter(([, enabled]) => enabled === true)
  .map(([branch]) => branch)
  .sort();
assert.deepEqual(enabledBranches, ["main", "stage"],
  "Only main and stage may deploy to Vercel");

console.log("Vercel deployment policy verified: only main and stage are enabled; feature and all other branches are excluded.");
