export const TEST_DATA = {
    // Credentials for Auth Service
    user: {
      username: 'standard_user',
      password: 'secret_sauce',
    },
    // Search terms for Product Service
    inventory: {
      searchQuery: 'Laptop',
      expectedProduct: 'Gaming Laptop Pro',
    },
    // Payment Details for Payment Service
    checkoutInfo: {
      firstNme: 'Pete',
      lastName: 'Mitchell',
      postalCode: '520207'
    },
    // UI Assertions
    selectors: {
      confirmationId : '[data-test="complete-header"]',
      successMessage: 'Thank you for your order!',
    }
  };
  