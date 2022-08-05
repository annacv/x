<template>
  <ResultProvider
    :result="result"
    :variants="result.variants"
    #default="{
      result: resultAndColor,
      selectedVariant: selectedColor,
      childrenVariants: sizesVariants,
      selectVariant: selectColor
    }"
  >
    <ResultProvider
      :result="resultAndColor"
      :variants="sizesVariants"
      #default="{
        result: resultAndSize,
        selectedVariant: selectedSize,
        childrenVariants: unitsVariants,
        selectVariant: selectSize
      }"
    >
      <ResultProvider
        :result="resultAndSize"
        :variants="(selectedColor && selectedColor.variants) || undefined"
        #default="{ result, selectedVariant: selectedUnits, selectVariant: selectUnits }"
      >
        <article class="x-result" style="max-width: 300px; overflow: hidden">
          <BaseResultLink :result="result">
            <BaseResultImage :result="result" class="x-result__picture x-picture--colored">
              <template #placeholder>
                <div style="padding-top: 100%; background-color: lightgray"></div>
              </template>
              <template #fallback>
                <div
                  data-test="result-picture-fallback"
                  style="padding-top: 100%; background-color: lightsalmon"
                ></div>
              </template>
            </BaseResultImage>
          </BaseResultLink>
          <div class="x-result__description">
            <BaseResultRating :result="result" :max="5" link="#" class="x-font-size--04">
              <template #filled-icon>❤️</template>
              <template #empty-icon>🤍</template>
            </BaseResultRating>
            <BaseResultLink :result="result">
              <h1 class="x-title3" data-test="result-title">{{ result.name }}</h1>
            </BaseResultLink>
            <p>Selected color: {{ result.color }}</p>
            <p>Selected size: {{ result.size }}</p>
            <p>Price: {{ result.price.value }}</p>
            <p>Units: {{ result.units }}</p>
            <ResultSelector
              @click="selectColor"
              :selected-variant="selectedColor"
              :variants="result.variants"
              #default="{ variant }"
            >
              {{ variant.color }}
            </ResultSelector>
            <ResultSelector
              @click="selectSize"
              :selected-variant="selectedSize"
              :variants="sizesVariants"
              #default="{ variant }"
            >
              {{ variant.size }}
            </ResultSelector>
            <ResultSelector
              @click="selectUnits"
              :selected-variant="selectedUnits"
              :variants="unitsVariants"
              #default="{ variant }"
            >
              {{ variant.units }}
            </ResultSelector>
          </div>
        </article>
      </ResultProvider>
    </ResultProvider>
  </ResultProvider>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Result } from '@empathyco/x-types';
  import BaseResultImage from '../../components/result/base-result-image.vue';
  import BaseResultLink from '../../components/result/base-result-link.vue';
  import BaseResultRating from '../../components/result/base-result-rating.vue';
  import ResultProvider from '../../x-modules/search/components/result-provider.vue';
  import ResultSelector from './result-selector.vue';

  @Component({
    components: {
      ResultProvider,
      ResultSelector,
      BaseResultLink,
      BaseResultRating,
      BaseResultImage
    }
  })
  export default class ResultComponent extends Vue {
    @Prop()
    protected result!: Result;
  }
</script>

<style scoped lang="scss"></style>
