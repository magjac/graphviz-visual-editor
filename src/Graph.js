import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { select as d3_select} from 'd3-selection';
import { selectAll as d3_selectAll} from 'd3-selection';
import { transition as d3_transition} from 'd3-transition';
import { zoomIdentity as d3_zoomIdentity} from 'd3-zoom';
import { zoomTransform as d3_zoomTransform} from 'd3-zoom';
import { event as d3_event} from 'd3-selection';
import { mouse as d3_mouse} from 'd3-selection';
import { schemePaired as d3_schemePaired} from 'd3-scale-chromatic';
import 'd3-graphviz';
import DotGraph from './dot'

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
};

const componentElements = [
  'ellipse',
  'polygon',
  'path',
  'polyline',
];
const componentElementsString = componentElements.join(',');


class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.createGraph = this.createGraph.bind(this)
    this.renderGraph = this.renderGraph.bind(this)
    this.isDrawingEdge = false;
    this.isDrawingNode = false;
    this.startNode = null;
    this.selectedComponents = d3_selectAll(null);
    this.selectedComponentsFill = [];
    this.selectedComponentsStroke = [];
    this.selectArea = null;
    this.currentNodeAttributes = {
      style: 'filled',
      fillcolor: 'transparent'
    }
    this.currentNodeName = null;
    this.nodeIndex = null;
    this.edgeIndex = null;
    this.pendingUpdate = false;
    this.rendering = false;
  }

  componentDidMount() {
    this.createGraph()
  }

  componentDidUpdate() {
    this.renderGraph()
  }

  handleError(errorMessage) {
    let line = errorMessage.replace(/.*error in line ([0-9]*) .*\n/, '$1');
    this.props.onError({message: errorMessage, line: line});
    this.rendering = false;
    if (this.pendingUpdate) {
        this.pendingUpdate = false;
        this.render();
    }
  }

  createGraph() {
    this.graphviz = d3_select(this.node).graphviz()
      .onerror(this.handleError.bind(this))
      .on('initEnd', () => this.renderGraph.call(this));
    this.props.registerNodeShapeClick(this.handleNodeShapeClick);
    this.props.registerNodeShapeDragStart(this.handleNodeShapeDragStart);
    this.props.registerNodeShapeDragEnd(this.handleNodeShapeDragEnd);
    this.props.registerZoomInButtonClick(this.handleZoomInButtonClick);
    this.props.registerZoomOutButtonClick(this.handleZoomOutButtonClick);
    this.props.registerZoomOutMapButtonClick(this.handleZoomOutMapButtonClick);
    this.props.registerZoomResetButtonClick(this.handleZoomResetButtonClick);
  }

  renderGraph() {
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
    this.graphviz
      .width(width)
      .height(height)
      .fit(fit)
      .renderDot(this.props.dotSrc, this.handleRenderGraphReady.bind(this))
      .on("renderEnd", () => this.setZoomScale(1, true));
  }

  handleRenderGraphReady() {
    this.addEventHandlers();
    this.rendering = false;
    if (!this.renderGraphReady) {
      this.renderGraphReady = true;
      this.graphviz
        .transition(() => d3_transition().duration(1000));
      this.props.onInitialized();
    }
    if (this.pendingUpdate) {
      this.pendingUpdate = false;
      this.renderGraph();
    }
  }

  handleZoomInButtonClick = () => {
    let scale = d3_zoomTransform(this.graphviz._zoomSelection.node()).k;
    scale = scale * 1.2;
    this.setZoomScale(scale);
  }

  handleZoomOutButtonClick = () => {
    let scale = d3_zoomTransform(this.graphviz._zoomSelection.node()).k;
    scale = scale / 1.2;
    this.setZoomScale(scale);
  }

  handleZoomOutMapButtonClick = () => {
    var svg = d3_select(this.node).selectWithoutDataPropagation("svg");
    var graph0 = svg.selectWithoutDataPropagation("g");
    let viewBox = svg.attr("viewBox").split(' ');
    let bbox = graph0.node().getBBox();
    let xRatio = viewBox[2] / bbox.width;
    let yRatio = viewBox[3] / bbox.height;
    let scale = Math.min(xRatio, yRatio);
    this.setZoomScale(scale, true);
  }

  handleZoomResetButtonClick = () => {
    this.setZoomScale(1, true);
  }

  setZoomScale = (scale, center=false) => {
    var svg = d3_select(this.node).selectWithoutDataPropagation("svg");
    var graph0 = svg.selectWithoutDataPropagation("g");
    let viewBox = svg.attr("viewBox").split(' ');
    let bbox = graph0.node().getBBox();
    let {x, y, k} = d3_zoomTransform(this.graphviz._zoomSelection.node());
    let [x0, y0, scale0] = [x, y, k];
    let xOffset0 = x0 + bbox.x * scale0;
    let yOffset0 = y0 + bbox.y * scale0;
    let xCenter = viewBox[2] / 2;
    let yCenter = viewBox[3] / 2;
    let xOffset;
    let yOffset;
    if (center) {
      xOffset = (viewBox[2] - bbox.width * scale) / 2;
      yOffset = (viewBox[3] - bbox.height * scale) / 2;
    } else {
      xOffset = xCenter - (xCenter - xOffset0) * scale / scale0;
      yOffset = yCenter - (yCenter - yOffset0) * scale / scale0;
    }
    x = -bbox.x * scale + xOffset;
    y = -bbox.y * scale + yOffset;
    let transform = d3_zoomIdentity.translate(x, y).scale(scale);
    this.graphviz._zoomSelection.call(this.graphviz._zoomBehavior.transform, transform);
  }

  addEventHandlers() {
    this.graphviz._zoomBehavior.filter(function () {
      if (d3_event.type === 'mousedown' && !d3_event.ctrlKey) {
        return false;
      } else {
        return true;
      }
    });
    this.dotGraph = new DotGraph(this.props.dotSrc);

    var svg = d3_select(this.node).selectWithoutDataPropagation("svg");
    var nodes = svg.selectAll(".node");
    var edges = svg.selectAll(".edge");

    d3_select(window).on("resize", this.resizeSVG.bind(this));
    d3_select(document).on("click", this.handleClickOutside.bind(this));
    d3_select(document).on("keyup", this.handleKeyUpOutside.bind(this));
    d3_select(document).on("mousemove", this.handleMouseMove.bind(this));
    d3_select(document).on("contextmenu", this.handleRightClickOutside.bind(this));
    svg.on("mousedown", this.handleMouseDownSvg.bind(this));
    svg.on("mousemove", this.handleMouseMoveSvg.bind(this));
    svg.on("mouseup", this.handleMouseUpSvg.bind(this));
    nodes.on("click mousedown", this.handleClickNode.bind(this));
    nodes.on("dblclick", this.handleDblClickNode.bind(this));
    nodes.on("contextmenu", this.handleRightClickNode.bind(this));
    edges.on("click mousedown", this.handleClickEdge.bind(this));

  }

  handleClickOutside(d, i, nodes) {
    var event = d3_event;
    if (event.target.nodeName !== 'svg' && event.target.parentElement.id !== 'graph0' && event.target !== this.node) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.unSelectComponents();
    if (event.which === 2) {
      var graph0 = d3_select(nodes[i]).selectWithoutDataPropagation("svg").selectWithoutDataPropagation("g");
      var [x0, y0] = d3_mouse(graph0.node());
      this.insertNodeWithCurrentAttributes(x0, y0, this.currentNodeAttributes);
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
      this.unSelectComponents();
    }
    if (event.key === 'Delete') {
      this.deleteSelectedComponents.call(this);
      this.graphviz.removeDrawnEdge();
    }
    if (event.ctrlKey && event.key === 'c') {
      let nodes = this.selectedComponents.filter('.node');
      if (nodes.size() > 0) {
          let nodeName = nodes.selectWithoutDataPropagation("title").text();
          this.currentNodeAttributes = this.dotGraph.getNodeAttributes(nodeName);
      }
    }
    if (event.ctrlKey && event.key === 'v') {
      this.insertNodeWithCurrentAttributes(null, null, this.currentNodeAttributes);
    }
    if (event.ctrlKey && event.key === 'x') {
      let nodes = this.selectedComponents.filter('.node');
      if (nodes.size() > 0) {
          let nodeName = nodes.selectWithoutDataPropagation("title").text();
          this.currentNodeAttributes = this.dotGraph.getNodeAttributes(nodeName);
      }
      this.deleteSelectedComponents.call(this);
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
      this.unSelectComponents();
      this.selectComponents(d3_select(nodes[i]));
    }
  }

  handleDblClickNode(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    this.unSelectComponents();
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
      this.dotGraph.insertEdge(startNodeName, endNodeName, attributes);
      this.props.onTextChange(this.dotGraph.dotSrc);
    }
    this.isDrawingEdge = false;
  }

  handleRightClickNode(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    this.unSelectComponents();
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
    this.unSelectComponents();
    this.selectComponents(d3_select(nodes[i]));
  }

  handleRightClickOutside(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    this.unSelectComponents();
  }

  handleMouseDownSvg(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    if (this.selectArea) {
      this.selectArea.selection.remove();
    }
    var graph0 = d3_select(this.node).selectWithoutDataPropagation("svg").selectWithoutDataPropagation("g");
    var [x0, y0] = d3_mouse(graph0.node());
    this.selectArea = {x0: x0, y0: y0};
    this.selectArea.selection = graph0.append("rect")
      .attr("x", x0)
      .attr("y", y0)
      .attr("width", 0)
      .attr("height", 0)
      .attr("fill", '#99ccff')
      .attr("stroke", '#0000dd')
      .style('stroke-width', 0.5)
      .style('fill-opacity', 0.3);
  }

  handleMouseMoveSvg(d, i, nodes) {
    var event = d3_event;
    if (this.selectArea) {
      event.preventDefault();
      event.stopPropagation();
      var graph0 = d3_select(this.node).selectWithoutDataPropagation("svg").selectWithoutDataPropagation("g");
      let {x0, y0} = this.selectArea;
      var [x1, y1] = d3_mouse(graph0.node());
      let x = Math.min(x0, x1);
      let y = Math.min(y0, y1);
      let width = Math.abs(x1 - x0);
      let height = Math.abs(y1 - y0);
      this.selectArea.selection
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height);
    }
  }

  handleMouseUpSvg(d, i, nodes) {
    var event = d3_event;
    if (this.selectArea) {
      event.preventDefault();
      event.stopPropagation();
      this.selectArea.selection.remove();
      var graph0 = d3_select(this.node).selectWithoutDataPropagation("svg").selectWithoutDataPropagation("g");
      let {x0, y0} = this.selectArea;
      var [x1, y1] = d3_mouse(graph0.node());
      let x = Math.min(x0, x1);
      let y = Math.min(y0, y1);
      let width = Math.abs(x1 - x0);
      let height = Math.abs(y1 - y0);
      if (width === 0 && height === 0) {
        return;
      }
      let components = graph0.selectAll('.node,.edge');
      components = components.filter(function(d, i) {
        let bbox = this.getBBox();
        if (bbox.x < x || bbox.x + bbox.width > x + width)
          return false
        if (bbox.y < y || bbox.y + bbox.height > y + height)
          return false
        return true
      });
      this.selectComponents(components);
      this.selectArea = null;
    }
  }

  selectComponents(components) {
    this.unSelectComponents();
    this.selectedComponents = components;
    let self = this;
    components.each(function(d, i) {
      let component = d3_select(this);
      let componentElements = component.selectAll(componentElementsString);
      self.selectedComponentsFill[i] = componentElements.attr("fill");
      self.selectedComponentsStroke[i] = componentElements.attr("stroke");
      componentElements.attr("stroke", "red");
      componentElements.attr("fill", "red");
    });
    this.selectedComponents = components;
  }

  unSelectComponents() {
    let self = this;
    this.selectedComponents.each(function(d, i) {
      let component = d3_select(this);
      let componentElements = component.selectAll(componentElementsString);
      componentElements.attr("stroke", self.selectedComponentsStroke[i]);
      componentElements.attr("fill", self.selectedComponentsFill[i]);
    });
    this.selectedComponents = d3_selectAll(null);
  }

  deleteSelectedComponents() {
    this.selectedComponents.style("display", "none");
    let self = this;
    this.selectedComponents.each(function(d, i) {
      let component = d3_select(this);
      var componentName = component.selectWithoutDataPropagation("title").text();
      if (component.attr('class') === 'node') {
        self.dotGraph.deleteNode(componentName);
      } else {
        componentName = componentName.replace('->', ' -> ');
        self.dotGraph.deleteEdge(componentName);
      }
    });
    this.props.onTextChange(this.dotGraph.dotSrc);
  }

  getNextNodeId() {
    if (this.nodeIndex === null) {
      this.nodeIndex = d3_selectAll('.node').size();
    } else {
      this.nodeIndex += 1;
    }
    while (this.dotGraph.getNodeAttributes('n' + this.nodeIndex)) {
      this.nodeIndex += 1;
    }
    return 'n' + this.nodeIndex;
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

  handleNodeShapeClick = (event, shape) => {
    let x0 = null;
    let y0 = null;
    this.insertNodeWithCurrentAttributes(x0, y0, {shape: shape});
  }

  handleNodeShapeDragStart = (event, shape) => {
    this.drawNodeWithCurrentAttributes(-100, 100, {shape: shape});
    let node = this.graphviz._drawnNode.g;
    let bbox = node.node().getBBox();
    let scale = node.node().getCTM().a;
    node.attr("transform", `scale(${scale})`);
    event.dataTransfer.setDragImage(node.node(), bbox.width / 2 * scale * 4 / 3, bbox.height / 2 * scale * 4 / 3);
    event.dataTransfer.setData("text", shape)
  }

  handleNodeShapeDragOver = (event) => {
    event.preventDefault();
  };

  handleNodeShapeDrop = (event) => {
    event.preventDefault();
    this.graphviz._drawnNode.g.attr("transform", null);
    let graph0 = d3_select(this.node).selectWithoutDataPropagation("g");
    let node = graph0.node();
    var svg = node.ownerSVGElement;
    var point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    var [x0, y0] = [point.x, point.y];
    this.updateAndInsertDrawnNodeWithCurrentAttributes(x0, y0, {});
  }

  handleNodeShapeDragEnd = (event, shape) => {
    this.graphviz.removeDrawnNode();
  }

  drawNode(x0, y0, nodeName, attributes) {
    // FIXME: remove extra copy when https://github.com/magjac/d3-graphviz/issues/81 is fixed
    let attributesCopy = Object.assign({}, attributes);
    this.graphviz.drawNode(x0, y0, nodeName, attributesCopy);
  };

  updateAndInsertDrawnNodeWithCurrentAttributes(x0, y0, attributes) {
    let nodeName = this.currentNodeName;
    attributes = Object.assign(this.currentNodeAttributes, attributes);
    // FIXME: remove extra copy when https://github.com/magjac/d3-graphviz/issues/81 is fixed
    let attributesCopy = Object.assign({}, attributes);
    this.graphviz.updateDrawnNode(x0, y0, nodeName, attributesCopy);
    this.graphviz.insertDrawnNode(nodeName);
    this.graphviz._drawnNode = null;
    this.dotGraph.insertNode(nodeName, attributes);
    this.props.onTextChange(this.dotGraph.dotSrc);
  };

  insertNode(x0, y0, nodeName, attributes) {
    // FIXME: remove extra copy when https://github.com/magjac/d3-graphviz/issues/81 is fixed
    let attributesCopy = Object.assign({}, attributes);
    this.graphviz.drawNode(x0, y0, nodeName, attributesCopy);
    this.graphviz.insertDrawnNode(nodeName);
    this.graphviz._drawnNode = null;
    this.dotGraph.insertNode(nodeName, attributes);
    this.props.onTextChange(this.dotGraph.dotSrc);
  };

  drawNodeWithCurrentAttributes(x0, y0, attributes) {
    if (x0 == null || y0 == null) {
      let graph0 = d3_select(this.node).selectWithoutDataPropagation("g");
      let node = graph0.node();
      let bbox = node.getBBox();
      x0 = x0 || bbox.x + bbox.width / 2;
      y0 = y0 || bbox.y + bbox.height / 2;
    }
    this.currentNodeAttributes = Object.assign({}, this.props.defaultNodeAttributes);
    Object.assign(this.currentNodeAttributes, attributes);
    this.currentNodeName = this.getNextNodeId();
    this.drawNode(x0, y0, this.currentNodeName, this.currentNodeAttributes);
  }

  insertNodeWithCurrentAttributes(x0, y0, attributes) {
    if (x0 == null || y0 == null) {
      let graph0 = d3_select(this.node).selectWithoutDataPropagation("g");
      let node = graph0.node();
      let bbox = node.getBBox();
      x0 = x0 || bbox.x + bbox.width / 2;
      y0 = y0 || bbox.y + bbox.height / 2;
    }
    this.currentNodeAttributes = Object.assign({}, this.props.defaultNodeAttributes);
    Object.assign(this.currentNodeAttributes, attributes);
    let nodeName = this.getNextNodeId();
    this.currentNodeName = nodeName;
    this.insertNode(x0, y0, nodeName, this.currentNodeAttributes);
  }

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
