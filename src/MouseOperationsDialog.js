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
  {key: 'Double-click canvas', description: 'Zoom in.'},
  {key: 'Ctrl-drag canvas', description: 'Pan graph.'},
  {key: 'Click node or edge', description: 'Select node or edge.'},
  {key: 'Shift/Ctrl-click node or edge', description: 'Add node or edge to selection.'},
  {key: 'Drag canvas', description: 'Select nodes and edges within dragged area.'},
  {key: 'Shift-drag canvas', description: 'Add nodes and edges within dragged area to selection.'},
  {key: 'Right-click node', description: 'Start drawing an edge from node.'},
  {key: 'Double-click node', description: 'Connect edge being drawn to node.'},
  {key: 'Middle-click canvas', description: 'Insert node with the latest used shape and default attributes.'},
  {key: 'Click insert shape', description: 'Insert node from insert panel with default attributes.'},
  {key: 'Drag-and-drop insert shape', description: 'Insert node from insert panel with default attributes.'},
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
          <DialogTitle id="form-dialog-title">Mouse operations in graph</DialogTitle>
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
