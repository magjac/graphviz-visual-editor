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
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
    overflowY: 'visible',
  },
});

class SaveToBrowserAsDialog extends React.Component {

  handleClose = () => {
    this.props.onClose();
  };

  handleChange = (event) => {
    this.name = event.target.value;
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.props.onSave(this.name);
    }
  };

  handleSave = () => {
    this.props.onSave(this.name);
  };

  render() {
    const { classes } = this.props;
    this.name = this.props.name;
    return (
      <div>
        <Dialog
          className={classes.root}
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">Save graph to browser</DialogTitle>
            <IconButton
              aria-label="Close"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent classes={{root: classes.content}}>
            <DialogContentText>
              Save a the current graph to the browser&apos;s local storage under a new name.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="New name"
              type="text"
              placeholder={this.props.name}
              fullWidth
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleSave} color="secondary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

SaveToBrowserAsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(SaveToBrowserAsDialog));
