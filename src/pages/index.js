import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import ButtonAppBar from '../ButtonAppBar';
import Graph from '../Graph';
import TextEditor from '../TextEditor';
import { schemeCategory10 as d3_schemeCategory10} from 'd3-scale-chromatic';
import { schemePaired as d3_schemePaired} from 'd3-scale-chromatic';

const styles = theme => ({
  root: {
    textAlign: 'center',
  },
  paper: {
    // viewport height - app bar - 2 * padding
    height: "calc(100vh - 64px - 2 * 12px)",
  }
});

class Index extends React.Component {
  state = {
    dotSrc: `strict digraph {
    a [shape="ellipse" style="filled" fillcolor="` + d3_schemeCategory10[0] + `"]
    b [shape="polygon" style="filled" fillcolor="` + d3_schemeCategory10[1] + `"]
    a -> b [fillcolor="` + d3_schemePaired[0] + `" color="` + d3_schemePaired[1] + `"]
}`,
  };

  handleTextChange = (text) => {
    this.setState({
      dotSrc: text
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {/* FIXME: Find a way to get viz.js from the graphviz-visual-editor bundle */}
        <script src="https://unpkg.com/viz.js@1.8.2/viz.js" type="javascript/worker"></script>
        <ButtonAppBar>
        </ButtonAppBar>
        <Grid container
          spacing={24}
          style={{
            margin: 0,
            width: '100%',
          }}
        >
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <TextEditor
                dotSrc={this.state.dotSrc}
                onTextChange={this.handleTextChange}
              />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Graph
                dotSrc={this.state.dotSrc}
                onTextChange={this.handleTextChange}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
