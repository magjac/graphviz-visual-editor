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

class DoYouWantToReplaceItDialog extends React.Component {

  handleClose = () => {
    this.props.onClose();
  };

  handleReplace = () => {
    this.props.onReplace();
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          id="replace-graph-dialog"
          className={classes.root}
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">Replace "{this.props.name}"?</DialogTitle>
            <IconButton
              aria-label="Close"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent classes={{root: classes.content}}>
            <DialogContentText>
              "{this.props.name}" already exists. Do you want to replace it?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleReplace} color="secondary" id="replace">
              Replace
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DoYouWantToReplaceItDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired,
};

export default withRoot(withStyles(styles)(DoYouWantToReplaceItDialog));
