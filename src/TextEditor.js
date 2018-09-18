import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AceEditor from 'react-ace';
import 'brace/mode/dot';
import 'brace/theme/github';
import IconButton from '@material-ui/core/IconButton';
import ErrorOutline from '@material-ui/icons/ErrorOutline';

const styles = {
  errorButton: {
    position: 'absolute',
    top: 'calc(64px + 12px)',
  },
};

class TextEditor extends React.Component {

  constructor(props) {
    super(props);
    this.pendingChanges = 0;
  }

  handleChange = (value, event) => {
    this.props.onTextChange(value);
  };

  handleBeforeLoad = (ace) => {
    this.ace = ace;
  };

  handleLoad = (editor) => {
    this.editor = editor;
    this.props.registerUndo(this.undo);
    this.props.registerRedo(this.redo);
  };

  handleErrorButtonClick = (event) => {
    this.editor.scrollToLine(this.props.error.line - 1, true);
  };

  undo = () => {
    this.editor.getSession().getUndoManager().undo();
  }

  redo = () => {
    this.editor.getSession().getUndoManager().redo();
  }

  render() {
    const { classes } = this.props;
    var annotations = null;
    if (this.props.error) {
      annotations = [{
        row: this.props.error.line - 1,
        column: 0,
        text: this.props.error.message,
        type: "error",
        dummy: Date.now(), // Workaround for issue #33
      }];
      if (this.editor && !this.editor.isRowFullyVisible(this.props.error.line)) {
        if (!this.prevError ||
            this.props.error.message !== this.prevError.message ||
            (this.props.error.line !== this.prevError.line &&
             this.props.error.numLines - this.props.error.line !== this.prevNumLines - this.prevError.line)
           ) {
          this.editor.scrollToLine(this.props.error.line - 1, true);
        }
      }
      this.prevNumLines = this.props.error.numLines;
    }
    this.prevError = this.props.error;
    const locations = this.props.selectedGraphComponents.reduce(
      (locations, component) => locations.concat(
        component.locations
      ),
      []
    );
    const markers = locations.map((location) => ({
      startRow: location.start.line - 1,
      startCol: location.start.column - 1,
      endRow: location.end.line - 1,
      endCol: location.end.column - 1,
      className: 'ace_selected-word',
      type: 'background',
    }));
    // FIXME: There must be a better way...
    let scrollbarWidth = 0;
    if (this.div) {
      const scrollbarDiv = this.div.querySelector('div.ace_scrollbar-v');
      const hasScrollbar = scrollbarDiv && scrollbarDiv.style['display'] !== 'none';
      if (hasScrollbar) {
        const scrollbarInnerDiv = scrollbarDiv.querySelector('div.ace_scrollbar-inner');
        scrollbarWidth = scrollbarInnerDiv.clientWidth - 5;
      }
    }
    return (
      <div ref={div => this.div = div}>
        <AceEditor
          mode="dot"
          theme="github"
          fontSize={this.props.fontSize + 'px'}
          tabSize={this.props.tabSize}
          onChange={this.handleChange}
          onBeforeLoad={this.handleBeforeLoad}
          onLoad={this.handleLoad}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          name="UNIQUE_ID_OF_DIV"
          value={this.props.dotSrc}
          // viewport height - app bar - 2 * padding
          height="calc(100vh - 64px - 2 * 12px)"
          width={this.props.width}
          wrapEnabled
          showPrintMargin={false}
          debounceChangePeriod={this.props.holdOff * 1000}
          editorProps={{
            $blockScrolling: true
          }}
          annotations={annotations}
          markers={markers}
        />
        <IconButton
          className={classes.errorButton}
          style={{
            left: `calc(${this.props.width} - 2 * 12px - 12px - ${scrollbarWidth}px`,
            display: this.props.error ? 'block' : 'none',
          }}
          color="inherit"
          aria-label="Error"
          onClick={this.handleErrorButtonClick}
        >
          <ErrorOutline color="error" />
        </IconButton>
      </div>
    );
  }
}

export default withStyles(styles)(TextEditor);
