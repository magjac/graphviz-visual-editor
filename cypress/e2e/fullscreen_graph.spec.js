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

    cy.textEditorWrapper().should('exist');
    cy.toolbar().should('exist');
    cy.canvas().invoke('width').should('be.lt', viewportWidth / 2)

    cy.fullscreenButton().click();

    cy.textEditorWrapper().should('not.exist');
    cy.toolbar().should('not.exist');
    cy.canvas().invoke('width').should('be.eq', viewportWidth)

    cy.fullscreenButton().click();

    cy.textEditorWrapper().should('exist');
    cy.toolbar().should('exist');
    cy.canvas().invoke('width').should('be.lt', viewportWidth / 2)
  });
});
