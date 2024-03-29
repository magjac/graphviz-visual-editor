import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import withRoot from './withRoot.js';
import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Button } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogActions } from '@mui/material';

const styles = theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
    overflowY: 'visible',
  },
});

class DoYouWantToDeleteDialog extends React.Component {

  handleClose = () => {
    this.props.onClose();
  };

  handleDelete = (event) => {
    const askForConfirmationIfExist = false;
    this.props.onDelete(this.props.name, askForConfirmationIfExist);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          id="delete-graph-dialog"
          className={classes.root}
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">Delete {this.props.name}?</DialogTitle>
            <IconButton aria-label="Close" onClick={this.handleClose} size="large">
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent classes={{root: classes.content}}>
            <DialogContentText>
              Do you want to delete <b>{this.props.name}</b> from the browser&apos;s local storage?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary" id="cancel">
              Cancel
            </Button>
            <Button onClick={this.handleDelete} color="secondary" id ="delete">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DoYouWantToDeleteDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default withRoot(withStyles(DoYouWantToDeleteDialog, styles));
