export function insertNode(dotSrcLines, nodeName, attributes) {
  var attributesString = toAttributesString(attributes);
  var newNodeString = '    ' + nodeName + ' [' + attributesString + ']';
  dotSrcLines.splice(-1, 0, newNodeString);
}

export function insertEdge(dotSrcLines, startNodeName, endNodeName, attributes) {
  var attributesString = toAttributesString(attributes);
  var newEdgeString = '    ' + startNodeName + ' -> ' + endNodeName + ' [' + attributesString + ']';
  dotSrcLines.splice(-1, 0, newEdgeString);
}

export function deleteNode(dotSrcLines, nodeName) {
  while (true) {
    var i = dotSrcLines.findIndex(function (element, index) {
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
    dotSrcLines.splice(i, 1);
  }
}

export function deleteEdge(dotSrcLines, edgeName) {
  while (true) {
    var i = dotSrcLines.findIndex(function (element, index) {
      return element.indexOf(edgeName) >= 0;
    });
    if (i < 0)
      break;
    dotSrcLines.splice(i, 1);
  }
}

function toAttributesString(attributes) {
  var attributesString = ''
  for (var name of Object.keys(attributes)) {
    if (attributes[name] !== null) {
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
