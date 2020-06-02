describe('Export as SVG', function() {

  it('The DOT source is exported as an SVG through the menu alternative Export As SVG', function() {

    cy.exec('echo ${HOME}').then((result) => {
      cy.log(result.stdout);
      const home = result.stdout;
      const filename = home + '/Downloads/Untitled Graph.svg';
      cy.log(filename);
      cy.exec('rm -v -f "' + filename + '"').then((result) => {
        cy.log(result.stdout);
      });
    });

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

    cy.menuButton().click();

    cy.menuItemExportAsSvg().click();

    cy.exportGraphAsSvgDialog().should('exist');

    cy.exportGraphAsSvgFilenameInput().should('have.value', 'Untitled Graph.svg');

    cy.exportGraphAsSvgExportSvgButton().click();

    cy.exportGraphAsSvgDialog().should('not.exist');


    cy.exec('echo ${HOME}').then((result) => {
      cy.log(result.stdout);
      const home = result.stdout;
      cy.readFile(home + '/Downloads/Untitled Graph.svg');
    });

  })

})
