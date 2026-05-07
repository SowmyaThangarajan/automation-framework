import fs from 'fs';
import path from 'path';

import { extractFailures } from './extractFailures';
import { analyzeFailure } from '../ai/analyzer';

export async function processReports(reportPath: string) {
  const failures = extractFailures(reportPath);

  const bugs = await Promise.all(
    failures.map(async (failure: any) => {
      const aiResult = await analyzeFailure(failure);

      return {
        bugTitle: failure.title,
        error: failure.error,
        aiResult,
        severity:
          aiResult.confidence > 90
            ? 'HIGH'
            : aiResult.confidence > 70
            ? 'MEDIUM'
            : 'LOW'
      };
    })
  );

  const finalReport = {
    totalFailures: bugs.length,
    generatedAt: new Date().toISOString(),
    bugs
  };

  fs.mkdirSync('reports/ai', { recursive: true });

  fs.writeFileSync(
    'reports/ai/bug-report.json',
    JSON.stringify(finalReport, null, 2)
  );

  console.log('✅ AI bug report generated');

  return finalReport;
}

// CLI support
const reportPath = process.argv[2] || 'reports';

processReports(reportPath);