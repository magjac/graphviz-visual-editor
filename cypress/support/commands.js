Cypress.Commands.add("startApplication", () => {
  cy.visit('http://localhost:3000/');
  cy.checkDefaultGraph();
});

Cypress.Commands.add("node", (index) => {
  return cy.get('#canvas #graph0 > #node' + index);
});

Cypress.Commands.add("edge", (index) => {
  return cy.get('#canvas #graph0 > #edge' + index);
});

Cypress.Commands.add("nodes", () => {
  return cy.get('#canvas #graph0 > .node');
});

Cypress.Commands.add("edges", () => {
  return cy.get('#canvas #graph0 > .edge');
});

Cypress.Commands.add("toolbarButton", (buttonName) => {
  return cy.get('#toolbar').contains(buttonName);
});

Cypress.Commands.add("openButton", () => {
  return cy.get('#toolbar').find('#open');
});

Cypress.Commands.add("openFromBrowserDialog", () => {
  return cy.get('#open-from-browser-dialog');
});

Cypress.Commands.add("savedGraphs", () => {
  return cy.openFromBrowserDialog().find('tbody').find('tr');
});

Cypress.Commands.add("savedGraph", (index) => {
  return cy.savedGraphs().eq(index);
});

Cypress.Commands.add("savedGraphName", (index) => {
  return cy.savedGraphs().eq(index).find('th');
});

Cypress.Commands.add("savedGraphDotSource", (index) => {
  return cy.savedGraphs().eq(index).find('td').eq(0);
});

Cypress.Commands.add("savedGraphTime", (index) => {
  return cy.savedGraphs().eq(index).find('td').eq(1);
});

Cypress.Commands.add("savedGraphPreview", (index) => {
  return cy.savedGraphs().eq(index).find('td').eq(2);
});

Cypress.Commands.add("saveAsButton", () => {
  return cy.get('#toolbar').find('#save-as');
});

Cypress.Commands.add("saveToBrowserDialog", () => {
  return cy.get('#save-to-browser-dialog');
});

Cypress.Commands.add("saveToBrowserNameInput", () => {
  return cy.saveToBrowserDialog().find('#name');
});

Cypress.Commands.add("saveToBrowserSaveButton", () => {
  return cy.saveToBrowserDialog().find('#save');
});

Cypress.Commands.add("insertPanels", () => {
  return cy.get('#insert-panels');
});

Cypress.Commands.add("nodeShapeCategory", (nodeShapeCategoryName) => {
  return cy.insertPanels().contains(nodeShapeCategoryName);
});

Cypress.Commands.add("styleSwitch", () => {
  return cy.formatDrawer().find('#style-switch');
});

Cypress.Commands.add("styles", () => {
  return cy.formatDrawer().find('#styles');
});

Cypress.Commands.add("style", (styleName) => {
  return cy.styles().find('#' + styleName);
});

Cypress.Commands.add("zoomInButton", () => {
  return cy.get('#toolbar').find('#zoom-in');
});

Cypress.Commands.add("zoomOutButton", () => {
  return cy.get('#toolbar').find('#zoom-out');
});

Cypress.Commands.add("zoomOutMapButton", () => {
  return cy.get('#toolbar').find('#zoom-out-map');
});

Cypress.Commands.add("zoomResetButton", () => {
  return cy.get('#toolbar').find('#zoom-reset');
});

Cypress.Commands.add("shouldHaveName", {prevSubject: true}, (subject, label) => {
  cy.wrap(subject).find('title').should('have.text', label);
});

Cypress.Commands.add("shouldHaveLabel", {prevSubject: true}, (subject, label) => {
  cy.wrap(subject).find('text').should('have.text', label);
});

Cypress.Commands.add("shouldBeSelected", {prevSubject: true}, (subject) => {
  cy.wrap(subject).within(() => {
    cy.get('rect').should('exist');
  });
});

Cypress.Commands.add("shouldNotBeSelected", {prevSubject: true}, (subject) => {
  cy.wrap(subject).within(() => {
    cy.get('rect').should('not.exist');
  });
});

Cypress.Commands.add("checkDefaultGraph", () => {
  cy.node(1).should('exist');
  cy.node(2).should('exist');
  cy.edge(1).should('exist');

  cy.node(1).shouldHaveLabel('a');
  cy.node(2).shouldHaveLabel('b');

  cy.node(1).shouldHaveName('a');
  cy.node(2).shouldHaveName('b');
  cy.edge(1).shouldHaveName('a->b');

  cy.nodes().should('have.length', 2);
  cy.edges().should('have.length', 1);
});

Cypress.Commands.add("waitForBusy", () => {
  cy.get('#busy-indicator').should('exist');
});

Cypress.Commands.add("waitForNotBusy", () => {
  cy.get('#busy-indicator').should('not.exist');
});

Cypress.Commands.add("waitForTransition", () => {
  cy.waitForBusy();
  cy.waitForNotBusy();
});

Cypress.Commands.add("clearAndRender", (dotSrc) => {
  cy.get('.ace_text-input').type('{ctrl}a{del}', {force: true});
  cy.get('.ace_text-input').type(dotSrc.replace(/{/g, '{{}'), {force: true});
  cy.waitForTransition();
});
