<script lang="ts">
  import Vue, { CreateElement, VNode } from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { Result, ResultVariant } from '@empathyco/x-types';
  import { xComponentMixin, XInject, XProvide } from '../../../components';
  import { searchXModule } from '../x-module';

  @Component({
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class ResultProvider extends Vue {
    @Prop({ required: true })
    public result!: Result;

    @Prop({ default: () => [] })
    public variants!: ResultVariant[];

    @Prop({ default: false })
    public autoSelectFirstVariant!: boolean;

    @XInject('parentVariant', null as any)
    public parentVariant!: ResultVariant | null;

    @XProvide('parentVariant')
    public selectedVariant: ResultVariant | null = null;

    protected get resultAndVariant(): Result {
      if (!this.selectedVariant) {
        return this.result;
      }
      const { variants, ...selectedVariant } = this.selectedVariant;
      return { ...this.result, ...selectedVariant };
    }

    selectVariant(variant: ResultVariant): void {
      this.selectedVariant = variant;
    }

    @Watch('parentVariant', { immediate: true })
    resetSelectedVariant(): void {
      this.selectedVariant =
        this.autoSelectFirstVariant && this.variants.length >= 1 ? this.variants[0] : null;
    }

    render(h: CreateElement): VNode {
      return (
        this.$scopedSlots.default?.({
          result: this.resultAndVariant,
          selectedVariant: this.selectedVariant,
          childrenVariants: this.selectedVariant?.variants ?? [],
          // eslint-disable-next-line @typescript-eslint/unbound-method
          selectVariant: this.selectVariant
        })?.[0] ?? h()
      );
    }
  }
</script>
