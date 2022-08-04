export interface HomeControls {
  searchInput: {
    instant: boolean;
    instantDebounceInMs: number;
  };
  popularSearches: {
    maxItemsToRender: number;
  };
  slicedFilters: {
    max: number;
  };
  historyQueries: {
    maxItemsToRender: number;
  };
}

declare module '@empathyco/x-types' {
  export interface Result {
    color?: string;
    size?: string;
  }
}
