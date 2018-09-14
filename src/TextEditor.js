import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/dot';
import 'brace/theme/github';

class TextEditor extends React.Component {

  constructor(props) {
    super(props);
    this.pendingChanges = 0;
  }

  handleChange = (value, event) => {
    this.props.onTextChange(value);
  };

  render() {
    var annotations = null;
    if (this.props.error) {
      annotations = [{
        row: this.props.error.line - 1,
        column: 0,
        text: this.props.error.message,
        type: "error",
        dummy: Date.now(), // Workaround for issue #33
      }];
    }
    const locations = this.props.selectedGraphComponents.map((component) => component.astNode.location);
    const markers = locations.map((location) => ({
      startRow: location.start.line - 1,
      startCol: location.start.column - 1,
      endRow: location.end.line - 1,
      endCol: location.end.column - 1,
      className: 'ace_selected-word',
      type: 'background',
    }));

    return (
      <div>
        <AceEditor
          mode="dot"
          theme="github"
          onChange={this.handleChange}
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
      </div>
    );
  }
}

export default TextEditor;
