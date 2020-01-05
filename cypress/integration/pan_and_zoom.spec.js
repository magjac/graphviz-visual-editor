describe('Pan and zoom of graph', function() {

  it('Zoom in in graph when zoom in button is clicked', function() {
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

    cy.get('#graph0').should('have.attr', 'transform', 'translate(148.875,268.5) scale(1)');

    cy.zoomInButton().click();

    cy.get('#graph0').should('have.attr', 'transform', 'translate(143.47500000000002,279.3) scale(1.2)');

  })

})
