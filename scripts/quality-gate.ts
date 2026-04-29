import fs from "fs";
import path from "path";
import process from "process";
import crypto from "crypto";

import { parsePlaywrightReport } from "../utils/reportParser";
import { processFailure } from "../pipeline/processor";

type Failure = any;

const HISTORY_FILE = "results/failures-history.json";

/* -----------------------------
   LOAD / SAVE HISTORY
------------------------------ */
function loadHistory(): Failure[] {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
}

function saveHistory(failures: Failure[]) {
  fs.mkdirSync("results", { recursive: true });
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(failures, null, 2));
}

/* -----------------------------
   HASHING / CLUSTERING
------------------------------ */
function hashFailure(f: Failure): string {
  return crypto
    .createHash("md5")
    .update(`${f.message}-${f.endpoint || ""}`)
    .digest("hex");
}

/* -----------------------------
   TRANSFORMATION LAYER
------------------------------ */
function transformFailure(raw: any): Failure {
  return {
    id: hashFailure(raw),
    source: raw.source || "unknown",
    type: raw.type || "UNKNOWN",
    message: raw.message || raw.error || "no message",
    endpoint: raw.endpoint || null,
    timestamp: new Date().toISOString(),
    severity:
      raw.status >= 500 ? "critical" :
      raw.status >= 400 ? "high" : "medium"
  };
}

/* -----------------------------
   FIND REPORTS
------------------------------ */
function findJsonReports(dir: string): string[] {
  let results: string[] = [];

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(findJsonReports(fullPath));
    } else if (file.endsWith(".json")) {
      results.push(fullPath);
    }
  }

  return results;
}

/* -----------------------------
   QUALITY DECISION ENGINE (NEW)
------------------------------ */
function evaluateQuality(enrichedFailures: any[]) {
  let critical = 0;
  let flaky = 0;
  let infra = 0;

  for (const f of enrichedFailures) {
    const type = f.ai?.aiResult?.type;

    if (f.severity === "critical") critical++;

    if (type === "Flaky") flaky++;
    if (type === "Infra") infra++;
  }

  const total = enrichedFailures.length;

  const flakyRate = total ? (flaky / total) * 100 : 0;
  const infraRate = total ? (infra / total) * 100 : 0;

  let decision = "PASS";

  if (critical > 0) decision = "FAIL";
  else if (infraRate > 50) decision = "RETRY";
  else if (flakyRate > 30) decision = "WARN";

  return {
    total,
    critical,
    flaky,
    infra,
    flakyRate,
    infraRate,
    decision
  };
}

/* -----------------------------
   WRITE DETAILED REPORT
------------------------------ */
function writeSummary(result: any) {
  const summary = {
    ...result,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    "results/execution-summary.json",
    JSON.stringify(summary, null, 2)
  );

  console.log("📊 Quality Gate Result:");
  console.log(JSON.stringify(summary, null, 2));
}

/* -----------------------------
   MAIN PIPELINE
------------------------------ */
async function main() {
  const dir = process.argv[2];

  const files = findJsonReports(dir);

  let rawFailures: any[] = [];

  for (const file of files) {
    const parsed = parsePlaywrightReport(file);
    rawFailures.push(...parsed);
  }

  const transformed = rawFailures.map(transformFailure);

  /* -------------------------
     HISTORY
  -------------------------- */
  const history = loadHistory();
  const mergedHistory = [...history, ...transformed];

  /* -------------------------
     AI PROCESSING
  -------------------------- */
  const enrichedFailures = [];

  for (const f of transformed) {
    let ai = await processFailure(f);

    // 🔥 HISTORY-BASED FLAKY DETECTION
    if (detectFlakyFromHistory(history, f)) {
      console.log(`🧠 Overriding AI → Marking as FLAKY (history-based)`);

      ai.aiResult.type = "Flaky";
      ai.aiResult.confidence = 95;

      // Optional: adjust actions too
      ai.actions = ["retry"];
    }

    enrichedFailures.push({
      ...f,
      ai
    });
  }
  /* -------------------------
     SAVE HISTORY
  -------------------------- */
  saveHistory(mergedHistory);

  /* -------------------------
     INTELLIGENT DECISION
  -------------------------- */
  const quality = evaluateQuality(enrichedFailures);

  writeSummary(quality);

  /* -------------------------
     PIPELINE CONTROL
  -------------------------- */
  if (quality.decision === "FAIL") {
    console.log("❌ Failing pipeline due to critical issues");
    process.exit(1);
  }

  if (quality.decision === "RETRY") {
    console.log("🔁 High infra failure rate - recommend retry");
    process.exit(1); // or trigger workflow_dispatch via API
  }

  if (quality.decision === "WARN") {
    console.log("⚠️ Flaky tests detected - not blocking pipeline");
    process.exit(0);
  }

  console.log("✅ Quality gate passed");
  process.exit(0);
}

function detectFlakyFromHistory(history: any[], failure: any): boolean {
  const matches = history.filter(h => h.id === failure.id);

  return matches.length > 3;
}

main().catch((err) => {
  console.error("❌ Error in quality gate:", err);
  process.exit(1);
});