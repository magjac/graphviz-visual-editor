import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import withRoot from './withRoot';
import CloseIcon from '@mui/icons-material/Close';
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

class ExportAsSvgDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filename: props.defaultFilename,
    };
  }

  handleClose = () => {
    this.props.onClose();
  };

  handleExportSvg = () => {
    // TODO: move downloadFile function to a utility module
    function downloadFile(fileData, fileName, mimeType) {
      const fileBlob = new Blob([fileData], {type: mimeType})
      const fileObjectURL = window.URL.createObjectURL(fileBlob)
      const tempLink = document.createElement('a')
      tempLink.href = fileObjectURL
      tempLink.download = fileName
      document.body.appendChild(tempLink)
      tempLink.click()
      document.body.removeChild(tempLink)
    }
    const fileData = this.props.getSvgString()
    const fileName = this.state.filename
    const mimeType = 'image/svg+xml'
    downloadFile(fileData, fileName, mimeType)
    this.props.onClose()
  }

  handleChange = (event) => {
    this.setState({
      filename: event.target.value
    })
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          id="export-graph-as-svg-dialog"
          className={classes.root}
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">
              Export Graph as SVG
            </DialogTitle>
            <IconButton aria-label="Close" onClick={this.handleClose} size="large">
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent classes={{root: classes.content}}>
            <DialogContentText>
              Choose a name for the exported SVG file
            </DialogContentText>
            <br/>
            <Input
              inputProps={{
                size: 60,
              }}
              autoFocus
              id="export"
              type="text"
              value={this.state.filename}
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button id="cancel" onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button id="export-svg" onClick={this.handleExportSvg} color="secondary" variant="contained">
              Export SVG
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ExportAsSvgDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  defaultFilename: PropTypes.string.isRequired,
  getSvgString: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRoot(withStyles(ExportAsSvgDialog, styles));
