import { mount } from 'cypress/vue2';
import Vue from 'vue';
import { e2eAdapter } from '../../src/adapter/e2e-adapter';
import SearchInput from '../../src/x-modules/search-box/components/search-input.vue';
import { searchBoxXModule } from '../../src/x-modules/search-box';
import { installNewXPlugin } from '../../src/__tests__/utils';

/**
 * Renders an {@link SearchInput} component with the provided options.
 *
 * @returns Helper methods for the rendered {@link SearchInput}.
 */
function mountSearchInput(): MountSearchInputAPI {
  const [xPlugin] = installNewXPlugin({ adapter: e2eAdapter, initialXModules: [searchBoxXModule] });
  mount(
    {
      components: {
        SearchInput
      },
      template: `
        <SearchInput />
      `
    },
    {
      vue: Vue.extend({}),
      plugins: [[xPlugin]]
    }
  );

  return {
    getSearchInput() {
      return cy.getByDataTest('search-input');
    }
  };
}

describe('testing search input', () => {
  it('ignores invalid typed characters', () => {
    const { getSearchInput } = mountSearchInput();
    getSearchInput().type('le<g>o >star>').invoke('val').should('equal', 'lego star');
  });
});

interface MountSearchInputAPI {
  /** Mounts search input api. */
  getSearchInput: () => Cypress.Chainable<JQuery>;
}
