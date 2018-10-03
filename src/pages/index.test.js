import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import Index from './index';
import polyfillElement from '../test-utils/polyfillElement';
import polyfillSVGElement from '../test-utils/polyfillSVGElement';
import polyfillXMLSerializer from '../test-utils/polyfillXMLSerializer';

describe('<Index />', () => {

  const divProperties = {
    clientWidth: 2 * 4 * 4 / 3,
    clientHeight: 2 * 112 * 4 / 3,
  };
  polyfillElement(divProperties);
  polyfillSVGElement();
  polyfillXMLSerializer();

  let mount;

  beforeEach(() => {
    mount = createMount();
  });

  afterEach(() => {
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

  it('receives updated DOT source', () => {
    const wrapper = mount(<Index />);
    const indexWrapper = wrapper.find('Index');
    const index = indexWrapper.instance();
    const expectedDotSrc = 'digraph {a -> b}';
    index.setState({dotSrc: expectedDotSrc});
    const actualDotSrc = index.state.dotSrc;
    expect(actualDotSrc).toEqual(expectedDotSrc);
  });

  it('renders updated SVG after receiving updated DOT source', () => {
    const wrapper = mount(<Index />);
    const indexWrapper = wrapper.find('Index');
    const index = indexWrapper.instance();
    const expectedDotSrc = 'digraph {a -> b}';
    index.setState({dotSrc: expectedDotSrc});
    const graph = wrapper.find('Graph').instance();
    const width = divProperties.clientWidth;
    const height = divProperties.clientHeight;
    const widthPt = width * 3 / 4;
    const heightPt = height * 3 / 4;
    const expectedSvgString = `<svg width="${width}" height="${height}" viewBox="0 0 ${widthPt} ${heightPt}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="translate(4,112) scale(1)">
<title>%0</title>
<polygon fill="#ffffff" stroke="transparent" points="-4,4 -4,-112 58,-112 58,4 -4,4"/>
<!-- a -->
<g id="node1" class="node">
<title>a</title>
<ellipse fill="none" stroke="#000000" cx="27" cy="-90" rx="27" ry="18"/>
<text text-anchor="middle" x="27" y="-85.8" font-family="Times,serif" font-size="14.00" fill="#000000">a</text>
</g>
<!-- b -->
<g id="node2" class="node">
<title>b</title>
<ellipse fill="none" stroke="#000000" cx="27" cy="-18" rx="27" ry="18"/>
<text text-anchor="middle" x="27" y="-13.8" font-family="Times,serif" font-size="14.00" fill="#000000">b</text>
</g>
<!-- a&#45;&gt;b -->
<g id="edge1" class="edge">
<title>a-&gt;b</title>
<path fill="none" stroke="#000000" d="M27,-71.8314C27,-64.131 27,-54.9743 27,-46.4166"/>
<polygon fill="#000000" stroke="#000000" points="30.5001,-46.4132 27,-36.4133 23.5001,-46.4133 30.5001,-46.4132"/>
</g>
</g>
</svg>`;
    const actualSvg = graph.getSvg();
    const actualSvgString = index.getSvgString();
    expect(actualSvgString).toEqual(expectedSvgString);
  });

});
