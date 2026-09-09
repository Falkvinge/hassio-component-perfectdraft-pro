#!/usr/bin/env node
// Compares the card catalog's kegId coverage against a committed snapshot of the
// PerfectDraft integration's keg_catalog.json. The card joins against the
// integration on product ID, so a gap here is a keg that renders without its
// branding. Run via `npm run check:catalog`.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const reference = JSON.parse(readFileSync(join(here, "keg-catalog.reference.json"), "utf8"));
const source = readFileSync(join(here, "..", "src", "beer-catalog.ts"), "utf8");

const upstream = reference.kegs;

// The catalog is one entry per line, which keeps this parse honest without
// pulling in a TypeScript parser just for a data check.
const entries = [];
for (const line of source.split("\n")) {
  const slug = line.match(/slug: "(.*?)"/);
  if (!slug) continue;
  const name = line.match(/name: "(.*?)"/);
  const kegId = line.match(/kegId: "(\d+)"/);
  entries.push({ slug: slug[1], name: name?.[1] ?? "", kegId: kegId?.[1] });
}

const problems = [];

const seen = new Map();
for (const entry of entries) {
  if (!entry.kegId) continue;
  if (seen.has(entry.kegId)) {
    problems.push(
      `duplicate kegId ${entry.kegId}: "${seen.get(entry.kegId).slug}" and "${entry.slug}"`,
    );
    continue;
  }
  seen.set(entry.kegId, entry);
}

for (const [kegId, entry] of seen) {
  if (!(kegId in upstream)) {
    problems.push(`kegId ${kegId} on "${entry.slug}" is absent from the integration catalog`);
  }
}

for (const [kegId, name] of Object.entries(upstream)) {
  if (!seen.has(kegId)) {
    problems.push(`product ID ${kegId} ("${name}") has no card catalog entry`);
  }
}

const covered = Object.keys(upstream).filter((id) => seen.has(id)).length;
const total = Object.keys(upstream).length;
console.log(
  `catalog: ${entries.length} entries, ${seen.size} mapped product IDs, ` +
    `${covered}/${total} of the integration catalog covered ` +
    `(upstream snapshot @ ${reference._upstreamCommit})`,
);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems.sort()) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log("catalog coverage is complete and consistent");
