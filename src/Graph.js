import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { select as d3_select} from 'd3-selection';
import { selectAll as d3_selectAll} from 'd3-selection';
import { transition as d3_transition} from 'd3-transition';
import { event as d3_event} from 'd3-selection';
import { mouse as d3_mouse} from 'd3-selection';
import { schemeCategory10 as d3_schemeCategory10} from 'd3-scale-chromatic';
import { schemePaired as d3_schemePaired} from 'd3-scale-chromatic';
import 'd3-graphviz';
import * as dot from './dot'

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
};

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.createGraph = this.createGraph.bind(this)
    this.isDrawingEdge = false;
    this.isDrawingNode = false;
    this.startNode = null;
    this.selectedEdge = d3_select(null);
    this.selectedEdgeFill = null;
    this.selectedEdgeStroke = null;
    this.selectedNode = d3_select(null);
    this.selectedNodeStroke = null;
    this.selectedNodeFill = null;
    this.nodeIndex = null;
    this.edgeIndex = null;
    this.pendingUpdate = false;
    this.rendering = false;
    /* Shapes and comments from https://gitlab.com/graphviz/graphviz/blob/master/lib/common/shapes.c */
    this.shapes = [
      "box",
      "polygon",
      "ellipse",
      "oval",
      "circle",
      "point",
      "egg",
      "triangle",
      "none",
      "plaintext",
      "plain",
      "diamond",
      "trapezium",
      "parallelogram",
      "house",
      "pentagon",
      "hexagon",
      "septagon",
      "octagon",
      "note",
      "tab",
      "folder",
      "box3d",
      "component",
      "cylinder",
      "rect",
      "rectangle",
      "square",
      "doublecircle",
      "doubleoctagon",
      "tripleoctagon",
      "invtriangle",
      "invtrapezium",
      "invhouse",
      "underline",
      "Mdiamond",
      "Msquare",
      "Mcircle",
      /* non-convex polygons */
      /* biological circuit shapes, as specified by SBOLv*/
      /** gene expression symbols **/
      "promoter",
      "cds",
      "terminator",
      "utr",
      "insulator",
      "ribosite",
      "rnastab",
      "proteasesite",
      "proteinstab",
      /** dna construction symbols **/
      "primersite",
      "restrictionsite",
      "fivepoverhang",
      "threepoverhang",
      "noverhang",
      "assembly",
      "signature",
      "rpromoter",
      "larrow",
      "rarrow",
      "lpromoter",
      /*  *** shapes other than polygons  *** */
      "record",
      "Mrecord",
    //  "epsf",
      "star",
    ];

  }

  componentDidMount() {
    this.createGraph()
  }

  componentDidUpdate() {
    this.createGraph()
  }

  handleError(errorMessage) {
    // FIXME
    this.rendering = false;
    if (this.pendingUpdate) {
        this.pendingUpdate = false;
        this.render();
    }
  }

  createGraph() {
    let width = this.node.parentElement.clientWidth;
    let height = this.node.parentElement.clientHeight;
    let fit = this.props.fit;
    if (this.props.dotSrc.length === 0) {
      return;
    }
    if (this.rendering) {
        this.pendingUpdate = true;
        return;
    }
    this.rendering = true;
    this.graphviz = d3_select(this.node).graphviz()
      .width(width)
      .height(height)
      .fit(fit)
      .transition(() => d3_transition().duration(1000))
      .onerror(this.handleError.bind(this))
      .on('initEnd', () => this.renderGraph.call(this));
    this.props.registerDrawNode(this.graphviz.drawNode.bind(this.graphviz));
  }

  renderGraph() {
    this.graphviz.renderDot(this.props.dotSrc, this.addEventHandlers.bind(this));
  }

  addEventHandlers() {
    var svg = d3_select(this.node).selectWithoutDataPropagation("svg");
    var nodes = svg.selectAll(".node");
    var edges = svg.selectAll(".edge");

    d3_select(window).on("resize", this.resizeSVG.bind(this));
    d3_select(document).on("click", this.handleClickOutside.bind(this));
    d3_select(document).on("keyup", this.handleKeyUpOutside.bind(this));
    d3_select(document).on("mousemove", this.handleMouseMove.bind(this));
    d3_select(document).on("contextmenu", this.handleRightClickOutside.bind(this));
    nodes.on("click mousedown", this.handleClickNode.bind(this));
    nodes.on("dblclick", this.handleDblClickNode.bind(this));
    nodes.on("contextmenu", this.handleRightClickNode.bind(this));
    edges.on("click mousedown", this.handleClickEdge.bind(this));

    this.rendering = false;
    if (this.pendingUpdate) {
      this.pendingUpdate = false;
      this.createGraph();
    }
  }

  handleClickOutside(d, i, nodes) {
    var event = d3_event;
    if (event.target.nodeName !== 'svg' && event.target.parentElement.id !== 'graph0' && event.target !== this.node) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.unSelectEdge();
    this.unSelectNode();
    if (event.which === 2) {
      var graph0 = d3_select(nodes[i]).selectWithoutDataPropagation("svg").selectWithoutDataPropagation("g");
      var [x0, y0] = d3_mouse(graph0.node());
      if (this.nodeIndex === null) {
        this.nodeIndex = d3_selectAll('.node').size();
      } else {
        this.nodeIndex += 1;
      }
      var shape = this.shapes[this.nodeIndex % this.shapes.length];
      var numLetters = 'z'.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
      var letter = String.fromCharCode('a'.charCodeAt(0) + (this.nodeIndex % numLetters));
      var digit = Math.floor(this.nodeIndex / numLetters) || '';
      var nodeName = letter + digit;
      var fillcolor = d3_schemeCategory10[this.nodeIndex % 10];
      var color = 'black';
      var attributes = {
        shape: shape,
        style: 'filled',
        fillcolor: fillcolor,
        color: color,
      };
      this.graphviz
        .drawNode(x0, y0, nodeName, attributes)
        .insertDrawnNode(nodeName);
      var dotSrcLines = this.props.dotSrc.split('\n');
      dot.insertNode(dotSrcLines, nodeName, attributes);
      this.props.onTextChange(dotSrcLines.join('\n'));
    }
  }

  handleKeyUpOutside(d, i, nodes) {
    var event = d3_event;
    if (event.target.nodeName !== 'BODY') {
      return;
    }
    event.preventDefault();
    if (event.key === 'Escape') {
      this.graphviz.removeDrawnEdge();
      this.unSelectEdge();
      this.unSelectNode();
    }
    if (event.key === 'Delete') {
      this.deleteSelectedEdge.call(this);
      this.deleteSelectedNode.call(this);
      this.graphviz.removeDrawnEdge();
    }
    this.isDrawingEdge = false;
  }

  handleMouseMove(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    var graph0 = d3_select(this.node).selectWithoutDataPropagation("svg").selectWithoutDataPropagation("g");
    var [x0, y0] = d3_mouse(graph0.node());
    var shortening = 2; // avoid mouse pointing on edge
    if (this.isDrawingEdge) {
      this.graphviz
        .moveDrawnEdgeEndPoint(x0, y0,  {shortening: shortening})
    }
  }

  handleClickNode(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    if (!this.isDrawingEdge && event.which === 1) {
      this.unSelectEdge();
      this.selectNode(d3_select(nodes[i]));
    }
  }

  handleDblClickNode(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    this.unSelectEdge();
    if (this.isDrawingEdge) {
      var endNode = d3_select(nodes[i]);
      var startNodeName = this.startNode.selectWithoutDataPropagation("title").text();
      var endNodeName = endNode.selectWithoutDataPropagation("title").text();
      this.graphviz
        .insertDrawnEdge(startNodeName + '->' + endNodeName);
      let attributes = {
        color: d3_schemePaired[(this.edgeIndex * 2 + 1) % 12],
        fillcolor: d3_schemePaired[(this.edgeIndex * 2) % 12],
      };
      var dotSrcLines = this.props.dotSrc.split('\n');
      dot.insertEdge(dotSrcLines, startNodeName, endNodeName, attributes);
      this.props.onTextChange(dotSrcLines.join('\n'));
    }
    this.isDrawingEdge = false;
  }

  handleRightClickNode(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    this.unSelectEdge();
    this.unSelectNode();
    this.graphviz.removeDrawnEdge();
    this.startNode = d3_select(nodes[i]);
    var graph0 = d3_select(this.node).selectWithoutDataPropagation("svg").selectWithoutDataPropagation("g");
    var [x0, y0] = d3_mouse(graph0.node());
    if (this.edgeIndex === null) {
      this.edgeIndex = d3_selectAll('.edge').size();
    } else {
      this.edgeIndex += 1;
    }
    var fillcolor = d3_schemePaired[(this.edgeIndex * 2) % 12];
    var color = d3_schemePaired[(this.edgeIndex * 2 + 1) % 12];

    this.graphviz
      .drawEdge(x0, y0, x0, y0, {fillcolor: fillcolor, color: color});
    this.isDrawingEdge = true;
  }

  handleClickEdge(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    this.unSelectNode();
    this.selectEdge(d3_select(nodes[i]));
  }

  handleRightClickOutside(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    this.unSelectEdge();
    this.unSelectNode();
  }

  selectEdge(edge) {
    this.unSelectEdge();
    this.selectedEdge = edge;
    this.selectedEdgeFill = this.selectedEdge.selectAll('polygon').attr("fill");
    this.selectedEdgeStroke = this.selectedEdge.selectAll('polygon').attr("stroke");
    this.selectedEdge.selectAll('path, polygon').attr("stroke", "red");
    this.selectedEdge.selectAll('polygon').attr("fill", "red");
  }

  unSelectEdge() {
    this.selectedEdge.selectAll('path, polygon').attr("stroke", this.selectedEdgeStroke);
    this.selectedEdge.selectAll('polygon').attr("fill", this.selectedEdgeFill);
    this.selectedEdge = d3_select(null);
  }

  deleteSelectedEdge() {
    this.selectedEdge.style("display", "none");
    if (this.selectedEdge.size() !== 0) {
      var edgeName = this.selectedEdge.selectWithoutDataPropagation("title").text();
      edgeName = edgeName.replace('->', ' -> ');
      var dotSrcLines = this.props.dotSrc.split('\n');
      dot.deleteEdge(dotSrcLines, edgeName);
      this.props.onTextChange(dotSrcLines.join('\n'));
    }
  }

  selectNode(node) {
    this.unSelectNode();
    this.selectedNode = node;
    this.selectedNodeFill = this.selectedNode.selectAll('polygon, ellipse').attr("fill");
    this.selectedNodeStroke = this.selectedNode.selectAll('polygon, ellipse').attr("stroke");
    this.selectedNode.selectAll('polygon, ellipse').attr("stroke", "red");
    this.selectedNode.selectAll('polygon, ellipse').attr("fill", "red");
  }

  unSelectNode() {
    this.selectedNode.selectAll('polygon, ellipse').attr("stroke", this.selectedNodeStroke);
    this.selectedNode.selectAll('polygon, ellipse').attr("fill", this.selectedNodeFill);
    this.selectedNode = d3_select(null);
  }

  deleteSelectedNode() {
    this.selectedNode.style("display", "none");
    if (this.selectedNode.size() !== 0) {
      var nodeName = this.selectedNode.selectWithoutDataPropagation("title").text();
      var dotSrcLines = this.props.dotSrc.split('\n');
      dot.deleteNode(dotSrcLines, nodeName);
      this.props.onTextChange(dotSrcLines.join('\n'));
    }
  }

  resizeSVG() {
    let width = this.node.parentElement.clientWidth;
    let height = this.node.parentElement.clientHeight;
    let fit = this.props.fit;
    let svg = d3_select(this.node).selectWithoutDataPropagation("svg");

    svg
      .attr("width", width)
      .attr("height", height);
    if (!fit) {
      svg
        .attr("viewBox", `0 0 ${width * 3 / 4} ${height * 3 / 4}`);
    }
  };

  handleNodeShapeDragOver = (event) => {
    event.preventDefault();
  };

  handleNodeShapeDrop = (event) => {
    event.preventDefault();
    let graph0 = d3_select(this.node).selectWithoutDataPropagation("g");
    let node = graph0.node();
    var svg = node.ownerSVGElement;
    var point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    var [x0, y0] = [point.x, point.y];
    let attributes = {
      shape: event.dataTransfer.getData("text"),
    }
    let nodeName = attributes.shape;
    this.graphviz.drawNode(x0, y0, nodeName, attributes);
    this.graphviz.insertDrawnNode(nodeName);
    let dotSrcLines = this.props.dotSrc.split('\n');
    dot.insertNode(dotSrcLines, nodeName, attributes);
    this.props.onTextChange(dotSrcLines.join('\n'));
  };

  render() {
    return <div
             ref={node => this.node = node}
             draggable="true"
             onDragOver={this.handleNodeShapeDragOver}
             onDrop={this.handleNodeShapeDrop.bind(this)}
           >
           </div>;
  }
}

Graph.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Graph);
