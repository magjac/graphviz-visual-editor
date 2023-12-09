import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import withRoot from './withRoot.js';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { Button } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogActions } from '@mui/material';
import { TextField } from '@mui/material';
import DoYouWantToReplaceItDialog from './DoYouWantToReplaceItDialog.js';

const styles = theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
    overflowY: 'visible',
  },
});

class SaveAsToBrowserDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      doYouWantToReplaceItDialogIsOpen: false,
    };
    this.name = this.props.defaultNewName;
  }

  handleClose = () => {
    this.props.onClose();
  };

  handleChange = (event) => {
    this.name = event.target.value;
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleSave();
    }
  };

  handleSave = () => {
    const newName = this.name;
    const currentName = this.props.name;
    if (this.props.projects[newName] == null || newName === currentName) {
      this.handleConfirmedSave();
    } else {
      this.setState({
        doYouWantToReplaceItDialogIsOpen: true,
        replaceName: newName,
      });
    }
  };

  handleConfirmedSave = () => {
    this.setState({
      doYouWantToReplaceItDialogIsOpen: false,
    });
    this.props.onSave(this.name);
  };

  handleDoYouWantToReplaceItClose = () => {
    this.setState({
      doYouWantToReplaceItDialogIsOpen: false,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
           id="save-to-browser-dialog"
          className={classes.root}
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">
              {this.props.rename ? 'Rename graph' : 'Save graph to browser'}
            </DialogTitle>
            <IconButton aria-label="Close" onClick={this.handleClose} size="large">
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent classes={{root: classes.content}}>
            <DialogContentText>
              {this.props.rename ?
                "Give the current graph a new name in the browser's local storage." :
                "Save a the current graph to the browser's local storage under a new name."
              }
            </DialogContentText>
            <TextField
              variant="standard"
              autoFocus
              margin="dense"
              id="name"
              label="New name"
              type="text"
              placeholder={this.props.defaultNewName}
              fullWidth
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleSave} color="secondary" id="save">
              {this.props.rename ? 'Rename' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.doYouWantToReplaceItDialogIsOpen &&
          <DoYouWantToReplaceItDialog
            name={this.state.replaceName}
            onReplace={this.handleConfirmedSave}
            onClose={this.handleDoYouWantToReplaceItClose}
          />
        }
      </div>
    );
  }
}

SaveAsToBrowserDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  defaultNewName: PropTypes.string.isRequired,
  projects: PropTypes.object.isRequired,
};

export default withRoot(withStyles(SaveAsToBrowserDialog, styles));
