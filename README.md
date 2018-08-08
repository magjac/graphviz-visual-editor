# graphviz-visual-editor

A web application for interactive visual editing of [Graphviz](http://www.graphviz.org) graphs described in the [DOT](https://www.graphviz.org/doc/info/lang.html) language.

*Disclaimer: This project just started (2018-07-17) and so far contains just some basic features. There's still **no documentation**, to some extent the **UI is horrible** (The author is learning [Material UI](https://material-ui.com/) and [React](https://material-ui.com/) while coding) and **some choices in the UI does nothing***.

That said, it's perfectly possible to use it in its current state :smiley:.

## Implemented Features ##

* Render a graph from a textual [DOT](https://www.graphviz.org/doc/info/lang.html) repesentation.
* Pan and zoom of the graph.
* Edit the DOT source in a context sensitive text editor.
* Visually edit the graph through mouse interactions:
  * Insert node shapes by click or drag-and-drop.
  * Select default node style, color and fillcolor.
  * Draw edges between nodes.
  * Select nodes and edges by click or by area drag.
  * Delete selected nodes and edges.
  * Copy a selected node.
* Update the DOT source automatically when the graph is edited.
* Animate the changes made to the graph.
* Keep the DOT source and the application state during page reload by automatic save and retrieve to/from local storage in the browser.
* Option to fit the graph to the avaible drawing area.

## Currently Known Limitations ##

Apart from the numerous cool features that are missing; here's a list of known limitations in the features that do exist:

* The visual editing capabilities requires the DOT source to be organized with only one node or edge per line since it currently operates by inserting or deleting complete lines.
* Cut/Copy-and-paste of nodes in subgraphs is not yet supported.

## Roadmap ##

* Implement some of the nicest-to-have features, learn from that and rework the UI.
* Make the application available through a web server (it actually already is, but the location is still a secret :stuck_out_tongue:).
* Provide documentation.
* Open up for collaboration.
