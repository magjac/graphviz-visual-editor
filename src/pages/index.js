import React from 'react';
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
import SettingsDialog from '../SettingsDialog';
import DrawingPanels from '../DrawingPanels';
import FormatDrawer from '../FormatDrawer';
import { schemeCategory10 as d3_schemeCategory10} from 'd3-scale-chromatic';
import { schemePaired as d3_schemePaired} from 'd3-scale-chromatic';

const styles = theme => ({
  root: {
    textAlign: 'center',
  },
  paper: {
    // viewport height - app bar - 2 * padding
    height: "calc(100vh - 64px - 2 * 12px)",
  }
});

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
      dotSrc: dotSrc,
      menuIsOpen: false,
      settingsDialogIsOpen: false,
      mode: localStorage.getItem('mode') || 'browse',
      formatDrawerIsOpen: (localStorage.getItem('formatDrawerIsOpen') || 'false') === 'true',
      fitGraph : localStorage.getItem('fitGraph') === 'true',
      defaultNodeAttributes: JSON.parse(localStorage.getItem('defaultNodeAttributes')) || {},
    };
  }

  setPersistentState = (updater) => {
    this.setState(updater, function (updater) {
      if (typeof updater === 'function') {
        var obj = updater(this.state);
      } else {
        obj = updater;
      }
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
    }.bind(this, updater));
  }

  handleTextChange = (text) => {
    this.setPersistentState({
      dotSrc: text
    });
  }

  handleMenuButtonClick = (anchorEl) => {
    this.setState({
      menuIsOpen: true,
      menuAnchorEl: anchorEl,
    });
  }

  handleMenuClose = () => {
    this.setState({
      menuIsOpen: false,
    });
  }

  handleModeChange = (mode) => {
    this.setPersistentState({
      mode: mode,
    });
  }

  handleFormatClick = () => {
    this.setPersistentState({
      formatDrawerIsOpen: true,
    });
  }

  handleFormatDrawerClose = () => {
    this.setPersistentState({
      formatDrawerIsOpen: false,
    });
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

  handleFitGraphSwitchChange = (fitGraph) => {
    this.setPersistentState({
      fitGraph: fitGraph,
    });
  }

  handleNodeShapeClick = (shape) => {
    let x0 = null;
    let y0 = null;
    this.insertNode(x0, y0, {shape: shape});
  }

  handleNodeStyleChange = (style) => {
    this.setPersistentState(prevState => ({
      defaultNodeAttributes: {
          ...prevState.defaultNodeAttributes,
        style: style,
      },
    }));
  }

  handleNodeColorChange = (color) => {
    this.setPersistentState(prevState => ({
      defaultNodeAttributes: {
          ...prevState.defaultNodeAttributes,
        color: color,
      },
    }));
  }

  handleNodeFillColorChange = (color) => {
    this.setPersistentState(prevState => ({
      defaultNodeAttributes: {
          ...prevState.defaultNodeAttributes,
        fillcolor: color,
      },
    }));
  }

  registerInsertNode = (insertNode) => {
    this.insertNode = insertNode;
  }

  render() {
    const { classes } = this.props;

    var columns;
    if (this.state.mode === 'draw') {
      columns = {
        textEditor: 3,
        drawPanel: 3,
        graph: 6,
      }
    } else { /* browse */
      columns = {
        textEditor: 6,
        drawPanel: false,
        graph: 6,
      }
    }
    return (
      <div className={classes.root}>
        {/* FIXME: Find a way to get viz.js from the graphviz-visual-editor bundle */}
        <script src="https://unpkg.com/viz.js@1.8.2/viz.js" type="javascript/worker"></script>
        <ButtonAppBar
          onMenuButtonClick={this.handleMenuButtonClick}
          onModeChange={this.handleModeChange}
          onFormatClick={this.handleFormatClick}
        >
        </ButtonAppBar>
        <MainMenu
          anchorEl={this.state.menuAnchorEl}
          open={this.state.menuIsOpen}
          onMenuClose={this.handleMenuClose}
          onSettingsClick={this.handleSettingsClick}
        />
        <SettingsDialog
          open={this.state.settingsDialogIsOpen}
          fitGraph={this.state.fitGraph}
          onFitGraphSwitchChange={this.handleFitGraphSwitchChange}
          onSettingsClose={this.handleSettingsClose}
        />
        <Grid container
          spacing={24}
          style={{
            margin: 0,
            width: '100%',
          }}
        >
          <Grid item xs={columns.textEditor}>
            <Paper className={classes.paper}>
              <FormatDrawer
                open={this.state.formatDrawerIsOpen}
                defaultNodeAttributes={this.state.defaultNodeAttributes}
                onFormatDrawerClose={this.handleFormatDrawerClose}
                onNodeStyleChange={this.handleNodeStyleChange}
                onNodeColorChange={this.handleNodeColorChange}
                onNodeFillColorChange={this.handleNodeFillColorChange}
              />
              <TextEditor
                // allocated viewport width - 2 * padding
                width={`calc(${columns.textEditor * 100 / 12}vw - 2 * 12px)`}
                dotSrc={this.state.dotSrc}
                onTextChange={this.handleTextChange}
              />
            </Paper>
          </Grid>
          {this.state.mode === 'draw' && (
              <Grid item xs={columns.drawPanel}>
                <Paper className={classes.paper}>
                  <DrawingPanels
                    onNodeShapeClick={this.handleNodeShapeClick}
                  />
                </Paper>
              </Grid>
          )}
          <Grid item xs={columns.graph}>
            <Paper className={classes.paper}>
              <Graph
                dotSrc={this.state.dotSrc}
                fit={this.state.fitGraph}
                defaultNodeAttributes={this.state.defaultNodeAttributes}
                onTextChange={this.handleTextChange}
                registerInsertNode={this.registerInsertNode}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
