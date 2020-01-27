import React from "react";
import 'typeface-roboto';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import ButtonAppBar from '../ButtonAppBar';
import Graph from '../Graph';
import TextEditor from '../TextEditor';
import MainMenu from '../MainMenu';
import HelpMenu from '../HelpMenu';
import SettingsDialog from '../SettingsDialog';
import OpenFromBrowserDialog from '../OpenFromBrowserDialog';
import SaveAsToBrowserDialog from '../SaveAsToBrowserDialog';
import InsertPanels from '../InsertPanels';
import FormatDrawer from '../FormatDrawer';
import { schemeCategory10 as d3_schemeCategory10} from 'd3-scale-chromatic';
import { schemePaired as d3_schemePaired} from 'd3-scale-chromatic';
import KeyboardShortcutsDialog from '../KeyboardShortcutsDialog';
import MouseOperationsDialog from '../MouseOperationsDialog';
import AboutDialog from '../AboutDialog';
import { parse as qs_parse } from 'qs';
import { stringify as qs_stringify } from 'qs';
import ExportAsUrlDialog from '../ExportAsUrlDialog';
import { graphDot } from '../utils/graphSrc'
import { graphDict } from '../utils/graph_dict'
import { graphIngrDict } from '../utils/graph_dict'
import TogglesPanel from '../Toggles';

const styles = theme => ({
  root: {
    textAlign: "center",
  },
  paper: {
    height: "calc(100vh - 64px - 2 * 12px)",
  }
});

const defaultElevation = 2;
const focusedElevation = 8;

class Index extends React.Component {

  constructor(props) {
    super(props);
    let dotSrc = null
    if (dotSrc == null) {
      dotSrc = graphDot;
    }
    // let updatedGraphDict = null
    // if (updatedGraphDict == null){
    //   updatedGraphDict = {...graphDict};
    // }

    this.state = {
      projects: JSON.parse(localStorage.getItem('projects')) || {},
      initialized: false,
      name: localStorage.getItem('name') || '',
      dotSrc: dotSrc,
      updatedGraphDict: {...graphDict}, 
      dotSrcLastChangeTime: +localStorage.getItem('dotSrcLastChangeTime') || Date.now(),
      svg: localStorage.getItem('svg') || '',
      hasUndo: false,
      hasRedo: false,
      mainMenuIsOpen: false,
      helpMenuIsOpen: false,
      settingsDialogIsOpen: false,
      openFromBrowserDialogIsOpen: false,
      saveToBrowserAsDialogIsOpen: false,
      replaceName: '',
      exportAsUrlDialogIsOpen: false,
      insertPanelsAreOpen: false,
      nodeFormatDrawerIsOpen: (localStorage.getItem('nodeFormatDrawerIsOpen') || 'false') === 'true',
      edgeFormatDrawerIsOpen: (localStorage.getItem('edgeFormatDrawerIsOpen') || 'false') === 'true',
      keyboardShortcutsDialogIsOpen: false,
      mouseOperationsDialogIsOpen: false,
      aboutDialogIsOpen: false,
      fitGraph : localStorage.getItem('fitGraph') === 'true',
      transitionDuration: localStorage.getItem('transitionDuration') || 1,
      tweenPaths : localStorage.getItem('tweenPaths') !== 'false',
      tweenShapes : localStorage.getItem('tweenShapes') !== 'false',
      tweenPrecision : localStorage.getItem('tweenPrecision') || '1%',
      engine : localStorage.getItem('engine') || 'dot',
      defaultNodeAttributes: JSON.parse(localStorage.getItem('defaultNodeAttributes')) || {},
      defaultEdgeAttributes: JSON.parse(localStorage.getItem('defaultEdgeAttributes')) || {},
      error: null,
      holdOff: localStorage.getItem('holdOff') || 0.2,
      fontSize: localStorage.getItem('fontSize') || 12,
      tabSize: +localStorage.getItem('tabSize') || 4,
      selectedGraphComponents: [],
    };
  }

  componentDidMount() {
    const urlParams = qs_parse(window.location.search.slice(1));
    if (urlParams.dot) {
      const currentDotSrc = this.state.dotSrc;
      const newDotSrc = urlParams.dot;
      if (newDotSrc !== currentDotSrc) {
        const names = Object.keys(this.state.projects).filter((name) => {
          const project = this.state.projects[name];
          return newDotSrc === project.dotSrc;
        });
        if (names.length > 0) {
          this.handleOpenFromBrowser(names[0]);
        } else {
          const newName = this.createUntitledName(this.state.projects, this.state.name);
          this.handleSaveAsToBrowser(newName, newDotSrc);
        }
      }
      window.history.pushState(null, null, window.location.pathname);
    }
    document.onblur = () => {
      // Needed when the user clicks outside the document,
      // e.g. the browser address bar
      this.setFocus(null);
    }
  }

  setPersistentState = (updater) => {
    this.setState((state) => {
      if (typeof updater === 'function') {
        var obj = updater(state);
      } else {
        obj = updater;
      }
      if (obj != null) {
        Object.keys(obj).forEach((key) => {
          let value = obj[key];
          if (typeof value === 'boolean') {
            value = value.toString();
          }
          else if (typeof value === 'object') {
            value = JSON.stringify(value);
          }
          localStorage.setItem(key, value);
        });
      }
      return obj;
    });
  }

  addNode = ({lbael, nodeId, kuku}) =>{
    const originalGraph = this.state.dotSrc;
    const lastClosure = originalGraph.lastIndexOf("}");
    debugger
    if(lastClosure === -1){
      return;
    }
    const closureChar = "}";
    const template = `${nodeId} [label="(${nodeId})\\n\\ncook\\n\\ncooking pot (2%)\\n\\n10 minute - 35 minute" fillcolor="#3888c0" style=filled]`
    const patternToAdd = template+closureChar;

    this.setState({
      dotSrc: `${originalGraph.substring(0,lastClosure)}${patternToAdd}`
    })
    console.log('omri');
  }

  handleTextChange = (text, undoRedoState) => {
    this.setPersistentState((state) => {
      const newState = {
        name: state.name || (text ? this.createUntitledName(state.projects) : ''),
        dotSrc: text,
      };
      if (!this.disableDotSrcLastChangeTimeUpdate) {
        newState.dotSrcLastChangeTime = Date.now();
      }
      return newState;
    });
    this.disableDotSrcLastChangeTimeUpdate = false;
    if (this.resetUndoAtNextTextChange) {
      this.resetUndoStack();
      undoRedoState = {
        hasUndo: false,
        hasRedo: false,
      };
      this.resetUndoAtNextTextChange = false;
    }
    this.setState(undoRedoState);
  }

  handleMainMenuButtonClick = (anchorEl) => {
    this.setState({
      mainMenuIsOpen: true,
      mainMenuAnchorEl: anchorEl,
    });
  }

  handleNewClick = () => {
    this.handleSaveAsToBrowser('');
    this.resetUndoAtNextTextChange = true;
  }

  handleRenameClick = () => {
    this.setState({
      rename: true,
      saveToBrowserAsDialogIsOpen: true,
    });
  }

  handleExportAsUrlClick = () => {
    this.setState({
      exportAsUrlDialogIsOpen: true,
    });
  }

  handleExportAsUrlClose = () => {
    this.setState({
      exportAsUrlDialogIsOpen: false,
    });
  }

  handleUndoButtonClick = () => {
    this.undo();
  }

  handleRedoButtonClick = () => {
    this.redo();
  }

  handleMainMenuClose = () => {
    this.setState({
      mainMenuIsOpen: false,
    });
  }

  handleHelpButtonClick = (anchorEl) => {
    this.setState({
      helpMenuIsOpen: true,
      helpMenuAnchorEl: anchorEl,
    });
  }

  handleHelpMenuClose = () => {
    this.setState({
      helpMenuIsOpen: false,
    });
  }

  handleInsertButtonClick = () => {
    this.setFocusIf('insertPanelsAreOpen', null, 'InsertPanels')
    this.setPersistentState({
      insertPanelsAreOpen: !this.state.insertPanelsAreOpen,
    });
  }

  handleNodeFormatButtonClick = () => {
    this.setFocusIf('nodeFormatDrawerIsOpen', null, 'NodeFormatDrawer')
    this.setPersistentState({
      nodeFormatDrawerIsOpen: !this.state.nodeFormatDrawerIsOpen,
      edgeFormatDrawerIsOpen: false,
    });
  }

  handleNodeFormatDrawerClose = () => {
    this.setPersistentState({
      nodeFormatDrawerIsOpen: false,
    });
    this.setFocus(null);
  }

  handleEdgeFormatButtonClick = () => {
    this.setFocusIf('edgeFormatDrawerIsOpen', null, 'EdgeFormatDrawer')
    this.setPersistentState({
      edgeFormatDrawerIsOpen: !this.state.edgeFormatDrawerIsOpen,
      nodeFormatDrawerIsOpen: false,
    });
  }

  handleEdgeFormatDrawerClose = () => {
    this.setPersistentState({
      edgeFormatDrawerIsOpen: false,
    });
    this.setFocus(null);
  }

  handleSettingsClick = () => {
    this.setState({
      settingsDialogIsOpen: true,
    });
  }

  handleSettingsClose = () => {
    this.setState({
      settingsDialogIsOpen: false,
    });
  }

  handleOpenFromBrowserClick = () => {
    this.setState({
      openFromBrowserDialogIsOpen: true,
    });
  }

  handleOpenFromBrowserClose = () => {
    this.setState({
      openFromBrowserDialogIsOpen: false,
    });
  }

  handleOpenFromBrowser = (newCurrentName) => {
    const currentName = this.state.name;
    if (newCurrentName !== currentName) {
      this.setPersistentState(state => {
        const projects = {...state.projects};
        if (currentName) {
          const currentProject = {
            dotSrc: state.dotSrc,
            dotSrcLastChangeTime: state.dotSrcLastChangeTime,
            svg: this.getSvgString(),
          };
          projects[currentName] = currentProject;
        }
        const newCurrentProject = projects[newCurrentName];
        delete projects[newCurrentName];
        this.disableDotSrcLastChangeTimeUpdate = true;
        return {
          name: newCurrentName,
          ...newCurrentProject,
          projects: projects,
        }
      });
      this.resetUndoAtNextTextChange = true;
    }
    this.handleOpenFromBrowserClose();
  }

  createUntitledName = (projects, currentName) => {
    const baseName = 'Untitled Graph';
    let newName = baseName;
    while (projects[newName] || newName === currentName) {
      newName = baseName + ' ' + (+newName.replace(baseName, '') + 1);
    }
    return newName;
  }

  handleOpenFromBrowserDelete = (nameToDelete) => {
    this.setPersistentState((state) => {
      const currentName = state.name;
      if (nameToDelete === currentName) {
        return {
          name: '',
          dotSrc: '',
          dotSrcLastChangeTime: Date.now(),
        }
      } else {
        const projects = {...state.projects};
        delete projects[nameToDelete];
        return {
          projects: projects,
        }
      }
    });
  }

  handleSaveAsToBrowserClick = () => {
    this.setState({
      rename: false,
      saveToBrowserAsDialogIsOpen: true,
    });
  }

  handleSaveAsToBrowserClose = () => {
    this.setState({
      saveToBrowserAsDialogIsOpen: false,
    });
  }

  handleSaveAsToBrowser = (newName, newDotSrc) => {
    const currentName = this.state.name;
    if (newName !== currentName) {
      this.setPersistentState((state) => {
        const projects = {...state.projects};
        delete projects[newName];
        if (currentName && !state.rename) {
          const currentProject = {
            dotSrc: this.state.dotSrc,
            dotSrcLastChangeTime: state.dotSrcLastChangeTime,
            svg: this.getSvgString(),
          };
          projects[currentName] = currentProject;
        }
        return {
          projects: {
            ...projects,
          },
          name: newName,
          dotSrc: newDotSrc ? newDotSrc : (newName ? state.dotSrc : ''),
          dotSrcLastChangeTime: newDotSrc ? Date.now() : state.dotSrcLastChangeTime,
        };
      });
    }
    this.handleSaveAsToBrowserClose();
  }

  handleEngineSelectChange = (engine) => {
    this.setPersistentState({
      engine: engine,
    });
  }

  handleFitGraphSwitchChange = (fitGraph) => {
    this.setPersistentState({
      fitGraph: fitGraph,
    });
  }

  handleTransitionDurationChange = (transitionDuration) => {
    this.setPersistentState({
      transitionDuration: transitionDuration,
    });
  }

  handleTweenPathsSwitchChange = (tweenPaths) => {
    this.setPersistentState({
      tweenPaths: tweenPaths,
    });
  }

  handleTweenShapesSwitchChange = (tweenShapes) => {
    this.setPersistentState({
      tweenShapes: tweenShapes,
    });
  }

  handleTweenPrecisionChange = (tweenPrecision) => {
    this.setPersistentState({
      tweenPrecision: tweenPrecision,
    });
  }

  handleHoldOffChange = (holdOff) => {
    this.setPersistentState({
      holdOff: holdOff,
    });
  }

  handleFontSizeChange = (fontSize) => {
    this.setPersistentState({
      fontSize: fontSize,
    });
  }

  handleTabSizeChange = (tabSize) => {
    this.setPersistentState({
      tabSize: tabSize,
    });
  }

  handleNodeShapeClick = (shape) => {
    let x0 = null;
    let y0 = null;
    this.insertNode(x0, y0, {shape: shape});
  }

  handleNodeStyleChange = (style) => {
    this.setPersistentState(state => ({
      defaultNodeAttributes: {
          ...state.defaultNodeAttributes,
        style: style,
      },
    }));
  }

  handleNodeColorChange = (color) => {
    this.setPersistentState(state => ({
      defaultNodeAttributes: {
          ...state.defaultNodeAttributes,
        color: color,
      },
    }));
  }

  handleNodeFillColorChange = (color) => {
    this.setPersistentState(state => ({
      defaultNodeAttributes: {
          ...state.defaultNodeAttributes,
        fillcolor: color,
      },
    }));
  }

  handleEdgeStyleChange = (style) => {
    this.setPersistentState(state => ({
      defaultEdgeAttributes: {
          ...state.defaultEdgeAttributes,
        style: style,
      },
    }));
  }

  handleEdgeColorChange = (color) => {
    this.setPersistentState(state => ({
      defaultEdgeAttributes: {
          ...state.defaultEdgeAttributes,
        color: color,
      },
    }));
  }

  handleEdgeFillColorChange = (color) => {
    this.setPersistentState(state => ({
      defaultEdgeAttributes: {
          ...state.defaultEdgeAttributes,
        fillcolor: color,
      },
    }));
  }

  handleKeyboardShortcutsClick = () => {
    this.setState({
      keyboardShortcutsDialogIsOpen: true,
    });
  }

  handleKeyboardShortcutsDialogClose = () => {
    this.setState({
      keyboardShortcutsDialogIsOpen: false,
    });
  }

  handleMouseOperationsClick = () => {
    this.setState({
      mouseOperationsDialogIsOpen: true,
    });
  }

  handleMouseOperationsDialogClose = () => {
    this.setState({
      mouseOperationsDialogIsOpen: false,
    });
  }

  handleAboutClick = () => {
    this.setState({
      aboutDialogIsOpen: true,
    });
  }

  handleAboutDialogClose = () => {
    this.setState({
      aboutDialogIsOpen: false,
    });
  }

  registerNodeShapeClick = (handleNodeShapeClick) => {
    this.handleNodeShapeClick = handleNodeShapeClick;
  }

  registerNodeShapeDragStart = (handleNodeShapeDragStart) => {
    this.handleNodeShapeDragStart = handleNodeShapeDragStart;
  }

  registerNodeShapeDragEnd = (handleNodeShapeDragEnd) => {
    this.handleNodeShapeDragEnd = handleNodeShapeDragEnd;
  }

  handleZoomInButtonClick = () => {}
  handleZoomOutButtonClick = () => {}
  handleZoomOutMapButtonClick = () => {}
  handleZoomResetButtonClick = () => {}

  registerZoomInButtonClick = (handleZoomInButtonClick) => {
    this.handleZoomInButtonClick = handleZoomInButtonClick;
  }

  registerZoomOutButtonClick = (handleZoomOutButtonClick) => {
    this.handleZoomOutButtonClick = handleZoomOutButtonClick;
  }

  registerZoomOutMapButtonClick = (handleZoomOutMapButtonClick) => {
    this.handleZoomOutMapButtonClick = handleZoomOutMapButtonClick;
  }

  registerZoomResetButtonClick = (handleZoomResetButtonClick) => {
    this.handleZoomResetButtonClick = handleZoomResetButtonClick;
  }

  registerGetSvg = (getSvg) => {
    this.getSvg = getSvg;
  }

  getSvgString() {
    const svg = this.getSvg();
    const serializer = new XMLSerializer();
    return svg ? serializer.serializeToString(svg) : this.state.svg;
  }

  handleGraphComponentSelect = (components) => {
    this.setState({
      selectedGraphComponents: components,
    });
  }

  handleGraphInitialized = () => {
    this.setState({
      graphInitialized: true,
    });
    this.setPersistentState({
      svg: this.getSvgString(),
    });
  }

  handleError = (error) => {
    if (error) {
      error.numLines = this.state.dotSrc.split('\n').length;
    }
    if (JSON.stringify(error) !== JSON.stringify(this.state.error)) {
      this.setState({
        error: error,
      });
    }
  }

  registerUndo = (undo) => {
    this.undo = undo;
  }

  registerRedo = (redo) => {
    this.redo = redo;
  }

  registerUndoReset = (resetUndoStack) => {
    this.resetUndoStack = resetUndoStack;
  }

  handleTextEditorFocus = () => {
    this.setFocus('TextEditor');
  }

  handleTextEditorBlur = () => {
    // Needed when the user clicks outside of a pane,
    // e.g. the app bar or the background
    this.setFocusIfFocusIs('TextEditor', null);
  }

  handleGraphFocus = () => {
    this.setFocus('Graph');
  }

  handleInsertPanelsClick = () => {
    this.setFocus('InsertPanels');
  }

  handleNodeFormatDrawerClick = () => {
    this.setFocusIf('nodeFormatDrawerIsOpen', 'NodeFormatDrawer', null)
  }

  handleEdgeFormatDrawerClick = () => {
    this.setFocus('EdgeFormatDrawer');
    this.setFocusIf('edgeFormatDrawerIsOpen', 'EdgeFormatDrawer', null)
  }

  setFocus = (focusedPane) => {
    this.setState((state) => (state.focusedPane !== focusedPane && {
      focusedPane: focusedPane,
    }) || null);
  }

  setFocusIfFocusIs = (currentlyFocusedPane, newFocusedPane) => {
    this.setState((state) => (state.focusedPane === currentlyFocusedPane && {
      focusedPane: newFocusedPane,
    }) || null);
  }

  setFocusIf = (stateProperty, focusedPaneIf, focusedPaneElse) => {
    this.setState((state) => {
      const focusedPane = state[stateProperty] ? focusedPaneIf: focusedPaneElse;
      return (state.focusedPane !== focusedPane && {
        focusedPane: focusedPane,
      }) || null;
    });
  }

  // changeNodeLabel = (nodeId, verb, ingredients, tools, time, color) => {
  changeNodeLabel = (nodeId, nodeContent, nodeColor) => {
    console.log("in changeNodeLable!!!")
    console.log("nodeId: " + nodeId) 
    console.log("nodeContent: " + nodeContent)
    console.log("nodeColor: " + nodeColor)
    let fullString = '';
    fullString =  this.state.dotSrc;
    let nodeString = '';
    const regex = new RegExp("\\t"+`${nodeId}`+"\\s\\[");
    const startIndex =  fullString.search(regex);
    console.log("here1")

    if(startIndex > -1){
      console.log("here2")
      const closingIndex = fullString.slice(startIndex).search(/\]/g) + startIndex;
      const a = fullString.substring(startIndex, closingIndex);
      const startPart = "\t" + `${nodeId}` + " [label="
      if(closingIndex > -1){
        // const verbPart = "<<font point-size='18'><b>" + verb + "</b><br/>" 
        // let ingrPart = "";
        // if (ingredients !== ""){
        //   // ingrPart = ingredients.split('\n').join('<br/>')
        //   ingrPart = ingrPart + "<br/>"
        // }
        // let toolPart = ""; 
        // if (tools !== ""){
        //   // toolPart = tools.split('\n').join('<br/>')
        //   toolPart = toolPart + "<br/>"
        // }
        // const timePart = (time === "") ? "" : time
        let leftovers = ` style=filled fillcolor="` + nodeColor + `"`
        if(a.includes("penwidth")){
          leftovers = leftovers + " color=springgreen4, penwidth=5";
        }
        if(a.includes("fillcolor=gold")){
          leftovers = leftovers + " fillcolor=gold"
        }
        leftovers = leftovers + "]"
        nodeString = startPart + nodeContent + leftovers;
        // nodeString = startPart + verbPart + ingrPart + toolPart + timePart + leftovers;
        console.log("node content: " + nodeContent)
        console.log(nodeString)

        const firstPart = fullString.substring(0, startIndex);
        const lastPart = fullString.substring(closingIndex + 1);
        fullString = firstPart.concat(nodeString.concat(lastPart));
      }
    }
    
    // console.log(fullString)
    this.setState({
      dotSrc : fullString
    })
  }

  enlargeContentByNodeIds = (prevArrayOfIds, curArrayOfIds)=>{
    let fullString = "";
    console.log(prevArrayOfIds)
    console.log(curArrayOfIds)
    let specialId = ""
    if (curArrayOfIds.length > prevArrayOfIds.length){ // in this case we want to enlarge the node that in curArray and not in prevArray
      // find the special node to enlarge:
      curArrayOfIds.forEach(node=>{
        specialId = (prevArrayOfIds.indexOf(node) == -1) ? node : specialId
      })
      console.log("enlarge!")
      console.log(specialId)
      // this.changeNodeLabel(specialId, graphDict[specialId].verb, graphDict[specialId].ingredients, graphDict[specialId].tool, graphDict[specialId].time, graphDict[specialId].color)
      this.changeNodeLabel(specialId, graphDict[specialId].summary, graphDict[specialId].color)
    }
    else{ // in this case we want to shrink the node that in prevArray and not in curArray
      prevArrayOfIds.forEach(node=>{
        specialId = (curArrayOfIds.indexOf(node) == -1) ? node : specialId
      })
      console.log("shrink!")
      console.log(specialId)
      // this.changeNodeLabel(specialId, graphDict[specialId].verb, graphDict[specialId].ingredients_abbr, graphDict[specialId].tool_abbr, graphDict[specialId].time, graphDict[specialId].color)
      this.changeNodeLabel(specialId, graphDict[specialId].summary_abbr, graphDict[specialId].color)
    }
  }

  intersect = (a, b)=> {
      return [...new Set(a)].filter(x => new Set(b).has(x));
  }

  findNodesByIngredients = (leastCommonIngredients) =>{
    console.log("least common!!")
    console.log(leastCommonIngredients) 
    var nodeIds = []
    leastCommonIngredients && leastCommonIngredients.forEach(ingr=>{
      // console.log(graphIngrDict[ingr]);
      // console.log(graphIngrDict[ingr].in_nodes);
      const inNodes = graphIngrDict[ingr].in_nodes;
      inNodes && inNodes.forEach(node=>{
        if(nodeIds.indexOf(node) === -1){
          nodeIds.push(node)
        }
      })
    })
    // console.log("nodeIds:")
    // console.log(nodeIds)
    // this.addSpecialPaths(leastCommonIngredients)
    this.updateFillColorByNodeIds(nodeIds)
    this.updateCurGraphDict(leastCommonIngredients, nodeIds)
    

    // const nodesIds = Object.keys(graphDict);
    // const nodesContainingIngredients = nodesIds && nodesIds.map(nodeId=>{
    //   const ingredientsPerNode = graphDict[nodeId] && graphDict[nodeId].instruments_full_info;
    //   if(!ingredientsPerNode){
    //     return null;
    //   }
    //   const nodeActualIngredients = Object.keys(ingredientsPerNode);
    //   const intersection = this.intersect(leastCommonIngredients,nodeActualIngredients);
    //   if(!(intersection && intersection.length)){
    //     return null;
    //   }
    //   return nodeId;
    // }).filter(id=>id);
    // return nodesContainingIngredients
  }

  addSpecialPaths = (uncommonIngredients)=>{
    console.log("add special paths")
    let fullString = "";
    fullString = this.state.dotSrc;
    //remove START_SPECIAL ... END_SPECIAL part from dot source:

    //add START_SPEACIAL ... END_SPECIAL to dot source:
    const regex = new RegExp(`labelloc="t"`);
    const startInx = fullString.search(regex)
    console.log(startInx) 
    // const srcStart = fullString.slice(0,startInx)
    // let middle = "\n#START_SPECIAL\n"
    // const srcEnd = fullString.slice(startInx)

    // uncommonIngredients && uncommonIngredients.forEach(ingr=>{
    //   console.log(graphIngrDict[ingr].paths);
    //   uncommonIngredients && uncommonIngredients.forEach(ingr=>{
    // })
    
    // this.setState({
    //   dotSrc : fullString
    // })
  }

  updateFillColorByNodeIds = (arrayOfIds)=>{
    console.log("update fill color by node ID") // TODO: remove
    console.log(arrayOfIds)
    let fullString = "";
    fullString =  this.state.dotSrc;
    fullString = fullString.split(" fillcolor=gold").join("");

    arrayOfIds && arrayOfIds.forEach(id=>{
      const regex = new RegExp("\\t"+`${id}`+"\\s\\[");
      const startIndex =  fullString.search(regex);
      if(startIndex > -1){
        const closingIndex = fullString.slice(startIndex).search(/\]/g) + startIndex;
        if(closingIndex > -1){
          const a = fullString.substring(startIndex,closingIndex);
          let nodeString = ""
          // console.log(a) 
          if(a.includes("fillcolor=gold")){
            return
          }else{
            nodeString = a + " fillcolor=gold]";
          }
          const firstPart = fullString.substring(0,startIndex);
          const lastPart = fullString.substring(closingIndex+1);
          fullString = firstPart.concat(nodeString.concat(lastPart));
        }
      } else{
        return;
      }
    })

    this.setState({
      dotSrc : fullString
    })
  }

  updateCurGraphDict =(leastCommonIngredients, nodeIds)=>{
    console.log("update cur graph dict") // TODO: remove
    console.log(nodeIds)
    let updatedDict = {...graphDict}
    nodeIds && nodeIds.forEach(id=>{
      console.log(id)
      leastCommonIngredients && leastCommonIngredients.forEach(uncommonIngr=>{
        console.log(uncommonIngr)
        const regex = new RegExp(uncommonIngr);
        updatedDict[id].directions && updatedDict[id].directions.forEach(direction=>{
          console.log(direction);
          console.log(direction.title);
          const startInx = direction.title.search(regex);
          if (startInx !== -1){
            direction.constraint = "UNCOMMON";
            // updatedDict[id].directions.constraint = "UNCOMMON";
          }
        })
      })
    })

    console.log(updatedDict)
    console.log("here")

    this.setState({
      updatedGraphDict: updatedDict
    })
  }

  updateColorByNodeIds = (arrayOfIds, prevArrayOfEdges, arrayOfEdges)=>{
    console.log("update color by node ID") // TODO: remove
    console.log(arrayOfIds) // TODO: remove
    let fullString = "";
    fullString =  this.state.dotSrc;
    if(arrayOfIds.length === 0 || arrayOfIds.length === 1){
      fullString = fullString.split(" color=springgreen4, penwidth=7").join("");
      fullString = fullString.split(" color=springgreen4, penwidth=3").join("");
      fullString = fullString.split(" color=springgreen4, penwidth=5").join("");
      fullString = fullString.split("[color=springgreen4, penwidth=5]").join("");
    } 
    arrayOfIds && arrayOfIds.forEach(id=>{
      console.log("in for each")
      const regex = new RegExp("\\t"+`${id}`+"\\s\\[");
        const startIndex =  fullString.search(regex);
        console.log(startIndex) // TODO: remove
        if(startIndex > -1){
            const closingIndex = fullString.slice(startIndex).search(/\]/g) + startIndex;
            if(closingIndex > -1){
              const a = fullString.substring(startIndex,closingIndex);
              console.log("==="+a+"===") // TODO: remove
              if(a.includes("penwidth")){
                return
              }
              let nodeString = ""
              if(id == 0 || id == 1){
                nodeString = a + " color=springgreen4, penwidth=3]";
              }else{
                nodeString = a + " color=springgreen4, penwidth=7]";
              }
              const firstPart = fullString.substring(0,startIndex);
              const lastPart = fullString.substring(closingIndex+1);
              fullString = firstPart.concat(nodeString.concat(lastPart));
            }
        } else{
          return;
        }
      })

    let newEdges = []
    arrayOfEdges && arrayOfEdges.forEach(edge=>{
      if(prevArrayOfEdges.indexOf(edge) === -1){
        newEdges.push(edge) 
      }
    })

    console.log("new edges!")
    console.log(newEdges)
    newEdges && newEdges.forEach(edge=>{
      console.log(edge)
      const regexStr = `${edge.first}`+" -> " + `${edge.second}`
      const regex = new RegExp(regexStr);
      const regex2 = new RegExp(regexStr + " \\[");
      const startIndex = fullString.search(regex2);
      if(startIndex > -1){ 
        const endIndex = fullString.slice(startIndex).search(/\]/g) + startIndex;
        const a = fullString.substring(startIndex,endIndex);
        if(a.includes("color")){
          return
        }
        // const penWidthStart = fullString.slice(startIndex).search(/penwidth/g) + startIndex;
        const penWidthStart = fullString.slice(startIndex).search(/\]/g) + startIndex;
        const edgeStr = fullString.substring(startIndex, penWidthStart) + " color=springgreen4, penwidth=5]";
        const firstPart = fullString.substring(0, startIndex);
        const lastPart = fullString.substring(fullString.slice(startIndex).search(/\]/g) + startIndex + 1);
        fullString = firstPart.concat(edgeStr.concat(lastPart));
      }
      else{
        const startIndex = fullString.search(regex);
        const closingIndex = startIndex + regexStr.length + 1;
        const edgeStr = fullString.substring(startIndex, closingIndex) + " [color=springgreen4, penwidth=5]";
        const firstPart = fullString.substring(0, startIndex);
        const lastPart = fullString.substring(closingIndex);
        fullString = firstPart.concat(edgeStr.concat(lastPart));
      }
    })

    this.setState({
      dotSrc : fullString
    })
  }

  render() {
    const { classes } = this.props;
    const editorIsOpen = !this.state.nodeFormatDrawerIsOpen && !this.state.edgeFormatDrawerIsOpen;
    const textEditorHasFocus = this.state.focusedPane === 'TextEditor';
    const nodeFormatDrawerHasFocus = this.state.focusedPane === 'NodeFormatDrawer';
    const edgeFormatDrawerHasFocus = this.state.focusedPane === 'EdgeFormatDrawer';
    const insertPanelsHaveFocus = this.state.focusedPane === 'InsertPanels';
    const graphHasFocus = this.state.focusedPane === 'Graph';
    const leftPaneElevation = textEditorHasFocus || nodeFormatDrawerHasFocus || edgeFormatDrawerHasFocus? focusedElevation : defaultElevation;
    const rightPaneElevation = graphHasFocus ? focusedElevation : defaultElevation;
    const midPaneElevation = insertPanelsHaveFocus ? focusedElevation : defaultElevation;

    var columns;
    if (this.state.insertPanelsAreOpen && this.state.graphInitialized) {
      columns = {
        textEditor: 3,
        insertPanels: 3,
        graph: 6,
      }
    } else { /* browse */
      columns = {
        textEditor: 3,
        insertPanels: false,
        graph: 9,
      }
    }
    return (
      <div className={classes.root}>
        {/* FIXME: Find a way to get viz.js from the graphviz-visual-editor bundle */}
        <script src="https://unpkg.com/viz.js@1.8.2/viz.js" type="javascript/worker"></script>
       
        {/*<ButtonAppBar*/}
        {/*  hasUndo={this.state.hasUndo}*/}
        {/*  hasRedo={this.state.hasRedo}*/}
        {/*  onMenuButtonClick={this.handleMainMenuButtonClick}*/}
        {/*  onNewButtonClick={this.handleNewClick}*/}
        {/*  onUndoButtonClick={this.handleUndoButtonClick}*/}
        {/*  onRedoButtonClick={this.handleRedoButtonClick}*/}
        {/*  onInsertClick={this.handleInsertButtonClick}*/}
        {/*  onNodeFormatClick={this.handleNodeFormatButtonClick}*/}
        {/*  onEdgeFormatClick={this.handleEdgeFormatButtonClick}*/}
        {/*  onZoomInButtonClick={this.handleZoomInButtonClick}*/}
        {/*  onZoomOutButtonClick={this.handleZoomOutButtonClick}*/}
        {/*  onZoomOutMapButtonClick={this.handleZoomOutMapButtonClick}*/}
        {/*  onZoomResetButtonClick={this.handleZoomResetButtonClick}*/}
        {/*  onSettingsButtonClick={this.handleSettingsClick}*/}
        {/*  onOpenInBrowserButtonClick={this.handleOpenFromBrowserClick}*/}
        {/*  onSaveAltButtonClick={this.handleSaveAsToBrowserClick}*/}
        {/*  onHelpButtonClick={this.handleHelpButtonClick}*/}
        {/*>*/}
        {/* </ButtonAppBar>*/}
        {/*{this.state.mainMenuIsOpen &&*/}
        {/*  <MainMenu*/}
        {/*    anchorEl={this.state.mainMenuAnchorEl}*/}
        {/*    onMenuClose={this.handleMainMenuClose}*/}
        {/*    onSettingsClick={this.handleSettingsClick}*/}
        {/*    onOpenFromBrowserClick={this.handleOpenFromBrowserClick}*/}
        {/*    onSaveAsToBrowserClick={this.handleSaveAsToBrowserClick}*/}
        {/*    onNewClick={this.handleNewClick}*/}
        {/*    onRenameClick={this.handleRenameClick}*/}
        {/*    onExportAsUrlClick={this.handleExportAsUrlClick}*/}
        {/*  />*/}
        {/*} */}
        {/*{this.state.settingsDialogIsOpen &&*/}
        {/*  <SettingsDialog*/}
        {/*    engine={this.state.engine}*/}
        {/*    fitGraph={this.state.fitGraph}*/}
        {/*    transitionDuration={this.state.transitionDuration}*/}
        {/*    tweenPaths={this.state.tweenPaths}*/}
        {/*    tweenShapes={this.state.tweenShapes}*/}
        {/*    tweenPrecision={this.state.tweenPrecision}*/}
        {/*    onEngineSelectChange={this.handleEngineSelectChange}*/}
        {/*    onFitGraphSwitchChange={this.handleFitGraphSwitchChange}*/}
        {/*    onTransitionDurationChange={this.handleTransitionDurationChange}*/}
        {/*    onTweenPathsSwitchChange={this.handleTweenPathsSwitchChange}*/}
        {/*    onTweenShapesSwitchChange={this.handleTweenShapesSwitchChange}*/}
        {/*    onTweenPrecisionChange={this.handleTweenPrecisionChange}*/}
        {/*    holdOff={this.state.holdOff}*/}
        {/*    onHoldOffChange={this.handleHoldOffChange}*/}
        {/*    fontSize={this.state.fontSize}*/}
        {/*    onFontSizeChange={this.handleFontSizeChange}*/}
        {/*    tabSize={this.state.tabSize}*/}
        {/*    onTabSizeChange={this.handleTabSizeChange}*/}
        {/*    onSettingsClose={this.handleSettingsClose}*/}
        {/*  />*/}
        {/*}*/}
        {/*{this.state.openFromBrowserDialogIsOpen &&*/}
        {/*  <OpenFromBrowserDialog*/}
        {/*    projects={this.state.projects}*/}
        {/*    dotSrc={this.state.dotSrc}*/}
        {/*    dotSrcLastChangeTime={this.state.dotSrcLastChangeTime}*/}
        {/*    svg={this.getSvgString()}*/}
        {/*    name={this.state.name}*/}
        {/*    onOpen={this.handleOpenFromBrowser}*/}
        {/*    onClose={this.handleOpenFromBrowserClose}*/}
        {/*    onDelete={this.handleOpenFromBrowserDelete}*/}
        {/*  />*/}
        {/*}*/}
        {/*{this.state.saveToBrowserAsDialogIsOpen &&*/}
        {/*  <SaveAsToBrowserDialog*/}
        {/*    name={this.state.name}*/}
        {/*    rename={this.state.rename}*/}
        {/*    defaultNewName={this.state.name || this.createUntitledName(this.state.projects)}*/}
        {/*    projects={this.state.projects}*/}
        {/*    onSave={this.handleSaveAsToBrowser}*/}
        {/*    onClose={this.handleSaveAsToBrowserClose}*/}
        {/*  />*/}
        {/*}*/}
        {/*{this.state.exportAsUrlDialogIsOpen &&*/}
        {/*  <ExportAsUrlDialog*/}
        {/*    URL={window.location.href + '?' + qs_stringify({dot: this.state.dotSrc})}*/}
        {/*    onClose={this.handleExportAsUrlClose}*/}
        {/*  />*/}
        {/*}*/}
        <Grid container
          spacing={24}
          style={{
            margin: 0,
            width: '100%',
          }}
        >
          <Grid item xs={columns.textEditor}>
            <Paper elevation={leftPaneElevation} className={classes.paper}>


              {/*{this.state.nodeFormatDrawerIsOpen &&*/}
              {/*  <FormatDrawer*/}
              {/*    type='node'*/}
              {/*    defaultAttributes={this.state.defaultNodeAttributes}*/}
              {/*    onClick={this.handleNodeFormatDrawerClick}*/}
              {/*    onFormatDrawerClose={this.handleNodeFormatDrawerClose}*/}
              {/*    onStyleChange={this.handleNodeStyleChange}*/}
              {/*    onColorChange={this.handleNodeColorChange}*/}
              {/*    onFillColorChange={this.handleNodeFillColorChange}*/}
              {/*  />*/}
              {/*}*/}
              {/*{this.state.edgeFormatDrawerIsOpen &&*/}
              {/*  <FormatDrawer*/}
              {/*    type='edge'*/}
              {/*    defaultAttributes={this.state.defaultEdgeAttributes}*/}
              {/*    onClick={this.handleEdgeFormatDrawerClick}*/}
              {/*    onFormatDrawerClose={this.handleEdgeFormatDrawerClose}*/}
              {/*    onStyleChange={this.handleEdgeStyleChange}*/}
              {/*    onColorChange={this.handleEdgeColorChange}*/}
              {/*    onFillColorChange={this.handleEdgeFillColorChange}*/}
              {/*  />*/}
              {/*}*/}


              <div style={{display: editorIsOpen ? 'block' : 'none'}}>
                <TextEditor
                  // allocated viewport width - 2 * padding
                  width={`calc(${columns.textEditor * 100 / 12}vw - 2 * 12px)`}
                  dotSrc={this.state.dotSrc}
                  onTextChange={this.handleTextChange}
                  onFocus={this.handleTextEditorFocus}
                  onBlur={this.handleTextEditorBlur}
                  error={this.state.error}
                  selectedGraphComponents={this.state.selectedGraphComponents}
                  holdOff={this.state.holdOff}
                  fontSize={this.state.fontSize}
                  tabSize={this.state.tabSize}
                  registerUndo={this.registerUndo}
                  registerRedo={this.registerRedo}
                  registerUndoReset={this.registerUndoReset}
                />
              </div>
            </Paper>
          </Grid>
          {this.state.insertPanelsAreOpen && this.state.graphInitialized && (
              <Grid item xs={columns.insertPanels}>
                <Paper elevation={midPaneElevation} className={classes.paper}>
                  <InsertPanels
                    onClick={this.handleInsertPanelsClick}
                    onNodeShapeClick={this.handleNodeShapeClick}
                    onNodeShapeDragStart={this.handleNodeShapeDragStart}
                    onNodeShapeDragEnd={this.handleNodeShapeDragEnd}
                  />
                </Paper>
              </Grid>
          )}
          <Grid item xs={columns.graph}>
            
            <Grid container  direction="row" justify="flex-start" alignItems="flex-start" spacin={1}>
              <Grid item xs={3}>
              <TogglesPanel findNodesByIngredients={this.findNodesByIngredients}/>
              </Grid>
              <Grid item xs={9}>
              <Paper elevation={rightPaneElevation} className={classes.paper}>
              <Graph
                updateColorByNodeIds = {this.updateColorByNodeIds}
                enlargeContentByNodeIds = {this.enlargeContentByNodeIds}
                addNode={this.addNode}
                hasFocus={graphHasFocus}
                updatedGraphDict = {this.state.updatedGraphDict}
                dotSrc={this.state.dotSrc}
                engine={this.state.engine}
                fit={this.state.fitGraph}
                transitionDuration={this.state.transitionDuration}
                tweenPaths={this.state.tweenPaths}
                tweenShapes={this.state.tweenShapes}
                tweenPrecision={this.state.tweenPrecision}
                defaultNodeAttributes={this.state.defaultNodeAttributes}
                defaultEdgeAttributes={this.state.defaultEdgeAttributes}
                onFocus={this.handleGraphFocus}
                onTextChange={this.handleTextChange}
                onHelp={this.handleKeyboardShortcutsClick}
                onSelect={this.handleGraphComponentSelect}
                onUndo={this.undo}
                onRedo={this.redo}
                registerNodeShapeClick={this.registerNodeShapeClick}
                registerNodeShapeDragStart={this.registerNodeShapeDragStart}
                registerNodeShapeDragEnd={this.registerNodeShapeDragEnd}
                registerZoomInButtonClick={this.registerZoomInButtonClick}
                registerZoomOutButtonClick={this.registerZoomOutButtonClick}
                registerZoomOutMapButtonClick={this.registerZoomOutMapButtonClick}
                registerZoomResetButtonClick={this.registerZoomResetButtonClick}
                registerGetSvg={this.registerGetSvg}
                onInitialized={this.handleGraphInitialized}
                onError={this.handleError}
              />
            </Paper>

              </Grid>
            </Grid>
              

          </Grid>
        </Grid>
        {this.state.helpMenuIsOpen &&
          <HelpMenu
            anchorEl={this.state.helpMenuAnchorEl}
            onMenuClose={this.handleHelpMenuClose}
            onKeyboardShortcutsClick={this.handleKeyboardShortcutsClick}
            onMouseOperationsClick={this.handleMouseOperationsClick}
            onAboutClick={this.handleAboutClick}
          />
        }
        {this.state.keyboardShortcutsDialogIsOpen &&
          <KeyboardShortcutsDialog
            onKeyboardShortcutsDialogClose={this.handleKeyboardShortcutsDialogClose}
          />
        }
        {this.state.mouseOperationsDialogIsOpen &&
          <MouseOperationsDialog
            onMouseOperationsDialogClose={this.handleMouseOperationsDialogClose}
          />
        }
        {this.state.aboutDialogIsOpen &&
          <AboutDialog
            onAboutDialogClose={this.handleAboutDialogClose}
          />
        }
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));