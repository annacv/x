import { installNewXPlugin } from '../../__tests__/utils';

describe('testing adapter configuration', () => {
  it('throws an error if no adapter is passed', () => {
    expect(() => {
      installNewXPlugin({ adapter: undefined });
    }).toThrow();
  });
});
