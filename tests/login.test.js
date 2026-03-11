const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const HomePage = require('../pages/HomePage');
const { users, expected } = require('../utils/testData');

test.describe('Login and Authentication', () => {
  test.describe.configure({ mode: 'parallel' });

  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await homePage.waitForLoaded();
    await expect(homePage.pageTitle).toHaveText('Products');
  });

  test('should show an error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.invalid.username, users.invalid.password);

    await expect(await loginPage.getErrorMessage()).toContain(expected.errors.invalidCredentials);
  });

  test('should block locked-out users from logging in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(await loginPage.getErrorMessage()).toContain(expected.errors.lockedOutUser);
  });

  test('should require username on login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', users.standard.password);

    await expect(await loginPage.getErrorMessage()).toContain(expected.errors.usernameRequired);
  });

  test('should require password on login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, '');

    await expect(await loginPage.getErrorMessage()).toContain(expected.errors.passwordRequired);
  });

  test('should logout and return to login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await homePage.waitForLoaded();

    await homePage.logout();

    await loginPage.isLoaded();
    await expect(page).toHaveURL(/saucedemo\.com/);
  });
});
