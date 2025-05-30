<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  modelValue: number
}>();

defineEmits<{
  (e: 'update:modelValue', value: number): void,
}>();

const maxValue = 4

const balanceScoreMap: Record<number, string> = {
  0: '$0-$100',
  1: '$100-$1,000',
  2: '$1,000-$10,000',
  3: '$10,000-$100,000',
  4: '$100,000+',
}

const getPercentage = (): number => {
  return (props.modelValue / maxValue) * 100;
};
</script>

<template>
  <div class="bg-card-bg border border-card-border rounded-lg p-4 mb-6">
    <div class="mb-4">
      <h3 class="text-sm text-text-secondary font-medium mb-2">余额选择器</h3>
      <p class="text-xs text-text-tertiary mb-4">
        选择您的交易所余额范围以获取相关交易建议，余额越高，每日获得的积分越多。
      </p>
    </div>

    <div class="mb-2 flex justify-between items-center">
      <span class="text-sm font-medium">等级: {{ balanceScoreMap[modelValue] }}</span>
      <span class="text-sm font-medium">{{ modelValue }} 积分/天</span>
    </div>

    <div class="relative mb-4">
      <input type="range" :min="0" :max="maxValue" :value="modelValue" :step="1"
        @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
        class="w-full appearance-none bg-transparent cursor-pointer" style="height: 12px;" />

      <div class="absolute top-[5px] left-0 right-0 h-2 bg-card-border rounded-full pointer-events-none">
        <div class="absolute top-0 left-0 h-full rounded-full bg-binance-yellow"
          :style="{ width: `${getPercentage()}%` }"></div>
      </div>


    </div>

    <div class="flex justify-between text-text-tertiary text-xs">
      <span>$0</span>
      <span>$100</span>
      <span>$1K</span>
      <span>$10K</span>
      <span>$100K+</span>
    </div>
  </div>
</template>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  height: 12px;
  background: transparent;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #F0B90B;
  cursor: pointer;
  margin-top: -7px;
  position: relative;
  z-index: 1;
}

input[type="range"]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #F0B90B;
  cursor: pointer;
  border: none;
  position: relative;
  z-index: 1;
}
</style>