import { APIRequestContext, APIResponse } from '@playwright/test';
import { retry } from '../../utils/retry';
import { recordLatency } from '../../utils/metrics';

export class BaseApiClient {
  private baseUrl = process.env.API_BASE_URL;

  constructor(private request: APIRequestContext) {}

  async get(endpoint: string, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    return retry(async () => {
      const start = Date.now();

      const res = await this.request.get(url, options);
      const duration = Date.now() - start;
      recordLatency(duration);

      const body = await this.safeJson(res);

      this.log({
        method: 'GET',
        url,
        status: res.status(),
        duration,
        body
      });

      return { res, body, duration };
    });
  }

  async post(endpoint: string, data: any, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    return retry(async () => {
      const start = Date.now();

      const res = await this.request.post(url, {
        data,
        ...options
      });

      const duration = Date.now() - start;
      recordLatency(duration);
      const body = await this.safeJson(res);

      this.log({
        method: 'POST',
        url,
        status: res.status(),
        duration,
        body
      });

      return { res, body, duration };
    });
  }

  private async safeJson(res: APIResponse) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  private log(entry: any) {
    console.log(JSON.stringify({
      type: "api_log",
      timestamp: new Date().toISOString(),
      ...entry
    }));
  }
}