import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import HomePage from '../../support/pageObjects/HomePage';

const homePage = new HomePage();

// Step definitions for 'Verify Homepage is displayed and user interaction with different zip codes'
Given('I clear cookies, local storage, and session storage', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((window) => {
    window.sessionStorage.clear();
  });
});

Given('I set the viewport size to {int} by {int}', (width, height) => {
  cy.viewport(width, height);
});

When('I visit the homepage', () => {
  homePage.visit({ timeout: 60000 });
  cy.intercept('GET', '**').as('getAllRequests');
  cy.intercept('OPTIONS', '**').as('optionsAllRequests');
  cy.intercept('POST', '**').as('postAllRequests');
});

When('I enter the Zip Code {string}', (zipCode) => {
  homePage.enterZipCode(zipCode, { timeout: 60000 });
});

When('I click {string}', (buttonText) => {
  if (buttonText === "Geht Klar") {
    homePage.clickGehtKlar({ timeout: 60000 });
  }
});

Then('I should see the homepage displayed', () => {
  cy.wait('@getAllRequests', { timeout: 60000 });
  cy.wait('@optionsAllRequests', { timeout: 60000 });
  cy.wait('@postAllRequests', { timeout: 60000 });
  homePage.verifyHomePage();
});

// Step definitions for 'Verify correct delivery fee calculation with different zip codes'
When('I select a random category', () => {
  homePage.selectRandomCategory();
});

When('I add an item to the cart', () => {
  homePage.addItemToCart();
});

When('I go to the cart', () => {
  homePage.goToCart();
});

Then('I should validate the delivery cost for each additional item until the minimum order is reached', () => {
  for (let i = 1; i < 4; i++) {
    homePage.addItemsUntilMinimumOrderReached(i, true);
    homePage.validateDeliveryCost();
  }
});

Then('I close the browser window', () => {
  cy.window().then((win) => {
    win.close();
  });
});
