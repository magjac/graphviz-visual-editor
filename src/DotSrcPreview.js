import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  pre: {
    margin: 0,
  }
};

class DotSrcPreview extends React.Component {

  render() {
    const { classes } = this.props;
    const dotSrcLines = this.props.dotSrc.trimEnd().split('\n');
    let dotSrcLinesPreview;
    let extra = null;
    if (dotSrcLines.length <= this.props.numLines) {
      dotSrcLinesPreview = dotSrcLines;
    } else {
      dotSrcLinesPreview = dotSrcLines.slice(0, this.props.numLines - 1);
      extra = '...';
    }
    return (
      <React.Fragment>
        <pre className={classes.pre}>
          {dotSrcLinesPreview.join('\n')}
        </pre>
        {extra}
      </React.Fragment>
    );
  }
}

DotSrcPreview.propTypes = {
  dotSrc: PropTypes.string.isRequired,
  numLines: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DotSrcPreview);
