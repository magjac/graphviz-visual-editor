import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function ButtonAppBar(props) {
  const { classes } = props;

  var handleMenuButtonClick = (event) => {
    props.onMenuButtonClick(event.currentTarget);
  };

  var handleBrowseClick = (event) => {
    props.onModeChange('browse');
  };

  var handleDrawClick = (event) => {
    props.onModeChange('draw');
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
      >
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={handleMenuButtonClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="title"
            color="inherit"
            className={classes.flex}
          >
            Graphviz Visual Editor
          </Typography>
          <Button
            color="inherit"
            onClick={handleBrowseClick}
          >
            Browse
          </Button>
          <Button
            color="inherit"
            onClick={handleDrawClick}
          >
            Draw
          </Button>
          <Button
            color="inherit"
          >
            Help
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
