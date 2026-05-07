export type RootCause =
  | 'Infra'
  | 'Flaky UI'
  | 'API Regression'
  | 'Data Issue'
  | 'Test Bug'
  | 'Environment Issue'
  | 'Unknown';

export type AIResult = {
  type: RootCause;
  confidence: number;
  reason: string;
  tags: string[];
};

function ruleBasedAnalysis(failure: any): AIResult {
  const msg = (failure.message || '').toLowerCase();
  const error = (failure.error || '').toLowerCase();
  const status = failure.status;

  const combined = `${msg} ${error}`;

  if (
    combined.includes('timeout') ||
    combined.includes('network') ||
    combined.includes('socket')
  ) {
    return {
      type: 'Infra',
      confidence: 88,
      reason: 'Network or timeout failure',
      tags: ['timeout', 'network']
    };
  }

  if (status >= 500 || combined.includes('500')) {
    return {
      type: 'API Regression',
      confidence: 92,
      reason: 'Server-side API failure',
      tags: ['api', 'server']
    };
  }

  if (
    combined.includes('schema') ||
    combined.includes('validation') ||
    combined.includes('invalid json')
  ) {
    return {
      type: 'Data Issue',
      confidence: 95,
      reason: 'Data validation failure',
      tags: ['schema', 'validation']
    };
  }

  if (
    combined.includes('element not found') ||
    combined.includes('locator') ||
    combined.includes('detached')
  ) {
    return {
      type: 'Flaky UI',
      confidence: 75,
      reason: 'UI locator instability',
      tags: ['ui', 'flaky']
    };
  }

  if (
    combined.includes('permission') ||
    combined.includes('denied')
  ) {
    return {
      type: 'Environment Issue',
      confidence: 70,
      reason: 'Environment permission issue',
      tags: ['env']
    };
  }

  return {
    type: 'Unknown',
    confidence: 50,
    reason: 'No pattern matched',
    tags: ['unknown']
  };
}

async function callLLM(_failure: any): Promise<AIResult | null> {
  return null; // plug OpenAI later
}

export async function analyzeFailure(failure: any): Promise<AIResult> {
  const ai = await callLLM(failure);

  if (ai && ai.confidence > 60) return ai;

  return ruleBasedAnalysis(failure);
}