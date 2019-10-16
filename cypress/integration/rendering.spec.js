describe('Basic rendering from DOT source', function() {

  it('Selects the current DOT source, clears it, enters a simple graph and checks that it renders', function() {
    cy.visit('http://localhost:3000/');

    cy.get('.ace_text-input').type('{ctrl}a{del}', {force: true});
    cy.get('.ace_text-input').type('digraph {{}Alice -> Bob}', {force: true});

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > text').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > text').should('have.text', 'Bob');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 1);
  })

})
