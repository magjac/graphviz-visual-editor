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

  it('The line with the DOT source error is scrolled into view when the error icon in the text edtitor is clicked', function() {
    cy.startCleanApplication();

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);

    cy.textEditorGutterCellWithError().should('not.exist');

    const num_blank_rows = 48;
    const textEditorContent = cy.textEditorContent();
    let text = '{leftArrow}{enter}'
    for (let row = 0; row < num_blank_rows; row++) {
      text += '{enter}';
    }
    text += '-';
    textEditorContent.type(text);

    cy.textEditorGutterCells().should('to.have.length.of.at.least', 41);
    cy.textEditorGutterCells().should('to.have.length.of.at.most', 49);

    cy.textEditorVisibleLines().should('to.have.length.of.at.least', 41);
    cy.textEditorVisibleLines().should('to.have.length.of.at.most', 49);

    cy.textEditorGutterCellWithError().should('exist');

    text = "";
    for (let row = 1; row < num_blank_rows; row++) {
      text += '{upArrow}';
    }
    cy.textEditorContent().type(text);

    cy.textEditorGutterCellWithError().should('not.exist');

    cy.textEditorErrorButton().click();

    cy.textEditorGutterCellWithError().should('exist');

  })

  it('A DOT source error is indicated with an error marker in the gutter even if the auxillary DOT parser fails to detect them', function() {
    localStorage.setItem('test', JSON.stringify(
      {
        'disableDotParsing': true,
      }
    ));

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
    cy.textEditorTooltip().should('have.text', "syntax error in line 2 near '-'\n");

  })

  it('A graph is not rendered after typing in the text editor until after the hold-off time specified in settings', function() {

    cy.startCleanApplication();

    cy.settingsButton().click();
    cy.holdOffTimeInput().should('have.value', '0.2');
    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findNode(1).should('not.exist')
      let start;
      cy.textEditorContent().type('{leftArrow}{enter}Alice').then(() => {
        start = Date.now();
      });
      cy.wrap(graph0).findNode(1).then(node => {
        const stop = Date.now();
        const actualHoldOffTime = stop - start;
        expect(actualHoldOffTime).to.be.at.least(100);
        expect(actualHoldOffTime).to.be.lessThan(1200);
      });
    });

    cy.settingsButton().click();
    cy.holdOffTimeInput().should('have.value', '0.2');
    cy.holdOffTimeInput().type('{backspace}{backspace}{backspace}5');
    cy.holdOffTimeInput().should('have.value', '5');
    cy.get('body').type('{esc}', { release: false });

    cy.clearDotSource();
    cy.insertDotSource('digraph {}');

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findNode(1).should('not.exist')
      let start;
      cy.textEditorContent().type('{leftArrow}{enter}Alice').then(() => {
        start = Date.now();
      });
      cy.wrap(graph0).findNode(1).then(node => {
        const stop = Date.now();
        const actualHoldOffTime = stop - start;
        expect(actualHoldOffTime).to.be.at.least(4900);
        expect(actualHoldOffTime).to.be.lessThan(6000);
      });
    });

  })

})
