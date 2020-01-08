import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

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

  handleChange = (event) => {
    this.name = event.target.value;
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
            <IconButton
              aria-label="Close"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent classes={{root: classes.content}}>
            <DialogContentText>
              Do you want to delete <b>{this.props.name}</b> from the browser&apos;s local storage?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="secondary">
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

export default withRoot(withStyles(styles)(DoYouWantToDeleteDialog));
