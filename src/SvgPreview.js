import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  preview: {
    position: 'fixed',
    background: 'white',
    border: '1px solid',
    zIndex: 1,
  }
};

class SvgPreview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      x: 0,
      y: 0,
    };
  }

  componentDidUpdate() {
    const svgThumbnail = this.divThumbnail.querySelector('svg');
    if (svgThumbnail) {
      svgThumbnail.setAttribute('width', this.props.width);
      svgThumbnail.setAttribute('height', this.props.height);
      const g = svgThumbnail.querySelector('g');
      g.addEventListener('mouseenter', this.handleMouseEnter);
      g.addEventListener('mouseleave', this.handleMouseOut);
    }
    const svgPreview = this.divPreview.querySelector('svg');
    if (svgPreview) {
      svgPreview.setAttribute('width', '400px');
      svgPreview.setAttribute('height', '250px');
    }
  }

  handleMouseEnter = (event) => {
    this.setState({
      preview: true,
      x: event.clientX,
      y: event.clientY,
    });
  }

  handleMouseOut = (event) => {
    this.setState({
      preview: false,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div
          ref={div => this.divThumbnail = div}
          dangerouslySetInnerHTML={{__html: this.props.svg}}
        >
        </div>
        <div
          ref={div => this.divPreview = div}
          className={classes.preview}
          style={{
            display: this.state.preview ? 'block' : 'none',
            left: this.state.x + 10,
            top: this.state.y + 10,
          }}
          dangerouslySetInnerHTML={{__html: this.props.svg}}
        >
        </div>
      </React.Fragment>
    );
  }
}

SvgPreview.propTypes = {
  svg: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SvgPreview);
