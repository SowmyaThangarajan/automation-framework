import { expect, Page, Locator } from '@playwright/test';
import { TEST_DATA } from '../../test-data/testData';

export class CheckoutPage {
  readonly page: Page;
  readonly title;
  readonly finishBtn: Locator;
  readonly successHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.finishBtn = page.locator('#finish');
    this.successHeader = page.locator('[data-test="complete-header"]');
  }
  
  async verifyTitle(expectedText: string) {
    await expect(this.title).toBeVisible();
    await expect(this.title).toHaveText(expectedText);
  }

  async finishBtnClick() {
    await this.finishBtn.click();
  }

  async verifyOrderSuccess() {
    await expect(this.successHeader).toBeVisible();
    await expect(this.successHeader).toHaveText(TEST_DATA.selectors.successMessage);
  }

}