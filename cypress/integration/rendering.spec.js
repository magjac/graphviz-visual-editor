describe('Basic rendering from DOT source', function() {

  it('Selects the current DOT source, clears it, enters a simple graph and checks that it renders', function() {
    cy.startApplication();
    cy.checkDefaultGraph();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.textEditorContent().should('have.text', 'digraph {Alice -> Bob}');

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findNodes().should('have.length', 2);
      cy.wrap(graph0).findNode(1)
        .should('exist')
        .shouldHaveLabel('Alice');
      cy.wrap(graph0).findNode(2)
        .should('exist')
        .shouldHaveLabel('Bob');
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob');
    });
  })

  it('Starts by rendering an empty graph stored in browser local storage', function() {
    localStorage.setItem('dotSrc', 'digraph {}');
    cy.visit('http://localhost:3000/');

    cy.textEditorContent().should('have.text', 'digraph {}');

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findNodes().should('have.length', 0);
    });
  })

  it('Renders DOT source using the engine selected in settings', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    const engines = [
      'circo',
      'dot',
      'fdp',
      'neato',
      'osage',
      'patchwork',
      'twopi',
    ];

    engines.forEach(engine => {
      cy.settingsButton().click();
      cy.engineSelector().click();
      cy.engineMenuAlternative(engine).click();
      cy.get('body').type('{esc}', { release: false });
      cy.waitForTransition();
      cy.canvasGraph().then(graph0 => {
        switch (engine) {
        case 'circo':
          cy.wrap(graph0).invoke('height').should('eq', 58.666656494140625);
          cy.wrap(graph0).invoke('width').should('eq', 264.2266845703125);
          break;
        case 'dot':
          cy.wrap(graph0).invoke('height').should('eq', 154.66665649414062);
          cy.wrap(graph0).invoke('width').should('eq', 95.86669921875);
          break;
        case 'fdp':
          cy.wrap(graph0).invoke('height').should('eq', 73.33331298828125);
          cy.wrap(graph0).invoke('width').should('eq', 185.3333740234375);
          break;
        case 'neato':
          cy.wrap(graph0).invoke('height').should('eq', 72.85330200195312);
          cy.wrap(graph0).invoke('width').should('eq', 184.38671875);
          break;
        case 'osage':
          cy.wrap(graph0).invoke('height').should('eq', 58.666656494140625);
          cy.wrap(graph0).invoke('width').should('eq', 172.3599853515625);
          break;
        case 'patchwork':
          cy.wrap(graph0).invoke('height').should('eq',70.29330444335938);
          // Workaround for difference between Chrome 79 headed and headless:
          cy.wrap(graph0).invoke('width').should('be.oneOf', [71.2724609375, 70.2933349609375]);
          break;
        case 'twopi':
          cy.wrap(graph0).invoke('height').should('eq', 58.666656494140625);
          cy.wrap(graph0).invoke('width').should('eq', 185.4400634765625);
          break;
        }
      });
    });

  })

  it('Fits the graph to the available area when enabled in settings', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('height').should('eq', 154.66665649414062);
      cy.wrap(graph0).invoke('width').should('eq', 95.86669921875);
    });

    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('height').should('eq', 572);
      cy.wrap(graph0).invoke('width').should('eq', 354.5413818359375);
    });

    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('height').should('eq', 154.66665649414062);
      cy.wrap(graph0).invoke('width').should('eq', 95.86669921875);
    });

  })

  it('Does not resize the graph when the window is resized if fit graph is disabled', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.canvasSvg().then(svg => {
      cy.wrap(svg).invoke('width').should('eq', 469);
      cy.wrap(svg).invoke('height').should('eq', 572);
      cy.wrap(svg).should('have.attr', 'viewBox', '0 0 351.75 429');
      cy.wrap(svg).should('have.attr', 'width', '469');
      cy.wrap(svg).should('have.attr', 'height', '572');
    });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('width').should('eq', 95.86669921875);
      cy.wrap(graph0).invoke('height').should('eq', 154.66665649414062);
    });

    cy.viewport(1000 * 2, 660 * 2);

    cy.canvasSvg().then(svg => {
      cy.wrap(svg).invoke('width').should('eq', 469);
      cy.wrap(svg).invoke('height').should('eq', 572);
      cy.wrap(svg).should('have.attr', 'viewBox', '0 0 351.75 429');
      cy.wrap(svg).should('have.attr', 'width', '976');
      cy.wrap(svg).should('have.attr', 'height', '1232');
    });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('width').should('eq', 95.86669921875);
      cy.wrap(graph0).invoke('height').should('eq', 154.66665649414062);
    });

  })

  it('Resizes the graph when the window is resized if fit graph is enabled', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.canvasSvg().then(svg => {
      cy.wrap(svg).invoke('width').should('eq', 469);
      cy.wrap(svg).invoke('height').should('eq', 572);
      cy.wrap(svg).should('have.attr', 'viewBox', '0 0 71.90 116.00');
      cy.wrap(svg).should('have.attr', 'width', '469');
      cy.wrap(svg).should('have.attr', 'height', '572');
    });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('width').should('eq', 354.5413818359375);
      cy.wrap(graph0).invoke('height').should('eq', 572);
    });

    cy.viewport(1000 * 2, 660 * 2);

    cy.canvasSvg().then(svg => {
      cy.wrap(svg).invoke('width').should('eq', 469);
      cy.wrap(svg).invoke('height').should('eq', 572);
      cy.wrap(svg).should('have.attr', 'viewBox', '0 0 71.90 116.00');
      cy.wrap(svg).should('have.attr', 'width', '976');
      cy.wrap(svg).should('have.attr', 'height', '1232');
    });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('width').should('eq', 763.6275634765625);
      cy.wrap(graph0).invoke('height').should('eq', 1232);
    });

  })

})
