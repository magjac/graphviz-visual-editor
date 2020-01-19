Cypress.Commands.add("startApplication", (options) => {
  cy.visit('http://localhost:3000/', options);
  cy.waitForTransition();
});

Cypress.Commands.add("startCleanApplication", (options) => {
  localStorage.setItem('dotSrc', 'digraph {}');
  cy.visit('http://localhost:3000/', options);
  cy.canvasGraph().should('exist');
});

Cypress.Commands.add("textEditorWrapper", () => {
  return cy.get('#text-editor-wrapper');
});

Cypress.Commands.add("textEditor", () => {
  return cy.textEditorWrapper().find('#text-editor');
});

Cypress.Commands.add("textEditorContent", () => {
  return cy.textEditor().find('.ace_content');
});

Cypress.Commands.add("canvas", () => {
  return cy.get('#canvas');
});

Cypress.Commands.add("canvasSvg", () => {
  return cy.canvas().find('svg');
});

Cypress.Commands.add("canvasGraph", () => {
  return cy.canvasSvg().find('#graph0');
});

Cypress.Commands.add("node", (index) => {
  return cy.canvasGraph().find('> #node' + index);
});

Cypress.Commands.add("edge", (index) => {
  return cy.canvasGraph().find('> #edge' + index);
});

Cypress.Commands.add("nodes", () => {
  return cy.canvasGraph().find(' > .node');
});

Cypress.Commands.add("edges", () => {
  return cy.canvasGraph().find('> .edge');
});

Cypress.Commands.add("toolbarButton", (buttonName) => {
  return cy.get('#toolbar').contains(buttonName);
});

Cypress.Commands.add("menuButton", () => {
  return cy.get('#toolbar').find('#menu');
});

Cypress.Commands.add("mainMenu", () => {
  return cy.get('#main-menu');
});

Cypress.Commands.add("menuItemRename", () => {
  return cy.mainMenu().find('#rename');
});

Cypress.Commands.add("replaceGraphDialog", () => {
  return cy.get('#replace-graph-dialog');
});

Cypress.Commands.add("replaceGraphReplaceButton", () => {
  return cy.replaceGraphDialog().find('#replace');
});

Cypress.Commands.add("menuItemExportAsUrl", () => {
  return cy.get('#main-menu').find('#export-as-url');
});

Cypress.Commands.add("exportGraphAsUrlDialog", () => {
  return cy.get('#export-graph-as-url-dialog');
});

Cypress.Commands.add("exportGraphAsUrlExportedUrl", () => {
  return cy.exportGraphAsUrlDialog().find('#export');
});

Cypress.Commands.add("exportGraphAsUrlCopyButton", () => {
  return cy.exportGraphAsUrlDialog().find('#copy');
});

Cypress.Commands.add("exportGraphAsUrlCancelButton", () => {
  return cy.exportGraphAsUrlDialog().find('#cancel');
});

Cypress.Commands.add("exportGraphAsUrlOpenLinkButton", () => {
  return cy.exportGraphAsUrlDialog().find('#open-link');
});

Cypress.Commands.add("newButton", () => {
  return cy.get('#toolbar').find('#new');
});

Cypress.Commands.add("openButton", () => {
  return cy.get('#toolbar').find('#open');
});

Cypress.Commands.add("openFromBrowserDialog", () => {
  return cy.get('#open-from-browser-dialog');
});

Cypress.Commands.add("savedGraphs", () => {
  return cy.openFromBrowserDialog().find('tbody').find('tr');
});

Cypress.Commands.add("savedGraph", (index) => {
  return cy.savedGraphs().eq(index);
});

Cypress.Commands.add("savedGraphName", (index) => {
  return cy.savedGraphs().eq(index).find('th');
});

Cypress.Commands.add("savedGraphDotSource", (index) => {
  return cy.savedGraphs().eq(index).find('td').eq(0);
});

Cypress.Commands.add("savedGraphTime", (index) => {
  return cy.savedGraphs().eq(index).find('td').eq(1);
});

Cypress.Commands.add("savedGraphPreview", (index) => {
  return cy.savedGraphs().eq(index).find('td').eq(2);
});

Cypress.Commands.add("savedGraphDeleteButton", (index) => {
  return cy.savedGraphs().eq(index).find('td').eq(3).find('#delete');
});

Cypress.Commands.add("openGraphCancelButton", (index) => {
  return cy.openFromBrowserDialog().find('#cancel');
});

Cypress.Commands.add("openGraphOpenButton", (index) => {
  return cy.openFromBrowserDialog().find('#open');
});

Cypress.Commands.add("deleteGraphDialog", (index) => {
  return cy.get('#delete-graph-dialog');
});

Cypress.Commands.add("deleteGraphDeleteButton", () => {
  return cy.deleteGraphDialog().find('#delete');
});

Cypress.Commands.add("deleteGraphDialog", (index) => {
  return cy.get('#delete-graph-dialog');
});

Cypress.Commands.add("saveAsButton", () => {
  return cy.get('#toolbar').find('#save-as');
});

Cypress.Commands.add("saveToBrowserDialog", () => {
  return cy.get('#save-to-browser-dialog');
});

Cypress.Commands.add("saveToBrowserNameInput", () => {
  return cy.saveToBrowserDialog().find('#name');
});

Cypress.Commands.add("saveToBrowserSaveButton", () => {
  return cy.saveToBrowserDialog().find('#save');
});

Cypress.Commands.add("insertPanels", () => {
  return cy.get('#insert-panels');
});

Cypress.Commands.add("nodeShapeCategory", (nodeShapeCategoryName) => {
  return cy.insertPanels().contains(nodeShapeCategoryName);
});

Cypress.Commands.add("nodeShape", (nodeShapeName) => {
  return cy.insertPanels().contains(nodeShapeName);
});

Cypress.Commands.add("formatDrawer", () => {
  return cy.get('#format-drawer');
});

Cypress.Commands.add("styleSwitch", () => {
  return cy.formatDrawer().find('#style-switch');
});

Cypress.Commands.add("styles", () => {
  return cy.formatDrawer().find('#styles');
});

Cypress.Commands.add("style", (styleName) => {
  return cy.styles().find('#' + styleName);
});

Cypress.Commands.add("colorPickerForm", () => {
  return cy.formatDrawer().find('#color-picker-form');
});

Cypress.Commands.add("colorSwitch", () => {
  return cy.colorPickerForm().find('#color-switch');
});

Cypress.Commands.add("colorPickerSwatch", () => {
  return cy.colorPickerForm().find('#color-picker-swatch');
});

Cypress.Commands.add("colorPicker", () => {
  return cy.colorPickerForm().find('#color-picker-popover > .chrome-picker');
});

Cypress.Commands.add("colorPickerSaturation", () => {
  return cy.colorPicker().find('.saturation-white');
});

Cypress.Commands.add("colorPickerHue", () => {
  return cy.colorPicker().find('.hue-horizontal');
});

Cypress.Commands.add("colorPickerOpacity", () => {
  return cy.colorPickerHue().parent().parent().parent().find('> div').eq(1).find(' > div > div').eq(2);
});

Cypress.Commands.add("colorPickerInput", () => {
  return cy.colorPickerForm().find('#color-input');
});

Cypress.Commands.add("fillColorPickerForm", () => {
  return cy.formatDrawer().find('#fillcolor-picker-form');
});

Cypress.Commands.add("fillColorSwitch", () => {
  return cy.fillColorPickerForm().find('#fillcolor-switch');
});

Cypress.Commands.add("fillColorPickerSwatch", () => {
  return cy.fillColorPickerForm().find('#color-picker-swatch');
});

Cypress.Commands.add("fillColorPicker", () => {
  return cy.fillColorPickerForm().find('#color-picker-popover > .chrome-picker');
});

Cypress.Commands.add("fillColorPickerSaturation", () => {
  return cy.fillColorPicker().find('.saturation-white');
});

Cypress.Commands.add("fillColorPickerHue", () => {
  return cy.fillColorPicker().find('.hue-horizontal');
});

Cypress.Commands.add("fillColorPickerOpacity", () => {
  return cy.fillColorPickerHue().parent().parent().parent().find('> div').eq(1).find(' > div > div').eq(2);
});

Cypress.Commands.add("zoomInButton", () => {
  return cy.get('#toolbar').find('#zoom-in');
});

Cypress.Commands.add("zoomOutButton", () => {
  return cy.get('#toolbar').find('#zoom-out');
});

Cypress.Commands.add("zoomOutMapButton", () => {
  return cy.get('#toolbar').find('#zoom-out-map');
});

Cypress.Commands.add("zoomResetButton", () => {
  return cy.get('#toolbar').find('#zoom-reset');
});

Cypress.Commands.add("settingsButton", () => {
  return cy.get('#toolbar').find('#settings');
});

Cypress.Commands.add("settingsDialog", () => {
  return cy.get('#settings-dialog');
});

Cypress.Commands.add("fitSwitch", () => {
  return cy.settingsDialog().find('#fit-switch');
});

Cypress.Commands.add("shouldHaveName", {prevSubject: true}, (subject, label) => {
  cy.wrap(subject).find('title').should('have.text', label);
});

Cypress.Commands.add("shouldHaveLabel", {prevSubject: true}, (subject, label) => {
  cy.wrap(subject).find('text').should('have.text', label);
});

Cypress.Commands.add("shouldBeSelected", {prevSubject: true}, (subject) => {
  cy.wrap(subject).within(() => {
    cy.get('rect').should('exist');
  });
});

Cypress.Commands.add("shouldNotBeSelected", {prevSubject: true}, (subject) => {
  cy.wrap(subject).within(() => {
    cy.get('rect').should('not.exist');
  });
});

Cypress.Commands.add("checkDefaultGraph", () => {
  cy.node(1).should('exist');
  cy.node(2).should('exist');
  cy.edge(1).should('exist');

  cy.node(1).shouldHaveLabel('a');
  cy.node(2).shouldHaveLabel('b');

  cy.node(1).shouldHaveName('a');
  cy.node(2).shouldHaveName('b');
  cy.edge(1).shouldHaveName('a->b');

  cy.nodes().should('have.length', 2);
  cy.edges().should('have.length', 1);
});

Cypress.Commands.add("waitForBusy", () => {
  cy.get('#busy-indicator').should('exist');
});

Cypress.Commands.add("waitForNotBusy", () => {
  cy.get('#busy-indicator').should('not.exist');
});

Cypress.Commands.add("waitForTransition", () => {
  cy.waitForBusy();
  cy.waitForNotBusy();
});

Cypress.Commands.add("textEditorInput", () => {
  cy.get('.ace_text-input');
});

Cypress.Commands.add("typeDotSource", (dotSrc) => {
  cy.textEditorInput().type(dotSrc, {force: true});
});

Cypress.Commands.add("clearDotSource", () => {
  cy.typeDotSource('{ctrl}a{del}');
});

Cypress.Commands.add("insertDotSource", (dotSrc) => {
  cy.typeDotSource(dotSrc.replace(/{/g, '{{}'), {force: true});
});

Cypress.Commands.add("clearAndRenderDotSource", (dotSrc) => {
  cy.clearDotSource();
  cy.insertDotSource(dotSrc);
  cy.waitForTransition();
});
