describe('Basic rendering from DOT source', function() {

  it('Selects the current DOT source, clears it, enters a simple graph and checks that it renders', function() {
    cy.startApplication();
    cy.checkDefaultGraph();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.textEditorContent().should('have.text', 'digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveLabel('Alice');
    cy.node(2).shouldHaveLabel('Bob');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);
  })

})
