export type FailureSource = 'api' | 'ui' | 'data' | 'unknown';

export type Failure = {
  source: 'api' | 'ui' | 'data' | 'unknown';
  type: string;
  message: string;
  endpoint?: string;
  status?: number;
  timestamp: string;

  // NEW 👇
  error?: string;
  stack?: string;
  file?: string;
};

export function createFailure(f: Partial<Failure>): Error {
  return new Error(JSON.stringify({
    timestamp: new Date().toISOString(),
    ...f
  }));
}

export function normalizeError(err: any): Failure {
  try {
    return JSON.parse(err.message);
  } catch {
    return {
      source: 'unknown',
      type: 'UNSTRUCTURED',
      message: err.message,
      timestamp: new Date().toISOString()
    };
  }
}