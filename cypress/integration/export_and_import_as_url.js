describe('Browser save and open', function() {

  it('The DOT source is exported as a URL to  the application genereated through the menu alternative Export As URL', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.menuButton().click();

    cy.menuItemExportAsUrl().click();

    cy.exportGraphAsUrlDialog().should('exist');

    cy.exportGraphAsUrlExportedUrl().should('have.value', 'http://localhost:3000/?dot=digraph%20%7BAlice%20-%3E%20Bob%7D');

    cy.exportGraphAsUrlCopyButton().click();
    /* Copy URL does not work inside Cypress because of
     * https://github.com/cypress-io/cypress/issues/2851 which wil be
     * solved by https://github.com/cypress-io/cypress/issues/311 so
     * we don't yet have a way to verify that is works */

    cy.exportGraphAsUrlCancelButton().click();

    cy.exportGraphAsUrlDialog().should('not.exist');
  })

  it('The DOT source is imported from the dot parameter in the URL', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {}');

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);

    cy.visit('http://localhost:3000/?dot=digraph%20%7BAlice%20-%3E%20Bob%7D');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

  })

})
