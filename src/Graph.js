import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
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
  progress: {
    position: 'absolute',
    top: 'calc(64px + 2 * 12px + 2px)',
    left: 'calc(100vw - 2 * 12px - 2 * 12px)',
  },
};

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      busy: false,
    };
    this.svg = d3_select(null);
    this.createGraph = this.createGraph.bind(this)
    this.renderGraph = this.renderGraph.bind(this)
    this.isDrawingEdge = false;
    this.isDrawingNode = false;
    this.startNode = null;
    this.selectedComponents = d3_selectAll(null);
    this.selectArea = null;
    this.selectRects = d3_select(null);
    this.latestNodeAttributes = {
    }
    this.latestEdgeAttributes = {
    }
    // latestInsertedNodeShape is not necessarily the same as
    // latestNodeAttributes.shape with is also set on node copy
    this.latestInsertedNodeShape = null;
    this.drawnNodeName = null;
    this.nodeIndex = null;
    this.edgeIndex = null;
    this.pendingUpdate = false;
    this.rendering = false;
    this.prevFit = null;
    this.prevEngine = null;
    this.prevDotSrc = '';
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
    this.setState({busy: false});
    if (this.pendingUpdate) {
        this.pendingUpdate = false;
        this.render();
    }
  }

  getSvg = () => {
    return this.svg.node();
  }

  createGraph() {
    this.graphviz = this.div.graphviz()
      .onerror(this.handleError.bind(this))
      .on('initEnd', () => this.renderGraph.call(this));
    this.props.registerNodeShapeClick(this.handleNodeShapeClick);
    this.props.registerNodeShapeDragStart(this.handleNodeShapeDragStart);
    this.props.registerNodeShapeDragEnd(this.handleNodeShapeDragEnd);
    this.props.registerZoomInButtonClick(this.handleZoomInButtonClick);
    this.props.registerZoomOutButtonClick(this.handleZoomOutButtonClick);
    this.props.registerZoomOutMapButtonClick(this.handleZoomOutMapButtonClick);
    this.props.registerZoomResetButtonClick(this.handleZoomResetButtonClick);
    this.props.registerGetSvg(this.getSvg);
  }

  renderGraph() {
    let width = this.div.node().parentElement.clientWidth;
    let height = this.div.node().parentElement.clientHeight;
    let fit = this.props.fit;
    let engine = this.props.engine;
    if (this.props.dotSrc.length === 0) {
      this.svg.remove();
      this.svg = d3_select(null);
      this.props.onError(null);
      this.renderGraphReady = false;
      return;
    }
    if (this.props.dotSrc === this.prevDotSrc && this.props.engine === this.prevEngine) {
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
    this.prevDotSrc = this.props.dotSrc;
    this.prevEngine = this.props.engine;
    try {
      this.prelDotGraph = new DotGraph(this.props.dotSrc);
      this.props.onError(null);
    }
    catch(error) {
      if (!error.location) {
        throw error;
      }
      let {location: {start: {line}}, message} = error;
      this.props.onError({message: message, line: line});
      return;
    }
    this.rendering = true;
    this.setState({busy: true});
    this.graphviz
      .width(width)
      .height(height)
      .engine(engine)
      .fit(fit)
      .tweenPaths(this.props.tweenPaths)
      .tweenShapes(this.props.tweenShapes)
      .tweenPrecision(this.props.tweenPrecision)
      .dot(this.props.dotSrc, this.handleDotLayoutReady.bind(this))
      .on('renderEnd', this.handleRenderStaged.bind(this))
      .render(this.handleRenderGraphReady.bind(this));
  }

  handleDotLayoutReady() {
    let [, , width, height] = this.graphviz.data().attributes.viewBox.split(' ');
    this.originalViewBox = {width, height};
  }

  handleRenderStaged() {
    if (this.renderGraphReady) {
      this.markSelectedComponents(this.selectedComponents);
    }
  }

  handleRenderGraphReady() {
    this.svg = this.div.selectWithoutDataPropagation("svg");
    this.graph0 = this.svg.selectWithoutDataPropagation("g");
    this.dotGraph = this.prelDotGraph;
    this.addEventHandlers();
    this.rendering = false;
    this.setState({busy: false});
    if (!this.renderGraphReady) {
      this.renderGraphReady = true;
      this.setZoomScale(1, true);
      this.graphviz
        .transition(() => d3_transition().duration(this.props.transitionDuration * 1000));
      this.props.onInitialized();
    }
    if (this.pendingUpdate) {
      this.pendingUpdate = false;
      this.renderGraph();
    }
  }

  handleZoomInButtonClick = () => {
    let scale = d3_zoomTransform(this.graphviz.zoomSelection().node()).k;
    scale = scale * 1.2;
    this.setZoomScale(scale);
  }

  handleZoomOutButtonClick = () => {
    let scale = d3_zoomTransform(this.graphviz.zoomSelection().node()).k;
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
    let {x, y, k} = d3_zoomTransform(this.graphviz.zoomSelection().node());
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
    this.graphviz.zoomSelection().call(this.graphviz.zoomBehavior().transform, transform);
  }

  addEventHandlers() {

    /*
      Some empirical non-obvious and other relevant things to note:
        1. Click events are preceeded by mousedown and mouseup events on the
           same element.
        2. 1st button clicks are click events on all elements.
        3. 2nd and 3rd button clicks are click events on document and window
           only, not on their children, although the event target is the child.
        4. Keyboard events are dispatched on BODY, not on its children. This can
           however be changed with the contenteditable attribute.
    */

    let self = this;
    this.graphviz.zoomBehavior().filter(function () {
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
    this.div.on("click", this.handleClickDiv.bind(this));
    d3_select(document).on("keydown", this.handleKeyDownDocument.bind(this));
    this.div.on("mousemove", this.handleMouseMoveDiv.bind(this));
    this.div.on("contextmenu", this.handleRightClickDiv.bind(this));
    this.svg.on("mousedown", this.handleMouseDownSvg.bind(this));
    this.svg.on("mousemove", this.handleMouseMoveSvg.bind(this));
    this.svg.on("click", this.handleClickSvg.bind(this));
    this.svg.on("mouseup", this.handleMouseUpSvg.bind(this));
    nodes.on("click mousedown", this.handleClickNode.bind(this));
    nodes.on("dblclick", this.handleDblClickNode.bind(this));
    nodes.on("contextmenu", this.handleRightClickNode.bind(this));
    edges.on("click mousedown", this.handleClickEdge.bind(this));

  }

  handleClickDiv(d, i, nodes) {
    this.props.onFocus();
    document.activeElement.blur();
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    if (!(event.which === 1 && (event.ctrlKey || event.shiftKey))) {
      this.unSelectComponents();
    }
  }

  handleKeyDownDocument(d, i, nodes) {
    if (!this.props.hasFocus) {
      return;
    }
    var event = d3_event;
    if (event.target.nodeName !== 'BODY') {
      return;
    }
    if (event.key === 'Escape') {
      this.graphviz.removeDrawnEdge();
      this.unSelectComponents();
    }
    else if (event.key === 'Delete') {
      this.deleteSelectedComponents.call(this);
      this.graphviz.removeDrawnEdge();
    }
    else if (event.ctrlKey && event.key === 'c') {
      let nodes = this.selectedComponents.filter('.node');
      if (nodes.size() > 0) {
          let nodeName = nodes.selectWithoutDataPropagation("title").text();
          this.latestNodeAttributes = this.dotGraph.getNodeAttributes(nodeName);
      }
    }
    else if (event.ctrlKey && event.key === 'v') {
      this.insertNodeWithLatestAttributes();
    }
    else if (event.ctrlKey && event.key === 'x') {
      let nodes = this.selectedComponents.filter('.node');
      if (nodes.size() > 0) {
          let nodeName = nodes.selectWithoutDataPropagation("title").text();
          this.latestNodeAttributes = this.dotGraph.getNodeAttributes(nodeName);
      }
      this.deleteSelectedComponents.call(this);
    }
    else if (event.ctrlKey && event.key === 'a') {
      let components = this.graph0.selectAll('.node,.edge');
      this.selectComponents(components);
    }
    else if (event.ctrlKey && event.key === 'A') {
      let components = this.graph0.selectAll('.edge');
      this.selectComponents(components);
    }
    else if (event.ctrlKey && event.key === 'z') {
      this.props.onUndo();
    }
    else if (event.ctrlKey && event.key === 'y') {
      this.props.onRedo();
    }
    else if (event.key === '?') {
      this.props.onHelp();
    }
    else {
      return;
    }
    event.preventDefault();
    this.isDrawingEdge = false;
  }

  handleMouseMoveDiv(d, i, nodes) {
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    var [x0, y0] = d3_mouse(this.graph0.node());
    var penwidth = 1;
    if (this.latestEdgeAttributes.penwidth != null) {
      if (isNumeric(this.latestEdgeAttributes.penwidth)) {
        penwidth = this.latestEdgeAttributes.penwidth;
      }
    } else if (this.latestEdgeAttributes.style && this.latestEdgeAttributes.style.includes('bold')) {
      penwidth = 2;
    }
    var shortening = penwidth * 2; // avoid mouse pointing on edge

    if (this.isDrawingEdge) {
      this.graphviz
        .moveDrawnEdgeEndPoint(x0, y0,  {shortening: shortening})
    }
  }

  handleClickNode(d, i, nodes) {
    this.props.onFocus();
    document.activeElement.blur();
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    if (!this.isDrawingEdge && event.which === 1) {
      let extendSelection = event.ctrlKey || event.shiftKey;
      this.selectComponents(d3_select(nodes[i]), extendSelection);
    }
  }

  handleDblClickNode(d, i, nodes) {
    this.props.onFocus();
    document.activeElement.blur();
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
      this.latestEdgeAttributes = Object.assign({}, this.props.defaultEdgeAttributes);
      this.dotGraph.insertEdge(startNodeName, endNodeName, this.latestEdgeAttributes);
      this.props.onTextChange(this.dotGraph.dotSrc);
    }
    this.isDrawingEdge = false;
  }

  handleRightClickNode(d, i, nodes) {
    this.props.onFocus();
    document.activeElement.blur();
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    this.unSelectComponents();
    this.graphviz.removeDrawnEdge();
    this.startNode = d3_select(nodes[i]);
    var [x0, y0] = d3_mouse(this.graph0.node());
    if (this.edgeIndex === null) {
      this.edgeIndex = d3_selectAll('.edge').size();
    } else {
      this.edgeIndex += 1;
    }
    this.latestEdgeAttributes = Object.assign({}, this.props.defaultEdgeAttributes);
    this.latestEdgeAttributes.id = 'edge' + (this.edgeIndex + 1);

    this.graphviz
      .drawEdge(x0, y0, x0, y0, this.latestEdgeAttributes);
    this.isDrawingEdge = true;
  }

  handleClickEdge(d, i, nodes) {
    this.props.onFocus();
    document.activeElement.blur();
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    let extendSelection = event.ctrlKey || event.shiftKey;
    this.selectComponents(d3_select(nodes[i]), extendSelection);
  }

  handleRightClickDiv(d, i, nodes) {
    this.props.onFocus();
    document.activeElement.blur();
    var event = d3_event;
    event.preventDefault();
    event.stopPropagation();
    this.unSelectComponents();
  }

  handleMouseDownSvg(d, i, nodes) {
    this.props.onFocus();
    document.activeElement.blur();
    var event = d3_event;
    if (event.which !== 1) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (this.selectArea) {
      return;
    }
    var [x0, y0] = d3_mouse(this.graph0.node());
    this.selectArea = {x0: x0, y0: y0};
    let offset = 1;  // avoid covering the svg at click in Chrome
    this.selectArea.selection = this.graph0.append("rect")
      .attr("x", x0 + offset)
      .attr("y", y0 + offset)
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

  handleClickSvg(d, i, nodes) {
    this.props.onFocus();
    document.activeElement.blur();
    var event = d3_event;
    if (event.which === 1 && this.selectArea) {
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
        this.selectArea = null;
        if (!(event.ctrlKey || event.shiftKey)) {
          this.unSelectComponents();
        }
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

  handleMouseUpSvg(d, i, nodes) {
    this.props.onFocus();
    document.activeElement.blur();
    var event = d3_event;
    if (event.which === 2) {
      var [x0, y0] = d3_mouse(this.graph0.node());
      if (event.shiftKey) {
        this.insertNodeWithDefaultAttributes(x0, y0, {shape: this.latestInsertedNodeShape});
      } else {
        this.insertNodeWithLatestAttributes(x0, y0);
      }
    }
  }

  selectComponents(components, extendSelection=false) {
    if (extendSelection) {
      this.selectedComponents = d3_selectAll(this.selectedComponents.nodes().concat(components.nodes()));
    } else {
      this.unSelectComponents();
      this.selectedComponents = components;
    }
    this.markSelectedComponents(components, extendSelection);
    const selectedComponents = this.selectNames.map((name) => this.dotGraph.components[name]);
    this.props.onSelect(selectedComponents);
  }

  markSelectedComponents(components, extendSelection=false) {
    let scale = this.graph0.node().getCTM().a * 3 / 4;
    let dashLength = Math.max(4 / scale, 2);
    let dashWidth = Math.max(4 / scale, 2);
    let rectNodes = [];
    let titles = [];
    const self = this;
    components.each(function(d, i) {
      let component = d3_select(this);
      let color = 'black';
      const title = component.select('title').text();
      if (component.classed('edge') && self.dotGraph.getEdgeAttributes(title) == null) {
        color = 'red';
      } else {
        titles.push(title);
      }
      let bbox = component.node().getBBox();
      let rect = component.append("rect")
        .attr("x", bbox.x)
        .attr("y", bbox.y)
        .attr("width", bbox.width)
        .attr("height", bbox.height)
        .attr("stroke", color)
        .attr("fill", "transparent")
        .attr("opacity", 0.5)
        .attr("stroke-dasharray", dashLength)
        .attr("stroke-width",  dashWidth);
      rectNodes.push(rect.node());
    });
    if (extendSelection) {
      this.selectRects = d3_selectAll(this.selectRects.nodes().concat(rectNodes));
      this.selectNames = this.selectNames.concat(titles);
    } else {
      this.selectRects = d3_selectAll(rectNodes);
      this.selectNames = titles;
    }
  }

  unSelectComponents() {
    this.selectRects.remove();
    this.selectRects = d3_select(null);
    if (this.selectedComponents.size() > 0) {
      this.selectedComponents = d3_selectAll(null);
      this.props.onSelect([]);
    }
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
        self.dotGraph.deleteEdge(componentName);
      }
      if (self.dotGraph.numDeletedComponents === 0) {
        component.style("display", null);
      }
      if (i !== self.selectedComponents.size() - 1) {
        self.dotGraph.reparse();
      }
    });
    this.props.onTextChange(this.dotGraph.dotSrc);
    this.unSelectComponents();
  }

  getNextNodeId() {
    if (this.nodeIndex === null) {
      this.nodeIndex = d3_select('#canvas').selectAll('.node').size();
    } else {
      this.nodeIndex += 1;
    }
    while (this.dotGraph.getNodeAttributes('n' + this.nodeIndex)) {
      this.nodeIndex += 1;
    }
    return 'n' + this.nodeIndex;
  }

  resizeSVG() {
    let width = this.div.node().parentElement.clientWidth;
    let height = this.div.node().parentElement.clientHeight;
    let fit = this.props.fit;

    this.svg
      .attr("width", width)
      .attr("height", height);
    if (!fit) {
      this.unFitGraph();
    }
  };

  unFitGraph() {
    let width = this.div.node().parentElement.clientWidth;
    let height = this.div.node().parentElement.clientHeight;
    this.svg
      .attr("viewBox", `0 0 ${width * 3 / 4} ${height * 3 / 4}`);
  }

  fitGraph() {
    this.svg
      .attr("viewBox", `0 0 ${this.originalViewBox.width} ${this.originalViewBox.height}`);
  }

  handleNodeShapeClick = (event, shape) => {
    if (shape === '(default)') {
      shape = null;
    }
    this.props.onFocus();
    let x0 = null;
    let y0 = null;
    this.latestInsertedNodeShape = shape;
    this.insertNodeWithDefaultAttributes(x0, y0, {shape: shape});
  }

  handleNodeShapeDragStart = (event, shape) => {
    if (shape === '(default)') {
      shape = null;
    }
    let outsideOfViewPort = 1000000;
    this.latestInsertedNodeShape = shape;
    this.drawNodeWithDefaultAttributes(outsideOfViewPort, outsideOfViewPort, {shape: shape});
    let node = this.graphviz.drawnNodeSelection();
    if (!node.empty() && !window.chrome) {
      let bbox = node.node().getBBox();
      let scale = node.node().getCTM().a;
      node.attr("transform", `scale(${scale})`);
      event.dataTransfer.setDragImage(node.node(), bbox.width / 2 * scale * 4 / 3, bbox.height / 2 * scale * 4 / 3);
    }
    event.dataTransfer.setData("text", shape)
  }

  handleNodeShapeDragOver = (event) => {
    event.preventDefault();
  };

  handleNodeShapeDrop = (event) => {
    this.props.onFocus();
    event.preventDefault();
    this.graphviz.drawnNodeSelection().attr("transform", null);
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
    this.graphviz.drawNode(x0, y0, nodeName, attributes);
  };

  updateAndInsertDrawnNode(x0, y0, attributes) {
    let nodeName = this.drawnNodeName;
    attributes = Object.assign(this.latestNodeAttributes, attributes);
    this.graphviz.updateDrawnNode(x0, y0, nodeName, attributes);
    this.graphviz.insertDrawnNode(nodeName);
    this.dotGraph.insertNode(nodeName, attributes);
    this.props.onTextChange(this.dotGraph.dotSrc);
  };

  insertNode(x0, y0, nodeName, attributes) {
    this.drawNode(x0, y0, nodeName, attributes);
    this.graphviz.insertDrawnNode(nodeName);
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
    this.latestNodeAttributes = Object.assign({}, this.props.defaultNodeAttributes);
    Object.assign(this.latestNodeAttributes, attributesToOverride);
    this.drawnNodeName = this.getNextNodeId();
    this.drawNode(x0, y0, this.drawnNodeName, this.latestNodeAttributes);
  }

  insertNodeWithLatestAttributes(x0, y0, attributesToOverride={}) {
    if (x0 == null || y0 == null) {
      let node = this.graph0.node();
      let bbox = node.getBBox();
      x0 = x0 || bbox.x + bbox.width / 2;
      y0 = y0 || bbox.y + bbox.height / 2;
    }
    Object.assign(this.latestNodeAttributes, attributesToOverride);
    let nodeName = this.getNextNodeId();
    this.insertNode(x0, y0, nodeName, this.latestNodeAttributes);
  }

  insertNodeWithDefaultAttributes(x0, y0, attributesToOverride={}) {
    this.latestNodeAttributes = Object.assign({}, this.props.defaultNodeAttributes);
    this.insertNodeWithLatestAttributes(x0, y0, attributesToOverride);
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div
          id="canvas"
          ref={div => this.div = d3_select(div)}
          onDragOver={this.handleNodeShapeDragOver}
          onDrop={this.handleNodeShapeDrop.bind(this)}
        >
        </div>
        {this.state.busy && (
          <Fade
            in={true}
            style={{
              transitionDelay: '800ms',
            }}
            unmountOnExit
          >
             <CircularProgress
               id="busy-indicator"
               className={classes.progress}
               color="secondary"
               size={20}
               thickness={4.5}
             />
          </Fade>
        )}
      </React.Fragment>
    );
  }
}

Graph.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Graph);
