function getAllPropertyNames(obj) {
  const proto     = Object.getPrototypeOf(obj);
  const inherited = (proto) ? getAllPropertyNames(proto) : [];
  return [...new Set(Object.getOwnPropertyNames(obj).concat(inherited))];
}

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

  /*
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
          cy.wrap(graph0).invoke('height').should('be.closeTo', 58.667, 0.0005);
          cy.wrap(graph0).invoke('width').should('be.closeTo', 264.227, 0.0005);
          break;
        case 'dot':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 154.667, 0.0005);
          cy.wrap(graph0).invoke('width').should('be.closeTo', 95.867, 0.0005);
          break;
        case 'fdp':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 71.707, 0.0005);
          cy.wrap(graph0).invoke('width').should('be.closeTo', 184.000, 0.0005);
          break;
        case 'neato':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 72.853, 0.0005);
          cy.wrap(graph0).invoke('width').should('be.closeTo', 184.387, 0.0005);
          break;
        case 'osage':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 58.667, 0.0005);
          cy.wrap(graph0).invoke('width').should('be.closeTo', 172.360, 0.0005);
          break;
        case 'patchwork':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 70.293, 0.0005);
          // Workaround for difference between Chrome 110 headed and Chrome 109 headless:
          if (Cypress.browser.isHeadless) {
            cy.wrap(graph0).invoke('width').should('be.closeTo', 70.756, 0.0005);
          }
          else {
            cy.wrap(graph0).invoke('width').should('be.closeTo', 70.766, 0.0005);
          }
          break;
        case 'twopi':
          cy.wrap(graph0).invoke('height').should('be.closeTo', 58.667, 0.0005);
          cy.wrap(graph0).invoke('width').should('be.closeTo', 185.440, 0.0005);
          break;
        }
      });
    });

  })
*/

  it('Fits the graph to the available area when enabled in settings', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('height').should('be.closeTo', 154.667, 0.0005);
      cy.wrap(graph0).invoke('width').should('be.closeTo', 95.867, 0.0005);
    });

    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('height').should('eq', 572);
      cy.wrap(graph0).invoke('width').should('be.closeTo', 354.541, 0.0005);
    });

    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).invoke('height').should('be.closeTo', 154.667, 0.0005);
      cy.wrap(graph0).invoke('width').should('be.closeTo', 95.867, 0.0005);
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
      cy.wrap(graph0).invoke('width').should('be.closeTo', 95.867, 0.0005);
      cy.wrap(graph0).invoke('height').should('be.closeTo', 154.667, 0.0005);
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
      cy.wrap(graph0).invoke('width').should('be.closeTo', 95.867, 0.0005);
      cy.wrap(graph0).invoke('height').should('be.closeTo', 154.667, 0.0005);
    });

  })

  /*
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
      cy.wrap(graph0).invoke('width').should('be.closeTo', 354.541, 0.0005);
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
      cy.wrap(graph0).invoke('width').should('be.closeTo', 763.628, 0.0005);
      cy.wrap(graph0).invoke('height').should('eq', 1232);
    });

  })
*/

  it('Renders nodes with names equal to properties of the JavaScript Object type, and edges between them', function() {
    const nodeNames = getAllPropertyNames({});
    const dotSrc = `digraph {\n${nodeNames.join('-> \n')}\n}`;
    cy.startApplicationWithDotSource(dotSrc);

    const numNodes = nodeNames.length;
    const numEdges = nodeNames.length - 1;

    cy.nodes().should('have.length', numNodes);
    cy.edges().should('have.length', numEdges);

    cy.wrap(nodeNames).each((nodeName, i) => {
      const nodeIndex = i + 1;
      cy.node(nodeIndex).should('exist');
      cy.node(nodeIndex).shouldHaveName(nodeName);
      if (i > 0) {
        const prevNodeName = nodeNames[i - 1];
        const edgeIndex = nodeIndex - 1;
        cy.edge(edgeIndex).should('exist');
        cy.edge(edgeIndex).shouldHaveName(`${prevNodeName}->${nodeName}`);

      }
    });

  })

})
