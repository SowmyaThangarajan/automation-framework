import { test as base } from '@playwright/test';
import { LoginPage } from '../ui/pages/LoginPage';
import { ProductPage } from '../ui/pages/ProductPage';
import { PaymentPage } from '../ui/pages/PaymentPage';
import { CheckoutPage } from '../ui/pages/CheckoutPage';

// Declare the types of your fixtures
type MyFixtures = {
  loginPage: LoginPage;
  productPage: ProductPage;
  paymentPage: PaymentPage;
  checkoutPage: CheckoutPage;
};

// Extend the base test to include our POMs
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from '@playwright/test';