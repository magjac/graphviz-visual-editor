import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@mui/material';
import { CardContent } from '@mui/material';
import { withStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material';

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

const SvgPreview = ({ classes, svg, width, height }) => {

  const [preview, setPreview] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  let divPreview;
  let divThumbnail;

  useEffect(() => {
    const svgThumbnail = divThumbnail.querySelector('svg');
    if (svgThumbnail) {
      svgThumbnail.setAttribute('width', width);
      svgThumbnail.setAttribute('height', height);
      const g = svgThumbnail.querySelector('g');
      g.addEventListener('mouseenter', handleMouseEnter);
      g.addEventListener('mouseleave', handleMouseOut);
    }
    if (divPreview) {
      const svgPreview = divPreview.querySelector('svg');
      svgPreview.setAttribute('width', previewWidth);
      svgPreview.setAttribute('height', previewHeight);
    }
  });

  const handleMouseEnter = (event) => {
    setPreview(true);
    setX(event.clientX);
    setY(event.clientY);
  };

  const handleMouseOut = (event) => {
    setPreview(false);
  };

  const theme = useTheme();
  const previewMargin = +theme.spacing(previewMarginUnits).replace('px', '');

  return (
    <React.Fragment>
      <div
        id="svg-wrapper"
        ref={div => divThumbnail = div}
        dangerouslySetInnerHTML={{__html: svg}}
      >
      </div>
      {preview &&
        <Card
          id="preview-pop-up"
          className={classes.card}
          raised
          style={{
            left: x + previewMargin,
            top: y + previewMargin,
          }}
        >
          <CardContent className={classes.cardContent}>
            <div
              ref={div => divPreview = div}
              dangerouslySetInnerHTML={{__html: svg}}
            >
            </div>
          </CardContent>
        </Card>
      }
    </React.Fragment>
  );
}

SvgPreview.propTypes = {
  svg: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(SvgPreview, styles);
