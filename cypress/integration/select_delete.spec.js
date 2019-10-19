import { startApplication } from './utils';
import { clearAndRender } from './utils';
import { waitForTransition } from './utils';

describe('Selection and deletion in graph', function() {

  it('Selects a node and deletes it and the edge connected to it', function() {
    startApplication();
    clearAndRender('digraph {{}Alice -> Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 1);

    cy.get('#graph0 > #node1').click();
    cy.get('body').type('{del}');
    waitForTransition();

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('not.exist');
    cy.get('#graph0 > #edge1').should('not.exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Bob');

    cy.get('#graph0 > .node').should('have.length', 1);
    cy.get('#graph0 > .edge').should('have.length', 0);
  })

  it('Selects an edge and deletes it', function() {
    startApplication();
    clearAndRender('digraph {{}Alice -> Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 1);

    cy.get('#graph0 > #edge1').click();
    cy.get('body').type('{del}');
    waitForTransition();

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('not.exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 0);
  })

  it('Selects a node, adds another node to the selection and deletes them and the connected edge', function() {
    startApplication();
    clearAndRender('digraph {{}Alice -> Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > .node').should('have.length', 2);
    cy.get('#graph0 > .edge').should('have.length', 1);

    cy.get('#graph0 > #node1').click();
    cy.get('body').type('{shift}', { release: false })
      .get('#graph0 > #node2').click();
    cy.get('body').type('{del}');
    waitForTransition();

    cy.get('#graph0 > #node1').should('not.exist');
    cy.get('#graph0 > #node2').should('not.exist');
    cy.get('#graph0 > #edge1').should('not.exist');

    cy.get('#graph0 > .node').should('have.length', 0);
    cy.get('#graph0 > .edge').should('have.length', 0);
  })

})
