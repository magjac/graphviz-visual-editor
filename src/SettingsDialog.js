import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CloseIcon from '@material-ui/icons/Close';

const engines = [
  'circo',
  'dot',
  'fdp',
  'neato',
  'osage',
  'patchwork',
  'twopi',
];

const styles = theme => ({
  root: {
    overflowY: 'visible',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  formControlLabel: {
    margin: theme.spacing.unit * -0.5,
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  holdOffInput: {
    width: '7em',
  },
  fontSizeInput: {
    width: '5em',
  },
});

class SettingsDialog extends React.Component {

  handleClose = () => {
    this.props.onSettingsClose();
  };

  handleEngineSelectChange = (event) => {
    this.props.onEngineSelectChange(event.target.value);
  };

  handleFitSwitchChange = (event) => {
    this.props.onFitGraphSwitchChange(event.target.checked);
  };

  handleHoldOffChange = (event) => {
    this.props.onHoldOffChange(event.target.value);
  };

  handleFontSizeChange = (event) => {
    this.props.onFontSizeChange(event.target.value);
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
            <DialogTitle id="form-dialog-title">Graph rendering</DialogTitle>
              <IconButton
                aria-label="Close"
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
          </div>
          <DialogContent classes={{root: classes.root}}>
            <DialogContentText>
              These settings affects how the graph is rendered.
            </DialogContentText>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="engine-simple">Engine</InputLabel>
              <Select
                value={this.props.engine}
                onChange={this.handleEngineSelectChange}
                input={<Input name="engine" id="engine-helper" />}
              >
                {engines.map((engine) =>
                  <MenuItem
                    key={engine}
                    value={engine}
                  >
                    {engine}
                  </MenuItem>
                )}
              </Select>
              <FormHelperText>Graphviz layout engine</FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogTitle id="form-dialog-title">Graph viewing</DialogTitle>
          <DialogContent classes={{root: classes.root}}>
            <DialogContentText>
              These settings affects how the graph is viewed. They do not affect the graph itself.
            </DialogContentText>
            <FormGroup row>
              <FormControlLabel
                className={classes.formControlLabel}
                control={
                  <Switch
                    checked={this.props.fitGraph}
                    onChange={this.handleFitSwitchChange}
                  />
                }
                label="Fit graph to available area"
              />
            </FormGroup>
          </DialogContent>
          <DialogTitle id="form-dialog-title">Text Editor</DialogTitle>
          <DialogContent classes={{root: classes.root}}>
            <FormControl
              className={classes.formControl}
              aria-describedby="font-size-helper-text"
            >
              <InputLabel shrink={true}>Font size</InputLabel>
              <Input
                className={classes.fontSizeInput}
                id="font-size"
                type="number"
                value={this.props.fontSize}
                onChange={this.handleFontSizeChange}
                endAdornment={<InputAdornment position="end"> px</InputAdornment>}
                inputProps={{
                  'aria-label': 'FontSize',
                  min: 1,
                  max: 99,
                  step: 1,
                }}
              />
            </FormControl>
          </DialogContent>
          <DialogContent classes={{root: classes.root}}>
            <FormControl
              className={classes.formControl}
              aria-describedby="holdoff-helper-text"
            >
              <InputLabel shrink={true}>Hold-off time</InputLabel>
              <Input
                className={classes.holdOffInput}
                id="holdoff"
                type="number"
                value={this.props.holdOff}
                onChange={this.handleHoldOffChange}
                endAdornment={<InputAdornment position="end"> seconds</InputAdornment>}
                inputProps={{
                  'aria-label': 'Holdoff',
                  min: 0.0,
                  max: 9.9,
                  step: 0.1,
                }}
              />
              <FormHelperText id="holdoff-helper-text">Time of editor inactivity after which graph rendering starts</FormHelperText>
            </FormControl>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

SettingsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(SettingsDialog));
