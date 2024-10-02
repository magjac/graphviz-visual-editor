describe('Show graph only mode', function () {

  const viewportWidth = Cypress.config('viewportWidth');

  it('Shows the graph only when the open in full button is clicked and shows the full application when it\'s clicked again', function () {
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

    cy.textEditorWrapper().should('be.visible');
    cy.toolbar().should('exist');
    cy.canvas().invoke('width').should('be.lt', viewportWidth / 2)

    cy.fullscreenButton().click();

    cy.textEditorWrapper().should('not.be.visible');
    cy.toolbar().should('not.exist');
    cy.canvas().invoke('width').should('be.eq', viewportWidth)

    cy.fullscreenButton().click();

    cy.textEditorWrapper().should('be.visible');
    cy.toolbar().should('exist');
    cy.canvas().invoke('width').should('be.lt', viewportWidth / 2)
  });

  it('Shows the graph only when the \'f\' key is pressed and shows the full application when it\'s pressed again', function () {
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

    cy.textEditorWrapper().should('be.visible');
    cy.toolbar().should('exist');
    cy.canvas().invoke('width').should('be.lt', viewportWidth / 2)

    cy.canvas().click();
    cy.get('body').type('f');

    cy.textEditorWrapper().should('not.be.visible');
    cy.toolbar().should('not.exist');
    cy.canvas().invoke('width').should('be.eq', viewportWidth)

    cy.get('body').type('f');

    cy.textEditorWrapper().should('be.visible');
    cy.toolbar().should('exist');
    cy.canvas().invoke('width').should('be.lt', viewportWidth / 2)
  });

  it('Shows the graph only when the open in full button is clicked and shows the full application again when the \'f\' key is pressed', function () {
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

    cy.textEditorWrapper().should('be.visible');
    cy.toolbar().should('exist');
    cy.canvas().invoke('width').should('be.lt', viewportWidth / 2)

    cy.canvas().click();
    cy.fullscreenButton().click();

    cy.textEditorWrapper().should('not.be.visible');
    cy.toolbar().should('not.exist');
    cy.canvas().invoke('width').should('be.eq', viewportWidth)

    cy.get('body').type('f');

    cy.textEditorWrapper().should('be.visible');
    cy.toolbar().should('exist');
    cy.canvas().invoke('width').should('be.lt', viewportWidth / 2)
  });

  it('Shows the graph only when the \'f\' key is pressed after a previous fullscreen has been disabled by clicking the open in full button', function () {
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

    cy.textEditorWrapper().should('be.visible');
    cy.toolbar().should('exist');
    cy.canvas().invoke('width').should('be.lt', viewportWidth / 2)

    cy.canvas().click();
    cy.get('body').type('f');

    cy.textEditorWrapper().should('not.be.visible');
    cy.toolbar().should('not.exist');
    cy.canvas().invoke('width').should('be.eq', viewportWidth)

    cy.fullscreenButton().click();

    cy.textEditorWrapper().should('be.visible');
    cy.toolbar().should('exist');
    cy.canvas().invoke('width').should('be.lt', viewportWidth / 2)

    cy.get('body').type('f');

    cy.textEditorWrapper().should('not.be.visible');
    cy.toolbar().should('not.exist');
    cy.canvas().invoke('width').should('be.eq', viewportWidth)
  });
});
