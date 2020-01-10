describe('Draw edges in the graph', function() {

  it('Draws an edge from a node to another node when the right mouse button is clicked on the source node and then the left mouse button double-clicked on the destination node', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('not.exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 0);

    cy.node(1).trigger('contextmenu');
    cy.edge(1).should('exist');
    cy.node(2).trigger('mousemove');
    cy.node(2).dblclick();
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);
  })

  it('Draws edges in both directions between two nodes', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('not.exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 0);

    cy.node(1).trigger('contextmenu');
    cy.edge(1).should('exist');
    cy.node(2).trigger('mousemove');
    cy.node(2).dblclick();
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.node(2).trigger('contextmenu');
    cy.edge(2).should('exist');
    cy.node(1).trigger('mousemove');
    cy.node(1).dblclick();
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');
    cy.edge(2).shouldHaveName('Bob->Alice');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 2);
})

})
