const users = {
  standard: {
    username: process.env.STANDARD_USER || 'standard_user',
    password: process.env.PASSWORD || 'secret_sauce',
  },
  lockedOut: {
    username: process.env.LOCKED_OUT_USER || 'locked_out_user',
    password: process.env.PASSWORD || 'secret_sauce',
  },
  invalid: {
    username: process.env.INVALID_USER || 'invalid_user',
    password: process.env.INVALID_PASSWORD || 'wrong_password',
  },
};

const checkoutData = {
  firstName: process.env.FIRST_NAME || 'Jane',
  lastName: process.env.LAST_NAME || 'Tester',
  postalCode: process.env.POSTAL_CODE || '10001',
};

const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  redTShirt: 'Test.allTheThings() T-Shirt (Red)',
};

const allProducts = Object.values(products);

const expected = {
  productCount: 6,
  errors: {
    invalidCredentials:
      'Epic sadface: Username and password do not match any user in this service',
    lockedOutUser: 'Epic sadface: Sorry, this user has been locked out.',
    usernameRequired: 'Epic sadface: Username is required',
    passwordRequired: 'Epic sadface: Password is required',
    firstNameRequired: 'Error: First Name is required',
    postalCodeRequired: 'Error: Postal Code is required',
  },
};

module.exports = {
  users,
  checkoutData,
  products,
  allProducts,
  expected,
};
