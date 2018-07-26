import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class MainMenu extends React.Component {

  handleClose = () => {
    this.props.onMenuClose();
  };

  handleSettings = () => {
    this.props.onMenuClose();
    this.props.onSettingsClick();
  };

  render() {

    return (
      <div>
        <Menu
          id="main-menu"
          anchorEl={this.props.anchorEl}
          open={this.props.open}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleSettings}>Settings</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default MainMenu;
