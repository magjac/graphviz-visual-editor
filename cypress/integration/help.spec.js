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

})
