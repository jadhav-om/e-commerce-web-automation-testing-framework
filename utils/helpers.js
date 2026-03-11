const { expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const HomePage = require('../pages/HomePage');

async function loginAsUser(page, username, password) {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await loginPage.goto();
  await loginPage.login(username, password);
  await homePage.waitForLoaded();

  return { loginPage, homePage };
}

async function addProductsToCart(homePage, productNames) {
  for (const productName of productNames) {
    await homePage.addProductToCart(productName);
  }
}

function parsePrice(value) {
  return Number(value.replace(/[^0-9.]/g, ''));
}

function assertAscending(numbers) {
  for (let index = 1; index < numbers.length; index += 1) {
    expect(numbers[index]).toBeGreaterThanOrEqual(numbers[index - 1]);
  }
}

function assertDescending(numbers) {
  for (let index = 1; index < numbers.length; index += 1) {
    expect(numbers[index]).toBeLessThanOrEqual(numbers[index - 1]);
  }
}

function assertAlphabeticallyAscending(values) {
  const sorted = [...values].sort((a, b) => a.localeCompare(b));
  expect(values).toEqual(sorted);
}

function assertAlphabeticallyDescending(values) {
  const sorted = [...values].sort((a, b) => b.localeCompare(a));
  expect(values).toEqual(sorted);
}

module.exports = {
  loginAsUser,
  addProductsToCart,
  parsePrice,
  assertAscending,
  assertDescending,
  assertAlphabeticallyAscending,
  assertAlphabeticallyDescending,
};
