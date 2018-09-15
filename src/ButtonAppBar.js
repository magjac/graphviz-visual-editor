import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';
import GitHubIcon from './GitHubIcon'

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
  gitHubLink: {
    color: 'inherit',
    '&:visited' : {
      color: 'inherit',
    },
  },
};

function ButtonAppBar(props) {
  const { classes } = props;

  var handleMenuButtonClick = (event) => {
    props.onMenuButtonClick(event.currentTarget);
  };

  var handleUndoButtonClick = (event) => {
    props.onUndoButtonClick(event.currentTarget);
  };

  var handleRedoButtonClick = (event) => {
    props.onRedoButtonClick(event.currentTarget);
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

  var handleInsertClick = (event) => {
    props.onInsertClick();
  };

  var handleNodeFormatClick = (event) => {
    props.onNodeFormatClick('draw');
  };

  var handleEdgeFormatClick = (event) => {
    props.onEdgeFormatClick('draw');
  };

  var handleSettingsButtonClick = (event) => {
    props.onSettingsButtonClick(event.currentTarget);
  };

  var handleHelpButtonClick = (event) => {
    props.onHelpButtonClick(event.currentTarget);
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
          <IconButton
            className={classes.undoButton}
            color="inherit"
            aria-label="Undo"
            onClick={handleUndoButtonClick}
          >
            <UndoIcon />
          </IconButton>
          <IconButton
            className={classes.redoButton}
            color="inherit"
            aria-label="Redo"
            onClick={handleRedoButtonClick}
          >
            <RedoIcon />
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
            onClick={handleInsertClick}
          >
            Insert
          </Button>
          <Button
            color="inherit"
            onClick={handleNodeFormatClick}
          >
            Node format
          </Button>
          <Button
            color="inherit"
            onClick={handleEdgeFormatClick}
          >
            Edge format
          </Button>
          <IconButton
            color="inherit"
            aria-label="Settings"
            onClick={handleSettingsButtonClick}
          >
            <SettingsIcon />
          </IconButton>
          <a
            className={classes.gitHubLink}
            href="https://github.com/magjac/graphviz-visual-editor"
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconButton
              color="inherit"
              aria-label="GitHub"
            >
              <GitHubIcon
                fontSize='inherit'
                viewBox='-2.4 -2.4 28.8 28.8'
              />
            </IconButton>
          </a>
          <IconButton
            color="inherit"
            aria-label="Help"
            onClick={handleHelpButtonClick}
          >
            <HelpIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
