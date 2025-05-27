<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  transactionCount: string,
  pointsCount: string,
  amount: string,
  points: string
}>();
</script>

<template>
  <div>
    <h3 class="text-sm text-text-secondary font-medium mb-4">
      今日统计
      <span class="block text-xs mt-1">
        北京时间: 08:00 - 08:00 (UTC: 00:00 - 23:59)
      </span>
    </h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-card-bg border border-card-border rounded-lg p-4">
        <h4 class="text-sm text-text-secondary mb-2">今日交易量</h4>
        <p class="text-2xl font-bold mb-2">{{ amount }}</p>
        <p class="text-xs text-text-tertiary">
          还差{{ transactionCount }}笔 +{{ pointsCount }}积分
        </p>
      </div>
      
      <div class="bg-card-bg border border-card-border rounded-lg p-4">
        <h4 class="text-sm text-text-secondary mb-2">今日预计积分</h4>
        <p class="text-2xl font-bold text-binance-yellow mb-2">{{ points }} 积分</p>
        <p class="text-xs text-text-tertiary">
          交易量积分 + 余额积分
        </p>
      </div>
    </div>
  </div>
</template>