describe('Transitioning when DOT source changes', function() {

  it('Renders a new graph with shape tweening when enabled in settings', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findNodes().should('have.length', 2);
      cy.wrap(graph0).findNode(1)
        .should('exist')
        .shouldHaveLabel('Alice')
        .shouldHaveShape('ellipse');
      cy.wrap(graph0).findNode(2)
        .should('exist')
        .shouldHaveLabel('Bob')
        .shouldHaveShape('ellipse');
    });

    cy.clearDotSource();
    cy.insertDotSource('digraph {node [shape=box] Alice -> Bob}');

    cy.waitForBusy();

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findNodes().should('have.length', 2);
      cy.wrap(graph0).findNode(1)
        .should('exist')
        .shouldHaveLabel('Alice')
        .shouldHaveShape('path');
      cy.wrap(graph0).findNode(2)
        .should('exist')
        .shouldHaveLabel('Bob')
        .shouldHaveShape('path');
    });

    cy.waitForNotBusy();

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findNodes().should('have.length', 2);
      cy.wrap(graph0).findNode(1)
        .should('exist')
        .shouldHaveLabel('Alice')
        .shouldHaveShape('polygon');
      cy.wrap(graph0).findNode(2)
        .should('exist')
        .shouldHaveLabel('Bob')
        .shouldHaveShape('polygon');
    });

  })

  it('Renders a new graph without shape tweening when disabled in settings', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.settingsButton().click();
    cy.shapeTweenSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findNodes().should('have.length', 2);
      cy.wrap(graph0).findNode(1)
        .should('exist')
        .shouldHaveLabel('Alice')
        .shouldHaveShape('ellipse');
      cy.wrap(graph0).findNode(2)
        .should('exist')
        .shouldHaveLabel('Bob')
        .shouldHaveShape('ellipse');
    });

    cy.clearDotSource();
    cy.insertDotSource('digraph {node [shape=box] Alice -> Bob}');

    cy.waitForBusy();

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findNodes().should('have.length', 2);
      cy.wrap(graph0).findNode(1)
        .should('exist')
        .shouldHaveLabel('Alice')
        .shouldHaveShape('polygon');
      cy.wrap(graph0).findNode(2)
        .should('exist')
        .shouldHaveLabel('Bob')
        .shouldHaveShape('polygon');
    });

    cy.waitForNotBusy();

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findNodes().should('have.length', 2);
      cy.wrap(graph0).findNode(1)
        .should('exist')
        .shouldHaveLabel('Alice')
        .shouldHaveShape('polygon');
      cy.wrap(graph0).findNode(2)
        .should('exist')
        .shouldHaveLabel('Bob')
        .shouldHaveShape('polygon');
    });

  })

  it('Renders a new graph with path tweening when enabled in settings', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.settingsButton().click();
    cy.shapeTweenSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob')
        .shouldHaveShape('path')
        .find('> path').should('have.attr', 'd', 'M31.9486,-71.8314C31.9486,-64.131 31.9486,-54.9743 31.9486,-46.4166');
    });

    cy.typeDotSource('{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow} rankdir=LR ', {force: true});

    cy.waitForBusy();

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob')
        .shouldHaveShape('path')
        .find('> path')
        .should(path => {
          expect(path.attr('d').split(',').length).to.equal(102);
        });
    });

    cy.waitForNotBusy();

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob')
        .shouldHaveShape('path')
        .find('> path').should('have.attr', 'd', 'M64.1391,-18C72.2457,-18 81.0193,-18 89.3677,-18');
    });

  })

  it('Renders a new graph with absolute path tweening precision specified in settings', function() {
    localStorage.setItem('fitGraph', true);
    cy.startApplicationWithDotSource('digraph {\n    edge [minlen=5]\n    Alice -> Bob\n    Alice -> Charlie\n}');

    cy.settingsButton().click();
    cy.tweenPrecisionRadioButtonAbsolute().click();
    cy.tweenPrecisionRadioButtonAbsolute().should('be.checked');
    cy.tweenPrecisionRadioButtonRelative().should('not.be.checked');
    cy.tweenPrecisionInput().should('have.value', '1');
    cy.tweenPrecisionInput().type('{backspace}50{del}');
    cy.tweenPrecisionInput().should('have.value', '50');
    cy.tweenPrecisionInputAdornment().should('have.text', ' points ');

    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob')
        .shouldHaveShape('path')
        .find('> path')
        .then(path => {
          expect(path.attr('d').split(',').length).to.equal(11)
        });
    });

    cy.typeDotSource('{leftArrow}{leftArrow}\nCharlie -> Bob', {force: true});

    cy.waitForBusy();

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob')
        .shouldHaveShape('path')
        .find('> path')
        .should(path => {
          expect(path.attr('d').split(',').length).to.not.equal(11)
        })
        .then(path => {
          expect(path.attr('d').split(',').length).to.equal(10);
        });
    });

    cy.waitForNotBusy();

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob')
        .shouldHaveShape('path')
        .find('> path')
        .should(path => {
          expect(path.attr('d').split(',').length).to.equal(11)
        })
    });

  });

  it('Renders a new graph with relative path tweening precision specified in settings', function() {
    localStorage.setItem('fitGraph', true);
    cy.startApplicationWithDotSource('digraph {\n    edge [minlen=5]\n    Alice -> Bob\n    Alice -> Charlie\n}');

    cy.settingsButton().click();
    cy.tweenPrecisionRadioButtonAbsolute().should('not.be.checked');
    cy.tweenPrecisionRadioButtonRelative().should('be.checked');
    cy.tweenPrecisionInput().should('have.value', '1');
    cy.tweenPrecisionInput().type('{backspace}50{del}');
    cy.tweenPrecisionInput().should('have.value', '50');
    cy.tweenPrecisionInputAdornment().should('have.text', ' % ');

    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob')
        .shouldHaveShape('path')
        .find('> path')
        .then(path => {
          expect(path.attr('d').split(',').length).to.equal(11)
        });
    });

    cy.typeDotSource('{leftArrow}{leftArrow}\nCharlie -> Bob', {force: true});

    cy.waitForBusy();

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob')
        .shouldHaveShape('path')
        .find('> path')
        .should(path => {
          expect(path.attr('d').split(',').length).to.not.equal(11)
        })
        .then(path => {
          expect(path.attr('d').split(',').length).to.equal(4);
        });
    });

    cy.waitForNotBusy();

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob')
        .shouldHaveShape('path')
        .find('> path')
        .should(path => {
          expect(path.attr('d').split(',').length).to.equal(11)
        })
    });

  });

  it('Renders a new graph without path tweening when disabled in settings', function() {
    cy.startApplicationWithDotSource('digraph {Alice -> Bob}');

    cy.settingsButton().click();
    cy.pathTweenSwitch().click();
    cy.shapeTweenSwitch().click();
    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob')
        .shouldHaveShape('path')
        .find('> path').should('have.attr', 'd', 'M31.9486,-71.8314C31.9486,-64.131 31.9486,-54.9743 31.9486,-46.4166');
    });

    cy.typeDotSource('{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow} rankdir=LR ', {force: true});

    cy.waitForBusy();

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob')
        .shouldHaveShape('path')
        .find('> path').first()
        .should('not.have.attr', 'd', 'M31.9486,-71.8314C31.9486,-64.131 31.9486,-54.9743 31.9486,-46.4166')
        .then(path => {
          expect(path.attr('d').split(',').length).to.equal(5);
        });
    });

    cy.waitForNotBusy();

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('exist')
        .shouldHaveName('Alice->Bob')
        .shouldHaveShape('path')
        .find('> path').should('have.attr', 'd', 'M64.1391,-18C72.2457,-18 81.0193,-18 89.3677,-18');
    });

  })

  it('The transition duration is set through the transition duration input field in settings', function() {
    cy.startApplicationWithDotSource('digraph {Alice Bob}');

    cy.settingsButton().click();
    cy.transitionDurationInput().should('have.value', '1');
    cy.get('body').type('{esc}', { release: false });

    cy.canvasGraph().then(graph0 => {
      cy.wrap(graph0).findEdge(1)
        .should('not.exist')
    });

    cy.typeDotSource('{leftArrow}{leftArrow}{leftArrow}{leftArrow}-> ', {force: true});

    let start;
    cy.waitForBusy().then(() => {
      start = Date.now();
    });

    cy.waitForNotBusy().then(() => {
      const stop = Date.now();
      const actualTransitionDuration = stop - start;
      expect(actualTransitionDuration).to.be.at.least(1000);
      expect(actualTransitionDuration).to.be.lessThan(2000);
    });

    cy.settingsButton().click();
    cy.transitionDurationInput().type('{backspace}5');
    cy.get('body').type('{esc}', { release: false });

    cy.typeDotSource('{leftArrow}{leftArrow}{leftArrow}{leftArrow}{backspace}{backspace}{backspace}', {force: true});

    cy.waitForBusy().then(() => {
      start = Date.now();
    });

    cy.waitForNotBusy().then(() => {
      const stop = Date.now();
      const actualTransitionDuration = stop - start;
      expect(actualTransitionDuration).to.be.at.least(5000);
      expect(actualTransitionDuration).to.be.lessThan(6000);
    });

  })

})
