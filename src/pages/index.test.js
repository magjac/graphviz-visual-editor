import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import Index from './index';
import polyfillElement from '../test-utils/polyfillElement';
import polyfillSVGElement from '../test-utils/polyfillSVGElement';
import polyfillXMLSerializer from '../test-utils/polyfillXMLSerializer';
import polyfillFetch from '../test-utils/polyfillFetch';

describe('<Index />', () => {

  const divProperties = {
    clientWidth: 2 * 4 * 4 / 3,
    clientHeight: 2 * 112 * 4 / 3,
  };
  polyfillElement(divProperties);
  polyfillSVGElement();
  polyfillXMLSerializer();
  polyfillFetch();

  let mount;

  beforeEach(() => {
    localStorage.setItem('holdOff', 0);
    mount = createMount();
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('mounts', (done) => {
    const wrapper = mount(<Index />);
    const graph = wrapper.find('Graph').instance();
    const graphviz = graph.graphviz;
    graphviz.on('initEnd', () => {
      done();
    });
  });

  it('state has default DOT source after mount', (done) => {
    const wrapper = mount(<Index />);
    const indexWrapper = wrapper.find('Index');
    const index = indexWrapper.instance();
    const graph = wrapper.find('Graph').instance();
    const graphviz = graph.graphviz;
    graphviz.on('initEnd', () => {
      const expectedDotSrc = 'strict digraph {\n    a [shape="ellipse" style="filled" fillcolor="#1f77b4"]\n    b [shape="polygon" style="filled" fillcolor="#ff7f0e"]\n    a -> b [fillcolor="#a6cee3" color="#1f78b4"]\n}';
      const actualDotSrc = index.state.dotSrc;
      expect(actualDotSrc).toEqual(expectedDotSrc);
      done();
    });
  });

  it('receives updated DOT source', (done) => {
    const wrapper = mount(<Index />);
    const indexWrapper = wrapper.find('Index');
    const index = indexWrapper.instance();
    const expectedDotSrc = 'digraph {a -> b}';
    const graph = wrapper.find('Graph').instance();
    const graphviz = graph.graphviz;
    graphviz.on('initEnd', () => {
      index.setState({dotSrc: expectedDotSrc});
      const actualDotSrc = index.state.dotSrc;
      expect(actualDotSrc).toEqual(expectedDotSrc);
      done();
    });
  });

  it('renders updated SVG after receiving updated DOT source', (done) => {
    const wrapper = mount(<Index />);
    const indexWrapper = wrapper.find('Index');
    const index = indexWrapper.instance();
    const expectedDotSrc = 'digraph {a -> b}';
    const graph = wrapper.find('Graph').instance();
    const graphviz = graph.graphviz;
    graphviz.on('initEnd', () => {
      index.setState({dotSrc: expectedDotSrc});
      const width = divProperties.clientWidth;
      const height = divProperties.clientHeight;
      const widthPt = width * 3 / 4;
      const heightPt = height * 3 / 4;
      const expectedSvgString = `<svg width="${width}" height="${height}" viewBox="0 0 ${widthPt} ${heightPt}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="translate(4,112) scale(1)">
<polygon fill="white" stroke="transparent" points="-4,4 -4,-112 58,-112 58,4 -4,4"/>
<!-- a -->
<g id="node1" class="node">
<title>a</title>
<ellipse fill="none" stroke="black" cx="27" cy="-90" rx="27" ry="18"/>
<text text-anchor="middle" x="27" y="-85.8" font-family="Times,serif" font-size="14.00">a</text>
</g>
<!-- b -->
<g id="node2" class="node">
<title>b</title>
<ellipse fill="none" stroke="black" cx="27" cy="-18" rx="27" ry="18"/>
<text text-anchor="middle" x="27" y="-13.8" font-family="Times,serif" font-size="14.00">b</text>
</g>
<!-- a&#45;&gt;b -->
<g id="edge1" class="edge">
<title>a-&gt;b</title>
<path fill="none" stroke="black" d="M27,-71.7C27,-63.98 27,-54.71 27,-46.11"/>
<polygon fill="black" stroke="black" points="30.5,-46.1 27,-36.1 23.5,-46.1 30.5,-46.1"/>
</g>
</g>
</svg>`;
      const actualSvg = graph.getSvg();
      const actualSvgString = index.getSvgString();
      expect(actualSvgString).toEqual(expectedSvgString);
      done();
    });
  });

  it('transitions rendered SVG after receiving updated DOT source', (done) => {
    const wrapper = mount(<Index />);
    const indexWrapper = wrapper.find('Index');
    const index = indexWrapper.instance();
    const graph = wrapper.find('Graph').instance();
    const graphviz = graph.graphviz;
    graphviz.fade(false); // FIXME: remove when style="opacity: 1" is removed by d3-graphviz
    graphviz.on('initEnd', () => {
      const width = divProperties.clientWidth;
      const height = divProperties.clientHeight;
      const widthPt = width * 3 / 4;
      const heightPt = height * 3 / 4;
      const expectedSvgString = `<svg width="${width}" height="${height}" viewBox="0 0 ${widthPt} ${heightPt}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="translate(4,112) scale(1)">
<polygon fill="white" stroke="transparent" points="-4,4 -4,-112 58,-112 58,4 -4,4"/>
<!-- a -->
<g id="node1" class="node">
<title>a</title>
<ellipse fill="none" stroke="black" cx="27" cy="-90" rx="27" ry="18"/>
<text text-anchor="middle" x="27" y="-85.8" font-family="Times,serif" font-size="14.00">a</text>
</g>
<!-- b -->
<g id="node2" class="node">
<title>b</title>
<ellipse fill="none" stroke="black" cx="27" cy="-18" rx="27" ry="18"/>
<text text-anchor="middle" x="27" y="-13.8" font-family="Times,serif" font-size="14.00">b</text>
</g>
<!-- a&#45;&gt;b -->
<g id="edge1" class="edge">
<title>a-&gt;b</title>
<path fill="none" stroke="black" d="M27,-71.7C27,-63.98 27,-54.71 27,-46.11"/>
<polygon fill="black" stroke="black" points="30.5,-46.1 27,-36.1 23.5,-46.1 30.5,-46.1"/>
</g>
</g>
</svg>`;
      const dotSrc = 'digraph {a -> b}';
      index.setState({
        dotSrc: dotSrc,
        transitionDuration: 0,
      });
      const actualSvg = graph.getSvg();
      const actualSvgString = index.getSvgString();
      expect(actualSvgString).toEqual(expectedSvgString);
      const dotSrc2 = 'digraph {a -> c}';
      index.setState({dotSrc: dotSrc2});
      graphviz.on('end', () => {
        const actualSvg = graph.getSvg();
        const actualSvgString = index.getSvgString();
        const expectedSvgString2 = `<svg width="${width}" height="${height}" viewBox="0 0 ${widthPt} ${heightPt}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="translate(4,112) scale(1)">
<polygon fill="white" stroke="transparent" points="-4,4 -4,-112 58,-112 58,4 -4,4"/>
<!-- a -->
<g id="node1" class="node">
<title>a</title>
<ellipse fill="none" stroke="black" cx="27" cy="-90" rx="27" ry="18"/>
<text text-anchor="middle" x="27" y="-85.8" font-family="Times,serif" font-size="14.00">a</text>
</g>
<!-- b -->
<g id="node2" class="node">
<title>c</title>
<ellipse fill="none" stroke="rgb(0, 0, 0)" cx="27" cy="-18" rx="27" ry="18"/>
<text text-anchor="middle" x="27" y="-13.8" font-family="Times,serif" font-size="14.00">c</text>
</g>
<!-- a&#45;&gt;b -->
<g id="edge1" class="edge">
<title>a-&gt;c</title>
<path fill="none" stroke="black" d="M27,-71.7C27,-63.98 27,-54.71 27,-46.11"/>
<polygon fill="black" stroke="black" points="30.5,-46.1 27,-36.1 23.5,-46.1 30.5,-46.1"/>
</g>
</g>
</svg>`;
        expect(actualSvgString).toEqual(expectedSvgString2);
        done();
      });
    });
  });

  it('selects all nodes and edges', (done) => {
    const wrapper = mount(<Index />);
    const indexWrapper = wrapper.find('Index');
    const index = indexWrapper.instance();
    const graph = wrapper.find('Graph').instance();
    const graphviz = graph.graphviz;
    graphviz.on('initEnd', () => {
      const expectedDotSrc = 'digraph {a [shape=box]; b [shape=circle]; a -> b}';
      index.setState({dotSrc: expectedDotSrc});
      const graphviz = graph.graphviz;
      const actualSvgString = index.getSvgString();
      let selectionMarkers = graph.graph0.selectAll('rect').nodes();
      expect(selectionMarkers).toHaveLength(0);
      graph.selectAllComponents();
      selectionMarkers = graph.graph0.selectAll('rect').nodes();
      expect(selectionMarkers).toHaveLength(3);
      done();
    });
  });

});
