import parser from 'dotparser';

export default class DotGraph {
  constructor(dotSrc) {
    this.dotSrc = dotSrc;
    this.dotSrcLines = dotSrc.split('\n');
    this.parseDot(this.dotSrc);
  }

  insertNode(nodeName, attributes) {
    var attributesString = toAttributesString(attributes);
    var newNodeString = '    ' + nodeName + attributesString;
    let line = this.dotSrcLines.lastIndexOf('}');
    this.dotSrcLines.splice(line, 0, newNodeString);
    this.dotSrc = this.dotSrcLines.join('\n');
  }

  insertEdge(startNodeName, endNodeName, attributes) {
    var attributesString = toAttributesString(attributes);
    var newEdgeString = '    ' + startNodeName + ' -> ' + endNodeName + attributesString;
    let line = this.dotSrcLines.lastIndexOf('}');
    this.dotSrcLines.splice(line, 0, newEdgeString);
    this.dotSrc = this.dotSrcLines.join('\n');
  }

  deleteNode(nodeName) {
    while (true) {
      var i = this.dotSrcLines.findIndex(function (line, index) {
        var trimmedLine = line.trim();
        if (trimmedLine === nodeName) {
          return true;
        }
        if (trimmedLine.indexOf(nodeName + ' ') === 0) {
          return true;
        }
        if (trimmedLine.indexOf(' ' + nodeName + ' ') >= 0) {
          return true;
        }
        if (trimmedLine.indexOf(' ' + nodeName, trimmedLine.length - nodeName.length - 1) >= 0) {
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
      var i = this.dotSrcLines.findIndex(function (line, index) {
        return line.indexOf(edgeName) >= 0;
      });
      if (i < 0)
        break;
      this.dotSrcLines.splice(i, 1);
    }
    this.dotSrc = this.dotSrcLines.join('\n');
  }

  getNodeAttributes(nodeName) {
    return this.nodes[nodeName];
  }

  parseDot() {
    this.ast = parser(this.dotSrc)[0];
    let children = this.ast.children;
    this.nodes = [];
    this.parseChildren(children);
  }

  parseChildren(children) {
    children.forEach((child) => {
      if (child.type === 'node_stmt') {
        this.parseChildren([child.node_id]);
        let attributes = child.attr_list.reduce(function(attrs, attr, i) {
          attrs[attr.id] = attr.eq;
          return attrs;
        }, {});
        Object.assign(this.nodes[child.node_id.id], attributes);
      }
      else if (child.type === 'node_id') {
        let nodeId = child.id;
        if (this.nodes[nodeId] == null) {
          this.nodes[nodeId] = {};
        }
      }
      else if (child.type === 'edge_stmt') {
        this.parseChildren(child.edge_list);
      }
      else if (child.type === 'subgraph') {
        // FIXME: remove workaround when https://github.com/anvaka/dotparser/issues/5 is fixed
        if (child.children) {
          this.parseChildren(child.children);
        }
      }
    });
  }

  toString() {
    this.str = ''
    this.edgeop = this.ast.type === 'digraph' ? '->' : '--';
    this.str += this.ast.type + ' {';
    this.toStringChildren(this.ast.children);
    this.str += '}';
    return this.str;
  }

  toStringChildren(children, separator=' ') {
    children.forEach((child, i) => {
      // FIXME: remove workaround when https://github.com/anvaka/dotparser/issues/5 is fixed
      if (child.type === 'subgraph') {
        if (child.children == null) {
          if (i > 0 && children[i - 1].type === 'subgraph' && children[i - 1].id !== null && children[i - 1].children.length === 0) {
            return;
          }
        }
      }
      if (i > 0) {
        this.str += separator;
      }
      if (child.type === 'node_stmt') {
        this.toStringChildren([child.node_id]);
        if (child.attr_list.length > 0) {
          this.str += ' [';
          this.toStringChildren(child.attr_list);
          this.str += ']';
        }
      }
      else if (child.type === 'node_id') {
        this.str += child.id;
      }
      else if (child.type === 'attr') {
        this.str += child.id + '=' + child.eq;
      }
      else if (child.type === 'edge_stmt') {
        this.toStringChildren(child.edge_list, ' ' + this.edgeop + ' ');
        if (child.attr_list.length > 0) {
          this.str += ' [';
          this.toStringChildren(child.attr_list);
          this.str += ']';
        }
      }
      else if (child.type === 'subgraph') {
        if (child.id) {
          this.str += 'subgraph ' + child.id;
        }
        this.str += '{';
        // FIXME: remove workaround when https://github.com/anvaka/dotparser/issues/5 is fixed
        if (child.children) {
          this.toStringChildren(child.children);
        }
        this.str += '}';
      }
    });
  }

}

function quoteIdIfNecessary(value) {
  let re = '^[a-zA-Z\\x80-\\xff_][a-zA-Z\\x80-\\xff_0-9]*$';
  if (!value.match(re)) {
    value = '"' + value + '"';
  }
  return value;
}

function toAttributesString(attributes) {
  var attributesString = ''
  for (var name of Object.keys(attributes)) {
    if (attributes[name] != null) {
      let value = attributes[name].toString();
      value = quoteIdIfNecessary(value);
      attributesString += ' ' + name + '=' + value;
    }
  }
  if (attributesString) {
    attributesString = ' [' + attributesString + ']';
  }
  return attributesString;
}
