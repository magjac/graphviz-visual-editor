describe('Text editor', function() {

  it('A graph is rendered when DOT source code is typed in the text editor', function() {
    cy.startCleanApplication();
    cy.textEditorContent().type('{leftArrow}{enter}Alice -> Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);
  })

  it('The previous graph is rendered when a DOT source code change is undone with Ctrl-Z', function() {
    cy.startCleanApplication();
    cy.textEditorContent().type('{leftArrow}{enter}Alice');

    cy.nodes().should('have.length', 1);
    cy.edges().should('have.length', 0);

    cy.node(1).should('exist');

    cy.node(1).shouldHaveName('Alice');

    cy.textEditorContent().type('{ctrl}z');
    cy.waitForTransition();

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);
  })

  it('The graph is re-rendered when an undone DOT source code change is redone with Ctrl-Y', function() {
    cy.startCleanApplication();
    cy.textEditorContent().type('{leftArrow}{enter}Alice');

    cy.nodes().should('have.length', 1);
    cy.edges().should('have.length', 0);

    cy.node(1).should('exist');

    cy.node(1).shouldHaveName('Alice');

    cy.textEditorContent().type('{ctrl}z');
    cy.waitForTransition();

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);

    cy.textEditorContent().type('{ctrl}y');
    cy.waitForTransition();

    cy.nodes().should('have.length', 1);
    cy.edges().should('have.length', 0);

    cy.node(1).should('exist');

    cy.node(1).shouldHaveName('Alice');

  })

  it('A DOT source error is indicated with an error marker in the gutter', function() {
    cy.startCleanApplication();

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);

    cy.textEditorContent().type('{leftArrow}{enter}-');

    cy.textEditorContent().type('{enter}');

    cy.textEditorGutterCells().should('have.length', 4);

    cy.textEditorGutterCells().eq(0).should('not.have.class', 'ace_error');
    cy.textEditorGutterCells().eq(1).should('have.class', 'ace_error');
    cy.textEditorGutterCells().eq(2).should('not.have.class', 'ace_error');
    cy.textEditorGutterCells().eq(3).should('not.have.class', 'ace_error');

    cy.textEditorTooltip().should('not.exist');

    cy.textEditorGutter().trigger('mousemove', 40 * 0.5, 12 * 1.5);

    cy.textEditorTooltip().should('exist');
    cy.textEditorTooltip().should('have.text', 'Expected "<", "\\"", "edge", "graph", "node", "subgraph", "{", "}", NUMBER or UNICODE_STRING but "-" found.');
  })

})
