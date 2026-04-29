import fs from 'fs';

type Failure = any;

type AIResult = {
  type: 'Flaky' | 'Infra' | 'API' | 'Data Issue' | 'Unknown';
  confidence: number;
  reason: string;
};

/* -----------------------------
   RULE-BASED FALLBACK (FAST + RELIABLE)
------------------------------ */
function ruleBasedAnalysis(failure: Failure): AIResult {
  const msg = (failure.message || '').toLowerCase();
  const error = (failure.error || '').toLowerCase();

  if (error.includes('timeout') || error.includes('network')) {
    return {
      type: 'Infra',
      confidence: 85,
      reason: 'Network/timeout issue detected'
    };
  }

  if (error.includes('500') || failure.status >= 500) {
    return {
      type: 'API',
      confidence: 90,
      reason: 'Server error'
    };
  }

  if (error.includes('schema') || error.includes('validation')) {
    return {
      type: 'Data Issue',
      confidence: 95,
      reason: 'Schema/data validation failure'
    };
  }

  if (msg.includes('element not found')) {
    return {
      type: 'Flaky',
      confidence: 70,
      reason: 'UI locator instability'
    };
  }

  return {
    type: 'Unknown',
    confidence: 50,
    reason: 'No clear pattern'
  };
}

/* -----------------------------
   OPTIONAL: LLM CALL
------------------------------ */
async function callLLM(failure: Failure): Promise<AIResult | null> {
  try {
    // ⚠️ Replace with real OpenAI call
    // Example using fetch (pseudo)

    /*
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Classify test failures into Infra, Flaky, API, Data Issue"
          },
          {
            role: "user",
            content: JSON.stringify(failure)
          }
        ]
      })
    });

    const data = await res.json();
    const text = data.choices[0].message.content;

    return JSON.parse(text);
    */

    return null; // fallback for now
  } catch (err) {
    console.error("LLM failed, falling back to rules");
    return null;
  }
}

/* -----------------------------
   MAIN ANALYZER
------------------------------ */
export async function analyzeFailure(failure: Failure): Promise<AIResult> {
  // 1. Try LLM (if enabled)
  const ai = await callLLM(failure);

  if (ai && ai.confidence > 60) {
    console.log("🤖 LLM classification used");
    return ai;
  }

  // 2. Fallback to deterministic logic
  const fallback = ruleBasedAnalysis(failure);

  console.log("🧠 Rule-based classification used");

  return fallback;
}