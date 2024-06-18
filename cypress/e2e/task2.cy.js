import HomePage from '../support/pageObjects/HomePage';

describe('Flaschenpost Delivery Fee Test', () => {
  beforeEach(() => {
    // Clear cookies
    cy.clearCookies();
    // Clear local storage
    cy.clearLocalStorage();
    // Clear session storage
    cy.window().then((window) => {
        window.sessionStorage.clear();
    });

    // Set viewport size
    cy.viewport(1920, 1080);

    // Setup steps
    const homePage = new HomePage();
    homePage.visit({timeout: 60000});
    homePage.enterZipCode('67061', {timeout: 60000});
    homePage.clickGehtKlar({timeout: 60000});
    homePage.verifyHomePage();
  });

  it(`should verify correct delivery fee`, () => {
    const homePage = new HomePage();
      
    // Intercept all requests
    cy.intercept('GET', '**').as('getAllRequests');
    cy.intercept('OPTIONS', '**').as('optionsAllRequests');
    cy.intercept('POST', '**').as('postAllRequests');

    // Wait for all instances of each intercepted request
    cy.wait('@getAllRequests', {timeout: 60000});
    cy.wait('@optionsAllRequests', {timeout: 60000});
    cy.wait('@postAllRequests', {timeout: 60000});
          
    homePage.selectRandomCategory();

    cy.wait(5000);
    homePage.addItemToCart();
    cy.wait(5000);
    homePage.goToCart();
    cy.wait(5000);

    for(let i = 1; i < 4; i++){
      homePage.addItemsUntilMinimumOrderReached(i, true);
      homePage.validateDeliveryCost()
    }

    // Close the browser window
    cy.window().then((win) => {
      win.close();
    });
  });
});
