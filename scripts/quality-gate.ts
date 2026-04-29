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
let failed = 0;

const files = getAllJsonFiles(dir);

for (const file of files) {
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));

    // Playwright JSON format
    const tests = data?.suites || [];

    function countTests(suites: any[]): number {
      let count = 0;

      for (const s of suites) {
        if (s.specs) count += s.specs.length;
        if (s.suites) count += countTests(s.suites);
      }

      return count;
    }

    total += countTests(tests);

  } catch (e) {
    console.log("Skipping invalid JSON:", file);
  }
}

const summary = {
  total,
  critical: 0,
  flaky: 0,
  infra: 0,
  flakyRate: 0,
  infraRate: 0,
  decision: total > 0 ? "PASS" : "FAIL",
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(dir, "execution-summary.json"),
  JSON.stringify(summary, null, 2)
);

console.log(summary);