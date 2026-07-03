import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('d3-selection', () => require('d3-selection/dist/d3-selection.js'));
jest.mock('d3-transition', () => ({
  transition: () => ({
    duration: () => ({}),
  }),
}));
jest.mock('d3-zoom', () => ({
  zoomIdentity: {
    translate: () => ({
      scale: () => ({}),
    }),
  },
  zoomTransform: () => ({ x: 0, y: 0, k: 1 }),
}));
jest.mock('d3-graphviz', () => {
  const d3Selection = require('d3-selection/dist/d3-selection.js');
  d3Selection.selection.prototype.selectWithoutDataPropagation = function (selector) {
    return this.select(selector);
  };
  d3Selection.selection.prototype.graphviz = function () {
    const node = this.node();
    let currentWidth = 0;
    let currentHeight = 0;
    const gv = {
      onerror: () => gv,
      on: () => gv,
      width: (w) => {
        currentWidth = w;
        return gv;
      },
      height: (h) => {
        currentHeight = h;
        return gv;
      },
      engine: () => gv,
      fit: () => gv,
      tweenPaths: () => gv,
      tweenShapes: () => gv,
      tweenPrecision: () => gv,
      dot: () => gv,
      transition: () => gv,
      zoomSelection: () => ({
        node: () => node,
        call: () => {},
      }),
      zoomBehavior: () => ({
        filter: () => {},
        transform: () => {},
      }),
      render: (cb) => {
        if (node && !node.querySelector('svg')) {
          const svg = node.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('width', String(currentWidth));
          svg.setAttribute('height', String(currentHeight));
          svg.setAttribute('viewBox', '0 0 600 450');
          const g = node.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('id', 'graph0');
          g.getBBox = () => ({ x: 0, y: 0, width: 100, height: 100 });
          g.getCTM = () => ({ a: 1 });
          svg.appendChild(g);
          node.appendChild(svg);
        }
        if (cb) {
          cb();
        }
        return gv;
      },
    };
    return gv;
  };
});

import Graph from './Graph.js';

describe('<Graph />', () => {
  const defaultProps = {
    hasFocus: false,
    width: 50,
    dotSrc: 'digraph { a -> b }',
    engine: 'dot',
    fit: false,
    transitionDuration: 1,
    tweenPaths: true,
    tweenShapes: true,
    tweenPrecision: '1%',
    defaultNodeAttributes: {},
    defaultEdgeAttributes: {},
    fullscreen: false,
    onFocus: jest.fn(),
    onTextChange: jest.fn(),
    onHelp: jest.fn(),
    onSelect: jest.fn(),
    onUndo: jest.fn(),
    onRedo: jest.fn(),
    onToggleFullscreen: jest.fn(),
    registerNodeShapeClick: jest.fn(),
    registerNodeShapeDragStart: jest.fn(),
    registerNodeShapeDragEnd: jest.fn(),
    registerZoomInButtonClick: jest.fn(),
    registerZoomOutButtonClick: jest.fn(),
    registerZoomOutMapButtonClick: jest.fn(),
    registerZoomResetButtonClick: jest.fn(),
    registerGetSvg: jest.fn(),
    onInitialized: jest.fn(),
    onError: jest.fn(),
    test: { disableDotParsing: true },
  };

  let clientWidth = 800;
  let clientHeight = 600;

  beforeAll(() => {
    Object.defineProperty(window.Element.prototype, 'clientWidth', {
      configurable: true,
      get: () => clientWidth,
    });
    Object.defineProperty(window.Element.prototype, 'clientHeight', {
      configurable: true,
      get: () => clientHeight,
    });
  });

  beforeEach(() => {
    clientWidth = 800;
    clientHeight = 600;
  });

  it('calls resizeSVG and updates SVG dimensions when width prop changes', () => {
    const { container, rerender } = render(<Graph {...defaultProps} width={50} />);

    // Trigger initial renderGraph via rerender so this.svg is populated
    rerender(<Graph {...defaultProps} width={50} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '800');
    expect(svg).toHaveAttribute('height', '600');

    // Change container dimensions and update width prop
    clientWidth = 1000;
    clientHeight = 800;
    rerender(<Graph {...defaultProps} width={60} />);

    expect(svg).toHaveAttribute('width', '1000');
    expect(svg).toHaveAttribute('height', '800');
    expect(svg).toHaveAttribute('viewBox', '0 0 750 600');
  });

  it('does not resize SVG when rerendered with the same width prop', () => {
    const { container, rerender } = render(<Graph {...defaultProps} width={50} />);

    // Populate this.svg on initial update
    rerender(<Graph {...defaultProps} width={50} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '800');
    expect(svg).toHaveAttribute('height', '600');

    // Change container dimensions but keep width prop unchanged
    clientWidth = 1200;
    clientHeight = 900;
    rerender(<Graph {...defaultProps} width={50} />);

    expect(svg).toHaveAttribute('width', '800');
    expect(svg).toHaveAttribute('height', '600');
  });

  it('updates SVG width and height without resetting viewBox when fit is true', () => {
    const { container, rerender } = render(
      <Graph {...defaultProps} fit={true} width={50} />
    );

    rerender(<Graph {...defaultProps} fit={true} width={50} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 600 450');

    clientWidth = 1000;
    clientHeight = 800;
    rerender(<Graph {...defaultProps} fit={true} width={70} />);

    expect(svg).toHaveAttribute('width', '1000');
    expect(svg).toHaveAttribute('height', '800');
    expect(svg).toHaveAttribute('viewBox', '0 0 600 450');
  });
});
