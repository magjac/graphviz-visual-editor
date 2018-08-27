import React from 'react';
import { shallow } from 'enzyme';
import DotGraph from './dot';

const WrapDot = props => {
  let dotGraph = new DotGraph(props.dotSrc);
  return <p>{dotGraph.toString()}</p>;
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

});
