import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import Index from './index';

describe('<Index />', () => {
  let mount;

  beforeAll(() => {
    mount = createMount();
  });

  afterAll(() => {
    mount.cleanUp();
  });

  it('mounts', () => {
    const wrapper = mount(<Index />);
  });

  it('state has default DOT source after mount', () => {
    const wrapper = mount(<Index />);
    const indexWrapper = wrapper.find('Index');
    const index = indexWrapper.instance();
    const expectedDotSrc = 'strict digraph {\n    a [shape="ellipse" style="filled" fillcolor="#1f77b4"]\n    b [shape="polygon" style="filled" fillcolor="#ff7f0e"]\n    a -> b [fillcolor="#a6cee3" color="#1f78b4"]\n}';
    const actualDotSrc = index.state.dotSrc;
    expect(actualDotSrc).toEqual(expectedDotSrc);
  });

});
