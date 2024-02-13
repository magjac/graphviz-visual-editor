describe('Draw edges in the graph', function() {

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

  it('Draws an edge from a node to another node in an undirected graph', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('graph {Alice Bob}');

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
    cy.textEditorGutterCellWithError().should('not.exist');
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice--Bob');

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

  it('Default edge style is seleced from one of the styles in the edge format drawer', function() {
    cy.startCleanApplication();

    cy.clearAndRenderDotSource('digraph {Alice Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('not.exist');

    cy.toolbarButton('Edge format').click();

    const styles = [
      'dashed',
      'dotted',
      'solid',
      'invis',
      'bold',
      'tapered',
    ];
    cy.styles().should('have.text', styles.join(''));

    cy.styleSwitch().click();

    let numberOfVisibleEdges = 0;
    styles.forEach((style, i) => {
      const edgeIndex = i + 1;

      cy.style(style).click();

      cy.node(1).trigger('contextmenu', {force: true});
      if (style != 'invis') {
        cy.edge(edgeIndex).should('exist');
      }
      cy.node(2).trigger('mousemove');
      cy.node(2).dblclick();
      cy.waitForTransition();

      if (style != 'invis') {
        numberOfVisibleEdges += 1;

        cy.edge(edgeIndex).then(edge => {
          cy.wrap(edge).should('exist');
          cy.wrap(edge).shouldHaveName('Alice->Bob');

          switch(style) {
          case 'dashed':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.attr', 'stroke-dasharray', '5,2');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', 'black');
            break;
          case 'dotted':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.attr', 'stroke-dasharray', '1,5');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', 'black');
            break;
          case 'solid':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', 'black');
            break;
          case 'bold':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('have.attr', 'stroke-width', '2');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', 'black');
            break;
          case 'tapered':
            cy.wrap(edge).find('polygon').should('have.length', 2);
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').eq(0).should('have.attr', 'stroke', 'none');
            cy.wrap(edge).find('polygon').eq(1).should('have.attr', 'stroke', 'black');
            break;
          }
        });
      }
      cy.edges().should('have.length', numberOfVisibleEdges);

      cy.style(style).click();
    });
  })

  it('Default edge style is seleced from multiple styles in the edge format drawer', function() {
    cy.startCleanApplication();

    cy.clearAndRenderDotSource('digraph {Alice Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('not.exist');

    cy.toolbarButton('Edge format').click();

    const styles = [
      'dashed',
      'dotted',
      'solid',
      'invis',
      'bold',
      'tapered',
    ];
    cy.styles().should('have.text', styles.join(''));

    cy.styleSwitch().click();

    let numberOfVisibleEdges = 0;
    styles.forEach((style, i) => {
      const edgeIndex = i + 1;

      cy.style(style).click();

      cy.node(1).trigger('contextmenu', {force: true});
      if (style != 'invis') {
        cy.edge(edgeIndex).should('exist');
      }
      cy.node(2).trigger('mousemove');
      cy.node(2).dblclick();
      cy.waitForTransition();

      if (style != 'invis') {
        numberOfVisibleEdges += 1;

        cy.edge(edgeIndex).then(edge => {
          cy.wrap(edge).should('exist');
          cy.wrap(edge).shouldHaveName('Alice->Bob');

          switch(style) {
          case 'dashed':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.attr', 'stroke-dasharray', '5,2');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', 'black');
            break;
          case 'dotted':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.attr', 'stroke-dasharray', '1,5');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', 'black');
            break;
          case 'solid':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', 'black');
            break;
          case 'bold':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('have.attr', 'stroke-width', '2');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', 'black');
            break;
          case 'tapered':
            cy.wrap(edge).find('polygon').should('have.length', 2);
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('not.have', 'stroke-width');
            cy.wrap(edge).find('polygon').eq(0).should('have.attr', 'stroke', 'none');
            cy.wrap(edge).find('polygon').eq(1).should('have.attr', 'stroke', 'black');
            break;
          }
        });
      } else {
        cy.style('invis').click();
      }
      cy.edges().should('have.length', numberOfVisibleEdges);
    });
  })

  it('Default edge styles are deseleced in the edge format drawer', function() {
    cy.startCleanApplication();

    cy.clearAndRenderDotSource('digraph {Alice Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('not.exist');

    cy.toolbarButton('Edge format').click();

    const styles = [
      'dashed',
      'dotted',
      'solid',
      'invis',
      'bold',
      'tapered',
    ];
    cy.styles().should('have.text', styles.join(''));

    cy.styleSwitch().click();

    styles.filter(style => style != 'invis').forEach((style, i) => {
      cy.style(style).click();
    });

    styles.filter(style => style != 'invis').forEach((style, i) => {
      cy.style(style).should('be.checked');
    });

    // FIXME: remove when https://github.com/magjac/d3-graphviz/issues/119 is fixed
    cy.style('tapered').click();

    let numberOfVisibleEdges = 0;
    // styles.forEach((style, i) => {
    // FIXME: remove when https://github.com/magjac/d3-graphviz/issues/119 is fixed
    styles.filter(style => style != 'tapered').forEach((style, i) => {
      const edgeIndex = i + 1;

      cy.style(style).click();

      cy.node(1).trigger('contextmenu', {force: true});
      if (style != 'invis') {
        cy.edge(edgeIndex).should('exist');
      }
      cy.node(2).trigger('mousemove');
      cy.node(2).dblclick();
      cy.waitForTransition();

      if (style != 'invis') {
        numberOfVisibleEdges += 1;

        cy.edge(edgeIndex).then(edge => {
          cy.wrap(edge).should('exist');
          cy.wrap(edge).shouldHaveName('Alice->Bob');

          switch(style) {
          case 'dashed':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('have.attr', 'stroke-width', '2');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', 'black');
            break;
          case 'dotted':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('have.attr', 'stroke-width', '2');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', 'black');
            break;
          case 'solid':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('have.attr', 'stroke-width', '2');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', 'black');
            break;
          case 'bold':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', 'black');
            break;
          case 'tapered':
            cy.wrap(edge).find('polygon').should('have.length', 2);
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', 'black');
            cy.wrap(edge).find('polygon').should('not.have', 'stroke-width');
            cy.wrap(edge).find('polygon').eq(0).should('have.attr', 'stroke', 'none');
            cy.wrap(edge).find('polygon').eq(1).should('have.attr', 'stroke', 'black');
            break;
          }
        });
      } else {
        cy.style('invis').click();
      }
      cy.edges().should('have.length', numberOfVisibleEdges);
    });
  })

  it('Default edge color is seleced from the color picker in the edge format drawer', function() {
    cy.startCleanApplication();

    cy.clearAndRenderDotSource('digraph {Alice Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('not.exist');

    cy.toolbarButton('Edge format').click();

    let edgeIndex = 0;

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

    cy.node(1).trigger('contextmenu', {force: true});
    edgeIndex += 1;
    cy.edge(edgeIndex).should('exist');
    cy.node(2).trigger('mousemove');
    cy.node(2).dblclick();
    cy.waitForTransition();

    cy.edge(edgeIndex).should('exist');
    cy.edge(edgeIndex).shouldHaveName('Alice->Bob');

    cy.edge(edgeIndex).find('path').then(path => {
      expect(path).to.have.length(1);
      expect(path).to.have.attr('stroke', '#123456');
      expect(path).to.have.attr('fill', 'none');
      const expectedStrokeOpacity = (Math.floor((0x78 / 255) * 1000000) / 1000000).toString();
      expect(path).to.have.attr('stroke-opacity', expectedStrokeOpacity);
      expect(path).to.not.have.attr('fill-opacity');
    });

    cy.colorPickerInput().type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}ff0000');

    for (let positionName of Object.keys(positions)) {
      const colorTolerance = 8;
      cy.colorPickerSwatch().click();
      cy.colorPickerSaturation().click(positionName);

      cy.node(1).trigger('contextmenu', {force: true});
      cy.edge(edgeIndex).should('exist');
      cy.node(2).trigger('mousemove');
      cy.node(2).dblclick();
      edgeIndex += 1;
      cy.waitForTransition();

      cy.edge(edgeIndex).should('exist');
      cy.edge(edgeIndex).shouldHaveName('Alice->Bob');

      cy.edge(edgeIndex).find('path').then(path => {
        expect(path).to.have.length(1);
        expect(path).to.have.attr('stroke');
        expect(path).to.have.attr('fill', 'none');
        expect(path).to.not.have.attr('stroke-opacity');
        expect(path).to.not.have.attr('fill-opacity');
        const {x, y} = positions[positionName];
        const expectedStrokeColor = rgbToHex(y * 255, (1 - x) * y * 255, (1 - x) * y * 255);
        const actualStrokeColor = path.attr('stroke').replace('#', '');
        checkColor(actualStrokeColor, expectedStrokeColor, colorTolerance, 'stroke');
      });
    }

    cy.colorPickerSwatch().click();
    cy.colorPickerSaturation().click('topRight', {force: true});

    for (let positionName of Object.keys(horizontalPositions)) {
      const colorTolerance = 16;
      cy.colorPickerSwatch().click();
      cy.colorPickerHue().click(positionName, {force: true});

      cy.node(1).trigger('contextmenu', {force: true});
      cy.edge(edgeIndex).should('exist');
      cy.node(2).trigger('mousemove');
      cy.node(2).dblclick();
      edgeIndex += 1;
      cy.waitForTransition();

      cy.edge(edgeIndex).should('exist');
      cy.edge(edgeIndex).shouldHaveName('Alice->Bob');

      cy.edge(edgeIndex).find('path').then(path => {
        expect(path).to.have.length(1);
        expect(path).to.have.attr('stroke');
        expect(path).to.have.attr('fill', 'none');
        expect(path).to.not.have.attr('stroke-opacity');
        expect(path).to.not.have.attr('fill-opacity');
        const {x, y} = horizontalPositions[positionName];
        const expectedStrokeColor = hsvToHex(x, 1, 1)
        const actualStrokeColor = path.attr('stroke').replace('#', '');
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

      cy.node(1).trigger('contextmenu', {force: true});
      cy.edge(edgeIndex).should('exist');
      cy.node(2).trigger('mousemove');
      cy.node(2).dblclick();
      edgeIndex += 1;
      cy.waitForTransition();

      cy.edge(edgeIndex).should('exist');
      cy.edge(edgeIndex).shouldHaveName('Alice->Bob');

      cy.edge(edgeIndex).find('path').then(path => {
        expect(path).to.have.length(1);
        expect(path).to.have.attr('stroke');
        expect(path).to.have.attr('fill', 'none');
        expect(path).to.not.have.attr('fill-opacity');
        const actualStrokeColor = path.attr('stroke').replace('#', '');
        if (expectedStrokeColor == 'none') {
          expect(actualStrokeColor).to.eq(expectedStrokeColor);
        } else {
          checkColor(actualStrokeColor, expectedStrokeColor, colorTolerance);
        }
        if (expectedStrokeOpacity != null) {
          const actualStrokeOpacity = path.attr('stroke-opacity');
          const strokeOpacityAbsDiff = Math.abs(actualStrokeOpacity - expectedStrokeOpacity)
          expect(strokeOpacityAbsDiff).to.be.lessThan(0.02);
        } else {
          expect(path).to.not.have.attr('stroke-opacity');
        }
      });
    }

    cy.formatDrawerCloseButton().click()
    cy.formatDrawer().should('not.exist');
  })

  it('Default edge fillcolor is seleced from the fillcolor picker in the edge format drawer', function() {
    cy.startCleanApplication();

    cy.clearAndRenderDotSource('digraph {Alice Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('not.exist');

    cy.toolbarButton('Edge format').click();

    let edgeIndex = 0;

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

    cy.node(1).trigger('contextmenu', {force: true});
    edgeIndex += 1;
    cy.edge(edgeIndex).should('exist');
    cy.node(2).trigger('mousemove');
    cy.node(2).dblclick();
    cy.waitForTransition();

    cy.edge(edgeIndex).should('exist');
    cy.edge(edgeIndex).shouldHaveName('Alice->Bob');

    cy.edge(edgeIndex).find('polygon').then(polygon => {
      expect(polygon).to.have.length(1);
      expect(polygon).to.have.attr('stroke', 'black');
      expect(polygon).to.have.attr('fill', '#123456');
      const expectedFillOpacity = (Math.floor((0x78 / 255) * 1000000) / 1000000).toString();
      expect(polygon).to.have.attr('fill-opacity', expectedFillOpacity);
    });

    cy.fillColorPickerInput().type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}ff0000');

    for (let positionName of Object.keys(positions)) {
      const colorTolerance = 8;
      cy.fillColorPickerSwatch().click();
      cy.fillColorPickerSaturation().click(positionName);

      cy.node(1).trigger('contextmenu', {force: true});
      cy.edge(edgeIndex).should('exist');
      cy.node(2).trigger('mousemove');
      cy.node(2).dblclick();
      edgeIndex += 1;
      cy.waitForTransition();

      cy.edge(edgeIndex).should('exist');
      cy.edge(edgeIndex).shouldHaveName('Alice->Bob');

      cy.edge(edgeIndex).find('polygon').then(polygon => {
        expect(polygon).to.have.length(1);
        expect(polygon).to.have.attr('fill');
        expect(polygon).to.have.attr('stroke', 'black');
        expect(polygon).to.not.have.attr('fill-opacity');
        const {x, y} = positions[positionName];
        const expectedFillColor = rgbToHex(y * 255, (1 - x) * y * 255, (1 - x) * y * 255);
        const actualFillColor = polygon.attr('fill').replace('#', '');
        checkColor(actualFillColor, expectedFillColor, colorTolerance, 'fill');
      });
    }

    cy.fillColorPickerSwatch().click();
    cy.fillColorPickerSaturation().click('topRight', {force: true});

    for (let positionName of Object.keys(horizontalPositions)) {
      const colorTolerance = 16;
      cy.fillColorPickerSwatch().click();
      cy.fillColorPickerHue().click(positionName, {force: true});

      cy.node(1).trigger('contextmenu', {force: true});
      cy.edge(edgeIndex).should('exist');
      cy.node(2).trigger('mousemove');
      cy.node(2).dblclick();
      edgeIndex += 1;
      cy.waitForTransition();

      cy.edge(edgeIndex).should('exist');
      cy.edge(edgeIndex).shouldHaveName('Alice->Bob');

      cy.edge(edgeIndex).find('polygon').then(polygon => {
        expect(polygon).to.have.length(1);
        expect(polygon).to.have.attr('fill');
        expect(polygon).to.have.attr('stroke', 'black');
        expect(polygon).to.not.have.attr('fill-opacity');
        const {x, y} = horizontalPositions[positionName];
        const expectedFillColor = hsvToHex(x, 1, 1)
        const actualFillColor = polygon.attr('fill').replace('#', '');
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

      cy.node(1).trigger('contextmenu', {force: true});
      cy.edge(edgeIndex).should('exist');
      cy.node(2).trigger('mousemove');
      cy.node(2).dblclick();
      edgeIndex += 1;
      cy.waitForTransition();

      cy.edge(edgeIndex).should('exist');
      cy.edge(edgeIndex).shouldHaveName('Alice->Bob');

      cy.edge(edgeIndex).find('polygon').then(polygon => {
        expect(polygon).to.have.length(1);
        expect(polygon).to.have.attr('fill');
        expect(polygon).to.have.attr('stroke', 'black');
        const actualFillColor = polygon.attr('fill').replace('#', '');
        if (expectedFillColor == 'none') {
          expect(actualFillColor).to.eq(expectedFillColor);
        } else {
          checkColor(actualFillColor, expectedFillColor, colorTolerance);
        }
        if (expectedFillOpacity != null) {
          const actualFillOpacity = polygon.attr('fill-opacity');
          const fillOpacityAbsDiff = Math.abs(actualFillOpacity - expectedFillOpacity)
          expect(fillOpacityAbsDiff).to.be.lessThan(0.02);
        } else {
          expect(polygon).to.not.have.attr('fill-opacity');
        }
      });
    }

    cy.formatDrawerCloseButton().click()
    cy.formatDrawer().should('not.exist');
  })

})
