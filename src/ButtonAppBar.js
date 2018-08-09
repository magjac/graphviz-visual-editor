import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';

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

  var handleZoomInButtonClick = (event) => {
    props.onZoomInButtonClick && props.onZoomInButtonClick();
  };

  var handleZoomOutButtonClick = (event) => {
    props.onZoomOutButtonClick && props.onZoomOutButtonClick();
  };

  var handleZoomOutMapButtonClick = (event) => {
    props.onZoomOutMapButtonClick && props.onZoomOutMapButtonClick();
  };

  var handleZoomResetButtonClick = (event) => {
    props.onZoomResetButtonClick && props.onZoomResetButtonClick();
  };

  var handleDrawClick = (event) => {
    props.onModeChange('draw');
  };

  var handleFormatClick = (event) => {
    props.onFormatClick('draw');
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
          <IconButton
            className={classes.zoomInButton}
            color="inherit"
            aria-label="ZoomIn"
            onClick={handleZoomInButtonClick}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            className={classes.zoomOutButton}
            color="inherit"
            aria-label="ZoomOut"
            onClick={handleZoomOutButtonClick}
          >
            <ZoomOutIcon />
          </IconButton>
          <IconButton
            className={classes.zoomOutMapButton}
            color="inherit"
            aria-label="ZoomOutMap"
            onClick={handleZoomOutMapButtonClick}
          >
            <ZoomOutMapIcon />
          </IconButton>
          <Button
            color="inherit"
            onClick={handleZoomResetButtonClick}
          >
            1:1
          </Button>
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
            onClick={handleFormatClick}
          >
            Format
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
