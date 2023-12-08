import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import withRoot from './withRoot';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CloseIcon from '@mui/icons-material/Close';

const keyboardShortcuts = [
  {key: 'Ctrl-A', description: 'Select all nodes and edges.'},
  {key: 'Ctrl-Shift-A', description: 'Select all edges.'},
  {key: 'Ctrl-C', description: 'Copy the selected node.'},
  {key: 'Ctrl-V', description: 'Paste the cut/copied node.'},
  {key: 'Ctrl-X', description: 'Cut the selected node.'},
  {key: 'Ctrl-Y', description: 'Redo. Reimplement the last DOT source change.'},
  {key: 'Ctrl-Z', description: 'Undo. Revert the last DOT source change.'},
  {key: 'DEL', description: 'Delete the selected nodes and edges.'},
  {key: 'ESC', description: 'De-select the selected nodes and edges. Abort the current drawing operation.'},
  {key: '?', description: 'Show keyboard shortcuts.'},
];

const styles = theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  table: {
    marginBottom: theme.spacing(2),
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
        <Dialog id="keyboard-shortcuts-dialog"
          open
          onClose={this.handleClose}
          scroll={'paper'}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">Keyboard shortcuts in the graph</DialogTitle>
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
                {keyboardShortcuts.map(keyboardShortcut => {
                  return (
                    <TableRow key={keyboardShortcut.key}>
                      <TableCell component="th" scope="row" padding="none">
                        {keyboardShortcut.key}
                      </TableCell>
                      <TableCell size="small">
                        {keyboardShortcut.description}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <DialogContentText variant="body1">
              For keyboard shortcuts in the text editor, please visit <a href="https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts" target="_blank" rel="noreferrer noopener">Ace Default Keyboard Shortcuts</a>
            </DialogContentText>
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
