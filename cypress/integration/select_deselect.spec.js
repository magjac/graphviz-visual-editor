describe('Selection and deselection in graph', function() {

  it('Selects a node when clicked', function() {
    cy.visit('http://localhost:3000/');

    cy.get('.ace_text-input').type('{ctrl}a{del}', {force: true});
    cy.get('.ace_text-input').type('digraph {{}Alice -> Bob}', {force: true});

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('#graph0 > #node1').click();

    cy.get('#graph0 > #node1 > rect').should('exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');
  })

})
