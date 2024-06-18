@flaschenpost
Feature: Flaschenpost Tests

  @homepage @functional @high_priority
  Scenario Outline: Verify Homepage is displayed after entering zip code
    Given I clear cookies, local storage, and session storage
    And I set the viewport size to 1920 by 1080
    When I visit the homepage
    And I enter the Zip Code "<zipCode>"
    And I click "Geht Klar"
    Then I should see the homepage displayed
    And I close the browser window

    Examples:
      | zipCode |
      | 67061   |

  @deliveryFee @functional @high_priority
  Scenario Outline: Verify correct delivery fee calculation with zip code
    Given I clear cookies, local storage, and session storage
    And I set the viewport size to 1920 by 1080
    When I visit the homepage
    And I enter the Zip Code "<zipCode>"
    And I click "Geht Klar"
    When I select a random category
    And I add an item to the cart
    And I go to the cart
    Then I should validate the delivery cost for each additional item until the minimum order is reached
    And I close the browser window

    Examples:
      | zipCode |
      | 67061   |

