import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/dot';
import 'brace/theme/github';

class TextEditor extends React.Component {

  handleChange = (value, event) => {
    this.props.onTextChange(value);
  };

  render() {
    var annotations = null;
    if (this.props.errorMessage) {
      let row = this.props.errorMessage.replace(/.*error in line ([0-9]*) .*\n/, '$1') - 1;
      annotations = [{
        row: row,
        column: 0,
        text: this.props.error.message,
        type: "error",
      }];
    }
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
          editorProps={{
            $blockScrolling: true
          }}
          annotations={annotations}
        />
      </div>
    );
  }
}

export default TextEditor;
