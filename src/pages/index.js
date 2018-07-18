import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import ButtonAppBar from '../ButtonAppBar';
import Graph from '../Graph';
import TextEditor from '../TextEditor';

const styles = theme => ({
  root: {
    textAlign: 'center',
  },
});

class Index extends React.Component {
  state = {
    dotSrc: `strict digraph {
  a -> b
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
        <ButtonAppBar>
        </ButtonAppBar>
        <Grid container spacing={24}>
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
              <Graph dotSrc={this.state.dotSrc} />
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
