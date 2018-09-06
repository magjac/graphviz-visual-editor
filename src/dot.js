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

  getEdgeAttributes(edgeName) {
    return this.edges[edgeName];
  }

  parseDot() {
    this.ast = parse(this.dotSrc)[0];
    const children = this.ast.children;
    this.nodes = [];
    this.edges = [];
    this.edgeop = this.ast.type === 'digraph' ? '->' : '--';
    this.parseChildren(children, this.ast);
  }

  parseChildren(children, parent) {
    children.forEach((child, i) => {
      if (child.type === 'node_stmt') {
        this.parseChildren([child.node_id], child);
        const attributes = child.attr_list.reduce(function(attrs, attr, i) {
          attrs[attr.id] = attr.eq;
          return attrs;
        }, {});
        Object.assign(this.nodes[child.node_id.id], attributes);
      }
      else if (child.type === 'node_id') {
        const nodeId = child.id;
        if (this.nodes[nodeId] == null) {
          this.nodes[nodeId] = {};
        }
        if (parent.type === 'edge_stmt') {
          if (i > 0) {
            const edgeId = children[i - 1].id + this.edgeop + child.id;
            if (this.edges[edgeId] == null) {
              this.edges[edgeId] = {};
            }
          }
        }
      }
      else if (child.type === 'edge_stmt') {
        this.parseChildren(child.edge_list, child);
        // FIXME: add support for attributes
      }
      else if (child.type === 'subgraph') {
        this.parseChildren(child.children, child);
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
        if (typeof child.port === 'object') {
          this.str += ':';
          this.toStringChildren([child.port]);
        }
      }
      else if (child.type === 'id') {
        if (child.html) {
          this.str += '<' + child.value + '>';
        }
      }
      else if (child.type === 'port') {
        this.str += child.id;
        if (child.compass_pt) {
          this.str += ':' + child.compass_pt;
        }
      }
      else if (child.type === 'attr') {
        if (typeof child.eq === 'object') {
          this.str += quoteIdIfNecessary(child.id) + '=';
          this.toStringChildren([child.eq]);
        } else {
          this.str += quoteIdIfNecessary(child.id) + '=' + quoteIdIfNecessary(child.eq);
        }
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
        this.toStringChildren(child.children);
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
    this.numDeletedComponents = 0;
    this.edgeop = this.ast.type === 'digraph' ? '->' : '--';
    this.index = 0;
    if (this.ast.strict) {
      this.skip('strict');
    }
    this.skip(this.ast.type);
    if (this.ast.id) {
      this.skip(this.ast.id);
    }
    this.skip('{');
    this.deleteComponentInStatementList(this.ast.children, type, id, edgeRHSId);
    this.skip('}');
  }

  deleteComponentInStatementList(children, type, id, edgeRHSId, erase) {
    let erasedAll = true;
    children.forEach((child, i) => {
      const stmtListOptions = {skipSemicolon: true};
      if (child.type === 'attr_stmt') {
        const options = stmtListOptions;
        const optional = (child.target === 'graph');
        options.optional = optional;
        this.skip(child.target, false, options);
        this.skipAttrList(child.attr_list);
        erasedAll = false;
      }
      else if (child.type === 'node_stmt') {
        const eraseNode = (type === 'node' && child.node_id.id === id);
        this.skipNodeId(child.node_id, eraseNode, stmtListOptions);
        this.skipAttrList(child.attr_list, eraseNode);
        if (eraseNode) {
          this.numDeletedComponents += 1;
        } else {
          erasedAll = false;
        }
      }
      else if (child.type === 'edge_stmt') {
        let edgeList = child.edge_list;
        let erasedAllEdges = true;
        edgeList.forEach((nodeIdOrSubgraph, i) => {
          if (nodeIdOrSubgraph.type === 'subgraph') {
            const subgraph = nodeIdOrSubgraph;
            const isFirstNode = (i === 0);
            if (!isFirstNode) {
              this.skip(this.edgeop);
              if (erasedAll) {
                this.skipOptional('', erasedAll);
              }
            }
            this.deleteComponentInStatementList([subgraph], type, id, edgeRHSId);
            erasedAll = false;
            erasedAllEdges = false;
          } else {
            const nodeId = nodeIdOrSubgraph;
            const eraseNode = (type === 'node' && nodeId.id === id);
            const isFirstNode = (i === 0);
            if (!isFirstNode) {
              const nodeIdLeft = getNodeIdString(edgeList[i - 1]);
              const nodeIdRight = getNodeIdString(nodeId);
              const splitEdge = (type === 'edge' && nodeIdLeft === id && nodeIdRight === edgeRHSId);
              const eraseLeftEdge = eraseNode || erasedAll || splitEdge;
              this.skip(this.edgeop, eraseLeftEdge);
              if (erasedAll) {
                this.skipOptional('', erasedAll);
              }
              if (splitEdge) {
                erasedAllEdges = true;
                if (!whitespace.includes(this.dotSrc[this.index])) {
                  this.insert(' ');
                }
              }
              if (eraseLeftEdge) {
                this.numDeletedComponents += 1;
              } else {
                erasedAllEdges = false;
              }
            }
            if (eraseNode) {
              this.numDeletedComponents += 1;
            } else {
              erasedAll = false;
            }
            this.skipNodeId(nodeId, eraseNode, stmtListOptions);
          }
        });
        this.skipAttrList(child.attr_list, erasedAllEdges);
        erasedAll = false;
      }
      else if (child.type === 'subgraph') {
        let options = stmtListOptions;
        const found = this.skipOptional('subgraph', false, options);
        if (found) {
          options = {};
        }
        if (child.id) {
          this.skip(child.id, false, options);
          options = {};
        }
        this.skip('{', false, options);
        this.deleteComponentInStatementList(child.children, type, id, edgeRHSId);
        this.skip('}');
        erasedAll = false;
      }
      if (erasedAll) {
        this.skip('', erasedAll, {optional: true, skipSemicolon: true});
      }
    });
    this.skip(';', false, {optional: true});
  }

  skipId(id, erase) {
    if (id.html) {
      this.skip('<', erase);
      this.skip(id.value, erase, {noSkipNewline: true});
      this.skip('>', erase);
    } else {
      this.skip(id.eq, erase);
    }
  }

  skipNodeId(nodeId, erase, options) {
    this.skip(nodeId.id, erase, options);
    if (nodeId.port) {
      this.skip(':', erase);
      this.skipPort(nodeId.port, erase);
    }
  }

  skipPort(port, erase) {
    this.skip(port.id, erase);
    if (port.compass_pt) {
      this.skip(':', erase);
      this.skip(port.compass_pt, erase);
    }
  }

  skipAttrList(attrList, erase) {
    const attrListOptions = {skipComma: true, skipSemicolon: true};
    attrList.forEach((attr) => {
      this.skipOptional('[', erase);
      this.skip(attr.id, erase, attrListOptions);
      this.skip('=', erase);
      if (typeof attr.eq === 'object' && attr.eq.type === 'id') {
        this.skipId(attr.eq, erase);
      } else {
        this.skip(attr.eq, erase);
      }
      this.skipOptional(']', erase);
    });
  }

  skipOptional(string, erase=false, options={}) {
    options = Object.assign({optional: true}, options);
    this.skip(string, erase, options);
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
      if (options.skipComma) {
        if (this.dotSrc[index] === ',') {
          index += 1;
        }
      }
      if (options.skipSemicolon) {
        if (this.dotSrc[index] === ';') {
          index += 1;
        }
      }
      if (!options.noSkipNewline) {
        if (this.dotSrc[index] === '\n') {
          index += 1;
          skipIndex = index;
        }
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
    let found = false;
    if (!this.dotSrc.startsWith(string, index)) {
      if (!options.optional) {
        throw Error('Expected "' + string + '", found: "' + this.dotSrc.slice(index, index + 40) + '..."');
      }
    } else {
      index += string.length;
      found = true;
    }
    if (erase) {
      this.dotSrc = this.dotSrc.slice(0, skipIndex) + this.dotSrc.slice(index);
    } else {
      this.index = index;
    }
    return found;
  }

  insert(string) {
    this.dotSrc = this.dotSrc.slice(0, this.index) + string + this.dotSrc.slice(this.index);
    this.index += string.length;
  }

}

function getNodeIdString(astNode) {
  let str = astNode.id;
  if (astNode.port) {
    str += ':' + astNode.port.id;
    if (astNode.port.compass_pt) {
      str += ':' + astNode.port.compass_pt;
    }
  }
  return str;
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
