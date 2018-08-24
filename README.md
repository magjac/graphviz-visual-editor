# graphviz-visual-editor

Try it at http://magjac.com/graphviz-visual-editor.

A web application for interactive visual editing of [Graphviz](http://www.graphviz.org) graphs described in the [DOT](https://www.graphviz.org/doc/info/lang.html) language.

*Disclaimer: This project just started (2018-07-17) and so far contains just some basic features. Apart from on-line help regarding keyboard shortcuts and mouse operations, there's still **no documentation** of the the rest of the UI (although it's fairly intuitive). The UI is probably going to change a lot in upcoming releases (The author is learning [Material UI](https://material-ui.com/) and [React](https://material-ui.com/) while coding).*

That said, it's perfectly possible to use it in its current state :smiley:.

## Installation ##

```
git clone https://github.com/magjac/graphviz-visual-editor
cd graphviz-visual-editor
npm install
make
npm run start
```

**NOTE:** The *make* stage emits a few warnings. Ignore them.

To create an optimized build of the application:

```
npm run build
```

Learn more from the Create React App [README](https://github.com/facebook/create-react-app#npm-run-build-or-yarn-build) and [User Guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment).

## Implemented Features ##

* Rendering of a graph from a textual [DOT](https://www.graphviz.org/doc/info/lang.html) representation.
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
* Preservation of the DOT source and the application state during page reloads by automatic save and retrieve to/from local storage in the browser.
* Options:
  * Automatically fit the graph to the available drawing area.
  * Select Graphviz layout engine.
* On-line help:
  * Keyboard shortcuts
  * Mouse interactions

## Tested Browsers ##

* Firefox 61.0.1
* Chrome 64.0.3282.167

## Currently Known Limitations ##

Apart from the numerous cool features that are missing; here's a list of known limitations in the features that do exist:

* The visual editing capabilities requires the DOT source to be organized with only one node or edge per line, since they currently operate by inserting or deleting complete lines.

## Roadmap ##

* Implement some of the nicest-to-have features, learn from that and rework the UI.
* Provide documentation.
* Open up for collaboration.
