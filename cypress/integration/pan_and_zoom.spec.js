describe('Pan and zoom of graph', function() {

  it('Zoom in in graph when zoom in button is clicked', function() {
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

    cy.canvasGraph().should('have.attr', 'transform', 'translate(148.875,268.5) scale(1)');

    cy.zoomInButton().click();

    cy.canvasGraph().should('have.attr', 'transform', 'translate(143.47500000000002,279.3) scale(1.2)');

  })

  it('Zoom out in graph when zoom out button is clicked', function() {
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

    cy.canvasGraph().should('have.attr', 'transform', 'translate(148.875,268.5) scale(1)');

    cy.zoomOutButton().click();

    cy.canvasGraph().should('have.attr', 'transform', 'translate(153.375,259.5) scale(0.8333333333333334)');

  })

  it('Reset zoom of graph when zoom reset button is clicked', function() {
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

    cy.canvasGraph().should('have.attr', 'transform', 'translate(148.875,268.5) scale(1)');

    cy.zoomInButton().click();

    cy.canvasGraph().should('have.attr', 'transform', 'translate(143.47500000000002,279.3) scale(1.2)');

    cy.zoomResetButton().click();

    cy.canvasGraph().should('have.attr', 'transform', 'translate(143.92499923706055,268.5) scale(1)');

  })

  it('Reset zoom graph to map to available area when zoom out map button is clicked', function() {
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

    cy.canvasGraph().should('have.attr', 'transform', 'translate(148.875,268.5) scale(1)');

    cy.zoomOutMapButton().click();

    cy.canvasGraph().should('have.attr', 'transform', 'translate(57.715083385336,414.2068965517241) scale(3.6982758620689653)');
  })

})
