const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  cartItem(productName) {
    return this.page
      .locator('.cart_item')
      .filter({ has: this.page.locator('.inventory_item_name', { hasText: productName }) })
      .first();
  }

  removeButton(productName) {
    return this.cartItem(productName).locator('[data-test^="remove"]');
  }

  async waitForLoaded() {
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async getCartItemCount() {
    return this.cartItems.count();
  }

  async getCartItemNames() {
    const names = await this.page.locator('.cart_item .inventory_item_name').allTextContents();
    return names.map((name) => name.trim());
  }

  async getCartItemQuantity(productName) {
    return (await this.cartItem(productName).locator('.cart_quantity').textContent()).trim();
  }

  async getAllCartQuantities() {
    const quantities = await this.page.locator('.cart_quantity').allTextContents();
    return quantities.map((quantity) => quantity.trim());
  }

  async removeItem(productName) {
    await this.removeButton(productName).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}

module.exports = CartPage;
