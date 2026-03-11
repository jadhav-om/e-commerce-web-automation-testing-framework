const { expect } = require('@playwright/test');

class ProductPage {
  constructor(page) {
    this.page = page;
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productDescription = page.locator('[data-test="inventory-item-desc"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton = page.locator('[data-test^="remove"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async waitForLoaded() {
    await expect(this.backToProductsButton).toBeVisible();
    await expect(this.productName).toBeVisible();
  }

  async getProductDetails() {
    return {
      name: (await this.productName.textContent()).trim(),
      description: (await this.productDescription.textContent()).trim(),
      priceText: (await this.productPrice.textContent()).trim(),
    };
  }

  async addProductToCart() {
    await this.addToCartButton.click();
  }

  async removeProductFromCart() {
    await this.removeButton.click();
  }

  async goBackToProducts() {
    await this.backToProductsButton.click();
  }
}

module.exports = ProductPage;
