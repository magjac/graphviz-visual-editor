# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
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

[Unreleased]: https://github.com/magjac/graphviz-visual-editor/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/magjac/graphviz-visual-editor/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/magjac/graphviz-visual-editor/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/magjac/graphviz-visual-editor/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/magjac/graphviz-visual-editor/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/magjac/graphviz-visual-editor/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/magjac/graphviz-visual-editor/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/magjac/graphviz-visual-editor/compare/v0.0.2...v0.1.0
[0.0.2]: https://github.com/magjac/graphviz-visual-editor/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/magjac/graphviz-visual-editor/compare/...v0.0.1
