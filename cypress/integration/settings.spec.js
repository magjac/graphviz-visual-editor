describe('Settings', function() {

  it('The main menu item Settings opens the settings dialog', function() {
    cy.startCleanApplication();

    cy.menuButton().click();
    cy.menuItemSettings().click()

    cy.settingsDialog().should('exist');

    cy.get('body').type('{esc}', { release: false });

    cy.settingsDialog().should('not.exist');

  })

})
