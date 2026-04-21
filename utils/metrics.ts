export const metrics = {
  apiLatency: [] as number[],
};

export function recordLatency(ms: number) {
  metrics.apiLatency.push(ms);
}

export function detectAnomaly() {
  const avg = metrics.apiLatency.reduce((a, b) => a + b, 0) / metrics.apiLatency.length;

  if (avg > 2000) {
    throw new Error("Latency anomaly detected");
  }
}