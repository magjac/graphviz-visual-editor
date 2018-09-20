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
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import moment from 'moment';

const styles = theme => ({
  root: {
    userSelect: 'none',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  table: {
    minWidth: 700,
  },
});

class OpenFromBrowserDialog extends React.Component {

  state = {
    selectedName: this.props.name,
  }

  handleClose = () => {
    this.props.onClose();
  };

  handleClick = (name) => (event) =>{
    this.setState({selectedName: name});
  };

  handleDoubleClick = (name) => (event) =>{
    this.props.onOpen(name);
  };

  handleOpen = (event) => {
    this.props.onOpen(this.state.selectedName);
  };

  render() {
    const { classes } = this.props;
    const projects = {
      [this.props.name]: {
        dotSrc: this.props.dotSrc,
        dotSrcLastChangeTime: this.props.dotSrcLastChangeTime,
      },
      ...this.props.projects,
    };
    return (
      <div>
        <Dialog
          maxWidth={false}
          className={classes.root}
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">Open graph from browser</DialogTitle>
            <IconButton
              aria-label="Close"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <DialogContentText>
              Open a graph from the browser&apos;s local storage.
            </DialogContentText>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>DOT Source</TableCell>
                  <TableCell>Last Changed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(projects).map((name) => {
                  const project = projects[name];
                  return (
                      <TableRow
                        key={name}
                        selected={name === this.state.selectedName}
                        hover
                        onClick={this.handleClick(name)}
                        onDoubleClick={this.handleDoubleClick(name)}
                      >
                      <TableCell component="th" scope="project">
                        {name}
                      </TableCell>
                      <TableCell>
                        <pre>
                          {project.dotSrc.split('\n').slice(0, 3).join('\n')}
                        </pre>
                      </TableCell>
                      <TableCell>
                        {project.dotSrcLastChangeTime ? moment(project.dotSrcLastChangeTime).fromNow() : ''}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleOpen} color="secondary">
              Open
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

OpenFromBrowserDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  dotSrc: PropTypes.string.isRequired,
  dotSrcLastChangeTime: PropTypes.number.isRequired,
  projects: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default withRoot(withStyles(styles)(OpenFromBrowserDialog));
