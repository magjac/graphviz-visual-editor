# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
* Updated [Graphviz](https://graphviz.org/) from version
[11.0.0](https://gitlab.com/graphviz/graphviz/-/blob/main/CHANGELOG.md#1100--2024-04-28)
to version
[12.1.0](https://gitlab.com/graphviz/graphviz/-/blob/main/CHANGELOG.md#1210--2024-08-12)
through
[d3-graphviz](https://github.com/magjac/d3-graphviz)
version
[5.6.0](https://github.com/magjac/d3-graphviz/blob/master/CHANGELOG.md#560--2024-08-18).

## [1.2.0] - 2024-05-25

### Changed
* Updated [Graphviz](https://graphviz.org/) from version
[10.0.1](https://gitlab.com/graphviz/graphviz/-/blob/main/CHANGELOG.md#1001--2024-02-11)
to version
[11.0.0](https://gitlab.com/graphviz/graphviz/-/blob/main/CHANGELOG.md#1100--2024-04-28)
through
[d3-graphviz](https://github.com/magjac/d3-graphviz)
version
[5.4.0](https://github.com/magjac/d3-graphviz/blob/master/CHANGELOG.md#540--2024-05-05).

### Fixed
 *  Drawing an edge always inserts a directed edge even if the graph is not a directed graph, which results in "syntax error" #237

## [1.1.0] - 2024-02-11

### Changed
* Updated [Graphviz](https://graphviz.org/) from version
[9.0.0](https://gitlab.com/graphviz/graphviz/-/blob/main/CHANGELOG.md?ref_type=heads#900-2023-09-11)
to version
[10.0.1](https://gitlab.com/graphviz/graphviz/-/blob/main/CHANGELOG.md?ref_type=heads#1001-2024-02-11)
through
[d3-graphviz](https://github.com/magjac/d3-graphviz)
version
[5.3.0](https://github.com/magjac/d3-graphviz/blob/master/CHANGELOG.md#530--2024-02-11).

### Fixed
* Entering a node named 'constructor' causes error and no graph rendered #265
* Having a node called toString hard crashes the editor #272

## [1.0.0] - 2024-01-21

### Added
* Show graph in fullscreen mode by clicking the fullscreen button or pressing the 'f' key in the graph.
* Editor search box. Opens with Ctrl-F.

### Changed
* Updated [Graphviz](https://graphviz.org/) from version [2.50.0](https://gitlab.com/graphviz/graphviz/-/blob/main/CHANGELOG.md?ref_type=heads#2500-2021-12-04) to version [9.0.0](https://gitlab.com/graphviz/graphviz/-/blob/main/CHANGELOG.md?ref_type=heads#900-2023-09-11) through [@hpcc-js/wasm](https://github.com/hpcc-systems/hpcc-js-wasm) version [2.14.1](https://github.com/hpcc-systems/hpcc-js-wasm/blob/trunk/CHANGELOG.md#2141-2023-10-12), containing a lot of improvements and fixes, including a fix for:
  * Failure of arrowhead and arrowtail to respect penwidth ([Graphviz issue #372](https://gitlab.com/graphviz/graphviz/issues/372))
* New look with blueish primary and greenish secondary color and a toolbar with a Graphviz logo, a blueish grid on white as background and slightly larger text buttons.
* More pronounced highlighting in the DOT source of nodes and edges selected in the graph, using shades of the blueish primary color.

### Fixed
* Lost characters when typing fast and DOT parsing errors occur #236
* New nodes created after linking nodes with a space in the label #215 (thanks @ygra)
* Keyboard shortcuts involving the control key in the graph doesn't work in Firefox on Ubuntu when the "Locate Pointer" feature is enabled #260

## [0.6.5] - 2022-02-24

### Changed
 * Add a snackbar showing when the application has been updated and if the underlying Graphviz version has been updated or not.
 * Make the version in the about dialog a link to the version in CHANGELOG.md.
 * Upgrade d3-graphviz to version 4.1.0 (Graphviz 2.50.0)
 * Bundle @hpcc-js/wasm instead of loading from unpkg
 * Added "Export as SVG" to main menu (thanks @pRizz).

## [0.6.4] - 2020-04-29
### Fixed
* Drawing edges or inserting nodes does not work in production bundle #139
* Navigating back to the referring page after URL import requires clicking back twice in the browser #155

## [0.6.3] - 2020-04-09
### Changed
* Upgraded [d3-graphviz](https://gitlab.com/magjac/d3-graphviz) to version [3.0.5](https://github.com/magjac/d3-graphviz/blob/master/CHANGELOG.md#305) thereby replacing [Viz.js](https://github.com/mdaines/viz.js/) with [@hpcc-js/wasm](https://github.com/hpcc-systems/hpcc-js-wasm).
* Upgraded [Graphviz](https://gitlab.com/graphviz/graphviz) to version [2.42.4](https://gitlab.com/graphviz/graphviz/-/releases/2.42.4) through [@hpcc-js/wasm](https://github.com/hpcc-systems/hpcc-js-wasm) version [0.3.11](https://github.com/hpcc-systems/hpcc-js-wasm/releases/tag/v0.3.11), including fixes for:
  * svg output displays TITLE of %3 if graph had no name ([Graphviz issue #1376](https://gitlab.com/graphviz/graphviz/issues/1376))
  * XML errors in generated SVG when URL attribute contains ampersand (&) ([Graphviz issue #1687](https://gitlab.com/graphviz/graphviz/issues/1687))

### Fixed
* Changing text editor hold-off time in settings has no effect until application is reloaded #128
* Selecting opacity with the opacity slider does not work in the node & edge default format color pickers #125

## 0.6.2
Never released

## [0.6.1] - 2020-01-03
### Fixed
* Module not found: Can't resolve './DoYouWantToDeleteDialog'. #93
* Stuck at "Starting the development server". #95
* Exported URL to graph shows the graph correctly, but the new URL is wrong. #97
* Characters are lost in the editor when typing fast. #99
* Selection by dragging the canvas does not work in Firefox. #102
* Ctrl- or Shift-click the canvas deselects already selected components. #107
* Unselected components are not cleared in text editor. #108

## [0.6.0] - 2018-10-01
### Added
* Export as URL. Generates a link to the application with the DOT source code as an URL parameter.
* Specification of the DOT source code through a URL parameter. #69
* Disabling of the undo and redo buttons when there is nothing to undo or redo.
* Allow multiple graphs to be stored in the browser's local storage. #70
  * Name and save a graph to local storage
  * Open a named graph from local storage
  * Allow sorting graphs on name, DOT source and last modification time in the open from browser dialog
  * Allow deleting graphs in the open from browser dialog
  * Show graph thumbnails and allow preview in the open from browser dialog
  * Create new empty graph
  * Rename current graph

### Fixed
* Ctrl-Y and Ctrl-Z descriptions are missing in the keyboard shortcuts help dialog. #90
* If the DOT source is cleared when an error is indicated in the text editor, the old error message is still displayed. #88
* When the DOT source is cleared in the text editor, the old graph is still visible. #87
* The error button in the text editor might be covered by the highlighting of the current line. #85
* Corrected size of GitHub icon in app bar.
* When inserting a node with default shape by click in the node shape insert panel, the node gets an incorrect shape. #77
* The selection indication in the graph is cleared when a node is inserted. #78
* The graph pane is not focused after inserting a node shape from node shape insert panel. #58

## [0.5.0] - 2018-09-19
### Added
* Display of progress indicator when rendering of graph takes longer than 800 ms. #38
* Indication of focused pane by increasing its elevation, thereby making it cast more shadow. #39
* User configuration of transition duration. #52
* User configuration of tweening precision. #44
* User configuration of path & shape tweening enable/disable. #43

### Fixed
* Lost undo/redo history when node or edge format drawer is opened. #53

## [0.4.0] - 2018-09-15
### Added
* User configurable text editor tab size. #41
* User configurable text editor font size. #42
* Undo and redo from the Graph pane throgh Ctrl-Z & Ctrl-Y. #36
* Undo and redo from buttons in the app bar. #37
* Scrolling of text editor error indication into view through a button. #46
* Automatic scrolling of text editor error indication into view. #46
* Highlighting of nodes and edges in the text editor when selected in the graph. #35

### Fixed
* When the Settings dialog needs a scroll bar there is one scroll bar for each
  section instead of just one for the whole dialog. #45

## [0.3.1] - 2018-09-13
### Fixed
* Error indication in text editor is cleared even though the error is still present. #33

## [0.3.0] - 2018-09-13
### Added
* Support graphical delete of nodes and edges between nodes in arbitrarily formatted DOT source code. #15
* Support graphical insert of nodes and edges in arbitrarily formatted DOT source code. #27

### Fixed
* Nodes with quoted node id cannot be deleted. #21

## [0.2.1] - 2018-09-11
### Fixed
* DOT errors are not always indicated in the text editor. #29
* Characters are lost in the editor when typing fast and DOT parsing errors occur. #22

## [0.2.0] - 2018-08-29
### Added
* Selection of all nodes and edges in the graph with Ctrl-A. #13
* Selection of all edges in the graph with Shift-Ctrl-A. #14
* GitHub button in the app bar linking to the repository. #18
* Open source and GitHub text and links in the about dialog. #20
* Description of the application in the about dialog.
* Configurable editor hold-off time in the settings dialog.

### Changed
* Improved response time by not attempting to render the graph when the DOT source is incorrect.
* Improved response time by not re-rendering the graph when the DOT source is unchanged. #19

## [0.1.0] - 2018-08-24
### Added
* Cut/Copy-and-paste of nodes within subgraphs. #16

### Fixed
* Keyboard input is targeted to the text editor even efter certain mouse operations in the graph. #11
* Cut/Copy-and-paste of a node only indirectly declared with and edge specification in the DOT source throws error. #7
* Drag area select does not select anything if the mouse button is released outside the canvas. #6
* Middle-mouse node insertion does not work in Chrome. #5
* De-selecting selected nodes and edges by clicking the canvas does not work in Chrome. #4
* Drawing an edge throws an error in Chrome, but works otherwise. #3
* Inserting a node with shape note, tab, box3d or others throws an error in Chrome, but works otherwise. #2
* Drag-and-drop insert node doesn't work in Chrome. #1

## [0.0.2] - 2018-08-21
### Fixed
* Added a package-lock.json file to fix the dependencies at installation.

## [0.0.1] - 2018-08-21
### Added
* Rendering of a graph from a textual DOT representation.
* Panning and zooming the graph.
* Editing the DOT source in a context sensitive text editor.
* Visual editing of the graph through mouse interactions:
  * Insert node shapes by click or drag-and-drop.
  * Select default node style, color and fillcolor.
  * Draw edges between nodes.
  * Select nodes and edges by click or by area drag.
  * Delete selected nodes and edges.
  * Cut/Copy-and-paste a selected node.
* Automatic update of the DOT source when the graph is visually edited.
* Automatic update of the graph when the DOT source is edited.
* Animated transition of the graph into a new state when changes are made.
* Preservation of the DOT source and the application state during page reloads
  by automatic save and retrieve to/from local storage in the browser.
* Options:
  * Automatically fit the graph to the available drawing area.
  * Select Graphviz layout engine.
* On-line help:
  * Keyboard shortcuts
  * Mouse interactions

[Unreleased]: https://github.com/magjac/graphviz-visual-editor/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/magjac/graphviz-visual-editor/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/magjac/graphviz-visual-editor/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/magjac/graphviz-visual-editor/compare/v0.6.5...v1.0.0
[0.6.5]: https://github.com/magjac/graphviz-visual-editor/compare/v0.6.4...v0.6.5
[0.6.4]: https://github.com/magjac/graphviz-visual-editor/compare/v0.6.3...v0.6.4
[0.6.3]: https://github.com/magjac/graphviz-visual-editor/compare/v0.6.1...v0.6.3
[0.6.1]: https://github.com/magjac/graphviz-visual-editor/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/magjac/graphviz-visual-editor/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/magjac/graphviz-visual-editor/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/magjac/graphviz-visual-editor/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/magjac/graphviz-visual-editor/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/magjac/graphviz-visual-editor/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/magjac/graphviz-visual-editor/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/magjac/graphviz-visual-editor/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/magjac/graphviz-visual-editor/compare/v0.0.2...v0.1.0
[0.0.2]: https://github.com/magjac/graphviz-visual-editor/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/magjac/graphviz-visual-editor/compare/...v0.0.1
