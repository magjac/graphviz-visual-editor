describe('Help menu', function() {

  it('A keybboard shortcuts help dialog is shown when keyboard shortcuts is clicked in the help menu', function() {
    cy.startCleanApplication();
    cy.helpButton().click();
    cy.helpMenuItemKeyboardShortcuts().click();
    cy.keyboardShortcutsDialog().should('exist');
    cy.keyboardShortcutsTableRows().should('have.length.of.at.least', 10);
    cy.keyboardShortcutsDialogCloseButton().click();
    cy.keyboardShortcutsDialog().should('not.exist');
  })

  it('A mouse operations help dialog is shown when mouse operations is clicked in the help menu', function() {
    cy.startCleanApplication();
    cy.helpButton().click();
    cy.helpMenuItemMouseOperations().click();
    cy.mouseOperationsDialog().should('exist');
    cy.mouseOperationsTableRows().should('have.length.of.at.least', 12);
    cy.mouseOperationsDialogCloseButton().click();
    cy.mouseOperationsDialog().should('not.exist');
  })

})
