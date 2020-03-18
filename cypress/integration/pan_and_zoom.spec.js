describe('Pan and zoom of graph', function() {

  const firefox = Cypress.browser.name == 'firefox';
  const headed = Cypress.browser.isHeaded;

  it('Zoom in in graph when zoom in button is clicked', function() {
    // FIXME: Remove when investigated. Temporary workaround for
    // transform not updated after transition. This ensures that
    // clearAndRenderDotSource clears the previous graph before
    // rendering the new one.
    localStorage.setItem('holdOff', 0);

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

    cy.get('#graph0').should(
      'have.attr', 'transform',
      firefox ? (
        headed ?
          'translate(144.29999923706055,268.5) scale(1)' :
          'translate(144.67499923706055,268.5) scale(1)'
      ) :
      'translate(143.92499923706055,268.5) scale(1)'
    );

    cy.zoomInButton().click();
    cy.get('#graph0').should(
      'have.attr', 'transform',
      firefox ? (
        headed ?
          'translate(137.90999908447267,279.3) scale(1.2)' :
          'translate(138.28499908447267,279.3) scale(1.2)'
      ) :
      'translate(137.53499908447267,279.3) scale(1.2)'
    );
  })

  it('Zoom out in graph when zoom out button is clicked', function() {
    // FIXME: Remove when investigated. Temporary workaround for
    // transform not updated after transition. This ensures that
    // clearAndRenderDotSource clears the previous graph before
    // rendering the new one.
    localStorage.setItem('holdOff', 0);

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

    cy.get('#graph0').should(
      'have.attr', 'transform',
      firefox ? (
        headed ?
          'translate(144.29999923706055,268.5) scale(1)' :
          'translate(144.67499923706055,268.5) scale(1)'
      ) :
      'translate(143.92499923706055,268.5) scale(1)'
    );

    cy.zoomOutButton().click();

    cy.get('#graph0').should(
      'have.attr', 'transform',
      firefox ? (
        headed ?
          'translate(149.62499936421713,259.5) scale(0.8333333333333334)' :
          'translate(149.99999936421713,259.5) scale(0.8333333333333334)'
      ) :
      'translate(149.24999936421713,259.5) scale(0.8333333333333334)'
    );

  })

  it('Reset zoom of graph when zoom reset button is clicked', function() {
    // FIXME: Remove when investigated. Temporary workaround for
    // transform not updated after transition. This ensures that
    // clearAndRenderDotSource clears the previous graph before
    // rendering the new one.
    localStorage.setItem('holdOff', 0);

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

    cy.get('#graph0').should(
      'have.attr', 'transform',
      firefox ? (
        headed ?
          'translate(144.29999923706055,268.5) scale(1)' :
          'translate(144.67499923706055,268.5) scale(1)'
      ) :
      'translate(143.92499923706055,268.5) scale(1)'
    );

    cy.zoomInButton().click();

    cy.get('#graph0').should(
      'have.attr', 'transform',
      firefox ? (
        headed ?
          'translate(137.90999908447267,279.3) scale(1.2)' :
          'translate(138.28499908447267,279.3) scale(1.2)'
      ) :
      'translate(137.53499908447267,279.3) scale(1.2)'
    );

    cy.zoomResetButton().click();

    cy.get('#graph0').should(
      'have.attr', 'transform',
      firefox ? (
        headed ?
          'translate(144.29999923706055,268.5) scale(1)' :
          'translate(144.67499923706055,268.5) scale(1)'
      ) :
      'translate(143.92499923706055,268.5) scale(1)'
    );

  })

  it('Reset zoom graph to map to available area when zoom out map button is clicked', function() {
    // FIXME: Remove when investigated. Temporary workaround for
    // transform not updated after transition. This ensures that
    // clearAndRenderDotSource clears the previous graph before
    // rendering the new one.
    localStorage.setItem('holdOff', 0);
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

    cy.get('#graph0').should(
      'have.attr', 'transform',
      firefox ? (
        headed ?
          'translate(144.29999923706055,268.5) scale(1)' :
          'translate(144.67499923706055,268.5) scale(1)'
      ) :
      'translate(143.92499923706055,268.5) scale(1)'
    );

    cy.zoomOutMapButton().click();

    cy.get('#graph0').should(
      'have.attr', 'transform',
      firefox ? (
        headed ?
          'translate(58.090083385336,414.2068965517241) scale(3.6982758620689653)' :
          'translate(58.465083385336,414.2068965517241) scale(3.6982758620689653)'
      ) :
        'translate(57.715083385336,414.2068965517241) scale(3.6982758620689653)'
    );
  })

})
