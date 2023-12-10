import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import withRoot from './withRoot';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Input from '@mui/material/Input';

const styles = theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
    overflowY: 'visible',
  },
});

class ExportAsUrlDialog extends React.Component {

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

  handleCopy = () => {
    this.input.select();
    document.execCommand('copy');
  };

  handleOpen = () => {
    window.open(this.props.URL);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          id="export-graph-as-url-dialog"
          className={classes.root}
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">
              Export graph as URL
            </DialogTitle>
            <IconButton aria-label="Close" onClick={this.handleClose} size="large">
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent classes={{root: classes.content}}>
            <DialogContentText>
              The URL below is a link to the application with the DOT source code as an URL parameter. It can be used to share graphs with others.
            </DialogContentText>
            <br/>
            <Input
              inputRef={(input) => {this.input = input}}
              inputProps={{
                size: 60,
              }}
              autoFocus
              id="export"
              type="text"
              value={this.props.URL}
              readOnly
            />
            <Button
              id="copy"
              variant='text'
              size='medium'
              color="secondary"
              aria-label="Copy"
              onClick={this.handleCopy}
            >
              <LinkIcon />
              Copy
            </Button>
          </DialogContent>
          <DialogActions>
            <Button id="cancel" onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button id="open-link" onClick={this.handleOpen} color="secondary">
              Open link
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ExportAsUrlDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  URL: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRoot(withStyles(ExportAsUrlDialog, styles));
