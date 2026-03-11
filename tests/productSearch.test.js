const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const ProductPage = require('../pages/ProductPage');
const { users, allProducts, products, expected } = require('../utils/testData');
const {
  loginAsUser,
  assertAscending,
  assertDescending,
  assertAlphabeticallyDescending,
} = require('../utils/helpers');

test.describe('Product Search and Product Details Validation', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ page }) => {
    await loginAsUser(page, users.standard.username, users.standard.password);
  });

  test('should display the full product catalog after login', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.waitForLoaded();
    await expect(await homePage.getInventoryItemCount()).toBe(expected.productCount);

    const productNames = await homePage.getAllProductNames();
    await expect(productNames).toEqual(expect.arrayContaining(allProducts));
  });

  test('should open product details and match list-page data', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);

    const listData = await homePage.getProductCardData(products.fleeceJacket);
    await homePage.openProductDetails(products.fleeceJacket);

    await productPage.waitForLoaded();
    const detailsData = await productPage.getProductDetails();

    await expect(detailsData).toEqual(listData);
  });

  test('should sort products by price from low to high', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.sortBy('Price (low to high)');

    const prices = await homePage.getAllProductPrices();
    assertAscending(prices);
  });

  test('should sort products by price from high to low', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.sortBy('Price (high to low)');

    const prices = await homePage.getAllProductPrices();
    assertDescending(prices);
  });

  test('should sort products by name from Z to A', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.sortBy('Name (Z to A)');

    const names = await homePage.getAllProductNames();
    assertAlphabeticallyDescending(names);
  });
});
