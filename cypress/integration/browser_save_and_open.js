describe('Browser save and open', function() {

  it('The current graph is automatically stored in browser local storage', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 1);
    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

  it('The graph is saved to browser local storage when the save as button is clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);
    cy.savedGraphName(1).should('have.text', 'My graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

  it('The graph is loaded from a saved graph in browser local storage when to open button is clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);
    cy.savedGraphName(1).should('have.text', 'My graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.clearAndRender('digraph {Charlie -> Daphne -> Ernie}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Charlie');
    cy.node(2).shouldHaveName('Daphne');
    cy.node(3).shouldHaveName('Ernie');
    cy.edge(1).shouldHaveName('Charlie->Daphne');
    cy.edge(2).shouldHaveName('Daphne->Ernie');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 2);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.savedGraphName(1).click();
    cy.openGraphOpenButton().click();

    cy.openFromBrowserDialog().should('not.exist');

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

  it('A graph saved in browser local storage is deleted when the delete icon is clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);
    cy.savedGraphName(1).should('have.text', 'My graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.clearAndRender('digraph {Charlie -> Daphne -> Ernie}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Charlie');
    cy.node(2).shouldHaveName('Daphne');
    cy.node(3).shouldHaveName('Ernie');
    cy.edge(1).shouldHaveName('Charlie->Daphne');
    cy.edge(2).shouldHaveName('Daphne->Ernie');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 2);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.savedGraphDeleteButton(1).click();

    cy.deleteGraphDialog().should('exist');

    cy.deleteGraphDeleteButton().click();

    cy.deleteGraphDialog().should('not.exist');

    cy.savedGraphs().should('have.length', 1);

    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Charlie');
    cy.node(2).shouldHaveName('Daphne');
    cy.node(3).shouldHaveName('Ernie');
    cy.edge(1).shouldHaveName('Charlie->Daphne');
    cy.edge(2).shouldHaveName('Daphne->Ernie');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 2);

    cy.savedGraphDeleteButton(0).click();

    cy.deleteGraphDialog().should('exist');

    cy.deleteGraphDeleteButton().click();

    cy.deleteGraphDialog().should('not.exist');

    cy.savedGraphs().should('have.length', 0);

    cy.canvasSvg().should('not.exist');
  })

})
