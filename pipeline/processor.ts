import { normalizeError } from '../utils/failure';
import { analyzeFailure } from '../ai/analyzer';
import { decideAction } from '../ai/decisionEngine';

export async function processFailure(err: any) {
  const normalized = normalizeError(err);

  const aiResult = await analyzeFailure(normalized);

  const actions = decideAction(aiResult);

  return { normalized, aiResult, actions };
}