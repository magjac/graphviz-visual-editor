import React from 'react';
import 'typeface-roboto';
import PropTypes from 'prop-types';
import { Paper } from '@mui/material';
import { Grid } from '@mui/material';
import { withStyles } from 'tss-react/mui';
import withRoot from '../withRoot.js';
import ButtonAppBar from '../ButtonAppBar.js';
import Graph from '../Graph.js';
import TextEditor from '../TextEditor.js';
import MainMenu from '../MainMenu.js';
import HelpMenu from '../HelpMenu.js';
import SettingsDialog from '../SettingsDialog.js';
import OpenFromBrowserDialog from '../OpenFromBrowserDialog.js';
import SaveAsToBrowserDialog from '../SaveAsToBrowserDialog.js';
import InsertPanels from '../InsertPanels.js';
import FormatDrawer from '../FormatDrawer.js';
import { schemeCategory10 as d3_schemeCategory10} from 'd3-scale-chromatic';
import { schemePaired as d3_schemePaired} from 'd3-scale-chromatic';
import KeyboardShortcutsDialog from '../KeyboardShortcutsDialog.js';
import MouseOperationsDialog from '../MouseOperationsDialog.js';
import AboutDialog from '../AboutDialog.js';
import { parse as qs_parse } from 'qs';
import { stringify as qs_stringify } from 'qs';
import ExportAsUrlDialog from '../ExportAsUrlDialog.js';
import ExportAsSvgDialog from '../ExportAsSvgDialog.js'
import { graphvizVersion } from '../graphvizVersion.js';
import UpdatedSnackbar from '../UpdatedSnackbar.js';
import packageJSON from '../../package.json';

const styles = theme => ({
  root: {
    textAlign: 'center',
  },
  paper: {
    // viewport height - app bar - 2 * padding
    height: "calc(100vh - 64px - 2 * 12px)",
  },
  paperWhenUpdatedSnackbarIsOpen: {
    marginTop: "64px",
    height: "calc(100vh - 64px - 64px - 2 * 12px)",
  },
  paperWhenFullscreen: {
    height: "calc(100vh)",
    overflow: "hidden"
  },
});

const defaultElevation = 2;
const focusedElevation = 8;

class Index extends React.Component {

  constructor(props) {
    super(props);
    let dotSrc = localStorage.getItem('dotSrc');
    if (dotSrc == null) {
      dotSrc = `strict digraph {
    a [shape="ellipse" style="filled" fillcolor="` + d3_schemeCategory10[0] + `"]
    b [shape="polygon" style="filled" fillcolor="` + d3_schemeCategory10[1] + `"]
    a -> b [fillcolor="` + d3_schemePaired[0] + `" color="` + d3_schemePaired[1] + `"]
}`;
    }
    this.state = {
      projects: JSON.parse(localStorage.getItem('projects')) || {},
      initialized: false,
      name: localStorage.getItem('name') || '',
      dotSrc: dotSrc,
      forceNewDotSrc: true,
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
      exportAsSvgDialogIsOpen: false,
      fullscreen: false,
      insertPanelsAreOpen: (localStorage.getItem('insertPanelsAreOpen') || 'false') === 'true',
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
      test: JSON.parse(localStorage.getItem('test')) || {},
      graphvizVersion: graphvizVersion,
      newGraphvizVersion: graphvizVersion !== localStorage.getItem('graphvizVersion'),
      updatedSnackbarIsOpen: packageJSON.version !== localStorage.getItem('version'),
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
      window.history.replaceState(null, null, window.location.pathname);
    }

    document.documentElement.addEventListener('mouseleave', () => {
      this.outsideOfDocument = true;
    });

    document.documentElement.addEventListener('mouseenter', () => {
      this.outsideOfDocument = false;
    })

    document.onblur = () => {
      // Needed when the user clicks outside the document,
      // e.g. the browser address bar
      if (this.outsideOfDocument) {
        this.setFocus(null);
      }
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

  handleTextChangeFromGraph = (text) => {
    const forceNewDotSrc = true;
    const undoRedoState = null;
    this.handleTextChange(text, undoRedoState, forceNewDotSrc);
  }

  handleTextChange = (text, undoRedoState, forceNewDotSrc) => {
    this.setPersistentState((state) => {
      const newState = {
        name: state.name || (text ? this.createUntitledName(state.projects) : ''),
        dotSrc: text,
        forceNewDotSrc: forceNewDotSrc,
      };
      if (!this.disableDotSrcLastChangeTimeUpdate) {
        newState.dotSrcLastChangeTime = Date.now();
      }
      this.disableDotSrcLastChangeTimeUpdate = false;
      return newState;
    });
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

  handleExportAsSvgClick = () => {
    this.setState({
      exportAsSvgDialogIsOpen: true,
    });
  }

  handleExportAsUrlClose = () => {
    this.setState({
      exportAsUrlDialogIsOpen: false,
    });
  }

  handleExportAsSvgClose = () => {
    this.setState({
      exportAsSvgDialogIsOpen: false,
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
            forceNewDotSrc: true,
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
          forceNewDotSrc: true,
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
          forceNewDotSrc: true,
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

  handleUpdatedSnackbarClose = () => {
    this.setState({ "updatedSnackbarIsOpen": false });
    this.setPersistentState({
      "version": packageJSON.version,
      "graphvizVersion": this.state.graphvizVersion,
    })
  }

  handleToggleFullscreen = () => {
    this.setState((state) => ({
      fullscreen: !state.fullscreen,
    }));
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

  render() {
    const { classes } = this.props;
    const editorIsOpen = !this.state.nodeFormatDrawerIsOpen && !this.state.edgeFormatDrawerIsOpen && !this.state.fullscreen;
    const textEditorHasFocus = this.state.focusedPane === 'TextEditor';
    const nodeFormatDrawerHasFocus = this.state.focusedPane === 'NodeFormatDrawer';
    const edgeFormatDrawerHasFocus = this.state.focusedPane === 'EdgeFormatDrawer';
    const insertPanelsHaveFocus = this.state.focusedPane === 'InsertPanels';
    const graphHasFocus = this.state.focusedPane === 'Graph';
    const leftPaneElevation = textEditorHasFocus || nodeFormatDrawerHasFocus || edgeFormatDrawerHasFocus? focusedElevation : defaultElevation;
    const rightPaneElevation = this.state.fullscreen ? 0 : graphHasFocus ? focusedElevation : defaultElevation;
    const midPaneElevation = insertPanelsHaveFocus ? focusedElevation : defaultElevation;

    var columns;
    if (this.state.fullscreen) {
      columns = {
        textEditor: false,
        insertPanels: false,
        graph: 12,
      }
    } else if (this.state.insertPanelsAreOpen && this.state.graphInitialized) {
      columns = {
        textEditor: 3,
        insertPanels: 3,
        graph: 6,
      }
    } else { /* browse */
      columns = {
        textEditor: 6,
        insertPanels: false,
        graph: 6,
      }
    }
    const paperClass = this.state.updatedSnackbarIsOpen ? classes.paperWhenUpdatedSnackbarIsOpen : this.state.fullscreen ? classes.paperWhenFullscreen : classes.paper ;
    return (
      <div className={classes.root}>
        <script src={process.env.PUBLIC_URL.replace(/\.$/, '') + "@hpcc-js/wasm/dist/graphviz.umd.js"} type="javascript/worker"></script>
        {!this.state.fullscreen &&
          <ButtonAppBar
            hasUndo={this.state.hasUndo}
            hasRedo={this.state.hasRedo}
            onMenuButtonClick={this.handleMainMenuButtonClick}
            onNewButtonClick={this.handleNewClick}
            onUndoButtonClick={this.handleUndoButtonClick}
            onRedoButtonClick={this.handleRedoButtonClick}
            onInsertClick={this.handleInsertButtonClick}
            onNodeFormatClick={this.handleNodeFormatButtonClick}
            onEdgeFormatClick={this.handleEdgeFormatButtonClick}
            onZoomInButtonClick={this.handleZoomInButtonClick}
            onZoomOutButtonClick={this.handleZoomOutButtonClick}
            onZoomOutMapButtonClick={this.handleZoomOutMapButtonClick}
            onZoomResetButtonClick={this.handleZoomResetButtonClick}
            onSettingsButtonClick={this.handleSettingsClick}
            onOpenInBrowserButtonClick={this.handleOpenFromBrowserClick}
            onSaveAltButtonClick={this.handleSaveAsToBrowserClick}
            onHelpButtonClick={this.handleHelpButtonClick}
          >
          </ButtonAppBar>
        }
        {this.state.mainMenuIsOpen &&
          <MainMenu
            anchorEl={this.state.mainMenuAnchorEl}
            onMenuClose={this.handleMainMenuClose}
            onSettingsClick={this.handleSettingsClick}
            onOpenFromBrowserClick={this.handleOpenFromBrowserClick}
            onSaveAsToBrowserClick={this.handleSaveAsToBrowserClick}
            onNewClick={this.handleNewClick}
            onRenameClick={this.handleRenameClick}
            onExportAsUrlClick={this.handleExportAsUrlClick}
            onExportAsSvgClick={this.handleExportAsSvgClick}
          />
        }
        {this.state.settingsDialogIsOpen &&
          <SettingsDialog
            engine={this.state.engine}
            fitGraph={this.state.fitGraph}
            transitionDuration={this.state.transitionDuration}
            tweenPaths={this.state.tweenPaths}
            tweenShapes={this.state.tweenShapes}
            tweenPrecision={this.state.tweenPrecision}
            onEngineSelectChange={this.handleEngineSelectChange}
            onFitGraphSwitchChange={this.handleFitGraphSwitchChange}
            onTransitionDurationChange={this.handleTransitionDurationChange}
            onTweenPathsSwitchChange={this.handleTweenPathsSwitchChange}
            onTweenShapesSwitchChange={this.handleTweenShapesSwitchChange}
            onTweenPrecisionChange={this.handleTweenPrecisionChange}
            holdOff={this.state.holdOff}
            onHoldOffChange={this.handleHoldOffChange}
            fontSize={this.state.fontSize}
            onFontSizeChange={this.handleFontSizeChange}
            tabSize={this.state.tabSize}
            onTabSizeChange={this.handleTabSizeChange}
            onSettingsClose={this.handleSettingsClose}
          />
        }
        {this.state.openFromBrowserDialogIsOpen &&
          <OpenFromBrowserDialog
            projects={this.state.projects}
            dotSrc={this.state.dotSrc}
            dotSrcLastChangeTime={this.state.dotSrcLastChangeTime}
            svg={this.getSvgString()}
            name={this.state.name}
            onOpen={this.handleOpenFromBrowser}
            onClose={this.handleOpenFromBrowserClose}
            onDelete={this.handleOpenFromBrowserDelete}
          />
        }
        {this.state.saveToBrowserAsDialogIsOpen &&
          <SaveAsToBrowserDialog
            name={this.state.name}
            rename={this.state.rename}
            defaultNewName={this.state.name || this.createUntitledName(this.state.projects)}
            projects={this.state.projects}
            onSave={this.handleSaveAsToBrowser}
            onClose={this.handleSaveAsToBrowserClose}
          />
        }
        {this.state.exportAsUrlDialogIsOpen &&
          <ExportAsUrlDialog
            URL={window.location.href + '?' + qs_stringify({dot: this.state.dotSrc})}
            onClose={this.handleExportAsUrlClose}
          />
        }
        {this.state.exportAsSvgDialogIsOpen &&
          <ExportAsSvgDialog
            defaultFilename={(this.state.name || this.createUntitledName(this.state.projects)) + '.svg'}
            getSvgString={this.getSvgString.bind(this)}
            onClose={this.handleExportAsSvgClose}
          />
        }
        {this.state.updatedSnackbarIsOpen &&
          <UpdatedSnackbar
            newGraphvizVersion={this.state.newGraphvizVersion}
            graphvizVersion={this.state.graphvizVersion}
            onUpdatedSnackbarClose={this.handleUpdatedSnackbarClose}
          />
        }
        <Grid container
          spacing={this.state.fullscreen ? 0 : 1.5}
          style={{
            margin: 0,
            width: '100%',
          }}
        >
          <Grid item xs={columns.textEditor} padding={1.5} style={{ display: this.state.fullscreen ? 'none' : 'block' }}>
            <Paper elevation={leftPaneElevation} className={paperClass}>
              {this.state.nodeFormatDrawerIsOpen &&
                <FormatDrawer
                  type='node'
                  defaultAttributes={this.state.defaultNodeAttributes}
                  onClick={this.handleNodeFormatDrawerClick}
                  onFormatDrawerClose={this.handleNodeFormatDrawerClose}
                  onStyleChange={this.handleNodeStyleChange}
                  onColorChange={this.handleNodeColorChange}
                  onFillColorChange={this.handleNodeFillColorChange}
                />
              }
              {this.state.edgeFormatDrawerIsOpen &&
                <FormatDrawer
                  type='edge'
                  defaultAttributes={this.state.defaultEdgeAttributes}
                  onClick={this.handleEdgeFormatDrawerClick}
                  onFormatDrawerClose={this.handleEdgeFormatDrawerClose}
                  onStyleChange={this.handleEdgeStyleChange}
                  onColorChange={this.handleEdgeColorChange}
                  onFillColorChange={this.handleEdgeFillColorChange}
                />
              }
              <div style={{display: editorIsOpen ? 'block' : 'none'}}>
                <TextEditor
                  // allocated viewport width - 2 * padding
                  width={`calc(${columns.textEditor * 100 / 12}vw - 2 * 12px)`}
                  height={`calc(100vh - 64px - 2 * 12px - ${this.updatedSnackbarIsOpen ? "64px" : "0px"})`}
                  dotSrc={this.state.forceNewDotSrc ? this.state.dotSrc : null}
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
          {this.state.insertPanelsAreOpen && this.state.graphInitialized && !this.state.fullscreen && (
            <Grid item xs={columns.insertPanels} padding={1.5}>
              <Paper elevation={midPaneElevation} className={paperClass}>
                <InsertPanels
                    onClick={this.handleInsertPanelsClick}
                    onNodeShapeClick={this.handleNodeShapeClick}
                    onNodeShapeDragStart={this.handleNodeShapeDragStart}
                    onNodeShapeDragEnd={this.handleNodeShapeDragEnd}
                />
              </Paper>
            </Grid>
          )}
          <Grid item xs={columns.graph} padding={this.state.fullscreen ? 0 : 1.5}>
            <Paper elevation={rightPaneElevation} className={paperClass}>
              <Graph
                hasFocus={graphHasFocus}
                dotSrc={this.state.dotSrc}
                engine={this.state.engine}
                fit={this.state.fitGraph}
                transitionDuration={this.state.transitionDuration}
                tweenPaths={this.state.tweenPaths}
                tweenShapes={this.state.tweenShapes}
                tweenPrecision={this.state.tweenPrecision}
                defaultNodeAttributes={this.state.defaultNodeAttributes}
                defaultEdgeAttributes={this.state.defaultEdgeAttributes}
                fullscreen={this.state.fullscreen}
                onFocus={this.handleGraphFocus}
                onTextChange={this.handleTextChangeFromGraph}
                onHelp={this.handleKeyboardShortcutsClick}
                onSelect={this.handleGraphComponentSelect}
                onUndo={this.undo}
                onRedo={this.redo}
                onToggleFullscreen={this.handleToggleFullscreen}
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
                test={this.state.test}
              />
            </Paper>
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
            graphvizVersion={this.state.graphvizVersion}
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

export default withRoot(withStyles(Index, styles));
