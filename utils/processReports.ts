import { extractFailures } from '../utils/extractFailures';
import { analyzeFailure } from '../ai/analyzer';
import fs from 'fs';

export async function processReports(reportPath: string) {
  const failures = extractFailures(reportPath);

  const bugs = await Promise.all(
    failures.map(async (f) => {
      const ai = await analyzeFailure(f);

      return {
        ...f,
        aiResult: ai,
        bugTitle: generateBugTitle(f, ai),
        severity: mapSeverity(ai),
        stepsToReproduce: f.stack || 'Check trace logs',
      };
    })
  );

  const output = {
    totalFailures: bugs.length,
    generatedAt: new Date().toISOString(),
    bugs
  };

  fs.mkdirSync('reports/ai', { recursive: true });

  fs.writeFileSync(
    'reports/ai/bug-report.json',
    JSON.stringify(output, null, 2)
  );

  return output;
}

function generateBugTitle(f: any, ai: any) {
  return `[${ai.type}] ${f.title}`;
}

function mapSeverity(ai: any) {
  if (ai.type === 'Infra') return 'medium';
  if (ai.type === 'API Regression') return 'high';
  if (ai.type === 'Data Issue') return 'critical';
  return 'low';
}