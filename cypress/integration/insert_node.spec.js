describe('Insertion of nodes into the graph', function() {

  it('Inserts a node with latest attributes when middle mouse button is clicked', function() {
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

  it('Inserts a node with default attributes when middle mouse button is shift-clicked', function() {
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

    cy.toolbarButton('Node format').click();
    cy.styleSwitch().click();
    cy.style('dotted').click();

    cy.get('#graph0').trigger('mousedown', 'topLeft', {which: 2, shiftKey: true});
    cy.get('#graph0').trigger('mouseup', 'topLeft', {which: 2, shiftKey: true});
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('n2');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(2).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(3).find('ellipse').should('have.attr', 'stroke-dasharray', '1,5');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);
  })

  it('Inserts a node when a node in an insert panel is clicked', function() {
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
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

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

  it('Inserts a node by copy-and-paste another node', function() {
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
    cy.get('body').type('{ctrl}c');
    cy.get('body').type('{ctrl}v');
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

  it('Replaces a node by cut-and-paste it thereby removing its connected edges', function() {
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
    cy.get('body').type('{ctrl}x');
    cy.waitForTransition();

    cy.node(1).should('exist');

    cy.node(1).shouldHaveName('Bob');

    cy.nodes().should('have.length', 1);
    cy.edges().should('have.length', 0);

    cy.get('body').type('{ctrl}v');
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');

    cy.node(1).shouldHaveName('Bob');
    cy.node(2).shouldHaveName('n1');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 0);
  })

  it('Default node style is seleced from one of the styles in the node format drawer', function() {
    cy.startApplication();
    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });
    cy.clearAndRenderDotSource('digraph {}');

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);

    cy.toolbarButton('Insert').click();
    cy.nodeShapeCategory('Basic shapes').click()

    cy.toolbarButton('Node format').click();

    const styles = [
      'dashed',
      'dotted',
      'solid',
      'invis',
      'bold',
      'filled',
      'striped',
      'wedged',
      'diagonals',
      'rounded',
      'radial',
    ];

    cy.styles().should('have.text', styles.join(''));

    cy.styleSwitch().click();

    let numberOfVisibleNodes = 0;
    styles.forEach((style, i) => {
      const nodeIndex = i + 1;

      cy.style(style).click();

      cy.nodeShape('box').click({force: true});
      cy.waitForTransition();

      if (style != 'invis') {
        numberOfVisibleNodes += 1;

        cy.node(nodeIndex).should('exist');
        cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

        switch(style) {
        case 'dashed':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('have.attr', 'stroke-dasharray', '5,2');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'dotted':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('have.attr', 'stroke-dasharray', '1,5');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'solid':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'bold':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'filled':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'striped':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polygon').eq(1).should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'wedged':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'diagonals':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 4);
          break;
        case 'rounded':
          cy.node(nodeIndex).find('polygon').should('have.length', 0);
          cy.node(nodeIndex).find('path').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('path').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('path').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'radial':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', '#d3d3d3');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        }
      }
      cy.nodes().should('have.length', numberOfVisibleNodes);

      cy.style(style).click();
    });
  })

})
