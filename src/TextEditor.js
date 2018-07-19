import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class TextEditor extends React.Component {

  handleChange = () => event => {
    this.props.onTextChange(event.target.value);
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="dotSrc"
          multiline
          fullWidth
          value={this.props.dotSrc}
          onChange={this.handleChange()}
          className={classes.textField}
          margin="normal"
        />
      </form>
    );
  }
}

TextEditor.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextEditor);
