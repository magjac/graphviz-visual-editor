describe('Draw edges in the graph', function() {

  it('Draws an edge from a node to another node when the right mouse button is clicked on the source node and then the left mouse button double-clicked on the destination node', function() {
    cy.visit('http://localhost:3000/');

    cy.get('.ace_text-input').type('{ctrl}a{del}', {force: true});
    cy.get('#graph0 > .node').should('have.length', 0);
    cy.get('#graph0 > .edge').should('have.length', 0);
    cy.get('.ace_text-input').type('digraph {{}Alice Bob}', {force: true});

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('not.exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 0);

    cy.get('#graph0 > #node1').trigger('contextmenu');
    let drawn_edge = cy.get('#graph0 > #edge1');
    drawn_edge.should('exist');
    cy.get('#graph0 > #node2').trigger('mousemove');
    cy.get('#graph0 > #node2').dblclick();
    cy.wait(0); // Wait for edge to be connected to destination node
    drawn_edge.should('not.exist');
    cy.wait(10); // Wait for anmimation to start

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 1);
  })

  it('Draws edges in both directions between two nodes', function() {
    cy.visit('http://localhost:3000/');

    cy.get('.ace_text-input').type('{ctrl}a{del}', {force: true});
    cy.get('#graph0 > .node').should('have.length', 0);
    cy.get('#graph0 > .edge').should('have.length', 0);
    cy.get('.ace_text-input').type('digraph {{}Alice Bob}', {force: true});

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('not.exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 0);

    cy.get('#graph0 > #node1').trigger('contextmenu');
    let drawn_edge = cy.get('#graph0 > #edge1');
    drawn_edge.should('exist');
    cy.get('#graph0 > #node2').trigger('mousemove');
    cy.get('#graph0 > #node2').dblclick();
    cy.wait(0); // Wait for edge to be connected to destination node
    drawn_edge.should('not.exist');
    cy.wait(10); // Wait for anmimation to start

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 1);

    cy.get('#graph0 > #node2').trigger('contextmenu');
    drawn_edge = cy.get('#graph0 > #edge2');
    drawn_edge.should('exist');
    cy.get('#graph0 > #node1').trigger('mousemove');
    cy.get('#graph0 > #node1').dblclick();
    cy.wait(0); // Wait for edge to be connected to destination node
    drawn_edge.should('not.exist');
    cy.wait(10); // Wait for anmimation to start

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');
    cy.get('#graph0 > #edge2').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');
    cy.get('#graph0 > #edge2 > title').should('have.text', 'Bob->Alice');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 2);
})

})
