import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import withStyles from '@mui/styles/withStyles';

const previewWidth = 400;
const previewHeight = 250;
const previewMarginUnits = 1;
const previewPadUnits = 0.5;

const styles = theme => ({
  card: {
    position: 'fixed',
    zIndex: 1,
    width: previewWidth + theme.spacing(previewPadUnits * 2).replace('px', ''),
    height: previewHeight + theme.spacing(previewPadUnits * 2).replace('px', ''),
  },
  cardContent: {
    padding: theme.spacing(previewPadUnits),

  },
});

class SvgPreview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      x: 0,
      y: 0,
    };
  }

  componentDidMount() {
    this.componentDidUpdate();
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
    if (this.divPreview) {
      const svgPreview = this.divPreview.querySelector('svg');
      svgPreview.setAttribute('width', previewWidth);
      svgPreview.setAttribute('height', previewHeight);
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
    const { theme } = this.props;
    const previewMargin = +theme.spacing(previewMarginUnits).replace('px', '');

    return (
      <React.Fragment>
        <div
          id="svg-wrapper"
          ref={div => this.divThumbnail = div}
          dangerouslySetInnerHTML={{__html: this.props.svg}}
        >
        </div>
        {this.state.preview &&
          <Card
            id="preview-pop-up"
            className={classes.card}
            raised
            style={{
              left: this.state.x + previewMargin,
              top: this.state.y + previewMargin,
            }}
          >
            <CardContent className={classes.cardContent}>
              <div
                ref={div => this.divPreview = div}
                dangerouslySetInnerHTML={{__html: this.props.svg}}
              >
              </div>
            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

SvgPreview.propTypes = {
  svg: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SvgPreview);
