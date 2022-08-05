<template>
  <div>
    <button v-for="(variant, index) in variants" :key="index" @click="$emit('click', variant)">
      <slot v-bind="{ variant }">{{ variant.color }}</slot>
    </button>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { ResultVariant } from '@empathyco/x-types';
  import { XInject } from '../../components';

  @Component
  export default class ResultSelector extends Vue {
    @Prop()
    public variants!: ResultVariant[];

    @Prop()
    public selectedVariant!: ResultVariant | null;

    @XInject('selectedVariants')
    public selectedVariants!: ResultVariant[];

    protected isSelected(variant: ResultVariant): boolean {
      return variant === this.selectedVariant;
    }
  }
</script>
