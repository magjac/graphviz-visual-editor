import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { withStyles } from 'tss-react/mui';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

const styles = {
  pre: {
    margin: 0,
  }
};

class DotSrcPreview extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <Box sx={{ width: 200, height: '6em' }}>
        <PerfectScrollbar>
          <pre className={classes.pre}>
            {this.props.dotSrc}
          </pre>
        </PerfectScrollbar>
      </Box>
    );
  }
}

DotSrcPreview.propTypes = {
  dotSrc: PropTypes.string.isRequired,
  numLines: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(DotSrcPreview, styles);
