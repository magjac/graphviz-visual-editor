import parser from './dotParser';
var parse = parser.parse;

const whitespaceWithinLine = ' \t\r';
const whitespace = whitespaceWithinLine + '\n';
const statementSeparators = whitespace + ';';

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
    this.nodes = {};
    this.edges = {};
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
      if (child.type === 'pad') {
        return;
      }
      if (child.type === 'newline') {
        return;
      }
      if (child.type === 'comment') {
        return;
      }
      if (child.type === 'stmt_sep') {
        return;
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
    this.skippableIndex = 0;
    this.erasedIndex = -1;
    this.numErased = 0;
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

  deleteComponentInStatementList(statementList, type, id, edgeRHSId, erase) {
    statementList.forEach((statement, i) => {
      let erasedStatement = false;
      if (statement.type === 'attr_stmt') {
        const targetIsGraph = statement.target === 'graph';
        this.skip(statement.target, false, {optional: targetIsGraph});
        this.skipAttrList(statement.attr_list, false, targetIsGraph);
      }
      else if (statement.type === 'node_stmt') {
        const eraseNode = (type === 'node' && statement.node_id.id === id);
        this.skipLocation(statement, eraseNode);
        if (eraseNode) {
          erasedStatement = true;
          this.numDeletedComponents += 1;
        }
      }
      else if (statement.type === 'edge_stmt') {
        let edgeList = statement.edge_list;
        let erasedLastEdgeStatement = true;
        let erasedAllEdgeConnections = true;
        edgeList.forEach((edgeConnection, i) => {
          if (edgeConnection.type === 'subgraph') {
            const subgraph = edgeConnection;
            const isFirstStatement = (i === 0);
            if (!isFirstStatement) {
              this.skip(this.edgeop);
            }
            this.deleteComponentInStatementList([subgraph], type, id, edgeRHSId);
            erasedAllEdgeConnections = false;
            erasedLastEdgeStatement = false;
          } else {
            const nodeId = edgeConnection;
            const eraseNode = (type === 'node' && nodeId.id === id);
            const isFirstStatement = (i === 0);
            if (!isFirstStatement) {
              const nodeIdLeft = getNodeIdString(edgeList[i - 1]);
              const nodeIdRight = getNodeIdString(nodeId);
              const splitEdge = (type === 'edge' && nodeIdLeft === id && nodeIdRight === edgeRHSId);
              const eraseEdge = eraseNode || erasedAllEdgeConnections || splitEdge;
              this.skip(this.edgeop, eraseEdge);
              if (splitEdge) {
                erasedLastEdgeStatement = true;
                if (!statementSeparators.includes(this.dotSrc[this.index - 1])) {
                  this.insert(' ');
                }
              }
              if (eraseEdge) {
                this.numDeletedComponents += 1;
              } else {
                erasedAllEdgeConnections = false;
                erasedLastEdgeStatement = false;
              }
            }
            if (eraseNode) {
              erasedStatement = true;
              this.numDeletedComponents += 1;
            } else {
              erasedStatement = false;
              erasedAllEdgeConnections = false;
            }
            this.skipNodeId(nodeId, eraseNode);
          }
        });
        this.skipLocation(statement, erasedLastEdgeStatement, true);
        if (erasedLastEdgeStatement) {
          this.skipPrevious(erasedLastEdgeStatement);
          if (statement.attr_list.length > 0) {
            if (!statementSeparators.includes(this.dotSrc[this.index - 1]) &&
                !statementSeparators.includes(this.dotSrc[this.index])) {
              this.insert(' ');
            }
          }
        }
      }
      else if (statement.type === 'subgraph') {
        this.skipOptional('subgraph');
        if (statement.id) {
          this.skip(statement.id);
        }
        this.skip('{');
        this.deleteComponentInStatementList(statement.children, type, id, edgeRHSId);
        this.skip('}');
      }
      this.skipSeparators(erasedStatement, {skipSemicolon: true});
    });
    this.skipPrevious(true);
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

  skipNodeId(nodeId, erase) {
    this.skip(nodeId.id, erase);
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

  skipAttrList(attrList, erase, optionalSquareBrackets) {
    const attrListOptions = {skipComma: true, skipSemicolon: true};
    attrList.forEach((attr, i) => {
      this.skip('[', erase, {optional: optionalSquareBrackets || i > 0});
      this.skip(attr.id, erase, attrListOptions);
      this.skip('=', erase);
      if (typeof attr.eq === 'object' && attr.eq.type === 'id') {
        this.skipId(attr.eq, erase);
      } else {
        this.skip(attr.eq, erase);
      }
      this.skip(']', erase, {optional: optionalSquareBrackets || i < attrList.length - 1});
    });
  }

  skipOptional(string, erase=false, options={}) {
    options = Object.assign({optional: true}, options);
    this.skip(string, erase, options);
  }

  skipSeparators(erase=false, options={}) {
    let index = this.index;
    let skipIndex = this.index;
    let prevIndex = null;
    let prevLength = null;
    function skipPartially(nextIndex) {
      if (erase) {
        if (this.skippableIndex <= this.erasedIndex) {
          if (this.dotSrc[index] === '\n') {
            if (this.dotSrc[this.skippableIndex - 1] === '\n') {
              skipIndex = this.skippableIndex - 1;
            } else {
              skipIndex = this.skippableIndex;
            }
          }
        }
        this.eraseBetween(skipIndex, index);
        nextIndex -= index - skipIndex;
        erase = false;
      }
      index = nextIndex;
      skipIndex = nextIndex;
      this.skippableIndex = nextIndex;
    }
    while (index !== prevIndex || this.dotSrc.length !== prevLength ) {
      prevIndex = index;
      prevLength = this.dotSrc.length;
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
          const nextIndex = index + 1;
          skipPartially.call(this, nextIndex);
        }
      }
      if (this.dotSrc.startsWith('/*', index)) {
        const nextIndex = this.dotSrc.indexOf('*/', index + 2) + 2;
        skipPartially.call(this, nextIndex);
      }
      if (this.dotSrc.startsWith('//', index)) {
        const nextIndex = this.dotSrc.indexOf('\n', index + 2) + 1;
        skipPartially.call(this, nextIndex);
      }
      if (this.dotSrc.startsWith('#', index)) {
        const nextIndex = this.dotSrc.indexOf('\n', index + 1) + 1;
        skipPartially.call(this, nextIndex);
      }
    }
    if (erase) {
      this.eraseBetween(skipIndex, index);
    } else {
      this.index = index;
    }
  }

  skip(string, erase=false, options={}) {
    this.skipSeparators(false, options);
    let index = this.index
    let skipIndex = index;
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
      this.eraseBetween(skipIndex, index);
      this.skipSeparators(erase);
    } else {
      this.index = index;
      if (found && string.length > 0) {
        this.skippableIndex = index;
      }
    }
    return found;
  }

  skipPrevious(erase) {
    if (erase) {
      if (this.skippableIndex <= this.erasedIndex) {
        this.eraseBetween(this.skippableIndex, this.index);
        this.index = this.skippableIndex;
      }
    } else {
      this.skippableIndex = this.index;
    }
  }

  skipLocation(astNode, erase, ignoreStart) {
    let startIndex = astNode.location.start.offset - this.numErased;
    const endIndex = astNode.location.end.offset - this.numErased;
    if (ignoreStart) {
      startIndex = this.index;
    } else {
      if (startIndex !== this.index) {
        throw Error('Unexpected index ' + this.index + ', expected ' + startIndex);
      }
    }
    if (erase) {
      this.eraseBetween(startIndex, endIndex);
    } else {
      this.index = endIndex;
      if (startIndex !== endIndex) {
        this.skippableIndex = this.index;
      }
    }
  }

  eraseBetween(startIndex, endIndex) {
    if (startIndex !== endIndex) {
      this.dotSrc = this.dotSrc.slice(0, startIndex) + this.dotSrc.slice(endIndex);
      this.erasedIndex = startIndex;
      this.numErased += endIndex - startIndex;
    }
  }

  insert(string) {
    this.dotSrc = this.dotSrc.slice(0, this.index) + string + this.dotSrc.slice(this.index);
    this.index += string.length;
    this.numErased -= string.length;
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
