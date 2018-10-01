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

});
