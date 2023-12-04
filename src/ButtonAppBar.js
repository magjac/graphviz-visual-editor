import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
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
            id="menu"
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={handleMenuButtonClick}
            size="large">
            <MenuIcon />
          </IconButton>
          <IconButton
            id="new"
            className={classes.new}
            color="inherit"
            aria-label="New"
            onClick={handleNewButtonClick}
            size="large">
            <AddIcon />
          </IconButton>
          <IconButton
            id="open"
            className={classes.openInBrowserButton}
            color="inherit"
            aria-label="OpenInBrowser"
            onClick={handleOpenInBrowserButtonClick}
            size="large">
            <OpenInBrowserIcon />
          </IconButton>
          <IconButton
            id="save-as"
            className={classes.SaveAltButton}
            color="inherit"
            aria-label="SaveAlt"
            onClick={handleSaveAltButtonClick}
            size="large">
            <SaveAltIcon />
          </IconButton>
          <IconButton
            id="undo"
            className={classes.undoButton}
            color="inherit"
            disabled={!props.hasUndo}
            aria-label="Undo"
            onClick={handleUndoButtonClick}
            size="large">
            <UndoIcon />
          </IconButton>
          <IconButton
            id="redo"
            className={classes.redoButton}
            color="inherit"
            disabled={!props.hasRedo}
            aria-label="Redo"
            onClick={handleRedoButtonClick}
            size="large">
            <RedoIcon />
          </IconButton>
          <Typography
            variant="h6"
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
            size="large">
            <ZoomInIcon />
          </IconButton>
          <IconButton
            id="zoom-out"
            className={classes.zoomOutButton}
            color="inherit"
            aria-label="ZoomOut"
            onClick={handleZoomOutButtonClick}
            size="large">
            <ZoomOutIcon />
          </IconButton>
          <IconButton
            id="zoom-out-map"
            className={classes.zoomOutMapButton}
            color="inherit"
            aria-label="ZoomOutMap"
            onClick={handleZoomOutMapButtonClick}
            size="large">
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
            id="settings"
            color="inherit"
            aria-label="Settings"
            onClick={handleSettingsButtonClick}
            size="large">
            <SettingsIcon />
          </IconButton>
          <a
            id="github"
            className={classes.gitHubLink}
            href="https://github.com/magjac/graphviz-visual-editor"
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconButton color="inherit" aria-label="GitHub" size="large">
              <GitHubIcon
                viewBox='-2.4 -2.4 28.8 28.8'
              />
            </IconButton>
          </a>
          <IconButton
            id="help"
            color="inherit"
            aria-label="Help"
            onClick={handleHelpButtonClick}
            size="large">
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
