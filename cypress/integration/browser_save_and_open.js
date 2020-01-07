describe('Browser save and open', function() {

  it('The current graph is automatically stored in browser local storage', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 1);
    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

})
