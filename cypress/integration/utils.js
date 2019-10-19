export function startApplication() {
  cy.visit('http://localhost:3000/');
  checkDefaultGraph();
}

export function checkDefaultGraph() {
    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > text').should('have.text', 'a');
    cy.get('#graph0 > #node2 > text').should('have.text', 'b');

    cy.get('#graph0 > #node1 > title').should('have.text', 'a');
    cy.get('#graph0 > #node2 > title').should('have.text', 'b');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'a->b');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 1);
}

export function waitForBusy() {
  cy.get('#busy-indicator').should('exist');
}

export function waitForNotBusy() {
  cy.get('#busy-indicator').should('not.exist');
}

export function waitForTransition() {
  waitForBusy();
  waitForNotBusy();
}

export function clearAndRender(dotSrc) {
  cy.get('.ace_text-input').type('{ctrl}a{del}', {force: true});
  cy.get('.ace_text-input').type(dotSrc, {force: true});
  waitForTransition();
}
