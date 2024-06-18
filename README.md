# flaschenpost-task

Task 1:

• The HomePage.js file is imported from the directory, cypress/support/pageObjects. This file contains all the function definitions.

• The beforeEach() function sets up the browser before the actual start of the execution of the test case.

• At the start of the function, an instance of the HomePage is instantiated and the webpage, www.flaschenpost.de is visited.

• To ensure that the test case passes in case the user has a slow internet connection, all the incoming requests are handled first to avoid flakiness. Once that is done, the zip code is entered and the “Geht klar” button is clicked.

• To validate that the user landed on the homepage, the status code is checked. In this case, status code 200 ensures that the user is on the homepage.

Task 2:

• The HomePage.js file is imported from the directory, cypress/support/pageObjects. This file contains all the function definitions.

• The beforeEach() function sets up the browser before the actual start of the execution of the test case. In addition to setting up the browser, the HomePage instance is instantiated and the steps from Task 1 are performed so they are not re-executed during the execution of Task 2.

• Next, a random category is selected and the first product on the webpage is added to the cart. The product is added to the cart until the minimum order amount is reached. Once that is done, the expected delivery cost is captured from the delivery fee info table and compared to the actual delivery cost. If the costs match, more items are added to the cart until the next partition is reached and the process repeats until the delivery cost ‘kostenlos’ has been reached and matched.

Task 3:

• The feature file is in the directory, cypress/e2e/features. It contains the feature, scenario outline, and steps that cover both Task 1 and Task 2.

• The step definition file is in the directory, cypress/support/step_definitions. It contains all the step definitions for all the steps mentioned in the feature file.
