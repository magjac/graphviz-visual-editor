import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import { AppBar } from '@mui/material';
import { Toolbar } from '@mui/material';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import { IconButton } from '@mui/material';
import { Icon } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Add as AddIcon } from '@mui/icons-material';
import { OpenInBrowser as OpenInBrowserIcon } from '@mui/icons-material';
import { SaveAlt as SaveAltIcon } from '@mui/icons-material';
import { Undo as UndoIcon } from '@mui/icons-material';
import { Redo as RedoIcon } from '@mui/icons-material';
import { ZoomIn as ZoomInIcon } from '@mui/icons-material';
import { ZoomOut as ZoomOutIcon }  from '@mui/icons-material';
import { ZoomOutMap as ZoomOutMapIcon } from '@mui/icons-material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { Help as HelpIcon } from '@mui/icons-material';
import GitHubIcon from './GitHubIcon.js'

const styles = {
  root: {
    flexGrow: 1,
  },
  toolbar: {
    backgroundSize: '16px 16px',
    backgroundImage: 'linear-gradient(to right, #4ed1f860 1px, transparent 1px), linear-gradient(to bottom, #4ed1f860 1px, transparent 1px)',
    backgroundColor: 'white',
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
  imageIcon: {
    display: 'block',
    height: '100%',
    verticalAlign: 'middle',
  },
  iconRoot: {
    height: '64px',
    width: '72px',
    verticalAlign: 'middle',
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
        <Toolbar id="toolbar" className={classes.toolbar}>
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
          <Icon classes={{root: classes.iconRoot}}>
            <img className={classes.imageIcon} src="GraphvizLogo.png"  width="64" height="64"/>
          </Icon>
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
            size="large"
            color="inherit"
            onClick={handleInsertClick}
          >
            Insert
          </Button>
          <Button
            color="inherit"
            size="large"
            onClick={handleNodeFormatClick}
          >
            Node format
          </Button>
          <Button
            color="inherit"
            size="large"
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

export default withStyles(ButtonAppBar, styles);
