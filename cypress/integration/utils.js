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
