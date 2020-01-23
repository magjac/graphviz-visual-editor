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
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', '#000000');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', '#000000');
            break;
          case 'dotted':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.attr', 'stroke-dasharray', '1,5');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', '#000000');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', '#000000');
            break;
          case 'solid':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', '#000000');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', '#000000');
            break;
          case 'bold':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('have.attr', 'stroke-width', '2');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', '#000000');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', '#000000');
            break;
          case 'tapered':
            cy.wrap(edge).find('polygon').should('have.length', 2);
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', '#000000');
            cy.wrap(edge).find('polygon').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', '#000000');
            cy.wrap(edge).find('polygon').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').eq(0).should('have.attr', 'stroke', 'transparent');
            cy.wrap(edge).find('polygon').eq(1).should('have.attr', 'stroke', '#000000');
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
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', '#000000');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', '#000000');
            break;
          case 'dotted':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.attr', 'stroke-dasharray', '1,5');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', '#000000');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', '#000000');
            break;
          case 'solid':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-width');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', '#000000');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', '#000000');
            break;
          case 'bold':
            cy.wrap(edge).find('polygon').should('have.length', 1);
            cy.wrap(edge).find('path').should('have.length', 1);
            cy.wrap(edge).find('path').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('path').should('have.attr', 'fill', 'none');
            cy.wrap(edge).find('path').should('have.attr', 'stroke-width', '2');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', '#000000');
            cy.wrap(edge).find('polygon').should('have.attr', 'stroke', '#000000');
            break;
          case 'tapered':
            cy.wrap(edge).find('polygon').should('have.length', 2);
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', '#000000');
            cy.wrap(edge).find('polygon').should('not.have.attr', 'stroke-dasharray');
            cy.wrap(edge).find('polygon').should('have.attr', 'fill', '#000000');
            cy.wrap(edge).find('polygon').should('not.have', 'stroke-width');
            cy.wrap(edge).find('polygon').eq(0).should('have.attr', 'stroke', 'transparent');
            cy.wrap(edge).find('polygon').eq(1).should('have.attr', 'stroke', '#000000');
            break;
          }
        });
      } else {
        cy.style('invis').click();
      }
      cy.edges().should('have.length', numberOfVisibleEdges);
    });
  })

})
