import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

let triggerGraphInitEnd = null;

jest.mock('d3-selection', () => require('d3-selection/dist/d3-selection.js'));
jest.mock('d3-scale-chromatic', () => ({
  schemeCategory10: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
  schemePaired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
}));
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
    const gv = {
      onerror: () => gv,
      on: (event, cb) => {
        if (event === 'initEnd') {
          triggerGraphInitEnd = cb;
        }
        return gv;
      },
      width: () => gv,
      height: () => gv,
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

import Index from './index.js';
import polyfillElement from '../test-utils/polyfillElement.js';
import polyfillSVGElement from '../test-utils/polyfillSVGElement.js';
import polyfillXMLSerializer from '../test-utils/polyfillXMLSerializer.js';
import packageJSON from '../../package.json';

describe('<Index /> vertical separator', () => {
  beforeAll(() => {
    polyfillElement({
      clientWidth: 500,
      clientHeight: 400,
    });
    polyfillSVGElement();
    polyfillXMLSerializer();
  });

  beforeEach(() => {
    triggerGraphInitEnd = null;
    localStorage.clear();
    localStorage.setItem('holdOff', 0);
    localStorage.setItem('version', packageJSON.version);
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
  });

  it('renders the vertical separator with default 50/50 split', () => {
    const { container } = render(<Index />);
    const separator = container.querySelector('#layout-separator');
    expect(separator).toBeInTheDocument();

    const gridItems = container.querySelectorAll('.MuiGrid-item');
    expect(gridItems).toHaveLength(2);
    expect(gridItems[0]).toHaveStyle({ width: '50%', maxWidth: '50%', flexBasis: '50%' });
    expect(gridItems[1]).toHaveStyle({ width: '50%', maxWidth: '50%', flexBasis: '50%' });
  });

  it('initializes split width from localStorage if available', () => {
    localStorage.setItem('leftWidthPercent', '35');
    const { container } = render(<Index />);
    const gridItems = container.querySelectorAll('.MuiGrid-item');
    expect(gridItems[0]).toHaveStyle({ width: '35%', maxWidth: '35%', flexBasis: '35%' });
    expect(gridItems[1]).toHaveStyle({ width: '65%', maxWidth: '65%', flexBasis: '65%' });
  });

  it('highlights the separator on hover and unhighlights on mouse leave', () => {
    const { container } = render(<Index />);
    const separator = container.querySelector('#layout-separator');
    const indicator = separator.firstElementChild;

    expect(indicator).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.12)' });

    fireEvent.mouseEnter(separator);
    expect(indicator).toHaveStyle({ backgroundColor: '#1976d2' });

    fireEvent.mouseLeave(separator);
    expect(indicator).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.12)' });
  });

  it('resizes panes when dragging the separator left and right with the mouse', () => {
    const { container } = render(<Index />);
    const separator = container.querySelector('#layout-separator');
    const gridItems = container.querySelectorAll('.MuiGrid-item');

    fireEvent.mouseDown(separator);
    expect(document.body.style.cursor).toBe('col-resize');
    expect(document.body.style.userSelect).toBe('none');

    // Drag left to 30% (300px of 1000px window)
    fireEvent.mouseMove(document, { clientX: 300 });
    expect(gridItems[0]).toHaveStyle({ width: '30%', maxWidth: '30%', flexBasis: '30%' });
    expect(gridItems[1]).toHaveStyle({ width: '70%', maxWidth: '70%', flexBasis: '70%' });
    expect(localStorage.getItem('leftWidthPercent')).toBe('30');

    // Drag right to 70% (700px of 1000px window)
    fireEvent.mouseMove(document, { clientX: 700 });
    expect(gridItems[0]).toHaveStyle({ width: '70%', maxWidth: '70%', flexBasis: '70%' });
    expect(gridItems[1]).toHaveStyle({ width: '30%', maxWidth: '30%', flexBasis: '30%' });
    expect(localStorage.getItem('leftWidthPercent')).toBe('70');

    fireEvent.mouseUp(document);
    expect(document.body.style.cursor).toBe('');
    expect(document.body.style.userSelect).toBe('');
  });

  it('clamps the split width between 15% and 85% during mouse drag', () => {
    const { container } = render(<Index />);
    const separator = container.querySelector('#layout-separator');
    const gridItems = container.querySelectorAll('.MuiGrid-item');

    fireEvent.mouseDown(separator);

    // Drag past minimum (< 15%)
    fireEvent.mouseMove(document, { clientX: 50 });
    expect(gridItems[0]).toHaveStyle({ width: '15%', maxWidth: '15%', flexBasis: '15%' });
    expect(gridItems[1]).toHaveStyle({ width: '85%', maxWidth: '85%', flexBasis: '85%' });

    // Drag past maximum (> 85%)
    fireEvent.mouseMove(document, { clientX: 950 });
    expect(gridItems[0]).toHaveStyle({ width: '85%', maxWidth: '85%', flexBasis: '85%' });
    expect(gridItems[1]).toHaveStyle({ width: '15%', maxWidth: '15%', flexBasis: '15%' });

    fireEvent.mouseUp(document);
  });

  it('resizes panes and clamps bounds when dragging via touch events', () => {
    const { container } = render(<Index />);
    const separator = container.querySelector('#layout-separator');
    const gridItems = container.querySelectorAll('.MuiGrid-item');

    // Ignore multi-touch start
    fireEvent.touchStart(separator, { touches: [{ clientX: 500 }, { clientX: 600 }] });
    expect(document.body.style.userSelect).toBe('');

    // Single-touch start
    fireEvent.touchStart(separator, { touches: [{ clientX: 500 }] });
    expect(document.body.style.userSelect).toBe('none');

    // Touch move to 40%
    fireEvent.touchMove(document, { touches: [{ clientX: 400 }] });
    expect(gridItems[0]).toHaveStyle({ width: '40%', maxWidth: '40%', flexBasis: '40%' });
    expect(gridItems[1]).toHaveStyle({ width: '60%', maxWidth: '60%', flexBasis: '60%' });

    // Touch move past minimum (< 15%)
    fireEvent.touchMove(document, { touches: [{ clientX: 20 }] });
    expect(gridItems[0]).toHaveStyle({ width: '15%', maxWidth: '15%', flexBasis: '15%' });
    expect(gridItems[1]).toHaveStyle({ width: '85%', maxWidth: '85%', flexBasis: '85%' });

    // Touch move past maximum (> 85%)
    fireEvent.touchMove(document, { touches: [{ clientX: 980 }] });
    expect(gridItems[0]).toHaveStyle({ width: '85%', maxWidth: '85%', flexBasis: '85%' });
    expect(gridItems[1]).toHaveStyle({ width: '15%', maxWidth: '15%', flexBasis: '15%' });

    fireEvent.touchEnd(document);
    expect(document.body.style.userSelect).toBe('');
  });

  it('splits the left width equally between editor and insert panels when insert panels are open', () => {
    localStorage.setItem('insertPanelsAreOpen', 'true');
    localStorage.setItem('leftWidthPercent', '60');
    const { container } = render(<Index />);

    act(() => {
      if (triggerGraphInitEnd) {
        triggerGraphInitEnd();
      }
    });

    const topGridContainer = container.querySelector('.MuiGrid-container');
    const gridItems = Array.from(topGridContainer.children).filter((el) =>
      el.classList.contains('MuiGrid-item')
    );
    expect(gridItems).toHaveLength(3);
    expect(gridItems[0]).toHaveStyle({ width: '30%', maxWidth: '30%', flexBasis: '30%' });
    expect(gridItems[1]).toHaveStyle({ width: '30%', maxWidth: '30%', flexBasis: '30%' });
    expect(gridItems[2]).toHaveStyle({ width: '40%', maxWidth: '40%', flexBasis: '40%' });
  });

  it('hides the separator and expands graph to 100% in fullscreen mode', () => {
    const { container } = render(<Index />);
    const fullscreenButton = container.querySelector('#fullscreen');

    expect(container.querySelector('#layout-separator')).toBeInTheDocument();

    fireEvent.click(fullscreenButton);

    expect(container.querySelector('#layout-separator')).not.toBeInTheDocument();
    const gridItems = container.querySelectorAll('.MuiGrid-item');
    expect(gridItems[0]).toHaveStyle({ display: 'none', width: '0%' });
    expect(gridItems[1]).toHaveStyle({ width: '100%', maxWidth: '100%', flexBasis: '100%' });
  });

  it('cleans up document event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = render(<Index />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
