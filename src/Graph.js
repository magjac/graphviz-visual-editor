import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { select as d3_select} from 'd3-selection';
import { transition as d3_transition} from 'd3-transition';
import 'd3-graphviz';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
};

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.createGraph = this.createGraph.bind(this)
  }

  componentDidMount() {
    this.createGraph()
  }

  componentDidUpdate() {
    this.createGraph()
  }

  handleError(errorMessage) {
    // FIXME
  }

  createGraph() {
    this.graphviz = d3_select(this.node).graphviz()
      .transition(() => d3_transition().duration(1000))
      .onerror(this.handleError)
      .on('initEnd', () => this.renderGraph.call(this));
  }

  renderGraph() {
    this.graphviz.renderDot(this.props.dotSrc);
  }

  render() {
    return <div ref={node => this.node = node}>
           </div>;
  }
}

Graph.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Graph);
