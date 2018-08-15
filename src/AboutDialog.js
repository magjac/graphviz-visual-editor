import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import packageJSON from '../package.json';

const styles = theme => ({
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
          <DialogTitle id="form-dialog-title">About Graphviz Visual Editor</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Version {packageJSON.version}
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
