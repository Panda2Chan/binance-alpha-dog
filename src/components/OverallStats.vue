<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  totalVolume: string,
  totalPoints: string
}>();
</script>

<template>
  <div class="bg-card-bg border border-card-border rounded-lg p-4 mb-6">
    <table class="w-full">
      <tbody>
        <tr class="border-b border-card-border">
          <td class="py-3 text-sm text-text-secondary">指标</td>
          <td class="py-3 text-sm text-right">数值</td>
        </tr>
        <tr class="border-b border-card-border">
          <td class="py-3 text-sm">总交易量</td>
          <td class="py-3 text-sm text-right">{{ totalVolume }}</td>
        </tr>
        <tr>
          <td class="py-3 text-sm">总积分(仅交易量积分)</td>
          <td class="py-3 text-sm text-right font-medium text-binance-yellow">{{ totalPoints }} 积分</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>