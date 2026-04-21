import { test, expect } from '../../fixtures/baseFixture';
import { TEST_DATA } from '../../test-data/testData';

test.describe('E-Commerce Core Flows', () => {

  test('User can complete E2E Purchase Flow with static account', async ({ 
    page, 
    loginPage, 
    productPage, 
    paymentPage,
    checkoutPage
  }) => {
    
    // 1. Auth Service Flow
    await page.goto('/');
    await page.click('#login-button');
    await loginPage.login(TEST_DATA.user.username, TEST_DATA.user.password);

    // 2. Product Service Flow
    await productPage.addToCart();
    await productPage.clickOnShoppingCart();
    await productPage.clickOnCheckout();
    
    // 3. Payment Service Flow
    await paymentPage.populateCheckoutInfo(TEST_DATA.checkoutInfo.firstNme, TEST_DATA.checkoutInfo.lastName, TEST_DATA.checkoutInfo.postalCode);
    await paymentPage.continueBtnClick();

    // 4. Order Confirmation Assertion
    await checkoutPage.verifyTitle("Checkout: Overview");
    await checkoutPage.finishBtnClick();
    const confirmation = page.locator(TEST_DATA.selectors.confirmationId);
    await expect(confirmation).toBeVisible({ timeout: 10000 });
    await expect(confirmation).toContainText(TEST_DATA.selectors.successMessage);
  });

});