const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const CartPage = require('../pages/CartPage');
const { users, products } = require('../utils/testData');
const { loginAsUser, addProductsToCart } = require('../utils/helpers');

test.describe('Cart Operations', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ page }) => {
    await loginAsUser(page, users.standard.username, users.standard.password);
  });

  test('should add a single item to cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.addProductToCart(products.backpack);
    await expect(await homePage.getCartBadgeCount()).toBe(1);

    await homePage.goToCart();
    await cartPage.waitForLoaded();

    await expect(await cartPage.getCartItemCount()).toBe(1);
    await expect(await cartPage.getCartItemNames()).toEqual([products.backpack]);
  });

  test('should add multiple items and show correct cart badge count', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const selectedProducts = [products.backpack, products.bikeLight, products.onesie];

    await addProductsToCart(homePage, selectedProducts);
    await expect(await homePage.getCartBadgeCount()).toBe(selectedProducts.length);

    await homePage.goToCart();
    await cartPage.waitForLoaded();

    const cartItems = await cartPage.getCartItemNames();
    await expect(cartItems).toEqual(expect.arrayContaining(selectedProducts));
  });

  test('should remove an item from the cart page', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const selectedProducts = [products.backpack, products.bikeLight];

    await addProductsToCart(homePage, selectedProducts);
    await homePage.goToCart();
    await cartPage.waitForLoaded();

    await cartPage.removeItem(products.backpack);

    await expect(await cartPage.getCartItemCount()).toBe(1);
    await expect(await cartPage.getCartItemNames()).toEqual([products.bikeLight]);
  });

  test('should remove an item from inventory and update badge count', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await addProductsToCart(homePage, [products.backpack, products.bikeLight]);
    await expect(await homePage.getCartBadgeCount()).toBe(2);

    await homePage.removeProductFromCart(products.backpack);
    await expect(await homePage.getCartBadgeCount()).toBe(1);

    await homePage.goToCart();
    await cartPage.waitForLoaded();
    await expect(await cartPage.getCartItemNames()).toEqual([products.bikeLight]);
  });

  test('should keep quantity at 1 for a product in cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.addProductToCart(products.fleeceJacket);
    await expect(homePage.removeFromCartButton(products.fleeceJacket)).toBeVisible();
    await expect(homePage.addToCartButton(products.fleeceJacket)).toHaveCount(0);

    await homePage.goToCart();
    await cartPage.waitForLoaded();

    await expect(await cartPage.getCartItemQuantity(products.fleeceJacket)).toBe('1');
  });
});
