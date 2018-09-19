# graphviz-visual-editor

Try it at http://magjac.com/graphviz-visual-editor.

A web application for interactive visual editing of [Graphviz](http://www.graphviz.org) graphs described in the [DOT](https://www.graphviz.org/doc/info/lang.html) language.

[![CircleCI](https://circleci.com/gh/magjac/graphviz-visual-editor.svg?style=svg)](https://circleci.com/gh/magjac/graphviz-visual-editor)
[![codecov](https://codecov.io/gh/magjac/graphviz-visual-editor/branch/master/graph/badge.svg)](https://codecov.io/gh/magjac/graphviz-visual-editor)

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
  * Select nodes and edges by click or by area drag and mark them in the text editor.
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

## Known Issues ##

Known issues are **not listed here**.

All known bugs and enhancement requests are reported as issues on [GitHub](https://github.com/magjac/graphviz-visual-editor) and are listed under the [Issues](https://github.com/magjac/graphviz-visual-editor/issues) tab.

### [All open issues](https://github.com/magjac/graphviz-visual-editor/issues) ###

Lists both bugs and enhancement requests.

### [Known open bugs](https://github.com/magjac/graphviz-visual-editor/labels/bug) ###

### [Open enhancement requests](https://github.com/magjac/graphviz-visual-editor/labels/enhancement) ###

### [Known limitations](https://github.com/magjac/graphviz-visual-editor/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Abug+label%3Aenhancement) ###

A limitation is a feature deliberately released without full functionality. A limitation is classifed both as a bug and as an enhancement request to reflect that although it's an enhancement not yet implemented from the author's perspective, it might be perceived as a bug from the user's perspective).

### [Closed issues](https://github.com/magjac/graphviz-visual-editor/issues?q=is%3Aissue+is%3Aclosed) ###

## Roadmap ##

There are numerous cool features missing. They are or will be listed as [enhancement requests](https://github.com/magjac/graphviz-visual-editor/labels/enhancement) on [GitHub](https://github.com/magjac/graphviz-visual-editor).

There is also a [project board](https://github.com/magjac/graphviz-visual-editor/projects/1) showing the short-term activities.

The medium-term plan is:

* Implement some of the nicest-to-have features, learn from that and rework the UI.
* Provide documentation.
* Open up for collaboration.
