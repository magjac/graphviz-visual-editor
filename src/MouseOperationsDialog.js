import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import withRoot from './withRoot.js';
import { IconButton } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { Table } from '@mui/material';
import { TableBody } from '@mui/material';
import { TableCell } from '@mui/material';
import { TableRow } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const mouseOperations = [
  {key: 'Mouse wheel', description: 'Zoom in or out.'},
  {key: 'Double-click the canvas', description: 'Zoom in.'},
  {key: 'Ctrl-drag the canvas', description: 'Pan the graph.'},
  {key: 'Click a node or an edge', description: 'Select the node or an edge.'},
  {key: 'Shift/Ctrl-click a node or an edge', description: 'Add the node or an edge to selection.'},
  {key: 'Drag the canvas', description: 'Select the nodes and edges within the dragged area.'},
  {key: 'Shift-drag the canvas', description: 'Add the nodes and edges within the dragged area to the selection.'},
  {key: 'Right-click a node', description: 'Start drawing an edge from the node.'},
  {key: 'Double-click a node', description: 'Connect the edge being drawn to the node.'},
  {key: 'Middle-click the canvas', description: 'Insert a node with the latest used shape and attributes.'},
  {key: 'Shift-middle-click the canvas', description: 'Insert a node with the latest inserted shape and default attributes.'},
  {key: 'Click an insert shape', description: 'Insert a node from the insert panel with default attributes.'},
  {key: 'Drag-and-drop an insert shape', description: 'Insert a node from the insert panel with default attributes.'},
];

const styles = theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

class MouseOperationsDialog extends React.Component {

  handleClose = () => {
    this.props.onMouseOperationsDialogClose();
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog id="mouse-operations-dialog"
          open
          onClose={this.handleClose}
          scroll={'paper'}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">Mouse operations in the graph</DialogTitle>
            <IconButton
              id="close-button"
              aria-label="Close"
              onClick={this.handleClose}
              size="large">
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <Table className={classes.table}>
              <TableBody>
                {mouseOperations.map(mouseOperation => {
                  return (
                    <TableRow key={mouseOperation.key}>
                      <TableCell component="th" scope="row" padding="none">
                        {mouseOperation.key}
                      </TableCell>
                      <TableCell size="small">
                        {mouseOperation.description}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

MouseOperationsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(MouseOperationsDialog, styles));
