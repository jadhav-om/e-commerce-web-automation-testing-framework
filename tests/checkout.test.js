const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const { users, products, checkoutData, expected } = require('../utils/testData');
const { loginAsUser, addProductsToCart, parsePrice } = require('../utils/helpers');

test.describe('Checkout Flow and Order Confirmation', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ page }) => {
    await loginAsUser(page, users.standard.username, users.standard.password);
  });

  test('should validate required first name during checkout', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await homePage.addProductToCart(products.backpack);
    await homePage.goToCart();
    await cartPage.waitForLoaded();
    await cartPage.proceedToCheckout();

    await checkoutPage.waitForInformationStep();
    await checkoutPage.fillCustomerInformation('', checkoutData.lastName, checkoutData.postalCode);
    await checkoutPage.continueFromInformation();

    await expect(await checkoutPage.getErrorMessage()).toContain(expected.errors.firstNameRequired);
  });

  test('should validate required postal code during checkout', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await homePage.addProductToCart(products.backpack);
    await homePage.goToCart();
    await cartPage.waitForLoaded();
    await cartPage.proceedToCheckout();

    await checkoutPage.waitForInformationStep();
    await checkoutPage.fillCustomerInformation(checkoutData.firstName, checkoutData.lastName, '');
    await checkoutPage.continueFromInformation();

    await expect(await checkoutPage.getErrorMessage()).toContain(expected.errors.postalCodeRequired);
  });

  test('should show accurate order overview totals before placing order', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const selectedProducts = [products.backpack, products.bikeLight, products.onesie];

    const selectedProductData = [];
    for (const selectedProduct of selectedProducts) {
      selectedProductData.push(await homePage.getProductCardData(selectedProduct));
    }

    await addProductsToCart(homePage, selectedProducts);
    await homePage.goToCart();
    await cartPage.waitForLoaded();
    await cartPage.proceedToCheckout();

    await checkoutPage.waitForInformationStep();
    await checkoutPage.fillCustomerInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.continueFromInformation();

    await checkoutPage.waitForOverviewStep();
    await expect(await checkoutPage.getOverviewItemCount()).toBe(selectedProducts.length);

    const overviewItems = await checkoutPage.getOverviewItemNames();
    await expect(overviewItems).toEqual(expect.arrayContaining(selectedProducts));

    const expectedSubtotal = selectedProductData
      .map((product) => parsePrice(product.priceText))
      .reduce((sum, value) => sum + value, 0);

    const subtotal = await checkoutPage.getSubtotalAmount();
    const tax = await checkoutPage.getTaxAmount();
    const total = await checkoutPage.getTotalAmount();

    await expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    await expect(tax).toBeGreaterThan(0);
    await expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('should complete checkout and display order confirmation', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await homePage.addProductToCart(products.fleeceJacket);
    await homePage.goToCart();
    await cartPage.waitForLoaded();
    await cartPage.proceedToCheckout();

    await checkoutPage.waitForInformationStep();
    await checkoutPage.fillCustomerInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.continueFromInformation();

    await checkoutPage.waitForOverviewStep();
    await checkoutPage.finishCheckout();

    await checkoutPage.waitForOrderConfirmation();
    await expect(await checkoutPage.getConfirmationText()).toContain(
      'Your order has been dispatched'
    );
  });
});
