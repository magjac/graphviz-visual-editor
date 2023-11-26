describe('GitHub link', function() {

  it('The GiHub repository is opened in a new tab when the GitHub button is clicked', function() {
    cy.startCleanApplication({
      onBeforeLoad(win) {
        cy.stub(win, 'open')
      }
    });

    /* We can't test that it actually opens, so we just check that
     * the link is correct */
    cy.gitHubButton().should('have.prop', 'href', 'https://github.com/magjac/graphviz-visual-editor');

  })

})
