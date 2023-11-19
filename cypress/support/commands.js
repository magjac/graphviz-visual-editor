import packageJSON from '../../package.json';

Cypress.Commands.add("startApplication", (options) => {
  localStorage.setItem('version', packageJSON.version);
  cy.visit('http://localhost:3000/', options);
  cy.waitForTransition();
});

Cypress.Commands.add("startCleanApplication", (options) => {
  localStorage.setItem('dotSrc', 'digraph {}');
  localStorage.setItem('version', packageJSON.version);
  cy.visit('http://localhost:3000/', options);
  cy.canvasGraph().should('exist');
});

Cypress.Commands.add("startApplicationWithDotSource", (dotSrc, options) => {
  localStorage.setItem('dotSrc', dotSrc);
  localStorage.setItem('version', packageJSON.version);
  cy.visit('http://localhost:3000/', options);
  cy.canvasGraph().should('exist');
});

Cypress.Commands.add("startApplicationWithNamedDotSource", (dotSrc, name, options) => {
  localStorage.setItem('name', name);
  cy.startApplicationWithDotSource(dotSrc, options);
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

Cypress.Commands.add("textEditorGutter", () => {
  return cy.textEditor().find('.ace_gutter');
});

Cypress.Commands.add("textEditorGutterCells", () => {
  return cy.textEditorGutter().find('.ace_gutter-cell');
});

Cypress.Commands.add("textEditorGutterCellWithError", () => {
  return cy.textEditorGutter().find('.ace_error');
});

Cypress.Commands.add("textEditorTooltip", () => {
  return cy.textEditor().find('.ace_tooltip');
});

Cypress.Commands.add("textEditorTextLayer", () => {
  return cy.textEditorContent().find('> .ace_text-layer');
});

Cypress.Commands.add("textEditorVisibleLines", () => {
  return cy.textEditorTextLayer().find('> .ace_line_group > .ace_line');
});

Cypress.Commands.add("textEditorErrorButton", () => {
  return cy.textEditorWrapper().find('#error-button');
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

Cypress.Commands.add("findNode", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> #node' + index);
});

Cypress.Commands.add("findNodes", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> .node');
});

Cypress.Commands.add("findEdge", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> #edge' + index);
});

Cypress.Commands.add("findEdges", {prevSubject: true}, (subject, index) => {
  return cy.wrap(subject).find('> .edge');
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

Cypress.Commands.add("toolbar", (buttonName) => {
  return cy.get('#toolbar');
});

Cypress.Commands.add("toolbarButton", (buttonName) => {
  return cy.toolbar().contains(buttonName);
});

Cypress.Commands.add("menuButton", () => {
  return cy.get('#toolbar').find('#menu');
});

Cypress.Commands.add("mainMenu", () => {
  return cy.get('#main-menu');
});

Cypress.Commands.add("menuItemNew", () => {
  return cy.mainMenu().find('#new');
});

Cypress.Commands.add("menuItemOpen", () => {
  return cy.mainMenu().find('#open');
});

Cypress.Commands.add("menuItemSaveAs", () => {
  return cy.mainMenu().find('#save-as');
});

Cypress.Commands.add("menuItemRename", () => {
  return cy.mainMenu().find('#rename');
});

Cypress.Commands.add("replaceGraphDialog", () => {
  return cy.get('#replace-graph-dialog');
});

Cypress.Commands.add("replaceGraphCancelButton", () => {
  return cy.replaceGraphDialog().find('#cancel');
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

Cypress.Commands.add("menuItemSettings", () => {
  return cy.mainMenu().find('#settings');
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

Cypress.Commands.add("graphTableHeader", {prevSubject: 'optional'}, (subject, name) => {
  return (subject ? cy.wrap(subject) : cy.openFromBrowserDialog()).find('thead > tr > th > #' + name);
});

Cypress.Commands.add("savedGraphs", {prevSubject: 'optional'}, (subject) => {
  return (subject ? cy.wrap(subject) : cy.openFromBrowserDialog()).find('tbody').find('tr');
});

Cypress.Commands.add("savedGraph", {prevSubject: 'optional'}, (subject, index) => {
  return (subject ? cy.wrap(subject) : cy.savedGraphs()).eq(index);
});

Cypress.Commands.add("savedGraphName",  {prevSubject: 'optional'}, (subject, index) => {
  return (subject ? cy.wrap(subject) : cy.savedGraph(index)).find('th');
});

Cypress.Commands.add("savedGraphDotSource", {prevSubject: 'optional'}, (subject, index) => {
  return (subject ? cy.wrap(subject) : cy.savedGraph(index)).find('td').eq(0);
});

Cypress.Commands.add("savedGraphTime", {prevSubject: 'optional'}, (subject, index) => {
  return (subject ? cy.wrap(subject) : cy.savedGraph(index)).find('td').eq(1);
});

Cypress.Commands.add("savedGraphPreview", {prevSubject: 'optional'}, (subject, index) => {
  return (subject ? cy.wrap(subject) : cy.savedGraph(index)).find('td').eq(2);
});

Cypress.Commands.add("savedGraphPreviewGraph", {prevSubject: 'optional'}, (subject, index) => {
  return (subject ? cy.wrap(subject) : cy.savedGraphPreview(index)).find('#svg-wrapper > svg > #graph0');
});

Cypress.Commands.add("savedGraphPreviewPopUp", {prevSubject: 'optional'}, (subject, index) => {
  return (subject ? cy.wrap(subject) : cy.savedGraphPreview(index)).find('#preview-pop-up');
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

Cypress.Commands.add("deleteGraphCancelButton", () => {
  return cy.deleteGraphDialog().find('#cancel');
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

Cypress.Commands.add("undoButton", () => {
  return cy.toolbar().find('#undo');
});

Cypress.Commands.add("redoButton", () => {
  return cy.toolbar().find('#redo');
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

Cypress.Commands.add("formatDrawerCloseButton", () => {
  return cy.formatDrawer().find('#close-button');
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

Cypress.Commands.add("fillColorPickerInput", () => {
  return cy.fillColorPickerForm().find('#color-input');
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

Cypress.Commands.add("engineSelector", () => {
  return cy.settingsDialog().find('#engine-selector');
});

Cypress.Commands.add("engineMenu", () => {
  return cy.get('#menu-engine');
});

Cypress.Commands.add("engineMenuAlternative", (engine) => {
  return cy.engineMenu().find('#' + engine);
});

Cypress.Commands.add("transitionDurationInput", () => {
  return cy.settingsDialog().find('#transition-duration');
});

Cypress.Commands.add("pathTweenSwitch", () => {
  return cy.settingsDialog().find('#path-tween-switch');
});

Cypress.Commands.add("shapeTweenSwitch", () => {
  return cy.settingsDialog().find('#shape-tween-switch');
});

Cypress.Commands.add("tweenPrecisionForm", () => {
  return cy.settingsDialog().find('#tween-precision-form');
});

Cypress.Commands.add("tweenPrecisionRadioGroup", () => {
  return cy.tweenPrecisionForm().find('#tween-precision-radio-group');
});

Cypress.Commands.add("tweenPrecisionRadioButtonAbsolute", () => {
  return cy.tweenPrecisionRadioGroup().find('#absolute');
});

Cypress.Commands.add("tweenPrecisionRadioButtonRelative", () => {
  return cy.tweenPrecisionRadioGroup().find('#relative');
});

Cypress.Commands.add("tweenPrecisionInput", () => {
  return cy.tweenPrecisionForm().find('#tween-precision-input');
});

Cypress.Commands.add("tweenPrecisionInputAdornment", () => {
  return cy.tweenPrecisionForm().find('#tween-precision-input-adornment');
});

Cypress.Commands.add("fontSizeInput", () => {
  return cy.settingsDialog().find('#font-size');
});

Cypress.Commands.add("tabSizeInput", () => {
  return cy.settingsDialog().find('#tab-size');
});

Cypress.Commands.add("holdOffTimeInput", () => {
  return cy.settingsDialog().find('#holdoff');
});

Cypress.Commands.add("gitHubButton", () => {
  return cy.toolbar().find('#github');
});

Cypress.Commands.add("helpButton", () => {
  return cy.get('#toolbar').find('#help');
});

Cypress.Commands.add("helpMenu", () => {
  return cy.get('#help-menu');
});

Cypress.Commands.add("helpMenuBackdrop", () => {
  return cy.helpMenu().find(' > div').first();
});

Cypress.Commands.add("helpMenuItemKeyboardShortcuts", () => {
  return cy.helpMenu().find('#keyboard-shortcuts');
});

Cypress.Commands.add("keyboardShortcutsDialog", () => {
  return cy.get('#keyboard-shortcuts-dialog');
});

Cypress.Commands.add("keyboardShortcutsDialogCloseButton", () => {
  return cy.keyboardShortcutsDialog().find('#close-button');
});

Cypress.Commands.add("keyboardShortcutsTable", () => {
  return cy.keyboardShortcutsDialog().find('table');
});

Cypress.Commands.add("keyboardShortcutsTableRows", () => {
  return cy.keyboardShortcutsTable().find('tr');
});

Cypress.Commands.add("helpMenuItemMouseOperations", () => {
  return cy.helpMenu().find('#mouse-operations');
});

Cypress.Commands.add("mouseOperationsDialog", () => {
  return cy.get('#mouse-operations-dialog');
});

Cypress.Commands.add("mouseOperationsDialogCloseButton", () => {
  return cy.mouseOperationsDialog().find('#close-button');
});

Cypress.Commands.add("mouseOperationsTable", () => {
  return cy.mouseOperationsDialog().find('table');
});

Cypress.Commands.add("mouseOperationsTableRows", () => {
  return cy.mouseOperationsTable().find('tr');
});

Cypress.Commands.add("helpMenuItemAbout", () => {
  return cy.helpMenu().find('#about');
});

Cypress.Commands.add("aboutDialog", () => {
  return cy.get('#about-dialog');
});

Cypress.Commands.add("aboutDialogCloseButton", () => {
  return cy.aboutDialog().find('#close-button');
});

Cypress.Commands.add("aboutDialogParagraphs", () => {
  return cy.aboutDialog().find('p');
});

Cypress.Commands.add("shouldHaveName", {prevSubject: true}, (subject, label) => {
  cy.wrap(subject).find('title').should('have.text', label);
  return cy.wrap(subject);
});

Cypress.Commands.add("nodeShouldHaveName", (index, label) => {
  return cy.canvasGraph().find('> #node' + index + ">title").should('have.text', label);
});

Cypress.Commands.add("edgeShouldHaveName", (index, label) => {
  return cy.canvasGraph().find('> #edge' + index + ">title").should('have.text', label);
});

Cypress.Commands.add("shouldHaveLabel", {prevSubject: true}, (subject, label) => {
  cy.wrap(subject).find('text').should('have.text', label);
  return cy.wrap(subject);
});

Cypress.Commands.add("shouldHaveShape", {prevSubject: true}, (subject, shape) => {
  cy.wrap(subject).find(':nth-child(2)').should('have.prop', 'tagName', shape);
  return cy.wrap(subject);
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
  cy.canvasGraph().then(graph0 => {
    cy.wrap(graph0).findNodes().should('have.length', 2);
    cy.wrap(graph0).findEdges().should('have.length', 1);
    cy.wrap(graph0).findNode(1)
      .should('exist')
      .shouldHaveLabel('a');
    cy.wrap(graph0).findNode(2)
      .should('exist')
      .shouldHaveLabel('b');
    cy.wrap(graph0).findEdge(1)
      .should('exist')
      .shouldHaveName('a->b');
  });
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

Cypress.Commands.add("waitForEmptyCanvas", () => {
  cy.canvasSvg().should('not.exist');
});

Cypress.Commands.add("typeDotSource", (dotSrc) => {
  cy.textEditorContent().type(dotSrc);
});

Cypress.Commands.add("clearDotSource", () => {
  cy.typeDotSource('{ctrl}a{del}');
});

Cypress.Commands.add("insertDotSource", (dotSrc) => {
  cy.typeDotSource(dotSrc.replace(/{/g, '{{}'), {force: true});
});

Cypress.Commands.add("clearAndRenderDotSource", (dotSrc) => {
  cy.clearDotSource();
  cy.textEditorContent().should('have.text', '');
  cy.insertDotSource(dotSrc);
  cy.waitForTransition();
});
