import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from '@mui/material';
import { MenuItem } from '@mui/material';

class MainMenu extends React.Component {

  handleClose = () => {
    this.props.onMenuClose();
  };

  handleSettings = () => {
    this.props.onMenuClose();
    this.props.onSettingsClick();
  };

  handleNew = () => {
    this.props.onMenuClose();
    this.props.onNewClick();
  };

  handleOpenFromBrowser = () => {
    this.props.onMenuClose();
    this.props.onOpenFromBrowserClick();
  };

  handleSaveAsToBrowser = () => {
    this.props.onMenuClose();
    this.props.onSaveAsToBrowserClick();
  };

  handleRename = () => {
    this.props.onMenuClose();
    this.props.onRenameClick();
  };

  handleExportAsUrl = () => {
    this.props.onMenuClose();
    this.props.onExportAsUrlClick();
  };

  handleExportAsSvg = () => {
    this.props.onMenuClose();
    this.props.onExportAsSvgClick();
  };

  render() {

    return (
      <div>
        <Menu
          id="main-menu"
          anchorEl={this.props.anchorEl}
          open
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleNew} id="new">New</MenuItem>
          <MenuItem onClick={this.handleOpenFromBrowser} id="open">Open from browser</MenuItem>
          <MenuItem onClick={this.handleSaveAsToBrowser} id="save-as">Save as to browser</MenuItem>
          <MenuItem onClick={this.handleRename} id="rename">Rename</MenuItem>
          <MenuItem onClick={this.handleExportAsUrl} id="export-as-url">Export as URL</MenuItem>
          <MenuItem onClick={this.handleExportAsSvg} id="export-as-svg">Export as SVG</MenuItem>
          <MenuItem onClick={this.handleSettings} id="settings">Settings</MenuItem>
        </Menu>
      </div>
    );
  }
}

MainMenu.propTypes = {
  onMenuClose: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func.isRequired,
  onNewClick: PropTypes.func.isRequired,
  onOpenFromBrowserClick: PropTypes.func.isRequired,
  onSaveAsToBrowserClick: PropTypes.func.isRequired,
  onRenameClick: PropTypes.func.isRequired,
  onExportAsUrlClick: PropTypes.func.isRequired,
  onExportAsSvgClick: PropTypes.func.isRequired,
  anchorEl: PropTypes.object.isRequired,
};

export default MainMenu;
