import fs from 'fs';
import { normalizeError } from '../utils/failure';
import { analyzeFailure } from '../ai/analyzer';
import { decideAction } from '../ai/decisionEngine';

const HISTORY_FILE = 'results/failures-history.json';

function saveFailure(entry: any) {
  let history = [];

  if (fs.existsSync(HISTORY_FILE)) {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
  }

  history.push(entry);

  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

export async function processFailure(err: any) {
  const normalized = normalizeError(err);

  const aiResult = await analyzeFailure(normalized);

  const actions = decideAction(aiResult);

  // ✅ Persist failure history
  saveFailure({
    ...normalized,
    aiResult,
    actions
  });

  return { normalized, aiResult, actions };
}