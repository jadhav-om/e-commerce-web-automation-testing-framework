const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async waitForLoaded() {
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  productSlug(productName) {
    return productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  addToCartButton(productName) {
    return this.page.locator(`[data-test="add-to-cart-${this.productSlug(productName)}"]`);
  }

  removeFromCartButton(productName) {
    return this.page.locator(`[data-test="remove-${this.productSlug(productName)}"]`);
  }

  productCard(productName) {
    return this.page
      .locator('.inventory_item')
      .filter({ has: this.page.locator('.inventory_item_name', { hasText: productName }) })
      .first();
  }

  async addProductToCart(productName) {
    await this.addToCartButton(productName).click();
  }

  async removeProductFromCart(productName) {
    await this.removeFromCartButton(productName).click();
  }

  async openProductDetails(productName) {
    await this.productCard(productName).locator('.inventory_item_name').click();
  }

  async getInventoryItemCount() {
    return this.inventoryItems.count();
  }

  async getProductCardData(productName) {
    const card = this.productCard(productName);
    return {
      name: (await card.locator('.inventory_item_name').textContent()).trim(),
      description: (await card.locator('.inventory_item_desc').textContent()).trim(),
      priceText: (await card.locator('.inventory_item_price').textContent()).trim(),
    };
  }

  async getAllProductNames() {
    const names = await this.page.locator('.inventory_item_name').allTextContents();
    return names.map((name) => name.trim());
  }

  async getAllProductPrices() {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map((price) => Number(price.replace('$', '').trim()));
  }

  async sortBy(optionLabel) {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async getCartBadgeCount() {
    if ((await this.cartBadge.count()) === 0) {
      return 0;
    }

    return Number((await this.cartBadge.textContent()).trim());
  }

  async logout() {
    await this.menuButton.click();
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
  }
}

module.exports = HomePage;
