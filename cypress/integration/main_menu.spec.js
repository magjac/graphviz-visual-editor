describe('Settings', function() {

  it('The main menu is opened by clicking the menu button', function() {

    const menuItems = [
      'New',
      'Open from browser',
      'Save as to browser',
      'Rename',
      'Export as URL',
      'Export as SVG',
      'Settings',
    ];

    cy.startCleanApplication();

    cy.menuButton().click();

    cy.mainMenu().should('exist');
    cy.mainMenu().should('have.text', menuItems.join(''));

    cy.get('body').type('{esc}', { release: false });

    cy.mainMenu().should('not.exist');

  })

})
