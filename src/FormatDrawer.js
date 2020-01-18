import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import ColorPicker from './ColorPicker'

const drawerWidth = '100%';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    height: 'calc(100vh - 64px - 2 * 12px)',
    textAlign: 'left',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    textTransform: 'capitalize',
    ...theme.mixins.toolbar,
  },
  styleFormControl: {
  },
  styleSwitch: {
    marginLeft: theme.spacing.unit * 2,
  },
  styleCheckbox: {
    marginLeft: theme.spacing.unit * 0,
    marginTop: theme.spacing.unit * -2,
  },
  colorFormControl: {
    marginLeft: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
  },
  colorSwitch: {
    marginLeft: theme.spacing.unit * 0,
  },
});

const emptyStyle = '';

const nodeStyles = [
  "dashed",
  "dotted",
  "solid",
  "invis",
  "bold",
  "filled",
  "striped",
  "wedged",
  "diagonals",
  "rounded",
  "radial",
];

const edgeStyles = [
  "dashed",
  "dotted",
  "solid",
  "invis",
  "bold",
  "tapered",
];

const emptyColor = '';

class FormatDrawer extends React.Component {

  state = {
    colorColorPickerIsOpen: false,
    fillColorColorPickerIsOpen: false,
  }

  setColorColorPickerOpen = (open) => {
    this.setState({
      colorColorPickerIsOpen: open,
    });
  }

  setFillColorColorPickerOpen = (open) => {
    this.setState({
      fillColorColorPickerIsOpen: open,
    });
  }

  getStyleSet() {
    if (this.props.defaultAttributes.style == null) {
      return new Set([]);
    } else {
      let styleSet = new Set(this.props.defaultAttributes.style.split(', '))
      styleSet.add(emptyStyle);
      return styleSet;
    }
  }

  setStyle(styleSet) {
    if (styleSet.size === 0) {
      this.props.onStyleChange(null);
    } else {
      styleSet.delete(emptyStyle);
      this.props.onStyleChange([...styleSet].join(', '));
    }
  }

  handleClick = () => {
    this.setColorColorPickerOpen(false);
    this.setFillColorColorPickerOpen(false);
    this.props.onClick();
  };

  handleDrawerClose = () => {
    this.props.onFormatDrawerClose();
  };

  handleStyleSwitchChange = (event) => {
    let styleSet = this.getStyleSet();
    styleSet.clear();
    if (event.target.checked) {
      styleSet.add(emptyStyle);
    }
    this.setStyle(styleSet);
  }

  handleStyleChange = (styleName) => (event) => {
    const checked = event.target.checked;
    let styleSet = this.getStyleSet();
    if (checked) {
      styleSet.delete(emptyStyle);
      styleSet.add(styleName);
    }
    else {
      styleSet.delete(styleName);
    }
    this.setStyle(styleSet);
  };

  handleColorSwitchChange = (event) => {
    if (event.target.checked) {
      this.props.onColorChange(emptyColor);
    } else {
      this.props.onColorChange(null);
    }
  }

  handleColorChange = (color) => {
    this.props.onColorChange(color);
  };

  handleFillColorSwitchChange = (event) => {
    if (event.target.checked) {
      this.props.onFillColorChange(emptyColor);
    } else {
      this.props.onFillColorChange(null);
    }
  }
  handleFillColorChange = (color) => {
    this.props.onFillColorChange(color);
  };

  render() {
    const { classes, theme } = this.props;
    const { type } = this.props;

    let styles = type === 'node' ? nodeStyles : edgeStyles;
    let currentStyle = this.getStyleSet();
    return (
      <div className={classes.root}>
        <Drawer
          id="format-drawer"
          variant="persistent"
          anchor='left'
          open
          classes={{
            paper: classes.drawerPaper,
          }}
          onClick={this.handleClick}
        >
          <div className={classes.drawerHeader}>
            <DialogTitle id="form-dialog-title">
              Default {this.props.type} attributes
            </DialogTitle>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <FormControl className={classes.styleFormControl}>
            <FormGroup row>
              <FormControlLabel
                className={classes.styleSwitch}
                control={
                  <Switch
                    id="style-switch"
                    checked={currentStyle.size !== 0}
                    onChange={this.handleStyleSwitchChange}
                  />
                }
                label="style"
                labelPlacement="start"
              />
            </FormGroup>
            <FormGroup row id="styles">
              {styles.map((style) =>
                <FormControlLabel
                className={classes.styleCheckbox}
                  control={
                    <Checkbox
                      id={style}
                      checked={currentStyle.has(style)}
                    onChange={this.handleStyleChange(style)}
                    value={style}
                    />
                  }
                  key={style}
                  label={style}
                />
              )}
            </FormGroup>
          </FormControl>
          <FormControl className={classes.colorFormControl} id="color-picker-form">
            <FormGroup row>
              <FormControlLabel
                className={classes.colorSwitch}
                control={
                  <Switch
                    id="color-switch"
                    checked={this.props.defaultAttributes.color != null}
                    onChange={this.handleColorSwitchChange}
                  />
                }
                label="color"
                labelPlacement="start"
              />
            </FormGroup>
            <FormGroup row>
              <ColorPicker
                id="color-picker"
                open={this.state.colorColorPickerIsOpen}
                setOpen={this.setColorColorPickerOpen}
                invert={true}
                color={this.props.defaultAttributes.color || ''}
                onChange={color => this.handleColorChange(color)}
              />
            </FormGroup>
          </FormControl>
          <FormControl className={classes.colorFormControl} id="fillcolor-picker-form">
            <FormGroup row>
              <FormControlLabel
                className={classes.colorSwitch}
                control={
                  <Switch
                    id="fillcolor-switch"
                    checked={this.props.defaultAttributes.fillcolor != null}
                    onChange={this.handleFillColorSwitchChange}
                  />
                }
                label="fillcolor"
                labelPlacement="start"
              />
            </FormGroup>
            <FormGroup row>
              <ColorPicker
                id="fillcolor-picker"
                open={this.state.fillColorColorPickerIsOpen}
                setOpen={this.setFillColorColorPickerOpen}
                color={this.props.defaultAttributes.fillcolor || ''}
                onChange={color => this.handleFillColorChange(color)}
              />
            </FormGroup>
          </FormControl>
        </Drawer>
      </div>
    );
  }
}

FormatDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FormatDrawer);
