import fs from 'fs';
import path from 'path';
import process from 'process';
import { parsePlaywrightReport } from '../utils/reportParser';
import { processFailure } from '../pipeline/processor';

type Failure = any; // replace later with your Failure type

async function main(): Promise<void> {
  const reportsDir: string = process.argv[2];

  const files: string[] = findJsonReports(reportsDir);

  console.log("REPORT DIR:", reportsDir);
  console.log("FILES FOUND:", files);

  let failures: Failure[] = [];

  for (const file of files) {
    const parsed = parsePlaywrightReport(file);
    failures.push(...parsed);
  }

  if (failures.length === 0) {
    console.log("✅ No failures detected");
    process.exit(0);
  }

  console.log(`❌ ${failures.length} failures detected\n`);

  for (const failure of failures) {
    console.log("RAW FAILURE:", JSON.stringify(failure, null, 2));
    const result = await processFailure(failure);

    console.log("AI OUTPUT RECEIVED");

    console.log("---- FAILURE ANALYSIS ----");
    console.log("Normalized:", result.normalized);
    console.log("AI Result:", result.aiResult);
    console.log("Actions:", result.actions);
    console.log("--------------------------\n");
  }

  process.exit(1);
}

function findJsonReports(dir: string): string[] {
  let results: string[] = [];

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(findJsonReports(fullPath));
    } else if (file.endsWith('.json')) {
      results.push(fullPath);
    }
  }

  return results;
}

main();