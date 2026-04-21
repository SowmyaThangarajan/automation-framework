📊 AI-Augmented Playwright Automation Framework

A TypeScript-based end-to-end testing framework built on Playwright with:

🧪 UI + API automation
📈 Data validation using Python (Pandas)
🤖 AI-driven failure analysis (agentic pipeline)
📊 Quality gate system from Playwright reports
🔁 Retry + anomaly detection + observability hooks
🚀 Features
🧪 Test Automation
Playwright UI + API tests
API service layer abstraction
UI + API consistency validation
Multi-project browser execution
📊 Data Validation (Python)
Row-level validation
Schema validation
Null & anomaly detection
Aggregation checks
CSV + JSON support
🤖 AI Failure Intelligence
Automatic failure extraction from Playwright JSON reports
Failure normalization layer
AI-based classification (Infra / Data / UI / API)
Action engine (retry / alert / ticket creation)
⚙️ Quality Gate System
Aggregates Playwright JSON reports
Extracts failed tests
Runs AI analysis pipeline
Blocks CI on critical failures
📡 Observability Layer
API latency tracking
Anomaly detection
Structured logging (api_log)
Extensible metrics system
📁 Project Structure
automation-framework/
│
├── api/
│   ├── clients/
│   │   └── BaseApiClient.ts
│   ├── services/
│   │   └── UserService.ts
│   └── validators/
│       └── schemaValidator.ts
│
├── ai/
│   ├── analyzer.ts
│   └── decisionEngine.ts
│
├── pipeline/
│   └── processor.ts
│
├── utils/
│   ├── failure.ts
│   ├── retry.ts
│   ├── reportParser.ts
│   ├── metrics.ts
│   └── logger.ts
│
├── scripts/
│   └── quality-gate.ts
│
├── tests/
│   ├── api/
│   ├── ui/
│   └── integration/
│
├── data-validation/
│   ├── data_validator.py
│   └── datasets/
│
├── results/
├── playwright.config.ts
└── package.json
⚙️ Installation
npm install

Install Playwright browsers:

npx playwright install --with-deps

Install Python dependencies:

pip install pandas
▶️ Running Tests
Run all tests
npx playwright test
Run specific shard (CI simulation)
npx playwright test --shard=1/4
📊 Data Validation

Run Python validator manually:

python data-validation/data_validator.py data-validation/api_response.json data-validation/datasets/expected_users.csv
🤖 Run AI Quality Gate
npx ts-node scripts/quality-gate.ts results

Expected output:

❌ X failures detected

RAW FAILURE: {...}
AI OUTPUT RECEIVED

---- FAILURE ANALYSIS ----
Normalized: {...}
AI Result: {...}
Actions: ["retry", "alert"]
⚙️ CI/CD Pipeline
GitHub Actions Flow
1. Test Stage
Runs Playwright tests in parallel shards
Uploads results artifacts
2. Quality Gate Stage
Downloads reports
Runs AI failure analysis
Evaluates pipeline health
📡 Reporting Configuration

Playwright outputs:

results/results.json
results/results-0.json
results/results.xml

Used by:

scripts/quality-gate.ts
🧠 AI Failure Pipeline
Flow:
Playwright Test Failure
        ↓
reportParser.ts
        ↓
Normalized Failure Object
        ↓
pipeline/processor.ts
        ↓
AI Analyzer (analyzer.ts)
        ↓
Decision Engine (decisionEngine.ts)
        ↓
Actions (retry / alert / ticket)
🧪 Example Failure Object
{
  "source": "ui",
  "type": "TEST_FAILURE",
  "message": "API + UI consistency",
  "error": "Expected 0 but received 0",
  "file": "ui-api.spec.ts"
}
🔁 Retry Strategy
export async function retry(fn, retries = 3)
Auto retries flaky API/UI calls
Captures last error state
📈 Observability
API Logging Format
{
  "type": "api_log",
  "method": "GET",
  "url": "...",
  "status": 200,
  "duration": 800
}
Metrics
API latency tracking
Anomaly detection (>2000ms threshold)
