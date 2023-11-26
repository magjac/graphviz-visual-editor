describe('Selection and deletion in graph', function() {

  it('Selects a node and deletes it and the edge connected to it', function() {
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

    cy.node(1).click();
    cy.get('body').type('{del}');
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('not.exist');
    cy.edge(1).should('not.exist');

    cy.node(1).shouldHaveName('Bob');

    cy.nodes().should('have.length', 1);
    cy.edges().should('have.length', 0);
  })

  it('Selects an edge and deletes it', function() {
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

    cy.edge(1).click();
    cy.get('body').type('{del}');
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('not.exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 0);
  })

  it('Selects a node, adds another node to the selection and deletes them and the connected edge', function() {
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

    cy.node(1).click();
    cy.get('body').type('{shift}', { release: false })
      .node(2).click();
    cy.get('body').type('{del}');
    cy.waitForTransition();

    cy.node(1).should('not.exist');
    cy.node(2).should('not.exist');
    cy.edge(1).should('not.exist');

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);
  })

})
