import fs from "fs";
import path from "path";

const dir = process.argv[2] || "reports";

/* =========================================================
   SAFETY CHECK
========================================================= */
if (!fs.existsSync(dir)) {
  console.error(`Directory not found: ${dir}`);
  process.exit(1);
}

/* =========================================================
   RECURSIVELY FIND JSON FILES
========================================================= */
function getAllJsonFiles(folder: string): string[] {
  const files: string[] = [];

  function walk(current: string) {
    const entries = fs.readdirSync(current, {
      withFileTypes: true
    });

    for (const entry of entries) {
      const full = path.join(current, entry.name);

      if (entry.isDirectory()) {
        walk(full);
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".json")
      ) {
        files.push(full);
      }
    }
  }

  walk(folder);

  return files;
}

/* =========================================================
   STATS
========================================================= */
let total = 0;
let passed = 0;
let failed = 0;
let skipped = 0;
let flaky = 0;

const processedFiles: string[] = [];

const files = getAllJsonFiles(dir);

console.log("=================================================");
console.log("FOUND JSON FILES");
console.log("=================================================");

files.forEach(f => console.log(f));

/* =========================================================
   PARSE PLAYWRIGHT REPORTS
========================================================= */
for (const file of files) {
  try {
    const raw = fs.readFileSync(file, "utf-8");

    if (!raw.trim()) continue;

    const data = JSON.parse(raw);

    // ✅ Only process Playwright result JSON
    if (data.stats) {
      processedFiles.push(file);

      total +=
        (data.stats.expected || 0) +
        (data.stats.unexpected || 0) +
        (data.stats.flaky || 0) +
        (data.stats.skipped || 0);

      passed += data.stats.expected || 0;
      failed += data.stats.unexpected || 0;
      skipped += data.stats.skipped || 0;
      flaky += data.stats.flaky || 0;
    }
  } catch (e) {
    console.log(`Skipping invalid JSON: ${file}`);
  }
}

/* =========================================================
   CALCULATIONS
========================================================= */
const flakyRate =
  total > 0 ? Number(((flaky / total) * 100).toFixed(2)) : 0;

const passRate =
  total > 0 ? Number(((passed / total) * 100).toFixed(2)) : 0;

/* =========================================================
   FINAL SUMMARY
========================================================= */
const summary = {
  generatedAt: new Date().toISOString(),

  totals: {
    total,
    passed,
    failed,
    skipped,
    flaky
  },

  rates: {
    passRate,
    flakyRate
  },

  processedFiles,

  decision: failed > 0 ? "FAIL" : "PASS"
};

/* =========================================================
   ENSURE OUTPUT DIR
========================================================= */
fs.mkdirSync(dir, { recursive: true });

/* =========================================================
   WRITE SUMMARY
========================================================= */
const output = path.join(
  dir,
  "execution-summary.json"
);

fs.writeFileSync(
  output,
  JSON.stringify(summary, null, 2)
);

console.log("=================================================");
console.log("QUALITY GATE SUMMARY");
console.log("=================================================");

console.log(JSON.stringify(summary, null, 2));

console.log(`Execution summary written to: ${output}`);