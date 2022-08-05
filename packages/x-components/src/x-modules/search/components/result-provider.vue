<script lang="ts">
  import Vue, { CreateElement, VNode } from 'vue';
  import { Component, Prop, Provide, Watch } from 'vue-property-decorator';
  import { Result, ResultVariant } from '@empathyco/x-types';
  import { xComponentMixin } from '../../../components';
  import { searchXModule } from '../x-module';

  const extractSelectedVariantsFields = (
    variants: ResultVariant[] = [],
    selectedIndexes: (number | undefined)[] = [],
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
    protected selectedIndexes: (number | undefined)[] = [];

    @Provide('setResultVariant')
    setResultVariant(level: number, selectedIndex: number, variant: ResultVariant): void {
      Vue.set(this.selectedIndexes, level, selectedIndex);

      // Reset next levels to default selection (undefined)
      for (let i = level + 1; i < this.levels; i++) {
        Vue.set(this.selectedIndexes, i, undefined);
      }

      this.$x.emit('UserSelectedAResultVariant', { result: this.providedResult, variant, level });
    }

    @Watch('result')
    resetSelection(): void {
      // Reset all levels to default selection (undefined)
      for (let i = 0; i < this.levels; i++) {
        Vue.set(this.selectedIndexes, i, undefined);
      }
    }

    protected get providedResult(): Result {
      const fields = extractSelectedVariantsFields(
        this.result.variants,
        this.selectedIndexes,
        this.levels
      );

      return Object.assign({}, this.result, fields, { variants: this.result.variants });
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
