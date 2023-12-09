import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import { Accordion } from '@mui/material';
import { AccordionDetails } from '@mui/material';
import { AccordionSummary } from '@mui/material';
import { Typography } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {shapes} from './shapes.js';

const nodeShapeCategories = [
  {
    name: 'Basic shapes',
    shapes: [
      "ellipse",
      "circle",
      "egg",
      "triangle",
      "box",
      "square",
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
    ],
  },
  {
    name: 'Basic symbols',
    shapes: [
      "note",
      "tab",
      "folder",
      "box3d",
      "component",
      "underline",
      "cylinder",
    ],
  },
  {
    name: 'Special shapes',
    shapes: [
      "doublecircle",
      "invtriangle",
      "invtrapezium",
      "invhouse",
      "doubleoctagon",
      "tripleoctagon",
      "Mdiamond",
      "Msquare",
      "Mcircle",
      "star",
    ],
  },
  {
    name: 'Gene expression symbols',
    shapes: [
      "promoter",
      "cds",
      "terminator",
      "utr",
      "insulator",
      "ribosite",
      "rnastab",
      "proteasesite",
      "proteinstab",
    ],
  },
  {
    name: 'DNA construction symbols',
    shapes: [
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
    ],
  },
  {
    name: 'Other shapes',
    shapes: [
      "polygon",
      "oval",
      "point",
      "none",
      "rect",
      "rectangle",
      "record",
      "Mrecord",
      "(default)",
    ],
  },
];

const styles = theme => ({
  root: {
    width: '100%',
    overflowY: 'auto',
    height: 'calc(100vh - 64px - 2 * 12px)',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexShrink: 0,
  },
  columns: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  column: {
    flexBasis: '25%',
    flexGrow: '1',
    flexShrink: '0',
    textAlign: 'start',
  },
});

class InsertPanels extends React.Component {
  state = {
    expanded: null,
  };

  handleClick = () => {
    this.props.onClick();
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleNodeShapeClick = shape => (event) => {
    event.stopPropagation();
    this.props.onNodeShapeClick(event, shape);
  };

  handleNodeShapeDragStart = shape => (event) => {
    this.props.onNodeShapeDragStart(event, shape);
  };

  handleNodeShapeDragEnd = shape => (event) => {
    this.props.onNodeShapeDragEnd(event);
  }

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div id="insert-panels" className={classes.root} onClick={this.handleClick}>
        {nodeShapeCategories.map((nodeShapeCategory) =>
          <Accordion
            key={nodeShapeCategory.name}
            expanded={expanded === nodeShapeCategory}
            onChange={this.handleChange(nodeShapeCategory)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{nodeShapeCategory.name}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.columns}>
              {nodeShapeCategory.shapes.map((shape) =>
                <div
                  id={shape}
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
            </AccordionDetails>
          </Accordion>
        )}
      </div>
    );
  }
}

InsertPanels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(InsertPanels, styles);
