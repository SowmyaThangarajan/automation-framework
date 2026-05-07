import fs from 'fs';
import path from 'path';
import { analyzeFailure } from '../ai/analyzer';

type Failure = any;

const INPUT_DIR = 'reports';
const OUTPUT_FILE = 'reports/bug-report.json';

function collectFailures(): Failure[] {
  const shards = fs.readdirSync(INPUT_DIR)
    .filter(f => f.startsWith('shard-'));

  const failures: Failure[] = [];

  for (const shard of shards) {
    const file = path.join(INPUT_DIR, shard, 'failures.json');

    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      failures.push(...data);
    }
  }

  return failures;
}

async function main() {
  const failures = collectFailures();

  const enriched = [];

  for (const failure of failures) {
    const ai = await analyzeFailure(failure);

    enriched.push({
      ...failure,
      ai,
      bugTitle: ai.reason,
      severity:
        ai.type === 'Infra' ? 'low' :
        ai.type === 'Flaky UI' ? 'medium' :
        ai.type === 'API Regression' ? 'high' :
        'unknown'
    });
  }

  const bugReport = {
    totalFailures: enriched.length,
    generatedAt: new Date().toISOString(),
    bugs: enriched
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(bugReport, null, 2));

  console.log(`📊 Bug report generated: ${OUTPUT_FILE}`);
}

main();