require('cypress-xpath')
class HomePage {
    visit(options = {}) {
        cy.visit('https://www.flaschenpost.de', options);
    }

    enterZipCode(zip, options = {}) {
        cy.xpath('//div[@class="zipcode_input_component"]//child::input', options).type(zip);
    }

    clickGehtKlar(options = {}) {
        cy.get('button').contains('Geht klar', options).click();
    }

    verifyHomePage(options = {}) {
        cy.request({
            url: 'https://www.flaschenpost.de',
            failOnStatusCode: false
        }).its('status', options).should('eq', 200);
    }
    
    selectRandomCategory() {
        const options = ['Wasser', 'Bier', 'Weine'];

        const randomIndex = Math.floor(Math.random() * options.length);

        // Select the random option from the list
        const selectedOption = options[randomIndex];

        // Log the selected option to the console
        cy.log('Selected option:', selectedOption);

        cy.wait(2000)

        // Click on the randomly selected option
        cy.xpath("//span[contains(text(),'" + selectedOption + "')]//parent::a")
        .click();

        // Click on the first child element of the randomly selected option
        cy.xpath("(//span[contains(text(),'" + selectedOption + "')]//parent::a//following-sibling::div//descendant::a)[1]")
        .click();

        cy.wait(2000)
    }

    addItemToCart() {
        cy.xpath('(//div[@class="add_to_cart_wrapper"])[1]').click()
    }

    goToCart() {
        cy.xpath('//button[@class="btn_flat btn_cart"]').click()
    }

    getDeliveryInfo() {
        // Open the pop up window containing the delivery fee partitions
        cy.xpath('(//span[contains(text(), "Liefergebühr")])[1]').click()
    }

    validateDeliveryCost() {
        let cartTotal = 0;
        let minValue = 0;
        let maxValue = '';
        let expectedDeliveryCharge = 0;
        let actualDeliveryCost = '';
    
        // Get the cart total
        cy.xpath("//span[contains(text(), 'Warenwert')]//following-sibling::span")
            .invoke('text').then((text) => {
                const numberString = text.match(/(\d+,\d+)/)[0];
                const normalizedNumberString = numberString.replace(',', '.');
                cartTotal = parseFloat(normalizedNumberString);
                cy.log('Cart Total: ' + cartTotal);
            })
            .then(() => {
                cy.xpath('(//span[contains(text(), "Liefergebühr")])[1]').click();
                cy.wait(2000);
                checkDeliveryCosts(cartTotal);
            });
    
        // This function is run three times at most because there are three delivery fee partitions
        function checkDeliveryCosts(cartTotal, i = 0) {
            if (i >= 3) return;
    
            cy.xpath("(//span[starts-with(text(), 'ab')])[" + (i+1) + "]")
                .invoke('text').then((text) => {
                    const numberString = text.match(/(\d+)/)[0];
                    minValue = parseFloat(numberString);
                    cy.log('Minimum Value: ' + minValue);
                })
                .then(() => {
                    if (i + 2 === 4) {
                        expectedDeliveryCharge = 'kostenlos'; // Hardcoded value
                        cy.log('Expected Delivery Cost: ' + expectedDeliveryCharge);
    
                        // Close the pop-up window and set actualDeliveryCost to 'kostenlos'
                        cy.xpath('//ion-modal//child::div[@class="ion-page"]//descendant::ion-icon//parent::div').click();
                        actualDeliveryCost = 'kostenlos';
                        cy.log('Actual Delivery Cost: ' + actualDeliveryCost);
    
                        // Compare the delivery costs
                        if (expectedDeliveryCharge === actualDeliveryCost) {
                            cy.log("The expected delivery cost is the same as the actual delivery cost");
                        } else {
                            cy.log("Throw some error here!");
                        }
                    } else {
                        cy.xpath("(//span[starts-with(text(), 'ab')])[" + (i+2) + "]")
                            .invoke('text').then((text) => {
                                const numberString = text.match(/(\d+)/)[0];
                                maxValue = parseFloat(numberString);
                                cy.log('Maximum Value: ' + maxValue);
                            })
                            .then(() => {
                                if (cartTotal >= minValue && cartTotal < maxValue) {
                                    cy.xpath("(//span[starts-with(text(), 'ab')]//following-sibling::span)[" + (i+1) + "]")
                                        .invoke('text').then((text) => {
                                            const numberString = text.match(/(\d+,\d+)/)[0];
                                            const normalizedNumberString = numberString.replace(',', '.');
                                            expectedDeliveryCharge = parseFloat(normalizedNumberString);
                                            cy.log('Expected Delivery Charges: ' + expectedDeliveryCharge);
                                        })
                                        .then(() => {
                                            cy.xpath('//ion-modal//child::div[@class="ion-page"]//descendant::ion-icon//parent::div').click();
                                            cy.xpath("//span[contains(text(), 'Liefergebühr')]//following-sibling::span")
                                                .invoke('text').then((text) => {
                                                    const numberString = text.match(/(\d+,\d+)/)[0];
                                                    const normalizedNumberString = numberString.replace(',', '.');
                                                    actualDeliveryCost = parseFloat(normalizedNumberString);
                                                    cy.log('Actual Delivery Cost: ' + actualDeliveryCost);
                                                })
                                                .then(() => {
                                                    if (expectedDeliveryCharge === actualDeliveryCost) {
                                                        cy.log("The expected delivery cost is the same as the actual delivery cost");
                                                    } else {
                                                        cy.log("Throw some error here! Test Failed!");
                                                    }
                                                });
                                        });
                                } else {
                                    checkDeliveryCosts(cartTotal, i + 1);
                                }
                            });
                    }
                });
        }
    }

    addItemsUntilMinimumOrderReached(range) {
        cy.wait(5000)
        let minimumOrderValue = 0;
        let currentOrderValue = 0;

        // Open delivery cost range pop-up
        cy.xpath('(//span[contains(text(), "Liefergebühr")])[1]').click()
        cy.wait(2000);

        // Getting the min value for e.g. 29
        cy.xpath("(//span[starts-with(text(), 'ab')])[" + range + "]")
        .invoke('text').then((text) => {
            // Extract the number using a regular expression
            const numberString = text.match(/(\d+)/)[0]; // Matches the numeric part
        
            // Convert the extracted string to a float
            const floatValue = parseFloat(numberString);
        
            minimumOrderValue = floatValue;

            // Closing the pop up window now
            cy.wait(2000)
            cy.xpath('//ion-modal//child::div[@class="ion-page"]//descendant::ion-icon//parent::div').click()

            // Get the cart total
            cy.xpath("//span[contains(text(), 'Warenwert')]//following-sibling::span")
            .invoke('text').then((text) => {
                // Extract the number using a regular expression
                const numberString = text.match(/(\d+,\d+)/)[0]; // Matches numbers with a comma as a decimal separator

                // Replace comma with dot to convert to a format parseFloat can handle
                const normalizedNumberString = numberString.replace(',', '.');

                // Convert the extracted string to a float
                const floatValue = parseFloat(normalizedNumberString);

                currentOrderValue = floatValue;

                // Check if the minimum and current cart total match
                if(currentOrderValue >= minimumOrderValue){
                    // minimum cart total reached
                    cy.log("Exit the function")
                } else {
                    // Minimum cart total not reached. Add another item and repeat the function
                    cy.log("Minimum order total not reached")
                    cy.wait(2000)
                    cy.xpath("//div[@class='tw-co-flex tw-co-flex-col tw-co-items-center tw-co-px-2 tw-co-py-4']//child::button[1]").click({force: true})
                    cy.wait(2000)
                    this.addItemsUntilMinimumOrderReached(range)
                }
            })
        })
    }
}

export default HomePage;
