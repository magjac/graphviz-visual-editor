import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CloseIcon from '@material-ui/icons/Close';

const keyboardShortcuts = [
  {key: 'Ctrl-C', description: 'Copy the selected node.'},
  {key: 'Ctrl-V', description: 'Paste the cut/copied node.'},
  {key: 'Ctrl-X', description: 'Cut the selected node.'},
  {key: 'DEL', description: 'Delete the selected nodes and edges.'},
  {key: 'ESC', description: 'De-select the selected nodes and edges. Abort the current drawing operation.'},
  {key: '?', description: 'Show keyboard shortcuts.'},
];

const styles = theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
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
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">Keyboard shortcuts in the graph</DialogTitle>
            <IconButton
              aria-label="Close"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <Table className={classes.table}>
              <TableBody>
                {keyboardShortcuts.map(keyboardShortcut => {
                  return (
                    <TableRow key={keyboardShortcut.key}>
                      <TableCell component="th" scope="row" padding="none">
                        {keyboardShortcut.key}
                      </TableCell>
                      <TableCell padding="dense">
                        {keyboardShortcut.description}
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

KeyboardShortcutsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(KeyboardShortcutsDialog));
