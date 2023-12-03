import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
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
    marginLeft: theme.spacing(2),
  },
  styleCheckbox: {
    marginLeft: theme.spacing(0),
    marginTop: theme.spacing(-2),
  },
  colorFormControl: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  colorSwitch: {
    marginLeft: theme.spacing(0),
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

const FormatDrawer = ({classes, type, defaultAttributes, onClick, onFormatDrawerClose, onStyleChange, onColorChange, onFillColorChange} ) => {

  const [colorColorPickerIsOpen, setColorColorPickerIsOpen] = useState(false);
  const [fillColorColorPickerIsOpen, setFillColorColorPickerIsOpen] = useState(false)

  function getStyleSet() {
    if (defaultAttributes.style == null) {
      return new Set([]);
    } else {
      let styleSet = new Set(defaultAttributes.style.split(', '))
      styleSet.add(emptyStyle);
      return styleSet;
    }
  }

  function setStyle(styleSet) {
    if (styleSet.size === 0) {
      onStyleChange(null);
    } else {
      styleSet.delete(emptyStyle);
      onStyleChange([...styleSet].join(', '));
    }
  }

  const handleClick = () => {
    setColorColorPickerIsOpen(false);
    setFillColorColorPickerIsOpen(false);
    onClick();
  };

  const handleDrawerClose = () => {
    onFormatDrawerClose();
  };

  const handleStyleSwitchChange = (event) => {
    let styleSet = getStyleSet();
    styleSet.clear();
    if (event.target.checked) {
      styleSet.add(emptyStyle);
    }
    setStyle(styleSet);
  }

  const handleStyleChange = (styleName) => (event) => {
    const checked = event.target.checked;
    let styleSet = getStyleSet();
    if (checked) {
      styleSet.delete(emptyStyle);
      styleSet.add(styleName);
    }
    else {
      styleSet.delete(styleName);
    }
    setStyle(styleSet);
  };

  const handleColorSwitchChange = (event) => {
    if (event.target.checked) {
      onColorChange(emptyColor);
    } else {
      onColorChange(null);
    }
  }

  const handleColorChange = (color) => {
    onColorChange(color);
  };

  const handleFillColorSwitchChange = (event) => {
    if (event.target.checked) {
      onFillColorChange(emptyColor);
    } else {
      onFillColorChange(null);
    }
  }
  const handleFillColorChange = (color) => {
    onFillColorChange(color);
  };

  let styles = type === 'node' ? nodeStyles : edgeStyles;
  let currentStyle = getStyleSet();
  const theme = useTheme();
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
        onClick={handleClick}
      >
        <div className={classes.drawerHeader}>
          <DialogTitle id="form-dialog-title">
            Default {type} attributes
          </DialogTitle>
          <IconButton id="close-button" onClick={handleDrawerClose} size="large">
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <FormControl variant="standard" className={classes.styleFormControl}>
          <FormGroup row>
            <FormControlLabel
              className={classes.styleSwitch}
              control={
                <Switch
                  id="style-switch"
                  checked={currentStyle.size !== 0}
                  onChange={handleStyleSwitchChange}
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
                  onChange={handleStyleChange(style)}
                  value={style}
                  />
                }
                key={style}
                label={style}
              />
            )}
          </FormGroup>
        </FormControl>
        <FormControl
          variant="standard"
          className={classes.colorFormControl}
          id="color-picker-form">
          <FormGroup row>
            <FormControlLabel
              className={classes.colorSwitch}
              control={
                <Switch
                  id="color-switch"
                  checked={defaultAttributes.color != null}
                  onChange={handleColorSwitchChange}
                />
              }
              label="color"
              labelPlacement="start"
            />
          </FormGroup>
          <FormGroup row>
            <ColorPicker
              id="color-picker"
              open={colorColorPickerIsOpen}
              setOpen={setColorColorPickerIsOpen}
              invert={true}
              color={defaultAttributes.color || ''}
              onChange={color => handleColorChange(color)}
            />
          </FormGroup>
        </FormControl>
        <FormControl
          variant="standard"
          className={classes.colorFormControl}
          id="fillcolor-picker-form">
          <FormGroup row>
            <FormControlLabel
              className={classes.colorSwitch}
              control={
                <Switch
                  id="fillcolor-switch"
                  checked={defaultAttributes.fillcolor != null}
                  onChange={handleFillColorSwitchChange}
                />
              }
              label="fillcolor"
              labelPlacement="start"
            />
          </FormGroup>
          <FormGroup row>
            <ColorPicker
              id="fillcolor-picker"
              open={fillColorColorPickerIsOpen}
              setOpen={setFillColorColorPickerIsOpen}
              color={defaultAttributes.fillcolor || ''}
              onChange={color => handleFillColorChange(color)}
            />
          </FormGroup>
        </FormControl>
      </Drawer>
    </div>
  );
}

FormatDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(FormatDrawer, styles);
