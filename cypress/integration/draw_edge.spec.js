import { startApplication } from './utils';
import { clearAndRender } from './utils';
import { waitForTransition } from './utils';

describe('Draw edges in the graph', function() {

  it('Draws an edge from a node to another node when the right mouse button is clicked on the source node and then the left mouse button double-clicked on the destination node', function() {
    startApplication();
    clearAndRender('digraph {{}Alice Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('not.exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 0);

    cy.get('#graph0 > #node1').trigger('contextmenu');
    cy.get('#graph0 > #edge1').should('exist');
    cy.get('#graph0 > #node2').trigger('mousemove');
    cy.get('#graph0 > #node2').dblclick();
    waitForTransition();

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 1);
  })

  it('Draws edges in both directions between two nodes', function() {
    startApplication();
    clearAndRender('digraph {{}Alice Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('not.exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 0);

    cy.get('#graph0 > #node1').trigger('contextmenu');
    cy.get('#graph0 > #edge1').should('exist');
    cy.get('#graph0 > #node2').trigger('mousemove');
    cy.get('#graph0 > #node2').dblclick();
    waitForTransition();

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 1);

    cy.get('#graph0 > #node2').trigger('contextmenu');
    cy.get('#graph0 > #edge2').should('exist');
    cy.get('#graph0 > #node1').trigger('mousemove');
    cy.get('#graph0 > #node1').dblclick();
    waitForTransition();

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');
    cy.get('#graph0 > #edge2').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');
    cy.get('#graph0 > #edge2 > title').should('have.text', 'Bob->Alice');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 2);
})

})
