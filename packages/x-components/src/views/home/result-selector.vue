<template>
  <div>
    <BaseEventButton
      v-for="(variant, index) in getOptions"
      :key="index"
      @click="selectOption(index, variant)"
      :events="events"
    >
      <slot v-bind="{ variant }">{{ variant.color }}</slot>
    </BaseEventButton>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Inject } from 'vue-property-decorator';
  import { Result, ResultVariant } from '@empathyco/x-types';
  import BaseEventButton from '../../components/base-event-button.vue';
  import { SearchXEvents } from '../../x-modules/search/events.types';
  @Component({
    components: { BaseEventButton }
  })
  export default class ResultSelector extends Vue {
    @Prop()
    protected result!: Result;

    @Prop({
      default: 0
    })
    protected level!: number;

    @Inject('selectedIndexes')
    protected selectedIndexes!: (number | undefined)[];

    @Inject('setResultVariant')
    protected setResultVariant!: (
      level: number,
      selectedIndex: number,
      variant: ResultVariant
    ) => void;

    protected isSelected(variantIndex: number): boolean {
      return this.selectedIndexes[this.level] === variantIndex;
    }

    protected selectOption(selectedIndex: number, variant: ResultVariant): void {
      this.setResultVariant(this.level, selectedIndex, variant);
    }

    protected get getOptions(): ResultVariant[] {
      let currentVariants = this.result?.variants ?? [];

      for (let i = 0; i < this.level; i++) {
        const index = this.selectedIndexes[i] ?? 0;
        currentVariants = currentVariants?.[index]?.variants ?? [];
      }

      return currentVariants;
    }

    protected get events(): Partial<SearchXEvents> {
      return {}; // WIP
    }
  }
</script>
