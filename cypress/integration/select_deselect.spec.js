import { clearAndRender } from './utils';

describe('Selection and deselection in graph', function() {

  it('Selects a node when clicked', function() {
    cy.visit('http://localhost:3000/');
    clearAndRender('digraph {{}Alice -> Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('#graph0 > #node1').click();

    cy.get('#graph0 > #node1 > rect').should('exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');
  })

  it('Deselects a selected node when the graph is clicked', function() {
    cy.visit('http://localhost:3000/');
    clearAndRender('digraph {{}Alice -> Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('#graph0 > #node1').click();

    cy.get('#graph0 > #node1 > rect').should('exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('#graph0').click('topLeft');

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');
  })

  it('Deselects a selected node when another node is clicked and selects that node instead', function() {
    cy.visit('http://localhost:3000/');
    clearAndRender('digraph {{}Alice -> Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('#graph0 > #node1').click();

    cy.get('#graph0 > #node1 > rect').should('exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('#graph0 > #node2').click();

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');
  })

  it('Extends selection when another node is shift-clicked', function() {
    cy.visit('http://localhost:3000/');
    clearAndRender('digraph {{}Alice -> Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('#graph0 > #node1').click();

    cy.get('#graph0 > #node1 > rect').should('exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('body').type('{shift}', { release: false })
      .get('#graph0 > #node2').click();

    cy.get('#graph0 > #node1 > rect').should('exist');
    cy.get('#graph0 > #node2 > rect').should('exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');
  })

  it('Extends selection when another node is ctrl-clicked', function() {
    cy.visit('http://localhost:3000/');
    clearAndRender('digraph {{}Alice -> Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('#graph0 > #node1').click();

    cy.get('#graph0 > #node1 > rect').should('exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('body').type('{ctrl}', { release: false })
      .get('#graph0 > #node2').click();

    cy.get('#graph0 > #node1 > rect').should('exist');
    cy.get('#graph0 > #node2 > rect').should('exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');
  })

  it('Selects an edge when clicked', function() {
    cy.visit('http://localhost:3000/');
    clearAndRender('digraph {{}Alice -> Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('#graph0 > #edge1').click();

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('exist');
  })

  it('Deselects a selected edge when the graph is clicked', function() {
    cy.visit('http://localhost:3000/');
    clearAndRender('digraph {{}Alice -> Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('#graph0 > #edge1').click();

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('exist');

    cy.get('#graph0').click('topLeft');

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');
  })

  it('Deselects a selected edge when a node is clicked and selects that node instead', function() {
    cy.visit('http://localhost:3000/');
    clearAndRender('digraph {{}Alice -> Bob}');

    cy.get('#graph0 > #node1').should('exist');
    cy.get('#graph0 > #node2').should('exist');
    cy.get('#graph0 > #edge1').should('exist');

    cy.get('#graph0 > #node1 > title').should('have.text', 'Alice');
    cy.get('#graph0 > #node2 > title').should('have.text', 'Bob');
    cy.get('#graph0 > #edge1 > title').should('have.text', 'Alice->Bob');

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');

    cy.get('#graph0 > #edge1').click();

    cy.get('#graph0 > #node1 > rect').should('not.exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('exist');

    cy.get('#graph0 > #node1').click();

    cy.get('#graph0 > #node1 > rect').should('exist');
    cy.get('#graph0 > #node2 > rect').should('not.exist');
    cy.get('#graph0 > #edge1 > rect').should('not.exist');
  })

})
