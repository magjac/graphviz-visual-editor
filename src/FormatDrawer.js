import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ColorPicker from 'material-ui-color-picker'

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
  },
  drawerPaperClosed: {
    position: 'relative',
    width: drawerWidth,
    height: 0,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    textTransform: 'capitalize',
    ...theme.mixins.toolbar,
  },
  list: {
    marginLeft: theme.spacing.unit * (-2),
  },
  formControl: {
    marginLeft: theme.spacing.unit * 2,
    // FIXME: Looks good, but there must be a better way
    marginBottom: theme.spacing.unit * (-2),
  },
  inputLabel: {
    // FIXME: why oh why do we need this?
    // This gives: transform: matrix(0.75, 0, 0, 0.75, 0, -8);
    // Originally: transform: matrix(0.75, 0, 0, 0.75, 0, 1.5);
    transform: 'translate(0, -8px) scale(0.75)',
  },
});

const emptyStyle = '(empty)';

const nodeStyles = [
  emptyStyle,
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
  emptyStyle,
  "dashed",
  "dotted",
  "solid",
  "invis",
  "bold",
  "tapered",
];

class FormatDrawer extends React.Component {

  getStyleSet() {
    if (this.props.defaultAttributes.style == null) {
      return new Set([]);
    } else {
      let styleSet = new Set(this.props.defaultAttributes.style.split(', '))
      if (styleSet.delete('') !== false) {
        styleSet.add(emptyStyle);
      }
      return styleSet;
    }
  }

  setStyle(styleSet) {
    if (styleSet.size === 0) {
      this.props.onStyleChange(null);
    } else {
      if (styleSet.delete(emptyStyle) !== false) {
        styleSet.add('');
      }
      this.props.onStyleChange([...styleSet].join(', '));
    }
  }

  handleDrawerClose = () => {
    this.props.onFormatDrawerClose();
  };

  handleStyleChange = (styleName) => (event) => {
    const checked = event.target.checked;
    let styleSet = this.getStyleSet();
    if (checked) {
      if (styleName === emptyStyle) {
        styleSet.clear();
      } else {
        styleSet.delete(emptyStyle);
      }
      styleSet.add(styleName);
    }
    else {
      styleSet.delete(styleName);
    }
    this.setStyle(styleSet);
  };

  handleColorChange = (color) => {
    this.props.onColorChange(color);
  };

  handleFillColorChange = (color) => {
    this.props.onFillColorChange(color);
  };

  render() {
    const { classes, theme } = this.props;
    const { open } = this.props;
    const { type } = this.props;

    let styles = type === 'node' ? nodeStyles : edgeStyles;
    let currentStyle = this.getStyleSet();
    return (
      <div className={classes.root}>
        <Drawer
          variant="persistent"
          anchor='left'
          open={open}
          classes={{
            paper: open ? classes.drawerPaper : classes.drawerPaperClosed,
          }}
        >
          <div className={classes.drawerHeader}>
            Default {this.props.type} attributes
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List className={classes.list}>
            <ListItem className={classes.list}>
              <FormControl className={classes.formControl}>
                <InputLabel shrink htmlFor="style" className={classes.inputLabel}>
                  style
                </InputLabel>
                <FormGroup row>
                  {styles.map((style) =>
                    <FormControlLabel
                      control={
                        <Checkbox
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
            </ListItem>
            <ListItem>
              <ColorPicker
                name='color'
                label='color'
                defaultValue={this.props.defaultAttributes.color}
                onChange={color => this.handleColorChange(color)}
              />
            </ListItem>
            <ListItem>
              <ColorPicker
                name='fillcolor'
                label='fillcolor'
                defaultValue={this.props.defaultAttributes.fillcolor}
                onChange={color => this.handleFillColorChange(color)}
              />
            </ListItem>
          </List>
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
