import React from 'react';
import { shallow } from 'enzyme';
import DotGraph from './dot';

const WrapDot = props => {
  let dotGraph = new DotGraph(props.dotSrc);
  return <p>{dotGraph.toString()}</p>;
};

it('renders an empty graph', () => {
  let dotSrc = 'digraph {}';
  const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
  expect(wrapper.find('p').text()).toEqual(dotSrc);
});

it('renders a single node without attributes', () => {
  let dotSrc = 'digraph {a}';
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

it('renders an edge between three nodes', () => {
  let dotSrc = 'digraph {a -> b -> c}';
  const wrapper = shallow(<WrapDot dotSrc={dotSrc} />);
  expect(wrapper.find('p').text()).toEqual(dotSrc);
});
