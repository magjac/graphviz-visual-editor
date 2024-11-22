# graphviz-visual-editor

Try it at http://magjac.com/graphviz-visual-editor.

A web application for interactive visual editing of [Graphviz](http://www.graphviz.org) graphs described in the [DOT](https://www.graphviz.org/doc/info/lang.html) language.

[![CircleCI](https://circleci.com/gh/magjac/graphviz-visual-editor.svg?style=svg)](https://circleci.com/gh/magjac/graphviz-visual-editor)
[![codecov](https://codecov.io/gh/magjac/graphviz-visual-editor/branch/master/graph/badge.svg)](https://codecov.io/gh/magjac/graphviz-visual-editor)

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

## Docker ##
To run this on a system without `make` and `node` you can use Docker.
The provided `docker-compose.yml` file builds a Docker image from the latest master commit of the current repository, starts the server and exposes port 3000.

To use it:

```
git clone --depth 1 https://github.com/magjac/graphviz-visual-editor
cd graphviz-visual-editor
docker-compose up -d
```
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
* Export graph as URL and import graph from such an URL.
* Export graph as SVG.
* Options:
  * Automatically fit the graph to the available drawing area.
  * Select Graphviz layout engine.
* On-line help:
  * Keyboard shortcuts
  * Mouse interactions

## Tested Browsers ##

* Firefox 71
* Chrome 79

## Known Issues ##

Known issues are **not listed here**.

All known bugs and enhancement requests are reported as issues on [GitHub](https://github.com/magjac/graphviz-visual-editor) and are listed under the [Issues](https://github.com/magjac/graphviz-visual-editor/issues) tab.

### [All open issues](https://github.com/magjac/graphviz-visual-editor/issues) ###

Lists both bugs and enhancement requests.

### [Known open bugs](https://github.com/magjac/graphviz-visual-editor/labels/bug) ###

### [Open enhancement requests](https://github.com/magjac/graphviz-visual-editor/labels/enhancement) ###

### [Known limitations](https://github.com/magjac/graphviz-visual-editor/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Abug+label%3Aenhancement) ###

A limitation is a feature deliberately released without full functionality. A limitation is classifed both as a bug and as an enhancement request to reflect that although it's an enhancement not yet implemented from the author's perspective, it might be perceived as a bug from the user's perspective.

### [Closed issues](https://github.com/magjac/graphviz-visual-editor/issues?q=is%3Aissue+is%3Aclosed) ###

## Roadmap ##

There are numerous cool features missing. They are or will be listed as [enhancement requests](https://github.com/magjac/graphviz-visual-editor/labels/enhancement) on [GitHub](https://github.com/magjac/graphviz-visual-editor).

There is also a [project board](https://github.com/magjac/graphviz-visual-editor/projects/1) showing the short-term activities.
