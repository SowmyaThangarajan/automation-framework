import { Page } from '@playwright/test';

export async function findLoginButton(page: Page) {
  const selectors = [
    '#login-button',
    'button:has-text("Login")',
    '[data-test="login"]'
  ];

  for (const sel of selectors) {
    const el = page.locator(sel);
    if (await el.count()) return el;
  }

  throw new Error("Login button not found");
}