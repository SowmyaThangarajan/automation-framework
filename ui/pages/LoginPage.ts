import { Page, Locator } from '@playwright/test';
import { findLoginButton } from '../../utils/selfHealing';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.locator('#login-button');
  }

  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    // await this.loginButton.click();
    const btn = await findLoginButton(this.page);
    await btn.click();
  }
}