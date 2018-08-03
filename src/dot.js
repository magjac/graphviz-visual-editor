import parser from 'dotparser';

export default class DotGraph {
  constructor(dotSrc) {
    this.dotSrc = dotSrc;
    this.dotSrcLines = dotSrc.split('\n');
    this.parseDot(this.dotSrc);
  }

  insertNode(nodeName, attributes) {
    var attributesString = toAttributesString(attributes);
    var newNodeString = '    ' + nodeName + ' [' + attributesString + ']';
    this.dotSrcLines.splice(-1, 0, newNodeString);
    this.dotSrc = this.dotSrcLines.join('\n');
  }

  insertEdge(startNodeName, endNodeName, attributes) {
    var attributesString = toAttributesString(attributes);
    var newEdgeString = '    ' + startNodeName + ' -> ' + endNodeName + ' [' + attributesString + ']';
    this.dotSrcLines.splice(-1, 0, newEdgeString);
    this.dotSrc = this.dotSrcLines.join('\n');
  }

  deleteNode(nodeName) {
    while (true) {
      var i = this.dotSrcLines.findIndex(function (element, index) {
        var trimmedElement = element.trim();
        if (trimmedElement === nodeName) {
          return true;
        }
        if (trimmedElement.indexOf(nodeName + ' ') === 0) {
          return true;
        }
        if (trimmedElement.indexOf(' ' + nodeName + ' ') >= 0) {
          return true;
        }
        if (trimmedElement.indexOf(' ' + nodeName, trimmedElement.length - nodeName.length - 1) >= 0) {
          return true;
        }
        return false;
      });
      if (i < 0)
        break;
      this.dotSrcLines.splice(i, 1);
    }
    this.dotSrc = this.dotSrcLines.join('\n');
  }

  deleteEdge(edgeName) {
    while (true) {
      var i = this.dotSrcLines.findIndex(function (element, index) {
        return element.indexOf(edgeName) >= 0;
      });
      if (i < 0)
        break;
      this.dotSrcLines.splice(i, 1);
    }
    this.dotSrc = this.dotSrcLines.join('\n');
  }

  parseDot() {
    this.ast = parser(this.dotSrc)[0];
    let children = this.ast.children;
    this.nodes = children.filter(child => child.type === 'node_stmt')
    this.edges = children.filter(child => child.type === 'edge_stmt')
    this.attrs = children.filter(child => child.type === 'attr_stmt')
    this.subgraphs = children.filter(child => child.type === 'subgraph')
    // FIXME: Implement recursive parsing of subgraphs
  }
}

function toAttributesString(attributes) {
  var attributesString = ''
  for (var name of Object.keys(attributes)) {
    if (attributes[name] != null) {
      let re = '^[a-zA-Z\\x80-\\xff_][a-zA-Z\\x80-\\xff_0-9]*$';
      let value = attributes[name];
      if (!value.match(re)) {
        value = '"' + value + '"';
      }
      attributesString += ' ' + name + '=' + value;
    }
  }
  return attributesString;
}
