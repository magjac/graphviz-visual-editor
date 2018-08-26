import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import packageJSON from '../package.json';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  copyright: {
    marginTop: theme.spacing.unit * 5,
  },
});

class AboutDialog extends React.Component {

  handleClose = () => {
    this.props.onAboutDialogClose();
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
            <DialogTitle id="form-dialog-title">About the Graphviz Visual Editor</DialogTitle>
            <IconButton
              aria-label="Close"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <DialogContentText>
              Version {packageJSON.version}
            </DialogContentText>
            <br/>
            <DialogContentText>
              The Graphviz Visual Editor is an
              {' '}
              <a
                href="https://en.wikipedia.org/wiki/Open-source_software"
                target="_blank"
                rel="noreferrer noopener"
              >
                open source
              </a>
              {' '}
              project and is hosted at
              {' '}
              <a
                href="https://github.com/magjac/graphviz-visual-editor"
                target="_blank"
                rel="noreferrer noopener"
              >
                GitHub
              </a>
              . See the
              {' '}
              <a
                href="https://github.com/magjac/graphviz-visual-editor/blob/master/README.md"
                target="_blank"
                rel="noreferrer noopener"
              >
                README
              </a>
              {' '}
              for more information.
            </DialogContentText>
            <DialogContentText variant='caption' className={classes.copyright}>
              &copy; 2018 Magnus Jacobsson Interactive AB
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

AboutDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(AboutDialog));
