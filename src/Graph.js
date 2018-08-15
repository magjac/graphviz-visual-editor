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
    this.selectArea = null;
    this.selectRects = d3_select(null);
    this.currentNodeAttributes = {
    }
    this.currentEdgeAttributes = {
    }
    this.currentNodeName = null;
    this.nodeIndex = null;
    this.edgeIndex = null;
    this.pendingUpdate = false;
    this.rendering = false;
    this.prevFit = null;
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
    let engine = this.props.engine;
    if (this.props.dotSrc.length === 0) {
      return;
    }
    if (this.rendering) {
        this.pendingUpdate = true;
        return;
    }
    if (this.props.fit !== this.prevFit) {
      if (this.renderGraphReady) {
        if (this.prevFit) {
          this.unFitGraph();
          this.setZoomScale(1, true);
        } else {
          this.setZoomScale(1, false, true);
          this.fitGraph();
        }
      }
      this.prevFit = this.props.fit;
    }
    this.rendering = true;
    this.graphviz
      .width(width)
      .height(height)
      .engine(engine)
      .fit(fit)
      .dot(this.props.dotSrc, this.handleDotLayoutReady.bind(this))
      .render(this.handleRenderGraphReady.bind(this));
  }

  handleDotLayoutReady() {
    let [, , width, height] = this.graphviz._data.attributes.viewBox.split(' ');
    this.originalViewBox = {width, height};
  }

  handleRenderGraphReady() {
    this.svg = d3_select(this.node).selectWithoutDataPropagation("svg");
    this.graph0 = this.svg.selectWithoutDataPropagation("g");
    try {
      this.dotGraph = new DotGraph(this.props.dotSrc);
    }
    catch(error) {
      let {location: {start: {line}}, message} = error;
      this.props.onError({message: message, line: line});
    }
    this.addEventHandlers();
    this.rendering = false;
    if (!this.renderGraphReady) {
      this.renderGraphReady = true;
      this.setZoomScale(1, true);
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
    let viewBox = this.svg.attr("viewBox").split(' ');
    let bbox = this.graph0.node().getBBox();
    let xRatio = viewBox[2] / bbox.width;
    let yRatio = viewBox[3] / bbox.height;
    let scale = Math.min(xRatio, yRatio);
    this.setZoomScale(scale, true);
  }

  handleZoomResetButtonClick = () => {
    this.setZoomScale(1, true);
  }

  setZoomScale = (scale, center=false, reset=false) => {
    let viewBox = this.svg.attr("viewBox").split(' ');
    let bbox = this.graph0.node().getBBox();
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
    } else if (reset) {
      xOffset = 0;
      yOffset = 0;
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
    let self = this;
    this.graphviz._zoomBehavior.filter(function () {
      if (d3_event.type === 'mousedown' && !d3_event.ctrlKey) {
        if (self.isDrawingEdge) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });

    var nodes = this.svg.selectAll(".node");
    var edges = this.svg.selectAll(".edge");

    d3_select(window).on("resize", this.resizeSVG.bind(this));
    d3_select(document).on("click", this.handleClickOutside.bind(this));
    d3_select(document).on("keyup", this.handleKeyUpOutside.bind(this));
    d3_select(document).on("mousemove", this.handleMouseMove.bind(this));
    d3_select(document).on("contextmenu", this.handleRightClickOutside.bind(this));
    this.svg.on("mousedown", this.handleMouseDownSvg.bind(this));
    this.svg.on("mousemove", this.handleMouseMoveSvg.bind(this));
    this.svg.on("mouseup", this.handleMouseUpSvg.bind(this));
    nodes.on("click mousedown", this.handleClickNode.bind(this));
    nodes.on("dblclick", this.handleDblClickNode.bind(this));
    nodes.on("contextmenu", this.handleRightClickNode.bind(this));
    edges.on("click mousedown", this.handleClickEdge.bind(this));

  }

  handleClickOutside(d, i, nodes) {
    var event = d3_event;
    if (event.target.nodeName !== 'svg' && event.target.parentElement && event.target.parentElement.id !== 'graph0' && event.target !== this.node) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    document.activeElement.blur();
    this.unSelectComponents();
    if (event.which === 2) {
      var [x0, y0] = d3_mouse(this.graph0.node());
      this.insertNodeWithCurrentAttributes(x0, y0);
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
      this.insertNodeWithCurrentAttributes();
    }
    if (event.ctrlKey && event.key === 'x') {
      let nodes = this.selectedComponents.filter('.node');
      if (nodes.size() > 0) {
          let nodeName = nodes.selectWithoutDataPropagation("title").text();
          this.currentNodeAttributes = this.dotGraph.getNodeAttributes(nodeName);
      }
      this.deleteSelectedComponents.call(this);
    }
    if (event.key === '?') {
      this.props.onHelp();
    }
    this.isDrawingEdge = false;
  }

  handleMouseMove(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    var [x0, y0] = d3_mouse(this.graph0.node());
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
    document.activeElement.blur();
    if (!this.isDrawingEdge && event.which === 1) {
      let extendSelection = event.ctrlKey || event.shiftKey;
      this.selectComponents(d3_select(nodes[i]), extendSelection);
    }
  }

  handleDblClickNode(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    document.activeElement.blur();
    this.unSelectComponents();
    if (this.isDrawingEdge) {
      var endNode = d3_select(nodes[i]);
      var startNodeName = this.startNode.selectWithoutDataPropagation("title").text();
      var endNodeName = endNode.selectWithoutDataPropagation("title").text();
      this.graphviz
        .insertDrawnEdge(startNodeName + '->' + endNodeName);
      this.currentEdgeAttributes = Object.assign({}, this.props.defaultEdgeAttributes);
      this.dotGraph.insertEdge(startNodeName, endNodeName, this.currentEdgeAttributes);
      this.props.onTextChange(this.dotGraph.dotSrc);
    }
    this.isDrawingEdge = false;
  }

  handleRightClickNode(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    document.activeElement.blur();
    this.unSelectComponents();
    this.graphviz.removeDrawnEdge();
    this.startNode = d3_select(nodes[i]);
    var [x0, y0] = d3_mouse(this.graph0.node());
    if (this.edgeIndex === null) {
      this.edgeIndex = d3_selectAll('.edge').size();
    } else {
      this.edgeIndex += 1;
    }
    this.currentEdgeAttributes = Object.assign({}, this.props.defaultEdgeAttributes);

    this.graphviz
      .drawEdge(x0, y0, x0, y0, this.currentEdgeAttributes);
    this.isDrawingEdge = true;
  }

  handleClickEdge(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    document.activeElement.blur();
    let extendSelection = event.ctrlKey || event.shiftKey;
    this.selectComponents(d3_select(nodes[i]), extendSelection);
  }

  handleRightClickOutside(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    document.activeElement.blur();
    this.unSelectComponents();
  }

  handleMouseDownSvg(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    if (this.selectArea) {
      this.selectArea.selection.remove();
    }
    var [x0, y0] = d3_mouse(this.graph0.node());
    this.selectArea = {x0: x0, y0: y0};
    this.selectArea.selection = this.graph0.append("rect")
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
      let {x0, y0} = this.selectArea;
      var [x1, y1] = d3_mouse(this.graph0.node());
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
      let {x0, y0} = this.selectArea;
      var [x1, y1] = d3_mouse(this.graph0.node());
      let x = Math.min(x0, x1);
      let y = Math.min(y0, y1);
      let width = Math.abs(x1 - x0);
      let height = Math.abs(y1 - y0);
      if (width === 0 && height === 0) {
        return;
      }
      let components = this.graph0.selectAll('.node,.edge');
      components = components.filter(function(d, i) {
        let bbox = this.getBBox();
        if (bbox.x < x || bbox.x + bbox.width > x + width)
          return false
        if (bbox.y < y || bbox.y + bbox.height > y + height)
          return false
        return true
      });
      let extendSelection = event.ctrlKey || event.shiftKey;
      this.selectComponents(components, extendSelection);
      this.selectArea = null;
    }
  }

  selectComponents(components, extendSelection=false) {
    if (extendSelection) {
      this.selectedComponents = d3_selectAll(this.selectedComponents.nodes().concat(components.nodes()));
    } else {
      this.unSelectComponents();
      this.selectedComponents = components;
    }
    let scale = this.graph0.node().getCTM().a * 3 / 4;
    let dashLength = Math.max(4 / scale, 2);
    let dashWidth = Math.max(4 / scale, 2);
    let rectNodes = [];
    components.each(function(d, i) {
      let component = d3_select(this);
      let bbox = component.node().getBBox();
      let rect = component.append("rect")
        .attr("x", bbox.x)
        .attr("y", bbox.y)
        .attr("width", bbox.width)
        .attr("height", bbox.height)
        .attr("stroke", "black")
        .attr("fill", "transparent")
        .attr("opacity", 0.5)
        .attr("stroke-dasharray", dashLength)
        .attr("stroke-width",  dashWidth);
      rectNodes.push(rect.node());
    });
    if (extendSelection) {
      this.selectRects = d3_selectAll(this.selectRects.nodes().concat(rectNodes));
    } else {
      this.selectRects = d3_selectAll(rectNodes);
    }
  }

  unSelectComponents() {
    this.selectRects.remove();
    this.selectRects = d3_select(null);
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

    this.svg
      .attr("width", width)
      .attr("height", height);
    if (!fit) {
      this.unFitGraph();
    }
  };

  unFitGraph() {
    let width = this.node.parentElement.clientWidth;
    let height = this.node.parentElement.clientHeight;
    this.svg
      .attr("viewBox", `0 0 ${width * 3 / 4} ${height * 3 / 4}`);
  }

  fitGraph() {
    this.svg
      .attr("viewBox", `0 0 ${this.originalViewBox.width} ${this.originalViewBox.height}`);
  }

  handleNodeShapeClick = (event, shape) => {
    let x0 = null;
    let y0 = null;
    this.insertNodeWithDefaultAttributes(x0, y0, {shape: shape});
  }

  handleNodeShapeDragStart = (event, shape) => {
    let outsideOfViewPort = 1000000;
    this.drawNodeWithDefaultAttributes(outsideOfViewPort, outsideOfViewPort, {shape: shape});
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
    let node = this.graph0.node();
    var point = this.svg.node().createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    var [x0, y0] = [point.x, point.y];
    this.updateAndInsertDrawnNode(x0, y0, {});
  }

  handleNodeShapeDragEnd = (event, shape) => {
    this.graphviz.removeDrawnNode();
  }

  drawNode(x0, y0, nodeName, attributes) {
    // FIXME: remove extra copy when https://github.com/magjac/d3-graphviz/issues/81 is fixed
    let attributesCopy = Object.assign({}, attributes);
    // FIXME: remove workaround when https://github.com/magjac/d3-graphviz/issues/83 is fixed
    if (!attributesCopy.style || !attributesCopy.style.includes('filled')) {
        attributesCopy.fillcolor = 'none';
    }
    this.graphviz.drawNode(x0, y0, nodeName, attributesCopy);
  };

  updateAndInsertDrawnNode(x0, y0, attributes) {
    let nodeName = this.currentNodeName;
    attributes = Object.assign(this.currentNodeAttributes, attributes);
    // FIXME: remove extra copy when https://github.com/magjac/d3-graphviz/issues/81 is fixed
    let attributesCopy = Object.assign({}, attributes);
    // FIXME: remove workaround when https://github.com/magjac/d3-graphviz/issues/83 is fixed
    if (!attributesCopy.style || !attributesCopy.style.includes('filled')) {
      attributesCopy.fillcolor = 'none';
    }
    this.graphviz.updateDrawnNode(x0, y0, nodeName, attributesCopy);
    this.graphviz.insertDrawnNode(nodeName);
    this.graphviz._drawnNode = null;
    this.dotGraph.insertNode(nodeName, attributes);
    this.props.onTextChange(this.dotGraph.dotSrc);
  };

  insertNode(x0, y0, nodeName, attributes) {
    this.drawNode(x0, y0, nodeName, attributes);
    this.graphviz.insertDrawnNode(nodeName);
    this.graphviz._drawnNode = null;
    this.dotGraph.insertNode(nodeName, attributes);
    this.props.onTextChange(this.dotGraph.dotSrc);
  };

  drawNodeWithDefaultAttributes(x0, y0, attributesToOverride={}) {
    if (x0 == null || y0 == null) {
      let node = this.graph0.node();
      let bbox = node.getBBox();
      x0 = x0 || bbox.x + bbox.width / 2;
      y0 = y0 || bbox.y + bbox.height / 2;
    }
    this.currentNodeAttributes = Object.assign({}, this.props.defaultNodeAttributes);
    Object.assign(this.currentNodeAttributes, attributesToOverride);
    this.currentNodeName = this.getNextNodeId();
    this.drawNode(x0, y0, this.currentNodeName, this.currentNodeAttributes);
  }

  insertNodeWithCurrentAttributes(x0, y0, attributesToOverride={}) {
    if (x0 == null || y0 == null) {
      let node = this.graph0.node();
      let bbox = node.getBBox();
      x0 = x0 || bbox.x + bbox.width / 2;
      y0 = y0 || bbox.y + bbox.height / 2;
    }
    Object.assign(this.currentNodeAttributes, attributesToOverride);
    let nodeName = this.getNextNodeId();
    this.currentNodeName = nodeName;
    this.insertNode(x0, y0, nodeName, this.currentNodeAttributes);
  }

  insertNodeWithDefaultAttributes(x0, y0, attributesToOverride={}) {
    this.currentNodeAttributes = Object.assign({}, this.props.defaultNodeAttributes);
    this.insertNodeWithCurrentAttributes(x0, y0, attributesToOverride);
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
