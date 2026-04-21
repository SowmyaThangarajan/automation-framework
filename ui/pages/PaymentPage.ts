import { Page, Locator } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('#first-name');
    this.lastName = page.locator('#last-name');
    this.postalCode = page.locator('#postal-code');
    this.continueBtn = page.locator('#continue');
  }

  async populateCheckoutInfo(firstNme: string, lastNme: string, postCode: string) {
    await this.firstName.fill(firstNme);
    await this.lastName.fill(lastNme);
    await this.postalCode.fill(postCode);
  }

  async continueBtnClick() {
    await this.continueBtn.click();
  }  
}