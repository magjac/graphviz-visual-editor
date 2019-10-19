import { clearAndRender } from './utils';
import { waitForTransition } from './utils';

describe('Insertion of nodes into the graph', function() {

  it('Inserts a node when middle mouse button is clicked', function() {
    cy.visit('http://localhost:3000/');
    clearAndRender('digraph {{}Alice -> Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 1);

    cy.get('#graph0').trigger('mousedown', 'topLeft', {which: 2});
    cy.get('#graph0').trigger('mouseup', 'topLeft', {which: 2});
    waitForTransition();

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #node3').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #node3 > title').should('have.text', 'n2');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > .node').should('have.length', 3);
    cy.get('#graph0 > .edge').should('have.length', 1);
  })

})
