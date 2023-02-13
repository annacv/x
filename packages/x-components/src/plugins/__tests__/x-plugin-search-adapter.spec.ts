import { createLocalVue } from '@vue/test-utils';
import { VueConstructor } from 'vue';
import { XPlugin } from '../x-plugin';
import { proxyBus } from '../../__tests__/utils';

describe('testing adapter configuration', () => {
  let xPlugin: XPlugin;
  let localVue: VueConstructor;

  beforeEach(() => {
    jest.clearAllMocks();
    xPlugin = new XPlugin(proxyBus());
    localVue = createLocalVue();
  });

  it('throws an error if no adapter is passed', () => {
    expect(() => localVue.use(xPlugin, {})).toThrow();
  });
});
