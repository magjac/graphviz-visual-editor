import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';

import { ChromePicker } from 'react-color'

const styles = theme => ({
  color: {
    width: '36px',
    height: '14px',
    borderRadius: '2px',
  },
  swatch: {
    padding: '5px',
    verticalAlign: 'middle',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    width: '100%',
    zIndex: '2',
  },
  input: {
    marginLeft: theme.spacing.unit * 2,
    verticalAlign: 'middle',
    width: 100,
  },
});

class ColorPicker extends React.Component {

  handleClick = (event) => {
    event.stopPropagation();
    this.props.setOpen(!this.props.open);
  };

  handleInputChange = (event) => {
    this.props.onChange(event.target.value);
  };

  handleChange = (color) => {
    // Workaround for https://github.com/casesandberg/react-color/issues/655
    const a = Math.round(color.rgb.a * 255);
    this.props.onChange(color.hex + (a === 255 ? '' : Math.floor(a / 16).toString(16) + (a % 16).toString(16)));
  };

  render() {
    const { classes } = this.props;
    if (this.props.invert) {
      var borderBackground = this.props.color;
      var contentBackground = '#fff';
    } else {
      borderBackground = '#fff';
      contentBackground = this.props.color;
    }
    return (
      <div>
        <div id="color-picker-swatch" className={classes.swatch} style={{background: borderBackground}} onClick={this.handleClick}>
          <div className={classes.color} style={{background: contentBackground}} />
        </div>
        <FormControl>
          <Input style={{color: this.props.color}}
            className={classes.input}
            id="color"
            value={this.props.color}
            onChange={this.handleInputChange}
          />
        </FormControl>
        {this.props.open ?
          <div id="color-picker-popover" className={classes.popover}>
            <ChromePicker color={this.props.color} onChange={this.handleChange} />
          </div>
          :
          null
        }
      </div>

    );
  }
}

ColorPicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(ColorPicker));
