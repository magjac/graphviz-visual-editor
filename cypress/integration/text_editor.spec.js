describe('Text editor', function() {

  it('A graph is rendered when DOT source code is typed in the text editor', function() {
    cy.startCleanApplication();
    cy.textEditorContent().type('{leftArrow}{enter}Alice -> Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

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
