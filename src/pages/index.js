import React from 'react';
import PropTypes from 'prop-types';
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
        <TextEditor
          dotSrc={this.state.dotSrc}
          onTextChange={this.handleTextChange}
        />
        <Graph dotSrc={this.state.dotSrc} />
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
