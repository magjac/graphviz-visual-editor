describe('Insertion of nodes into the graph', function() {

  function hsvToHex(h, s, v) {
        const x = 1 - Math.abs((h * 360 / 60) % 2 - 1);
        if (h <= 1 / 6) {
          return rgbToHex(1 * 255, x * 255, 0 * 255);
        } else if (1 / 6 <= h && h < 2 / 6) {
          return rgbToHex(x * 255, 1 * 255, 0 * 255);
        } else if (2 / 6 <= h && h < 3 / 6) {
          return rgbToHex(0 * 255, 1 * 255, x * 255);
        } else if (3 / 6 <= h && h < 4 / 6) {
          return rgbToHex(0 * 255, x * 255, 1 * 255);
        } else if (4 / 6 <= h && h < 5 / 6) {
          return rgbToHex(x * 255, 0 * 255, 1 * 255);
        } else {
          return rgbToHex(1 * 255, 0 * 255, x * 255);
        }
  }

  function rgbToHex(r, g, b) {
    return ('00000' + ((Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)).toString(16)).slice(-6);
  }

  function checkColor(actualHexColor, expectedHexColor, colorTolerance, propertyName='the') {
    const expectedColor = parseInt(expectedHexColor.slice(1), 16);
    const expectedRed = (expectedColor & 0xff0000) >> 16;
    const expectedGreen = (expectedColor & 0x00ff00) >> 8;
    const expectedBlue = (expectedColor & 0x0000ff);

    const actualColor = parseInt(actualHexColor.slice(1), 16);
    const actualRed = (actualColor & 0xff0000) >> 16;
    const actualGreen = (actualColor & 0x00ff00) >> 8;
    const actualBlue = (actualColor & 0x0000ff);

    const absDiffRed = Math.abs(actualRed - expectedRed);
    const absDiffGreen = Math.abs(actualGreen - expectedGreen);
    const absDiffBlue = Math.abs(actualBlue - expectedBlue);

    assert.isAtMost(absDiffRed, colorTolerance, propertyName + ' red component');
    assert.isAtMost(absDiffGreen, colorTolerance, propertyName + ' green component');
    assert.isAtMost(absDiffBlue, colorTolerance, propertyName + ' blue component');
  }

  it('Inserts a node with latest attributes when middle mouse button is clicked', function() {
    cy.startCleanApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.canvasGraph().trigger('mousedown', 'topLeft', {which: 2});
    cy.canvasGraph().trigger('mouseup', 'topLeft', {which: 2});
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
    cy.startCleanApplication();
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

    cy.canvasGraph().trigger('mousedown', 'topLeft', {which: 2, shiftKey: true});
    cy.canvasGraph().trigger('mouseup', 'topLeft', {which: 2, shiftKey: true});
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
    cy.startCleanApplication();
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
    cy.startCleanApplication();
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
    cy.startCleanApplication();
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
    cy.startCleanApplication();
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

  it('Inserts a node with an empty style if style is enabled, but no style is selected', function() {
    cy.startCleanApplication();
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
    cy.toolbarButton('Node format').click();

    cy.canvasGraph().trigger('mousedown', 'topLeft', {which: 2, shiftKey: true});
    cy.canvasGraph().trigger('mouseup', 'topLeft', {which: 2, shiftKey: true});

    cy.textEditorVisibleLines().should('have.text', 'digraph {Alice -> Bob    n2 [ style=""]}');

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
    cy.node(3).find('ellipse').should('not.have.attr', 'stroke-dasharray');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);

    // now disable style and check that no style is used

    cy.toolbarButton('Node format').click();
    cy.styleSwitch().click();
    cy.toolbarButton('Node format').click();

    cy.canvasGraph().trigger('mousedown', 'topLeft', {which: 2, shiftKey: true});
    cy.canvasGraph().trigger('mouseup', 'topLeft', {which: 2, shiftKey: true});

    cy.textEditorVisibleLines().should('have.text', 'digraph {Alice -> Bob    n2 [ style=""]    n3}');

    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.node(4).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('n2');
    cy.node(4).shouldHaveName('n3');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(2).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(3).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(4).find('ellipse').should('not.have.attr', 'stroke-dasharray');

    cy.nodes().should('have.length', 4);
    cy.edges().should('have.length', 1);
  })

  it('Default node style is seleced from one of the styles in the node format drawer', function() {
    cy.startCleanApplication();
    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });

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
    cy.wrap(styles).each((style, i) => {
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
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'striped':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '0.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', 'lightgrey');
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
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        }
      }
      cy.nodes().should('have.length', numberOfVisibleNodes);

      cy.style(style).click();
    });
  })

  it('Default node style is seleced from multiple styles in the node format drawer', function() {
    cy.startCleanApplication();
    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });

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
    cy.wrap(styles).each((style, i) => {
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
          cy.node(nodeIndex).find('polygon').should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'striped':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '0.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'wedged':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '0.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'diagonals':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '0.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'rounded':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '0.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'radial':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '0.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        }
      } else {
        cy.style('invis').click();
      }

      cy.nodes().should('have.length', numberOfVisibleNodes);

    });
  })

  it('Default node styles are deseleced in the node format drawer', function() {
    cy.startCleanApplication();

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

    cy.wrap(styles.filter(style => style != 'invis')).each((style, i) => {
      cy.style(style).click();
    });

    cy.wrap(styles.filter(style => style != 'invis')).each((style, i) => {
      cy.style(style).should('be.checked');
    });

    let numberOfVisibleNodes = 0;
    cy.wrap(styles).each((style, i) => {
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
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '0.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'dotted':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '0.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'solid':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '0.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'stroke-width', '2');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'bold':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '0.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polygon').eq(1).should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'filled':
          cy.node(nodeIndex).find('polygon').should('have.length', 2);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'stroke-width', '0.5');
          cy.node(nodeIndex).find('polygon').eq(0).should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polygon').eq(1).should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').eq(1).should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'striped':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polyline').should('have.length', 4);
          break;
        case 'wedged':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polyline').should('have.length', 4);
          break;
        case 'diagonals':
          cy.node(nodeIndex).find('polygon').should('have.length', 0);
          cy.node(nodeIndex).find('path').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('path').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('path').should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'rounded':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'lightgrey');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        case 'radial':
          cy.node(nodeIndex).find('polygon').should('have.length', 1);
          cy.node(nodeIndex).find('path').should('have.length', 0);
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-dasharray');
          cy.node(nodeIndex).find('polygon').should('not.have.attr', 'stroke-width');
          cy.node(nodeIndex).find('polygon').should('have.attr', 'fill', 'none');
          cy.node(nodeIndex).find('polyline').should('have.length', 0);
          break;
        }
      } else {
        cy.style('invis').click();
      }

      cy.nodes().should('have.length', numberOfVisibleNodes);

    });
  })

  it('Inserts a node with an empty color if color is enabled, but no color is selected', function() {
    cy.startCleanApplication();
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
    cy.colorSwitch().click();
    cy.toolbarButton('Node format').click();

    cy.canvasGraph().trigger('mousedown', 'topLeft', {which: 2, shiftKey: true});
    cy.canvasGraph().trigger('mouseup', 'topLeft', {which: 2, shiftKey: true});

    cy.textEditorVisibleLines().should('have.text', 'digraph {Alice -> Bob    n2 [ color=""]}');

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
    cy.node(3).find('ellipse').should('not.have.attr', 'stroke-dasharray');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);

    // now disable color and check that no color is used

    cy.toolbarButton('Node format').click();
    cy.colorSwitch().click();
    cy.toolbarButton('Node format').click();

    cy.canvasGraph().trigger('mousedown', 'topLeft', {which: 2, shiftKey: true});
    cy.canvasGraph().trigger('mouseup', 'topLeft', {which: 2, shiftKey: true});

    cy.textEditorVisibleLines().should('have.text', 'digraph {Alice -> Bob    n2 [ color=""]    n3}');

    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.node(4).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('n2');
    cy.node(4).shouldHaveName('n3');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(2).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(3).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(4).find('ellipse').should('not.have.attr', 'stroke-dasharray');

    cy.nodes().should('have.length', 4);
    cy.edges().should('have.length', 1);
  })

  it('Default node color is seleced from the color picker in the node format drawer', function() {
    localStorage.setItem('engine', 'circo');
    cy.startCleanApplication();
    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.toolbarButton('Node format').click();

    let nodeIndex = 0;

    const positions = {
      'topLeft': {x: 0, y: 1},
      'top': {x: 0.5, y: 1},
      'topRight': {x: 1, y: 1},
      'left': {x: 0, y: 0.5},
      'center': {x: 0.5, y: 0.5},
      'right': {x: 1, y: 0.5},
      'bottomLeft': {x: 0, y: 0},
      'bottom': {x: 0.5, y: 0},
      'bottomRight': {x: 1, y: 0},
    };

    const horizontalPositions = {
      'left': {x: 0, y: 0.5},
      'center': {x: 0.5, y: 0.5},
      'right': {x: 1, y: 0.5},
    };

    cy.colorSwitch().click();

    cy.colorPickerInput().type('#12345678');

    cy.toolbarButton('Insert').click();
    cy.nodeShapeCategory('Basic shapes').click()
    cy.nodeShape('ellipse').click({force: true});
    nodeIndex += 1;
    cy.waitForTransition();
    cy.toolbarButton('Insert').click();

    cy.node(nodeIndex).should('exist');
    cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

    cy.node(nodeIndex).find('ellipse').then(ellipse => {
      expect(ellipse).to.have.length(1);
      expect(ellipse).to.have.attr('stroke', '#123456');
      expect(ellipse).to.have.attr('fill', 'none');
      const expectedStrokeOpacity = (Math.floor((0x78 / 255) * 1000000) / 1000000).toString();
      expect(ellipse).to.have.attr('stroke-opacity', expectedStrokeOpacity);
      expect(ellipse).to.not.have.attr('fill-opacity');
    });

    cy.colorPickerInput().type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}ff0000');

    for (let positionName of Object.keys(positions)) {
      const colorTolerance = 8;
      cy.colorPickerSwatch().click();
      cy.colorPickerSaturation().click(positionName);

      cy.toolbarButton('Insert').click();
      cy.nodeShapeCategory('Basic shapes').click()
      cy.nodeShape('ellipse').click({force: true});
      nodeIndex += 1;
      cy.waitForTransition();
      cy.toolbarButton('Insert').click();

      cy.node(nodeIndex).should('exist');
      cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

      cy.node(nodeIndex).find('ellipse').then(ellipse => {
        expect(ellipse).to.have.length(1);
        expect(ellipse).to.have.attr('stroke');
        expect(ellipse).to.have.attr('fill', 'none');
        expect(ellipse).to.not.have.attr('stroke-opacity');
        expect(ellipse).to.not.have.attr('fill-opacity');
        const {x, y} = positions[positionName];
        const expectedStrokeColor = rgbToHex(y * 255, (1 - x) * y * 255, (1 - x) * y * 255);
        const actualStrokeColor = ellipse.attr('stroke').replace('#', '');
        checkColor(actualStrokeColor, expectedStrokeColor, colorTolerance, 'stroke');
      });
    }

    cy.colorPickerSwatch().click();
    cy.colorPickerSaturation().click('topRight', {force: true});

    for (let positionName of Object.keys(horizontalPositions)) {
      const colorTolerance = 16;
      cy.colorPickerSwatch().click();
      cy.colorPickerHue().click(positionName, {force: true});

      cy.toolbarButton('Insert').click();
      cy.nodeShapeCategory('Basic shapes').click()
      cy.nodeShape('ellipse').click({force: true});
      nodeIndex += 1;
      cy.waitForTransition();
      cy.toolbarButton('Insert').click();

      cy.node(nodeIndex).should('exist');
      cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

      cy.node(nodeIndex).find('ellipse').then(ellipse => {
        expect(ellipse).to.have.length(1);
        expect(ellipse).to.have.attr('stroke');
        expect(ellipse).to.have.attr('fill', 'none');
        expect(ellipse).to.not.have.attr('stroke-opacity');
        expect(ellipse).to.not.have.attr('fill-opacity');
        const {x, y} = horizontalPositions[positionName];
        const expectedStrokeColor = hsvToHex(x, 1, 1)
        const actualStrokeColor = ellipse.attr('stroke').replace('#', '');
        checkColor(actualStrokeColor, expectedStrokeColor, colorTolerance, 'stroke');
      });
    }

    cy.colorPickerSwatch().click();
    cy.colorPickerHue().click('left', {force: true});

    for (let positionName of Object.keys(horizontalPositions)) {
      const colorTolerance = 4;
      let expectedStrokeColor;
      let expectedStrokeOpacity;
      if (positionName == 'left') {
        expectedStrokeColor = 'none';
        expectedStrokeOpacity = null;
      } else {
        const {x, y} = positions['topRight'];
        expectedStrokeColor = rgbToHex(y * 255, (1 - x) * y * 255, (1 - x) * y * 255);
        expectedStrokeOpacity = horizontalPositions[positionName].x;
      }
      cy.colorPickerSwatch().click();
      cy.colorPickerOpacity().click(positionName);

      cy.toolbarButton('Insert').click();
      cy.nodeShapeCategory('Basic shapes').click()
      cy.nodeShape('ellipse').click({force: true});
      nodeIndex += 1;
      cy.waitForTransition();
      cy.toolbarButton('Insert').click();

      cy.node(nodeIndex).should('exist');
      cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

      cy.node(nodeIndex).find('ellipse').then(ellipse => {
        expect(ellipse).to.have.length(1);
        expect(ellipse).to.have.attr('stroke');
        expect(ellipse).to.have.attr('fill', 'none');
        expect(ellipse).to.not.have.attr('fill-opacity');
        const actualStrokeColor = ellipse.attr('stroke').replace('#', '');
        if (expectedStrokeColor == 'none') {
          expect(actualStrokeColor).to.eq(expectedStrokeColor);
        } else {
          checkColor(actualStrokeColor, expectedStrokeColor, colorTolerance);
        }
        if (expectedStrokeOpacity != null) {
          const actualStrokeOpacity = ellipse.attr('stroke-opacity');
          const strokeOpacityAbsDiff = Math.abs(actualStrokeOpacity - expectedStrokeOpacity)
          expect(strokeOpacityAbsDiff).to.be.lessThan(0.02);
        } else {
          expect(ellipse).to.not.have.attr('stroke-opacity');
        }
      });
    }

    cy.formatDrawerCloseButton().click()
    cy.formatDrawer().should('not.exist');
  })

  it('Inserts a node with an empty fillcolor if fillcolor is enabled, but no fillcolor is selected', function() {
    cy.startCleanApplication();
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
    cy.fillColorSwitch().click();
    cy.toolbarButton('Node format').click();

    cy.canvasGraph().trigger('mousedown', 'topLeft', {which: 2, shiftKey: true});
    cy.canvasGraph().trigger('mouseup', 'topLeft', {which: 2, shiftKey: true});

    cy.textEditorVisibleLines().should('have.text', 'digraph {Alice -> Bob    n2 [ fillcolor=""]}');

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
    cy.node(3).find('ellipse').should('not.have.attr', 'stroke-dasharray');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 1);

    // now disable fillcolor and check that no fillcolor is used

    cy.toolbarButton('Node format').click();
    cy.fillColorSwitch().click();
    cy.toolbarButton('Node format').click();

    cy.canvasGraph().trigger('mousedown', 'topLeft', {which: 2, shiftKey: true});
    cy.canvasGraph().trigger('mouseup', 'topLeft', {which: 2, shiftKey: true});

    cy.textEditorVisibleLines().should('have.text', 'digraph {Alice -> Bob    n2 [ fillcolor=""]    n3}');

    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.node(4).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('n2');
    cy.node(4).shouldHaveName('n3');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(2).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(3).find('ellipse').should('not.have.attr', 'stroke-dasharray');
    cy.node(4).find('ellipse').should('not.have.attr', 'stroke-dasharray');

    cy.nodes().should('have.length', 4);
    cy.edges().should('have.length', 1);
  })

  it('Default node fillcolor is seleced from the fillcolor picker in the node format drawer', function() {
    localStorage.setItem('engine', 'circo');
    cy.startCleanApplication();

    cy.settingsButton().click();
    cy.fitSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.toolbarButton('Node format').click();
    cy.styleSwitch().click();
    cy.style('filled').click();

    let nodeIndex = 0;

    const positions = {
      'topLeft': {x: 0, y: 1},
      'top': {x: 0.5, y: 1},
      'topRight': {x: 1, y: 1},
      'left': {x: 0, y: 0.5},
      'center': {x: 0.5, y: 0.5},
      'right': {x: 1, y: 0.5},
      'bottomLeft': {x: 0, y: 0},
      'bottom': {x: 0.5, y: 0},
      'bottomRight': {x: 1, y: 0},
    };

    const horizontalPositions = {
      'left': {x: 0, y: 0.5},
      'center': {x: 0.5, y: 0.5},
      'right': {x: 1, y: 0.5},
    };

    cy.fillColorSwitch().click();

    cy.fillColorPickerInput().type('#12345678');

    cy.toolbarButton('Insert').click();
    cy.nodeShapeCategory('Basic shapes').click()
    cy.nodeShape('ellipse').click({force: true});
    nodeIndex += 1;
    cy.waitForTransition();
    cy.toolbarButton('Insert').click();

    cy.node(nodeIndex).should('exist');
    cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

    cy.node(nodeIndex).find('ellipse').then(ellipse => {
      expect(ellipse).to.have.length(1);
      expect(ellipse).to.have.attr('stroke', 'black');
      expect(ellipse).to.have.attr('fill', '#123456');
      const expectedFillOpacity = (Math.floor((0x78 / 255) * 1000000) / 1000000).toString();
      expect(ellipse).to.not.have.attr('stroke-opacity');
      expect(ellipse).to.have.attr('fill-opacity', expectedFillOpacity);
    });

    cy.fillColorPickerInput().type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}');

    for (let positionName of Object.keys(positions)) {
      const colorTolerance = 8;
      cy.fillColorPickerSwatch().click();
      cy.fillColorPickerSaturation().click(positionName);

      cy.toolbarButton('Insert').click();
      cy.nodeShapeCategory('Basic shapes').click()
      cy.nodeShape('ellipse').click({force: true});
      nodeIndex += 1;
      cy.waitForTransition();
      cy.toolbarButton('Insert').click();

      cy.node(nodeIndex).should('exist');
      cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

      cy.node(nodeIndex).find('ellipse').then(ellipse => {
        expect(ellipse).to.have.length(1);
        expect(ellipse).to.not.have.attr('fill-opacity');
        expect(ellipse).to.have.attr('fill');
        expect(ellipse).to.not.have.attr('stroke-opacity');
        expect(ellipse).to.have.attr('stroke', 'black');
        const {x, y} = positions[positionName];
        const expectedFillColor = rgbToHex(y * 255, (1 - x) * y * 255, (1 - x) * y * 255);
        const actualFillColor = ellipse.attr('fill').replace('#', '');
        checkColor(actualFillColor, expectedFillColor, colorTolerance, 'fill');
      });
    }

    cy.fillColorPickerSwatch().click();
    cy.fillColorPickerSaturation().click('topRight', {force: true});

    for (let positionName of Object.keys(horizontalPositions)) {
      const colorTolerance = 16;
      cy.fillColorPickerSwatch().click();
      cy.fillColorPickerHue().click(positionName, {force: true});

      cy.toolbarButton('Insert').click();
      cy.nodeShapeCategory('Basic shapes').click()
      cy.nodeShape('ellipse').click({force: true});
      nodeIndex += 1;
      cy.waitForTransition();
      cy.toolbarButton('Insert').click();

      cy.node(nodeIndex).should('exist');
      cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

      cy.node(nodeIndex).find('ellipse').then(ellipse => {
        expect(ellipse).to.have.length(1);
        expect(ellipse).to.have.attr('stroke', 'black');
        expect(ellipse).to.have.attr('fill');
        expect(ellipse).to.not.have.attr('stroke-opacity');
        expect(ellipse).to.not.have.attr('fill-opacity');
        const {x, y} = horizontalPositions[positionName];
        const expectedFillColor = hsvToHex(x, 1, 1)
        const actualFillColor = ellipse.attr('fill').replace('#', '');
        checkColor(actualFillColor, expectedFillColor, colorTolerance, 'fill');
      });
    }

    cy.fillColorPickerSwatch().click();
    cy.fillColorPickerHue().click('left', {force: true});

    for (let positionName of Object.keys(horizontalPositions)) {
      const colorTolerance = 4;
      let expectedFillColor;
      let expectedFillOpacity;
      if (positionName == 'left') {
        expectedFillColor = 'none';
        expectedFillOpacity = null;
      } else {
        const {x, y} = positions['topRight'];
        expectedFillColor = rgbToHex(y * 255, (1 - x) * y * 255, (1 - x) * y * 255);
        expectedFillOpacity = horizontalPositions[positionName].x;
      }
      cy.fillColorPickerSwatch().click();
      cy.fillColorPickerOpacity().click(positionName);

      cy.toolbarButton('Insert').click();
      cy.nodeShapeCategory('Basic shapes').click()
      cy.nodeShape('ellipse').click({force: true});
      nodeIndex += 1;
      cy.waitForTransition();
      cy.toolbarButton('Insert').click();

      cy.node(nodeIndex).should('exist');
      cy.node(nodeIndex).shouldHaveName('n' + (nodeIndex - 1));

      cy.node(nodeIndex).find('ellipse').then(ellipse => {
        expect(ellipse).to.have.length(1);
        expect(ellipse).to.have.attr('fill');
        expect(ellipse).to.not.have.attr('stroke-opacity');
        expect(ellipse).to.have.attr('stroke', 'black');
        const actualFillColor = ellipse.attr('fill').replace('#', '');
        if (expectedFillColor == 'none') {
          expect(actualFillColor).to.eq(expectedFillColor);
        } else {
          checkColor(actualFillColor, expectedFillColor, colorTolerance, 'fill');
        }
        if (expectedFillOpacity != null) {
          const actualFillOpacity = ellipse.attr('fill-opacity');
          const fillOpacityAbsDiff = Math.abs(actualFillOpacity - expectedFillOpacity)
          expect(fillOpacityAbsDiff).to.be.lessThan(0.02);
        } else {
          expect(ellipse).to.not.have.attr('fill-opacity');
        }
      });
    }

  })

})
