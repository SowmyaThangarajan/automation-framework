import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addToCartBtn: Locator;
  readonly shoppingCartBtn: Locator;
  readonly checkoutBtn: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.addToCartBtn = page.locator('#add-to-cart-sauce-labs-backpack');
    this.shoppingCartBtn = page.locator('#shopping_cart_container');
    this.checkoutBtn = page.locator('#checkout');
  }

  async addToCart() {
    await this.addToCartBtn.click();
  }

  async clickOnShoppingCart() {
    await this.shoppingCartBtn.click();
  }

  async clickOnCheckout() {
    await this.checkoutBtn.click();
  }
}