import fs from "fs";
import path from "path";

const dir = process.argv[2] || "reports";

function getAllJsonFiles(folder: string): string[] {
  const files: string[] = [];

  function walk(current: string) {
    for (const file of fs.readdirSync(current)) {
      const full = path.join(current, file);
      const stat = fs.statSync(full);

      if (stat.isDirectory()) {
        walk(full);
      } else if (file.endsWith(".json")) {
        files.push(full);
      }
    }
  }

  walk(folder);
  return files;
}

let total = 0;
let passed = 0;
let failed = 0;
let skipped = 0;

const files = getAllJsonFiles(dir);

for (const file of files) {
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));

    // ✅ Playwright official stats (MOST RELIABLE)
    if (data.stats) {
      total +=
        (data.stats.expected || 0) +
        (data.stats.unexpected || 0) +
        (data.stats.flaky || 0);

      passed += data.stats.expected || 0;
      failed += data.stats.unexpected || 0;
      skipped += data.stats.skipped || 0;
    }
  } catch (e) {
    console.log("Skipping invalid JSON:", file);
  }
}

const flakyRate = total ? (failed / total) * 100 : 0;
const infraRate = 0; // placeholder unless you classify infra separately

const summary = {
  total,
  passed,
  failed,
  skipped,
  critical: failed, // optional mapping
  flaky: 0,
  infra: 0,
  flakyRate,
  infraRate,
  decision: failed > 0 ? "FAIL" : "PASS",
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(dir, "execution-summary.json"),
  JSON.stringify(summary, null, 2)
);

console.log(summary);