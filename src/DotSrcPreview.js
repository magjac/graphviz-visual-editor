import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

const styles = {
  scrollbars: {
    width: 200,
    height: '6em !important',
  },
  pre: {
    margin: 0,
  }
};

class DotSrcPreview extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <PerfectScrollbar className={classes.scrollbars}>
        <pre className={classes.pre}>
          {this.props.dotSrc}
        </pre>
      </PerfectScrollbar>
    );
  }
}

DotSrcPreview.propTypes = {
  dotSrc: PropTypes.string.isRequired,
  numLines: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(DotSrcPreview, styles);
