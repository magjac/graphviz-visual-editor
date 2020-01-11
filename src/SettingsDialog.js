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
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
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
  transitionDuration: {
    width: '7.6em',
  },
  group: {
    marginTop: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 0,
  },
  tweenPrecisionAbsoluteInput: {
    marginTop: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 1.5,
    width: '6.9em',
  },
  tweenPrecisionRelativeInput: {
    marginTop: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 1.5,
    width: '4.8em',
  },
  holdOffInput: {
    width: '7.6em',
  },
  fontSizeInput: {
    width: '5em',
  },
  tabSizeInput: {
    width: '7.1em',
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

  handleTransitionDurationChange = (event) => {
    this.props.onTransitionDurationChange(event.target.value);
  };

  handleTweenPathsSwitchChange = (event) => {
    this.props.onTweenPathsSwitchChange(event.target.checked);
  };

  handleTweenShapesSwitchChange = (event) => {
    this.props.onTweenShapesSwitchChange(event.target.checked);
  };

  handleTweenPrecisionChange = (event) => {
    let tweenPrecision = event.target.value;
    if (event.target.value === 'absolute' || tweenPrecision > 1) {
      tweenPrecision = Math.max(Math.ceil(tweenPrecision), 1);
    }
    this.props.onTweenPrecisionChange(tweenPrecision.toString() + (this.props.tweenPrecision.includes('%') ? '%': ''));
  };

  handleTweenPrecisionIsRelativeRadioChange = (event) => {
    let tweenPrecision = +this.props.tweenPrecision.split('%')[0];
    if (event.target.value === 'absolute' || tweenPrecision > 1) {
      tweenPrecision = Math.max(Math.ceil(tweenPrecision), 1);
    }
    this.props.onTweenPrecisionChange(tweenPrecision.toString() + (event.target.value === 'relative' ? '%': ''));
  };

  handleHoldOffChange = (event) => {
    this.props.onHoldOffChange(event.target.value);
  };

  handleFontSizeChange = (event) => {
    this.props.onFontSizeChange(event.target.value);
  };

  handleTabSizeChange = (event) => {
    this.props.onTabSizeChange(event.target.value);
  };

  render() {
    const { classes } = this.props;
    const tweenPrecisionIsRelative = this.props.tweenPrecision.includes('%');
    const tweenPrecision = +this.props.tweenPrecision.split('%')[0];
    const tweenPrecisionType = tweenPrecisionIsRelative ? 'relative' :  'absolute';
    const tweenPrecisionUnit = tweenPrecisionIsRelative ? '%' :  'points';
    const enableTweenPrecisionSetting = this.props.tweenPaths || this.props.tweenShapes;
    const tweenPrecisionStep = (tweenPrecisionIsRelative && tweenPrecision <= 1) ? 0.1 : 1;
    const tweenPrecisionInputClass = tweenPrecisionIsRelative ? classes.tweenPrecisionRelativeInput : classes.tweenPrecisionAbsoluteInput;
    return (
      <div>
        <Dialog
          id="settings-dialog"
          open
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
                    id="fit-switch"
                    checked={this.props.fitGraph}
                    onChange={this.handleFitSwitchChange}
                  />
                }
                label="Fit graph to available area"
              />
            </FormGroup>
            <FormControl
              className={classes.formControl}
              aria-describedby="transition-duration-helper-text"
            >
              <InputLabel shrink={true}>Transition duration</InputLabel>
              <Input
                className={classes.transitionDuration}
                id="transition-duration"
                type="number"
                value={this.props.transitionDuration}
                onChange={this.handleTransitionDurationChange}
                endAdornment={<InputAdornment position="end"> seconds</InputAdornment>}
                inputProps={{
                  'aria-label': 'transitionDuration',
                  min: 0.1,
                  max: 99,
                  step: 0.1,
                }}
              />
            </FormControl>
            <FormGroup row>
              <FormControlLabel
                className={classes.formControlLabel}
                control={
                  <Switch
                    checked={this.props.tweenPaths}
                    onChange={this.handleTweenPathsSwitchChange}
                  />
                }
                label="Enable path tweening during transitions"
              />
            </FormGroup>
            <FormGroup row>
              <FormControlLabel
                className={classes.formControlLabel}
                control={
                  <Switch
                    checked={this.props.tweenShapes}
                    onChange={this.handleTweenShapesSwitchChange}
                  />
                }
                label="Enable shape tweening during transitions"
              />
            </FormGroup>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Tweening precision</FormLabel>
              <RadioGroup
                name="tweenPrecision"
                className={classes.group}
                value={tweenPrecisionType}
                onChange={this.handleTweenPrecisionIsRelativeRadioChange}
              >
                <FormControlLabel
                  className={classes.formControlLabel}
                  value="absolute"
                  disabled={!enableTweenPrecisionSetting}
                  control={<Radio />}
                  label="Absolute"
                />
                <FormControlLabel
                  className={classes.formControlLabel}
                  value="relative"
                  disabled={!enableTweenPrecisionSetting}
                  control={<Radio />}
                  label="Relative"
                />
              </RadioGroup>
              <Input
                className={tweenPrecisionInputClass}
                id="tween-precision"
                type="number"
                value={tweenPrecision}
                disabled={!enableTweenPrecisionSetting}
                onChange={this.handleTweenPrecisionChange}
                endAdornment={<InputAdornment position="end"> {tweenPrecisionUnit} </InputAdornment>}
                inputProps={{
                  'aria-label': 'tweenPrecision',
                  min: tweenPrecisionStep,
                  max: tweenPrecisionIsRelative ? 100 : 999,
                  step: tweenPrecisionStep,
                }}
              />
            </FormControl>
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
              aria-describedby="tab-size-helper-text"
            >
              <InputLabel shrink={true}>Tab size</InputLabel>
              <Input
                className={classes.tabSizeInput}
                id="tab-size"
                type="number"
                value={this.props.tabSize}
                onChange={this.handleTabSizeChange}
                endAdornment={<InputAdornment position="end"> spaces</InputAdornment>}
                inputProps={{
                  'aria-label': 'TabSize',
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
