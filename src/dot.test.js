import React from 'react';
import { shallow } from 'enzyme';
import DotGraph from './dot';

class WrapDot extends React.Component {
  constructor(props) {
    super(props);
      try {
        this.dotGraph = new DotGraph(props.dotSrc);
      }
      catch(error) {
        let {offset, line, column} = error.location.start;
        error.message += '\nOccurred while parsing DOT source at line ' + line + ' column ' + column + ': ' + props.dotSrc.slice(offset, offset + 40) + '...';
        throw error;
      }
  }
  render () {
    let props = this.props;
    if (props.op === 'deleteNode') {
      this.dotGraph.deleteComponent('node', props.id);
    }
    else if (props.op === 'deleteAllNodes') {
      const nodeIds = Object.keys(this.dotGraph.nodes);
      let numExpectedNodes = nodeIds.length;
      let expectedNodes = new Set(nodeIds);
      for (let nodeId of nodeIds) {
        const prevDotSrc = this.dotGraph.dotSrc;
        this.dotGraph.deleteComponent('node', nodeId);
        numExpectedNodes -= 1;
        expectedNodes.delete(nodeId);
        if (this.dotGraph.dotSrc === prevDotSrc) {
          throw Error('Could not delete node ' + nodeId);
        }
        try {
          this.dotGraph.reparse()
        }
        catch(error) {
          let {offset, line, column} = error.location.start;
          error.message += [
            '\nOccurred while deleting node ' + nodeId + ' at line ' + line + ' column ' + column + ': ' + this.dotGraph.dotSrc.slice(offset, offset + 40) + '...',
            'Original number of nodes: ' + nodeIds.length,
            'Number of successfully deleted nodes before the error: ' + (nodeIds.length - numExpectedNodes - 1),
          ].join('\n');
          throw error;
        }
        const numActualNodes = Object.keys(this.dotGraph.nodes).length;
        const actualNodes = new Set(Object.keys(this.dotGraph.nodes));
        let missingNodes = new Set([...expectedNodes].filter(x => !actualNodes.has(x)));
        let unexpectedNodes = new Set([...actualNodes].filter(x => !expectedNodes.has(x)));
        if (numActualNodes !== numExpectedNodes) {
          let offset = this.dotGraph.dotSrc.indexOf([...unexpectedNodes.values()][0]);
          throw Error([
            'Wrong number of nodes after delete: ' + numActualNodes + ', expected ' + numExpectedNodes,
            'Occurred while deleting node ' + nodeId,
            'Original number of nodes: ' + nodeIds.length,
            'Missing nodes: ' + [...missingNodes.values()],
            'Unexpected nodes: ' + [...unexpectedNodes.values()],
            'First unexpected occurrence: ' + this.dotGraph.dotSrc.slice(offset, offset + 40) + '...',
          ].join('\n'));
        }
      }
    }
    else if (props.op === 'deleteEdge') {
      this.dotGraph.deleteComponent('edge', props.id, props.edgeRHSId);
    }
    let string;
    if (props.raw) {
      string = this.dotGraph.dotSrc;
    } else {
      string = this.dotGraph.toString();
    }
    try {
      this.dotGraph.reparse()
    }
    catch(error) {
      let {offset, line, column} = error.location.start;
      error.message += '\nOccurred when reparsing after ' + props.op + ' ' + props.id + ' ' + (props.edgeRHSId ? props.edgeRHSId + ' ' : '') + 'at line ' + line + ' column ' + column + ': ' + this.dotGraph.dotSrc.slice(offset, offset + 40) + '...';
      throw error;
    }
    return <p>{string}</p>;
  }
};

describe('dot.DotGraph.toString()', () => {

  // general

  it('renders an empty graph', () => {
    let dotSrc = 'graph {}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an empty digraph', () => {
    let dotSrc = 'digraph {}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an empty strict graph', () => {
    let dotSrc = 'strict graph {}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an empty strict digraph', () => {
    let dotSrc = 'strict digraph {}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an empty named graph', () => {
    let dotSrc = 'graph g1 {}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an empty named digraph', () => {
    let dotSrc = 'digraph g1 {}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an empty named strict graph', () => {
    let dotSrc = 'strict graph g1 {}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an empty named strict digraph', () => {
    let dotSrc = 'strict digraph g1 {}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  // nodes

  it('renders a single node without attributes', () => {
    let dotSrc = 'digraph {a}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders a single node with a single attribute', () => {
    let dotSrc = 'digraph {a [shape=ellipse]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders a single node with two attributes', () => {
    let dotSrc = 'digraph {a [shape=ellipse style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders two nodes with attributes', () => {
    let dotSrc = 'digraph {a [shape=ellipse] b [style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders two nodes without attributes', () => {
    let dotSrc = 'digraph {a b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders three nodes without attributes', () => {
    let dotSrc = 'digraph {a b c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders a single node with a compass point', () => {
    let dotSrc = 'digraph {a:n}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders a single node with a port and compass point', () => {
    let dotSrc = 'digraph {a:p1:n}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  // edges

  it('renders an edge between two nodes in an undirected graph', () => {
    let dotSrc = 'graph {a -- b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an edge between two nodes in a directed graph', () => {
    let dotSrc = 'digraph {a -> b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an edge with attributes', () => {
    let dotSrc = 'digraph {a -> b [color=red fillcolor=green]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an edge between three nodes', () => {
    let dotSrc = 'digraph {a -> b -> c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an edge between compass points on two nodes in a directed graph', () => {
    let dotSrc = 'digraph {a:n -> b:e}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an edge between ports and compass points on two nodes in a directed graph', () => {
    let dotSrc = 'digraph {a:p1:n -> b:p2:e}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  // nodes and edges

  it('renders multiple nodes and edges', () => {
    let dotSrc = 'digraph {a b c d -> e f -> g -> h}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  // subgraphs

  it('renders an unnamed empty subgraph', () => {
    let dotSrc = 'digraph {{}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders a named empty subgraph', () => {
    let dotSrc = 'digraph {subgraph s1{}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an unnamed subgraph with a single node', () => {
    let dotSrc = 'digraph {{a}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders a named subgraph with a single node', () => {
    let dotSrc = 'digraph {subgraph s1{a}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an unnamed subgraph with two nodes', () => {
    let dotSrc = 'digraph {{a b}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an unnamed subgraph with an edge between two nodes', () => {
    let dotSrc = 'digraph {{a -> b}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders an unnamed subgraph with multiple nodes and edges', () => {
    let dotSrc = 'digraph {{a b c d -> e f -> g -> h}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  // attribute statements

  it('renders a graph attribute statement', () => {
    let dotSrc = 'digraph {graph [label=g1]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders a graph attribute statement without the graph keyword', () => {
    let dotSrc = 'digraph {label=g2}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    dotSrc = 'digraph {graph [label=g2]}';
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders a node attribute statement', () => {
    let dotSrc = 'digraph {node [label=n1]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders a edge attribute statement', () => {
    let dotSrc = 'digraph {edge [label=e1]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders html-like labels', () => {
    let dotSrc = 'graph {graph [label=<>]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="toString" />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders multiple graph attribute statement without the graph keyword', () => {
    let dotSrc = 'digraph {label=g2; color=red}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    dotSrc = 'digraph {graph [label=g2] graph [color=red]}';
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders a single graph attribute statement with two attributes with the graph keyword and separate brackets', () => {
    let dotSrc = 'digraph {graph [label=g2] [color=red]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    dotSrc = 'digraph {graph [label=g2 color=red]}';
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders a single graph attribute statement with two attributes with the graph keyword and common backets', () => {
    let dotSrc = 'digraph {graph [label=g2; color=red]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    dotSrc = 'digraph {graph [label=g2 color=red]}';
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  // quoting

  it('renders node id with quotes if it contains a space', () => {
    let dotSrc = 'digraph {"a 1"}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders node id with quotes if it contains a quote', () => {
    let dotSrc = 'digraph {"a\\\"1"}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders attribute name with quotes if it contains a space', () => {
    let dotSrc = 'digraph {a ["label 1"=foo]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders attribute name with quotes if it contains a quote', () => {
    let dotSrc = 'digraph {a ["label\\"1"=foo]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders attribute value with quotes if it contains a space', () => {
    let dotSrc = 'digraph {a [label="foo bar"]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders attribute value with quotes if it contains a quote', () => {
    let dotSrc = 'digraph {a [label="foo\\"bar"]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders subgraph id with quotes if it contains a space', () => {
    let dotSrc = 'digraph {subgraph "s 2"{a}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders subgraph id with quotes if it contains a quote', () => {
    let dotSrc = 'digraph {subgraph "s\\\"2"{a}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  // whitespace

  it('deletes the first node in an edge between two nodes with newline after', () => {
    let dotSrc = 'digraph {a -> b\n}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b\n}');
  });

  it('deletes the second node in an edge between two nodes with newline after', () => {
    let dotSrc = 'digraph {a        -> b\n}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a\n}');
  });

  it('renders a single node with a compass point with whitespace around the colon', () => {
    let dotSrc = 'digraph {a : n}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a:n}');
  });

  it('renders an edge between compass points with whitespace around the colons on two nodes in a directed graph', () => {
    let dotSrc = 'digraph {a : n -> b : e}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a:n -> b:e}');
  });

  it('renders a single node with a compass point with whitespace around the colon', () => {
    let dotSrc = 'digraph {a : n}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a:n}');
  });

  // separators

  it('renders two nodes separated by semicolon', () => {
    let dotSrc = 'digraph {a;b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    dotSrc = dotSrc.replace(';', ' ');
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('throws error when trying to render two nodes separated by comma', () => {
    let dotSrc = 'digraph {a,b}';
    expect(() => {
      shallow(<WrapDot dotSrc={dotSrc} />);
    }).toThrow();
  });

  it('renders a single node with two attributes separated by semicolon', () => {
    let dotSrc = 'digraph {a [shape=ellipse;style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    dotSrc = dotSrc.replace(';', ' ');
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('renders a single node with two attributes separated comma', () => {
    let dotSrc = 'digraph {a [shape=ellipse,style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
    dotSrc = dotSrc.replace(',', ' ');
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

});

describe('dot.DotGraph.deleteComponent()', () => {

  // nodes

  it('deletes a node in a graph with a single node', () => {
    let dotSrc = 'graph {a}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes a node in a digraph with a single node', () => {
    let dotSrc = 'digraph {a}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {}');
  });

  it('deletes a node in a strict graph with a single node', () => {
    let dotSrc = 'strict graph {a}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('strict graph {}');
  });

  it('deletes a node in a strict digraph with a single node', () => {
    let dotSrc = 'strict digraph {a}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('strict digraph {}');
  });

  it('deletes a node in a named graph with a single node', () => {
    let dotSrc = 'graph g1 {a}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph g1 {}');
  });

  it('deletes the first node in a graph with two nodes', () => {
    let dotSrc = 'graph {a b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b}');
  });

  it('deletes the second node in a graph with two nodes', () => {
    let dotSrc = 'graph {a b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a}');
  });

  it('deletes the first node in a graph with three nodes', () => {
    let dotSrc = 'graph {a b c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b c}');
  });

  it('deletes the second node in a graph with three nodes', () => {
    let dotSrc = 'graph {a b c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a c}');
  });

  it('deletes the third node in a graph with three nodes', () => {
    let dotSrc = 'graph {a b c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="c" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b}');
  });

  it('deletes two instances of the same node in a graph with two unique nodes', () => {
    let dotSrc = 'graph {a b a}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b}');
  });

  it('deletes the first node in a graph with one edge between two nodes', () => {
    let dotSrc = 'graph {a -- b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b}');
  });

  it('deletes the last node in a graph with one edge between two nodes', () => {
    let dotSrc = 'graph {a -- b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a}');
  });

  it('deletes the first node in a graph with edges between three nodes', () => {
    let dotSrc = 'graph {a -- b -- c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b -- c}');
  });

  it('deletes the middle node in a graph with edges between three nodes', () => {
    let dotSrc = 'graph {a -- b -- c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a -- c}');
  });

  it('deletes the last node in a graph with edges between three nodes', () => {
    let dotSrc = 'graph {a -- b -- c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="c" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a -- b}');
  });

  it('deletes the both instances of the same node in a graph with edges between two nodes', () => {
    let dotSrc = 'graph {a -- a}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

 it('deletes all three instances of the same node in a graph with edges between three nodes', () => {
    let dotSrc = 'graph {a -- a -- a}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes both (first) instances of the same node in a graph with edges between three nodes', () => {
    let dotSrc = 'graph {a -- a -- b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b}');
  });

  it('deletes both (last) instances of the same node in a graph with edges between three nodes', () => {
    let dotSrc = 'graph {b -- a -- a}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b}');
  });

  it('deletes both (first and last) instances of the same node in a graph with edges between three nodes', () => {
    let dotSrc = 'graph {a -- b -- a}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b}');
  });

  it('deletes a node with quoted node id in a graph with a single node', () => {
    let dotSrc = 'graph {"a"}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes a node with quoted node id conataining space in a graph with a single node', () => {
    let dotSrc = 'graph {"a 1"}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a 1" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes a node with quoted node id conataining a quote in a graph with a single node', () => {
    let dotSrc = 'graph {"a\\\"1"}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id='a"1' raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes a node with quoted node id starting with a quote in a graph with a single node', () => {
    let dotSrc = 'graph {"\\\"a"}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id='"a' raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes a node with quoted node id ending with a quote in a graph with a single node', () => {
    let dotSrc = 'graph {"a\\\""}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id='a"' raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes a node with quoted node id conataining two quotes in a graph with a single node', () => {
    let dotSrc = 'graph {"a\\\"1\\\"2"}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id='a"1"2' raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes a node with quoted node id starting with a quote in a graph with a single node', () => {
    let dotSrc = 'graph {"\\\"a"}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id='"a' raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes a node with attributes in a graph with a single node', () => {
    let dotSrc = 'graph {a [style=filled fillcolor=red]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes a node with quoted attributes in a graph with a single node', () => {
    let dotSrc = 'graph {a ["style"="filled" "fillcolor"="red"]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes a node with multiple attribute lists in a graph with a single node', () => {
    let dotSrc = 'graph {a [style=filled] [fillcolor=red]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes the first node in a graph with edges between three nodes and keeps the edge attributes', () => {
    let dotSrc = 'graph {a -- b -- c [color=red]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b -- c [color=red]}');
  });

  it('deletes the middle node in a graph with edges between three nodes and keeps the edge attributes', () => {
    let dotSrc = 'graph {a -- b -- c [color=red]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a -- c [color=red]}');
  });

  it('deletes the last node in a graph with edges between three nodes and keeps the edge attributes', () => {
    let dotSrc = 'graph {a -- b -- c [color=red]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="c" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a -- b [color=red]}');
  });

  // edges

  it('deletes an edge in a graph with a single edge between two nodes', () => {
    let dotSrc = 'graph {a--b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b}');
  });

  it('deletes an edge in a digraph with a single edge between two nodes', () => {
    let dotSrc = 'digraph {a->b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a b}');
  });

  it('does not delete an edge in a graph with a single edge in the other direction between two nodes', () => {
    let dotSrc = 'graph {a--b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="b" edgeRHSId="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a--b}');
  });

  it('deletes an edge in a graph with a single edge surrounded by space between two nodes', () => {
    let dotSrc = 'graph {a -- b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b}');
  });

  it('deletes the first edge in a graph with two edges between three nodes', () => {
    let dotSrc = 'graph {a--b--c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b--c}');
  });

  it('deletes the second edge in a graph with two edges between three nodes', () => {
    let dotSrc = 'graph {a--b--c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="b" edgeRHSId="c" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a--b c}');
  });

  it('deletes an edge with attributes in a graph with a single edge between two nodes', () => {
    let dotSrc = 'graph {a--b [dir=back]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b}');
  });

  it('deletes an edge with multiple attribute lists in a graph with a single edge between two nodes', () => {
    let dotSrc = 'graph {a--b [dir=back] [color=red]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b}');
  });

  it('deletes an edge with attributes in a graph with two edges between different nodes', () => {
    let dotSrc = 'graph {a--b [dir=back]; c--d [dir=both]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b; c--d [dir=both]}');
  });

  it('deletes the second edge in a graph with two edges between three nodes and removes its attributes', () => {
    let dotSrc = 'graph {a--b--c [color=red]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="b" edgeRHSId="c" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a--b c}');
  });

  it('deletes the first edge in a graph with two edges between three nodes and keeps the attributes for the other edge', () => {
    let dotSrc = 'graph {a--b--c [color=red]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b--c [color=red]}');
  });

  it('deletes the second edge in a graph with three edges between four nodes and keeps the attributes for the last edge', () => {
    let dotSrc = 'graph {a--b--c--d [color=red]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="b" edgeRHSId="c" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a--b c--d [color=red]}');
  });

  it('deletes an edge with attributes in a graph with a single edge between two nodes and no whitespace to a third node', () => {
    let dotSrc = 'graph {a--b[dir=back]c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b c}');
  });

  it('deletes an edge in a digraph with a single edge between two nodes with compass points', () => {
    let dotSrc = 'digraph {a:n -> b:e}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a:n" edgeRHSId="b:e" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a:n b:e}');
  });

  it('deletes an edge in a digraph with a single edge between two nodes with ports with compass points', () => {
    let dotSrc = 'digraph {a:p1:n -> b:p2:e}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a:p1:n" edgeRHSId="b:p2:e" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a:p1:n b:p2:e}');
  });

  it('does not deletes an edge in a digraph with a single edge between two nodes with compass points for other compass points than the specified', () => {
    let dotSrc = 'digraph {a:p1:n -> b:p2:e}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a:p1:s" edgeRHSId="b:p2:e" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a:p1:n -> b:p2:e}');
  });

  it('does not deletes an edge in a digraph with a single edge between two nodes with compass points for other port id\'s points than the specified', () => {
    let dotSrc = 'digraph {a:p1:n -> b:p2:e}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a:p3:n" edgeRHSId="b:p4:e" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a:p1:n -> b:p2:e}');
  });

  it('deletes the second node of the first edge in a digraph with two edge statements on the same line', () => {
    let dotSrc = 'digraph {a -> b c -> d}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a c -> d}');
  });

  it('deletes the second node of the first edge in a digraph with two edge statements separated with semicolon on the same line', () => {
    let dotSrc = 'digraph {a -> b; c -> d}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a; c -> d}');
  });

  it('deletes the second node of the first edge in a digraph with two edge statements whithout whitespace separated with semicolon and space on the same line', () => {
    let dotSrc = 'digraph {a->b; c->d}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b; c->d}');
  });

  // subgraphs

  it('ignores an empty subgraph', () => {
    let dotSrc = 'graph {{}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {{}}');
  });

  it('ignores a subgraph containing only space', () => {
    let dotSrc = 'graph {{ }}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {{ }}');
  });

  it('deletes a node in a subgraph with a single node', () => {
    let dotSrc = 'graph {{a}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {{}}');
  });

  it('deletes a node in a named subgraph with a single node', () => {
    let dotSrc = 'graph {subgraph s1 {a}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {subgraph s1 {}}');
  });

  it('deletes a node in a subgraph with the subgraph keyword only with a single node', () => {
    let dotSrc = 'graph {subgraph {a}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {subgraph {}}');
  });

  it('deletes a node in a subgraph with a single node with space before', () => {
    let dotSrc = 'graph {{ a}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {{}}');
  });

  it('deletes a node in a subgraph with a single node with space after', () => {
    let dotSrc = 'graph {{a }}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {{}}');
  });

  it('deletes a node in a subgraph with a single node with newline and space after', () => {
    let dotSrc = 'graph {{a\n }}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {{\n }}');
  });

  it('deletes an edge in a subgraph with an edge between two nodes', () => {
    let dotSrc = 'graph {{a -- b}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {{a b}}');
  });

  it('deletes an edge in a subgraph with an edge between two nodes', () => {
    let dotSrc = 'digraph {{a b c d -> e f -> g -> h}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {{a b c d -> e f g -> h}}');
  });

  it('ignores an edge from a node to a subgraph', () => {
    let dotSrc = 'digraph {a -> {b}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="noexist1" edgeRHSId="noexist2" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a -> {b}}');
  });

  it('ignores an edge from a subgraph to a node', () => {
    let dotSrc = 'digraph {{a} -> b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="noexist1" edgeRHSId="noexist2" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {{a} -> b}');
  });

  it('ignores an edge between two subgraphs', () => {
    let dotSrc = 'digraph {{a} -> {b}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="noexist1" edgeRHSId="noexist2" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {{a} -> {b}}');
  });

  it('deletes a node in an edge from a subgraph', () => {
    let dotSrc = 'digraph {{a}        -> b\n}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {{a}\n}');
  });

  it('deletes an edge in a subgraph with newline and space after', () => {
    let dotSrc = 'digraph {{a -> b\n }}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {{a b\n }}');
  });

  // attribute statements

  it('ignores graph attribute statements', () => {
    let dotSrc = 'graph {graph [label=l1]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {graph [label=l1]}');
  });

  it('ignores multiple graph attribute statements separated by space', () => {
    let dotSrc = 'graph {graph [label=l1] graph [rankdir=TB]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {graph [label=l1] graph [rankdir=TB]}');
  });

  it('ignores graph attribute statements with attributes separated by space', () => {
    let dotSrc = 'graph {graph [label=l1 rankdir=TB]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {graph [label=l1 rankdir=TB]}');
  });

  it('ignores graph attribute statements with attributes separated by comma', () => {
    let dotSrc = 'graph {graph [label=l1,rankdir=TB]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {graph [label=l1,rankdir=TB]}');
  });

  it('ignores graph attribute statements with an attribute with an empty value', () => {
    let dotSrc = 'graph {graph [label=""]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {graph [label=""]}');
  });

  it('ignores graph attribute statements with an attribute with a numeric integer value', () => {

    let dotSrc = 'graph {graph [label=1]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {graph [label=1]}');
  });

  it('ignores graph attribute statements with an attribute with a numeric 0', () => {

    let dotSrc = 'graph {graph [label=0]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {graph [label=0]}');
  });

  it('ignores graph attribute statements with an attribute with a numeric floating point value', () => {
    let dotSrc = 'graph {graph [label=1.5]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {graph [label=1.5]}');
  });

  it('ignores graph attribute statements with an attribute with a numeric fractional value', () => {
    let dotSrc = 'graph {graph [label=0.5]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {graph [label=0.5]}');
  });

  it('ignores graph attribute statements with an attribute with a numeric fractional value without leading zero', () => {
    let dotSrc = 'graph {graph [label=.5]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {graph [label=.5]}');
  });

  it('ignores graph attribute statements with attributes separated by semicolon', () => {
    let dotSrc = 'graph {graph [label=l1;rankdir=TB]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {graph [label=l1;rankdir=TB]}');
  });

  it('ignores graph attribute statements without the graph keyword', () => {
    let dotSrc = 'graph {label=l1}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {label=l1}');
  });

  it('ignores node attribute statements', () => {
    let dotSrc = 'graph {node [label=n1]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {node [label=n1]}');
  });

  it('ignores edge attribute statements', () => {
    let dotSrc = 'graph {edge [label=n1]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {edge [label=n1]}');
  });

  it('ignores html-like labels', () => {
    let dotSrc = 'graph {label=<>}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  it('ignores html-like labels with embedded newlines', () => {
    let dotSrc = 'graph {label=<\n>}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual(dotSrc);
  });

  // comments

  it('deletes a node in a graph with "/*...*/" comments and a single node', () => {
    let dotSrc = 'graph {/* foo */ a /* bar */}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual('graph {/* foo */ /* bar */}');
  });

  it('deletes a node in a graph with "//" comments and tree nodes', () => {
    let dotSrc = `graph {
a // foo
b // bar
c // baz
}`;
    let newDotSrc = `graph {
a // foo
// bar
c // baz
}`;
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual(newDotSrc);
  });

  it('deletes a node in a graph with "#" comments and three nodes', () => {
    let dotSrc = `graph {
a # foo
b # bar
c # baz
}`;
    let newDotSrc = `graph {
a # foo
# bar
c # baz
}`;
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual(newDotSrc);
  });

  // whitespace

  it('deletes a node and the surrounding whitespace in a graph with a single node', () => {
    let dotSrc = 'graph {\t\r    a \r\t}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes the first node and the trailing whitespace in a graph with two nodes with whitespace around', () => {
    let dotSrc = 'graph {    a  b }';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual('graph {    b }');
  });

  it('deletes the second node and the surrounding whitespace in a graph with two nodes with whitespace around', () => {
    let dotSrc = 'graph {    a  b }';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual('graph {    a}');
  });

  it('deletes the first node and the succeeding whitespace in the same line in a graph with two nodes', () => {
    let dotSrc = `graph {

    a  b 

}`;
    let newDotSrc = `graph {

    b 

}`;
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual(newDotSrc);
  });

  it('deletes the second node and the succeeding whitespace in the same line in a graph with two nodes', () => {
    let dotSrc = `graph {

    a  b 

}`;
    let newDotSrc = `graph {

    a

}`;
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual(newDotSrc);
  });

  it('deletes a node and leaves whitespace between the remaining nodes in a graph with three nodes', () => {
    let dotSrc = `graph {

a b c

}`;
    let newDotSrc = `graph {

a c

}`;
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual(newDotSrc);
  });

  it('deletes a node and the line it is on if it is the only statement on the line and at start of line and blank lines around', () => {
    let dotSrc = `graph {

a

}`;
    let newDotSrc = `graph {


}`;
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual(newDotSrc);
  });

  it('deletes a node and the line it is on if it is the only statement on the line and at start of line and non-blank lines around', () => {
    let dotSrc = `graph {
a
b
c
}`;
    let newDotSrc = `graph {
a
c
}`;
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual(newDotSrc);
  });

  it('deletes a node and the line it is on if it is the only statement on the line and not start of line and blank lines around', () => {
    let dotSrc = `graph {

 a

}`;
    let newDotSrc = `graph {


}`;
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual(newDotSrc);
  });

  it('deletes a node and the line it is on if it is the only statement on the line and not start of line and non-blank lines around', () => {
    let dotSrc = `graph {
 a
 b
 c
}`;
    let newDotSrc = `graph {
 a
 c
}`;
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true}/>);
    expect(wrapper.find('p').text()).toEqual(newDotSrc);
  });

  it('deletes the first node in a graph with two nodes with attributes without any separators', () => {
    let dotSrc = 'graph {a[color=red]b[color=green]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b[color=green]}');
  });

  // separators

  it('deletes the first node in a graph with two nodes separated by semicolon', () => {
    let dotSrc = 'graph {a;b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b}');
  });

  it('deletes the first node in a digraph with two nodes separated by semicolon', () => {
    let dotSrc = 'digraph {a;b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b}');
  });

  it('deletes the second node in a graph with two nodes separated by semicolon', () => {
    let dotSrc = 'graph {a;b}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a}');
  });

  it('deletes the second node in a graph with three nodes separated by semicolon', () => {
    let dotSrc = 'graph {a;b;c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a;c}');
  });

  it('deletes a node and the succeeding semicolon in a graph with one node', () => {
    let dotSrc = 'graph {a;}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes both instances of the same node and the succeeding semicolon in a graph with edges between two nodes', () => {
    let dotSrc = 'graph {a -- a;}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {}');
  });

  it('deletes the first edge in a graph with two edges separated by semicolon', () => {
    let dotSrc = 'graph {a--b;c--d}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b;c--d}');
  });

  it('deletes the second edge in a graph with two edges separated by semicolon', () => {
    let dotSrc = 'graph {a--b;c--d}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="c" edgeRHSId="d" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a--b;c d}');
  });

  it('deletes the second edge in a graph with three edges separated by semicolon', () => {
    let dotSrc = 'graph {a--b;c--d;e--f}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="c" edgeRHSId="d" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a--b;c d;e--f}');
  });

  it('deletes an edge, but leaves the succeeding semicolon in a graph with one edge', () => {
    let dotSrc = 'graph {a--b;}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b;}');
  });

  it('deletes an edge with attributes without any whitespace', () => {
    let dotSrc = 'graph {a--b[color=red]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b}');
  });

  it('deletes an edge with attributes followed by a node without any whitespace', () => {
    let dotSrc = 'graph {a--b[color=red]c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b c}');
  });

  it('deletes an edge with attributes with space between followed by a node without any whitespace', () => {
    let dotSrc = 'graph {a--b [color=red]c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b c}');
  });

  it('deletes an edge with attributes without space between followed by a node with space between', () => {
    let dotSrc = 'graph {a--b[color=red] c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b c}');
  });

  it('deletes an edge with attributes with space between followed by a node with space between', () => {
    let dotSrc = 'graph {a--b [color=red] c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b c}');
  });

  it('deletes an edge with attributes followed by a node and space between each element', () => {
    let dotSrc = 'graph {a -- b [color=red] c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b c}');
  });

  it('deletes an edge with attributes followed by a node and space between each element exept before edge operator', () => {
    let dotSrc = 'graph {a-- b [color=red] c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b c}');
  });

  it('deletes an edge with attributes followed by a node and space between each element exept after edge operator', () => {
    let dotSrc = 'graph {a --b [color=red] c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b c}');
  });

  it('deletes an edge with attributes without space between followed by a node with semicolon between', () => {
    let dotSrc = 'graph {a--b[color=red];c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b;c}');
  });

  it('ignores multiple graph attribute statements separated by semicolon', () => {
    let dotSrc = 'graph {graph [label=l1]; graph [rankdir=TB]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {graph [label=l1]; graph [rankdir=TB]}');
  });

  it('ignores multiple subgraphs separated by semicolon', () => {
    let dotSrc = 'graph {subgraph {}; subgraph {}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {subgraph {}; subgraph {}}');
  });

  it('ignores multiple named subgraphs separated by semicolon', () => {
    let dotSrc = 'graph {subgraph s1 {}; subgraph s2 {}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {subgraph s1 {}; subgraph s2 {}}');
  });

  it('ignores node statement and subgraph separated by semicolon', () => {
    let dotSrc = 'graph {a; subgraph s1 {}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a; subgraph s1 {}}');
  });

  it('ignores attribute statement and subgraph separated by semicolon', () => {
    let dotSrc = 'graph {node [style=filled]; subgraph s1 {}}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="f" edgeRHSId="g" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {node [style=filled]; subgraph s1 {}}');
  });

  it('deletes a node and the succeeding space-separated attribute list', () => {
    let dotSrc = 'digraph {a [shape=ellipse style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {}');
  });

  it('deletes a node and the succeeding space-newline-space-separated attribute list', () => {
    let dotSrc = 'digraph {a [\n shape=ellipse \n style=filled\n ]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {}');
  });

  it('deletes a node and the succeeding comma-separated attribute list', () => {
    let dotSrc = 'digraph {a [shape=ellipse,style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {}');
  });

  it('deletes a node and the succeeding comma-newline-space-separated attribute list', () => {
    let dotSrc = 'digraph {a [\n shape=ellipse,\n style=filled\n ]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {}');
  });

  it('deletes a node and the succeeding semicolon-separated attribute list', () => {
    let dotSrc = 'digraph {a [shape=ellipse;style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {}');
  });

  it('deletes a node and the succeeding semicolon-newline-space-separated attribute list', () => {
    let dotSrc = 'digraph {a [\n shape=ellipse;\n style=filled\n ]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {}');
  });

  it('deletes a node in an edge statement and the succeeding space-separated edge attribute list', () => {
    let dotSrc = 'digraph {a -> b [dir=back style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b}');
  });

  it('deletes a node in an edge statement and the succeeding space-newline-space separated edge attribute list', () => {
    let dotSrc = 'digraph {a -> b [dir=back \n style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b}');
  });

  it('deletes a node in an edge statement and the succeeding comma-separated edge attribute list', () => {
    let dotSrc = 'digraph {a -> b [dir=back,style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b}');
  });

  it('deletes a node in an edge statement and the succeeding comma-newline-space separated edge attribute list', () => {
    let dotSrc = 'digraph {a -> b [dir=back,\n style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b}');
  });

  it('deletes a node in an edge statement and the succeeding semicolon-separated edge attribute list', () => {
    let dotSrc = 'digraph {a -> b [dir=back;style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b}');
  });

  it('deletes a node in an edge statement and the succeeding semicolon-newline-space separated edge attribute list', () => {
    let dotSrc = 'digraph {a -> b [dir=back; \n style=filled]}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b}');
  });

  // complex

  it('deletes the first node followed by a graph attribute statement without keyword and brackets', () => {
    let dotSrc = 'graph {a b label=l1}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b label=l1}');
  });

  it('deletes the second node followed by a graph attribute statement without keyword and brackets', () => {
    let dotSrc = 'graph {a b label=l1}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a label=l1}');
  });

  it('deletes the first node with attributes followed by a graph attribute statement without keyword and brackets', () => {
    let dotSrc = 'graph {a [color=blue] b [color=red] label=l1}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a [color=blue] label=l1}');
  });

  it('deletes the second node with attributes followed by a graph attribute statement without keyword and brackets', () => {
    let dotSrc = 'graph {a [color=blue] b [color=red] label=l1}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {b [color=red] label=l1}');
  });

  it('deletes an edge followed by a graph attribute statement without keyword and brackets', () => {
    let dotSrc = 'graph {a -- b label=l1}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('graph {a b label=l1}');
  });

  it('deletes the first of two nodes in an edge followed by another node', () => {
    let dotSrc = 'digraph {a -> b c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b c}');
  });

  it('deletes the first of two nodes in an edge with attributes followed by another node', () => {
    let dotSrc = 'digraph {a -> b [color=orange] c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b c}');
  });

  it('deletes the first of two nodes in an edge with attributes followed by another node. No space spearation', () => {
    let dotSrc = 'digraph {a->b[color=orange]c}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b c}');
  });

  it('deletes the first of two nodes in an edge with attributes followed by a graph attribute statement without keyword and brackets', () => {
    let dotSrc = 'digraph {a -> b [color=orange] color=blue}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b color=blue}');
  });

  it('deletes the first of three nodes in an edge with attributes followed by a graph attribute statement without keyword and brackets', () => {
    let dotSrc = 'digraph {a -> b -> c [color=orange] color=blue}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="a" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {b -> c [color=orange] color=blue}');
  });

  it('deletes an edge with attributes between two nodes followed by a graph attribute statement without keyword and brackets', () => {
    let dotSrc = 'digraph {a -> b [color=orange] color=blue}';
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a" edgeRHSId="b" raw={true} />);
    expect(wrapper.find('p').text()).toEqual('digraph {a b color=blue}');
  });

  it('deletes a node in an edge followed by an indented subgraph on the next line', () => {
    let dotSrc = ` digraph {
    a -> b
    subgraph {}
}`;
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="b" raw={true} />);
    let newDotSrc = ` digraph {
    a
    subgraph {}
}`;
    expect(wrapper.find('p').text()).toEqual(newDotSrc);
  });

  it('deletes an edge with attributes followed by an indented node on the next line', () => {
    let dotSrc = `digraph {
    a -> b [color=blue]
    c
}`;
    const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="a"  edgeRHSId="b" raw={true} />);
    let newDotSrc = `digraph {
    a b
    c
}`;
    expect(wrapper.find('p').text()).toEqual(newDotSrc);
  });

  // complex sequences

  it('deletes everything in two-node subgraph with edge to a third node', () => {
    let dotSrc1 = `digraph {
    subgraph {
        a b
    } -> c
}`;
    const wrapper = shallow(<WrapDot dotSrc={dotSrc1} op="deleteNode" id="a" raw={true} />);
    let dotSrc2 = `digraph {
    subgraph {
        b
    } -> c
}`;
    expect(wrapper.find('p').text()).toEqual(dotSrc2);
    wrapper.setProps({op: "deleteNode", id:"c"});
    let dotSrc3 = `digraph {
    subgraph {
        b
    }
}`;
    expect(wrapper.find('p').text()).toEqual(dotSrc3);
    wrapper.setProps({op: "deleteEdge", id: "a", edgeRHSId: "c"});
    let dotSrc4 = `digraph {
    subgraph {
        b
    }
}`;
    expect(wrapper.find('p').text()).toEqual(dotSrc4);
  });


});

function readDotFiles() {
  let fs = require('fs');
  let path = process.cwd();
  let buffer = fs.readFileSync(path + "/dotfiles.txt");
  let dotFilesString = buffer.toString();
  dotFilesString = dotFilesString.replace(/#.*\n/g, '').trim();
  let dotFiles = dotFilesString.trim().split('\n');
  return dotFiles;
}

describe('dot.DotGraph.toString() parses Graphviz dot files', () => {
  let dotFiles = readDotFiles();
  dotFiles.forEach((dotFile) => {

    let fs = require('fs');
    let buffer = fs.readFileSync(dotFile);
    let dotSrc0 = buffer.toString();

    it(`Parses ${dotFile}`, () => {
      const wrapper1 = shallow(<WrapDot dotSrc={dotSrc0} op="toString" id="a"/>);
      const dotSrc1 = wrapper1.find('p').text();
      const wrapper2 = shallow(<WrapDot dotSrc={dotSrc1} op="toString" id="a"/>);
      const dotSrc2 = wrapper2.find('p').text();
      expect(dotSrc2).toEqual(dotSrc1);
    });

  });
});

describe('dot.DotGraph.deleteComponent() transparently processes', () => {
  let dotFiles = readDotFiles();
  dotFiles.forEach((dotFile) => {

    let fs = require('fs');
    let buffer = fs.readFileSync(dotFile);
    let dotSrc = buffer.toString();

    it(`${dotFile} when attempting to delete a nonexistent node`, () => {
      const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteNode" id="magjac-noexist" raw={true} />);
      expect(wrapper.find('p').text()).toEqual(dotSrc);
    });

    it(`${dotFile} when attempting to delete a nonexistent edge`, () => {
      const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteEdge" id="magjac-noexist1" edgeRHSId="magjac-noexist2" raw={true} />);
      expect(wrapper.find('p').text()).toEqual(dotSrc);
    });
  });
});

describe('dot.DotGraph.deleteComponent() deletes all nodes', () => {
  let dotFiles = readDotFiles();
  dotFiles.forEach((dotFile) => {
    let fs = require('fs');
    let buffer = fs.readFileSync(dotFile);
    let dotSrc = buffer.toString();

    it(`in ${dotFile} without any error (but without checking the actual result).`, () => {
      const wrapper = shallow(<WrapDot dotSrc={dotSrc} op="deleteAllNodes" raw={true} />);
    });
  });
});
