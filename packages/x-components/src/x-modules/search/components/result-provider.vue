<script lang="ts">
  import Vue, { CreateElement, VNode } from 'vue';
  import { Component, Prop, Provide } from 'vue-property-decorator';
  import { Result, ResultVariant } from '@empathyco/x-types';
  import { xComponentMixin, XOn } from '../../../components';
  import { searchXModule } from '../x-module';

  const flatVariantsFields = (
    variants: ResultVariant[] = [],
    selectedIndexes: number[] = [],
    levels: number
  ): ResultVariant => {
    if (variants.length === 0) {
      return {};
    }

    let currentVariants: ResultVariant[] = variants;
    const flattenedObject = {};

    for (let i = 0; i < levels; i++) {
      const currentIndex = selectedIndexes[i] ?? 0;
      const currentVariant = currentVariants[currentIndex] ?? {};
      currentVariants = currentVariant.variants ?? [];
      Object.assign(flattenedObject, currentVariant);
    }

    return flattenedObject;
  };

  @Component({
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class ResultProvider extends Vue {
    @Prop()
    public result!: Result;

    // TODO: calculate levels dynamically
    protected levels = 3;

    @Provide('selectedIndexes')
    protected selectedIndexes: number[] = [0, 0, 0]; // TODO: change initialization

    @Provide('setResultVariant')
    setResultVariant(level: number, selectedIndex: number): void {
      Vue.set(this.selectedIndexes, level, selectedIndex);

      // Reset next levels to default selection (0)
      for (let i = level + 1; i < this.levels; i++) {
        Vue.set(this.selectedIndexes, i, 0);
      }
    }

    // TODO: If we can have variants with id's we don't need this
    @XOn('SearchRequestUpdated')
    resetSelection(): void {
      // Reset next levels to default selection (0)
      for (let i = 0; i < this.levels; i++) {
        Vue.set(this.selectedIndexes, i, 0);
      }
    }

    // TODO watch providedResult to emit global event
    protected get providedResult(): Result {
      const { selected, ...fields } = flatVariantsFields(
        this.result.variants,
        this.selectedIndexes,
        this.levels
      );

      return Object.assign({}, this.result, { ...fields }, { variants: this.result.variants });
    }

    render(h: CreateElement): VNode {
      return (
        this.$scopedSlots.default?.({
          result: this.providedResult
        })?.[0] ?? h()
      );
    }
  }
</script>
