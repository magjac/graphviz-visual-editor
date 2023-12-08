import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import withRoot from './withRoot';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

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
            <IconButton aria-label="Close" onClick={this.handleClose} size="large">
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent classes={{root: classes.content}}>
            <DialogContentText>
              "{this.props.name}" already exists. Do you want to replace it?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary" id="cancel">
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
