describe('Insertion of nodes into the graph', function() {

  it('Inserts a node with latest attributes when middle mouse button is clicked', function() {
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

    cy.get('#graph0').trigger('mousedown', 'topLeft', {which: 2});
    cy.get('#graph0').trigger('mouseup', 'topLeft', {which: 2});
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('n2');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);
  })

  it('Inserts a node when a node in an insert panel is clicked', function() {
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

    cy.toolbarButton('Insert').click();
    cy.nodeShapeCategory('Basic shapes').click()
    cy.insertPanels().find('#node1').click();

    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('n2');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);
  })

  it('Inserts a node when a node is dragged from an insert panel to the canvas', function() {
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

    cy.toolbarButton('Insert').click();
    cy.nodeShapeCategory('Basic shapes').click()
    cy.insertPanels().find('#node1')
      .trigger('dragstart', {dataTransfer: new DataTransfer});
    cy.get('#canvas #graph0')
      .trigger('dragover', {force: true})
      .trigger('drop', {force: true});
    cy.insertPanels().find('#node1')
      .trigger('dragend', {force: true});

    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('n2');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);
  })

})
