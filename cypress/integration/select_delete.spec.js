describe('Selection and deletion in graph', function() {

  it('Selects a node and deletes it and the edge connected to it', function() {
    cy.visit('http://localhost:3000/');

    cy.get('.ace_text-input').type('{ctrl}a{del}', {force: true});
    cy.get('.ace_text-input').type('digraph {{}Alice -> Bob}', {force: true});

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 1);

    cy.get('#graph0 > #node1').click();
    cy.get('body').type('{del}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('not.exist');
    cy.get('#graph0 > #edge1').should('not.exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Bob');

    cy.get('#graph0 > .node').should('have.length', 1);
    cy.get('#graph0 > .edge').should('have.length', 0);
  })

  it('Selects an edge and deletes it', function() {
    cy.visit('http://localhost:3000/');

    cy.get('.ace_text-input').type('{ctrl}a{del}', {force: true});
    cy.get('.ace_text-input').type('digraph {{}Alice -> Bob}', {force: true});

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 1);

    cy.get('#graph0 > #edge1').click();
    cy.get('body').type('{del}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('not.exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 0);
  })

})
