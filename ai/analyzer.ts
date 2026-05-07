import fs from 'fs';

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

/* -----------------------------
   RULE-BASED ANALYSIS (FAST + RELIABLE)
------------------------------ */
function ruleBasedAnalysis(failure: any): AIResult {
  const msg = (failure.message || '').toLowerCase();
  const error = (failure.error || '').toLowerCase();
  const status = failure.status;

  const combined = `${msg} ${error}`;

  // ---------------- Infra issues ----------------
  const isTimeout =
    combined.includes('timeout') ||
    combined.includes('timed out') ||
    combined.includes('navigation timeout');

  const isNetwork =
    combined.includes('network') ||
    combined.includes('fetch') ||
    combined.includes('econnreset') ||
    combined.includes('socket');

  if (isTimeout || isNetwork) {
    return {
      type: 'Infra',
      confidence: 88,
      reason: 'Network or timeout-related failure detected',
      tags: ['timeout', 'network']
    };
  }

  // ---------------- API failures ----------------
  if (status >= 500 || combined.includes('500') || combined.includes('502') || combined.includes('503')) {
    return {
      type: 'API Regression',
      confidence: 92,
      reason: 'Server-side API error detected',
      tags: ['api', 'server-error']
    };
  }

  // ---------------- Data issues ----------------
  const isDataIssue =
    combined.includes('schema') ||
    combined.includes('validation') ||
    combined.includes('invalid json') ||
    combined.includes('type mismatch');

  if (isDataIssue) {
    return {
      type: 'Data Issue',
      confidence: 95,
      reason: 'Schema or data validation failure',
      tags: ['schema', 'validation']
    };
  }

  // ---------------- Flaky UI ----------------
  const isFlakyUI =
    combined.includes('element not found') ||
    combined.includes('locator') ||
    combined.includes('detached') ||
    combined.includes('stale element') ||
    combined.includes('strict mode violation');

  if (isFlakyUI) {
    return {
      type: 'Flaky UI',
      confidence: 75,
      reason: 'UI locator instability or timing issue',
      tags: ['ui', 'locator', 'flaky']
    };
  }

  // ---------------- Environment issues ----------------
  if (combined.includes('permission') || combined.includes('denied') || combined.includes('env')) {
    return {
      type: 'Environment Issue',
      confidence: 70,
      reason: 'Environment or permission issue detected',
      tags: ['env']
    };
  }

  // ---------------- Unknown ----------------
  return {
    type: 'Unknown',
    confidence: 50,
    reason: 'No matching failure pattern found',
    tags: ['unknown']
  };
}

/* -----------------------------
   OPTIONAL LLM CLASSIFIER
------------------------------ */
async function callLLM(failure: any): Promise<AIResult | null> {
  try {
    // Replace with real OpenAI integration if needed
    return null;
  } catch (err) {
    console.error('LLM failed, falling back to rules');
    return null;
  }
}

/* -----------------------------
   MAIN ANALYZER
------------------------------ */
export async function analyzeFailure(failure: any): Promise<AIResult> {
  // 1. Try LLM first (if enabled)
  const ai = await callLLM(failure);

  if (ai && ai.confidence > 60) {
    return {
      ...ai,
      tags: ai.tags || []
    };
  }

  // 2. Rule-based fallback
  return ruleBasedAnalysis(failure);
}