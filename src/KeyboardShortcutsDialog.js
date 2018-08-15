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

const keyboardShortcuts = [
  {key: 'Ctrl-C', description: 'Copy selected node.'},
  {key: 'Ctrl-V', description: 'Paste cut/copied node.'},
  {key: 'Ctrl-X', description: 'Cut selected node.'},
  {key: 'DEL', description: 'Delete selected nodes and edges.'},
  {key: 'ESC', description: 'De-select selected nodes and edges. Abort current drawing operation.'},
  {key: '?', description: 'Show keyboard shortcuts.'},
];

const styles = theme => ({
});

class KeyboardShortcutsDialog extends React.Component {

  handleClose = () => {
    this.props.onKeyboardShortcutsDialogClose();
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
          <DialogTitle id="form-dialog-title">Keyboard shortcuts in graph</DialogTitle>
          <DialogContent>
            <Table className={classes.table}>
              <TableBody>
                {keyboardShortcuts.map(keyboardShortcut => {
                  return (
                    <TableRow key={keyboardShortcut.key}>
                      <TableCell component="th" scope="row" padding="none">
                        {keyboardShortcut.key}
                      </TableCell>
                      <TableCell padding="none">
                        {keyboardShortcut.description}
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

KeyboardShortcutsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(KeyboardShortcutsDialog));
