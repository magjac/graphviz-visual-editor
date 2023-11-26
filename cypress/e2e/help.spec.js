describe('Help menu', function() {

  it('A keyboard shortcuts help dialog is shown when keyboard shortcuts is clicked in the help menu', function() {
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

  it('An about dialog is shown when about is clicked in the help menu', function() {
    cy.startCleanApplication();
    cy.helpButton().click();
    cy.helpMenuItemAbout().click();
    cy.aboutDialog().should('exist');
    cy.aboutDialogParagraphs().should('have.length.of.at.least', 4);
    cy.aboutDialogCloseButton().click();
    cy.aboutDialog().should('not.exist');
  })

  it('The help menu is closed when ESC is pressed', function() {
    cy.startCleanApplication();
    cy.helpButton().click();
    cy.helpMenu().should('exist');
    cy.helpMenu().type('{esc}');
    cy.helpMenu().should('not.exist');
  })

  it('The help menu is closed when clicking outside the help menu', function() {
    cy.startCleanApplication();
    cy.helpButton().click();
    cy.helpMenu().should('exist');
    cy.helpMenuBackdrop().click();
    cy.helpMenu().should('not.exist');
  })

})
