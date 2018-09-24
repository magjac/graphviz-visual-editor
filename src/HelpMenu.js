import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class HelpMenu extends React.Component {

  handleClose = () => {
    this.props.onMenuClose();
  };

  handleKeyboardShortcutsClick = () => {
    this.props.onMenuClose();
    this.props.onKeyboardShortcutsClick();
  };

  handleMouseOperationsClick = () => {
    this.props.onMenuClose();
    this.props.onMouseOperationsClick();
  };

  handleAboutClick = () => {
    this.props.onMenuClose();
    this.props.onAboutClick();
  };

  render() {

    return (
      <div>
        <Menu
          id="help-menu"
          anchorEl={this.props.anchorEl}
          open
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleKeyboardShortcutsClick}>Keyboard shortcuts</MenuItem>
          <MenuItem onClick={this.handleMouseOperationsClick}>Mouse operations</MenuItem>
          <MenuItem onClick={this.handleAboutClick}>About</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default HelpMenu;
