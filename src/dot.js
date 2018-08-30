import parser from './dotParser';
var parse = parser.parse;

const whitespace = ' \t\n\r';
const whitespaceWithinLine = ' \t\r';

export default class DotGraph {
  constructor(dotSrc) {
    this.dotSrc = dotSrc;
    this.reparse();
  }

  reparse() {
    this.parseDot(this.dotSrc);
  }

  insertNode(nodeName, attributes) {
    var attributesString = toAttributesString(attributes);
    var newNodeString = '    ' + nodeName + attributesString;
    this.insertAtEndOfGraph(newNodeString + '\n');
  }

  insertEdge(startNodeName, endNodeName, attributes) {
    var attributesString = toAttributesString(attributes);
    var newEdgeString = '    ' + startNodeName + ' -> ' + endNodeName + attributesString;
    this.insertAtEndOfGraph(newEdgeString + '\n');
  }

  deleteNode(nodeName) {
    this.deleteComponent('node', nodeName);
  }

  deleteEdge(edgeName) {
    let nodeNames = edgeName.split('--');
    if (nodeNames.length !== 2) {
      nodeNames = edgeName.split('->');
    }
    this.deleteComponent('edge', ...nodeNames);
  }

  getNodeAttributes(nodeName) {
    return this.nodes[nodeName];
  }

  parseDot() {
    this.ast = parse(this.dotSrc)[0];
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
    if (this.ast.strict) {
      this.str += 'strict ';
    }
    this.str += this.ast.type + ' ';
    if (this.ast.id) {
      this.str += quoteIdIfNecessary(this.ast.id) + ' ';
    }
    this.str += '{';
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
      if (child.type === 'attr_stmt') {
        this.str += quoteIdIfNecessary(child.target);
        if (child.attr_list.length > 0) {
          this.str += ' [';
          this.toStringChildren(child.attr_list);
          this.str += ']';
        }
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
        this.str += quoteIdIfNecessary(child.id);
      }
      else if (child.type === 'attr') {
        this.str += quoteIdIfNecessary(child.id) + '=' + quoteIdIfNecessary(child.eq);
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
          this.str += 'subgraph ' + quoteIdIfNecessary(child.id);
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

  insertAtEndOfGraph(string) {
    this.deleteComponent(null);
    this.index -= 1;
    this.insert(string);
  }

  deleteComponent(type, id, edgeRHSId) {
    this.edgeop = this.ast.type === 'digraph' ? '->' : '--';
    this.index = 0;
    if (this.ast.strict) {
      this.skip('strict');
    }
    this.skip(this.ast.type);
    this.skip('{');
    this.deleteComponentInChildren(this.ast.children, type, id, this.ast, edgeRHSId);
    this.skip('}');
    this.reparse();
  }

  deleteComponentInChildren(children, type, id, parent, edgeRHSId) {
    var erasedAll = true;
    children.forEach((child, i) => {
      // FIXME: remove workaround when https://github.com/anvaka/dotparser/issues/5 is fixed
      if (child.type === 'subgraph') {
        if (child.children == null) {
          if (i > 0 && children[i - 1].type === 'subgraph' && children[i - 1].id !== null && children[i - 1].children.length === 0) {
            return;
          }
        }
      }
      if (child.type === 'attr_stmt') {
        let optional = (child.target === 'graph');
        this.skip(child.target, false, {optional: optional});
        if (child.attr_list.length > 0) {
          this.skip('[', false, {optional: optional});
          this.deleteComponentInChildren(child.attr_list, type, id, child, edgeRHSId);
          this.skip(']', false, {optional: optional});
        }
      }
      else if (child.type === 'node_stmt') {
        this.deleteComponentInChildren([child.node_id], type, id, child, edgeRHSId);
        if (child.attr_list.length > 0) {
          let erase = (type === 'node' && child.node_id.id === id);
          this.skip('[', erase);
          this.deleteComponentInChildren(child.attr_list, type, id, child, edgeRHSId);
          this.skip(']', erase);
        }
      }
      else if (child.type === 'node_id') {
        let erase = (type === 'node' && child.id === id);
        const isFirstNode = (i === 0);
        if (parent.type === 'edge_stmt' && !isFirstNode) {
          const eraseLeftEdge = (erase || erasedAll) ||
                (children[i - 1].id === id && child.id === edgeRHSId);
          this.skip(this.edgeop, eraseLeftEdge);
          if (type === 'edge' && eraseLeftEdge && !whitespace.includes(this.dotSrc[this.index])) {
            this.insert(' ');
          }
        }
        if (!erase) {
          erasedAll = false;
        }
        this.skip(child.id, erase);
      }
      else if (child.type === 'attr') {
        let erase = ((type === 'node' && parent.type === 'node_stmt' && parent.node_id.id === id) ||
                     (type === 'edge' && parent.type === 'edge_stmt'));
        this.skip(child.id, erase);
        this.skip('=', erase);
        this.skip(child.eq, erase);
      }
      else if (child.type === 'edge_stmt') {
        this.deleteComponentInChildren(child.edge_list, type, id, child, edgeRHSId);
        if (child.attr_list.length > 0) {
          let erase = (type === 'node' && child.node_id.id === id);
          this.skip('[', erase);
          this.deleteComponentInChildren(child.attr_list, type, id, child, edgeRHSId);
          this.skip(']', erase);
        }
      }
      else if (child.type === 'subgraph') {
        this.skipOptional('subgraph');
        if (child.id) {
          this.skip(child.id);
        }
        this.skip('{');
        // FIXME: remove workaround when https://github.com/anvaka/dotparser/issues/5 is fixed
        if (child.children) {
          this.deleteComponentInChildren(child.children, type, id, child, edgeRHSId);
        }
        this.skip('}');
      }
    });
  }

  skipOptional(string, erase=false) {
    this.skip(string, erase, {optional: true});
  }

  skip(string, erase=false, options={}) {
    let index = this.index;
    let skipIndex = index;
    let prevIndex = null;
    while (index !== prevIndex) {
      prevIndex = index;
      if (whitespaceWithinLine.includes(this.dotSrc[index])) {
        index += 1;
      }
      if (this.dotSrc[index] === '\n') {
        index += 1;
        skipIndex = index;
      }
      if (this.dotSrc.startsWith('/*', index)) {
        index = this.dotSrc.indexOf('*/', index + 2) + 2;
        skipIndex = index;
      }
      if (this.dotSrc.startsWith('//', index)) {
        index = this.dotSrc.indexOf('\n', index + 2) + 1;
        skipIndex = index;
      }
      if (this.dotSrc.startsWith('#', index)) {
        index = this.dotSrc.indexOf('\n', index + 1) + 1;
        skipIndex = index;
      }
    }
    if (this.dotSrc[index] === '"') {
      string = quoteId(string);
    }
    if (!this.dotSrc.startsWith(string, index)) {
      if (!options.optional) {
        throw Error('Expected "' + string + '", found: "' + this.dotSrc.slice(index, index + 40) + '..."');
      }
    } else {
      index += string.length;
    }
    if (erase) {
      this.dotSrc = this.dotSrc.slice(0, skipIndex) + this.dotSrc.slice(index);
    } else {
      this.index = index;
    }
  }

  insert(string) {
    this.dotSrc = this.dotSrc.slice(0, this.index) + string + this.dotSrc.slice(this.index);
    this.index += string.length;
  }

}

function quoteId(value) {
  value = value.replace(/"/g,'\\"');
  value = '"' + value + '"';
  return value;
}

function quoteIdIfNecessary(value) {
  let re = '^[a-zA-Z\\x80-\\xff_][a-zA-Z\\x80-\\xff_0-9]*$';
  if (!value.match(re)) {
    value = quoteId(value);
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
