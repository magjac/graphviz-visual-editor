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
