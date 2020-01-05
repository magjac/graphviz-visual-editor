import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
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

  var handleNewButtonClick = (event) => {
    props.onNewButtonClick(event.currentTarget);
  };

  var handleOpenInBrowserButtonClick = (event) => {
    props.onOpenInBrowserButtonClick(event.currentTarget);
  };

  var handleSaveAltButtonClick = (event) => {
    props.onSaveAltButtonClick(event.currentTarget);
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
        <Toolbar id="toolbar">
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={handleMenuButtonClick}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            className={classes.new}
            color="inherit"
            aria-label="New"
            onClick={handleNewButtonClick}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            className={classes.openInBrowserButton}
            color="inherit"
            aria-label="OpenInBrowser"
            onClick={handleOpenInBrowserButtonClick}
          >
            <OpenInBrowserIcon />
          </IconButton>
          <IconButton
            className={classes.SaveAltButton}
            color="inherit"
            aria-label="SaveAlt"
            onClick={handleSaveAltButtonClick}
          >
            <SaveAltIcon />
          </IconButton>
          <IconButton
            className={classes.undoButton}
            color="inherit"
            disabled={!props.hasUndo}
            aria-label="Undo"
            onClick={handleUndoButtonClick}
          >
            <UndoIcon />
          </IconButton>
          <IconButton
            className={classes.redoButton}
            color="inherit"
            disabled={!props.hasRedo}
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
            id="zoom-in"
            className={classes.zoomInButton}
            color="inherit"
            aria-label="ZoomIn"
            onClick={handleZoomInButtonClick}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            id="zoom-out"
            className={classes.zoomOutButton}
            color="inherit"
            aria-label="ZoomOut"
            onClick={handleZoomOutButtonClick}
          >
            <ZoomOutIcon />
          </IconButton>
          <IconButton
            id="zoom-out-map"
            className={classes.zoomOutMapButton}
            color="inherit"
            aria-label="ZoomOutMap"
            onClick={handleZoomOutMapButtonClick}
          >
            <ZoomOutMapIcon />
          </IconButton>
          <Button
            id="zoom-reset"
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
  hasUndo: PropTypes.bool.isRequired,
  hasRedo: PropTypes.bool.isRequired,
  onMenuButtonClick: PropTypes.func.isRequired,
  onNewButtonClick: PropTypes.func.isRequired,
  onOpenInBrowserButtonClick: PropTypes.func.isRequired,
  onSaveAltButtonClick: PropTypes.func.isRequired,
  onUndoButtonClick: PropTypes.func.isRequired,
  onRedoButtonClick: PropTypes.func.isRequired,
  onZoomInButtonClick: PropTypes.func.isRequired,
  onZoomOutButtonClick: PropTypes.func.isRequired,
  onZoomOutMapButtonClick: PropTypes.func.isRequired,
  onZoomResetButtonClick: PropTypes.func.isRequired,
  onInsertClick: PropTypes.func.isRequired,
  onNodeFormatClick: PropTypes.func.isRequired,
  onEdgeFormatClick: PropTypes.func.isRequired,
  onSettingsButtonClick: PropTypes.func.isRequired,
  onHelpButtonClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
