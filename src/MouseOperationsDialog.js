import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

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
});

class MouseOperationsDialog extends React.Component {

  handleClose = () => {
    this.props.onMouseOperationsDialogClose();
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleClose}
          scroll={'paper'}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Mouse operations in the graph</DialogTitle>
          <DialogContent>
            <Table className={classes.table}>
              <TableBody>
                {mouseOperations.map(mouseOperation => {
                  return (
                    <TableRow key={mouseOperation.key}>
                      <TableCell component="th" scope="row" padding="none">
                        {mouseOperation.key}
                      </TableCell>
                      <TableCell padding="dense">
                        {mouseOperation.description}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button
              color="inherit"
              aria-label="Close"
              onClick={this.handleClose}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

MouseOperationsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(MouseOperationsDialog));
