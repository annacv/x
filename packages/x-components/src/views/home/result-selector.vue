<template>
  <div>
    <button v-for="(variant, index) in getOptions" :key="index" @click="selectOption(index)">
      <slot v-bind="{ variant }">{{ variant.color }}</slot>
    </button>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Inject } from 'vue-property-decorator';
  import { Result, ResultVariant } from '@empathyco/x-types';

  @Component
  export default class ResultSelector extends Vue {
    @Prop()
    protected result!: Result;

    @Prop({
      default: 0
    })
    protected level!: number;

    @Inject('selectedIndexes')
    protected selectedIndexes!: number[];

    @Inject('setResultVariant')
    protected setResultVariant!: (level: number, selectedIndex: number) => void;

    protected isSelected(variantIndex: number): boolean {
      return this.selectedIndexes[this.level] === variantIndex;
    }

    protected selectOption(selectedIndex: number): void {
      this.setResultVariant(this.level, selectedIndex);
    }

    protected get getOptions(): ResultVariant[] {
      let currentVariants = this.result?.variants ?? [];

      for (let i = 0; i < this.level; i++) {
        currentVariants = currentVariants?.[this.selectedIndexes[i]].variants ?? [];
      }

      return currentVariants;
    }
  }
</script>
