import fs from 'fs';

export function parsePlaywrightReport(filePath: string) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const failures: any[] = [];

  function walkSuites(suites: any[]) {
    for (const suite of suites || []) {
      for (const spec of suite.specs || []) {
        for (const test of spec.tests || []) {
          for (const result of test.results || []) {
            if (result.status === 'failed' || test.status === 'unexpected') {
              failures.push({
                source: 'ui',
                type: 'TEST_FAILURE',
                message: spec.title,
                error: result.error?.message || 'No error message',
                file: spec.file
              });
            }
          }
        }
      }

      walkSuites(suite.suites);
    }
  }

  walkSuites(data.suites);

  return failures;
}