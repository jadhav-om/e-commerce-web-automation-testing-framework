# E-Commerce UI Automation Framework (Playwright + JavaScript)

Production-ready UI automation framework for e-commerce testing using Playwright, JavaScript (Node.js), and the Page Object Model (POM).

## Project Overview

This framework automates end-to-end purchase journeys and critical user flows for a demo e-commerce application (`https://www.saucedemo.com`).

It is designed to mirror professional QA automation standards:
- Scalable POM architecture
- Reusable utilities and test data abstraction
- Parallel execution
- Failure screenshots, trace and video artifacts
- HTML reporting
- GitHub Actions CI pipeline with artifact upload

## Tech Stack

- Playwright
- JavaScript (Node.js)
- Page Object Model (POM)
- dotenv
- Playwright HTML Report
- GitHub Actions

## Framework Architecture

```text
project-root/
|
|-- tests/
|   |-- login.test.js
|   |-- productSearch.test.js
|   |-- cart.test.js
|   |-- checkout.test.js
|
|-- pages/
|   |-- LoginPage.js
|   |-- HomePage.js
|   |-- ProductPage.js
|   |-- CartPage.js
|   |-- CheckoutPage.js
|
|-- utils/
|   |-- testData.js
|   |-- helpers.js
|
|-- config/
|   |-- playwright.config.js
|
|-- reports/
|   |-- .gitkeep
|
|-- .github/workflows/
|   |-- playwright-tests.yml
|
|-- package.json
|-- README.md
|-- .env
```

## Automated Test Coverage

This suite contains **20 automated UI tests** across:
- Login and authentication
- Product catalog discovery and details validation
- Cart operations (add/remove and quantity validation)
- Checkout and order confirmation

### Note on Registration/Search/Quantity

`SauceDemo` does not provide a public user self-registration form or editable cart quantity controls.
To keep the suite stable and realistic for this AUT, authentication is covered with robust login scenarios, and quantity behavior is validated through cart line-item checks.

## Installation

```bash
npm install
npx playwright install chromium
```

## Environment Configuration

`.env` is included with working defaults for SauceDemo.

Example:

```env
BASE_URL=https://www.saucedemo.com
HEADLESS=true
STANDARD_USER=standard_user
LOCKED_OUT_USER=locked_out_user
PASSWORD=secret_sauce
INVALID_USER=invalid_user
INVALID_PASSWORD=wrong_password
FIRST_NAME=Jane
LAST_NAME=Tester
POSTAL_CODE=10001
```

## Run Tests

Headless (default):

```bash
npm run test
```

Headed mode:

```bash
npm run test:headed
```

Debug mode:

```bash
npm run test:debug
```

## Reports

After test execution, Playwright HTML report is generated at:

```text
reports/html
```

Open report:

```bash
npm run test:report
```

## CI/CD (GitHub Actions)

Workflow file:

```text
.github/workflows/playwright-tests.yml
```

The pipeline:
- Installs Node.js dependencies (`npm ci`)
- Installs Playwright browser binaries
- Runs the test suite
- Uploads HTML report and test-result artifacts

## NPM Scripts

- `npm run test`
- `npm run test:headed`
- `npm run test:debug`
- `npm run test:report`
- `npm run test:ci`


