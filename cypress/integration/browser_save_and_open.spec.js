describe('Browser save and open', function() {

  it('The current graph is automatically stored in browser local storage', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 1);
    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

  it('Graphs stored in browser local storage are retrieved when application starts', function() {
    localStorage.setItem('projects', '{"Untitled Graph":{"dotSrc":"digraph {Alice -> Bob}","dotSrcLastChangeTime":' + (Date.now() - 60 * 1000) + ',"svg":"<svg width=\\"936\\" height=\\"333\\" viewBox=\\"0.00 0.00 71.90 116.00\\" xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\">\\n<g id=\\"graph0\\" class=\\"graph\\" transform=\\"translate(4.001399040222168, 112)\\">\\n<title>%0</title>\\n<polygon fill=\\"#ffffff\\" stroke=\\"transparent\\" points=\\"-4,4 -4,-112 67.8972,-112 67.8972,4 -4,4\\"/>\\n<!-- Alice -->\\n<g id=\\"node1\\" class=\\"node\\">\\n<title>Alice</title>\\n<ellipse fill=\\"none\\" stroke=\\"#000000\\" cx=\\"31.9486\\" cy=\\"-90\\" rx=\\"31.8973\\" ry=\\"18\\"/>\\n<text text-anchor=\\"middle\\" x=\\"31.9486\\" y=\\"-85.8\\" font-family=\\"Times,serif\\" font-size=\\"14.00\\" fill=\\"#000000\\">Alice</text>\\n</g>\\n<!-- bob -->\\n<g id=\\"node2\\" class=\\"node\\">\\n<title>Bob</title>\\n<ellipse fill=\\"none\\" stroke=\\"#000000\\" cx=\\"31.9486\\" cy=\\"-18\\" rx=\\"27.268\\" ry=\\"18\\"/>\\n<text text-anchor=\\"middle\\" x=\\"31.9486\\" y=\\"-13.8\\" font-family=\\"Times,serif\\" font-size=\\"14.00\\" fill=\\"#000000\\">Bob</text>\\n</g>\\n<!-- Alice&#45;&gt;bob -->\\n<g id=\\"edge1\\" class=\\"edge\\">\\n<title>Alice-&gt;Bob</title>\\n<path fill=\\"none\\" stroke=\\"#000000\\" d=\\"M31.9486,-71.8314C31.9486,-64.131 31.9486,-54.9743 31.9486,-46.4166\\"/>\\n<polygon fill=\\"#000000\\" stroke=\\"#000000\\" points=\\"35.4487,-46.4132 31.9486,-36.4133 28.4487,-46.4133 35.4487,-46.4132\\"/>\\n</g>\\n</g>\\n</svg>"}}');
    localStorage.setItem('name', 'My graph');
    localStorage.setItem('dotSrc', 'digraph {Alice -> Bob -> Charlie}');
    localStorage.setItem('dotSrcLastChangeTime', Date.now().toString());
    localStorage.setItem('svg', '<svg width=\\"936\\" height=\\"333\\" viewBox=\\"0.00 0.00 71.90 116.00\\" xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\">\\n<g id=\\"graph0\\" class=\\"graph\\" transform=\\"translate(4.001399040222168, 112)\\">\\n<title>%0</title>\\n<polygon fill=\\"#ffffff\\" stroke=\\"transparent\\" points=\\"-4,4 -4,-112 67.8972,-112 67.8972,4 -4,4\\"/>\\n<!-- Alice -->\\n<g id=\\"node1\\" class=\\"node\\">\\n<title>Alice</title>\\n<ellipse fill=\\"none\\" stroke=\\"#000000\\" cx=\\"31.9486\\" cy=\\"-90\\" rx=\\"31.8973\\" ry=\\"18\\"/>\\n<text text-anchor=\\"middle\\" x=\\"31.9486\\" y=\\"-85.8\\" font-family=\\"Times,serif\\" font-size=\\"14.00\\" fill=\\"#000000\\">Alice</text>\\n</g>\\n<!-- bob -->\\n<g id=\\"node2\\" class=\\"node\\">\\n<title>Bob</title>\\n<ellipse fill=\\"none\\" stroke=\\"#000000\\" cx=\\"31.9486\\" cy=\\"-18\\" rx=\\"27.268\\" ry=\\"18\\"/>\\n<text text-anchor=\\"middle\\" x=\\"31.9486\\" y=\\"-13.8\\" font-family=\\"Times,serif\\" font-size=\\"14.00\\" fill=\\"#000000\\">Bob</text>\\n</g>\\n<!-- Alice&#45;&gt;bob -->\\n<g id=\\"edge1\\" class=\\"edge\\">\\n<title>Alice-&gt;Bob</title>\\n<path fill=\\"none\\" stroke=\\"#000000\\" d=\\"M31.9486,-71.8314C31.9486,-64.131 31.9486,-54.9743 31.9486,-46.4166\\"/>\\n<polygon fill=\\"#000000\\" stroke=\\"#000000\\" points=\\"35.4487,-46.4132 31.9486,-36.4133 28.4487,-46.4133 35.4487,-46.4132\\"/>\\n</g>\\n</g>\\n</svg>');

    cy.startApplication();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.node(3).shouldHaveName('Charlie');
    cy.edge(1).shouldHaveName('Alice->Bob');
    cy.edge(2).shouldHaveName('Bob->Charlie');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 2);

    cy.openButton().click();
    cy.openFromBrowserDialog()
      .should('exist')
      .savedGraphs().then(savedGraphs => {
        cy.wrap(savedGraphs)
          .should('have.length', 2)
          .savedGraph(0).then(savedGraph => {
            cy.wrap(savedGraph).savedGraphName().should('have.text', 'My graph');
            cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob -> Charlie}');
            cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
            cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n\nCharlie\n\nCharlie\n\n\n\nBob->Charlie\n\n\n\n\n');
            return cy.wrap(savedGraphs);
          })
          .savedGraph(1).then(savedGraph => {
            cy.wrap(savedGraph).savedGraphName().should('have.text', 'Untitled Graph');
            cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
            cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a minute ago');
            cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
          });
        cy.openGraphCancelButton().click();
      });

  })

  it('The graph is saved to browser local storage when the save as button is clicked', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);
    cy.savedGraphName(1).should('have.text', 'My graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

  it('The graph is loaded from a saved graph in browser local storage when the open button is clicked', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);
    cy.savedGraphName(1).should('have.text', 'My graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.clearAndRenderDotSource('digraph {Charlie -> Daphne -> Ernie}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Charlie');
    cy.node(2).shouldHaveName('Daphne');
    cy.node(3).shouldHaveName('Ernie');
    cy.edge(1).shouldHaveName('Charlie->Daphne');
    cy.edge(2).shouldHaveName('Daphne->Ernie');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 2);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.savedGraphName(1).click();
    cy.openGraphOpenButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);
  })

  it('The graph is loaded from a saved graph in browser local storage when double-clicked', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);
    cy.savedGraphName(1).should('have.text', 'My graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.clearAndRenderDotSource('digraph {Charlie -> Daphne -> Ernie}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Charlie');
    cy.node(2).shouldHaveName('Daphne');
    cy.node(3).shouldHaveName('Ernie');
    cy.edge(1).shouldHaveName('Charlie->Daphne');
    cy.edge(2).shouldHaveName('Daphne->Ernie');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 2);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.savedGraphName(1).trigger('dblclick');

    cy.openFromBrowserDialog().should('not.exist');

    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);
  })

  it('The open from browser dialog allows sorting the view of stored graphs.', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');
    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');
    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.openButton().click();
    cy.openFromBrowserDialog()
      .should('exist')
      .savedGraphs()
      .should('have.length', 1)
      .then(savedGraphs => {
        cy.wrap(savedGraphs).savedGraph(0).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'Untitled Graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
        });
        cy.openGraphCancelButton().click();
      });

    cy.saveAsButton().click();
    cy.saveToBrowserDialog().should('exist');
    cy.saveToBrowserNameInput().type('My graph{enter}');
    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();
    cy.openFromBrowserDialog()
      .should('exist')
      .savedGraphs().then(savedGraphs => {
        cy.wrap(savedGraphs)
          .should('have.length', 2)
          .savedGraph(0).then(savedGraph => {
            cy.wrap(savedGraph).savedGraphName().should('have.text', 'Untitled Graph');
            cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
            cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
            cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
            return cy.wrap(savedGraphs);
          })
          .savedGraph(1).then(savedGraph => {
            cy.wrap(savedGraph).savedGraphName().should('have.text', 'My graph');
            cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
            cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
            cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
          });
        cy.openGraphCancelButton().click();
      });

    cy.wait(40 * 1000);

    cy.typeDotSource('{leftArrow} -> Charlie');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 2);

    cy.openButton().click();

    cy.openFromBrowserDialog().then(openFromBrowserDialog => {
      cy.wrap(openFromBrowserDialog)
        .should('exist')
        .savedGraphs().then(savedGraphs => {
          cy.wrap(savedGraphs)
            .should('have.length', 2)
            .savedGraph(0).then(savedGraph => {
              cy.wrap(savedGraph).savedGraphName().should('have.text', 'My graph');
              cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob -> Charlie}');
              cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
              cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n\nCharlie\n\nCharlie\n\n\n\nBob->Charlie\n\n\n\n\n');
              return cy.wrap(savedGraphs);
            })
            .savedGraph(1).then(savedGraph => {
            cy.wrap(savedGraph).savedGraphName().should('have.text', 'Untitled Graph');
              cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
            cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a minute ago');
              cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
            });
        });

      cy.graphTableHeader('name').click();

      cy.wrap(openFromBrowserDialog)
        .savedGraphs().then(savedGraphs => {
          cy.wrap(savedGraphs)
            .should('have.length', 2)
            .savedGraph(0).then(savedGraph => {
              cy.wrap(savedGraphs)
                .savedGraph(0).then(savedGraph => {
                  cy.wrap(savedGraph).savedGraphName().should('have.text', 'My graph');
                  cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob -> Charlie}');
                  cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
            return cy.wrap(savedGraphs);
                })
                .savedGraph(1).then(savedGraph => {
                  cy.wrap(savedGraph).savedGraphName().should('have.text', 'Untitled Graph');
                  cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
                  cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a minute ago');
                });
            });
        });

        cy.graphTableHeader('name').click();

      cy.wrap(openFromBrowserDialog)
        .savedGraphs().then(savedGraphs => {
          cy.wrap(savedGraphs)
            .savedGraph(0).then(savedGraph => {
              cy.wrap(savedGraph).savedGraphName().should('have.text', 'Untitled Graph');
              cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
              cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a minute ago');
              return cy.wrap(savedGraphs);
            })
            .savedGraph(1).then(savedGraph => {
              cy.wrap(savedGraph).savedGraphName().should('have.text', 'My graph');
              cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob -> Charlie}');
              cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
            });
        });

      cy.graphTableHeader('dotSrcLastChangeTime').click();

      cy.wrap(openFromBrowserDialog)
        .savedGraphs().then(savedGraphs => {
          cy.wrap(savedGraphs)
            .savedGraph(0).then(savedGraph => {
              cy.wrap(savedGraph).savedGraphName().should('have.text', 'My graph');
              cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob -> Charlie}');
              cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
              return cy.wrap(savedGraphs);
            })
            .savedGraph(1).then(savedGraph => {
              cy.wrap(savedGraph).savedGraphName().should('have.text', 'Untitled Graph');
              cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
              cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a minute ago');
            });
        });

      cy.graphTableHeader('dotSrcLastChangeTime').click();

      cy.wrap(openFromBrowserDialog)
        .savedGraphs().then(savedGraphs => {
          cy.wrap(savedGraphs)
            .savedGraph(0).then(savedGraph => {
              cy.wrap(savedGraph).savedGraphName().should('have.text', 'Untitled Graph');
              cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
              cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a minute ago');
              return cy.wrap(savedGraphs);
            })
            .savedGraph(1).then(savedGraph => {
              cy.wrap(savedGraph).savedGraphName().should('have.text', 'My graph');
              cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob -> Charlie}');
              cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
            });
        });
    });

  })

  it('The open from browser dialog shows a pop-up with a larger preview of the stored graph when the small graph preview is hovered.', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');
    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');
    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.openButton().click();
    cy.openFromBrowserDialog()
      .should('exist')
      .savedGraphs()
      .should('have.length', 1)
      .then(savedGraphs => {
        cy.wrap(savedGraphs).savedGraph(0).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'Untitled Graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().then(savedGraphPreview => {
            cy.wrap(savedGraphPreview)
              .should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n')
              .savedGraphPreviewGraph().trigger('mouseenter');
            cy.wrap(savedGraphPreview)
              .savedGraphPreviewPopUp().should('exist');
            cy.wrap(savedGraphPreview)
              .savedGraphPreviewGraph().trigger('mouseleave');
            cy.wrap(savedGraphPreview)
              .savedGraphPreviewPopUp().should('not.exist');
          });
        });
        cy.openGraphCancelButton().click();
      });

  })

  it('A graph saved in browser local storage is deleted when the delete icon is clicked', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);
    cy.savedGraphName(1).should('have.text', 'My graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.clearAndRenderDotSource('digraph {Charlie -> Daphne -> Ernie}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Charlie');
    cy.node(2).shouldHaveName('Daphne');
    cy.node(3).shouldHaveName('Ernie');
    cy.edge(1).shouldHaveName('Charlie->Daphne');
    cy.edge(2).shouldHaveName('Daphne->Ernie');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 2);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.savedGraphDeleteButton(1).click();

    cy.deleteGraphDialog().should('exist');

    cy.deleteGraphCancelButton().click();

    cy.deleteGraphDialog().should('not.exist');

    cy.savedGraphDeleteButton(1).click();

    cy.deleteGraphDeleteButton().click();

    cy.deleteGraphDialog().should('not.exist');

    cy.savedGraphs().should('have.length', 1);

    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.node(3).should('exist');
    cy.edge(1).should('exist');
    cy.edge(2).should('exist');

    cy.node(1).shouldHaveName('Charlie');
    cy.node(2).shouldHaveName('Daphne');
    cy.node(3).shouldHaveName('Ernie');
    cy.edge(1).shouldHaveName('Charlie->Daphne');
    cy.edge(2).shouldHaveName('Daphne->Ernie');

    cy.nodes().should('have.length', 3);
    cy.edges().should('have.length', 2);

    cy.savedGraphDeleteButton(0).click();

    cy.deleteGraphDialog().should('exist');

    cy.deleteGraphDeleteButton().click();

    cy.deleteGraphDialog().should('not.exist');

    cy.savedGraphs().should('have.length', 0);

    cy.canvasSvg().should('not.exist');
  })

  it('The graph is renamed in browser local storage through the menu item Rename', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'My graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.menuButton().click();

    cy.menuItemRename().click()

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph 2');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'My graph 2');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

  it('Saving a graph to browser local storage under a name that already exist, opens a dialog asking the user for confirmation and then writes over that graph', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.menuButton().click();

    cy.menuItemRename().click()

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');
    cy.savedGraphs().should('have.length', 1);
    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.saveAsButton().click();

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph 2');
    cy.saveToBrowserSaveButton().click()

    cy.saveToBrowserDialog().should('not.exist');

    cy.menuButton().click();

    cy.menuItemRename().click()

    cy.saveToBrowserDialog().should('exist');

    cy.saveToBrowserNameInput().type('My graph');
    cy.saveToBrowserSaveButton().click()

    cy.replaceGraphDialog().should('exist');

    cy.replaceGraphCancelButton().click();

    cy.replaceGraphDialog().should('not.exist');

    cy.saveToBrowserSaveButton().click()

    cy.replaceGraphDialog().should('exist');

    cy.replaceGraphReplaceButton().click();

    cy.saveToBrowserDialog().should('not.exist');

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 1);
    cy.savedGraphName(0).should('have.text', 'My graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

  it('A new empty graph is created when the new button is clicked', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 1);
    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.newButton().click();

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 1);

    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.insertDotSource('digraph {Charlie -> Daphne -> Ernie}');
    cy.waitForTransition();

    cy.openFromBrowserDialog().should('not.exist');

    cy.newButton().click();

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'Untitled Graph 1');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

  it('The menu iten New creates a new empty graph', function() {
    cy.startApplication();
    cy.clearAndRenderDotSource('digraph {Alice -> Bob}');

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');

    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');

    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 1);
    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.menuButton().click();
    cy.menuItemNew().click();

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 1);

    cy.savedGraphName(0).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');

    cy.openGraphCancelButton().click();

    cy.openFromBrowserDialog().should('not.exist');

    cy.insertDotSource('digraph {Charlie -> Daphne -> Ernie}');
    cy.waitForTransition();

    cy.openFromBrowserDialog().should('not.exist');

    cy.menuButton().click();
    cy.menuItemNew().click();

    cy.openButton().click();

    cy.openFromBrowserDialog().should('exist');

    cy.savedGraphs().should('have.length', 2);

    cy.savedGraphName(0).should('have.text', 'Untitled Graph 1');
    cy.savedGraphDotSource(0).should('have.text', 'digraph {Charlie -> Daphne -> Ernie}');
    cy.savedGraphTime(0).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(0).should('have.text', '\n\n%0\n\n\n\nCharlie\n\nCharlie\n\n\n\nDaphne\n\nDaphne\n\n\n\nCharlie->Daphne\n\n\n\n\n\nErnie\n\nErnie\n\n\n\nDaphne->Ernie\n\n\n\n\n');

    cy.savedGraphName(1).should('have.text', 'Untitled Graph');
    cy.savedGraphDotSource(1).should('have.text', 'digraph {Alice -> Bob}');
    cy.savedGraphTime(1).should('have.text', 'a few seconds ago');
    cy.savedGraphPreview(1).should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
  })

  it('The main menu item Open from browser opens the open from browser dialog', function() {
    cy.startCleanApplication();

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);

    cy.menuButton().click();
    cy.menuItemOpen().click()

    cy.openFromBrowserDialog().should('exist');

    cy.get('body').type('{esc}', { release: false });

    cy.openFromBrowserDialog().should('not.exist');

  })

  it('The main menu item Save as to browser opens the save to browser dialog', function() {
    cy.startCleanApplication();

    cy.nodes().should('have.length', 0);
    cy.edges().should('have.length', 0);

    cy.menuButton().click();
    cy.menuItemSaveAs().click()

    cy.saveToBrowserDialog().should('exist');

    cy.get('body').type('{esc}', { release: false });

    cy.saveToBrowserDialog().should('not.exist');

  })

  it('A DOT source that is imported from the dot parameter in the URL creates a new graph in browser local storage if not equal to any existing DOT source', function() {
    cy.startApplicationWithNamedDotSource('digraph {Alice}', 'My first graph');

    cy.openButton().click();
    cy.openFromBrowserDialog()
      .should('exist')
      .savedGraphs()
      .should('have.length', 1)
      .then(savedGraphs => {
        cy.wrap(savedGraphs).savedGraph(0).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'My first graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n');
        });
        cy.openGraphCancelButton().click();
      });

    cy.saveAsButton().click();
    cy.saveToBrowserDialog().should('exist');
    cy.saveToBrowserNameInput().type('My second graph');
    cy.saveToBrowserSaveButton().click()
    cy.saveToBrowserDialog().should('not.exist');

    cy.clearAndRenderDotSource('digraph {Bob}');

    cy.openButton().click();
    cy.openFromBrowserDialog()
      .should('exist')
      .savedGraphs()
      .should('have.length', 2)
      .then(savedGraphs => {
        cy.wrap(savedGraphs).savedGraph(0).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'My second graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Bob}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nBob\n\nBob\n\n\n');
          return cy.wrap(savedGraphs);
        });
        cy.wrap(savedGraphs).savedGraph(1).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'My first graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n');
        });
        cy.openGraphCancelButton().click();
      });

    cy.visit('http://localhost:3000/?dot=digraph%20%7BAlice%20-%3E%20Bob%7D');
    cy.waitForTransition();

    cy.openButton().click();
    cy.openFromBrowserDialog()
      .should('exist')
      .savedGraphs()
      .should('have.length', 3)
      .then(savedGraphs => {
        cy.wrap(savedGraphs).savedGraph(0).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'Untitled Graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
          return cy.wrap(savedGraphs);
        });
        cy.wrap(savedGraphs).savedGraph(1).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'My second graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Bob}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nBob\n\nBob\n\n\n');
          return cy.wrap(savedGraphs);
        });
        cy.wrap(savedGraphs).savedGraph(2).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'My first graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n');
        });
        cy.openGraphCancelButton().click();
      });

  })

  it('A DOT source that is imported from the dot parameter in the URL does not create a new graph if equal to the current DOT source', function() {
    cy.startApplicationWithNamedDotSource('digraph {Alice -> Bob}', 'My graph');

    cy.openButton().click();
    cy.openFromBrowserDialog()
      .should('exist')
      .savedGraphs()
      .should('have.length', 1)
      .then(savedGraphs => {
        cy.wrap(savedGraphs).savedGraph(0).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'My graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
        });
        cy.openGraphCancelButton().click();
      });

    cy.visit('http://localhost:3000/?dot=digraph%20%7BAlice%20-%3E%20Bob%7D');
    cy.waitForTransition();

    cy.node(1).should('exist');
    cy.node(2).should('exist');
    cy.edge(1).should('exist');
    cy.node(1).shouldHaveName('Alice');
    cy.node(2).shouldHaveName('Bob');
    cy.edge(1).shouldHaveName('Alice->Bob');
    cy.nodes().should('have.length', 2);
    cy.edges().should('have.length', 1);

    cy.openButton().click();
    cy.openFromBrowserDialog()
      .should('exist')
      .savedGraphs()
      .should('have.length', 1)
      .then(savedGraphs => {
        cy.wrap(savedGraphs).savedGraph(0).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'My graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
        });
        cy.openGraphCancelButton().click();
      });

  })

  it('A DOT source that is imported from the dot parameter in the URL and is equal to a saved graph in browser local storage even if that graph is not the current graph', function() {
    cy.startApplicationWithNamedDotSource('digraph {Alice -> Bob}', 'My first graph');

    cy.openButton().click();
    cy.openFromBrowserDialog()
      .should('exist')
      .savedGraphs()
      .should('have.length', 1)
      .then(savedGraphs => {
        cy.wrap(savedGraphs).savedGraph(0).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'My first graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
        });
        cy.openGraphCancelButton().click();
      });

    cy.saveAsButton().click();
    cy.saveToBrowserDialog().should('exist');
    cy.saveToBrowserNameInput().type('My second graph');
    cy.saveToBrowserSaveButton().click()
    cy.saveToBrowserDialog().should('not.exist');

    cy.clearAndRenderDotSource('digraph {Alice}');

    cy.openButton().click();
    cy.openFromBrowserDialog()
      .should('exist')
      .savedGraphs()
      .should('have.length', 2)
      .then(savedGraphs => {
        cy.wrap(savedGraphs).savedGraph(0).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'My second graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n');
          return cy.wrap(savedGraphs);
        });
        cy.wrap(savedGraphs).savedGraph(1).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'My first graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
        });
        cy.openGraphCancelButton().click();
      });

    cy.visit('http://localhost:3000/?dot=digraph%20%7BAlice%20-%3E%20Bob%7D');
    cy.waitForTransition();

    cy.openButton().click();
    cy.openFromBrowserDialog()
      .should('exist')
      .savedGraphs()
      .should('have.length', 2)
      .then(savedGraphs => {
        cy.wrap(savedGraphs).savedGraph(0).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'My second graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n');
          return cy.wrap(savedGraphs);
        });
        cy.wrap(savedGraphs).savedGraph(1).then(savedGraph => {
          cy.wrap(savedGraph).savedGraphName().should('have.text', 'My first graph');
          cy.wrap(savedGraph).savedGraphDotSource().should('have.text', 'digraph {Alice -> Bob}');
          cy.wrap(savedGraph).savedGraphTime().should('have.text', 'a few seconds ago');
          cy.wrap(savedGraph).savedGraphPreview().should('have.text', '\n\n%0\n\n\n\nAlice\n\nAlice\n\n\n\nBob\n\nBob\n\n\n\nAlice->Bob\n\n\n\n\n');
        });
        cy.openGraphCancelButton().click();
      });

  })

})
