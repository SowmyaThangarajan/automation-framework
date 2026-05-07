import fs from 'fs';
import path from 'path';
import { normalizeError } from '../utils/failure';
import { analyzeFailure } from '../ai/analyzer';
import { decideAction } from '../ai/decisionEngine';

const HISTORY_FILE = 'results/failures-history.json';

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

/* -----------------------------
   GLOBAL HISTORY
------------------------------ */
function saveFailure(entry: any) {
  ensureDir(HISTORY_FILE);

  let history: any[] = [];

  if (fs.existsSync(HISTORY_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
    } catch {
      history = [];
    }
  }

  history.push(entry);

  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

/* -----------------------------
   SHARD STORAGE
------------------------------ */
function saveShardFailure(entry: any) {
  const shard = process.env.PW_TEST_SHARD_INDEX || 'local';

  const file = `reports/shard-${shard}/failures.json`;

  ensureDir(file);

  let data: any[] = [];

  if (fs.existsSync(file)) {
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
      data = [];
    }
  }

  data.push(entry);

  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* -----------------------------
   MAIN FUNCTION
------------------------------ */
export async function processFailure(err: any) {
  const normalized = normalizeError(err);

  const aiResult = await analyzeFailure(normalized);

  const actions = decideAction(aiResult);

  const enriched = {
    ...normalized,
    aiResult,
    actions,
    tags: aiResult.tags,
    shard: process.env.PW_TEST_SHARD_INDEX || 'local',
    timestamp: new Date().toISOString()
  };

  saveFailure(enriched);
  saveShardFailure(enriched);

  return { normalized, aiResult, actions };
}