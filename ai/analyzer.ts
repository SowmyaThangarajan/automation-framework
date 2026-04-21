export async function analyzeFailure(failure: any) {
  const prompt = `
  Classify this failure:
  ${JSON.stringify(failure)}
  `;

  // Call LLM here (OpenAI / etc.)
  return {
    type: "API",
    action: ["retry"],
    confidence: 90
  };
}