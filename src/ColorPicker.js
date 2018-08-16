import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';

import { ChromePicker } from 'react-color'

const styles = theme => ({
  color: {
    width: '36px',
    height: '14px',
    borderRadius: '2px',
  },
  swatch: {
    padding: '5px',
    background: '#fff',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    zIndex: '2',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
});

class ColorPicker extends React.Component {

  state = {
    open: false
  }

  handleClick = () => {
    this.setState({ open: !this.state.open })
  };

  handleClose = () => {
    this.setState({ open: false })
  };

  handleChange = (color) => {
    this.props.onChange(color.hex);
  };

  render() {
    const { classes } = this.props;
    const background = this.props.color;
    return (
        <div>
        <div className={classes.swatch} onClick={ this.handleClick }>
        <div className={classes.color} style={{
          background: background
        }} />
        </div>
        { this.state.open ?
          <div className={ classes.popover }>
            <div className={classes.cover} onClick={ this.handleClose }/>
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
