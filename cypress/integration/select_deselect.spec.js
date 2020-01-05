describe('Selection and deselection in graph', function() {

  it('Selects a node when clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.node(1).click();

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();
  })

  it('Deselects a selected node when the graph is clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.node(1).click();

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.get('#graph0').click('topLeft');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();
  })

  it('Deselects a selected node when the graph is right-clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.node(1).click();

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.get('#graph0').trigger('contextmenu', 'topLeft');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();
  })

  it('Deselects a selected node when another node is clicked and selects that node instead', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.node(1).click();

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.node(2).click();

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldBeSelected();
    cy.edge(1).shouldNotBeSelected();
  })

  it('Deselects a selected node when ESC is pressed', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.node(1).click();

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.get('body').type('{esc}', { release: false });

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();
  })

  it('Extends selection when another node is shift-clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.node(1).click();

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.get('body').type('{shift}', { release: false })
      .node(2).click();

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldBeSelected();
    cy.edge(1).shouldNotBeSelected();
  })

  it('Extends selection when another node is ctrl-clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.node(1).click();

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.get('body').type('{ctrl}', { release: false })
      .node(2).click();

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldBeSelected();
    cy.edge(1).shouldNotBeSelected();
  })

  it('Keeps selection when the graph is shift-clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.node(1).click();

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.get('#graph0')
      .trigger('click', 'topLeft', {which: 1, shiftKey: true});

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.get('#graph0')
      .trigger('click', 'topLeft', {which: 1, shiftKey: false});

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

  })

  it('Keeps selection when the graph is ctrl-clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.node(1).click();

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.get('#graph0')
      .trigger('click', 'topLeft', {which: 1, ctrlKey: true});

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.get('#graph0')
      .trigger('click', 'topLeft', {which: 1, ctrlKey: false});

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

  })

  it('Selects an edge when clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.edge(1).click();

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldBeSelected();
  })

  it('Deselects a selected edge when the graph is clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.edge(1).click();

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldBeSelected();

    cy.get('#graph0').click('topLeft');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();
  })

  it('Deselects a selected edge when another edge is clicked and selects that edge instead', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob -> Alice}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');
    cy.edge(2).shouldHaveName('Bob->Alice');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();
    cy.edge(2).shouldNotBeSelected();

    cy.edge(1).click();

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldBeSelected();
    cy.edge(2).shouldNotBeSelected();

    cy.edge(2).click();

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();
    cy.edge(2).shouldBeSelected();
  })

  it('Extends selection when another edge is shift-clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob -> Alice}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');
    cy.edge(2).shouldHaveName('Bob->Alice');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();
    cy.edge(2).shouldNotBeSelected();

    cy.edge(1).click();

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldBeSelected();
    cy.edge(2).shouldNotBeSelected();

    cy.get('body').type('{shift}', { release: false })
      .edge(2).click();

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldBeSelected();
    cy.edge(2).shouldBeSelected();
  })

  it('Extends selection when another edge is ctrl-clicked', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob -> Alice}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');
    cy.edge(2).shouldHaveName('Bob->Alice');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();
    cy.edge(2).shouldNotBeSelected();

    cy.edge(1).click();

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldBeSelected();
    cy.edge(2).shouldNotBeSelected();

    cy.get('body').type('{ctrl}', { release: false })
      .edge(2).click();

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldBeSelected();
    cy.edge(2).shouldBeSelected();
  })

  it('Selects nodes and edges by dragging the canvas', function() {
    cy.startApplication();
    cy.clearAndRender('digraph { Eve -> Alice; Eve -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Eve');
    cy.node(2).shouldHaveName('Alice');
    cy.node(3).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Eve->Alice');
    cy.edge(2).shouldHaveName('Eve->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.node(3).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();
    cy.edge(2).shouldNotBeSelected();

    cy.get('#graph0')
      .trigger('mousedown', 'bottomLeft', {which: 1})
      .trigger('mousemove', 'top', {which: 1})
      .trigger('click', 'top', {which: 1})

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldBeSelected();
    cy.node(3).shouldNotBeSelected();
    cy.edge(1).shouldBeSelected();
    cy.edge(2).shouldNotBeSelected();

  })

  it('Extends nodes and edges selection by shift-dragging the canvas', function() {
    cy.startApplication();
    cy.clearAndRender('digraph { Eve -> Alice; Eve -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Eve');
    cy.node(2).shouldHaveName('Alice');
    cy.node(3).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Eve->Alice');
    cy.edge(2).shouldHaveName('Eve->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.node(3).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();
    cy.edge(2).shouldNotBeSelected();

    cy.get('#graph0')
      .trigger('mousedown', 'bottomLeft', {which: 1})
      .trigger('mousemove', 'top', {which: 1})
      .trigger('click', 'top', {which: 1});

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldBeSelected();
    cy.node(3).shouldNotBeSelected();
    cy.edge(1).shouldBeSelected();
    cy.edge(2).shouldNotBeSelected();

    cy.get('#graph0')
      .trigger('mousedown', 'bottomRight', {which: 1, shiftKey: true})
      .trigger('mousemove', 'top', {which: 1, shiftKey: true})
      .trigger('click', 'top', {which: 1, shiftKey: true});

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldBeSelected();
    cy.node(3).shouldBeSelected();
    cy.edge(1).shouldBeSelected();
    cy.edge(2).shouldBeSelected();

  })

  it('Selects all nodes and edges when Ctrl-A is pressed', function() {
    cy.startApplication();
    cy.clearAndRender('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.node(1).shouldNotBeSelected();
    cy.node(2).shouldNotBeSelected();
    cy.edge(1).shouldNotBeSelected();

    cy.get('#graph0').click();
    cy.get('body').type('{ctrl}a');

    cy.node(1).shouldBeSelected();
    cy.node(2).shouldBeSelected();
    cy.edge(1).shouldBeSelected();
  })

})
