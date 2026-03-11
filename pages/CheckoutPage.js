const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.overviewItems = page.locator('.cart_item');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.confirmationHeader = page.locator('[data-test="complete-header"]');
    this.confirmationText = page.locator('[data-test="complete-text"]');
  }

  async waitForInformationStep() {
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
    await expect(this.firstNameInput).toBeVisible();
  }

  async waitForOverviewStep() {
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
    await expect(this.finishButton).toBeVisible();
  }

  async fillCustomerInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName ?? '');
    await this.lastNameInput.fill(lastName ?? '');
    await this.postalCodeInput.fill(postalCode ?? '');
  }

  async continueFromInformation() {
    await this.continueButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return (await this.errorMessage.textContent()).trim();
  }

  async getOverviewItemCount() {
    return this.overviewItems.count();
  }

  async getOverviewItemNames() {
    const names = await this.page.locator('.cart_item .inventory_item_name').allTextContents();
    return names.map((name) => name.trim());
  }

  async getSubtotalAmount() {
    const text = (await this.subtotalLabel.textContent()).trim();
    return Number(text.replace('Item total: $', ''));
  }

  async getTaxAmount() {
    const text = (await this.taxLabel.textContent()).trim();
    return Number(text.replace('Tax: $', ''));
  }

  async getTotalAmount() {
    const text = (await this.totalLabel.textContent()).trim();
    return Number(text.replace('Total: $', ''));
  }

  async waitForOrderConfirmation() {
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
  }

  async getConfirmationText() {
    return (await this.confirmationText.textContent()).trim();
  }
}

module.exports = CheckoutPage;
