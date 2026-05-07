import fs from 'fs';

export function extractFailures(reportPath: string) {
  const data = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

  const failures = [];

  const suites = data.suites || [];

  for (const suite of suites) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const results = test.results || [];

        const failedResult = results.find(
          (r: any) => r.status === 'failed'
        );

        if (failedResult) {
          failures.push({
            title: test.title,
            error: failedResult.error?.message || 'Unknown error',
            stack: failedResult.error?.stack || '',
            file: test.location?.file
          });
        }
      }
    }
  }

  return failures;
}