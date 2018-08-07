import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {shapes} from './shapes';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  columns: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  column: {
    flexBasis: '25%',
    flexGrow: '0',
    flexShrink: '0',
    textAlign: 'start',
  },
});

class DrawingPanels extends React.Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleNodeShapeClick = shape => (event) => {
    this.props.onNodeShapeClick(shape);
  };

  handleNodeShapeDragStart = shape => (event) => {
    let graphviz = this.props.getGraphvizInstance();
    this.props.onNodeShapeDragStart(-100, 100, shape);
    let node = graphviz._drawnNode.g;
    let bbox = node.node().getBBox();
    let scale = node.node().getCTM().a;
    node.attr("transform", `scale(${scale})`);
    event.dataTransfer.setDragImage(node.node(), bbox.width / 2 * scale * 4 / 3, bbox.height / 2 * scale * 4 / 3);
    event.dataTransfer.setData("text", shape)
  };

  handleNodeShapeDragEnd = shape => (event) => {
    let graphviz = this.props.getGraphvizInstance();
    graphviz.removeDrawnNode();
  }

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={expanded === 'nodeShapePanel'} onChange={this.handleChange('nodeShapePanel')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Standard</Typography>
            <Typography className={classes.secondaryHeading}>node shapes</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.columns}>
            {Object.keys(shapes).map((shape) =>
              <div
                dangerouslySetInnerHTML={{__html: shapes[shape]}}
                key={shape}
                className={classes.column}
                onClick={this.handleNodeShapeClick(shape)}
                draggable="true"
                onDragStart={this.handleNodeShapeDragStart(shape)}
                onDragEnd={this.handleNodeShapeDragEnd(shape)}
              >
              </div>
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'arrowHeadPanel'} onChange={this.handleChange('arrowHeadPanel')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Edge</Typography>
            <Typography className={classes.secondaryHeading}>
              arrow heads
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.columns}>
            <div className={classes.column}>
              normal
            </div>
            <div className={classes.column}>
              dot
            </div>
            <div className={classes.column}>
              box
            </div>
            <div className={classes.column}>
              crow
            </div>
            <div className={classes.column}>
              curve
            </div>
            <div className={classes.column}>
              icurve
            </div>
            <div className={classes.column}>
              diamond
            </div>
            <div className={classes.column}>
              inv
            </div>
            <div className={classes.column}>
              vee
            </div>
            <div className={classes.column}>
              tee
            </div>
            <div className={classes.column}>
              none
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

DrawingPanels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DrawingPanels);
