import HomePage from '../support/pageObjects/HomePage';

describe('Flaschenpost Homepage Test', () => {
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
    cy.viewport(1920, 1080); // Example dimensions, you can set these to any desired size
});

  it(`should visit the homepage and verify it is displayed to user`, () => {
    const homePage = new HomePage();
    homePage.visit({timeout: 60000});

    // Intercept all requests
    cy.intercept('GET', '**').as('getAllRequests');
    cy.intercept('OPTIONS', '**').as('optionsAllRequests');
    cy.intercept('POST', '**').as('postAllRequests');

    homePage.enterZipCode('67061', {timeout: 60000});
    homePage.clickGehtKlar({timeout: 60000});
      
    // Wait for all instances of each intercepted request
    cy.wait('@getAllRequests', {timeout: 60000});
    cy.wait('@optionsAllRequests', {timeout: 60000});
    cy.wait('@postAllRequests', {timeout: 60000});
          
    homePage.verifyHomePage();

    // Close the browser window
    cy.window().then((win) => {
      win.close();
    });
  });
});
